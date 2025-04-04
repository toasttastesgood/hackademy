import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import './Styles/global.css'
import App from './App.tsx'
import { QuizProvider } from './contexts/QuizProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <QuizProvider>
        <App />
      </QuizProvider>
    </HashRouter>
  </StrictMode>,
)
