import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Add performance markers
performance.mark('app-init-start');

// Create a custom event for when app is visually ready
const appReadyEvent = new CustomEvent('app-visually-ready');

// Add preconnect for essential domains
const addPreconnect = (domain: string) => {
  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = domain;
  document.head.appendChild(link);
};

// Preconnect to domains we'll use
addPreconnect('https://conversation.tavus.com');
addPreconnect('https://api.supabase.com');

// Create root and render app
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  
  // Mark end of initial render and measure
  window.addEventListener('load', () => {
    performance.mark('app-init-end');
    performance.measure('app-initialization', 'app-init-start', 'app-init-end');
    
    // Dispatch app ready event
    document.dispatchEvent(appReadyEvent);
    
    // Log performance in development
    if (process.env.NODE_ENV === 'development') {
      const metrics = performance.getEntriesByType('measure');
      console.log('App Performance:', metrics);
    }
  });
}