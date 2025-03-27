import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import '../App.css';

const Layout: React.FC = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <div 
      className="layout-container"
      data-theme={isDarkMode ? 'dark' : 'light'}
    >
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
