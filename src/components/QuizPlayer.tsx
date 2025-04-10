import React, { useState, useEffect, useCallback, useRef } from 'react'; // Added useRef
import { useParams, useNavigate } from 'react-router-dom';
import { useQuiz } from '../contexts/QuizProvider';
import { useQuizTitle } from '../contexts/QuizTitleContext';
import styles from './QuizPlayer.module.css';
import buttonStyles from './Button/Button.module.css';
import QuizQuestionCard from './QuizQuestionCard';
import {
  validateQuestionAnswer
} from '../services/QuestionTypeRegistry';
import {
  Question,
  MCQQuestion,
  HighlightedBytesQuestion,
  HexSelectionQuestion,
  DragDropQuestion
} from '../services/QuizTypes';
import { QuestionStatus } from '../contexts/QuizProvider';
import { FaRandom, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { selectQuestions, SessionQuestion } from '../services/QuestionSelector';

// Define AnswerType locally or import if shared
type AnswerType = string | number | boolean | string[];


interface SessionResult {
  questionIndex: number; // Original index
  selectedAnswer: AnswerType | null;
  isCorrect: boolean;
  correctAnswer: AnswerType | undefined | null;
}

// localStorage Keys
const QUIZ_QUESTIONS_COUNT_KEY = 'quizQuestionsCount';
const QUIZ_SHUFFLE_ENABLED_KEY = 'quizShuffleEnabled';
const QUIZ_INSTANT_FEEDBACK_ENABLED_KEY = 'quizInstantFeedbackEnabled';
const QUIZ_INSTANT_FEEDBACK_DELAY_KEY = 'quizInstantFeedbackDelay';

// Defaults
const DEFAULT_QUESTIONS_COUNT = 20;
const DEFAULT_FEEDBACK_DELAY = 3; // Default delay in seconds

// Helper function to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}


const QuizPlayer: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const {
    quizzes,
    updateProgress,
    getQuestionTrackingForQuiz,
    updateQuestionTracking
  } = useQuiz();
  const { setQuizTitle } = useQuizTitle();

  const quiz = quizId ? quizzes[quizId] : undefined;

  // --- State ---
  const [currentSessionIndex, setCurrentSessionIndex] = useState(0);
  const [sessionQuestions, setSessionQuestions] = useState<SessionQuestion[]>([]);
  const [sessionAnswers, setSessionAnswers] = useState<Record<number, AnswerType | null>>({});
  const [sessionResults, setSessionResults] = useState<SessionResult[]>([]);
  const [isSessionShuffleActive, setIsSessionShuffleActive] = useState<boolean>(true);
  // Instant Feedback State
  const [isShowingFeedback, setIsShowingFeedback] = useState<boolean>(false);
  const [feedbackCorrectAnswer, setFeedbackCorrectAnswer] = useState<AnswerType | null | undefined>(null);
  const [instantFeedbackEnabled, setInstantFeedbackEnabled] = useState<boolean>(false);
  const [feedbackDelay, setFeedbackDelay] = useState<number>(DEFAULT_FEEDBACK_DELAY);
  const feedbackTimerRef = useRef<NodeJS.Timeout | null>(null); // Ref for the timer

  // --- Load Settings ---
  useEffect(() => {
    const feedbackEnabled = localStorage.getItem(QUIZ_INSTANT_FEEDBACK_ENABLED_KEY);
    setInstantFeedbackEnabled(feedbackEnabled !== null ? JSON.parse(feedbackEnabled) : false);

    const delaySetting = localStorage.getItem(QUIZ_INSTANT_FEEDBACK_DELAY_KEY);
    const parsedDelay = delaySetting ? parseInt(delaySetting, 10) : DEFAULT_FEEDBACK_DELAY;
    setFeedbackDelay(!isNaN(parsedDelay) && parsedDelay >= 1 ? parsedDelay : DEFAULT_FEEDBACK_DELAY);
  }, []);


  // --- Effect to Select and Shuffle Questions ---
  useEffect(() => {
    if (!quiz || !quizId) {
      setQuizTitle(undefined);
      return;
    }
    if (quiz.questions.length === 0) {
      setSessionQuestions([]);
      return;
    }

    // Clear any pending feedback timer if quiz changes
    if (feedbackTimerRef.current) {
      clearTimeout(feedbackTimerRef.current);
      feedbackTimerRef.current = null;
      setIsShowingFeedback(false);
    }

    const storedCount = localStorage.getItem(QUIZ_QUESTIONS_COUNT_KEY);
    const numQuestionsToSelect = storedCount ? parseInt(storedCount, 10) : DEFAULT_QUESTIONS_COUNT;
    const trackingData = getQuestionTrackingForQuiz(quizId) || {};
    const globalShuffleSetting = localStorage.getItem(QUIZ_SHUFFLE_ENABLED_KEY);
    const initialShuffleEnabled = globalShuffleSetting !== null ? JSON.parse(globalShuffleSetting) : true;
    setIsSessionShuffleActive(initialShuffleEnabled);

    // Call new selector
    const selectedQuestions = selectQuestions({
      quiz,
      trackingData,
      count: numQuestionsToSelect,
      mode: 'mixed', // hardcoded for now, can be made configurable
      shuffle: initialShuffleEnabled,
      // tags: [], // add filters here if needed
      // difficulty: [], // add filters here if needed
    });

    setSessionQuestions(selectedQuestions);
    setCurrentSessionIndex(0);
    setSessionAnswers({});
    setSessionResults([]);
    if (quiz) {
      setQuizTitle(quiz.title);
    }

  }, [quiz, quizId, navigate, getQuestionTrackingForQuiz, setQuizTitle]);

  // --- Cleanup Timer on Unmount ---
  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) {
        clearTimeout(feedbackTimerRef.current);
      }
    };
  }, []);


  // --- Toggle Shuffle Logic ---
  const handleToggleSessionShuffle = useCallback(() => {
    if (isShowingFeedback) return; // Don't allow shuffle during feedback
    setIsSessionShuffleActive(prev => {
      const newShuffleState = !prev;
      if (newShuffleState) {
        setSessionQuestions(currentQuestions => {
          if (currentSessionIndex >= currentQuestions.length - 1) return currentQuestions;
          const remainingQuestions = currentQuestions.slice(currentSessionIndex + 1);
          const shuffledRemaining = shuffleArray(remainingQuestions);
          return [...currentQuestions.slice(0, currentSessionIndex + 1), ...shuffledRemaining];
        });
      }
      return newShuffleState;
    });
  }, [currentSessionIndex, isShowingFeedback]);

  // --- Previous Question Logic ---
  const handlePreviousQuestion = () => {
    // Allow going back even if instant feedback is enabled, but editing is handled by card's disabled state
    if (currentSessionIndex > 0 && !isShowingFeedback) {
      setCurrentSessionIndex(currentSessionIndex - 1);
    }
  };

  // --- Answer Handling ---
  const handleSetAnswer = useCallback((answer: AnswerType | null) => {
    if (isShowingFeedback) return; // Don't allow changing answer during feedback display

    // If instant feedback is on, prevent changing answer once submitted for this question
    const currentQuestionOriginalIndex = sessionQuestions[currentSessionIndex]?.originalIndex;
    const alreadyAnsweredInSession = sessionResults.some(r => r.questionIndex === currentQuestionOriginalIndex);
    if (instantFeedbackEnabled && alreadyAnsweredInSession) {
        return;
    }

    setSessionAnswers(prev => ({
      ...prev,
      [currentSessionIndex]: answer
    }));
  }, [currentSessionIndex, isShowingFeedback, instantFeedbackEnabled, sessionResults, sessionQuestions]);

  // --- Derived State ---
  const totalSessionQuestions = sessionQuestions.length;
  const currentSessionQuestionData = sessionQuestions[currentSessionIndex];
  const currentSelectedAnswer = sessionAnswers[currentSessionIndex] ?? null;


  // --- Loading/Error Handling ---
   if (!quiz) return <div>Loading Quiz...</div>;
   if (quiz.questions.length > 0 && sessionQuestions.length === 0) return <div>Preparing questions...</div>;
   if (quiz.questions.length === 0) return <div>This quiz has no questions.</div>;
   if (!currentSessionQuestionData && quiz.questions.length > 0 && sessionQuestions.length > 0) {
        console.error("Error: No current session question data available after loading checks.");
        return <div>Error loading question data.</div>;
   }


  // --- Handle Next / Finish / Feedback ---
  const handleNextOrFinish = () => {
    if (isShowingFeedback) return; // Prevent double clicks
    if (currentSelectedAnswer === null || !currentSessionQuestionData || !quiz) return;

    const { originalIndex, question } = currentSessionQuestionData;
    const isCorrect = validateQuestionAnswer(question.type, question, currentSelectedAnswer);

    // Determine Correct Answer Value
    let correctAnswerValue: AnswerType | undefined | null = undefined;
    if (question.type === 'mcq' || question.type === 'highlighted_bytes') {
        const qWithType = question as MCQQuestion | HighlightedBytesQuestion;
        if (Array.isArray(qWithType.correctAnswers) && qWithType.correctAnswers.length > 0) {
            correctAnswerValue = qWithType.correctAnswers[0];
        }
    } else if (question.type === 'hex_selection') {
        correctAnswerValue = (question as HexSelectionQuestion).correctOffset;
    } else if (question.type === 'drag_drop') {
        correctAnswerValue = (question as DragDropQuestion).itemOrder;
    }

    // Store result (always store, even if showing feedback)
    const result: SessionResult = {
      questionIndex: originalIndex,
      selectedAnswer: currentSelectedAnswer,
      isCorrect: isCorrect,
      correctAnswer: correctAnswerValue
    };
    setSessionResults(prevResults => {
        const existingIndex = prevResults.findIndex(r => r.questionIndex === originalIndex);
        if (existingIndex > -1) {
            const updated = [...prevResults];
            updated[existingIndex] = result;
            return updated;
        } else {
            return [...prevResults, result];
        }
    });

    // --- Instant Feedback Logic ---
    if (instantFeedbackEnabled) {
        setIsShowingFeedback(true);
        setFeedbackCorrectAnswer(correctAnswerValue); // Store correct answer for feedback display

        feedbackTimerRef.current = setTimeout(() => {
            setIsShowingFeedback(false);
            setFeedbackCorrectAnswer(null); // Clear feedback answer
            feedbackTimerRef.current = null;
            proceedToNextOrFinish(); // Move after delay
        }, feedbackDelay * 1000); // Convert seconds to ms
    } else {
        // --- No Instant Feedback: Proceed immediately ---
        proceedToNextOrFinish();
    }
  };

  // --- Helper to move to next question or finish quiz ---
  const proceedToNextOrFinish = () => {
    if (currentSessionIndex < totalSessionQuestions - 1) {
      setCurrentSessionIndex(currentSessionIndex + 1);
    } else {
      finishQuiz();
    }
  };

  // --- Helper to finish the quiz ---
  const finishQuiz = () => {
   if (!quiz) return; // Should not happen here, but safety check

   // Recalculate final score based on stored sessionResults
   const finalCorrectCount = sessionResults.filter(r => r.isCorrect).length;
   const finalScorePercent = totalSessionQuestions > 0
       ? Math.round((finalCorrectCount / totalSessionQuestions) * 100)
       : 0;

   // 1. Update overall progress
   updateProgress(quiz.id, finalScorePercent);

   // 2. Update detailed question tracking
   const trackingUpdates = sessionResults.map(r => ({
       questionIndex: r.questionIndex,
       isCorrect: r.isCorrect
   }));
   updateQuestionTracking(quiz.id, trackingUpdates);

   // 3. Build comprehensive review data including unanswered questions
   const reviewQuestions = sessionQuestions.map((sessionQ, idx) => {
     const existingResult = sessionResults.find(r => r.questionIndex === sessionQ.originalIndex);

     if (existingResult) {
       return {
         originalQuestion: sessionQ.question,
         selectedAnswer: existingResult.selectedAnswer,
         isCorrect: existingResult.isCorrect,
         correctAnswer: existingResult.correctAnswer
       };
     } else {
       // Extract correct answer similar to handleNextOrFinish
       let correctAnswerValue: AnswerType | undefined | null = undefined;
       const q = sessionQ.question;
       if (q.type === 'mcq' || q.type === 'highlighted_bytes') {
         const qWithType = q as MCQQuestion | HighlightedBytesQuestion;
         if (Array.isArray(qWithType.correctAnswers) && qWithType.correctAnswers.length > 0) {
           correctAnswerValue = qWithType.correctAnswers[0];
         }
       } else if (q.type === 'hex_selection') {
         correctAnswerValue = (q as HexSelectionQuestion).correctOffset;
       } else if (q.type === 'drag_drop') {
         correctAnswerValue = (q as DragDropQuestion).itemOrder;
       }

       return {
         originalQuestion: q,
         selectedAnswer: null,
         isCorrect: false,
         correctAnswer: correctAnswerValue
       };
     }
   });

   // 4. Navigate to Review Page with full question list
   navigate(`/quiz/${quiz.id}/review`, {
     state: {
       quizId: quiz.id,
       score: finalScorePercent,
       correctAnswers: finalCorrectCount,
       totalQuestions: totalSessionQuestions,
       questions: reviewQuestions
     }
   });
 };


  // --- Render ---
  return (
    <div className={styles.quizPlayer}>
      <h1>{quiz?.title}</h1>

      {currentSessionQuestionData && (
        <QuizQuestionCard
          key={`${quizId}-${currentSessionQuestionData.originalIndex}-${currentSessionIndex}`}
          question={currentSessionQuestionData.question}
          questionNumber={currentSessionIndex + 1}
          totalQuestions={totalSessionQuestions}
          onAnswer={handleSetAnswer}
          isShuffleActive={isSessionShuffleActive}
          onToggleShuffle={handleToggleSessionShuffle}
          // Pass feedback state
          isShowingFeedback={isShowingFeedback} // Is the timer active?
          correctAnswerValueForFeedback={isShowingFeedback ? feedbackCorrectAnswer : undefined} // Pass correct answer only during timer
          // Determine if input should be disabled
          isDisabled={
            isShowingFeedback || // Disabled during the feedback timer
            (instantFeedbackEnabled && sessionResults.some(r => r.questionIndex === currentSessionQuestionData.originalIndex)) // Disabled if feedback is on and question is in results
          }
          currentAnswer={currentSelectedAnswer} // Pass the user's current selection
          instantFeedbackEnabled={instantFeedbackEnabled} // Pass the global setting
          // Determine if the answer for this specific question is locked (due to instant feedback + being answered)
          isAnswerLocked={instantFeedbackEnabled && sessionResults.some(r => r.questionIndex === currentSessionQuestionData.originalIndex)}
        />
      )}

      {/* Navigation Buttons */}
      <div className={styles.navigationButtons}>
        <button
          className={`${buttonStyles.btn} ${buttonStyles.btnOutline} ${styles.navButton}`}
          onClick={handlePreviousQuestion}
          // Disable Previous button only if showing feedback or at the first question
          disabled={currentSessionIndex === 0 || isShowingFeedback}
          aria-label="Previous Question"
        >
          <FaArrowLeft /> Previous
        </button>
        <button
          className={`${buttonStyles.btn} ${buttonStyles.btnOutline} ${styles.navButton} ${styles.actionButton}`}
          onClick={handleNextOrFinish}
          // Disable Next/Finish if no answer selected OR if showing feedback
          disabled={currentSelectedAnswer === null || isShowingFeedback}
        >
          {isShowingFeedback
            ? '...' // Indicate loading/waiting during feedback
            : currentSessionIndex < totalSessionQuestions - 1
              ? <>Next <FaArrowRight /></>
              : 'Finish Quiz'}
        </button>
      </div>
    </div>
  );
};

export default QuizPlayer;
