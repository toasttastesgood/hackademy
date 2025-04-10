import React from 'react'; // Removed useState import
// useTheme import removed, now handled in AppearanceSettings
// useQuiz import removed, now handled in DataValidationSettings
// Card import removed (only used within sub-components now)
// buttonStyles import removed (only used within sub-components now)
import styles from './SettingsPage.module.css';
import AppearanceSettings from './AppearanceSettings'; // Import the new component
import DataValidationSettings from './DataValidationSettings'; // Import the new component
import QuizSettings from './QuizSettings'; // Import the new quiz settings component
const SettingsPage: React.FC = () => {
  // Use the new context structure
  // Theme context usage moved to AppearanceSettings
  // Quiz context usage, showConfirm state, and handleReset moved to DataValidationSettings

  // Theme button helper functions moved to AppearanceSettings

  return (
    <div className={styles.settingsPage}>
      <AppearanceSettings />

      <DataValidationSettings />

      <QuizSettings />
    </div>
  );
};

export default SettingsPage;
