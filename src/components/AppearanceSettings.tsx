import React from 'react';
import { useSettings, ThemeName, ColorMode } from '../contexts/SettingsContext'; // Import useSettings and types
import Card from './Card/Card';
import buttonStyles from './Button/Button.module.css';
import styles from './SettingsPage.module.css'; // Reuse styles for now

/**
 * Component for managing appearance settings, including base theme and color mode selection.
 * Uses the ThemeContext to get and set theme preferences.
 */
const AppearanceSettings: React.FC = () => {
  const { settings, setTheme, setMode } = useSettings(); // Use the new hook

  // Helper function to generate base theme button props
  const getBaseThemeButtonProps = (buttonTheme: ThemeName) => ({
    className: `${buttonStyles.btn} ${buttonStyles.outline} ${styles.themeOption} ${settings.theme === buttonTheme ? styles.active : ''}`, // Use settings.theme and correct button style
    onClick: () => setTheme(buttonTheme), // Use setTheme from useSettings
    disabled: settings.theme === buttonTheme,
  });

  // Helper function to generate color mode button props
  const getColorModeButtonProps = (buttonMode: ColorMode) => ({
      className: `${buttonStyles.btn} ${buttonStyles.outline} ${styles.themeOption} ${settings.mode === buttonMode ? styles.active : ''}`, // Use settings.mode and correct button style
      onClick: () => setMode(buttonMode), // Use setMode from useSettings
      disabled: settings.mode === buttonMode,
  });

  return (
    <Card className={styles.settingsSection}>
      <h3>Appearance</h3>
      {/* Base Theme Selection */}
      <div className={styles.settingItem}>
        <span>Base Theme</span>
        <div className={styles.themeOptions}>
          <button {...getBaseThemeButtonProps('material')}>
            <span className={`${styles.themePreview} ${styles.previewMaterial}`}></span>
            Material
          </button>
          <button {...getBaseThemeButtonProps('glass')}>
            <span className={`${styles.themePreview} ${styles.previewGlass}`}></span>
            Glass
          </button>
          <button {...getBaseThemeButtonProps('neumorphic')}>
            <span className={`${styles.themePreview} ${styles.previewNeumorphic}`}></span>
            Neumorphic
          </button>
        </div>
      </div>
      {/* Color Mode Selection */}
      <div className={styles.settingItem}>
        <span>Color Mode</span>
        <div className={styles.themeOptions}>
           <button {...getColorModeButtonProps('light')}>
             <span className={`${styles.themePreview} ${styles.previewLight}`}></span>
             Light
           </button>
           <button {...getColorModeButtonProps('dark')}>
             <span className={`${styles.themePreview} ${styles.previewDark}`}></span>
             Dark
           </button>
        </div>
      </div>
    </Card>
  );
};

export default AppearanceSettings;