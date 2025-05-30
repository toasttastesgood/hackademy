import React, { useState, useEffect, useCallback } from 'react'; // Removed useRef
import { useParams, useNavigate } from 'react-router-dom';
import { useQuiz } from '../contexts/QuizProvider';
import { useQuizTitle } from '../contexts/QuizTitleContext';
import { useSettings } from '../contexts/SettingsContext'; // Import useSettings
import styles from './QuizPlayer.module.css';
import CircularProgress from './CircularProgress';
// Button import removed, handled by QuizNavigation
import QuizQuestionCard from './QuizQuestionCard';
import {
  validateQuestionAnswer
} from '../services/QuestionTypeRegistry';
// Question type imports remain for calculating correct answer value
import {
  MCQQuestion,
  HighlightedBytesQuestion,
  HexSelectionQuestion,
  DragDropQuestion
} from '../services/QuizTypes';
// QuestionStatus import removed (was unused)
// Fa icons removed, handled by QuizNavigation
// selectQuestions, SessionQuestion imports removed, handled by useQuizSession
import { useQuizSession } from '../hooks/useQuizSession'; // Import the session hook
import { useInstantFeedback } from '../hooks/useInstantFeedback'; // Import the feedback hook
import QuizNavigation from './QuizNavigation'; // Import the navigation component
// validateQuestionAnswer is already imported above

// AnswerType and SessionResult are defined/imported within hooks
type AnswerType = string | number | boolean | string[]; // Keep for local calculation if needed
interface SessionResult { // Keep for local calculation if needed
  questionIndex: number; // Original index
  selectedAnswer: AnswerType | null;
  isCorrect: boolean;
  correctAnswer: AnswerType | undefined | null;
}


// SessionResult interface moved up or handled by hook import

// localStorage Keys and defaults for feedback removed, now handled by SettingsContext

// shuffleArray helper removed, handled by useQuizSession


const QuizPlayer: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { updateProgress, updateQuestionTracking } = useQuiz();
  const { setQuizTitle } = useQuizTitle();
  const { settings, isSettingsLoaded } = useSettings();

  // Timer state: elapsed seconds
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Start timer on mount, stop on unmount or quiz finish
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isSettingsLoaded && !isNaN(elapsedSeconds)) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSettingsLoaded]);

  // Reset timer when quizId changes (new quiz)
  useEffect(() => {
    setElapsedSeconds(0);
  }, [quizId]);

  // Format elapsed time as mm:ss
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };


  const handleSessionLoaded = useCallback((loadedQuizTitle: string | undefined, totalQuestions: number) => {
    setQuizTitle(loadedQuizTitle);
  }, [setQuizTitle]);

  const {
    quizSession,
    currentQuestionData,
    isLoading: isSessionLoading,
    error: sessionError,
    answerQuestion,
    lockAnswer,
    nextQuestion,
    previousQuestion,
    finishQuiz,
    updateQuizSession,
  } = useQuizSession({ quizId, onSessionLoaded: handleSessionLoaded });

  const totalSessionQuestions = quizSession?.questions.length ?? 0;
  const currentSessionIndex = quizSession?.currentIndex ?? 0;

  // Calculate progress percentage (memoized)
  const progressPercent = React.useMemo(() => {
    return totalSessionQuestions > 0
      ? Math.round(((currentSessionIndex + 1) / totalSessionQuestions) * 100)
      : 0;
  }, [totalSessionQuestions, currentSessionIndex]);

  // Calculate score so far (memoized)
  const correctSoFar = React.useMemo(() => {
    return quizSession
      ? quizSession.questions.filter((q, idx) => q.isCorrect && idx <= currentSessionIndex).length
      : 0;
  }, [quizSession, currentSessionIndex]);

  const finishQuizCallback = useCallback(() => {
    if (!quizSession || !quizId) {
      console.error("finishQuiz called without quizSession or quizId.");
      return;
    }

    const finalCorrectCount = quizSession.questions.filter(q => q.isCorrect).filter(c => c).length;
    const finalScorePercent = totalSessionQuestions > 0
      ? Math.round((finalCorrectCount / totalSessionQuestions) * 100)
      : 0;

    updateProgress(quizId, finalScorePercent);

    const trackingUpdates = quizSession.questions.map(q => ({
      questionIndex: q.originalIndex,
      isCorrect: q.isCorrect ?? false,
    }));
    updateQuestionTracking(quizId, trackingUpdates);

    const reviewQuestions = quizSession.questions.map(q => ({
      originalQuestion: q.originalQuestion,
      selectedAnswer: q.userAnswer,
      isCorrect: q.isCorrect ?? false,
      correctAnswer: q.correctAnswer,
    }));

    navigate(`/quiz/${quizId}/review`, {
      state: {
        quizId,
        score: finalScorePercent,
        correctAnswers: finalCorrectCount,
        totalQuestions: totalSessionQuestions,
        questions: reviewQuestions,
      },
    });
  }, [quizSession, quizId, totalSessionQuestions, updateProgress, updateQuestionTracking, navigate]);

  // Callback for when feedback timer completes
  const handleFeedbackComplete = useCallback(() => {
    // This function will now be called by the useInstantFeedback hook
    if (currentSessionIndex < totalSessionQuestions - 1) {
      nextQuestion();
    } else {
      finishQuizCallback();
    }
  }, [currentSessionIndex, totalSessionQuestions, nextQuestion, finishQuizCallback]);


  const {
    feedbackCorrectAnswer, // Correct answer value during feedback
    startFeedback,
    clearFeedback,
  } = useInstantFeedback({
    delaySeconds: settings.quizInstantFeedbackDelay, // Use delay from settings
    onFeedbackComplete: handleFeedbackComplete,
  });

  // Use unified state for feedback display
  const isShowingFeedback = !!currentQuestionData?.feedbackShown;

  // Effect to load settings from localStorage removed

  // --- Effect to clear feedback on quiz change ---
   useEffect(() => {
    // Clear feedback if the quizId changes or the session is reset by the hook
    return () => {
      clearFeedback();
    };
  }, [quizId, clearFeedback]); // Depend on quizId and the clearFeedback function itself

  // Old effects for session loading and timer cleanup are removed (handled by hooks)


  // --- Action Handlers ---

  // Toggle Shuffle - Now calls the hook's function
  const handleToggleSessionShuffle = useCallback(() => {
    if (isShowingFeedback) return; // Still prevent during feedback
    // shuffle toggle removed or to be reimplemented
  }, [isShowingFeedback]);

  // Previous Question - Now calls the hook's function
  const handlePreviousQuestion = useCallback(() => {
    if (isShowingFeedback) return; // Still prevent during feedback
    previousQuestion();
  }, [isShowingFeedback, previousQuestion]);

  // Answer Handling - Uses hook's handler, logic for disabling moved to component/card
  // const handleSetAnswer = useCallback((answer: AnswerType | null) => { ... } // Now provided by useQuizSession

  // --- Derived State ---
  const currentSelectedAnswer = currentQuestionData?.userAnswer ?? null;
  const isAnswerLocked = currentQuestionData?.isLocked ?? false;

  // --- Finish Quiz Logic ---
  // Needs to be defined before handleFeedbackComplete dependency array
  // Moved *before* loading/error checks to comply with Rules of Hooks

  // Add finishQuiz to handleFeedbackComplete dependency array now that it's defined
  // Moved *before* loading/error checks to comply with Rules of Hooks
  useEffect(() => {
      // This effect is just to correctly list dependencies for the useCallback above
      // handleFeedbackComplete's definition relies on finishQuiz
  }, [handleFeedbackComplete, finishQuiz]);


  // --- Handle Next / Finish ---
  // Moved *before* loading/error checks to comply with Rules of Hooks
  const handleNextOrFinish = useCallback(() => {
    // Check if the answer is already locked *before* doing anything else
    // removed obsolete sessionResults lookup

    // If locked, just proceed without re-evaluating or showing feedback again
    if (currentQuestionData?.isLocked) {
      if (currentSessionIndex < totalSessionQuestions - 1) {
        nextQuestion();
      } else {
        finishQuizCallback();
      }
      return;
    }

    // --- Continue with original logic only if answer is not locked ---
    if (isShowingFeedback) return;
    // Add check for currentSessionQuestionData inside the callback
    if (currentSelectedAnswer === null || !currentQuestionData) return;

    const { originalIndex, originalQuestion } = currentQuestionData;
    const isCorrect = validateQuestionAnswer(originalQuestion.type, originalQuestion, currentSelectedAnswer);

    let correctAnswerValue: AnswerType | null = null;
    if (originalQuestion.type === 'mcq' || originalQuestion.type === 'highlighted_bytes') {
      const qWithType = originalQuestion as MCQQuestion | HighlightedBytesQuestion;
      if (Array.isArray(qWithType.correctAnswers) && qWithType.correctAnswers.length > 0) {
        correctAnswerValue = qWithType.correctAnswers[0];
      }
    } else if (originalQuestion.type === 'hex_selection') {
      correctAnswerValue = (originalQuestion as HexSelectionQuestion).correctOffset;
    } else if (originalQuestion.type === 'drag_drop') {
      correctAnswerValue = (originalQuestion as DragDropQuestion).itemOrder;
    }

    updateQuizSession(prev => {
      const updated = { ...prev };
      const q = updated.questions[updated.currentIndex];
      q.userAnswer = currentSelectedAnswer;
      q.isLocked = settings.quizInstantFeedbackEnabled;
      q.isCorrect = isCorrect;
      q.correctAnswer = correctAnswerValue;
      q.feedbackShown = settings.quizInstantFeedbackEnabled;
      return updated;
    });

    if (settings.quizInstantFeedbackEnabled) {
      startFeedback(correctAnswerValue);
    } else {
      if (currentSessionIndex < totalSessionQuestions - 1) {
        nextQuestion();
      } else {
        finishQuizCallback();
      }
    }
  }, [
    isShowingFeedback,
    currentSelectedAnswer,
    currentQuestionData,
    settings.quizInstantFeedbackEnabled,
    updateQuizSession,
    startFeedback,
    currentSessionIndex,
    totalSessionQuestions,
    nextQuestion,
    finishQuiz
  ]);


  // --- Loading/Error Handling ---
  // Now hooks are defined above, so these early returns are safe
  if (!isSettingsLoaded) return <div>Loading Quiz...</div>;
  if (sessionError) return <div>Error: {sessionError}</div>;
  if (!quizSession) return <div>Quiz data not available.</div>;
  if (totalSessionQuestions === 0 && !isSessionLoading && !sessionError) {
      return <div>This quiz has no questions or none could be selected.</div>;
  };


  // finishQuiz, useEffect, and handleNextOrFinish hooks moved above loading checks

  // proceedToNextOrFinish helper removed (logic integrated into handleNextOrFinish and handleFeedbackComplete)
  // finishQuiz helper moved up


  // --- Render ---
  // Add a check here: if we passed loading/error checks but still don't have
  // currentSessionQuestionData (e.g., totalSessionQuestions is 0), we shouldn't render the card/nav.
  // The check added above handles the "no questions" message.
  return (
    <div className={styles.quizPlayer}>
      {/* Progress and Timer Section */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div className={styles.progressText}>
          Question {currentSessionIndex + 1} of {totalSessionQuestions}
        </div>
        <CircularProgress percentage={progressPercent} size={40} />
        <div className={styles.progressText}>
          Time: {formatTime(elapsedSeconds)}
        </div>
      </div>

      {/* Loading overlay for lazy loading next question */}
      {isSessionLoading && (
        <div style={{ textAlign: 'center', margin: '2rem 0' }}>
          <CircularProgress percentage={100} size={48} />
          <div>Loading next question...</div>
        </div>
      )}

      {/* Title is now set via context in handleSessionLoaded */}
      {/* <h1>{quiz?.title}</h1> */}

      {/* Render card and nav only if currentSessionQuestionData exists and not loading */}
      {!isSessionLoading && currentQuestionData ? (
        <>
          {/* Instant Feedback Section */}
          {(isShowingFeedback || isAnswerLocked) && (
            <div className={styles.scoreSummary} style={{ marginBottom: 12 }}>
              {currentQuestionData.isCorrect === true ? (
                <span style={{ color: 'var(--success-color)' }}>Correct!</span>
              ) : currentQuestionData.isCorrect === false ? (
                <span style={{ color: 'var(--error-color)' }}>Incorrect</span>
              ) : null}
              <div style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
                Score so far: {correctSoFar} / {currentSessionIndex + 1}
              </div>
            </div>
          )}

          <QuizQuestionCard
            key={`${quizId}-${currentQuestionData.originalIndex}-${currentSessionIndex}`}
            question={currentQuestionData.originalQuestion}
            questionNumber={currentSessionIndex + 1}
            totalQuestions={totalSessionQuestions}
            onAnswer={(answer) => {
              if (answer !== null) {
                answerQuestion(answer);
              }
            }}
            // Feedback props
            isShowingFeedback={isShowingFeedback}
            correctAnswerValueForFeedback={currentQuestionData.correctAnswer}
            // State props
            isDisabled={isShowingFeedback || isAnswerLocked}
            currentAnswer={currentSelectedAnswer}
            instantFeedbackEnabled={settings.quizInstantFeedbackEnabled}
            isAnswerLocked={isAnswerLocked}
          />
          <QuizNavigation
            onPrevious={handlePreviousQuestion}
            onNextOrFinish={handleNextOrFinish}
            isPreviousDisabled={currentSessionIndex === 0}
            isNextDisabled={currentSelectedAnswer === null}
            isLastQuestion={currentSessionIndex === totalSessionQuestions - 1}
            isShowingFeedback={isShowingFeedback}
          />
        </>
      ) : null}
    </div>
  );
};

export default QuizPlayer;
