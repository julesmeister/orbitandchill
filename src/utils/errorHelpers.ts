// Error handling utilities following API_DATABASE_PROTOCOL.md conventions

/**
 * Safely formats unknown errors from catch blocks to avoid TypeScript issues
 */
export const formatError = (error: unknown): { message: string; stack?: string } => {
  if (error instanceof Error) {
    return {
      message: error.message,
      stack: error.stack
    };
  }
  return {
    message: String(error),
    stack: undefined
  };
};

/**
 * Error classification for appropriate handling
 */
export enum ErrorType {
  VALIDATION = 'validation',      // 400 - User input issues
  AUTHENTICATION = 'auth',        // 401 - Auth required
  AUTHORIZATION = 'authz',        // 403 - Insufficient permissions
  NOT_FOUND = 'not_found',       // 404 - Resource doesn't exist
  RATE_LIMIT = 'rate_limit',     // 429 - Too many requests
  DATABASE = 'database',         // 500 - Database issues
  NETWORK = 'network',           // Network connectivity
  UNKNOWN = 'unknown'            // Unexpected errors
}

/**
 * Formatted error interface
 */
interface FormattedError {
  type: ErrorType;
  message: string;
  canRetry: boolean;
}

/**
 * Error handling utility that classifies errors and provides retry guidance
 */
export const handleApiError = (error: any): FormattedError => {
  if (error.code === 'SQLITE_BUSY') {
    return {
      type: ErrorType.DATABASE,
      message: 'Database is temporarily busy. Please try again.',
      canRetry: true
    };
  }
  
  if (error.message?.includes('fetch failed')) {
    return {
      type: ErrorType.NETWORK,
      message: 'Network connection failed. Check your internet connection.',
      canRetry: true
    };
  }
  
  return {
    type: ErrorType.UNKNOWN,
    message: 'An unexpected error occurred.',
    canRetry: false
  };
};