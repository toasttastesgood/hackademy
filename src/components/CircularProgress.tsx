import React from 'react';
import styles from './Progress/CircularProgress.module.css';

interface CircularProgressProps {
  percentage: number;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  size = 24,
  strokeWidth = 3,
  className = ''
}) => {
  // Ensure the radius accounts for half the stroke width to fit inside the SVG box
  const radius = (size / 2) - (strokeWidth / 2);
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`${styles.circularProgress} ${className}`}>
      <svg width={size} height={size} overflow="visible"> {/* Add overflow="visible" */}
        <circle
          className={styles.progressBg}
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={styles.progressFill}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          r={radius}
          cx={size / 2}
          cy={size / 2}
          /* transform attribute removed - rotation handled by CSS on svg */
        />
      </svg>
      <div className={styles.progressPercentage}>
        {percentage}%
      </div>
    </div>
  );
};

export default CircularProgress;
