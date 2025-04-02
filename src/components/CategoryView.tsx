import React, { useState, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import CircularProgress from './CircularProgress';
import { useQuiz } from '../contexts/QuizProvider';
import { useNavigate } from 'react-router-dom';
import Card from './Card/Card'; // Import the reusable Card component
// import cardStyles from './Card/Card.module.css'; // No longer needed directly if Card handles its styles
import progressStyles from './Progress/CircularProgress.module.css';
import styles from './CategoryView.module.css';

interface CategoryCardProps {
  category: string;
  quizCount: number;
  completedCount: number;
  averageScore: number;
  onToggle: () => void;
  isExpanded: boolean;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  quizCount,
  completedCount,
  averageScore,
  onToggle,
  isExpanded
}) => {
  const { progress } = useQuiz();
  const completionPercentage = progress && Object.keys(progress).length > 0
    ? averageScore
    : 0;
  
  return (
    <Card className={styles.categoryCard} onClick={onToggle}> {/* Use the Card component */}
      <h3>{category}</h3>
      <div className={styles.progressInfo}>
        <p>Quizzes: {quizCount}</p>
        <p>Completed: {completedCount}/{quizCount}</p>
        <p>Average Score: {averageScore}%</p>
      </div>
      <div className={progressStyles.progressBar}>
        <div 
          className={progressStyles.progressBarFill}
          style={{ width: `${completionPercentage}%` }}
        />
      </div>
      <div className={`${styles.chevronToggle} ${isExpanded ? styles.expanded : ''}`}>
        <FiChevronDown />
      </div>
      
      {isExpanded && (
        <div className={styles.quizzesList}>
          <QuizzesList category={category} />
        </div>
      )}
    </Card>
  );
};

const QuizzesList: React.FC<{ category: string }> = ({ category }) => {
  const { getQuizzesByCategory, progress } = useQuiz();
  const navigate = useNavigate();
  const quizzes = getQuizzesByCategory(category);

  return (
    <ul>
      {quizzes.map(quiz => (
        <li key={quiz.id} onClick={() => navigate(`/quiz/${quiz.id}`)}>
          <span>{quiz.title}</span>
                    <CircularProgress percentage={progress[quiz.id]?.highestScore || 0} />
        </li>
      ))}
    </ul>
  );
};

const CategoryView: React.FC<{ initialExpandedCategory?: string | null }> = ({ initialExpandedCategory }) => {
  const { categories, loading, error, progress } = useQuiz();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(
    initialExpandedCategory || null
  );

  useEffect(() => {
    if (initialExpandedCategory) {
      setExpandedCategory(initialExpandedCategory);
    }
  }, [initialExpandedCategory]);

  if (loading) return <div>Loading categories...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.categoryView}>
      <h2>Browse by Category</h2>
      <div className={styles.categoryGrid}>
        {Object.values(categories).map(category => (
          <CategoryCard
            key={category.name}
            category={category.name}
            quizCount={category.quizCount}
            completedCount={category.completedCount}
            averageScore={category.averageScore}
            onToggle={() => 
              setExpandedCategory(expandedCategory === category.name ? null : category.name)
            }
            isExpanded={expandedCategory === category.name}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryView;
