import React, { useState } from 'react';
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
  disabled = false
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const handleSelect = (answer: string) => {
    if (disabled) return;
    setSelectedAnswer(answer);
    onAnswer(answer);
  };

  return (
    <MultipleChoiceOptions
      correctAnswers={question.correctAnswers}
      wrongAnswers={question.wrongAnswers}
      onSelect={handleSelect}
      disabled={disabled}
      selectedAnswer={selectedAnswer}
    />
  );
};

export default MCQQuestion;