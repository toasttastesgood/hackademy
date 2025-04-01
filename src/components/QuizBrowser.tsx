import React from 'react';
import { useSearchParams } from 'react-router-dom';
import CategoryView from './CategoryView';
import styles from './QuizBrowser.module.css';

const QuizBrowser: React.FC = () => {
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category');

  return (
    <div className={styles.quizBrowser}>
      <h1>Hackademy Quizzes</h1>
      <CategoryView initialExpandedCategory={selectedCategory} />
    </div>
  );
};

export default QuizBrowser;
