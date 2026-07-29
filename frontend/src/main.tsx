/**
 * TrustGate AI — Application Entry Point
 *
 * Mounts the React application into the DOM.
 * StrictMode is enabled for development-time warnings.
 */
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
