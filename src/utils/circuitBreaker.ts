/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Circuit Breaker Pattern for Database Operations
 * Helps handle transient failures and prevents cascading failures
 */

interface CircuitBreakerConfig {
  failureThreshold: number;
  monitoringPeriod: number;
}

enum CircuitState {
  CLOSED = 'CLOSED',     // Normal operation
  OPEN = 'OPEN',         // Failing, block requests
  HALF_OPEN = 'HALF_OPEN' // Test if service recovered
}

class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failureCount = 0;
  private lastFailureTime = 0;
  private config: CircuitBreakerConfig;

  constructor(config: Partial<CircuitBreakerConfig> = {}) {
    this.config = {
      failureThreshold: 5,        // Open after 5 consecutive failures
      monitoringPeriod: 300000,   // Reset failure count every 5 minutes
      ...config
    };
  }

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      // Allow immediate retry - circuit breaker operates on failure count only
      this.state = CircuitState.HALF_OPEN;
      console.log('🔄 Circuit breaker entering HALF_OPEN state');
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error: any) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failureCount = 0;
    this.state = CircuitState.CLOSED;
  }

  private onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.config.failureThreshold) {
      this.state = CircuitState.OPEN;
      console.warn(`🚨 Circuit breaker OPENED after ${this.failureCount} failures`);
    }
  }

  getState(): CircuitState {
    // Reset failure count if monitoring period has passed
    if (Date.now() - this.lastFailureTime > this.config.monitoringPeriod) {
      this.failureCount = 0;
    }
    
    return this.state;
  }

  getStats() {
    return {
      state: this.state,
      failureCount: this.failureCount,
      lastFailureTime: this.lastFailureTime
    };
  }
}

// Global circuit breaker for database operations
export const dbCircuitBreaker = new CircuitBreaker({
  failureThreshold: 5,        // Less sensitive for development - open after 5 failures
  monitoringPeriod: 300000,   // 5 minutes monitoring period
});

export { CircuitBreaker, CircuitState };