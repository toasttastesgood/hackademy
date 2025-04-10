import React from 'react'; // Removed useState import
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
  disabled = false,
  currentAnswer // Destructure the new prop
}) => {
  // Removed internal selectedOption state

  const handleSelect = (option: string) => {
    if (disabled) return;
    // setSelectedOption(option); // No longer needed
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
        // Pass the currentAnswer prop down
        selectedAnswer={typeof currentAnswer === 'string' ? currentAnswer : null}
      />
    </div>
  );
};

export default HighlightedBytesQuestion;