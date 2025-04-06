import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './NewSidebar.module.css'; // New CSS module
import { useTheme } from '../contexts/ThemeContext'; // Corrected path
import { FiHome, FiFolder, FiSettings } from 'react-icons/fi';
import hackademyLight from '../assets/hackademy_light.png'; // Corrected path
import hackademyDark from '../assets/hackademy_dark.png'; // Corrected path

const navigationLinks = [
  { path: '/', label: 'Home', icon: FiHome },
  { path: '/browse', label: 'Browse', icon: FiFolder },
  { path: '/settings', label: 'Settings', icon: FiSettings },
];

const NewSidebar: React.FC = () => {
  const { colorMode } = useTheme(); // Use colorMode instead of isDarkMode

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <img
          src={colorMode === 'dark' ? hackademyDark : hackademyLight}
          alt="Hackademy Logo"
          className={styles.logo}
        />
        {/* Optionally add text logo here if sidebar is expanded */}
      </div>
      <nav className={styles.nav}>
        <ul>
          {navigationLinks.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.active : ''}`
                }
                title={link.label} // Use title for tooltip on collapsed state
                aria-label={link.label}
                end={link.path === '/'} // Ensure exact match for home
              >
                <link.icon size={24} className={styles.navIcon} />
                <span className={styles.navLabel}>{link.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      {/* Add footer/theme toggle later if needed */}
    </aside>
  );
};

export default NewSidebar;