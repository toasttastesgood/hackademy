import type { Quiz, Question } from '../services/QuizTypes';
import type { AnswerType } from '../components/Questions/types';

/**
 * Represents a single quiz session, including all questions, answers, and progress.
 */
export interface QuizSession {
  quizId: string;
  title: string;
  description?: string;
  questions: SessionQuestionData[];
  currentIndex: number; // Index of the current question
  isFinished: boolean;
}

/**
 * Represents a single question within a quiz session, including user answer and feedback state.
 */
export interface SessionQuestionData {
  originalQuestion: Question;
  originalIndex: number; // Index in the original quiz question list
  userAnswer: AnswerType | null;
  isLocked: boolean; // True if answer is locked (due to instant feedback)
  isCorrect: boolean | null; // null if unanswered, true/false if answered
  correctAnswer: AnswerType | null; // The correct answer (or first correct if multiple)
  feedbackShown: boolean; // Whether feedback has been shown (timer completed)
}

/**
 * Initialize a new QuizSession from a Quiz object and user settings.
 */
export function initializeQuizSession(
  quiz: Quiz,
  options: {
    count: number;
    shuffle: boolean;
  }
): QuizSession {
  const { count, shuffle } = options;

  // Select questions (simple random subset for now)
  let selectedQuestions = [...quiz.questions];
  if (shuffle) {
    selectedQuestions = shuffleArray(selectedQuestions);
  }
  selectedQuestions = selectedQuestions.slice(0, count);

  const sessionQuestions: SessionQuestionData[] = selectedQuestions.map((q, idx) => {
    let correctAnswer: AnswerType | null = null;
    if (q.type === 'mcq' || q.type === 'highlighted_bytes') {
      const qWithType = q as any;
      correctAnswer = Array.isArray(qWithType.correctAnswers) && qWithType.correctAnswers.length > 0
        ? qWithType.correctAnswers[0]
        : null;
    } else if (q.type === 'hex_selection') {
      correctAnswer = (q as any).correctOffset;
    } else if (q.type === 'drag_drop') {
      correctAnswer = (q as any).itemOrder;
    }

    return {
      originalQuestion: q,
      originalIndex: idx,
      userAnswer: null,
      isLocked: false,
      isCorrect: null,
      correctAnswer,
      feedbackShown: false,
    };
  });

  return {
    quizId: quiz.id,
    title: quiz.title,
    description: quiz.description,
    questions: sessionQuestions,
    currentIndex: 0,
    isFinished: false,
  };
}

/**
 * Fisher-Yates shuffle utility.
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}