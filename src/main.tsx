import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Kid-proof: block accidental gestures that leave the app
// Prevent pinch-to-zoom and multi-finger gestures
document.addEventListener('touchstart', (e) => {
  if (e.touches.length > 1) e.preventDefault();
}, { passive: false });

// Prevent context menu (long-press popup)
document.addEventListener('contextmenu', (e) => e.preventDefault());

// Prevent pull-to-refresh and edge swipe navigation
document.addEventListener('touchmove', (e) => {
  if (e.touches.length > 1) e.preventDefault();
}, { passive: false });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
