import React, { useState, useEffect } from 'react';
import { useSettings } from '@/features/settings/hooks/useSettings';
import { useBoxes } from '@/features/boxes/hooks/useBoxes';
import { useOwners } from '@/features/owners/hooks/useOwners';
import { useTheme } from '@/hooks/useTheme'; 
import { useMove } from '@/features/settings/hooks/MoveContext';
import { getMoveById } from '@/features/settings/services/moveService';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Modal from '@/components/common/Modal';
import Alert from '@/components/common/Alert';
import { IconSettings, IconTrash } from '@/lib/config/constants';
import { PREDEFINED_COMMUNAL_ROOMS } from '@/lib/config/constants';
import { FaFileExport, FaExclamationTriangle, FaMoon, FaSun, FaShareAlt, FaCopy, FaSpinner, FaCalendarAlt, FaTable, FaUndo, FaBomb } from 'react-icons/fa';
import { 
  resetMoveToDefault, 
  clearAllApplicationData, 
  validateResetPermissions
} from '../services/dataResetService';
import { useAuth } from '@/features/auth/hooks/AuthContext'; 

interface AppMetadata {
  name: string;
  description: string;
  version?: string; 
}

const SettingsPage: React.FC = () => {
  const { settings, updateSettings, isLoading: isLoadingSettings } = useSettings();
  const { boxes } = useBoxes();
  const { owners } = useOwners();
  const { theme, toggleTheme, isDarkMode } = useTheme();
  const { move, updateMove } = useMove();
  const { user } = useAuth(); 

  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isClearDataModalOpen, setIsClearDataModalOpen] = useState(false);
  const [clearDataConfirmationText, setClearDataConfirmationText] = useState('');
  const [appMetadata, setAppMetadata] = useState<AppMetadata | null>(null);
  const [moveCode, setMoveCode] = useState<string | null>(null);
  const [isLoadingMoveCode, setIsLoadingMoveCode] = useState(true);
  const [moveDateInput, setMoveDateInput] = useState<string>('');
  
  // Enhanced reset functionality state
  const [isResetMoveModalOpen, setIsResetMoveModalOpen] = useState(false);
  const [resetConfirmationText, setResetConfirmationText] = useState('');
  const [resetInProgress, setResetInProgress] = useState(false);

  // Set default batch print count to 9 on initial load if not set
  useEffect(() => {
    if (settings.defaultBatchPrintCount !== 9) {
      updateSettings({ defaultBatchPrintCount: 9 });
    }
  }, [settings.defaultBatchPrintCount, updateSettings]);

  useEffect(() => {
    fetch('/metadata.json')
      .then(response => response.json())
      .then((data: AppMetadata) => {
        if (!data.version && data.description) {
          const versionMatch = data.description.match(/V\s*(\d+\.\d+(\.\d+)?)/i);
          if (versionMatch) {
            data.version = versionMatch[1];
          }
        }
        setAppMetadata(data);
      })
      .catch(error => console.error("Error fetching app metadata:", error));
  }, []);

  useEffect(() => {
    const fetchMoveCode = async () => {
      if (settings.currentMoveId) {
        try {
          setIsLoadingMoveCode(true);
          const move = await getMoveById(settings.currentMoveId);
          setMoveCode(move?.moveCode || null);
        } catch (error) {
          console.error('Error fetching move code:', error);
          setMoveCode(null);
        } finally {
          setIsLoadingMoveCode(false);
        }
      } else {
        setMoveCode(null);
        setIsLoadingMoveCode(false);
      }
    };

    fetchMoveCode();
  }, [settings.currentMoveId]);

  // Initialize move date input when move data loads
  useEffect(() => {
    if (move?.moveDate) {
      // Handle both Date objects and Firebase Timestamps
      const moveDate = move.moveDate as any;
      const date = moveDate instanceof Date 
        ? moveDate 
        : moveDate.toDate ? moveDate.toDate() 
        : new Date(moveDate);
      
      // Format date for input field (YYYY-MM-DD)
      const dateString = date.toISOString().split('T')[0];
      setMoveDateInput(dateString);
    } else {
      setMoveDateInput('');
    }
  }, [move?.moveDate]);

  const handleExportData = () => {
    const personalOwners = owners.filter(owner => 
        !PREDEFINED_COMMUNAL_ROOMS.some(pc => pc.uid === owner.uid) && 
        owner.lastName !== '(Custom Space)'
    );
    const customSpaces = owners.filter(owner => owner.lastName === '(Custom Space)');

    const dataToExport = {
      appName: appMetadata?.name || "Smooth Moves Data",
      exportDate: new Date().toISOString(),
      themePreference: theme,
      currentMoveId: settings.currentMoveId, // Include currentMoveId
      boxes: boxes,
      personalOwners: personalOwners,
      customSpaces: customSpaces,
      settings: settings, // Includes defaultPrintCount and currentMoveId
    };
    const jsonString = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smooth-moves-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setFeedbackMessage({ type: 'success', message: 'Data exported successfully!' });
  };

  const handleExportToSpreadsheet = () => {
    // Create CSV data with specified headers
    const headers = ['Owner', 'BoxID', 'Box name', 'Contents', 'Status', 'Location', 'Destination', 'truck zone and position'];
    
    // Map boxes to CSV rows
    const csvRows = boxes.map(box => {
      // Find owner name
      const owner = owners.find(o => o.uid === box.ownerUid);
      const ownerName = owner ? `${owner.firstName} ${owner.lastName}` : 'Unknown';
      
      // Combine truck zone and position
      const truckInfo = box.truckZone && box.truckVerticalPosition 
        ? `${box.truckZone} - ${box.truckVerticalPosition}`
        : box.truckZone || '';

      return [
        ownerName,
        box.id,
        box.name || '',
        box.contents || '',
        box.currentStatus,
        box.currentLocation || '',
        box.destinationRoom || '',
        truckInfo
      ];
    });

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...csvRows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-manifest-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setFeedbackMessage({ type: 'success', message: 'Inventory spreadsheet exported successfully!' });
  };

  // Enhanced reset move to default state
  const handleResetMoveToDefault = async () => {
    if (resetConfirmationText.toUpperCase() !== 'RESET') {
      return;
    }

    if (!move || !user) {
      setFeedbackMessage({
        type: 'error',
        message: 'No active move or user found.'
      });
      return;
    }

    // Validate permissions
    const validation = validateResetPermissions(move, user.uid);
    if (!validation.canReset) {
      setFeedbackMessage({
        type: 'error',
        message: validation.reason || 'You do not have permission to reset this move.'
      });
      return;
    }

    setResetInProgress(true);

    try {
      const result = await resetMoveToDefault(move.id, user.uid, {
        resetFirebaseData: true,
        resetLocalStorageData: true,
        resetCaches: true,
        preserveMove: true
      });

      if (result.success) {
        setFeedbackMessage({
          type: 'success',
          message: result.message
        });
        
        // Small delay before reload to show success message
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setFeedbackMessage({
          type: 'error',
          message: result.message
        });
      }
    } catch (error) {
      console.error('Error resetting move data:', error);
      setFeedbackMessage({
        type: 'error',
        message: 'Failed to reset move data. Please try again.'
      });
    } finally {
      setResetInProgress(false);
      setIsResetMoveModalOpen(false);
      setResetConfirmationText('');
    }
  };

  // Legacy clear all data function (nuclear option)
  const handleClearAllData = async () => {
    if (clearDataConfirmationText.toUpperCase() !== 'DELETE') {
      return;
    }

    try {
      const result = await clearAllApplicationData();
      
      if (result.success) {
        // Refresh the page to ensure clean state
        window.location.reload();
      } else {
        setFeedbackMessage({
          type: 'error',
          message: result.message
        });
      }
    } catch (error) {
      console.error('Error clearing application data:', error);
      setFeedbackMessage({
        type: 'error',
        message: 'Failed to clear all data. Please try again.'
      });
    } finally {
      setIsClearDataModalOpen(false);
      setClearDataConfirmationText('');
    }
  };

  const handleCopyMoveId = () => {
    if (moveCode) {
        navigator.clipboard.writeText(moveCode)
            .then(() => {
                setFeedbackMessage({ type: 'success', message: 'Move code copied to clipboard!' });
            })
            .catch(err => {
                console.error('Failed to copy move code: ', err);
                setFeedbackMessage({ type: 'error', message: 'Failed to copy move code.' });
            });
    }
  };

  const handleMoveDateUpdate = async () => {
    if (!move) {
      setFeedbackMessage({ type: 'error', message: 'No move found to update.' });
      return;
    }

    try {
      const moveDate = moveDateInput ? new Date(moveDateInput) : undefined;
      await updateMove({ moveDate });
      setFeedbackMessage({ 
        type: 'success', 
        message: moveDate 
          ? `Move date set to ${moveDate.toLocaleDateString()}` 
          : 'Move date cleared successfully!' 
      });
    } catch (error) {
      console.error('Error updating move date:', error);
      setFeedbackMessage({ type: 'error', message: 'Failed to update move date.' });
    }
  };

  useEffect(() => {
    if(feedbackMessage) {
        const timer = setTimeout(() => setFeedbackMessage(null), 5000);
        return () => clearTimeout(timer);
    }
  }, [feedbackMessage]);

  if (isLoadingSettings) {
    return <p className="text-center text-brand-secondary dark:text-slate-400 py-8">Loading settings...</p>;
  }

  return (
    <div className="space-y-10">
      <header className="bg-white dark:bg-slate-800 shadow-xl rounded-xl p-6 flex items-center space-x-3">
        <IconSettings className="w-8 h-8 text-brand-tertiary dark:text-orange-400" />
        <h1 className="text-3xl font-bold text-brand-primary dark:text-slate-100">Application Settings</h1>
      </header>

      {feedbackMessage && (
        <Alert 
          type={feedbackMessage.type} 
          message={feedbackMessage.message} 
          onClose={() => setFeedbackMessage(null)} 
          duration={feedbackMessage.type === 'success' ? 4000 : 6000}
        />
      )}
      
      <section className="bg-white dark:bg-slate-800 shadow-xl rounded-xl p-6">
        <h2 className="text-2xl font-semibold text-brand-primary dark:text-slate-100 mb-4 border-b dark:border-slate-700 pb-3 flex items-center">
          <FaShareAlt className="w-6 h-6 mr-3 text-brand-tertiary dark:text-orange-400" />
          Current Move Information
        </h2>
        {settings.currentMoveId ? (
          <div className="space-y-3">
            <p className="text-brand-secondary dark:text-slate-300">
              This is the unique ID for your current move. Share this ID with others (in a future update) to allow them to join and collaborate on this move.
            </p>
            <div className="flex items-center space-x-3 bg-slate-100 dark:bg-slate-700 p-3 rounded-lg shadow-sm">
              <span className="font-mono text-lg text-brand-primary-dark dark:text-slate-100 flex-grow break-all flex items-center">
                {isLoadingMoveCode ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Loading...
                  </>
                ) : moveCode ? (
                  moveCode
                ) : (
                  'No move code available'
                )}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopyMoveId}
                title="Copy Move Code"
                className="text-brand-tertiary dark:text-orange-400 hover:text-brand-tertiary-dark dark:hover:text-orange-300 focus:ring-brand-tertiary/50 dark:focus:ring-orange-400/50"
                aria-label="Copy Move ID to clipboard"
              >
                <FaCopy className="w-5 h-5" />
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-brand-secondary dark:text-slate-400">
            No active Move ID found. Please start a new move or join an existing one via the authentication page.
          </p>
        )}
      </section>

      <section className="bg-white dark:bg-slate-800 shadow-xl rounded-xl p-6">
        <h2 className="text-2xl font-semibold text-brand-primary dark:text-slate-100 mb-4 border-b dark:border-slate-700 pb-3 flex items-center">
          <FaCalendarAlt className="w-6 h-6 mr-3 text-brand-tertiary dark:text-orange-400" />
          Move Date & Timeline
        </h2>
        <div className="space-y-4">
          <p className="text-brand-secondary dark:text-slate-300">
            Set your official move date to enable timeline planning in the Move Planner. This date helps calculate when to complete tasks relative to your moving day.
          </p>
          
          <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-4 space-y-3 sm:space-y-0">
            <div className="flex-1 max-w-md">
              <label htmlFor="moveDate" className="block text-sm font-medium text-brand-secondary dark:text-slate-300 mb-2">
                Move Date
              </label>
              <Input
                id="moveDate"
                type="date"
                value={moveDateInput}
                onChange={(e) => setMoveDateInput(e.target.value)}
                className="w-full"
                placeholder="Select your move date"
              />
            </div>
            
            <div className="flex space-x-2">
              <Button 
                onClick={handleMoveDateUpdate}
                variant="primary"
                className="whitespace-nowrap"
              >
                {moveDateInput ? 'Update Date' : 'Clear Date'}
              </Button>
              {moveDateInput && (
                <Button 
                  onClick={() => setMoveDateInput('')}
                  variant="secondary"
                  className="whitespace-nowrap"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
          
          {move?.moveDate && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-700 dark:text-green-300">
                <strong>Current Move Date:</strong> {(() => {
                  // Handle both Date objects and Firebase Timestamps
                  const moveDate = move.moveDate as any;
                  const date = moveDate instanceof Date 
                    ? moveDate 
                    : moveDate.toDate ? moveDate.toDate() 
                    : new Date(moveDate);
                  
                  return date.toLocaleDateString('en-US', { 
                    weekday: 'long',
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  });
                })()}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                The Move Planner will use this date to calculate task timelines and deadlines.
              </p>
            </div>
          )}
          
          {!move?.moveDate && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                <strong>No move date set.</strong> Set a move date to enable timeline planning features in the Move Planner.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="bg-white dark:bg-slate-800 shadow-xl rounded-xl p-6">
        <h2 className="text-2xl font-semibold text-brand-primary dark:text-slate-100 mb-4 border-b dark:border-slate-700 pb-3">Appearance</h2>
        <div className="space-y-4 max-w-md">
          <div className="flex items-center justify-between">
            <label htmlFor="darkModeToggle" className="block text-sm font-medium text-brand-secondary dark:text-slate-300">
              Dark Mode
            </label>
            <button
              id="darkModeToggle"
              onClick={toggleTheme}
              className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 ${
                isDarkMode ? 'bg-orange-500 focus:ring-orange-400' : 'bg-slate-300 focus:ring-brand-secondary'
              }`}
              role="switch"
              aria-checked={isDarkMode}
            >
              <span className="sr-only">Toggle Dark Mode</span>
              <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out ${
                  isDarkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
              <span className="absolute left-1.5 top-1/2 -translate-y-1/2">
                {isDarkMode ? <FaMoon className="w-3 h-3 text-slate-100" /> : <FaSun className="w-3 h-3 text-yellow-500" />}
              </span>
            </button>
          </div>
           <p className="text-xs text-brand-secondary/80 dark:text-slate-400 -mt-2">
              Currently: {isDarkMode ? 'Dark Theme' : 'Light Theme'}
            </p>
        </div>
      </section>

      <section className="bg-white dark:bg-slate-800 shadow-xl rounded-xl p-6">
        <h2 className="text-2xl font-semibold text-brand-primary dark:text-slate-100 mb-4 border-b dark:border-slate-700 pb-3">Data Management</h2>
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0">
              <Button 
                onClick={handleExportToSpreadsheet} 
                variant="primary" 
                leftIcon={<FaTable />}
                className="text-white dark:text-white"
              >
                Export to Spreadsheet
              </Button>
              <p className="text-sm text-brand-secondary/80 dark:text-slate-400">
                Download inventory manifest as CSV for physical tracking.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0">
              <Button 
                onClick={handleExportData} 
                variant="secondary" 
                leftIcon={<FaFileExport />}
                className="text-white dark:text-white hover:bg-brand-tertiary/90 dark:hover:bg-orange-600"
              >
                Export All Data (JSON)
              </Button>
              <p className="text-sm text-brand-secondary/80 dark:text-slate-400">
                Download all boxes, personal owners, custom spaces, and settings.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-slate-800 shadow-xl rounded-xl p-6 border-2 border-red-500/30">
        <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-4 border-b border-red-500/30 pb-3 flex items-center">
          <FaExclamationTriangle className="w-6 h-6 mr-2" />
          DANGER ZONE
        </h2>
        <div className="space-y-6">
          {/* Reset Move to Default */}
          {move && user && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2 flex items-center">
                <FaUndo className="w-5 h-5 mr-2" />
                Reset Move to Default State
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
                Reset this move back to its original state when first created. This will delete all boxes, owners, budget data, calendar events, and planner tasks, but preserve the move structure and participants.
              </p>
              <Button 
                onClick={() => setIsResetMoveModalOpen(true)}
                variant="secondary"
                leftIcon={<FaUndo />}
                className="bg-yellow-600 hover:bg-yellow-700 text-white border-yellow-600 hover:border-yellow-700"
              >
                Reset Move Data
              </Button>
            </div>
          )}
          
          {/* Nuclear Option - Clear Everything */}
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2 flex items-center">
              <FaBomb className="w-5 h-5 mr-2" />
              Nuclear Option: Clear Everything
            </h3>
            <p className="text-sm text-red-700 dark:text-red-300 mb-3">
              Completely wipe all application data including moves, settings, and preferences. This will return the app to its initial state as if freshly installed.
            </p>
            <Button 
              onClick={() => setIsClearDataModalOpen(true)} 
              variant="danger" 
              leftIcon={<IconTrash />}
              className="w-full sm:w-auto"
            >
              Clear All Application Data
            </Button>
          </div>
        </div>
      </section>

      {/* Reset Move to Default Modal */}
      <Modal
        isOpen={isResetMoveModalOpen}
        onClose={() => setIsResetMoveModalOpen(false)}
        title="Reset Move to Default State"
        size="md"
        footer={
          <div className="w-full flex justify-end space-x-3">
            <Button 
              variant="secondary" 
              onClick={() => setIsResetMoveModalOpen(false)}
              disabled={resetInProgress}
            >
              Cancel
            </Button>
            <Button 
              variant="secondary"
              onClick={handleResetMoveToDefault}
              disabled={resetConfirmationText.toUpperCase() !== 'RESET' || resetInProgress}
              className="bg-yellow-600 hover:bg-yellow-700 text-white border-yellow-600 hover:border-yellow-700"
              leftIcon={resetInProgress ? <FaSpinner className="animate-spin" /> : <FaUndo />}
            >
              {resetInProgress ? 'Resetting...' : 'Reset Move Data'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Alert 
            type="warning" 
            message="This will reset your move back to its original state when first created. All boxes, owners, budget data, calendar events, and planner tasks will be deleted, but the move structure and participants will be preserved."
          />
          
          {move && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">What will be reset:</h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 list-disc list-inside space-y-1">
                <li>All boxes and tracking data</li>
                <li>Personal owners and custom spaces (communal rooms will be restored)</li>
                <li>Budget expenses and categories</li>
                <li>Calendar events</li>
                <li>Planner tasks and timelines</li>
                <li>Move date (if set)</li>
              </ul>
            </div>
          )}
          
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">What will be preserved:</h4>
            <ul className="text-sm text-green-700 dark:text-green-300 list-disc list-inside space-y-1">
              <li>Move code and structure</li>
              <li>All participants and permissions</li>
              <li>Creation date and basic move information</li>
            </ul>
          </div>
          
          <p className="text-brand-secondary dark:text-slate-300">
            To confirm, please type "<strong className="text-yellow-600 dark:text-yellow-400">RESET</strong>" in the box below.
          </p>
          <Input
            id="resetConfirmText"
            value={resetConfirmationText}
            onChange={(e) => setResetConfirmationText(e.target.value)}
            placeholder='Type RESET here'
            autoFocus
            disabled={resetInProgress}
          />
        </div>
      </Modal>

      {/* Nuclear Clear All Data Modal */}
      <Modal
        isOpen={isClearDataModalOpen}
        onClose={() => setIsClearDataModalOpen(false)}
        title="Nuclear Option: Clear All Application Data"
        size="md"
        footer={
            <div className="w-full flex justify-end space-x-3">
                <Button variant="secondary" onClick={() => setIsClearDataModalOpen(false)}>Cancel</Button>
                <Button 
                    variant="danger" 
                    onClick={handleClearAllData}
                    disabled={clearDataConfirmationText.toUpperCase() !== 'DELETE'}
                >
                    Yes, Clear Everything
                </Button>
            </div>
        }
      >
        <div className="space-y-4">
            <Alert 
                type="error" 
                message="⚠️ NUCLEAR OPTION: This will completely wipe ALL application data including moves, settings, and preferences. The app will return to its initial state as if freshly installed." 
            />
            <p className="text-brand-secondary dark:text-slate-300">
                To confirm this destructive action, please type "<strong className="text-red-600 dark:text-red-400">DELETE</strong>" in the box below.
            </p>
            <Input
                id="clearDataConfirmText"
                value={clearDataConfirmationText}
                onChange={(e) => setClearDataConfirmationText(e.target.value)}
                placeholder='Type DELETE here'
                autoFocus
            />
        </div>
      </Modal>

    </div>
  );
};

export default SettingsPage;