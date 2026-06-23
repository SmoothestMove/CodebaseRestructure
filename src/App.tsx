
import React, { useEffect, useState, useCallback } from 'react';
import { Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';
import MobileAppShell from '@/components/layout/MobileAppShell';
import BottomNavigation from '@/components/navigation/BottomNavigation';
import SidebarNavigation from '@/components/navigation/SidebarNavigation';
import DashboardPage from '@/features/settings/pages/DashboardPage';
import ScanPage from '@/features/boxes/pages/ScanPage';
import BoxDetailsPage from '@/features/boxes/pages/BoxDetailsPage';
import BoxesListPage from '@/features/boxes/pages/BoxesListPage';
import ManageOwnersPage from '@/features/owners/pages/ManageOwnersPage';
import ManageSpacesPage from '@/features/owners/pages/ManageSpacesPage';
import TruckLoadPage from '@/features/boxes/pages/TruckLoadPage';
import SettingsPage from '@/features/settings/pages/SettingsPage';
import AuthPage from '@/features/auth/pages/AuthPage';
import BudgetPage from './features/budget/pages/BudgetPage';
import MarvinPage from '@/features/marvin/pages/MarvinPage';
import CalendarPage from '@/features/calendar/pages/CalendarPage';
import PlannerPage from '@/features/planner/pages/PlannerPage';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
import { BoxesProvider } from '@/features/boxes/hooks/useBoxes';
import { OwnersProvider } from '@/features/owners/hooks/useOwners';
import { SettingsProvider } from '@/features/settings/hooks/useSettings';
import { useAuth } from '@/features/auth/hooks/AuthContext';
import { MoveProvider } from '@/features/settings/hooks/MoveContext';
import { CalendarProvider } from '@/features/calendar/hooks/useCalendar';
import AddOwnerModal from '@/features/owners/components/AddOwnerModal';

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
      <MobileAppShell>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4" />
            <p className="text-text-secondary">Loading your move...</p>
          </div>
        </div>
      </MobileAppShell>
    );
  }

  return (
    <MoveProvider moveId={moveId || null}>
      <BoxesProvider>
        <OwnersProvider>
          <CalendarProvider>
            {/* Sidebar - visible on md+ screens */}
            <SidebarNavigation />
            
            {/* Main content area - offset for sidebar on md+ */}
            <div className="md:ml-64">
              <MobileAppShell>
                {/* 
                  Mobile-first responsive padding:
                  - Base: px-4, pb-20 (mobile with bottom nav)
                  - md+: px-6, pb-6 (tablet/desktop with sidebar)
                */}
                <main className="min-h-screen px-4 md:px-6 lg:px-8 pt-4 md:pt-6 pb-20 md:pb-6">
                  <Outlet />
                </main>
              </MobileAppShell>
            </div>
            
            {/* Bottom Navigation - visible on mobile only */}
            <BottomNavigation />
            
            {/* Add Owner Modal for New Users */}
            <AddOwnerModal
              isOpen={showOwnerModal}
              onClose={() => setShowOwnerModal(false)}
              onOwnerAdded={handleOwnerAdded}
              initialFirstName={newUserFullName.split(' ')[0]}
              initialLastName={newUserFullName.split(' ').slice(1).join(' ')}
            />
          </CalendarProvider>
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
            <Route path="budget" element={<BudgetPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="marvin" element={<MarvinPage />} />
            <Route path="planner" element={<PlannerPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/app" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SettingsProvider>
  );
};

export default App;