import React, { useState } from 'react';
import HexView from '../HexView/HexView';
import styles from '../QuizPlayer.module.css';
import { QuestionComponentProps } from './types';
import MultipleChoiceOptions from './MultipleChoiceOptions';

export interface HighlightedBytesQuestionProps extends QuestionComponentProps {
  question: QuestionComponentProps['question'] & {
    hexDump: string;
    highlightedRanges: Array<{
      start: number;
      length: number;
      color?: string;
    }>;
    correctAnswers: string[];
    wrongAnswers: string[];
    bytesPerLine?: number;
  };
}

const HighlightedBytesQuestion: React.FC<HighlightedBytesQuestionProps> = ({
  question,
  onAnswer,
  disabled = false
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSelect = (option: string) => {
    if (disabled) return;
    setSelectedOption(option);
    onAnswer(option);
  };

  return (
    <div className={styles.highlightedBytesQuestion}>
      <HexView
        hexDump={question.hexDump}
        bytesPerLine={question.bytesPerLine}
        highlightedRanges={question.highlightedRanges}
        interactive={false}
      />

      <MultipleChoiceOptions
        correctAnswers={question.correctAnswers}
        wrongAnswers={question.wrongAnswers}
        onSelect={handleSelect}
        disabled={disabled}
        selectedAnswer={selectedOption}
      />
    </div>
  );
};

export default HighlightedBytesQuestion;