import React, { useState } from 'react';
import HexView from '../HexView/HexView';
import { QuestionComponentProps } from './types';

export interface HexSelectionQuestionProps extends QuestionComponentProps {
  question: QuestionComponentProps['question'] & {
    hexDump: string;
    correctOffset: number;
    fieldLength?: number;
    bytesPerLine?: number;
  };
}

const HexSelectionQuestion: React.FC<HexSelectionQuestionProps> = ({ 
  question, 
  onAnswer,
  disabled = false
}) => {
  const [selectedOffset, setSelectedOffset] = useState<number | null>(null);
  const fieldLength = question.fieldLength || 1;

  const handleByteClick = (offset: number) => {
    if (disabled) return;
    setSelectedOffset(offset);
    onAnswer(offset);
  };

  const highlightedRanges = selectedOffset !== null 
    ? [{ start: selectedOffset, length: fieldLength }]
    : [];

  return (
    <HexView
      hexDump={question.hexDump}
      bytesPerLine={question.bytesPerLine}
      highlightedRanges={highlightedRanges}
      interactive={!disabled}
      onByteClick={handleByteClick}
    />
  );
};

export default HexSelectionQuestion;