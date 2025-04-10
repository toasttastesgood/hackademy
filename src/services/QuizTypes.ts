// Base question interface
export interface BaseQuestion {
  text: string;
  explanation?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

// Specific question types
export interface MCQQuestion extends BaseQuestion {
  type: 'mcq';
  correctAnswers: string[];
  wrongAnswers: string[];
}


export interface HighlightedBytesQuestion extends BaseQuestion {
  type: 'highlighted_bytes';
  hexDump: string;
  highlightedRanges: Array<{
    start: number;
    length: number;
    color?: string;
  }>;
  correctAnswers: string[];
  wrongAnswers: string[];
  bytesPerLine?: number;
}

export interface HexSelectionQuestion extends BaseQuestion {
  type: 'hex_selection';
  hexDump: string;
  correctOffset: number;
  fieldLength: number;
  bytesPerLine?: number;
}

export interface DragDropQuestion extends BaseQuestion {
  type: 'drag_drop';
  itemOrder: string[]; // Correct order
}

// Union type for any question
export type Question =
  | MCQQuestion
  | HighlightedBytesQuestion
  | HexSelectionQuestion
  | DragDropQuestion;

// Quiz interface
export interface Quiz {
  id: string;
  category: string;
  title: string;
  description?: string;
  questions: Question[];
}