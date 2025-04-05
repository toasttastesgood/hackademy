import React, { useState } from 'react';
import { useQuiz } from '../contexts/QuizProvider';
import Card from './Card/Card';
import buttonStyles from './Button/Button.module.css';
import styles from './SettingsPage.module.css'; // Reuse styles

/**
 * Component for managing data and validation settings.
 * Includes options for enabling/disabling quiz file validation
 * and resetting user progress (with confirmation).
 * Uses the QuizContext to interact with quiz data and settings.
 */
const DataValidationSettings: React.FC = () => {
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
    <>
      <Card className={styles.settingsSection}>
         <h3>Data & Validation</h3>
         <div className={styles.settingItem}>
           <span>Validate Quiz Files</span>
           <label className={styles.switch}>
             <input
               type="checkbox"
               checked={validateQuizzesEnabled}
               onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValidateQuizzesEnabled(e.target.checked)}
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
    </>
  );
};

export default DataValidationSettings;