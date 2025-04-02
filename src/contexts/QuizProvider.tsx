import React, { createContext, useContext, useEffect, useState } from 'react';

interface BaseQuestion {
  text: string;
  type: 'mcq' | 'true_false' | 'hex_selection' | 'highlighted_bytes' | 'drag_drop';
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface MCQQuestion extends BaseQuestion {
  type: 'mcq';
  correctAnswers: string[];
  wrongAnswers?: string[];
  options: Array<{ id: string; text: string }>;
}

interface TrueFalseQuestion extends BaseQuestion {
  type: 'true_false';
  correctAnswer: boolean;
}

interface HexSelectionQuestion extends BaseQuestion {
  type: 'hex_selection';
  hexDump: string;
  correctOffset: number;
  fieldLength: number;
  bytesPerLine?: number;
}

interface HighlightedBytesQuestion extends BaseQuestion {
  type: 'highlighted_bytes';
  hexDump: string;
  correctAnswer: string;
}

interface DragDropQuestion extends BaseQuestion {
  type: 'drag_drop';
  itemOrder: string[];
}

type Question = MCQQuestion | TrueFalseQuestion | HexSelectionQuestion | HighlightedBytesQuestion | DragDropQuestion;

interface Quiz {
  id: string;
  category: string;
  title: string;
  description: string;
  questions: Question[];
}

interface ProgressData {
  [quizId: string]: {
    attempts: number;
    highestScore: number;
    lastAttempt: string;
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
  loadQuizzes: () => Promise<void>;
  updateProgress: (quizId: string, score: number) => void;
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          const module = await quizModules[path]() as { default: Quiz };
          const quiz = module.default;
          
          // Validate basic quiz structure
          if (!quiz || !quiz.id || !quiz.category || !quiz.title || !Array.isArray(quiz.questions)) {
            console.warn(`Skipping invalid quiz file: ${path}`);
            continue;
          }

          // Transform and validate questions
          const transformedQuestions: Question[] = [];
          for (const q of quiz.questions) {
            try {
              // Validate common fields
              if (!q.text || !q.type || !q.explanation || !q.difficulty) {
                throw new Error('Missing required question fields');
              }

              // Type-specific transformation and validation
              if (q.type === 'mcq') {
                if (!q.correctAnswers || !Array.isArray(q.correctAnswers)) {
                  throw new Error('MCQ question missing correctAnswers array');
                }
                transformedQuestions.push({
                  ...q,
                  type: 'mcq',
                  options: [...(q.correctAnswers || []), ...(q.wrongAnswers || [])].map((text, i) => ({
                    id: `opt-${i}`,
                    text: String(text)
                  }))
                });
              } else {
                // For other question types, just validate they match their interfaces
                transformedQuestions.push(q as Question);
              }
            } catch (err) {
              const error = err as Error;
              console.warn(`Skipping invalid question in ${quiz.id}:`, error.message);
            }
          }

          if (transformedQuestions.length > 0) {
            loadedQuizzes[quiz.id] = {
              ...quiz,
              questions: transformedQuestions
            };
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
      loadQuizzes,
      updateProgress,
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
