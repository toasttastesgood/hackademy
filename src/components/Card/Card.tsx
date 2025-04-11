import React from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: React.ReactNode;
  className?: string; // Allow additional custom classes
  onClick?: () => void; // Optional click handler for interactive cards
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  const cardClasses = `${styles.card} ${className} ${onClick ? styles.cardInteractive : ''}`; // Use cardInteractive class

  // Keyboard accessibility for interactive cards
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!onClick) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={cardClasses}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? handleKeyDown : undefined}
      aria-pressed={undefined}
    >
      {children}
    </div>
  );
};

export default Card;