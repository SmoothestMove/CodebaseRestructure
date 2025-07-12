
import { AppSettings } from '../types';
import { SETTINGS_LOCAL_STORAGE_KEY } from '../constants';

const DEFAULT_SETTINGS: AppSettings = {
  defaultBatchPrintCount: 9,
  currentMoveId: undefined, // Initialize currentMoveId
};

export function getSettings(): AppSettings {
  const settingsJson = localStorage.getItem(SETTINGS_LOCAL_STORAGE_KEY);
  if (settingsJson) {
    try {
      const storedSettings = JSON.parse(settingsJson);
      // Merge with defaults to ensure all keys are present if new settings are added
      return { ...DEFAULT_SETTINGS, ...storedSettings };
    } catch (error) {
      console.error("Error parsing settings from localStorage:", error);
      // Fallback to default settings if parsing fails
      return { ...DEFAULT_SETTINGS };
    }
  }
  return { ...DEFAULT_SETTINGS };
}

export function saveSettings(settings: AppSettings): void {
  try {
    const settingsJson = JSON.stringify(settings);
    localStorage.setItem(SETTINGS_LOCAL_STORAGE_KEY, settingsJson);
  } catch (error) {
    console.error("Error saving settings to localStorage:", error);
  }
}