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
  const options = React.useMemo(() => {
    // Combine and shuffle options once
    return shuffleArray([...correctAnswers, ...wrongAnswers]);
  }, [correctAnswers, wrongAnswers]);

  // Local shuffleArray removed, imported from utils

  const handleSelect = (option: string) => {
    // Interaction is controlled by the disabled prop passed from QuizQuestionCard
    if (disabled) return;
    onSelect(option);
  };

  const useGridLayout = options.every(opt => opt.length < 20);

  return (
    <div
      className={`${styles.options} ${useGridLayout ? styles.grid : ''}`}
      role="radiogroup"
      aria-label="Answer choices"
    >
      {options.map((option, idx) => {
        // Base classes for the Button component
        let buttonClass = '';
        let feedbackText = '';
        const isUserSelection = selectedAnswer === option;
        // Determine feedback styles based on state
        if (isAnswerLocked) {
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
            const isCorrectOption = correctAnswerValue === option;

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
            buttonClass += ` ${styles.optionSelected}`;
        }

        // Keyboard navigation for radio group
        const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
          if (disabled) return;
          let nextIdx = idx;
          if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            nextIdx = (idx + 1) % options.length;
            e.preventDefault();
            (document.getElementById(`mcq-option-${nextIdx}`) as HTMLButtonElement)?.focus();
          } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            nextIdx = (idx - 1 + options.length) % options.length;
            e.preventDefault();
            (document.getElementById(`mcq-option-${nextIdx}`) as HTMLButtonElement)?.focus();
          }
        };

        return (
          <Button
            key={option}
            id={`mcq-option-${idx}`}
            variant="outline"
            className={buttonClass}
            onClick={() => handleSelect(option)}
            disabled={disabled}
            role="radio"
            aria-checked={selectedAnswer === option}
            tabIndex={selectedAnswer === option || (!selectedAnswer && idx === 0) ? 0 : -1}
            onKeyDown={handleKeyDown}
          >
            {option} {feedbackText}
          </Button>
        );
      })}
    </div>
  );
};

export default React.memo(MultipleChoiceOptions);