import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Topbar.module.css";
import { FiSearch, FiMenu, FiGithub } from "react-icons/fi";
import { useTheme } from "../../contexts/ThemeContext";
import hackademyDark from "../../assets/hackademy_dark.png";
import hackademyLight from "../../assets/hackademy_light.png";

interface TopbarProps {
  onMenuToggle?: () => void;
  isMobile?: boolean;
}

const Topbar: React.FC<TopbarProps> = ({
  onMenuToggle,
  isMobile = false,
}) => {
  const { colorMode } = useTheme(); // Get the current color mode
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState<string>("Dashboard");

  useEffect(() => {
    const path = location.pathname.split('/').filter(Boolean)[0] || 'Dashboard';
    setPageTitle(path.charAt(0).toUpperCase() + path.slice(1));
  }, [location]);

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
      <div className={styles.logoAndTitle}>
        {!isMobile && (
          <div className={styles.logoContainer}>
            <img
              src={colorMode === 'dark' ? hackademyLight : hackademyDark} // Check color mode
              alt="Hackademy"
              className={styles.logoImage}
            />
          </div>
        )}
        {isMobile && (
          <button
            className={styles.menuButton}
            onClick={onMenuToggle}
            aria-label="Toggle menu"
          >
            <FiMenu size={24} />
          </button>
        )}
        <div className={styles.title}>{pageTitle}</div>
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
          <button type="submit" style={{ display: "none" }} aria-label="Search"></button>
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