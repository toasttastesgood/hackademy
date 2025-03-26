import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuiz } from '../contexts/QuizProvider';

interface ProcessedQuestion {
  original: any;
  options: Array<{ id: string; text: string }>;
  correctIds: string[];
}

const QuizPlayer: React.FC = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { quizzes } = useQuiz();

  const quiz = quizzes[quizId || ''];
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [processedQuestions, setProcessedQuestions] = useState<ProcessedQuestion[]>([]);
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  if (!quiz) {
    return <div>Quiz not found</div>;
  }

  const question = quiz.questions[currentQuestion];

  useEffect(() => {
    if (!quiz) return;

    const processed = quiz.questions.map(q => {
      // Generate options with max 4 total (1-3 correct + wrong answers)
      let allOptions = [];
      
      if (q.type === 'true_false') {
        allOptions = ['True', 'False'].map(text => ({
          id: crypto.randomUUID(),
          text: String(text)
        }));
      } else {
        // Select 1-2 correct answers (80% chance for 1, 20% for 2)
        const showTwoCorrect = Math.random() < 0.2 && q.correctAnswers.length > 1;
        const correctToShow = showTwoCorrect 
          ? q.correctAnswers.slice(0, 2) 
          : [q.correctAnswers[0]];
        
        // Fill remaining slots with wrong answers (max 4 total)
        const wrongToShow = Math.min(4 - correctToShow.length, q.wrongAnswers?.length || 0);
        const shuffledWrong = [...(q.wrongAnswers || [])]
          .sort(() => 0.5 - Math.random())
          .slice(0, wrongToShow);
        
        allOptions = [
          ...correctToShow,
          ...shuffledWrong
        ].map(text => ({
          id: crypto.randomUUID(),
          text: String(text)
        }));
      }

      // Map correct answers to UUIDs
      const correctIds = allOptions
        .filter(opt => 
          q.type === 'true_false' 
            ? (q.correctAnswers.includes(true) && opt.text === 'True') ||
              (q.correctAnswers.includes(false) && opt.text === 'False')
            : q.correctAnswers.includes(opt.text)
        )
        .map(opt => opt.id);

      return {
        original: q,
        options: allOptions,
        correctIds
      };
    });

    setProcessedQuestions(processed);
  }, [quiz]);

  // Get current processed question
  const processedQuestion = processedQuestions[currentQuestion] || {
    original: {},
    options: [],
    correctIds: []
  };

  const { updateProgress } = useQuiz();

  const handleAnswer = () => {
    console.log('Current question:', processedQuestion.original.text);
    console.log('Options:', processedQuestion.options);
    console.log('Correct IDs:', processedQuestion.correctIds);
    console.log('Selected ID:', selectedAnswerId);
    
    const isCorrect = selectedAnswerId !== null && 
      processedQuestion.correctIds.includes(selectedAnswerId);

    console.log('Is correct:', isCorrect);

    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);

    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswerId(null);
    } else {
      const finalScore = Math.round((newScore / quiz.questions.length) * 100);
      updateProgress(quiz.id, finalScore);
      navigate(`/quiz/${quiz.id}/review`, {
        state: {
          quizId: quiz.id,
          score: finalScore,
          correctAnswers: newScore,
          totalQuestions: quiz.questions.length,
          questions: quiz.questions.map((q, i) => ({
            text: q.text,
            correct: selectedAnswerId !== null && 
              processedQuestions[i]?.correctIds.includes(selectedAnswerId),
            explanation: q.explanation
          }))
        }
      });
    }
  };

  return (
    <div className="quiz-player">
      <h1>{quiz.title}</h1>
      <div className="question">
        <h2>Question {currentQuestion + 1} of {quiz.questions.length}</h2>
        <p>{question.text}</p>
        
        {question.type === 'mcq' && (
          <div className="options">
            {processedQuestion.options.map((option) => (
              <button
                key={option.id}
                className={selectedAnswerId === option.id ? 'selected' : ''}
                onClick={() => setSelectedAnswerId(option.id)}
              >
                {option.text}
              </button>
            ))}
          </div>
        )}

        {question.type === 'true_false' && (
          <div className="options">
          <button
            className={selectedAnswerId === processedQuestion.options[0]?.id ? 'selected' : ''}
            onClick={() => setSelectedAnswerId(processedQuestion.options[0]?.id)}
          >
            True
          </button>
          <button
            className={selectedAnswerId === processedQuestion.options[1]?.id ? 'selected' : ''}
            onClick={() => setSelectedAnswerId(processedQuestion.options[1]?.id)}
          >
            False
          </button>
          </div>
        )}

        <button 
          onClick={handleAnswer}
          disabled={selectedAnswerId === null}
        >
          {currentQuestion < quiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
        </button>
      </div>
    </div>
  );
};

export default QuizPlayer;
