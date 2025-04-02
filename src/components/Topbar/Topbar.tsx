import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Topbar.module.css';
import { FiSearch, FiMenu, FiGithub } from 'react-icons/fi';

interface TopbarProps {
  userName?: string;
  onMenuToggle?: () => void;
  isMobile?: boolean;
}

const Topbar: React.FC<TopbarProps> = ({ 
  userName = "User", 
  onMenuToggle,
  isMobile = false 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className={styles.topbar}>
      {isMobile && (
        <button 
          className={styles.menuButton}
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          <FiMenu size={24} />
        </button>
      )}

      <div className={styles.greeting}>
        <h2>Welcome back, {userName}!</h2>
      </div>

      <div className={styles.actions}>
        <form onSubmit={handleSearchSubmit} className={styles.searchContainer}>
          <FiSearch className={styles.searchIcon} size={18} />
          <input
            type="search"
            placeholder="Search for study sets..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" style={{ display: 'none' }} aria-label="Search"></button>
        </form>
        
        {!isMobile && (
          <a href="https://github.com/toasttastesgood/hackademy" target="_blank" rel="noopener noreferrer" className={styles.githubButton} aria-label="View on GitHub">
            <FiGithub size={18} />
          </a>
        )}
      </div>
    </header>
  );
};

export default Topbar;