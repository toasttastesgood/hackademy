import React from 'react';
import { useTheme, BaseTheme, ColorMode } from '../contexts/ThemeContext';
import Card from './Card/Card';
import buttonStyles from './Button/Button.module.css';
import styles from './SettingsPage.module.css'; // Reuse styles for now

/**
 * Component for managing appearance settings, including base theme and color mode selection.
 * Uses the ThemeContext to get and set theme preferences.
 */
const AppearanceSettings: React.FC = () => {
  const { baseTheme, setBaseTheme, colorMode, setColorMode } = useTheme();

  // Helper function to generate base theme button props
  const getBaseThemeButtonProps = (buttonTheme: BaseTheme) => ({
    className: `${buttonStyles.btn} ${buttonStyles.btnOutline} ${styles.themeOption} ${baseTheme === buttonTheme ? styles.active : ''}`,
    onClick: () => setBaseTheme(buttonTheme),
    disabled: baseTheme === buttonTheme,
  });

  // Helper function to generate color mode button props
  const getColorModeButtonProps = (buttonMode: ColorMode) => ({
      className: `${buttonStyles.btn} ${buttonStyles.btnOutline} ${styles.themeOption} ${colorMode === buttonMode ? styles.active : ''}`,
      onClick: () => setColorMode(buttonMode),
      disabled: colorMode === buttonMode,
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