import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { validateQuizPartial } from '../services/QuizValidator';
import { Quiz, Question } from '../services/QuizTypes';

// Remove duplicated type definitions here - they are now imported from QuizValidator.ts

interface ProgressData {
  [quizId: string]: {
    attempts: number;
    highestScore: number;
    lastAttempt: string;
  };
}

// Detailed tracking for individual questions within a quiz
export interface QuestionStatus {
  seen: boolean;
  correct: boolean | null; // null if seen but not answered/irrelevant, true/false if answered
  lastSeen?: string; // ISO timestamp of last attempt
  correctCount?: number; // total times answered correctly
  incorrectCount?: number; // total times answered incorrectly
}

interface QuizQuestionTracking {
  [quizId: string]: {
    [questionIndex: number]: QuestionStatus; // Use original index as identifier
  };
}

interface CategoryData {
  name: string;
  quizCount: number;
  completedCount: number;
  averageScore: number;
}

interface QuizContextType {
  quizzes: Record<string, Quiz>;
  categories: Record<string, CategoryData>;
  progress: ProgressData;
  loading: boolean;
  error: string | null;
  validateQuizzesEnabled: boolean;
  setValidateQuizzesEnabled: (enabled: boolean) => void;
  resetProgress: () => void;
  loadQuizzes: () => Promise<void>;
  updateProgress: (quizId: string, score: number) => void;
  // New function to update detailed question tracking
  updateQuestionTracking: (quizId: string, results: { questionIndex: number; isCorrect: boolean }[]) => void;
  // Function to get tracking data for a specific quiz
  getQuestionTrackingForQuiz: (quizId: string) => { [questionIndex: number]: QuestionStatus } | undefined;
  getQuizzesByCategory: (category: string) => Quiz[];
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [quizzes, setQuizzes] = useState<Record<string, Quiz>>({});
  const [categories, setCategories] = useState<Record<string, CategoryData>>({});
  const [progress, setProgress] = useState<ProgressData>(() => {
    const saved = localStorage.getItem('quizProgress');
    return saved ? JSON.parse(saved) : {};
  });
  const [questionTracking, setQuestionTracking] = useState<QuizQuestionTracking>(() => {
    const saved = localStorage.getItem('quizQuestionTracking');
    return saved ? JSON.parse(saved) : {};
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validateQuizzesEnabled, setValidateQuizzesState] = useState<boolean>(() => {
    const saved = localStorage.getItem('validateQuizzes');
    return saved ? JSON.parse(saved) : false; // Default to off
  });

  // Persist validation setting
  const setValidateQuizzesEnabled = useCallback((enabled: boolean) => {
    localStorage.setItem('validateQuizzes', JSON.stringify(enabled));
    setValidateQuizzesState(enabled);
    // Optionally reload quizzes when setting changes? Or just apply on next load.
    // For simplicity, we'll apply on next manual load or refresh for now.
  }, []);

  // Reset progress function
  const resetProgress = useCallback(() => {
    localStorage.removeItem('quizProgress');
    localStorage.removeItem('quizQuestionTracking'); // Clear detailed tracking too
    setProgress({});
    setQuestionTracking({}); // Reset tracking state
    // Recalculate categories with empty progress
    calculateCategories(quizzes, {});
  }, [quizzes]); // Include quizzes dependency for calculateCategories

  const updateProgress = (quizId: string, score: number) => {
    setProgress(prev => {
      const newProgress = {
        ...prev,
        [quizId]: {
          attempts: (prev[quizId]?.attempts || 0) + 1,
          highestScore: Math.max(prev[quizId]?.highestScore || 0, score),
          lastAttempt: new Date().toISOString()
        }
      };
      localStorage.setItem('quizProgress', JSON.stringify(newProgress));
      // Recalculate categories after progress update
      calculateCategories(quizzes, newProgress); 
      return newProgress;
    });
  };

  // Function to update detailed question tracking after a quiz session
  const updateQuestionTracking = useCallback((quizId: string, results: { questionIndex: number; isCorrect: boolean }[]) => {
    setQuestionTracking(prev => {
      const newTracking = { ...prev };
      if (!newTracking[quizId]) {
        newTracking[quizId] = {};
      }
      const quizTracking = { ...newTracking[quizId] };

      results.forEach(({ questionIndex, isCorrect }) => {
        // Update status: mark as seen, update correctness
        // If already correct, keep it correct. Otherwise, update with the latest result.
        const currentStatus = quizTracking[questionIndex];
        const nowIso = new Date().toISOString();
        quizTracking[questionIndex] = {
          seen: true,
          correct: currentStatus?.correct === true ? true : isCorrect,
          lastSeen: nowIso,
          correctCount: (currentStatus?.correctCount || 0) + (isCorrect ? 1 : 0),
          incorrectCount: (currentStatus?.incorrectCount || 0) + (isCorrect ? 0 : 1),
        };
      });

      newTracking[quizId] = quizTracking;
      localStorage.setItem('quizQuestionTracking', JSON.stringify(newTracking));
      return newTracking;
    });
  }, []);

  // Function to retrieve tracking data for a specific quiz
  const getQuestionTrackingForQuiz = useCallback((quizId: string): { [questionIndex: number]: QuestionStatus } | undefined => {
      return questionTracking[quizId];
  }, [questionTracking]);

  const calculateCategories = (loadedQuizzes: Record<string, Quiz>, currentProgress: ProgressData) => {
    const categoryMap: Record<string, CategoryData> = {};
    Object.values(loadedQuizzes).forEach(quiz => {
      if (!categoryMap[quiz.category]) {
        categoryMap[quiz.category] = {
          name: quiz.category,
          quizCount: 0,
          completedCount: 0,
          averageScore: 0
        };
      }
      categoryMap[quiz.category].quizCount++;
      
      if (currentProgress[quiz.id]) {
        categoryMap[quiz.category].completedCount++;
        categoryMap[quiz.category].averageScore += 
          currentProgress[quiz.id].highestScore;
      }
    });
    
    Object.keys(categoryMap).forEach(category => {
      if (categoryMap[category].completedCount > 0) {
        categoryMap[category].averageScore = 
          Math.round(categoryMap[category].averageScore / 
                    categoryMap[category].completedCount);
        }
      });
    setCategories(categoryMap);
  };

  const loadQuizzes = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const quizModules = import.meta.glob('/quizzes/**/*.json');
      const loadedQuizzes: Record<string, Quiz> = {};

      for (const path in quizModules) {
        try {
          // The glob import already parses JSON, but let's assume it might fail
          // or we might load from elsewhere later.
          const rawData = await quizModules[path]() as { default: unknown };
          const quizData = rawData.default;

          // --- Optional Validation Step ---
          if (validateQuizzesEnabled) {
            const { isValid, validQuiz } = validateQuizPartial(quizData);
            if (!isValid || !validQuiz) {
              console.warn(`Skipping invalid or empty quiz: ${path}`);
              continue; // Skip this quiz
            }
            loadedQuizzes[validQuiz.id] = validQuiz;
          } else {
            // --- Basic Structure Check (if validation is off) ---
            // Perform minimal checks to avoid runtime errors if validation is off
            const q = quizData as any; // Use 'any' carefully here
            if (!q || !q.id || typeof q.id !== 'string' || !q.title || typeof q.title !== 'string' || !q.category || typeof q.category !== 'string' || !Array.isArray(q.questions)) {
               console.warn(`Skipping quiz with basic structural issues (validation off): ${path}`);
               continue;
            }
            // Assume the structure is mostly correct if validation is off
            loadedQuizzes[q.id] = q as Quiz;
          }
        } catch (err) {
          console.error(`Error loading quiz from ${path}:`, err);
        }
      }

      setQuizzes(loadedQuizzes);
      calculateCategories(loadedQuizzes, progress);
    } catch (err) {
      setError('Failed to load quizzes. Please try again later.');
      console.error('Quiz loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuizzes();
    // No need to reload quizzes when progress changes, just recalculate categories
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Load quizzes only once on mount

  return (
    <QuizContext.Provider value={{ 
      quizzes,
      categories,
      progress,
      loading,
      error,
      validateQuizzesEnabled,
      setValidateQuizzesEnabled,
      resetProgress,
      loadQuizzes,
      updateProgress,
      updateQuestionTracking, // Expose new function
      getQuestionTrackingForQuiz, // Expose getter
      getQuizzesByCategory: (category: string) =>
        Object.values(quizzes).filter(q => q.category === category)
    }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};
