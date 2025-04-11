import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css'; // Updated CSS module path
// useTheme and logo imports removed
import { FiHome, FiFolder, FiSettings, FiEdit } from 'react-icons/fi';

const navigationLinks = [
  { path: '/', label: 'Home', icon: FiHome },
  { path: '/browse', label: 'Browse', icon: FiFolder },
  { path: '/settings', label: 'Settings', icon: FiSettings },
  { path: '/quiz-editor', label: 'Create Quiz', icon: FiEdit },
];

interface SidebarProps {
  isOpen: boolean;
  isMobile: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, isMobile }) => { // Accept props
  // colorMode logic removed as logo is removed

  return (
    <aside className={`${styles.sidebar} ${isMobile && isOpen ? styles.mobileOpen : ''}`}>
      {/* Logo container removed */}
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
                <link.icon size={24} className={styles.navIcon} aria-hidden="true" role="presentation" />
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

export default Sidebar; // Renamed export