import React from 'react';
import { 
  MCQQuestion, 
  TrueFalseQuestion,
  QuestionComponentProps,
  QuestionComponent 
} from '../components/Questions';
import HexSelectionQuestion from '../components/Questions/HexSelectionQuestion';
import HighlightedBytesQuestion from '../components/Questions/HighlightedBytesQuestion';
import DragDropQuestion from '../components/Questions/DragDropQuestion';

type QuestionTypeHandler = {
  component: QuestionComponent;
  validateAnswer: (question: any, answer: any) => boolean;
};

const questionTypeRegistry: Record<string, QuestionTypeHandler> = {
  mcq: {
    component: MCQQuestion,
    validateAnswer: (question, answer) => 
      question.correctAnswers.includes(answer)
  },
  true_false: {
    component: TrueFalseQuestion,
    validateAnswer: (question, answer) => 
      question.correctAnswers.includes(answer === 'True')
  },
  hex_selection: {
    component: HexSelectionQuestion,
    validateAnswer: (question, answer) => 
      question.correctOffset === answer
  },
  highlighted_bytes: {
    component: HighlightedBytesQuestion,
    validateAnswer: (question, answer) =>
      question.correctAnswers.includes(answer)
  },
  drag_drop: {
    component: DragDropQuestion,
    validateAnswer: (question: any, answer: any) => 
      JSON.stringify(question.itemOrder) === JSON.stringify(answer)
  }
};

export const registerQuestionType = (
  type: string,
  component: QuestionComponent,
  validateAnswer: (question: any, answer: any) => boolean
) => {
  questionTypeRegistry[type] = { component, validateAnswer };
};

export const getQuestionComponent = (type: string) => {
  return questionTypeRegistry[type]?.component || null;
};

export const validateQuestionAnswer = (type: string, question: any, answer: any) => {
  return questionTypeRegistry[type]?.validateAnswer(question, answer) || false;
};

export const QUESTION_TYPES = Object.keys(questionTypeRegistry);