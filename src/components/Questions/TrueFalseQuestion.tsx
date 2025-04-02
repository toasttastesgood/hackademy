import React, { useState } from 'react';
import buttonStyles from '../Button/Button.module.css';
import styles from '../QuizPlayer.module.css';
import { QuestionComponentProps } from './types';

export interface TrueFalseQuestionProps extends QuestionComponentProps {
  question: QuestionComponentProps['question'];
}

const TrueFalseQuestion: React.FC<TrueFalseQuestionProps> = ({
  question,
  onAnswer,
  disabled = false
}) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const handleSelect = (value: string) => {
    if (disabled) return;
    setSelectedValue(value);
    onAnswer(value);
  };

  return (
    <div className={styles.trueFalseOptions}>
      <button
        className={`${buttonStyles.btn} ${buttonStyles.btnOutline} ${buttonStyles.btnRounded} ${
          selectedValue === 'True' ? buttonStyles.btnSelected : ''
        }`}
        onClick={() => handleSelect('True')}
        disabled={disabled}
      >
        True
      </button>
      <button
        className={`${buttonStyles.btn} ${buttonStyles.btnOutline} ${buttonStyles.btnRounded} ${
          selectedValue === 'False' ? buttonStyles.btnSelected : ''
        }`}
        onClick={() => handleSelect('False')}
        disabled={disabled}
      >
        False
      </button>
    </div>
  );
};

export default TrueFalseQuestion;