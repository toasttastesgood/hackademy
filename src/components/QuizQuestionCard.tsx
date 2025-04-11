import React from 'react';
import Card from './Card/Card';
import styles from './QuizQuestionCard.module.css'; // Use new CSS module
import Button from './Button/Button'; // Import the Button component
import { getQuestionComponent } from '../services/QuestionTypeRegistry';
import { Question } from '../services/QuizTypes'; // Import necessary types
import { FaRandom } from 'react-icons/fa'; // Icon for shuffle button
import { QuestionComponentProps } from './Questions/types'; // Corrected import path

// Define AnswerType locally (consider moving to a shared types file later)
type AnswerType = string | number | boolean | string[];

// Define the shape of the persistent feedback data

/**
 * Props for the QuizQuestionCard component.
 */
interface QuizQuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answer: AnswerType | null) => void;
  currentAnswer: AnswerType | null;
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
      disabled: isDisabled,
      currentAnswer: currentAnswer,
      isShowingFeedback: isShowingFeedback,
      correctAnswerValue: correctAnswerValueForFeedback,
      instantFeedbackEnabled: instantFeedbackEnabled,
      isAnswerLocked: isAnswerLocked,
  };


  return (
    <Card className={styles.question}>
      {/* Shuffle Toggle Button */}

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
export default React.memo(QuizQuestionCard);