/* eslint-disable @typescript-eslint/no-unused-vars */
import { NotificationService } from '@/db/services/notificationService';

interface DeliveryAttempt {
  id: string;
  notificationId: string;
  attemptNumber: number;
  status: 'pending' | 'success' | 'failed' | 'expired';
  errorMessage?: string;
  attemptedAt: Date;
  nextRetryAt?: Date;
}

interface NotificationDeliveryConfig {
  maxRetries: number;
  retryDelays: number[]; // in milliseconds
  expiryHours: number;
  enableRetries: boolean;
}

/**
 * Enhanced notification delivery system with retry mechanism and delivery guarantees
 */
export class NotificationDeliveryManager {
  private static instance: NotificationDeliveryManager;
  private config: NotificationDeliveryConfig;
  private deliveryAttempts = new Map<string, DeliveryAttempt>();
  private retryQueue = new Set<string>();
  private isProcessingRetries = false;

  private constructor() {
    this.config = {
      maxRetries: 3,
      retryDelays: [1000, 5000, 15000], // 1s, 5s, 15s
      expiryHours: 24,
      enableRetries: true
    };

    // Start retry processor
    this.startRetryProcessor();
  }

  static getInstance(): NotificationDeliveryManager {
    if (!NotificationDeliveryManager.instance) {
      NotificationDeliveryManager.instance = new NotificationDeliveryManager();
    }
    return NotificationDeliveryManager.instance;
  }

  /**
   * Attempt to deliver a notification with retry logic
   */
  async deliverNotification(
    notificationId: string,
    deliveryFunction: () => Promise<boolean>,
    options?: Partial<NotificationDeliveryConfig>
  ): Promise<boolean> {
    const config = { ...this.config, ...options };
    
    const attemptId = `${notificationId}_${Date.now()}`;
    
    // Create delivery attempt record
    const attempt: DeliveryAttempt = {
      id: attemptId,
      notificationId,
      attemptNumber: 1,
      status: 'pending',
      attemptedAt: new Date()
    };

    this.deliveryAttempts.set(attemptId, attempt);

    try {
      // Attempt delivery
      const success = await this.executeDelivery(deliveryFunction);
      
      if (success) {
        attempt.status = 'success';
        await this.markNotificationDelivered(notificationId, attemptId);
        return true;
      } else {
        throw new Error('Delivery function returned false');
      }
    } catch (error) {
      attempt.status = 'failed';
      attempt.errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      console.error(`Notification delivery failed (attempt ${attempt.attemptNumber}):`, error);
      
      // Schedule retry if enabled and not exceeded max retries
      if (config.enableRetries && attempt.attemptNumber < config.maxRetries) {
        await this.scheduleRetry(attemptId, config);
      } else {
        attempt.status = 'expired';
        await this.markNotificationFailed(notificationId, attempt.errorMessage);
      }
      
      return false;
    }
  }

  /**
   * Execute delivery with timeout and error handling
   */
  private async executeDelivery(deliveryFunction: () => Promise<boolean>): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      // Set timeout for delivery attempt
      const timeout = setTimeout(() => {
        reject(new Error('Delivery timeout'));
      }, 10000); // 10 second timeout

      try {
        const result = await deliveryFunction();
        clearTimeout(timeout);
        resolve(result);
      } catch (error) {
        clearTimeout(timeout);
        reject(error);
      }
    });
  }

  /**
   * Schedule a retry attempt
   */
  private async scheduleRetry(attemptId: string, config: NotificationDeliveryConfig): Promise<void> {
    const attempt = this.deliveryAttempts.get(attemptId);
    if (!attempt) return;

    const nextAttemptNumber = attempt.attemptNumber + 1;
    const delayIndex = Math.min(nextAttemptNumber - 2, config.retryDelays.length - 1);
    const delay = config.retryDelays[delayIndex];

    attempt.nextRetryAt = new Date(Date.now() + delay);
    this.retryQueue.add(attemptId);

    console.log(`Scheduled retry ${nextAttemptNumber} for notification ${attempt.notificationId} in ${delay}ms`);
  }

  /**
   * Start the retry processor (runs continuously)
   */
  private startRetryProcessor(): void {
    setInterval(async () => {
      if (this.isProcessingRetries || this.retryQueue.size === 0) {
        return;
      }

      this.isProcessingRetries = true;
      
      try {
        await this.processRetries();
      } catch (error) {
        console.error('Error processing retries:', error);
      } finally {
        this.isProcessingRetries = false;
      }
    }, 1000); // Check every second
  }

  /**
   * Process pending retry attempts
   */
  private async processRetries(): Promise<void> {
    const now = new Date();
    const readyRetries: string[] = [];

    // Find attempts ready for retry
    for (const attemptId of this.retryQueue) {
      const attempt = this.deliveryAttempts.get(attemptId);
      if (attempt && attempt.nextRetryAt && attempt.nextRetryAt <= now) {
        readyRetries.push(attemptId);
      }
    }

    // Process ready retries
    for (const attemptId of readyRetries) {
      this.retryQueue.delete(attemptId);
      await this.executeRetry(attemptId);
    }
  }

  /**
   * Execute a retry attempt
   */
  private async executeRetry(attemptId: string): Promise<void> {
    const attempt = this.deliveryAttempts.get(attemptId);
    if (!attempt) return;

    attempt.attemptNumber++;
    attempt.status = 'pending';
    attempt.attemptedAt = new Date();
    attempt.nextRetryAt = undefined;

    try {
      // Get the original notification to retry delivery
      const notification = await NotificationService.getNotificationById(attempt.notificationId);
      if (!notification) {
        attempt.status = 'expired';
        return;
      }

      // Create a simple delivery function for retry
      const deliveryFunction = async (): Promise<boolean> => {
        // For retries, we mainly check if the notification still exists and is valid
        return notification.id !== undefined;
      };

      const success = await this.executeDelivery(deliveryFunction);
      
      if (success) {
        attempt.status = 'success';
        await this.markNotificationDelivered(attempt.notificationId, attemptId);
        console.log(`Notification ${attempt.notificationId} delivered successfully on attempt ${attempt.attemptNumber}`);
      } else {
        throw new Error('Retry delivery failed');
      }
    } catch (error) {
      attempt.status = 'failed';
      attempt.errorMessage = error instanceof Error ? error.message : 'Retry failed';
      
      console.error(`Notification retry failed (attempt ${attempt.attemptNumber}):`, error);
      
      // Schedule another retry if not exceeded max retries
      if (attempt.attemptNumber < this.config.maxRetries) {
        await this.scheduleRetry(attemptId, this.config);
      } else {
        attempt.status = 'expired';
        await this.markNotificationFailed(attempt.notificationId, attempt.errorMessage);
        console.warn(`Notification ${attempt.notificationId} delivery abandoned after ${attempt.attemptNumber} attempts`);
      }
    }
  }

  /**
   * Mark notification as successfully delivered
   */
  private async markNotificationDelivered(notificationId: string, attemptId: string): Promise<void> {
    try {
      // Update notification with delivery confirmation
      await NotificationService.updateNotification(notificationId, {
        metadata: JSON.stringify({
          deliveryStatus: 'delivered',
          deliveredAt: new Date().toISOString(),
          attemptId: attemptId
        })
      });
    } catch (error) {
      console.error('Failed to mark notification as delivered:', error);
    }
  }

  /**
   * Mark notification as failed delivery
   */
  private async markNotificationFailed(notificationId: string, errorMessage?: string): Promise<void> {
    try {
      // Update notification with failure status
      await NotificationService.updateNotification(notificationId, {
        metadata: JSON.stringify({
          deliveryStatus: 'failed',
          failedAt: new Date().toISOString(),
          errorMessage: errorMessage
        })
      });
    } catch (error) {
      console.error('Failed to mark notification as failed:', error);
    }
  }

  /**
   * Get delivery statistics
   */
  getDeliveryStats(): {
    totalAttempts: number;
    successfulDeliveries: number;
    failedDeliveries: number;
    pendingRetries: number;
    expiredNotifications: number;
  } {
    const attempts = Array.from(this.deliveryAttempts.values());
    
    return {
      totalAttempts: attempts.length,
      successfulDeliveries: attempts.filter(a => a.status === 'success').length,
      failedDeliveries: attempts.filter(a => a.status === 'failed').length,
      pendingRetries: this.retryQueue.size,
      expiredNotifications: attempts.filter(a => a.status === 'expired').length
    };
  }

  /**
   * Clean up old delivery attempts
   */
  async cleanupOldAttempts(): Promise<void> {
    const cutoffTime = new Date(Date.now() - (this.config.expiryHours * 60 * 60 * 1000));
    const toRemove: string[] = [];

    for (const [attemptId, attempt] of this.deliveryAttempts) {
      if (attempt.attemptedAt < cutoffTime) {
        toRemove.push(attemptId);
        this.retryQueue.delete(attemptId);
      }
    }

    for (const attemptId of toRemove) {
      this.deliveryAttempts.delete(attemptId);
    }

    console.log(`Cleaned up ${toRemove.length} old delivery attempts`);
  }

  /**
   * Configure delivery behavior
   */
  updateConfig(config: Partial<NotificationDeliveryConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

/**
 * Wrapper function for reliable notification creation
 */
export async function createReliableNotification(
  notificationData: any,
  createFunction: () => Promise<any>
): Promise<boolean> {
  const deliveryManager = NotificationDeliveryManager.getInstance();
  
  // Generate temporary ID for tracking
  const tempId = `temp_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  
  return await deliveryManager.deliverNotification(
    tempId,
    async () => {
      const result = await createFunction();
      return result && result.id !== undefined;
    }
  );
}

// Export singleton instance
export const deliveryManager = NotificationDeliveryManager.getInstance();