import React from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: React.ReactNode;
  className?: string; // Allow additional custom classes
  onClick?: () => void; // Optional click handler for interactive cards
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  const cardClasses = `${styles.card} ${className} ${onClick ? styles.cardInteractive : ''}`; // Use cardInteractive class

  return (
    <div className={cardClasses} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;