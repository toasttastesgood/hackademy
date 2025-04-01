import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import Topbar from '../Topbar/Topbar';
import styles from './AppLayout.module.css';

const AppLayout: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className={styles.appContainer}>
      {/* Sidebar width is controlled by Sidebar.module.css and --sidebar-width variable */}
      <div
        className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarActive : ''} ${!sidebarOpen && !isMobile ? styles.sidebarCollapsed : ''}`}
      >
        <Sidebar />
      </div>

      {isMobile && sidebarOpen && (
        <div 
          className={styles.sidebarBackdrop}
          onClick={closeSidebar}
          role="presentation"
        />
      )}

      <div className={styles.mainWrapper}>
        <Topbar 
          isMobile={isMobile}
          onMenuToggle={toggleSidebar}
        />
        <main className={styles.contentArea}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;