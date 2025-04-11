import React from 'react'; // Removed useState, useEffect
import { useSettings } from '../contexts/SettingsContext'; // Import useSettings
import Card from './Card/Card';
import styles from './SettingsPage.module.css'; // Reuse styles for consistency
import Switch from 'react-switch'; // Keep Switch import

// Constants for localStorage keys and defaults removed

const QuizSettings: React.FC = () => {
  const {
    settings,
    setQuizQuestionsCount,
    setQuizShuffleEnabled,
    setQuizInstantFeedbackEnabled,
    setQuizInstantFeedbackDelay,
  } = useSettings();

  // Local state and initial loading from localStorage removed

  // useEffect hooks for saving to localStorage removed (handled by SettingsContext)

  const handleCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    // Use the setter from useSettings
    if (!isNaN(value) && value > 0) {
      setQuizQuestionsCount(value);
    } else if (event.target.value === '') {
       // Optionally reset to default if input is cleared, or just prevent invalid input
       // For now, let's just ensure it's a positive number. The context holds the default.
       // If you want reset-on-clear behavior, you'd need the default value from context or constants.
    }
  };

  const handleShuffleToggle = (checked: boolean) => {
    setQuizShuffleEnabled(checked); // Use setter from useSettings
  };

  const handleInstantFeedbackToggle = (checked: boolean) => {
    setQuizInstantFeedbackEnabled(checked); // Use setter from useSettings
  };

  const handleDelayChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    // Use the setter from useSettings
    if (!isNaN(value) && value >= 1) {
      setQuizInstantFeedbackDelay(value);
    } else if (event.target.value === '') {
       // Similar to count, handle clear behavior if desired.
    }
  };

  return (
    <Card className={styles.settingsCard}>
      <h3>Quiz Settings</h3> {/* Changed to h3 for consistency with AppearanceSettings */}
      {/* Questions Count Setting */}
      <div className={styles.settingItem}>
        <label htmlFor="questionsCount">Questions per Quiz Session:</label>
        <input
          type="number"
          id="questionsCount"
          name="questionsCount"
          value={settings.quizQuestionsCount} // Use value from settings
          onChange={handleCountChange}
          min="1"
          className={styles.inputField}
        />
        <p className={styles.settingDescription}>
          Set the number of questions to be randomly selected for each quiz attempt.
        </p>
      </div>

      {/* Shuffle Setting */}
      <div className={styles.settingItem}>
        <label htmlFor="shuffleToggle">Shuffle Questions:</label>
        <Switch
          onChange={handleShuffleToggle}
          checked={settings.quizShuffleEnabled} // Use value from settings
          id="shuffleToggle"
          onColor="#86d3ff"
          onHandleColor="#2693e6"
          handleDiameter={24}
          uncheckedIcon={false}
          checkedIcon={false}
          boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
          activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
          height={16}
          width={40}
          className={styles.reactSwitch}
        />
        <p className={styles.settingDescription}>
          Randomize the order of selected questions when starting a quiz.
        </p>
      </div>

      {/* Instant Feedback Setting */}
      <div className={styles.settingItem}>
        <label htmlFor="instantFeedbackToggle">Instant Feedback:</label>
        <Switch
          onChange={handleInstantFeedbackToggle}
          checked={settings.quizInstantFeedbackEnabled} // Use value from settings
          id="instantFeedbackToggle"
          onColor="#86d3ff"
          onHandleColor="#2693e6"
          handleDiameter={24}
          uncheckedIcon={false}
          checkedIcon={false}
          boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
          activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
          height={16}
          width={40}
          className={styles.reactSwitch}
        />
        <p className={styles.settingDescription}>
          Show correct answer immediately after submitting for a short duration.
          (Disables editing previous answers during the quiz).
        </p>
      </div>

      {/* Feedback Delay Setting (Conditional) */}
      {settings.quizInstantFeedbackEnabled && ( // Use value from settings
        <div className={styles.settingItem}>
          <label htmlFor="feedbackDelay">Feedback Delay (seconds):</label>
          <input
            type="number"
            id="feedbackDelay"
            name="feedbackDelay"
            value={settings.quizInstantFeedbackDelay} // Use value from settings
            onChange={handleDelayChange}
            min="1"
            className={styles.inputField}
          />
          <p className={styles.settingDescription}>
            How long to show the feedback before moving to the next question.
          </p>
        </div>
      )}
    </Card>
  );
};

export default QuizSettings;