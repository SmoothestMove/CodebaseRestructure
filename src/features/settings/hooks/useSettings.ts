
import React, { useState, useEffect, useCallback, useContext, createContext, ReactNode } from 'react';
import { AppSettings } from '@/types';
import * as settingsService from '@/features/settings/services/settingsService';

/**
 * @interface SettingsContextType
 * @property {AppSettings} settings - The application settings.
 * @property {boolean} isLoading - Whether the settings are loading.
 * @property {function(Partial<AppSettings>): void} updateSettings - A function to update the settings.
 * @property {function(): void} refreshSettings - A function to refresh the settings.
 */
interface SettingsContextType {
  settings: AppSettings;
  isLoading: boolean;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  refreshSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

/**
 * The provider for the settings context.
 * @param {object} props - The props for the component.
 * @param {ReactNode} props.children - The children to render.
 * @returns {JSX.Element} The rendered SettingsProvider component.
 */
export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(settingsService.getSettings());
  const [isLoading, setIsLoading] = useState(true);

  const refreshSettings = useCallback(() => {
    setIsLoading(true);
    const currentSettings = settingsService.getSettings();
    setSettings(currentSettings);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings };
    settingsService.saveSettings(updated);
    setSettings(updated); 
  }, [settings]);

  const value = { settings, isLoading, updateSettings, refreshSettings };

  return React.createElement(SettingsContext.Provider, { value: value }, children);
};

/**
 * A hook to use the settings context.
 * @returns {SettingsContextType} The settings context.
 */
export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
