import React from 'react';
import Card from './Card/Card';
import styles from './QuizQuestionCard.module.css'; // Use new CSS module
import { getQuestionComponent } from '../services/QuestionTypeRegistry';
import { Question } from '../services/QuizValidator'; // Import necessary types

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
  isAnswered: boolean;
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
  isAnswered,
}) => {
  const QuestionComponent = getQuestionComponent(question.type);

  return (
    <Card className={styles.question}>
      <h2>Question {questionNumber}</h2>
      <p className={styles.progressText}>of {totalQuestions}</p>
      <p className={styles.questionText}>{question.text}</p>

      {QuestionComponent && (
        <QuestionComponent
          question={question}
          onAnswer={onAnswer}
          disabled={isAnswered}
        />
      )}
    </Card>
  );
};

export default QuizQuestionCard;