import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import './Styles/global.css'
import App from './App.tsx'
import { QuizProvider } from './contexts/QuizProvider';
import { QuizTitleProvider } from './contexts/QuizTitleContext';
import { SettingsProvider } from './contexts/SettingsContext'; // Import SettingsProvider

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <SettingsProvider> {/* Wrap with SettingsProvider */}
        <QuizProvider>
          <QuizTitleProvider>
            <App />
          </QuizTitleProvider>
        </QuizProvider>
      </SettingsProvider>
    </HashRouter>
  </StrictMode>,
)
