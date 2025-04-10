import React, { useState, useEffect } from 'react';
import buttonStyles from '../Button/Button.module.css';
import styles from '../QuizPlayer.module.css'; // Player styles for layout
import { QuestionComponentProps } from './types'; // Import shared props type

interface MultipleChoiceOptionsProps {
  correctAnswers: string[];
  wrongAnswers: string[];
  onSelect: (answer: string) => void;
  disabled?: boolean; // This now comes from QuizQuestionCard based on player logic
  selectedAnswer?: string | null; // This is the currentAnswer from player
  // Feedback props (passed down from QuestionComponentProps)
  isShowingFeedback?: boolean;
  correctAnswerValue?: QuestionComponentProps['correctAnswerValue']; // Use type from shared props
  instantFeedbackEnabled?: boolean; // Is the global setting enabled?
  isAnswerLocked?: boolean; // Is the answer permanently locked?
}

const MultipleChoiceOptions: React.FC<MultipleChoiceOptionsProps> = ({
  correctAnswers,
  wrongAnswers,
  onSelect,
  disabled = false, // Use the disabled prop passed down
  selectedAnswer = null,
  // Destructure feedback props
  isShowingFeedback = false,
  correctAnswerValue = null, // Should be string for MCQ/Highlight
  instantFeedbackEnabled = false,
  isAnswerLocked = false,
}) => {
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    // Combine and shuffle options once
    const allOptions = [...correctAnswers, ...wrongAnswers];
    setOptions(shuffleArray(allOptions));
  }, [correctAnswers, wrongAnswers]); // Only re-shuffle if answers change

  // Fisher-Yates shuffle algorithm (local helper)
  const shuffleArray = (array: any[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleSelect = (option: string) => {
    // Interaction is controlled by the disabled prop passed from QuizQuestionCard
    if (disabled) return;
    onSelect(option);
  };

  const useGridLayout = options.every(opt => opt.length < 20);

  return (
    <div className={`${styles.options} ${useGridLayout ? styles.grid : ''}`}>
      {options.map((option) => {
        let buttonClass = `${buttonStyles.btn} ${buttonStyles.btnOutline} ${buttonStyles.btnRounded}`;
        let feedbackText = '';
        const isUserSelection = selectedAnswer === option;
        // Determine if this option is the correct one (assuming single correct for MCQ)
        const isCorrectOption = correctAnswerValue === option;

        // Apply feedback styles if feedback is active OR if answer is locked
        if (isShowingFeedback || isAnswerLocked) {
          if (isUserSelection && isCorrectOption) {
            buttonClass += ` ${styles.optionSelectedCorrect}`;
            feedbackText = isShowingFeedback ? ' (Correct)' : ''; // Only show text during timer
          } else if (isUserSelection && !isCorrectOption) {
            buttonClass += ` ${styles.optionSelectedIncorrect}`;
            feedbackText = isShowingFeedback ? ' (Incorrect)' : '';
          } else if (isCorrectOption) {
            buttonClass += ` ${styles.optionCorrectUnselected}`;
            feedbackText = isShowingFeedback ? ' (Correct Answer)' : '';
          }
          // Optionally add a general class: buttonClass += ` ${styles.feedbackOption}`;
        } else if (isUserSelection) {
          // Apply normal selection style if not showing feedback and not locked
          buttonClass += ` ${buttonStyles.btnSelected}`;
        }

        return (
          <button
            key={option}
            className={buttonClass}
            onClick={() => handleSelect(option)}
            // Disable button based on the isDisabled prop passed down
            disabled={disabled}
          >
            {option} {feedbackText}
          </button>
        );
      })}
    </div>
  );
};

export default MultipleChoiceOptions;