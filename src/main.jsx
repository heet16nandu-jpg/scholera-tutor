import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { applyTheme, systemTheme } from './hooks/useTheme'

// Before the first render, so the palette is on <html> by the first paint and a
// dark-set machine never flashes light.
applyTheme(systemTheme())

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
