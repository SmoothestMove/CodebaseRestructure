import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '@/main';
import { getSettings, saveSettings } from '@/features/settings/services/settingsService';

/**
 * @interface AuthContextType
 * @description Defines the shape of the authentication context.
 */
interface AuthContextType {
  /** The authenticated user object, or null if not authenticated. */
  user: User | null;
  /** The authenticated user object, or null if not authenticated. */
  currentUser: User | null;
  /** Whether the authentication status is currently being loaded. */
  loading: boolean;
  /** The path to redirect to after a successful login. */
  redirectPath: string | null;
  /** A function to set the redirect path. */
  setRedirectPath: (path: string | null) => void;
  /** The ID of the current move. */
  moveId: string | null;
  /** A function to set the current move ID. */
  setMoveId: (id: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * A component that provides authentication context to its children.
 * @param {object} props - The properties for the AuthProvider component.
 * @param {ReactNode} props.children - The child components to be rendered within the provider.
 * @returns {JSX.Element} The rendered AuthProvider component.
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);
  const [moveId, setMoveIdState] = useState<string | null>(() => getSettings().currentMoveId || null);
  const navigate = useNavigate();

  // Handle redirect after auth state changes
  useEffect(() => {
    if (!loading && user && redirectPath) {
      navigate(redirectPath);
      setRedirectPath(null); // Clear the redirect path after navigation
    }
  }, [loading, user, redirectPath, navigate]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (!user) {
        setMoveId(null);
      }
      setLoading(false);
    });

    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, []);

  const setMoveId = (newMoveId: string | null) => {
    const currentSettings = getSettings();
    saveSettings({ ...currentSettings, currentMoveId: newMoveId || undefined });
    setMoveIdState(newMoveId);
  };

  const contextValue = {
    user,
    currentUser: user,
    loading,
    redirectPath,
    setRedirectPath,
    moveId,
    setMoveId,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * A custom hook that provides access to the authentication context.
 * @returns {AuthContextType} The authentication context.
 * @throws {Error} If used outside of an AuthProvider.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
