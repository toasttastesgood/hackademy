// Define base interfaces
interface BaseQuestion {
  text: string;
  explanation?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

// Define specific question type interfaces
export interface MCQQuestion extends BaseQuestion {
  type: 'mcq';
  correctAnswers: string[];
  wrongAnswers: string[];
}

export interface TrueFalseQuestion extends BaseQuestion {
  type: 'true_false';
  correctAnswer: boolean; // Assuming boolean for true/false
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
  items: string[];
  itemOrder: string[]; // Correct order
}

// Union type for any question
export type Question = 
  | MCQQuestion 
  | TrueFalseQuestion 
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

// --- Type Guards ---

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isNonEmptyString(value: unknown): value is string {
  return isString(value) && value.length > 0;
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isString);
}

function isNonEmptyStringArray(value: unknown): value is string[] {
  return isStringArray(value) && value.length > 0;
}

// --- Validation Logic ---

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  data?: Quiz;
}

const HEX_DUMP_REGEX = /^([0-9a-fA-F]{2}\s?)+$/; // Allow optional space

export function validateQuiz(quizData: unknown): ValidationResult {
  const errors: string[] = [];
  
  if (!isObject(quizData)) {
    return { isValid: false, errors: ["Quiz data must be an object."] };
  }

  const id = quizData.id;
  const quizIdStr = isNonEmptyString(id) ? `'${id}'` : 'unknown';

  // Top-level checks
  if (!isNonEmptyString(quizData.id)) errors.push(`Quiz ${quizIdStr}: Missing or empty 'id'.`);
  if (!isNonEmptyString(quizData.title)) errors.push(`Quiz ${quizIdStr}: Missing or empty 'title'.`);
  if (!isNonEmptyString(quizData.category)) errors.push(`Quiz ${quizIdStr}: Missing or empty 'category'.`);
  if (quizData.description !== undefined && !isString(quizData.description)) errors.push(`Quiz ${quizIdStr}: 'description' must be a string if present.`);
  if (!Array.isArray(quizData.questions)) {
    errors.push(`Quiz ${quizIdStr}: 'questions' must be an array.`);
    // Cannot proceed further if questions isn't an array
    return { isValid: false, errors };
  }
  if (quizData.questions.length === 0) errors.push(`Quiz ${quizIdStr}: 'questions' array cannot be empty.`);

  // Question-level checks
  quizData.questions.forEach((q: unknown, index: number) => {
    const qIndexStr = `Question ${index + 1}`;
    if (!isObject(q)) {
      errors.push(`Quiz ${quizIdStr}, ${qIndexStr}: Must be an object.`);
      return; // Skip further checks for this item
    }

    if (!isNonEmptyString(q.text)) errors.push(`Quiz ${quizIdStr}, ${qIndexStr}: Missing or empty 'text'.`);
    if (q.explanation !== undefined && !isString(q.explanation)) errors.push(`Quiz ${quizIdStr}, ${qIndexStr}: 'explanation' must be a string if present.`);
    if (q.difficulty !== undefined && !['easy', 'medium', 'hard'].includes(q.difficulty as string)) errors.push(`Quiz ${quizIdStr}, ${qIndexStr}: Invalid 'difficulty' value.`);

    const type = q.type;
    if (!isNonEmptyString(type)) {
      errors.push(`Quiz ${quizIdStr}, ${qIndexStr}: Missing or empty 'type'.`);
      return; // Cannot validate further without type
    }

    switch (type) {
      case 'mcq':
        if (!isNonEmptyStringArray(q.correctAnswers)) errors.push(`Quiz ${quizIdStr}, ${qIndexStr} (MCQ): 'correctAnswers' must be a non-empty string array.`);
        if (!isNonEmptyStringArray(q.wrongAnswers)) errors.push(`Quiz ${quizIdStr}, ${qIndexStr} (MCQ): 'wrongAnswers' must be a non-empty string array.`);
        break;
      case 'true_false':
        if (!isBoolean(q.correctAnswer)) errors.push(`Quiz ${quizIdStr}, ${qIndexStr} (True/False): 'correctAnswer' must be a boolean.`);
        break;
      case 'highlighted_bytes':
        if (!isNonEmptyString(q.hexDump) || !HEX_DUMP_REGEX.test(q.hexDump)) errors.push(`Quiz ${quizIdStr}, ${qIndexStr} (Highlighted Bytes): Invalid or empty 'hexDump'.`);
        if (!Array.isArray(q.highlightedRanges)) errors.push(`Quiz ${quizIdStr}, ${qIndexStr} (Highlighted Bytes): 'highlightedRanges' must be an array.`);
        // Add more detailed checks for highlightedRanges items if needed
        if (!isNonEmptyStringArray(q.correctAnswers)) errors.push(`Quiz ${quizIdStr}, ${qIndexStr} (Highlighted Bytes): 'correctAnswers' must be a non-empty string array.`);
        if (!isNonEmptyStringArray(q.wrongAnswers)) errors.push(`Quiz ${quizIdStr}, ${qIndexStr} (Highlighted Bytes): 'wrongAnswers' must be a non-empty string array.`);
        if (q.bytesPerLine !== undefined && !isNumber(q.bytesPerLine)) errors.push(`Quiz ${quizIdStr}, ${qIndexStr} (Highlighted Bytes): 'bytesPerLine' must be a number if present.`);
        break;
      case 'hex_selection':
         if (!isNonEmptyString(q.hexDump) || !HEX_DUMP_REGEX.test(q.hexDump)) errors.push(`Quiz ${quizIdStr}, ${qIndexStr} (Hex Selection): Invalid or empty 'hexDump'.`);
         if (!isNumber(q.correctOffset)) errors.push(`Quiz ${quizIdStr}, ${qIndexStr} (Hex Selection): 'correctOffset' must be a number.`);
         if (!isNumber(q.fieldLength) || q.fieldLength <= 0) errors.push(`Quiz ${quizIdStr}, ${qIndexStr} (Hex Selection): 'fieldLength' must be a positive number.`);
         if (q.bytesPerLine !== undefined && !isNumber(q.bytesPerLine)) errors.push(`Quiz ${quizIdStr}, ${qIndexStr} (Hex Selection): 'bytesPerLine' must be a number if present.`);
        break;
      case 'drag_drop':
        const items = q.items;
        const itemOrder = q.itemOrder;
        if (!isNonEmptyStringArray(items)) errors.push(`Quiz ${quizIdStr}, ${qIndexStr} (Drag Drop): 'items' must be a non-empty string array.`);
        if (!isNonEmptyStringArray(itemOrder)) errors.push(`Quiz ${quizIdStr}, ${qIndexStr} (Drag Drop): 'itemOrder' must be a non-empty string array.`);
        // Add check: itemOrder should contain same elements as items
        if (isStringArray(items) && isStringArray(itemOrder) && new Set(items).size !== new Set(itemOrder).size) {
             errors.push(`Quiz ${quizIdStr}, ${qIndexStr} (Drag Drop): 'items' and 'itemOrder' must contain the same unique elements.`);
        }
        break;
      default:
        errors.push(`Quiz ${quizIdStr}, ${qIndexStr}: Unknown question type '${type}'.`);
    }
  });

  const isValid = errors.length === 0;
  if (!isValid) {
      console.groupCollapsed(`Quiz Validation Failed: ${quizIdStr}`);
      errors.forEach(err => console.error(err));
      console.groupEnd();
  }

  return {
    isValid,
    errors,
    data: isValid ? (quizData as unknown as Quiz) : undefined,
  };
}