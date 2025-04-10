import React, { useState, useEffect } from 'react';
import Card from './Card/Card';
import styles from './SettingsPage.module.css'; // Reuse styles for consistency
import Switch from 'react-switch';

const QUIZ_QUESTIONS_COUNT_KEY = 'quizQuestionsCount';
const QUIZ_SHUFFLE_ENABLED_KEY = 'quizShuffleEnabled';
const QUIZ_INSTANT_FEEDBACK_ENABLED_KEY = 'quizInstantFeedbackEnabled';
const QUIZ_INSTANT_FEEDBACK_DELAY_KEY = 'quizInstantFeedbackDelay';
const DEFAULT_QUESTIONS_COUNT = 20;
const DEFAULT_FEEDBACK_DELAY = 3; // Default delay in seconds

const QuizSettings: React.FC = () => {
  const [questionsCount, setQuestionsCount] = useState<number>(() => {
    const storedCount = localStorage.getItem(QUIZ_QUESTIONS_COUNT_KEY);
    return storedCount ? parseInt(storedCount, 10) : DEFAULT_QUESTIONS_COUNT;
  });
  const [shuffleEnabled, setShuffleEnabled] = useState<boolean>(() => {
    const storedValue = localStorage.getItem(QUIZ_SHUFFLE_ENABLED_KEY);
    // Default to true if not set
    return storedValue !== null ? JSON.parse(storedValue) : true;
  });
  const [instantFeedbackEnabled, setInstantFeedbackEnabled] = useState<boolean>(() => {
    const storedValue = localStorage.getItem(QUIZ_INSTANT_FEEDBACK_ENABLED_KEY);
    return storedValue !== null ? JSON.parse(storedValue) : false; // Default to off
  });
  const [feedbackDelay, setFeedbackDelay] = useState<number>(() => {
    const storedValue = localStorage.getItem(QUIZ_INSTANT_FEEDBACK_DELAY_KEY);
    // Ensure stored value is valid, otherwise use default
    const parsedValue = storedValue ? parseInt(storedValue, 10) : DEFAULT_FEEDBACK_DELAY;
    return !isNaN(parsedValue) && parsedValue >= 1 ? parsedValue : DEFAULT_FEEDBACK_DELAY;
  });

  // Effect to save question count
  useEffect(() => {
    localStorage.setItem(QUIZ_QUESTIONS_COUNT_KEY, questionsCount.toString());
  }, [questionsCount]);

  // Effect to save shuffle setting
  useEffect(() => {
    localStorage.setItem(QUIZ_SHUFFLE_ENABLED_KEY, JSON.stringify(shuffleEnabled));
  }, [shuffleEnabled]);

  // Effect to save instant feedback setting
  useEffect(() => {
    localStorage.setItem(QUIZ_INSTANT_FEEDBACK_ENABLED_KEY, JSON.stringify(instantFeedbackEnabled));
  }, [instantFeedbackEnabled]);

  // Effect to save feedback delay setting
  useEffect(() => {
    localStorage.setItem(QUIZ_INSTANT_FEEDBACK_DELAY_KEY, feedbackDelay.toString());
  }, [feedbackDelay]);

  const handleCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value) && value > 0) { // Ensure positive integer
      setQuestionsCount(value);
    } else if (event.target.value === '') {
       setQuestionsCount(DEFAULT_QUESTIONS_COUNT);
    }
  };

  const handleShuffleToggle = (checked: boolean) => {
    setShuffleEnabled(checked);
  };

  const handleInstantFeedbackToggle = (checked: boolean) => {
    setInstantFeedbackEnabled(checked);
  };

  const handleDelayChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value) && value >= 1) { // Ensure positive integer >= 1
      setFeedbackDelay(value);
    } else if (event.target.value === '') {
       setFeedbackDelay(DEFAULT_FEEDBACK_DELAY);
    }
  };

  return (
    <Card className={styles.settingsCard}>
      <h2>Quiz Settings</h2>
      {/* Questions Count Setting */}
      <div className={styles.settingItem}>
        <label htmlFor="questionsCount">Questions per Quiz Session:</label>
        <input
          type="number"
          id="questionsCount"
          name="questionsCount"
          value={questionsCount}
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
          checked={shuffleEnabled}
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
          checked={instantFeedbackEnabled}
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
      {instantFeedbackEnabled && (
        <div className={styles.settingItem}>
          <label htmlFor="feedbackDelay">Feedback Delay (seconds):</label>
          <input
            type="number"
            id="feedbackDelay"
            name="feedbackDelay"
            value={feedbackDelay}
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