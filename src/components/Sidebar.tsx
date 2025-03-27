import React, { useState } from 'react';
import { useQuiz } from '../contexts/QuizProvider';
import { useTheme } from '../contexts/ThemeContext';
import { NavLink } from 'react-router-dom';
import { 
  FiHome, 
  FiBook, 
  FiShield,
  FiMenu,
  FiChevronDown,
  FiChevronUp,
  FiMoon,
  FiSun,
  FiSettings
} from 'react-icons/fi';
import '../App.css';

const Sidebar: React.FC = () => {
  const { categories } = useQuiz();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('sidebarExpandedSections');
    return saved ? JSON.parse(saved) : { categories: true };
  });

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
  };
  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newState = {
        ...prev,
        [section]: !prev[section]
      };
      localStorage.setItem('sidebarExpandedSections', JSON.stringify(newState));
      return newState;
    });
  };

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <button className="sidebar-toggle" onClick={toggleCollapse}>
        <FiMenu />
      </button>
      
      <nav>
        <ul className="sidebar-nav">
          <li>
            <NavLink 
              to="/" 
              end
              className={({ isActive }) => 
                isActive ? 'nav-link active' : 'nav-link'
              }
              title={isCollapsed ? 'Dashboard' : undefined}
            >
              <FiHome className="nav-icon" />
              {!isCollapsed && <span>Dashboard</span>}
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/browse" 
              className={({ isActive }) => 
                isActive && !window.location.search.includes('category=')
                  ? 'nav-link active' 
                  : 'nav-link'
              }
              end
              title={isCollapsed ? 'Browse Quizzes' : undefined}
            >
              <FiBook className="nav-icon" />
              {!isCollapsed && <span>Browse Quizzes</span>}
            </NavLink>
          </li>
          <li className="sidebar-section">
            <div 
              className="section-header" 
              onClick={() => toggleSection('categories')}
            >
              {!isCollapsed && <h3>Categories</h3>}
              {!isCollapsed && (
                expandedSections.categories ? <FiChevronUp /> : <FiChevronDown />
              )}
            </div>
            {!isCollapsed && expandedSections.categories && (
              <ul>
                {Object.values(categories || {}).map((category: {name: string}) => (
                  <li key={category.name}>
                    <NavLink 
                      to={`/browse?category=${category.name}`}
                      className={({ isActive }) => 
                        isActive && window.location.search.includes(`category=${category.name}`)
                          ? 'nav-link active' 
                          : 'nav-link'
                      }
                      preventScrollReset={true}
                      title={isCollapsed ? category.name : undefined}
                    >
                      <FiShield className="nav-icon" />
                      {!isCollapsed && <span>{category.name}</span>}
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>
      </nav>

      <div className="theme-toggle-container">
        <button 
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isCollapsed ? (isDarkMode ? 'Light Mode' : 'Dark Mode') : undefined}
        >
          {isDarkMode ? <FiSun /> : <FiMoon />}
          {!isCollapsed && <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>
      </div>

      <ul className="sidebar-nav">
        <li>
          <NavLink 
            to="/settings" 
            className={({ isActive }) => 
              isActive ? 'nav-link active' : 'nav-link'
            }
            title={isCollapsed ? 'Settings' : undefined}
          >
            <FiSettings className="nav-icon" />
            {!isCollapsed && <span>Settings</span>}
          </NavLink>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
