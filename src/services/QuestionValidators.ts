import { 
  isNonEmptyString, 
  isNonEmptyStringArray, 
  isBoolean, 
  isNumber, 
  isStringArray 
} from './TypeGuards';

const HEX_DUMP_REGEX = /^([0-9a-fA-F]{2}\s?)+$/;

type QuestionValidator = (q: any) => string[];

const validateMCQ: QuestionValidator = (q) => {
  const errors: string[] = [];
  if (!isNonEmptyStringArray(q.correctAnswers)) errors.push("'correctAnswers' must be a non-empty string array.");
  if (!isNonEmptyStringArray(q.wrongAnswers)) errors.push("'wrongAnswers' must be a non-empty string array.");

  // Optional difficulty
  if (q.difficulty !== undefined && !['easy', 'medium', 'hard'].includes(q.difficulty)) {
    errors.push("'difficulty' must be 'easy', 'medium', or 'hard' if present.");
  }
  // Optional tags
  if (q.tags !== undefined && (!Array.isArray(q.tags) || !q.tags.every((t: any) => typeof t === 'string'))) {
    errors.push("'tags' must be an array of strings if present.");
  }

  return errors;
};


const validateHighlightedBytes: QuestionValidator = (q) => {
  const errors: string[] = [];
  if (!isNonEmptyString(q.hexDump) || !HEX_DUMP_REGEX.test(q.hexDump)) errors.push("Invalid or empty 'hexDump'.");
  if (!Array.isArray(q.highlightedRanges)) errors.push("'highlightedRanges' must be an array.");
  if (!isNonEmptyStringArray(q.correctAnswers)) errors.push("'correctAnswers' must be a non-empty string array.");
  if (!isNonEmptyStringArray(q.wrongAnswers)) errors.push("'wrongAnswers' must be a non-empty string array.");
  if (q.bytesPerLine !== undefined && !isNumber(q.bytesPerLine)) errors.push("'bytesPerLine' must be a number if present.");

  if (q.difficulty !== undefined && !['easy', 'medium', 'hard'].includes(q.difficulty)) {
    errors.push("'difficulty' must be 'easy', 'medium', or 'hard' if present.");
  }
  if (q.tags !== undefined && (!Array.isArray(q.tags) || !q.tags.every((t: any) => typeof t === 'string'))) {
    errors.push("'tags' must be an array of strings if present.");
  }

  return errors;
};

const validateHexSelection: QuestionValidator = (q) => {
  const errors: string[] = [];
  if (!isNonEmptyString(q.hexDump) || !HEX_DUMP_REGEX.test(q.hexDump)) errors.push("Invalid or empty 'hexDump'.");
  if (!isNumber(q.correctOffset)) errors.push("'correctOffset' must be a number.");
  if (!isNumber(q.fieldLength) || q.fieldLength <= 0) errors.push("'fieldLength' must be a positive number.");
  if (q.bytesPerLine !== undefined && !isNumber(q.bytesPerLine)) errors.push("'bytesPerLine' must be a number if present.");

  if (q.difficulty !== undefined && !['easy', 'medium', 'hard'].includes(q.difficulty)) {
    errors.push("'difficulty' must be 'easy', 'medium', or 'hard' if present.");
  }
  if (q.tags !== undefined && (!Array.isArray(q.tags) || !q.tags.every((t: any) => typeof t === 'string'))) {
    errors.push("'tags' must be an array of strings if present.");
  }

  return errors;
};

const validateDragDrop: QuestionValidator = (q) => {
  const errors: string[] = [];
  if (!isNonEmptyStringArray(q.itemOrder)) errors.push("'itemOrder' must be a non-empty string array.");

  if (q.difficulty !== undefined && !['easy', 'medium', 'hard'].includes(q.difficulty)) {
    errors.push("'difficulty' must be 'easy', 'medium', or 'hard' if present.");
  }
  if (q.tags !== undefined && (!Array.isArray(q.tags) || !q.tags.every((t: any) => typeof t === 'string'))) {
    errors.push("'tags' must be an array of strings if present.");
  }

  return errors;
};

const questionValidators: Record<string, QuestionValidator> = {
  mcq: validateMCQ,
  highlighted_bytes: validateHighlightedBytes,
  hex_selection: validateHexSelection,
  drag_drop: validateDragDrop,
};

export function validateQuestion(q: any): string[] {
  if (!q || typeof q !== 'object') return ['Question is not an object'];
  if (!('type' in q) || typeof q.type !== 'string') return ['Missing or invalid question type'];
  const validator = questionValidators[q.type];
  if (!validator) return [`Unknown question type '${q.type}'`];
  return validator(q);
}