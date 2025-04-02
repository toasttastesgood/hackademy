import React, { useState, useEffect } from 'react';
import buttonStyles from '../Button/Button.module.css';
import styles from '../QuizPlayer.module.css';

interface MultipleChoiceOptionsProps {
  correctAnswers: string[];
  wrongAnswers: string[];
  onSelect: (answer: string) => void;
  disabled?: boolean;
  selectedAnswer?: string | null;
}

const MultipleChoiceOptions: React.FC<MultipleChoiceOptionsProps> = ({
  correctAnswers,
  wrongAnswers,
  onSelect,
  disabled = false,
  selectedAnswer = null
}) => {
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    // Shuffle all answers
    const shuffledCorrect = [...correctAnswers].sort(() => Math.random() - 0.5);
    const shuffledWrong = [...wrongAnswers].sort(() => Math.random() - 0.5);
    
    // Select 1-2 correct answers (20% chance for second)
    const selectedCorrect = [shuffledCorrect[0]];
    if (shuffledCorrect.length > 1 && Math.random() < 0.2) {
      selectedCorrect.push(shuffledCorrect[1]);
    }

    // Fill remaining slots with wrong answers to make 4 total
    const neededWrong = 4 - selectedCorrect.length;
    const selectedWrong = shuffledWrong.slice(0, neededWrong);

    // Combine and shuffle final options
    const finalOptions = [...selectedCorrect, ...selectedWrong]
      .sort(() => Math.random() - 0.5);
    
    setOptions(finalOptions);
  }, [correctAnswers, wrongAnswers]);

  const handleSelect = (option: string) => {
    if (disabled) return;
    onSelect(option);
  };

  const useGridLayout = options.every(opt => opt.length < 20);

  return (
    <div className={`${styles.options} ${useGridLayout ? styles.grid : ''}`}>
      {options.map((option) => (
        <button
          key={option}
          className={`${buttonStyles.btn} ${buttonStyles.btnOutline} ${buttonStyles.btnRounded} ${
            selectedAnswer === option ? buttonStyles.btnSelected : ''
          }`}
          onClick={() => handleSelect(option)}
          disabled={disabled}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default MultipleChoiceOptions;