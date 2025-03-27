import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../contexts/QuizProvider';
import CircularProgress from './CircularProgress'; // Import the component
import '../App.css';
import '../App.css';

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
    <div className="dashboard" style={{ minHeight: 'calc(100vh - 4rem)' }}>
      <h1>Your Learning Progress</h1>
      
      <div className="progress-container">
        {/* Replace SVG with the component */}
        <CircularProgress 
          percentage={overallProgress} 
          size={200}       // Match the previous size
          strokeWidth={10} // Match the previous stroke width
        />
      </div>

      <div className="recommended-categories">
        <h2>Recommended Categories</h2>
            <div className="category-list">
              {categories && Object.values(categories).map(category => (
                <div 
                  key={category.name} 
                  className="card card--interactive category-card"
                  onClick={() => navigate(`/browse?category=${category.name}`)}
                >
              <h3>{category.name}</h3>
              <div className="progress-bar">
                <div 
                  className="progress-bar__fill" 
                  style={{ width: `${category.averageScore}%` }}
                ></div>
              </div>
              <span>{category.completedCount}/{category.quizCount} quizzes</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(Dashboard);
