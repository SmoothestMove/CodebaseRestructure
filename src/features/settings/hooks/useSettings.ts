
import React, { useState, useEffect, useCallback, useContext, createContext, ReactNode } from 'react';
import { AppSettings } from '../types';
import * as settingsService from '../services/settingsService';

interface SettingsContextType {
  settings: AppSettings;
  isLoading: boolean;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  refreshSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

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

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
