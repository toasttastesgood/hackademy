import React, { useState, useEffect, useRef } from "react"; // Import useRef
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Topbar.module.css";
import { FiSearch, FiMenu, FiGithub } from "react-icons/fi";
import { useSettings } from "../../contexts/SettingsContext"; // Import useSettings
import hackademyDark from "../../assets/hackademy_dark.png";
import hackademyLight from "../../assets/hackademy_light.png";

interface TopbarProps {
  onMenuToggle?: () => void;
  isMobile?: boolean;
  quizTitle?: string;
}

const Topbar: React.FC<TopbarProps> = ({
  onMenuToggle,
  isMobile = false,
  quizTitle,
}) => {
  const { settings } = useSettings(); // Get settings from context
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState<string>("Dashboard");

  useEffect(() => {
    if (quizTitle) {
      setPageTitle(quizTitle);
    } else {
      const path = location.pathname.split('/').filter(Boolean)[0] || 'Dashboard';
      setPageTitle(path.charAt(0).toUpperCase() + path.slice(1));
    }
  }, [location, quizTitle]);

  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null); // Ref for the input

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const toggleSearch = () => {
    setIsSearchExpanded(true);
  };

  // Focus input when search expands
  useEffect(() => {
    if (isSearchExpanded) {
      searchInputRef.current?.focus();
    }
  }, [isSearchExpanded]);

  // Collapse search if blurred and empty
  const handleSearchBlur = () => {
    if (!searchTerm) {
      setIsSearchExpanded(false);
    }
  };

  return (
      <header className={styles.topbar}>
      <div className={styles.logoAndTitle}>
        {/* Logo container is now always rendered, hidden on mobile via CSS */}
        <div className={styles.logoContainer}>
          <img
            src={settings.mode === 'dark' ? hackademyDark : hackademyLight} // Use settings.mode
            alt="Hackademy"
            className={styles.logoImage}
          />
        </div>
        {/* Menu button only rendered on mobile */}
        {isMobile ? (
          <button
            className={styles.menuButton}
            onClick={onMenuToggle}
            aria-label="Toggle menu"
          >
            <FiMenu size={24} aria-hidden="true" role="presentation" />
          </button>
        ) : null}
        <div className={styles.title}>{pageTitle}</div>
      </div>
      

      <div className={styles.actions}>
        {isSearchExpanded ? (
          <form onSubmit={handleSearchSubmit} className={`${styles.searchContainer} ${styles.expanded}`}>
            <FiSearch className={styles.searchIcon} size={18} aria-hidden="true" role="presentation" />
            <input
              ref={searchInputRef} // Assign ref
              type="search"
              placeholder="Search..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onBlur={handleSearchBlur} // Add blur handler
            />
            <button type="submit" style={{ display: "none" }} aria-label="Search"></button>
          </form>
        ) : (
          <button
            className={`${styles.searchButton} ${styles.githubButton}`} // Reuse github button style for circle
            onClick={toggleSearch}
            aria-label="Open search"
          >
            <FiSearch size={18} aria-hidden="true" role="presentation" />
          </button>
        )}

        {!isMobile && (
          <a href="https://github.com/toasttastesgood/hackademy" target="_blank" rel="noopener noreferrer" className={styles.githubButton} aria-label="View on GitHub">
            <FiGithub size={18} aria-hidden="true" role="presentation" />
          </a>
        )}
      </div>
    </header>
  );
};

export default Topbar;