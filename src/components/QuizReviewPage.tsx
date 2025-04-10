import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import QuizQuestionCard from './QuizQuestionCard';
import styles from './QuizPlayer.module.css'; // Reuse existing layout styles
import buttonStyles from './Button/Button.module.css';

const QuizReviewPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as {
    quizId: string;
    score: number;
    correctAnswers: number;
    totalQuestions: number;
    questions: Array<{
      originalQuestion: any;
      selectedAnswer: any;
      isCorrect: boolean;
      correctAnswer: any;
    }>;
  } | undefined;

  if (!state) {
    return (
      <div className={styles.quizPlayer}>
        <h1>Quiz Review</h1>
        <p>Error: No review data found.</p>
        <button
          className={`${buttonStyles.btn} ${buttonStyles.btnPrimary}`}
          onClick={() => navigate('/')}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const { quizId, score, correctAnswers, totalQuestions, questions } = state;

  const getScoreColor = () => {
    if (score >= 80) return 'var(--success-color)';
    if (score >= 50) return 'var(--warning-color)';
    return 'var(--error-color)';
  };

  return (
    <div className={styles.quizPlayer}>
      <h1>Quiz Review</h1>
      <div className={styles.scoreSummary}>
        <span style={{ color: getScoreColor() }}>
          You scored {correctAnswers} out of {totalQuestions} ({score}%)
        </span>
      </div>

      {questions.map((q, idx) => (
        <div
          key={idx}
          className={q.isCorrect ? styles.correctBorder : styles.incorrectBorder}
          style={{ marginBottom: '2rem' }}
        >
          <QuizQuestionCard
            question={q.originalQuestion}
            questionNumber={idx + 1}
            totalQuestions={totalQuestions}
            onAnswer={() => {}}
            currentAnswer={q.selectedAnswer}
            isShuffleActive={false}
            onToggleShuffle={() => {}}
            isShowingFeedback={true}
            correctAnswerValueForFeedback={q.correctAnswer}
            isDisabled={true}
            instantFeedbackEnabled={true}
            isAnswerLocked={true}
          />
        </div>
      ))}

      <div className={styles.navigationButtons}>
        <button
          className={`${buttonStyles.btn} ${buttonStyles.btnOutline} ${styles.navButton}`}
          onClick={() => navigate(`/quiz/${quizId}`)}
        >
          Retake Quiz
        </button>
        <button
          className={`${buttonStyles.btn} ${buttonStyles.btnPrimary} ${styles.navButton}`}
          onClick={() => navigate('/')}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default QuizReviewPage;