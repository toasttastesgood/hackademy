import React, { useState } from 'react';
import { useTheme, BaseTheme, ColorMode } from '../contexts/ThemeContext'; // Import correct types
import { useQuiz } from '../contexts/QuizProvider';
import Card from './Card/Card';
import buttonStyles from './Button/Button.module.css';
import styles from './SettingsPage.module.css';

const SettingsPage: React.FC = () => {
  // Use the new context structure
  const { baseTheme, setBaseTheme, colorMode, setColorMode } = useTheme();
  const {
    validateQuizzesEnabled,
    setValidateQuizzesEnabled,
    resetProgress
  } = useQuiz();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleReset = () => {
    resetProgress();
    setShowConfirm(false);
    // Optionally add a success notification
  };

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
    <div className={styles.settingsPage}>
      {/* Appearance Section */}
      <Card className={styles.settingsSection}>
        <h3>Appearance</h3>
        <div className={styles.settingItem}>
          <span>Theme</span>
          {/* Base Theme Selection */}
          <div className={styles.settingItem}>
            <span>Base Theme</span>
            <div className={styles.themeOptions}>
              <button {...getBaseThemeButtonProps('material')}>
                Material
              </button>
              <button {...getBaseThemeButtonProps('glass')}>
                Glass
              </button>
              <button {...getBaseThemeButtonProps('neumorphic')}>
                Neumorphic
              </button>
            </div>
          </div> {/* Add missing closing div for the Appearance section's settingItem */}
          </div>
          {/* Color Mode Selection */}
          <div className={styles.settingItem}>
            <span>Color Mode</span>
            <div className={styles.themeOptions}>
               <button {...getColorModeButtonProps('light')}>
                 Light
               </button>
               <button {...getColorModeButtonProps('dark')}>
                 Dark
               </button>
            </div>
          </div>
      </Card>

      {/* Data & Validation Section */}
      <Card className={styles.settingsSection}>
         <h3>Data & Validation</h3>
         <div className={styles.settingItem}>
           <span>Validate Quiz Files</span>
           <label className={styles.switch}>
             <input
               type="checkbox"
               checked={validateQuizzesEnabled}
               onChange={(e) => setValidateQuizzesEnabled(e.target.checked)}
             />
             <span className={styles.slider}></span>
           </label>
         </div>
         <div className={styles.settingItem}>
           <span>Reset Progress</span>
           <button
             // Add btnDanger from Button module if defined, otherwise use btnPrimary/Secondary
             className={`${buttonStyles.btn} ${buttonStyles.btnPrimary} ${buttonStyles.btnDanger || ''}`}
             onClick={() => setShowConfirm(true)}
           >
             Reset All Progress
           </button>
         </div>
      </Card>

      {/* Confirmation Modal/Dialog */}
      {showConfirm && (
        // Add 'show' class to backdrop when active
        <div className={`${styles.confirmationBackdrop} ${styles.show}`}>
          <Card className={styles.confirmationDialog}>
            <h4>Confirm Reset</h4>
            <p>Are you sure you want to reset all quiz progress? This action cannot be undone.</p>
            <div className={styles.confirmationActions}>
              <button
                className={`${buttonStyles.btn} ${buttonStyles.btnOutline}`}
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                // Add btnDanger from Button module if defined
                className={`${buttonStyles.btn} ${buttonStyles.btnPrimary} ${buttonStyles.btnDanger || ''}`}
                onClick={handleReset}
              >
                Confirm Reset
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
