import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useQuiz } from '../contexts/QuizProvider'; // Import useQuiz
import Card from './Card/Card';
import buttonStyles from './Button/Button.module.css'; // Import button styles
import styles from './SettingsPage.module.css'; // Create and import specific styles

const SettingsPage: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
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

  return (
    <div className={styles.settingsPage}>
      {/* Appearance Section */}
      <Card className={styles.settingsSection}>
        <h3>Appearance</h3>
        <div className={styles.settingItem}>
          <span>Theme</span>
          <div className={styles.themeOptions}>
            <button
              className={`${buttonStyles.btn} ${buttonStyles.btnOutline} ${styles.themeOption} ${!isDarkMode ? styles.active : ''}`}
              onClick={() => !isDarkMode && toggleTheme()}
              disabled={!isDarkMode} // Disable if already light
            >
              Light
            </button>
            <button
              className={`${buttonStyles.btn} ${buttonStyles.btnOutline} ${styles.themeOption} ${isDarkMode ? styles.active : ''}`}
              onClick={() => isDarkMode && toggleTheme()}
              disabled={isDarkMode} // Disable if already dark
            >
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
             className={`${buttonStyles.btn} ${buttonStyles.btnDanger}`} // Use a danger style
             onClick={() => setShowConfirm(true)}
           >
             Reset All Progress
           </button>
         </div>
      </Card>

      {/* Confirmation Modal/Dialog */}
      {showConfirm && (
        <div className={styles.confirmationBackdrop}>
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
                className={`${buttonStyles.btn} ${buttonStyles.btnDanger}`}
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
