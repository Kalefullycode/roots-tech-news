import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

// Global error handler for unhandled errors
window.onerror = function(message, source, lineno, colno, error) {
  console.error('Global error:', { message, source, lineno, colno, error });
  return false;
};

// Global handler for unhandled promise rejections
window.onunhandledrejection = function(event) {
  console.error('Unhandled promise rejection:', event.reason);
};

try {
  const container = document.getElementById("root");
  if (!container) {
    throw new Error("Root element not found - check if index.html has <div id='root'></div>");
  }

  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
  
  console.log('✅ React app mounted successfully');
} catch (error) {
  console.error('❌ Failed to mount React app:', error);
  
  // Fallback error display
  const container = document.getElementById("root");
  if (container) {
    container.innerHTML = `
      <div style="padding: 20px; font-family: monospace; background: #1a1a1a; color: #ff6b6b; min-height: 100vh;">
        <h1>⚠️ Application Error</h1>
        <p>Failed to initialize the application.</p>
        <pre style="background: #000; padding: 10px; border-radius: 5px; overflow: auto;">
${error instanceof Error ? error.message : String(error)}
${error instanceof Error && error.stack ? '\n\nStack trace:\n' + error.stack : ''}
        </pre>
        <p style="color: #ffff00;">Please check the browser console for more details (Press F12)</p>
        <p style="color: #888; margin-top: 20px;">Site: rootstechnews.com</p>
      </div>
    `;
  }
}
