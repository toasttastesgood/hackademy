import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Card from './Card/Card'; // Import the reusable Card component

const SettingsPage: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="settings-page">
      <h2>Appearance</h2>
      <Card className="settings-section"> {/* Use Card component */}
        <h3>Theme</h3>
        <div className="theme-options">
          <button 
            className={`btn btn--outline theme-option ${!isDarkMode ? 'active' : ''}`}
            onClick={() => !isDarkMode && toggleTheme()}
          >
            Light
          </button>
          <button 
            className={`btn btn--outline theme-option ${isDarkMode ? 'active' : ''}`}
            onClick={() => isDarkMode && toggleTheme()}
          >
            Dark
          </button>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;
