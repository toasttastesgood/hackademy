import React, { useState } from 'react'; // Import useState
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuiz } from '../contexts/QuizProvider';
import Card from './Card/Card';
import styles from './QuizReview.module.css';
import buttonStyles from './Button/Button.module.css';
// Import function to get the correct answer display logic if needed
// import { getQuestionAnswerDisplay } from '../services/QuestionTypeRegistry'; // Assuming this exists or needs creation

interface QuestionReviewData {
  originalQuestion: any; // Contains text, options, explanation, type etc.
  selectedAnswer: any;
  isCorrect: boolean;
  correctAnswer: any; // Explicitly passed correct answer
}

interface QuizResult {
  quizId: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  questions: QuestionReviewData[]; // Use the new interface
}

// Helper function to render options with added safety checks
const renderOptions = (questionData: QuestionReviewData) => {
  // Use the explicitly passed correctAnswer
  const { originalQuestion, selectedAnswer, correctAnswer } = questionData;

  // Defensive checks for potentially missing properties
  const options = originalQuestion?.options;
  const questionType = originalQuestion?.type;

  // Fallback for non-MCQ or missing options/correctAnswer
  if (questionType !== 'multiple-choice' || !Array.isArray(options)) {
    return (
      <div className={styles.answerDetails}>
        <p><strong>Your Answer:</strong> {JSON.stringify(selectedAnswer ?? 'Not Answered')}</p>
        {/* Restore conditional display, ensuring it handles false/0 */}
        {correctAnswer !== undefined && correctAnswer !== null ? (
          <p><strong>Correct Answer:</strong> {JSON.stringify(correctAnswer)}</p>
        ) : (
          // Display nothing or a more appropriate message if no correct answer is applicable/available
          // For instance, if the question type doesn't have a single 'correctAnswer' field
          null // Or <p>Correct Answer: N/A</p> if preferred
        )}
      </div>
    );
  }

  // Render MCQ options
  return (
    <ul className={styles.optionsList}>
      {options.map((option: string, index: number) => {
        const isUserSelection = selectedAnswer === option;
        // Use the top-level correctAnswer for comparison
        const isActuallyCorrect = correctAnswer !== undefined && correctAnswer !== null && correctAnswer === option;
        let optionClass = styles.optionItem;

        if (isUserSelection && isActuallyCorrect) {
          optionClass += ` ${styles.optionSelectedCorrect}`;
        } else if (isUserSelection && !isActuallyCorrect) {
          optionClass += ` ${styles.optionSelectedIncorrect}`;
        } else if (isActuallyCorrect) {
          optionClass += ` ${styles.optionCorrectUnselected}`;
        }

        return (
          <li key={index} className={optionClass}>
            {option}
            {/* Labeling Logic */}
            {isUserSelection && !isActuallyCorrect ? (
              ` (Your Answer)`
            ) : isActuallyCorrect ? (
              ` (Correct Answer)`
            ) : null}
          </li>
        );
      })}
    </ul>
  );
};


const QuizReview: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { quizzes } = useQuiz();
  const result = location.state as QuizResult;
  const quiz = result ? quizzes[result.quizId] : null; // Check if result exists

  // State to track which explanations are shown
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});

  if (!result || !quiz) {
    // Redirect immediately if data is missing
    navigate('/');
    return null;
  }

  const toggleExplanation = (index: number) => {
    setShowExplanation(prev => ({ ...prev, [index]: !prev[index] }));
  };

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
          <Card
            key={index}
            // Apply border style based on correctness
            className={`${styles.reviewQuestion} ${qData.isCorrect ? styles.resultCorrect : styles.resultIncorrect}`}
          >
            {/* Explanation Toggle Button */}
            <button
              onClick={() => toggleExplanation(index)}
              className={styles.explanationToggle}
              aria-label={showExplanation[index] ? "Hide explanation" : "Show explanation"}
              aria-expanded={showExplanation[index]}
            >
              ?
            </button>

            <h3>Question {index + 1}</h3>
            <p className={styles.questionText}>{qData.originalQuestion.text}</p>

            {/* Render Answer Options */}
            {renderOptions(qData)}

            {/* Conditionally Render Explanation */}
            {showExplanation[index] && (
              <div className={styles.explanation}>
                <h4>Explanation</h4>
                <p>{qData.originalQuestion.explanation}</p>
              </div>
            )}
          </Card>
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
