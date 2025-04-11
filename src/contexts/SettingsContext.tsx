import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

// --- Constants for localStorage Keys ---
const SETTINGS_STORAGE_KEY = 'hackademyAppSettings'; // Single key for all settings

// --- Setting Types ---
export type ThemeName = 'material' | 'glass' | 'neumorphic';
export type ColorMode = 'light' | 'dark';

export interface AppSettings {
  theme: ThemeName;
  mode: ColorMode;
  quizQuestionsCount: number;
  quizShuffleEnabled: boolean;
  quizInstantFeedbackEnabled: boolean;
  quizInstantFeedbackDelay: number; // in seconds
}

// --- Default Settings ---
const DEFAULT_SETTINGS: AppSettings = {
  theme: 'material',
  mode: 'light',
  quizQuestionsCount: 20,
  quizShuffleEnabled: true,
  quizInstantFeedbackEnabled: false,
  quizInstantFeedbackDelay: 3,
};

// --- Context Props ---
interface SettingsContextProps {
  settings: AppSettings;
  setTheme: (theme: ThemeName) => void;
  setMode: (mode: ColorMode) => void;
  setQuizQuestionsCount: (count: number) => void;
  setQuizShuffleEnabled: (enabled: boolean) => void;
  setQuizInstantFeedbackEnabled: (enabled: boolean) => void;
  setQuizInstantFeedbackDelay: (delay: number) => void;
  isSettingsLoaded: boolean; // Flag to indicate if settings have been loaded
}

// --- Context Creation ---
const SettingsContext = createContext<SettingsContextProps>({
  settings: DEFAULT_SETTINGS,
  setTheme: () => {},
  setMode: () => {},
  setQuizQuestionsCount: () => {},
  setQuizShuffleEnabled: () => {},
  setQuizInstantFeedbackEnabled: () => {},
  setQuizInstantFeedbackDelay: () => {},
  isSettingsLoaded: false,
});

// --- Provider Component ---
export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isSettingsLoaded, setIsSettingsLoaded] = useState(false);

  // Load settings from localStorage on initial mount
  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings);
        // Merge with defaults to ensure all keys exist, even if new ones were added
        setSettings(prev => ({ ...prev, ...parsedSettings }));
      } else {
        // If nothing stored, save the defaults
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
      }
    } catch (error) {
      console.error("Failed to load or parse settings from localStorage:", error);
      // Use defaults and try to save them
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
    } finally {
        setIsSettingsLoaded(true); // Mark settings as loaded
    }
  }, []);

  // Helper function to update a specific setting and save to localStorage
  const updateSetting = useCallback(<K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings(prevSettings => {
      const newSettings = { ...prevSettings, [key]: value };
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
      } catch (error) {
        console.error("Failed to save settings to localStorage:", error);
      }
      return newSettings;
    });
  }, []);

  // Specific updater functions
  const setTheme = useCallback((theme: ThemeName) => updateSetting('theme', theme), [updateSetting]);
  const setMode = useCallback((mode: ColorMode) => updateSetting('mode', mode), [updateSetting]);
  const setQuizQuestionsCount = useCallback((count: number) => updateSetting('quizQuestionsCount', count), [updateSetting]);
  const setQuizShuffleEnabled = useCallback((enabled: boolean) => updateSetting('quizShuffleEnabled', enabled), [updateSetting]);
  const setQuizInstantFeedbackEnabled = useCallback((enabled: boolean) => updateSetting('quizInstantFeedbackEnabled', enabled), [updateSetting]);
  const setQuizInstantFeedbackDelay = useCallback((delay: number) => updateSetting('quizInstantFeedbackDelay', delay), [updateSetting]);

  // Update body attributes for theme/mode (previously done in ThemeProvider)
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
    document.documentElement.setAttribute('data-mode', settings.mode);
  }, [settings.theme, settings.mode]);


  const value = {
    settings,
    setTheme,
    setMode,
    setQuizQuestionsCount,
    setQuizShuffleEnabled,
    setQuizInstantFeedbackEnabled,
    setQuizInstantFeedbackDelay,
    isSettingsLoaded,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

// --- Hook for consuming context ---
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};