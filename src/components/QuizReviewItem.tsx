import React, { useState } from 'react';
import Card from './Card/Card';
import styles from './QuizReview.module.css'; // Reuse styles for now, can split later if needed
import { Question } from '../services/QuizValidator';

// Define types locally (consider moving to a shared types file later)
type AnswerType = string | number | boolean | string[];

/**
 * Data structure for a single question's review information.
 */
interface QuestionReviewData {
  originalQuestion: Question;
  selectedAnswer: AnswerType | null;
  isCorrect: boolean;
  correctAnswer: AnswerType | undefined | null;
}

/**
 * Props for the QuizReviewItem component.
 */
interface QuizReviewItemProps {
  qData: QuestionReviewData;
  index: number;
}

// Moved renderOptions helper function here
/**
 * Helper function to render the answer display for a question review.
 * Handles different rendering logic for MCQ vs other question types.
 */
const renderOptions = (questionData: QuestionReviewData) => {
  const { originalQuestion, selectedAnswer, correctAnswer } = questionData;

  // Check if the question is MCQ
  if (originalQuestion.type === 'mcq') {
    const correct = Array.isArray(originalQuestion.correctAnswers) ? originalQuestion.correctAnswers : [];
    const wrong = Array.isArray(originalQuestion.wrongAnswers) ? originalQuestion.wrongAnswers : [];
    const options = [...correct, ...wrong].sort(() => Math.random() - 0.5);

    return (
      <ul className={styles.optionsList}>
        {options.map((option: string, index: number) => {
          const isUserSelection = selectedAnswer === option;
          const isActuallyCorrect = correct.includes(option);
          let optionClass = styles.optionItem;

          if (isUserSelection && isActuallyCorrect) {
            optionClass += ` ${styles.optionSelectedCorrect}`;
          } else if (isUserSelection && !isActuallyCorrect) {
            optionClass += ` ${styles.optionSelectedIncorrect}`;
          } else if (isActuallyCorrect) {
            if (!isUserSelection) {
               optionClass += ` ${styles.optionCorrectUnselected}`;
            }
          }

          return (
            <li key={index} className={optionClass}>
              {option}
              {isUserSelection && !isActuallyCorrect ? ` (Your Answer)` : ''}
              {isActuallyCorrect ? ` (Correct Answer)` : ''}
            </li>
          );
        })}
      </ul>
    );
  }

  // Fallback for non-MCQ questions
  const { isCorrect } = questionData;
  const yourAnswerClass = isCorrect ? styles.answerCorrect : styles.answerIncorrect;

  return (
    <div className={styles.answerDetails}>
      <p className={yourAnswerClass}>
        <strong>Your Answer:</strong> {JSON.stringify(selectedAnswer ?? 'Not Answered')}
      </p>
      {!isCorrect && correctAnswer !== undefined && correctAnswer !== null ? (
        <p className={styles.answerCorrect}>
          <strong>Correct Answer:</strong> {JSON.stringify(correctAnswer)}
        </p>
      ) : null}
    </div>
  );
};


/**
 * Renders a single question's review details within a card.
 * Displays the question, the user's answer (styled correctly/incorrectly),
 * the correct answer if applicable, and an optional explanation toggle.
 */
const QuizReviewItem: React.FC<QuizReviewItemProps> = ({ qData, index }) => {
  const [showExplanation, setShowExplanation] = useState(false);

  const toggleExplanation = () => {
    setShowExplanation(prev => !prev);
  };

  return (
    <Card
      key={index}
      className={`${styles.reviewQuestion} ${qData.isCorrect ? styles.resultCorrect : styles.resultIncorrect}`}
    >
      <button
        onClick={toggleExplanation}
        className={styles.explanationToggle}
        aria-label={showExplanation ? "Hide explanation" : "Show explanation"}
        aria-expanded={showExplanation}
      >
        ?
      </button>

      <h3>Question {index + 1}</h3>
      <p className={styles.questionText}>{qData.originalQuestion.text}</p>

      {/* Render Answer Options */}
      {renderOptions(qData)}

      {/* Conditionally Render Explanation */}
      {showExplanation && qData.originalQuestion.explanation && (
        <div className={styles.explanation}>
          <h4>Explanation</h4>
          <p>{qData.originalQuestion.explanation}</p>
        </div>
      )}
    </Card>
  );
};

export default QuizReviewItem;