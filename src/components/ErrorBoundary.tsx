/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

/**
 * Error Boundary component for graceful error handling
 * Prevents entire app crashes and provides user-friendly error messages
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details for debugging
    console.error('🚨 ErrorBoundary caught an error:', error);
    console.error('🚨 Error info:', errorInfo);

    // Update state with error details
    this.setState({
      error,
      errorInfo
    });

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Track error in analytics (non-blocking)
    this.trackError(error, errorInfo);
  }

  private async trackError(error: Error, errorInfo: ErrorInfo) {
    try {
      // Track error in analytics for monitoring
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'error_boundary_triggered',
          data: {
            errorMessage: error.message,
            errorStack: error.stack?.substring(0, 500), // Limit stack trace size
            componentStack: errorInfo.componentStack?.substring(0, 500),
            timestamp: new Date().toISOString(),
            userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown'
          }
        })
      }).catch(console.warn); // Don't let analytics tracking fail the error boundary
    } catch (analyticsError) {
      console.warn('Failed to track error in analytics:', analyticsError);
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI - Synapsas style
      return (
        <div className="bg-white">
          {/* Main Error Section */}
          <section className="px-[5%] py-16">
            <div className="max-w-4xl mx-auto text-center">
              {/* Three-dot error animation */}
              <div className="flex items-center justify-center space-x-2 mb-8">
                <div className="w-3 h-3 bg-black [animation-delay:-0.3s] animate-pulse"></div>
                <div className="w-3 h-3 bg-black [animation-delay:-0.15s] animate-pulse"></div>
                <div className="w-3 h-3 bg-black animate-pulse"></div>
              </div>

              {/* Error Icon */}
              <div className="w-16 h-16 bg-black text-white flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              <h1 className="font-space-grotesk text-4xl md:text-5xl font-bold text-black mb-6">
                Something went wrong
              </h1>
              
              <p className="font-inter text-xl text-black/80 leading-relaxed mb-8 max-w-2xl mx-auto">
                We've encountered an unexpected error. This has been automatically reported to our team and we're working on a fix.
              </p>

              {/* Show error details in development */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mb-8 text-left max-w-2xl mx-auto">
                  <summary className="cursor-pointer text-sm font-semibold text-black border-b border-black pb-1 mb-3">
                    Error Details (Development)
                  </summary>
                  <div className="bg-gray-50 border border-black p-4 text-xs font-mono text-black/80 overflow-auto max-h-40">
                    <div className="font-bold mb-2">{this.state.error.message}</div>
                    <div className="whitespace-pre-wrap">{this.state.error.stack}</div>
                  </div>
                </details>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-8">
                <button
                  onClick={this.handleRetry}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white font-semibold border-2 border-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/25"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Try Again
                </button>
                
                <button
                  onClick={this.handleReload}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-transparent text-black font-semibold border-2 border-black transition-all duration-300 hover:bg-black hover:text-white hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v16h16V4H4zm8 10l-4-4h3V6h2v4h3l-4 4z" />
                  </svg>
                  Reload Page
                </button>
              </div>

              <p className="text-sm text-black/60">
                If this problem persists, please contact our support team.
              </p>
            </div>
          </section>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Higher-order component for wrapping components with error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode,
  onError?: (error: Error, errorInfo: ErrorInfo) => void
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback} onError={onError}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

/**
 * Lightweight error boundary for specific components
 */
export function ComponentErrorBoundary({ 
  children, 
  componentName 
}: { 
  children: ReactNode; 
  componentName?: string;
}) {
  return (
    <ErrorBoundary
      fallback={
        <div className="bg-white border border-black p-4 my-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-black text-white flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="font-space-grotesk text-sm font-bold text-black">
                {componentName ? `${componentName} Error` : 'Component Error'}
              </h3>
              <p className="font-inter text-sm text-black/80 mt-1">
                This component failed to load. Please try refreshing the page.
              </p>
            </div>
          </div>
        </div>
      }
      onError={(error, errorInfo) => {
        console.error(`🚨 ${componentName || 'Component'} Error:`, error);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

export default ErrorBoundary;