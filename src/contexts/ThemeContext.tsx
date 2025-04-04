import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';

// Define the possible theme names and modes
export type BaseTheme = 'material' | 'glass' | 'neumorphic'; // Renamed 'standard' to 'material'
export type ColorMode = 'light' | 'dark';

type ThemeContextType = {
  baseTheme: BaseTheme;
  setBaseTheme: (theme: BaseTheme) => void;
  colorMode: ColorMode;
  setColorMode: (mode: ColorMode) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Helper function to get the initial settings
const getInitialBaseTheme = (): BaseTheme => {
  const savedTheme = localStorage.getItem('appBaseThemeMaterial') as BaseTheme | null; // Updated storage key
  return savedTheme && ['material', 'glass', 'neumorphic'].includes(savedTheme) ? savedTheme : 'material'; // Updated check and default
};

const getInitialColorMode = (): ColorMode => {
  const savedMode = localStorage.getItem('appColorMode') as ColorMode | null;
  if (savedMode && ['light', 'dark'].includes(savedMode)) {
    return savedMode;
  }
  // Optional: Check system preference as fallback before defaulting to light
  // const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  // if (prefersDark) return 'dark';
  return 'light';
};


export const ThemeProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [baseTheme, setBaseThemeState] = useState<BaseTheme>(getInitialBaseTheme);
  const [colorMode, setColorModeState] = useState<ColorMode>(getInitialColorMode);

  // Apply the theme attributes to the root element and save preferences
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', baseTheme);
    root.setAttribute('data-mode', colorMode);
    localStorage.setItem('appBaseThemeMaterial', baseTheme); // Updated storage key
    localStorage.setItem('appColorMode', colorMode);
  }, [baseTheme, colorMode]);

  // Memoize setters
  const setBaseTheme = useCallback((newTheme: BaseTheme) => {
    setBaseThemeState(newTheme);
  }, []);

  const setColorMode = useCallback((newMode: ColorMode) => {
    setColorModeState(newMode);
  }, []);

  return (
    <ThemeContext.Provider value={{ baseTheme, setBaseTheme, colorMode, setColorMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
