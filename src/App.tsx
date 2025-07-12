
import React, { useEffect, useState, useCallback } from 'react';
import { Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import ScanPage from './pages/ScanPage';
import BoxDetailsPage from './pages/BoxDetailsPage';
import BoxesListPage from './pages/BoxesListPage';
import ManageOwnersPage from './pages/ManageOwnersPage';
import ManageSpacesPage from './pages/ManageSpacesPage';
import TruckLoadPage from './pages/TruckLoadPage';
import SettingsPage from './pages/SettingsPage';
import AuthPage from './pages/AuthPage';
import ProtectedRoute from './components/ProtectedRoute';
import { BoxesProvider } from './hooks/useBoxes';
import { OwnersProvider } from './hooks/useOwners';
import { SettingsProvider } from './hooks/useSettings';
import { useAuth } from './context/AuthContext';
import { MoveProvider } from './contexts/MoveContext';
import AddOwnerModal from './components/AddOwnerModal';

const MainAppLayout: React.FC = () => {
  const { moveId, loading: authLoading, currentUser } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);
  const [showOwnerModal, setShowOwnerModal] = useState(false);
  const [newUserFullName, setNewUserFullName] = useState('');
  const navigate = useNavigate();


  // Handle new user flow and initialization
  useEffect(() => {
    if (!authLoading && currentUser) {
      const timer = setTimeout(() => {
        // Check for new user flag in sessionStorage (set during registration)
        const isNewUser = sessionStorage.getItem('isNewUser') === 'true';
        const fullName = sessionStorage.getItem('userFullName') || '';
        
        if (isNewUser && fullName) {
          setNewUserFullName(fullName);
          setShowOwnerModal(true);
          // Clear the flags after reading
          sessionStorage.removeItem('isNewUser');
          sessionStorage.removeItem('userFullName');
        }
        
        setIsInitialized(true);
      }, 500);
      return () => clearTimeout(timer);
    } else if (!authLoading && !currentUser) {
      console.warn('No user available after auth loaded');
      setIsInitialized(true);
    }
  }, [authLoading, currentUser, navigate]);

  const handleOwnerAdded = useCallback(() => {
    setShowOwnerModal(false);
    // Owner added successfully, could show a toast notification here
  }, []);

  // Show loading state while initializing
  if (authLoading || !isInitialized) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
        {/* --- Mobile Bottom Navigation Bar (Fixed) --- */}
        <div className="md:hidden h-16"></div> {/* Spacer for fixed bottom nav */}
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary dark:border-brand-accent mx-auto mb-4"></div>
          <p className="text-slate-700 dark:text-slate-300">Loading your move...</p>
        </div>
      </div>
    );
  }

  return (
    <MoveProvider moveId={moveId || null}>
      <BoxesProvider>
        <OwnersProvider>
          <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
            <Navbar />
            <div className="md:pl-64 flex flex-col min-h-screen">
              <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-8 pb-24 md:pb-8">
                <Outlet />
              </main>
            </div>
            
            {/* Add Owner Modal for New Users */}
            <AddOwnerModal
              isOpen={showOwnerModal}
              onClose={() => setShowOwnerModal(false)}
              onOwnerAdded={handleOwnerAdded}
              initialFirstName={newUserFullName.split(' ')[0]}
              initialLastName={newUserFullName.split(' ').slice(1).join(' ')}
            />
          </div>
        </OwnersProvider>
      </BoxesProvider>
    </MoveProvider>
  );
};

const App: React.FC = () => {
  return (
    <SettingsProvider>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={<AuthPage />} />
        <Route path="/app" element={
          <ProtectedRoute />
        }>
          <Route element={<MainAppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="scan" element={<ScanPage />} />
            <Route path="boxes" element={<BoxesListPage />} />
            <Route path="box/:boxId" element={<BoxDetailsPage />} />
            <Route path="owners" element={<ManageOwnersPage />} />
            <Route path="spaces" element={<ManageSpacesPage />} />
            <Route path="truck-load" element={<TruckLoadPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/app" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SettingsProvider>
  );
};

export default App;