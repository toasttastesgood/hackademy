import React, { useState, useEffect } from 'react';
import Button from '../Button/Button'; // Import the Button component
import styles from '../QuizPlayer.module.css'; // Player styles for layout and feedback
import { QuestionComponentProps } from './types'; // Import shared props type
import { shuffleArray } from '../../utils/arrayUtils'; // Import shuffleArray utility

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
  console.log('MultipleChoiceOptions render:');
  console.log('isAnswerLocked:', isAnswerLocked);
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    // Combine and shuffle options once
    const allOptions = [...correctAnswers, ...wrongAnswers];
    setOptions(shuffleArray(allOptions));
  }, [correctAnswers, wrongAnswers]); // Only re-shuffle if answers change

  // Local shuffleArray removed, imported from utils

  const handleSelect = (option: string) => {
    // Interaction is controlled by the disabled prop passed from QuizQuestionCard
    if (disabled) return;
    onSelect(option);
  };

  const useGridLayout = options.every(opt => opt.length < 20);

  return (
    <div className={`${styles.options} ${useGridLayout ? styles.grid : ''}`}>
      {options.map((option) => {
        // Base classes for the Button component
        let buttonClass = ''; // Start with empty, Button component handles base styles
        let feedbackText = '';
        const isUserSelection = selectedAnswer === option;
        // Determine feedback styles based on state
        if (isAnswerLocked) {
            // --- Persistent Feedback State (Answer Locked) ---
            const isPersistedSelection = selectedAnswer === option;
            const isPersistedCorrect = correctAnswerValue === option;

            if (isPersistedSelection && isPersistedCorrect) {
                buttonClass += ` ${styles.optionSelectedCorrect}`;
            } else if (isPersistedSelection && !isPersistedCorrect) {
                buttonClass += ` ${styles.optionSelectedIncorrect}`;
            } else if (isPersistedCorrect) {
                buttonClass += ` ${styles.optionCorrectUnselected}`;
            }
            feedbackText = '';

        } else if (isShowingFeedback) {
            // --- Timed Feedback State ---
            const isCorrectOption = correctAnswerValue === option; // Use the correctAnswerValue passed for timed feedback

            if (isUserSelection && isCorrectOption) {
                buttonClass += ` ${styles.optionSelectedCorrect}`;
                feedbackText = ' (Correct)';
            } else if (isUserSelection && !isCorrectOption) {
                buttonClass += ` ${styles.optionSelectedIncorrect}`;
                feedbackText = ' (Incorrect)';
            } else if (isCorrectOption) {
                buttonClass += ` ${styles.optionCorrectUnselected}`;
                feedbackText = ' (Correct Answer)';
            }

        } else if (isUserSelection) {
            // --- Selected State (Before Feedback) ---
            // Apply a subtle selection indicator if desired, e.g., slightly different border/bg
            buttonClass += ` ${styles.optionSelected}`;
        }

        return (
          <Button
            key={option}
            variant="outline" // Use the outline variant
            className={buttonClass} // Apply dynamic feedback classes
            onClick={() => handleSelect(option)}
            // Disable button based on the isDisabled prop passed down
            disabled={disabled}
          >
            {option} {feedbackText}
          </Button>
        );
      })}
    </div>
  );
};

export default MultipleChoiceOptions;