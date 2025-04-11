import React, { useState, useEffect, useMemo } from 'react';
// Removed FiChevronDown as it's not used in the new layout
import CircularProgress from './CircularProgress';
import { useQuiz } from '../contexts/QuizProvider';
import { useNavigate } from 'react-router-dom';
import Card from './Card/Card';
// Removed progressStyles import as CircularProgress handles its own styles now
import styles from './CategoryView.module.css';
import Button from './Button/Button'; // Import Button component
import { QuizMeta } from '../services/QuizTypes'; // Use QuizMeta for metadata-only browsing

// Removed the old CategoryCard component entirely

// --- New QuizzesList Component for the Right Pane ---
interface QuizzesListProps {
  selectedCategory: string | null;
}

const QuizzesList: React.FC<QuizzesListProps> = ({ selectedCategory }) => {
  const { quizMetas, progress, categories } = useQuiz();
  const navigate = useNavigate();

  const quizzesToDisplay: QuizMeta[] = useMemo(() => {
    if (!selectedCategory || selectedCategory === 'All') {
      // All quizzes, sorted by title
      return Object.values(quizMetas).sort((a, b) => a.title.localeCompare(b.title));
    }
    // Filter by category
    return Object.values(quizMetas)
      .filter(q => q.category === selectedCategory)
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [selectedCategory, quizMetas]);


  const getButtonLabel = (quizId: string): string => {
      const quizProgress = progress[quizId];
      // If highestScore exists, the quiz has been attempted.
      if (quizProgress?.highestScore !== undefined) return "Retake Quiz";
      return "Start Quiz";
  };


  if (quizzesToDisplay.length === 0) {
    return <p className={styles.emptyQuizList}>No quizzes found for this category.</p>;
  }

  return (
    <div className={styles.quizzesGrid}> {/* Changed to grid layout */}
      {quizzesToDisplay.map((quiz: QuizMeta) => (
        <Card key={quiz.id} className={styles.quizCard}>
          <div className={styles.quizCardHeader}>
            <h3>{quiz.title}</h3>
            {(!selectedCategory || selectedCategory === 'All') && (
              <span className={styles.quizCategoryTag}>{quiz.category}</span>
            )}
          </div>
          {quiz.description && <p className={styles.quizDescription}>{quiz.description}</p>}
          <div className={styles.quizCardFooter}>
            <CircularProgress
              percentage={progress[quiz.id]?.highestScore || 0}
              size={40}
              strokeWidth={4}
              className={styles.quizProgress}
            />
            <Button
              onClick={() => navigate(`/quiz/${quiz.id}`)}
              variant="primary"
              size="small"
            >
              {getButtonLabel(quiz.id)}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

const MemoizedQuizzesList = React.memo(QuizzesList);

// --- Updated CategoryView Component ---
const CategoryView: React.FC<{ initialExpandedCategory?: string | null }> = ({ initialExpandedCategory }) => {
  const { categories, loading, error } = useQuiz(); // Removed progress, handled in QuizzesList
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    initialExpandedCategory || 'All' // Default to 'All' if nothing is passed
  );

  // Update selectedCategory if initialExpandedCategory changes (e.g., from URL)
  useEffect(() => {
    setSelectedCategory(initialExpandedCategory || 'All');
  }, [initialExpandedCategory]);

  const handleCategoryClick = (categoryName: string | null) => {
    setSelectedCategory(categoryName);
    // Optional: Update URL search params here if desired
  };

  if (loading) return <div>Loading categories...</div>;
  if (error) return <div>Error: {error}</div>;

  // Sort categories alphabetically for the list
  const sortedCategories = useMemo(() => {
      return Object.values(categories).sort((a, b) => a.name.localeCompare(b.name));
  }, [categories]);

  return (
    <div className={styles.categoryView}>
      {/* Left Pane: Category Filter List */}
      <aside className={styles.categoryList}>
        <h4>Categories</h4>
        <ul>
          <li
            key="all-categories"
            className={selectedCategory === 'All' ? styles.activeCategory : ''}
            onClick={() => handleCategoryClick('All')}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCategoryClick('All'); }}
          >
            All Categories
          </li>
          {sortedCategories.map(category => (
            <li
              key={category.name}
              className={selectedCategory === category.name ? styles.activeCategory : ''}
              onClick={() => handleCategoryClick(category.name)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCategoryClick(category.name); }}
            >
              {category.name}
              <span className={styles.quizCount}>({category.quizCount})</span>
            </li>
          ))}
        </ul>
      </aside>

      {/* Right Pane: Quizzes List */}
      <main className={styles.quizListPane}>
        <MemoizedQuizzesList selectedCategory={selectedCategory} />
      </main>
    </div>
  );
};

export default React.memo(CategoryView);
