import React from 'react';
import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  className = '',
  leftIcon,
  rightIcon,
  type = 'button', // Default type to 'button'
  disabled,
  onClick,
  ...props // Pass remaining button attributes
}) => {
  const buttonClasses = [
    styles.btn,
    styles[variant],
    styles[size],
    className,
  ].filter(Boolean).join(' '); // Filter out empty strings and join

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {leftIcon && <span className={styles.iconWrapper}>{leftIcon}</span>}
      <span className={styles.content}>{children}</span>
      {rightIcon && <span className={styles.iconWrapper}>{rightIcon}</span>}
    </button>
  );
};

export default Button;