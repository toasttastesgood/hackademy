import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import './Styles/global.css'
import App from './App.tsx'
import { QuizProvider } from './contexts/QuizProvider';
import { QuizTitleProvider } from './contexts/QuizTitleContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <QuizProvider>
        <QuizTitleProvider>
          <App />
        </QuizTitleProvider>
      </QuizProvider>
    </HashRouter>
  </StrictMode>,
)
