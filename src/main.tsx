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

  // Remove loading screen immediately when React mounts
  const loadingScreen = document.getElementById('loading') || document.querySelector('.loading-screen');
  if (loadingScreen) {
    loadingScreen.style.display = 'none';
    loadingScreen.style.visibility = 'hidden';
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
      loadingScreen.remove();
    }, 100);
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
  
  // Final check to ensure loading screen is gone
  setTimeout(() => {
    const remainingLoading = document.getElementById('loading') || document.querySelector('.loading-screen');
    if (remainingLoading) {
      remainingLoading.remove();
    }
  }, 500);
} catch (error) {
  console.error('❌ Failed to mount React app:', error);
  
  // Fallback error display - using textContent to prevent XSS
  const container = document.getElementById("root");
  if (container) {
    // Clear container
    container.innerHTML = '';
    
    // Create error container
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = 'padding: 20px; font-family: monospace; background: #1a1a1a; color: #ff6b6b; min-height: 100vh;';
    
    // Create elements safely
    const h1 = document.createElement('h1');
    h1.textContent = '⚠️ Application Error';
    errorDiv.appendChild(h1);
    
    const p1 = document.createElement('p');
    p1.textContent = 'Failed to initialize the application.';
    errorDiv.appendChild(p1);
    
    const pre = document.createElement('pre');
    pre.style.cssText = 'background: #000; padding: 10px; border-radius: 5px; overflow: auto;';
    const errorText = error instanceof Error 
      ? error.message + (error.stack ? '\n\nStack trace:\n' + error.stack : '')
      : String(error);
    pre.textContent = errorText;
    errorDiv.appendChild(pre);
    
    const p2 = document.createElement('p');
    p2.style.color = '#ffff00';
    p2.textContent = 'Please check the browser console for more details (Press F12)';
    errorDiv.appendChild(p2);
    
    const p3 = document.createElement('p');
    p3.style.cssText = 'color: #888; margin-top: 20px;';
    p3.textContent = 'Site: rootstechnews.com';
    errorDiv.appendChild(p3);
    
    container.appendChild(errorDiv);
  }
}
