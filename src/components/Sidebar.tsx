import React, { useState } from 'react';
import { useQuiz } from '../contexts/QuizProvider';
import { NavLink } from 'react-router-dom';
import { 
  FiHome, 
  FiBook, 
  FiShield,
  FiMenu,
  FiChevronDown,
  FiChevronUp
} from 'react-icons/fi';
import '../App.css';

const Sidebar: React.FC = () => {
  const { categories } = useQuiz();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    categories: true
  });

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
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
    </aside>
  );
};

export default Sidebar;
