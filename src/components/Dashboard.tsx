import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../contexts/QuizProvider';
import styles from './Dashboard.module.css';
import CircularProgress from './CircularProgress'; // Import the component
import Card from './Card/Card'; // Import the new Card component


const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // Temporary data - will be replaced with real progress tracking
  const { categories, progress } = useQuiz();
  
  // Calculate overall progress based on completed quizzes
  const overallProgress = Object.values(progress).length > 0
    ? Math.round(
        Object.values(progress).reduce((sum, p) => sum + p.highestScore, 0) /
        Object.values(progress).length
      )
    : 0;

  return (
    <div className={styles.dashboard} style={{ minHeight: 'calc(100vh - 4rem)' }}>
      <Card className={styles.progressCard}> {/* Wrap progress section in a Card */}
        <h1>Your Learning Progress</h1>
        <div className="progress-container">
          <CircularProgress
            percentage={overallProgress}
            size={200}       // Match the previous size
            strokeWidth={20} // Match the previous stroke width
          />
        </div>
      </Card>

      <Card>
        <h2>Recommended Categories</h2>
        <div className={styles.categoryList}> {/* Use CSS module class */}
          {categories && Object.values(categories).length > 0 ? (
            Object.values(categories).map(category => (
              <div className={styles.categoryItem} // This is now a list item within the card
                key={category.name}
                onClick={() => navigate(`/browse?category=${category.name}`)}
                style={{ cursor: 'pointer' }} // Make item clickable
                role="button" // Add role for accessibility
                tabIndex={0} // Make it focusable
                onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate(`/browse?category=${category.name}`); }} // Keyboard accessibility
              >
                <div className={styles.categoryItemInfo}> {/* Use CSS module class */}
                  <h3>{category.name}</h3>
                  <span>{category.completedCount}/{category.quizCount} quizzes completed</span>
                </div>
                <CircularProgress
                  percentage={category.averageScore || 0} // Use category average score
                  size={40} // Smaller size for list item
                  strokeWidth={4}
                />
              </div>
            ))
          ) : (
            <p className={styles.emptyState}>No categories available yet.</p> // Empty state message
          )}
        </div>
      </Card>
    </div>
  );
};

export default React.memo(Dashboard);
