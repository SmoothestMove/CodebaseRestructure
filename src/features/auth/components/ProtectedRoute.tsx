import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/AuthContext';

/**
 * A component that protects routes from unauthenticated users.
 * It redirects unauthenticated users to the login page and displays a loading
 * indicator while checking the user's authentication status.
 * @returns {JSX.Element} The rendered ProtectedRoute component.
 */
const ProtectedRoute: React.FC = () => {
  const { user, loading, setRedirectPath } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Store the current path for redirecting back after login
    if (!loading && !user && location.pathname !== '/') {
      setRedirectPath(location.pathname);
    }
  }, [loading, user, location.pathname, setRedirectPath]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;