import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout/AppLayout';
import Dashboard from './components/Dashboard';
import QuizBrowser from './components/QuizBrowser';
import QuizPlayer from './components/QuizPlayer';
import QuizReviewPage from './components/QuizReviewPage';
import SettingsPage from './components/SettingsPage';

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="browse" element={<QuizBrowser />} />
          <Route path="quiz/:quizId" element={<QuizPlayer />} />
          <Route path="quiz/:quizId/review" element={<QuizReviewPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
