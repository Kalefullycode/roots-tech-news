import React, { Component, ErrorInfo, ReactNode } from 'react';

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
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
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
              <pre style={{ margin: 0, color: '#ff6b6b' }}>
                {this.state.error.toString()}
              </pre>
              
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
          
          <div style={{ marginTop: '20px' }}>
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

