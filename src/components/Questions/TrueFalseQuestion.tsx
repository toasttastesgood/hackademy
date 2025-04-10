import React from 'react';
import buttonStyles from '../Button/Button.module.css';
import styles from '../QuizPlayer.module.css'; // Player styles for layout
import { QuestionComponentProps } from './types';

export interface TrueFalseQuestionProps extends QuestionComponentProps {
  question: QuestionComponentProps['question'];
}

const TrueFalseQuestion: React.FC<TrueFalseQuestionProps> = ({
  question,
  onAnswer,
  disabled = false, // Use disabled passed from QuizQuestionCard
  currentAnswer,
  // Destructure feedback props
  isShowingFeedback = false,
  correctAnswerValue = null, // Should be 'True' or 'False'
  instantFeedbackEnabled = false,
  isAnswerLocked = false,
}) => {

  const handleSelect = (value: string) => {
    if (disabled) return; // Use the disabled prop
    onAnswer(value);
  };

  // Determine button classes based on feedback state or lock state
  let trueButtonClass = `${buttonStyles.btn} ${buttonStyles.btnOutline} ${buttonStyles.btnRounded} ${styles.trueFalseButtonTall}`;
  let falseButtonClass = `${buttonStyles.btn} ${buttonStyles.btnOutline} ${buttonStyles.btnRounded} ${styles.trueFalseButtonTall}`;
  const showFeedbackStyles = isShowingFeedback || isAnswerLocked;

  if (showFeedbackStyles) {
    const isCorrect = correctAnswerValue === currentAnswer;
    const trueIsCorrectAnswer = correctAnswerValue === 'True';

    if (currentAnswer === 'True') { // User selected True
      trueButtonClass += ` ${isCorrect ? styles.optionSelectedCorrect : styles.optionSelectedIncorrect}`;
    } else if (trueIsCorrectAnswer) { // True was correct, user didn't select it
      trueButtonClass += ` ${styles.optionCorrectUnselected}`;
    }

    if (currentAnswer === 'False') { // User selected False
      falseButtonClass += ` ${isCorrect ? styles.optionSelectedCorrect : styles.optionSelectedIncorrect}`;
    } else if (!trueIsCorrectAnswer) { // False was correct, user didn't select it
      falseButtonClass += ` ${styles.optionCorrectUnselected}`;
    }
  } else { // Not showing feedback and not locked, just show selection
    if (currentAnswer === 'True') trueButtonClass += ` ${buttonStyles.btnSelected}`;
    if (currentAnswer === 'False') falseButtonClass += ` ${buttonStyles.btnSelected}`;
  }

  return (
    <div className={styles.trueFalseOptions}>
      <button
        className={trueButtonClass}
        onClick={() => handleSelect('True')}
        // Disable button based on the isDisabled prop passed down
        disabled={disabled}
      >
        True
      </button>
      <button
        className={falseButtonClass}
        onClick={() => handleSelect('False')}
        // Disable button based on the isDisabled prop passed down
        disabled={disabled}
      >
        False
      </button>
    </div>
  );
};

export default TrueFalseQuestion;