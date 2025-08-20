/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ChartErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Chart component error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="bg-white border border-black p-6 text-center">
          {/* Three-dot error animation */}
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-black [animation-delay:-0.3s] animate-pulse"></div>
            <div className="w-3 h-3 bg-black [animation-delay:-0.15s] animate-pulse"></div>
            <div className="w-3 h-3 bg-black animate-pulse"></div>
          </div>
          
          <div className="w-12 h-12 bg-black text-white flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="font-space-grotesk text-lg font-bold text-black mb-2">
            Chart Loading Error
          </h3>
          <p className="font-inter text-sm text-black/80 mb-4 leading-relaxed">
            There was an error loading the chart component. Please try again.
          </p>
          <button
            onClick={this.handleRetry}
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-semibold border-2 border-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-6 text-left">
              <summary className="text-sm text-black font-semibold cursor-pointer border-b border-black pb-1">Error Details</summary>
              <pre className="mt-3 text-xs text-black/70 bg-gray-50 border border-black p-3 overflow-auto font-mono">
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ChartErrorBoundary;