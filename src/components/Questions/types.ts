import React from 'react';

// Define AnswerType locally or import from a shared location if preferred
type AnswerType = string | number | boolean | string[];

export interface QuestionComponentProps {
  question: any; // Consider using a more specific type like the Question union type if possible
  onAnswer: (answer: AnswerType | null) => void; // Use AnswerType
  disabled?: boolean; // Should interaction be completely disabled?
  currentAnswer?: AnswerType | null; // Optional: The currently selected answer in the player state
  // Props for Instant Feedback display within the component
  isShowingFeedback?: boolean; // Is the feedback timer currently active?
  correctAnswerValue?: AnswerType | null | undefined; // The actual correct answer
  instantFeedbackEnabled?: boolean; // Is the global setting enabled?
  isAnswerLocked?: boolean; // Is the answer permanently locked for this question?
}

export type QuestionComponent = React.FC<QuestionComponentProps>;