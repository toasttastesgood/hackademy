import React from 'react';
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
  disabled = false, // Use disabled passed from QuizQuestionCard
  currentAnswer,
  // Destructure feedback props
  isShowingFeedback = false,
  correctAnswerValue = null, // Should be number (offset)
  instantFeedbackEnabled = false,
  isAnswerLocked = false,
}) => {
  const fieldLength = question.fieldLength || 1;

  const handleByteClick = (offset: number) => {
    if (disabled) return; // Use the disabled prop
    onAnswer(offset);
  };

  // Determine highlighted ranges based on currentAnswer and feedback/lock state
  const currentOffset = typeof currentAnswer === 'number' ? currentAnswer : null;
  const correctOffset = typeof correctAnswerValue === 'number' ? correctAnswerValue : null;
  const showFeedbackStyles = isShowingFeedback || isAnswerLocked;

  let highlightedRanges = [];
  if (showFeedbackStyles) {
    // Show user's selection (if any) with incorrect styling if wrong
    if (currentOffset !== null && currentOffset !== correctOffset) {
      highlightedRanges.push({ start: currentOffset, length: fieldLength, color: 'var(--error-color-dim)' }); // Dim error color
    }
    // Always show correct answer in success color (or user's correct selection)
    if (correctOffset !== null) {
      highlightedRanges.push({ start: correctOffset, length: fieldLength, color: 'var(--success-color)' }); // Success color
    }
  } else if (currentOffset !== null) {
    // Only show user's current selection before feedback/lock
    highlightedRanges.push({ start: currentOffset, length: fieldLength }); // Default highlight
  }

  return (
    <HexView
      hexDump={question.hexDump}
      bytesPerLine={question.bytesPerLine}
      highlightedRanges={highlightedRanges}
      // Disable interaction based on the isDisabled prop passed down
      interactive={!disabled}
      onByteClick={handleByteClick}
    />
  );
};

export default HexSelectionQuestion;