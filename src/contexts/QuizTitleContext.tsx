import React, { createContext, useState, useContext } from 'react';

interface QuizTitleContextProps {
  quizTitle: string | undefined;
  setQuizTitle: (title: string | undefined) => void;
}

const QuizTitleContext = createContext<QuizTitleContextProps>({
  quizTitle: undefined,
  setQuizTitle: () => {},
});

export const useQuizTitle = () => useContext(QuizTitleContext);

export const QuizTitleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [quizTitle, setQuizTitle] = useState<string | undefined>(undefined);

  return (
    <QuizTitleContext.Provider value={{ quizTitle, setQuizTitle }}>
      {children}
    </QuizTitleContext.Provider>
  );
};