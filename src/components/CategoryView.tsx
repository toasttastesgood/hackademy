import React, { useState, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import CircularProgress from './CircularProgress';
import { useQuiz } from '../contexts/QuizProvider';
import { useNavigate } from 'react-router-dom';
import '../App.css';

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
    <div className="category-card" onClick={onToggle}>
      <h3>{category}</h3>
      <div className="progress-info">
        <p>Quizzes: {quizCount}</p>
        <p>Completed: {completedCount}/{quizCount}</p>
        <p>Average Score: {averageScore}%</p>
      </div>
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${completionPercentage}%` }}
        />
      </div>
      <div className={`chevron-toggle ${isExpanded ? 'expanded' : ''}`}>
        <FiChevronDown />
      </div>
      
      {isExpanded && (
        <div className="quizzes-list">
          <QuizzesList category={category} />
        </div>
      )}
    </div>
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
          {progress[quiz.id] && (
            <CircularProgress percentage={progress[quiz.id].highestScore} />
          )}
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
    <div className="category-view">
      <h2>Browse by Category</h2>
      <div className="category-grid">
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
