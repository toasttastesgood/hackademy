import React from 'react';
import Card from './Card/Card';
import styles from './QuizQuestionCard.module.css'; // Use new CSS module
import buttonStyles from './Button/Button.module.css'; // For shuffle button styling
import { getQuestionComponent } from '../services/QuestionTypeRegistry';
import { Question } from '../services/QuizTypes'; // Import necessary types
import { FaRandom } from 'react-icons/fa'; // Icon for shuffle button
import { QuestionComponentProps } from './Questions/types'; // Corrected import path

// Define AnswerType locally (consider moving to a shared types file later)
type AnswerType = string | number | boolean | string[];

/**
 * Props for the QuizQuestionCard component.
 */
interface QuizQuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answer: AnswerType | null) => void;
  currentAnswer: AnswerType | null;
  isShuffleActive: boolean;
  onToggleShuffle: () => void;
  // Props for Instant Feedback
  isShowingFeedback: boolean; // Is the feedback timer currently active?
  correctAnswerValueForFeedback: AnswerType | null | undefined; // The actual correct answer to display during feedback timer
  isDisabled: boolean; // Should interaction be disabled? (Based on player logic)
  instantFeedbackEnabled: boolean; // Is the global instant feedback setting on?
  isAnswerLocked: boolean; // Is the answer for this question permanently locked (due to instant feedback)?
}

/**
 * Renders a single question within a card for the QuizPlayer.
 * It displays the question number, total questions, question text,
 * and dynamically renders the appropriate question input component based on the question type.
 */
const QuizQuestionCard: React.FC<QuizQuestionCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  currentAnswer,
  isShuffleActive,
  onToggleShuffle,
  // Destructure feedback props
  isShowingFeedback,
  correctAnswerValueForFeedback,
  isDisabled,
  instantFeedbackEnabled,
  isAnswerLocked,
}) => {
  const QuestionComponent = getQuestionComponent(question.type);

  // Prepare props for the dynamic QuestionComponent
  const questionComponentProps: QuestionComponentProps = {
      question: question,
      onAnswer: onAnswer,
      disabled: isDisabled, // Use the calculated disabled state
      currentAnswer: currentAnswer,
      // Pass down feedback related props
      isShowingFeedback: isShowingFeedback,
      correctAnswerValue: correctAnswerValueForFeedback, // Pass the correct value for feedback display
      instantFeedbackEnabled: instantFeedbackEnabled,
      isAnswerLocked: isAnswerLocked,
  };


  return (
    <Card className={styles.question}>
      {/* Shuffle Toggle Button */}
      <button
        onClick={onToggleShuffle}
        className={`${styles.shuffleToggleBtn} ${isShuffleActive ? styles.shuffleActive : ''}`}
        aria-label={isShuffleActive ? "Disable Shuffle for Remaining Questions" : "Enable Shuffle for Remaining Questions"}
        title={isShuffleActive ? "Shuffle is ON" : "Shuffle is OFF"}
        // Disable shuffle toggle during feedback
        disabled={isShowingFeedback}
      >
        <FaRandom />
      </button>

      <h2>Question {questionNumber}</h2>
      <p className={styles.progressText}>of {totalQuestions}</p>
      <p className={styles.questionText}>{question.text}</p>

      {QuestionComponent && (
        // Spread the prepared props onto the dynamic component
        <QuestionComponent {...questionComponentProps} />
      )}
      {/* Feedback overlay removed, handled within QuestionComponent now */}
    </Card>
  );
};

export default QuizQuestionCard;