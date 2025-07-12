import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../index';
import { getSettings, saveSettings } from '../services/settingsService';

interface AuthContextType {
  user: User | null;
  currentUser: User | null;
  loading: boolean;
  redirectPath: string | null;
  setRedirectPath: (path: string | null) => void;
  moveId: string | null;
  setMoveId: (id: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};