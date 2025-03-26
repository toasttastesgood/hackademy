import React, { createContext, useContext, useEffect, useState } from 'react';

interface Question {
  text: string;
  type: 'mcq' | 'true_false' | 'code';
  correctAnswers: (string | boolean)[];
  wrongAnswers?: string[];
  options?: string[]; // Only for true_false questions
  answer?: string | number; // Legacy field for backward compatibility
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

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
      return newProgress;
    });
  };

  const loadQuizzes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Dynamically import all quiz files from the quizzes directory
      const quizModules = import.meta.glob('/quizzes/**/*.json');
      const loadedQuizzes: Record<string, Quiz> = {};

      for (const path in quizModules) {
        const module = await quizModules[path]() as { default: Quiz };
        const quiz = module.default;
        loadedQuizzes[quiz.id] = quiz;
      }

      setQuizzes(loadedQuizzes);
      
      // Calculate category data
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
        
        // Calculate average score for category
        if (progress[quiz.id]) {
          categoryMap[quiz.category].completedCount++;
          categoryMap[quiz.category].averageScore += 
            progress[quiz.id].highestScore;
        }
      });
      
      // Finalize average scores
      Object.keys(categoryMap).forEach(category => {
        if (categoryMap[category].completedCount > 0) {
          categoryMap[category].averageScore = 
            Math.round(categoryMap[category].averageScore / 
                      categoryMap[category].completedCount);
        }
      });
      setCategories(categoryMap);
    } catch (err) {
      setError('Failed to load quizzes. Please try again later.');
      console.error('Quiz loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuizzes();
  }, [progress]); // Recalculate when progress changes

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
