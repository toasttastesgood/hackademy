import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuiz } from '../contexts/QuizProvider';
// Card import removed, now used within QuizQuestionCard
import styles from './QuizPlayer.module.css';
import buttonStyles from './Button/Button.module.css';
import QuizQuestionCard from './QuizQuestionCard'; // Import the new component
import {
  getQuestionComponent,
  validateQuestionAnswer
} from '../services/QuestionTypeRegistry';
import {
  Question, // Assuming Question union type is needed elsewhere or for clarity
  MCQQuestion,
  TrueFalseQuestion,
  HighlightedBytesQuestion,
  HexSelectionQuestion,
  DragDropQuestion
} from '../services/QuizValidator'; // Import specific types

// Define a union type for possible answer shapes
type AnswerType = string | number | boolean | string[];

interface ProcessedQuestion {
  original: Question; // Use the imported Question union type
  selectedAnswer: AnswerType | null; // Use the AnswerType union
}

const QuizPlayer: React.FC = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { quizzes, updateProgress } = useQuiz();

  const quiz = quizzes[quizId || ''];
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [processedQuestions, setProcessedQuestions] = useState<ProcessedQuestion[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<AnswerType | null>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!quiz) {
      console.error(`Quiz not found for ID: ${quizId}`);
      // Optionally: Add a user notification/toast here
      navigate('/', { replace: true }); // Navigate home if quiz doesn't exist
    }
  }, [quiz, quizId, navigate]); // Add dependencies

  // Render null or a loading indicator while checking/navigating
  if (!quiz) {
    return null; // Or <LoadingSpinner />;
  }

  const question = quiz.questions[currentQuestion];
  // QuestionComponent logic moved to QuizQuestionCard

  useEffect(() => {
    if (!quiz) return;

    const processed = quiz.questions.map(q => ({
      original: q,
      selectedAnswer: null
    }));

    setProcessedQuestions(processed);
  }, [quiz]);

  const processedQuestion = processedQuestions[currentQuestion] || {
    original: {},
    selectedAnswer: null
  };

  const handleAnswer = () => {
    if (selectedAnswer === null) return;

    const isCorrect = validateQuestionAnswer(
      question.type,
      question,
      selectedAnswer
    );

    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);

    // Update processed questions with the answer
    const updatedQuestions = [...processedQuestions];
    updatedQuestions[currentQuestion] = {
      ...processedQuestion,
      selectedAnswer
    };
    setProcessedQuestions(updatedQuestions);

    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      const finalScore = Math.round((newScore / quiz.questions.length) * 100);
      updateProgress(quiz.id, finalScore);
      navigate(`/quiz/${quiz.id}/review`, {
        state: {
          quizId: quiz.id,
          score: finalScore,
          correctAnswers: newScore,
          totalQuestions: quiz.questions.length,
          questions: quiz.questions.map((q, i) => {
            const selected = updatedQuestions[i]?.selectedAnswer;
            const isCorrect = validateQuestionAnswer(q.type, q, selected);

            // Determine the correct answer value based on question type
            let correctAnswerValue: AnswerType | undefined = undefined;
            if (q.type === 'mcq' || q.type === 'true_false' || q.type === 'highlighted_bytes') {
              // These types use the correctAnswers array
              const qWithType = q as MCQQuestion | TrueFalseQuestion | HighlightedBytesQuestion;
              if (Array.isArray(qWithType.correctAnswers) && qWithType.correctAnswers.length > 0) {
                correctAnswerValue = qWithType.correctAnswers[0];
              }
            } else if (q.type === 'hex_selection') {
              // Hex selection uses correctOffset
              correctAnswerValue = (q as HexSelectionQuestion).correctOffset;
            } else if (q.type === 'drag_drop') {
              // Drag drop uses itemOrder (might need specific handling in review)
              correctAnswerValue = (q as DragDropQuestion).itemOrder;
            }
            // Add more types here if needed

            return {
              originalQuestion: q,
              selectedAnswer: selected,
              isCorrect: isCorrect,
              correctAnswer: correctAnswerValue // Pass the determined value
            };
          })
        }
      });
    }
  };

  return (
    <div className={styles.quizPlayer}>
      <h1>{quiz.title}</h1>
      <QuizQuestionCard
        question={question}
        questionNumber={currentQuestion + 1}
        totalQuestions={quiz.questions.length}
        onAnswer={setSelectedAnswer}
        isAnswered={processedQuestion.selectedAnswer !== null}
      />

      <button
        className={`${buttonStyles.btnPrimary} ${styles.actionButton} ${buttonStyles.btnRounded}`}
        onClick={handleAnswer}
        disabled={selectedAnswer === null}
      >
        {currentQuestion < quiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
      </button>
    </div>
  );
};

export default QuizPlayer;
