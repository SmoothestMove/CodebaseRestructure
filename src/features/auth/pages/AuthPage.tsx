import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Alert from '@/components/common/Alert';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup, 
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, firestore } from '../index';
import { createMove, joinMove, getUserMoves } from '@/features/settings/services/moveService';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { IconSmoothMovesLogo, IconGoogle } from '@/lib/config/constants'; 
import { FaSignInAlt, FaUserPlus, FaIdBadge, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useSettings } from '@/features/settings/hooks/useSettings';

type AuthMode = 'signin' | 'register';
type MoveMode = 'new' | 'join';

interface FormData {
  email: string;
  password: string;
  fullName: string;
  confirmPassword: string;
  moveId: string;
}

interface AuthState {
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
}

const INITIAL_FORM_DATA: FormData = {
  email: '',
  password: '',
  fullName: '',
  confirmPassword: '',
  moveId: ''
};

const INITIAL_AUTH_STATE: AuthState = {
  isLoading: false,
  error: null,
  successMessage: null
};

const AuthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AuthMode>('signin');
  const [moveMode, setMoveMode] = useState<MoveMode>('new');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [authState, setAuthState] = useState<AuthState>(INITIAL_AUTH_STATE);

  const navigate = useNavigate();
  const { setRedirectPath, setMoveId } = useAuth();
  const { updateSettings } = useSettings();

  // Helper functions
  const updateAuthState = useCallback((updates: Partial<AuthState>) => {
    setAuthState(prev => ({ ...prev, ...updates }));
  }, []);

  const updateFormData = useCallback((field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setAuthState(INITIAL_AUTH_STATE);
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const validateForm = useCallback((): string | null => {
    const { email, password, fullName, confirmPassword, moveId } = formData;

    // Move ID validation for join mode
    if (moveMode === 'join' && !moveId.trim()) {
      return 'Move ID is required to join an existing move.';
    }

    // Email validation
    if (!email.trim()) {
      return 'Email address is required.';
    }
    if (!validateEmail(email)) {
      return 'Please enter a valid email address.';
    }

    // Password validation
    if (!password) {
      return 'Password is required.';
    }

    // Registration-specific validation
    if (activeTab === 'register') {
      if (!fullName.trim()) {
        return 'Full name is required.';
      }
      if (password.length < 8) {
        return 'Password must be at least 8 characters long.';
      }
      if (password !== confirmPassword) {
        return 'Passwords do not match.';
      }
    }

    return null;
  }, [formData, moveMode, activeTab]);

  const handleMoveOperation = async (userId: string): Promise<string | null> => {
    try {
      if (moveMode === 'new') {
        const newMove = await createMove(userId);
        console.log('Created new move:', newMove.id);
        return newMove.id;
      } else if (moveMode === 'join' && formData.moveId.trim()) {
        const move = await joinMove(formData.moveId.trim(), userId);
        if (!move) {
          throw new Error('Move not found or you do not have permission to join');
        }
        console.log('Joined move:', move.id);
        return move.id;
      }
      return null;
    } catch (error: any) {
      console.error('Move operation error:', error);
      throw new Error(`Failed to ${moveMode} move: ${error.message}`);
    }
  };

  const createUserDocument = async (user: any, displayName?: string) => {
    const userDocRef = doc(firestore, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        displayName: displayName || user.displayName || '',
        photoURL: user.photoURL || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log('User document created in Firestore');
    }
  };

  const completeAuthFlow = async (user: any, actionType: string) => {
    try {
      // Check if user already has an active move
      const existingMoves = await getUserMoves(user.uid);
      let moveIdToUse: string | null = null;

      if (existingMoves.length > 0) {
        // User already has a move, use the most recent one
        moveIdToUse = existingMoves[0].id;
        console.log('Found existing move for user:', moveIdToUse);
      } else if (activeTab === 'register' || moveMode === 'new' || moveMode === 'join') {
        // Only create/join a move if this is a new user or they're explicitly trying to join a move
        moveIdToUse = await handleMoveOperation(user.uid);
      }
      
      // Update settings with move ID if we have one
      if (moveIdToUse) {
        await updateSettings({ currentMoveId: moveIdToUse });
        setMoveId(moveIdToUse);
      }

      // Show success and redirect
      updateAuthState({
        successMessage: existingMoves.length > 0 
          ? `${actionType} successful! Returning to your move...`
          : `${actionType} successful! ${moveIdToUse ? 'Creating/joining move...' : 'Redirecting to dashboard...'}`,
        isLoading: false
      });
      
      setRedirectPath('/app');
      
      // Navigate after a brief delay to show success message
      setTimeout(() => navigate('/app'), 1000);
    } catch (error: any) {
      console.error('Auth flow completion error:', error);
      updateAuthState({
        error: error.message,
        isLoading: false
      });
    }
  };

  const handleEmailAuth = async () => {
    const { email, password, fullName } = formData;
    
    try {
      if (activeTab === 'signin') {
        // Sign in existing user
        const { user } = await signInWithEmailAndPassword(auth, email, password);
        await completeAuthFlow(user, 'Sign-in');
      } else {
        // Register new user
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        
        // Update profile with display name
        await updateProfile(user, { displayName: fullName });
        
        // Create user document
        await createUserDocument(user, fullName);
        
        // Store new user info in session storage for the onboarding flow
        sessionStorage.setItem('isNewUser', 'true');
        sessionStorage.setItem('userFullName', fullName);
        
        await completeAuthFlow(user, 'Registration');
      }
    } catch (error: any) {
      console.error('Email auth error:', error);
      let errorMessage = `${activeTab === 'signin' ? 'Sign-in' : 'Registration'} failed: `;
      
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          errorMessage = 'Invalid email or password.';
          break;
        case 'auth/email-already-in-use':
          errorMessage = 'The email address is already in use by another account.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'The email address is not valid.';
          break;
        case 'auth/weak-password':
          errorMessage = 'The password is too weak.';
          break;
        default:
          errorMessage += error.message;
      }
      
      updateAuthState({ error: errorMessage, isLoading: false });
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);
      
      if (!user) {
        throw new Error('Failed to authenticate with Google');
      }

      // Create user document if it doesn't exist
      await createUserDocument(user);
      
      const actionType = activeTab === 'signin' ? 'Google Sign-in' : 'Google Sign-up';
      await completeAuthFlow(user, actionType);
    } catch (error: any) {
      console.error('Google auth error:', error);
      let errorMessage = 'Google authentication failed: ';
      
      switch (error.code) {
        case 'auth/account-exists-with-different-credential':
          errorMessage = 'An account with the same email already exists with different credentials.';
          break;
        case 'auth/popup-closed-by-user':
          errorMessage = 'Google Sign-In popup was closed.';
          break;
        default:
          errorMessage += error.message;
      }
      
      updateAuthState({ error: errorMessage, isLoading: false });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validationError = validateForm();
    if (validationError) {
      updateAuthState({ error: validationError });
      return;
    }

    // Start loading and clear previous states
    updateAuthState({ 
      isLoading: true, 
      error: null, 
      successMessage: null 
    });

    await handleEmailAuth();
  };

  const handleTabChange = (tab: AuthMode) => {
    if (authState.isLoading) { return; }
    
    setActiveTab(tab);
    resetForm();
  };

  const handleMoveModeChange = (mode: MoveMode) => {
    if (authState.isLoading) { return; }
    
    setMoveMode(mode);
    updateAuthState({ error: null });
    updateFormData('moveId', '');
  };

  const TabButton: React.FC<{
    tabName: AuthMode;
    currentTab: AuthMode;
    children: React.ReactNode;
  }> = ({ tabName, currentTab, children }) => (
    <button
      onClick={() => handleTabChange(tabName)}
      disabled={authState.isLoading}
      className={`w-1/2 py-3 text-center font-semibold border-b-2 transition-colors duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed
        ${currentTab === tabName 
          ? 'border-brand-tertiary dark:border-orange-400 text-brand-tertiary dark:text-orange-400' 
          : 'border-transparent text-brand-secondary dark:text-slate-400 hover:border-brand-tertiary/50 dark:hover:border-orange-400/50 hover:text-brand-tertiary dark:hover:text-orange-400'
        }`}
      role="tab"
      aria-selected={currentTab === tabName}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900 py-8 md:py-12 px-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 p-8 rounded-xl shadow-2xl">
        <div className="text-center mb-6">
          <div className="inline-block mb-4">
            <IconSmoothMovesLogo className="h-16 w-16 text-brand-primary dark:text-orange-400" />
          </div>
          
          <h1 className="text-3xl font-bold text-brand-primary dark:text-slate-100">
            {activeTab === 'signin' ? 'Welcome Back!' : 'Create Your Account'}
          </h1>
          <p className="text-brand-secondary dark:text-slate-300 mt-2">
            {activeTab === 'signin' 
              ? 'Sign in to access your move dashboard.' 
              : 'Join Smooth Moves for an effortless relocation.'
            }
          </p>
        </div>

        {/* Move Mode Selection */}
        <div className="mb-6">
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium text-brand-secondary dark:text-slate-300 mb-1.5">
              Move Option:
            </legend>
            <div className="flex items-center space-x-4">
              {(['new', 'join'] as MoveMode[]).map((option) => (
                <label 
                  key={option} 
                  htmlFor={`moveMode-${option}`} 
                  className="flex items-center cursor-pointer text-sm text-slate-700 dark:text-slate-200"
                >
                  <input
                    type="radio"
                    id={`moveMode-${option}`}
                    name="moveMode"
                    value={option}
                    checked={moveMode === option}
                    onChange={() => handleMoveModeChange(option)}
                    className="h-4 w-4 text-brand-tertiary dark:text-orange-400 border-slate-300 dark:border-slate-600 focus:ring-brand-tertiary dark:focus:ring-orange-400 dark:bg-slate-700"
                    disabled={authState.isLoading}
                  />
                  <span className="ml-2">
                    {option === 'new' ? 'Start a New Move' : 'Join an Existing Move'}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        {/* Move ID Input for Join Mode */}
        {moveMode === 'join' && (
          <Input
            id="moveId"
            label="Move ID"
            type="text"
            value={formData.moveId}
            onChange={(e) => updateFormData('moveId', e.target.value)}
            placeholder="Enter the unique Move ID"
            disabled={authState.isLoading}
            required
            aria-required="true"
            containerClassName="mb-6"
            leftIcon={<FaIdBadge className="text-slate-400 dark:text-slate-500"/>}
          />
        )}

        {/* Tab Navigation */}
        <div className="mb-6 flex border-b border-slate-200 dark:border-slate-700" role="tablist">
          <TabButton tabName="signin" currentTab={activeTab}>Sign In</TabButton>
          <TabButton tabName="register" currentTab={activeTab}>Register</TabButton>
        </div>

        {/* Alerts */}
        {authState.error && (
          <Alert 
            type="error" 
            message={authState.error} 
            onClose={() => updateAuthState({ error: null })} 
            className="mb-6" 
          />
        )}
        {authState.successMessage && (
          <Alert 
            type="success" 
            message={authState.successMessage} 
            onClose={() => updateAuthState({ successMessage: null })} 
            className="mb-6" 
          />
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {activeTab === 'register' && (
            <Input
              id="fullName"
              label="Full Name"
              type="text"
              value={formData.fullName}
              onChange={(e) => updateFormData('fullName', e.target.value)}
              placeholder="e.g., Alex Smith"
              disabled={authState.isLoading}
              required
              aria-required="true"
            />
          )}
          
          <Input
            id="email"
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData('email', e.target.value)}
            placeholder="you@example.com"
            disabled={authState.isLoading}
            required
            aria-required="true"
          />
          
          <div className="relative">
            <Input
              id="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => updateFormData('password', e.target.value)}
              placeholder={activeTab === 'register' ? "Min. 8 characters" : "Enter your password"}
              disabled={authState.isLoading}
              required
              aria-required="true"
              aria-describedby={activeTab === 'register' ? "password-hint" : undefined}
              className="pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-[38px] text-slate-400 hover:text-brand-tertiary dark:hover:text-orange-400 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
              disabled={authState.isLoading}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>
          
          {activeTab === 'register' && (
            <p id="password-hint" className="text-xs text-brand-secondary/80 dark:text-slate-400/80 -mt-3 mb-2">
              Must be at least 8 characters long.
            </p>
          )}
          
          {activeTab === 'signin' && (
            <div className="text-right -mt-2 mb-2">
              <Link 
                to="#" 
                onClick={(e) => { 
                  e.preventDefault(); 
                  alert("Forgot password functionality not implemented yet.");
                }}
                className="text-xs font-medium text-brand-tertiary dark:text-orange-400 hover:text-brand-tertiary-dark dark:hover:text-orange-300 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          )}
          
          {activeTab === 'register' && (
            <div className="relative">
              <Input
                id="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                placeholder="Re-type your password"
                disabled={authState.isLoading}
                required
                aria-required="true"
                className="pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-[38px] text-slate-400 hover:text-brand-tertiary dark:hover:text-orange-400 transition-colors"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={authState.isLoading}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
          )}
          
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            size="lg"
            isLoading={authState.isLoading && !authState.successMessage}
            disabled={authState.isLoading}
            leftIcon={activeTab === 'signin' ? <FaSignInAlt /> : <FaUserPlus />}
          >
            {activeTab === 'signin' ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <hr className="flex-grow border-slate-300 dark:border-slate-600" />
          <span className="mx-4 text-sm font-medium text-brand-secondary dark:text-slate-400">OR</span>
          <hr className="flex-grow border-slate-300 dark:border-slate-600" />
        </div>

        {/* Google Auth Button */}
        <Button
          variant="secondary" 
          className="w-full bg-white hover:bg-slate-50 dark:bg-slate-700 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-500 text-black dark:text-slate-200 hover:text-black dark:hover:text-slate-50"
          size="lg"
          onClick={handleGoogleAuth}
          isLoading={authState.isLoading && !authState.successMessage}
          disabled={authState.isLoading}
          leftIcon={<IconGoogle className="w-5 h-5" />}
        >
          {activeTab === 'signin' ? 'Sign in with Google' : 'Sign up with Google'}
        </Button>

        {/* Switch Auth Mode */}
        <p className="mt-8 text-center text-sm text-brand-secondary dark:text-slate-400">
          {activeTab === 'signin' ? "Don't have an account?" : "Already have an account?"}{' '}
          <button 
            onClick={() => handleTabChange(activeTab === 'signin' ? 'register' : 'signin')} 
            disabled={authState.isLoading}
            className="font-medium text-brand-tertiary dark:text-orange-400 hover:text-brand-tertiary-dark dark:hover:text-orange-300 hover:underline focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {activeTab === 'signin' ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
      
      <footer className="text-center text-xs text-brand-secondary dark:text-slate-500 mt-12">
        © {new Date().getFullYear()} Smooth Moves Inc. All rights reserved.
      </footer>
    </div>
  );
};

export default AuthPage;
