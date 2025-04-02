import React from 'react';

export interface QuestionComponentProps {
  question: any;
  onAnswer: (answer: any) => void;
  disabled?: boolean;
}

export type QuestionComponent = React.FC<QuestionComponentProps>;