import React from 'react';
import Alert from '../common/Alert';

/**
 * Error Boundary Component
 * Catches errors in child components and displays a fallback UI
 * Logs errors to console for debugging
 */
class ScanErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    console.error('ScanErrorBoundary caught error:', error);
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error Details:', {
      error: error.toString(),
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    });
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full">
          <Alert
            type="error"
            message="Something went wrong with the scan page. Please refresh the page and try again."
            className="my-6"
          />
          <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
            <h3 className="font-bold text-red-800 mb-2">Error Details (for debugging):</h3>
            <pre className="text-sm text-red-700 overflow-auto max-h-40">
              {this.state.error && this.state.error.toString()}
              {'\n\n'}
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ScanErrorBoundary;
