import React from 'react';
import Button from './Button/Button';
import styles from './QuizNavigation.module.css'; // We'll create this next
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

interface QuizNavigationProps {
  onPrevious: () => void;
  onNextOrFinish: () => void;
  isPreviousDisabled: boolean;
  isNextDisabled: boolean; // Combined disabled state for Next/Finish
  isLastQuestion: boolean;
  isShowingFeedback: boolean; // To show '...' text
}

const QuizNavigation: React.FC<QuizNavigationProps> = ({
  onPrevious,
  onNextOrFinish,
  isPreviousDisabled,
  isNextDisabled,
  isLastQuestion,
  isShowingFeedback,
}) => {
  return (
    <div className={styles.navigationButtons}>
      <Button
        variant="outline"
        className={styles.navButton}
        onClick={onPrevious}
        disabled={isPreviousDisabled || isShowingFeedback} // Also disable Previous during feedback
        aria-label="Previous Question"
        leftIcon={<FaArrowLeft />}
      >
        Previous
      </Button>
      <Button
        variant="primary" // Make Next/Finish primary
        className={`${styles.navButton} ${styles.actionButton}`}
        onClick={onNextOrFinish}
        disabled={isNextDisabled || isShowingFeedback} // Disable if no answer or during feedback
        // Use rightIcon prop conditionally
        rightIcon={!isShowingFeedback && !isLastQuestion ? <FaArrowRight /> : undefined}
      >
        {isShowingFeedback
          ? '...' // Indicate loading/waiting during feedback
          : isLastQuestion
            ? 'Finish Quiz'
            : 'Next'}
      </Button>
    </div>
  );
};

export default React.memo(QuizNavigation);