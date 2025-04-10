import React from 'react'; // Removed useState import
import styles from '../QuizPlayer.module.css';
import { QuestionComponentProps } from './types';
import MultipleChoiceOptions from './MultipleChoiceOptions';

export interface MCQQuestionProps extends QuestionComponentProps {
  question: QuestionComponentProps['question'] & {
    correctAnswers: string[];
    wrongAnswers: string[];
  };
}

const MCQQuestion: React.FC<MCQQuestionProps> = ({
  question,
  onAnswer,
  disabled = false,
  currentAnswer,
  // Destructure feedback props to pass them down
  isShowingFeedback,
  correctAnswerValue,
  instantFeedbackEnabled,
  isAnswerLocked,
}) => {
  // Removed internal selectedAnswer state. The value comes from the currentAnswer prop.

  const handleSelect = (answer: string) => {
    if (disabled) return;
    // setSelectedAnswer(answer); // No longer needed
    onAnswer(answer);
  };

  return (
    <MultipleChoiceOptions
      correctAnswers={question.correctAnswers}
      wrongAnswers={question.wrongAnswers}
      onSelect={handleSelect}
      disabled={disabled}
      // Pass the currentAnswer prop down instead of internal state
      // Ensure currentAnswer is compatible (string | null for MCQ)
      selectedAnswer={typeof currentAnswer === 'string' ? currentAnswer : null}
      // Pass feedback props down
      isShowingFeedback={isShowingFeedback}
      correctAnswerValue={correctAnswerValue}
      instantFeedbackEnabled={instantFeedbackEnabled}
      isAnswerLocked={isAnswerLocked}
    />
  );
};

export default MCQQuestion;