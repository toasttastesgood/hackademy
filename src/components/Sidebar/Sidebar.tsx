import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';
import { useTheme } from '../../contexts/ThemeContext';
import { FiHome, FiFolder, FiSettings, FiMoon, FiSun } from 'react-icons/fi';

const navigationLinks = [
  { path: '/', label: 'Home', icon: FiHome },
  { path: '/browse', label: 'Browse', icon: FiFolder },
];

const bottomLinks = [
  { path: '/settings', label: 'Settings', icon: FiSettings }
];

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  
  return (
    <button 
      onClick={toggleTheme}
      className={styles.themeToggle}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
    </button>
  );
};

const Sidebar: React.FC = () => {
  const { isDarkMode } = useTheme();
  return (
    <aside className={styles.sidebar}>
      <div className={styles.navPillGroup}>
        <nav className={styles.nav}>
          <ul>
            {navigationLinks.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                  }
                  aria-label={link.label}
                  end={link.path === '/'}
                >
                  <link.icon size={22} />
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className={styles.userPillGroup}>
        <ThemeToggle />
        {bottomLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
            aria-label={link.label}
          >
            <link.icon size={22} />
          </NavLink>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;