import React, { Component, ErrorInfo, ReactNode } from 'react';
import { incrementErrorCount, shouldClearCache, reloadWithCacheClear } from '@/utils/cacheClear';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Track error count for cache clearing
    incrementErrorCount();
    
    // Check if this is React Error #31 (object rendering)
    const isObjectRenderError = error.message?.includes('Objects are not valid as a React child') ||
                                 error.message?.includes('object with keys');
    
    if (isObjectRenderError) {
      console.error('⚠️ React Error #31 detected: Object being rendered as React child');
      console.error('This is often caused by browser cache issues. Try clearing your cache.');
    }
    
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      // Safely extract error message to prevent rendering objects
      const errorMessage = this.state.error?.message || this.state.error?.toString() || 'Unknown error';
      const errorName = this.state.error?.name || 'Error';
      
      return (
        <div style={{
          padding: '20px',
          fontFamily: 'monospace',
          background: '#1a1a1a',
          color: '#ff6b6b',
          minHeight: '100vh'
        }}>
          <h1>⚠️ Something went wrong</h1>
          <p>The application encountered an error.</p>
          
          {this.state.error && (
            <div style={{
              background: '#000',
              padding: '15px',
              borderRadius: '5px',
              marginTop: '20px',
              overflow: 'auto'
            }}>
              <h3 style={{ color: '#ffff00', margin: '0 0 10px 0' }}>Error Details:</h3>
              <div style={{ margin: 0, color: '#ff6b6b' }}>
                <strong>{errorName}:</strong> {errorMessage}
              </div>
              
              {this.state.errorInfo && (
                <details style={{ marginTop: '10px' }}>
                  <summary style={{ cursor: 'pointer', color: '#00ff00' }}>
                    Component Stack Trace
                  </summary>
                  <pre style={{ 
                    marginTop: '10px', 
                    color: '#888',
                    fontSize: '12px',
                    lineHeight: '1.5'
                  }}>
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>
          )}
          
          <div style={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '10px 20px',
                background: '#00ff00',
                color: '#000',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontFamily: 'monospace',
                fontWeight: 'bold'
              }}
            >
              🔄 Reload Page
            </button>
            
            {shouldClearCache() && (
              <button
                onClick={() => {
                  reloadWithCacheClear();
                }}
                style={{
                  padding: '10px 20px',
                  background: '#ff6b6b',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontFamily: 'monospace',
                  fontWeight: 'bold'
                }}
              >
                🗑️ Clear Cache & Reload
              </button>
            )}
          </div>
          
          <div style={{ marginTop: '20px', padding: '15px', background: '#000', borderRadius: '5px' }}>
            <h4 style={{ color: '#ffff00', margin: '0 0 10px 0' }}>Troubleshooting Steps:</h4>
            <ol style={{ color: '#888', margin: 0, paddingLeft: '20px', lineHeight: '1.8' }}>
              <li>Clear your browser cache (Ctrl+Shift+Delete / Cmd+Shift+Delete)</li>
              <li>Disable browser extensions (especially ad blockers)</li>
              <li>Try an incognito/private window</li>
              <li>Hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)</li>
              <li>Check browser console (F12) for detailed errors</li>
            </ol>
          </div>
          
          <p style={{ color: '#ffff00', marginTop: '20px' }}>
            Press F12 to open DevTools and check the Console for more details.
          </p>
          
          <p style={{ color: '#888', marginTop: '20px', fontSize: '12px' }}>
            Site: rootstechnews.com
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

