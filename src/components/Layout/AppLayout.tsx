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
      <Topbar
        isMobile={isMobile}
        onMenuToggle={toggleSidebar}
      />
      <div
        className={`${styles.sidebar} ${

          isMobile
            ? sidebarOpen
              ? styles.sidebarMobileOpen 
              : styles.sidebarMobileClosed
              : sidebarOpen ? styles.sidebarMobileOpen : styles.sidebarCollapsed}`}
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
        <main className={styles.contentArea}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;