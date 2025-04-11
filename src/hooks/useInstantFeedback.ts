import { useState, useRef, useCallback } from 'react';

interface UseInstantFeedbackOptions {
  delaySeconds: number;
  onFeedbackComplete: () => void;
}

export function useInstantFeedback({ delaySeconds, onFeedbackComplete }: UseInstantFeedbackOptions) {
  const [isShowingFeedback, setIsShowingFeedback] = useState(false);
  const [feedbackCorrectAnswer, setFeedbackCorrectAnswer] = useState<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startFeedback = useCallback((correctAnswer: any) => {
    setIsShowingFeedback(true);
    setFeedbackCorrectAnswer(correctAnswer);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setIsShowingFeedback(false);
      setFeedbackCorrectAnswer(null);
      onFeedbackComplete();
    }, delaySeconds * 1000);
  }, [delaySeconds, onFeedbackComplete]);

  const clearFeedback = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsShowingFeedback(false);
    setFeedbackCorrectAnswer(null);
  }, []);

  return {
    isShowingFeedback,
    feedbackCorrectAnswer,
    startFeedback,
    clearFeedback,
  };
}