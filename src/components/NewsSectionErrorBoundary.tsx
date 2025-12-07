import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  sectionName: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class NewsSectionErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`News section "${this.props.sectionName}" failed:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="news-section-error p-6 bg-dark-800 border border-dark-600 rounded-lg">
          <div className="text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Unable to load {this.props.sectionName}
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              There was an error loading this section. Please refresh the page.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: undefined });
                window.location.reload();
              }}
              className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default NewsSectionErrorBoundary;

