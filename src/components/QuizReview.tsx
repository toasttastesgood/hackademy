import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuiz } from '../contexts/QuizProvider';

interface QuizResult {
  quizId: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  questions: {
    text: string;
    correct: boolean;
    explanation: string;
  }[];
}

const QuizReview: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { quizzes } = useQuiz();
  const result = location.state as QuizResult;
  const quiz = quizzes[result.quizId];

  if (!result || !quiz) {
    navigate('/');
    return null;
  }

  return (
    <div className="quiz-review">
      <h1>Quiz Review: {quiz.title}</h1>
      <div className="card summary">
        <h2>Your Score: {result.score}%</h2>
        <p>
          {result.correctAnswers} out of {result.totalQuestions} correct
        </p>
      </div>

      <div className="questions-review">
        {result.questions.map((q, index) => (
          <div key={index} className={`card question ${q.correct ? 'card--quiz-result-correct' : 'card--quiz-result-incorrect'}`}>
            <h3>Question {index + 1}</h3>
            <p>{q.text}</p>
            <div className="explanation">
              <p>{q.explanation}</p>
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => navigate('/')} className="btn btn--primary return-btn">
        Back to Quizzes
      </button>
    </div>
  );
};

export default QuizReview;
