import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/AuthContext';

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