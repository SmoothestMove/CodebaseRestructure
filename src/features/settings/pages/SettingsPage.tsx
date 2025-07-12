import React, { useState, useEffect } from 'react';
import { useSettings } from '@/features/settings/hooks/useSettings';
import { useBoxes } from '@/features/boxes/hooks/useBoxes';
import { useOwners } from '@/features/owners/hooks/useOwners';
import { useTheme } from '@/hooks/useTheme'; 
import { getMoveById } from '@/features/settings/services/moveService';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Modal from '@/components/common/Modal';
import Alert from '@/components/common/Alert';
import { IconSettings, IconTrash } from '@/lib/config/constants';
import { PREDEFINED_COMMUNAL_ROOMS } from '@/lib/config/constants';
import { FaFileExport, FaExclamationTriangle, FaMoon, FaSun, FaShareAlt, FaCopy, FaSpinner } from 'react-icons/fa'; 

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

  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isClearDataModalOpen, setIsClearDataModalOpen] = useState(false);
  const [clearDataConfirmationText, setClearDataConfirmationText] = useState('');
  const [appMetadata, setAppMetadata] = useState<AppMetadata | null>(null);
  const [moveCode, setMoveCode] = useState<string | null>(null);
  const [isLoadingMoveCode, setIsLoadingMoveCode] = useState(true);

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

  const handleClearAllData = async () => {
    if (clearDataConfirmationText.toUpperCase() !== 'DELETE') {
      return;
    }

    try {
      // Clear all data from local storage
      localStorage.clear();
      sessionStorage.clear();

      // Clear all data from IndexedDB
      const databases = await window.indexedDB.databases();
      for (const dbInfo of databases) {
        if (dbInfo.name) {
          window.indexedDB.deleteDatabase(dbInfo.name);
        }
      }

      // Clear all caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }

      // Refresh the page to ensure clean state
      window.location.reload();
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
      </section>

      <section className="bg-white dark:bg-slate-800 shadow-xl rounded-xl p-6 border-2 border-red-500/30">
        <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-4 border-b border-red-500/30 pb-3 flex items-center">
          <FaExclamationTriangle className="w-6 h-6 mr-2" />
          DANGER ZONE
        </h2>
        <div className="space-y-4">
          <div>
            <Button 
              onClick={() => setIsClearDataModalOpen(true)} 
              variant="danger" 
              leftIcon={<IconTrash />}
              className="w-full sm:w-auto"
            >
              Clear All Application Data
            </Button>
            <p className="text-sm text-red-600/90 dark:text-red-400/90 mt-2">
              Warning: This action is irreversible and will permanently delete all boxes, owners, and settings.
            </p>
          </div>
        </div>
      </section>

      <Modal
        isOpen={isClearDataModalOpen}
        onClose={() => setIsClearDataModalOpen(false)}
        title="Confirm Clear All Data"
        size="md"
        footer={
            <div className="w-full flex justify-end space-x-3">
                <Button variant="secondary" onClick={() => setIsClearDataModalOpen(false)}>Cancel</Button>
                <Button 
                    variant="danger" 
                    onClick={handleClearAllData}
                    disabled={clearDataConfirmationText.toUpperCase() !== 'DELETE'}
                >
                    Yes, Clear All Data
                </Button>
            </div>
        }
      >
        <div className="space-y-4">
            <Alert 
                type="error" 
                message="This action is permanent and cannot be undone. All your tracked boxes, owner profiles (excluding predefined communal rooms), custom spaces, and settings will be deleted." 
            />
            <p className="text-brand-secondary dark:text-slate-300">
                To confirm, please type "<strong className="text-red-600 dark:text-red-400">DELETE</strong>" in the box below.
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