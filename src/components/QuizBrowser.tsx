import React from 'react';
import { useSearchParams } from 'react-router-dom';
import CategoryView from './CategoryView';
import styles from './QuizBrowser.module.css';

const QuizBrowser: React.FC = () => {
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category');

  // The initialExpandedCategory prop is passed down to CategoryView
  // to handle potential deep linking or navigation state.
  return (
    <div className={styles.quizBrowser}>
      {/* Title is removed, handled by layout or CategoryView potentially */}
      <CategoryView initialExpandedCategory={selectedCategory} />
    </div>
  );
};

export default QuizBrowser;
