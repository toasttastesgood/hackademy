import React from 'react'; // Removed useState import
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuiz } from '../contexts/QuizProvider';
import Card from './Card/Card';
import styles from './QuizReview.module.css';
import buttonStyles from './Button/Button.module.css';
import { Question } from '../services/QuizValidator'; // Import Question type
import QuizReviewItem from './QuizReviewItem'; // Import the new component
// Import function to get the correct answer display logic if needed
// import { getQuestionAnswerDisplay } from '../services/QuestionTypeRegistry'; // Assuming this exists or needs creation

// Define a union type for possible answer shapes (matching QuizPlayer)
type AnswerType = string | number | boolean | string[];

interface QuestionReviewData {
  originalQuestion: Question; // Use the imported Question union type
  selectedAnswer: AnswerType | null; // Use AnswerType, allow null
  isCorrect: boolean;
  correctAnswer: AnswerType | undefined | null; // Use AnswerType, allow undefined/null
}

interface QuizResult {
  quizId: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  questions: QuestionReviewData[]; // Use the new interface
}

// renderOptions function moved to QuizReviewItem.tsx


const QuizReview: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { quizzes } = useQuiz();
  const result = location.state as QuizResult;
  const quiz = result ? quizzes[result.quizId] : null; // Check if result exists
  // State and toggle function moved to QuizReviewItem.tsx

  if (!result || !quiz) {
    // Redirect immediately if data is missing
    navigate('/');
    return null;
  }

  // Removed toggleExplanation function placeholder comment

  return (
    <div className={styles.quizReview}>
      <h1>Quiz Review: {quiz.title}</h1>
      <Card className={styles.summary}>
        <h2>Your Score: {result.score}%</h2>
        <p>
          {result.correctAnswers} out of {result.totalQuestions} correct
        </p>
      </Card>

      <div className={styles.questionsReview}>
        {result.questions.map((qData, index) => (
          <QuizReviewItem key={index} qData={qData} index={index} />
        ))}
      </div>

      <button
        onClick={() => navigate('/')}
        // Combine button styles correctly
        className={`${buttonStyles.btn} ${buttonStyles.btnPrimary} ${buttonStyles.btnRounded} ${styles.returnBtn}`}
      >
        Back to Quizzes
      </button>
    </div>
  );
};

export default QuizReview;
