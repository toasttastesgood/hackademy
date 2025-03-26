import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import '../App.css';

const Layout: React.FC = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <div 
      style={{ display: 'flex', minHeight: '100vh' }}
      data-theme={isDarkMode ? 'dark' : 'light'}
    >
      <Sidebar />
      <main style={{ 
        flex: 1,
        padding: '2rem',
        marginLeft: '250px',
        backgroundColor: 'var(--background-color)',
        minHeight: '100vh'
      }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
