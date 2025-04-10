import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../contexts/QuizProvider';
import styles from './Dashboard.module.css';
import CircularProgress from './CircularProgress';
import Card from './Card/Card';


const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // Temporary data - will be replaced with real progress tracking
  const { categories, progress, loading, error } = useQuiz(); // Add loading and error

  // Calculate overall progress and stats
  const progressValues = Object.values(progress);
  const completedQuizIds = new Set(Object.keys(progress).filter(id => progress[id]?.highestScore !== undefined));
  const totalQuizzes = Object.values(categories).reduce((sum, cat) => sum + cat.quizCount, 0);
  const totalCompleted = completedQuizIds.size;

  const overallAverageScore = progressValues.length > 0
    ? Math.round(
        progressValues.reduce((sum, p) => sum + (p.highestScore || 0), 0) /
        progressValues.length
      )
    : 0;

  if (loading) return <div className={styles.loading}>Loading dashboard...</div>;
  if (error) return <div className={styles.error}>Error loading dashboard: {error}</div>;

  return (
    <div className={styles.dashboard}>
      {/* Progress Summary Card */}
      <Card className={styles.progressSummaryCard}>
        <h2>Your Progress Summary</h2>
        <div className={styles.progressContent}>
          <CircularProgress
            percentage={overallAverageScore}
            size={150} // Slightly smaller size
            strokeWidth={15}
          />
          <div className={styles.progressStats}>
            <p><strong>{totalCompleted}</strong> Quizzes Completed</p>
            <p><strong>{totalQuizzes}</strong> Total Quizzes</p>
            <p><strong>{overallAverageScore}%</strong> Average Score</p>
          </div>
        </div>
      </Card>

      {/* Explore Categories Card */}
      <Card>
        <h2>Explore Categories</h2>
        <div className={styles.categoryGrid}> {/* Changed class name */}
          {categories && Object.values(categories).length > 0 ? (
            Object.values(categories).map(category => (
              // Wrap each category in its own Card
              <Card
                key={category.name}
                className={styles.categoryCard} // Add specific class for styling
                onClick={() => navigate(`/browse?category=${encodeURIComponent(category.name)}`)} // Ensure category name is encoded
              >
                {/* Removed intermediate divs */}
                <h3 className={styles.categoryTitle}>{category.name}</h3>
                <span className={styles.categoryStats}>
                  {category.completedCount}/{category.quizCount} completed
                </span>
                <CircularProgress
                  percentage={category.averageScore || 0}
                  size={50} // Slightly larger progress for card
                  strokeWidth={5}
                  className={styles.categoryProgress} // Keep this class
                />
                {/* Removed duplicated/incorrect lines */}
              </Card>
            ))
          ) : (
            <p className={styles.emptyState}>No categories available yet.</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default React.memo(Dashboard);
