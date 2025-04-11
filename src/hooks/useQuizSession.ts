import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../contexts/QuizProvider';
import { useSettings } from '../contexts/SettingsContext';
import { initializeQuizSession, QuizSession, SessionQuestionData } from './quizSessionTypes';
import type { AnswerType } from '../components/Questions/types';
import type { Quiz } from '../services/QuizTypes';

interface UseQuizSessionArgs {
  quizId: string | undefined;
  onSessionLoaded?: (quizTitle: string | undefined, totalQuestions: number) => void;
}

interface UseQuizSessionReturn {
  quizSession: QuizSession | null;
  currentQuestionData: SessionQuestionData | null;
  isLoading: boolean;
  error: string | null;
  answerQuestion: (answer: AnswerType) => void;
  lockAnswer: () => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  finishQuiz: () => void;
  updateQuizSession: (updater: (prev: QuizSession) => QuizSession) => void;
}

export function useQuizSession({ quizId, onSessionLoaded }: UseQuizSessionArgs): UseQuizSessionReturn {
  const navigate = useNavigate();
  const { loadQuizById } = useQuiz();
  const { settings, isSettingsLoaded } = useSettings();

  const [quizSession, setQuizSession] = useState<QuizSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // No longer need revealedCount or lazy loading

  useEffect(() => {
    let cancelled = false;
    if (!isSettingsLoaded) return;

    setIsLoading(true);
    setError(null);
    setQuizSession(null);

    async function load() {
      if (!quizId) {
        setQuizSession(null);
        setError('No quiz ID provided.');
        setIsLoading(false);
        return;
      }

      const quiz: Quiz | null = await loadQuizById(quizId);
      if (!quiz) {
        setQuizSession(null);
        setError('Quiz not found.');
        setIsLoading(false);
        return;
      }

      if (!quiz.questions || quiz.questions.length === 0) {
        setQuizSession(null);
        setError('Quiz has no questions.');
        setIsLoading(false);
        return;
      }

      // Initialize session with all questions in the questions array
      const session = initializeQuizSession(
        quiz,
        {
          count: settings.quizQuestionsCount,
          shuffle: settings.quizShuffleEnabled,
        }
      );

      if (!cancelled) {
        setQuizSession(session);
        setIsLoading(false);
        if (onSessionLoaded) {
          onSessionLoaded(session.title, session.questions.length);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [quizId, loadQuizById, settings, isSettingsLoaded, onSessionLoaded]);

  const updateQuizSession = useCallback((updater: (prev: QuizSession) => QuizSession) => {
    setQuizSession(prev => (prev ? updater(prev) : prev));
  }, []);

  const currentQuestionData = quizSession
    ? quizSession.questions[quizSession.currentIndex] ?? null
    : null;

  const answerQuestion = useCallback((answer: AnswerType) => {
    updateQuizSession(prev => {
      const updated = { ...prev };
      const q = updated.questions[updated.currentIndex];
      q.userAnswer = answer;
      return updated;
    });
  }, [updateQuizSession]);

  const lockAnswer = useCallback(() => {
    updateQuizSession(prev => {
      const updated = { ...prev };
      const q = updated.questions[updated.currentIndex];
      if (q.userAnswer !== null) {
        q.isLocked = true;
        q.isCorrect = q.userAnswer === q.correctAnswer;
        q.feedbackShown = true;
      }
      return updated;
    });
  }, [updateQuizSession]);

  // Move to the next question if not at the end
  const nextQuestion = useCallback(() => {
    updateQuizSession(prev => {
      const updated = { ...prev };
      if (updated.currentIndex < updated.questions.length - 1) {
        updated.currentIndex++;
      }
      return updated;
    });
  }, [updateQuizSession]);

  const previousQuestion = useCallback(() => {
    updateQuizSession(prev => {
      const updated = { ...prev };
      if (updated.currentIndex > 0) {
        updated.currentIndex--;
      }
      return updated;
    });
  }, [updateQuizSession]);

  const finishQuiz = useCallback(() => {
    updateQuizSession(prev => {
      const updated = { ...prev, isFinished: true };
      return updated;
    });
  }, [updateQuizSession]);

  return {
    quizSession,
    currentQuestionData,
    isLoading,
    error,
    answerQuestion,
    lockAnswer,
    nextQuestion,
    previousQuestion,
    finishQuiz,
    updateQuizSession,
  };
}