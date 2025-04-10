import { Quiz } from './QuizTypes';
import { QuestionStatus } from '../contexts/QuizProvider';

export interface SessionQuestion {
  originalIndex: number;
  question: any;
}

export interface QuestionSelectorOptions {
  quiz: Quiz;
  trackingData: { [index: number]: QuestionStatus };
  count: number;
  mode: 'mixed' | 'mistakes' | 'review_all' | 'adaptive';
  shuffle: boolean;
  tags?: string[];
  difficulty?: ('easy' | 'medium' | 'hard')[];
  now?: Date;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function selectQuestions(options: QuestionSelectorOptions): SessionQuestion[] {
  const { quiz, trackingData, count, mode, shuffle, tags, difficulty, now } = options;
  const questions = quiz.questions;
  const finalCount = Math.min(count, questions.length);
  const sessionQuestions: SessionQuestion[] = [];

  // Filter by tags/difficulty if provided
  const filteredQuestions = questions
    .map((q, idx) => ({ originalIndex: idx, question: q }))
    .filter(({ question }) => {
      let tagMatch = true;
      let diffMatch = true;
      if (tags && tags.length > 0) {
        tagMatch = Array.isArray((question as any).tags) && (question as any).tags.some((t: string) => tags.includes(t));
      }
      if (difficulty && difficulty.length > 0) {
        diffMatch = difficulty.includes((question as any).difficulty);
      }
      return tagMatch && diffMatch;
    });

  let pool: SessionQuestion[] = [];

  if (mode === 'review_all') {
    pool = filteredQuestions;
  } else if (mode === 'mistakes') {
    pool = filteredQuestions.filter(({ originalIndex }) => {
      const status = trackingData[originalIndex];
      return !status || !status.seen || status.correct === false;
    });
  } else if (mode === 'adaptive') {
    // Placeholder adaptive logic: prioritize unseen, then incorrect, then least recently seen
    const nowTime = (now || new Date()).getTime();
    pool = filteredQuestions.slice().sort((a, b) => {
      const sa = trackingData[a.originalIndex];
      const sb = trackingData[b.originalIndex];

      const score = (s?: QuestionStatus) => {
        if (!s || !s.seen) return 1000; // highest priority
        if (s.correct === false) return 900;
        if (!s.lastSeen) return 500;
        const lastSeenTime = new Date(s.lastSeen).getTime();
        const daysAgo = (nowTime - lastSeenTime) / (1000 * 60 * 60 * 24);
        return Math.max(0, 30 - daysAgo); // prioritize not seen recently
      };

      return score(sb) - score(sa);
    });
  } else { // default 'mixed'
    const unseenOrIncorrect = filteredQuestions.filter(({ originalIndex }) => {
      const status = trackingData[originalIndex];
      return !status || !status.seen || status.correct === false;
    });
    const correctTracked = filteredQuestions.filter(({ originalIndex }) => {
      const status = trackingData[originalIndex];
      return status && status.correct === true;
    });

    const shuffledUnseen = shuffleArray(unseenOrIncorrect);
    let selected = shuffledUnseen.slice(0, finalCount);
    if (selected.length < finalCount) {
      const needed = finalCount - selected.length;
      const shuffledCorrect = shuffleArray(correctTracked);
      selected = selected.concat(shuffledCorrect.slice(0, needed));
    }
    pool = selected;
  }

  // Truncate to finalCount
  let selectedPool = pool.slice(0, finalCount);

  // Fallback: if empty, pick first question(s)
  if (selectedPool.length === 0 && filteredQuestions.length > 0) {
    selectedPool = filteredQuestions.slice(0, Math.min(1, finalCount));
  }

  if (shuffle) {
    selectedPool = shuffleArray(selectedPool);
  }

  return selectedPool;
}