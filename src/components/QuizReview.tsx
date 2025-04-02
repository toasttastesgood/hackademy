import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuiz } from '../contexts/QuizProvider';
import Card from './Card/Card'; // Import the reusable Card component
import styles from './QuizReview.module.css';
import buttonStyles from './Button/Button.module.css';
// import cardStyles from './Card/Card.module.css'; // No longer needed directly

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
    <div className={styles.quizReview}>
      <h1>Quiz Review: {quiz.title}</h1>
      <Card className={styles.summary}> {/* Use Card for summary */}
        <h2>Your Score: {result.score}%</h2>
        <p>
          {result.correctAnswers} out of {result.totalQuestions} correct
        </p>
      </Card>

      <div className={styles.questionsReview}>
        {result.questions.map((q, index) => (
          <Card key={index} className={`${styles.question} ${q.correct ? styles.cardQuizResultCorrect : styles.cardQuizResultIncorrect}`}> {/* Use Card for question review */}
            <h3>Question {index + 1}</h3>
            <p>{q.text}</p>
            <div className={styles.explanation}>
              <p>{q.explanation}</p>
            </div>
          </Card>
        ))}
      </div>

      <button onClick={() => navigate('/')} className={`${buttonStyles.btn} ${buttonStyles.btnPrimary} ${styles.returnBtn} ${buttonStyles.btnRounded} ${styles.fixedReturnBtn}`}>
        Back to Quizzes
      </button>
    </div>
  );
};

export default QuizReview;
