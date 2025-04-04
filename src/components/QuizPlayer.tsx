import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuiz } from '../contexts/QuizProvider';
import Card from './Card/Card';
import styles from './QuizPlayer.module.css';
import buttonStyles from './Button/Button.module.css';
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

interface ProcessedQuestion {
  original: any;
  selectedAnswer: any;
}

const QuizPlayer: React.FC = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { quizzes, updateProgress } = useQuiz();

  const quiz = quizzes[quizId || ''];
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [processedQuestions, setProcessedQuestions] = useState<ProcessedQuestion[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null);
  const [score, setScore] = useState(0);

  if (!quiz) {
    return <div>Quiz not found</div>;
  }

  const question = quiz.questions[currentQuestion];
  const QuestionComponent = getQuestionComponent(question.type);

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
            let correctAnswerValue: any = undefined;
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
      <Card className={styles.question}>
        <h2>Question {currentQuestion + 1} of {quiz.questions.length}</h2>
        <p>{question.text}</p>
        
        {QuestionComponent && (
          <QuestionComponent
            question={question}
            onAnswer={setSelectedAnswer}
            disabled={processedQuestion.selectedAnswer !== null}
          />
        )}
      </Card>

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
