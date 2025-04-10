import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useQuizTitle } from '../../contexts/QuizTitleContext';
// import Sidebar from '../Sidebar/Sidebar'; // Old sidebar
import Sidebar from '../Sidebar/Sidebar'; // Import the renamed sidebar
import Topbar from '../Topbar/Topbar';
import styles from './AppLayout.module.css';

const AppLayout: React.FC = () => {
  const { quizTitle } = useQuizTitle();
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
        quizTitle={quizTitle}
      />
      {/* Render the new sidebar directly. Expansion/mobile logic can be added later */}
      <Sidebar isOpen={sidebarOpen} isMobile={isMobile} /> {/* Pass state */}

      {isMobile && sidebarOpen && (
        <div 
          className={`${styles.sidebarBackdrop} ${styles.sidebarBackdropActive}`} /* Apply active class */
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