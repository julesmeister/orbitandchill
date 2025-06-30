/* eslint-disable @typescript-eslint/no-unused-vars */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerOptions {
  showTimestamp?: boolean;
  showStackTrace?: boolean;
  colorize?: boolean;
}

class Logger {
  private static instance: Logger;
  private isDevelopment = process.env.NODE_ENV === 'development';
  private enabledLevels: Set<LogLevel> = new Set(['info', 'warn', 'error']);
  
  private constructor() {
    // In development, enable all log levels
    if (this.isDevelopment) {
      this.enabledLevels.add('debug');
    }
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private getCallerInfo(): string {
    const error = new Error();
    const stack = error.stack?.split('\n') || [];
    
    // Find the first stack frame outside this logger
    for (let i = 3; i < stack.length; i++) {
      const line = stack[i];
      if (!line.includes('/logger.ts')) {
        // Extract file path and line number
        const match = line.match(/\((.+):(\d+):(\d+)\)/) || 
                     line.match(/at (.+):(\d+):(\d+)/);
        
        if (match) {
          const fullPath = match[1];
          const lineNumber = match[2];
          
          // Get relative path from src/
          const srcIndex = fullPath.indexOf('/src/');
          const relativePath = srcIndex !== -1 
            ? fullPath.substring(srcIndex + 1)
            : fullPath.split('/').slice(-2).join('/');
          
          return `${relativePath}:${lineNumber}`;
        }
      }
    }
    
    return 'unknown';
  }

  private formatMessage(level: LogLevel, message: string, data?: any): void {
    if (!this.enabledLevels.has(level)) return;

    const timestamp = new Date().toISOString();
    const caller = this.getCallerInfo();
    
    // Color codes for different log levels
    const colors = {
      debug: '\x1b[36m', // Cyan
      info: '\x1b[32m',  // Green
      warn: '\x1b[33m',  // Yellow
      error: '\x1b[31m', // Red
      reset: '\x1b[0m'
    };

    const color = this.isDevelopment ? colors[level] : '';
    const reset = this.isDevelopment ? colors.reset : '';
    
    // Format: [LEVEL] [src/file.ts:123] Message
    const prefix = `${color}[${level.toUpperCase()}]${reset} [${caller}]`;
    
    switch (level) {
      case 'error':
        console.error(prefix, message, data || '');
        break;
      case 'warn':
        console.warn(prefix, message, data || '');
        break;
      default:
        console.log(prefix, message, data || '');
    }
  }

  debug(message: string, data?: any): void {
    this.formatMessage('debug', message, data);
  }

  info(message: string, data?: any): void {
    this.formatMessage('info', message, data);
  }

  warn(message: string, data?: any): void {
    this.formatMessage('warn', message, data);
  }

  error(message: string, error?: Error | any): void {
    this.formatMessage('error', message, error);
    
    // In development, also log the stack trace
    if (this.isDevelopment && error instanceof Error && error.stack) {
      console.error('Stack trace:', error.stack);
    }
  }

  // Group related logs together
  group(label: string, fn: () => void): void {
    if (this.isDevelopment) {
      console.group(`[${this.getCallerInfo()}] ${label}`);
      fn();
      console.groupEnd();
    } else {
      fn();
    }
  }

  // Time operations
  time(label: string): void {
    if (this.isDevelopment) {
      console.time(`[${this.getCallerInfo()}] ${label}`);
    }
  }

  timeEnd(label: string): void {
    if (this.isDevelopment) {
      console.timeEnd(`[${this.getCallerInfo()}] ${label}`);
    }
  }

  // Table for structured data
  table(data: any): void {
    if (this.isDevelopment) {
      console.log(`[TABLE] [${this.getCallerInfo()}]`);
      console.table(data);
    }
  }

  // Enable/disable log levels dynamically
  setLogLevel(level: LogLevel | LogLevel[]): void {
    if (Array.isArray(level)) {
      this.enabledLevels = new Set(level);
    } else {
      this.enabledLevels = new Set(['error', 'warn', 'info']);
      if (level === 'debug') this.enabledLevels.add('debug');
    }
  }
}

// Export singleton instance
export const logger = Logger.getInstance();

// Export a factory for component-specific loggers
export function createLogger(component: string) {
  return {
    debug: (message: string, data?: any) => 
      logger.debug(`[${component}] ${message}`, data),
    info: (message: string, data?: any) => 
      logger.info(`[${component}] ${message}`, data),
    warn: (message: string, data?: any) => 
      logger.warn(`[${component}] ${message}`, data),
    error: (message: string, error?: Error | any) => 
      logger.error(`[${component}] ${message}`, error),
    group: (label: string, fn: () => void) => 
      logger.group(`[${component}] ${label}`, fn),
    time: (label: string) => 
      logger.time(`[${component}] ${label}`),
    timeEnd: (label: string) => 
      logger.timeEnd(`[${component}] ${label}`),
    table: (data: any) => {
      console.log(`[TABLE] [${component}]`);
      logger.table(data);
    }
  };
}

// Convenience exports for different use cases
export const dbLogger = createLogger('Database');
export const apiLogger = createLogger('API');
export const cacheLogger = createLogger('Cache');
export const memLogger = createLogger('Memory');
export const authLogger = createLogger('Auth');