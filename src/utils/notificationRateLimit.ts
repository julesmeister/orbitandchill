/* eslint-disable @typescript-eslint/no-unused-vars */

interface RateLimitRule {
  maxNotifications: number;
  timeWindowMinutes: number;
  burstLimit?: number; // Allow short bursts
  cooldownMinutes?: number; // Cooldown after hitting limit
}

interface UserRateLimit {
  notifications: Date[];
  isOnCooldown: boolean;
  cooldownUntil?: Date;
  warningsSent: number;
}

/**
 * Rate limiting system to prevent notification spam and abuse
 */
export class NotificationRateLimiter {
  private static instance: NotificationRateLimiter;
  private userLimits = new Map<string, UserRateLimit>();
  
  // Default rate limiting rules
  private readonly DEFAULT_RULES: Record<string, RateLimitRule> = {
    // Per-user limits
    'user_total': {
      maxNotifications: 50,
      timeWindowMinutes: 60,
      burstLimit: 10,
      cooldownMinutes: 30
    },
    
    // Per notification type limits
    'discussion_like': {
      maxNotifications: 20,
      timeWindowMinutes: 60,
      burstLimit: 5
    },
    'discussion_reply': {
      maxNotifications: 15,
      timeWindowMinutes: 60,
      burstLimit: 3
    },
    'discussion_mention': {
      maxNotifications: 10,
      timeWindowMinutes: 60,
      burstLimit: 3
    },
    'comment_like': {
      maxNotifications: 30,
      timeWindowMinutes: 60,
      burstLimit: 8
    },
    'comment_reply': {
      maxNotifications: 20,
      timeWindowMinutes: 60,
      burstLimit: 5
    },
    'follow': {
      maxNotifications: 10,
      timeWindowMinutes: 60,
      burstLimit: 3
    },
    'system_announcement': {
      maxNotifications: 5,
      timeWindowMinutes: 60,
      burstLimit: 2
    }
  };

  private constructor() {
    // Clean up old rate limit data every 5 minutes
    setInterval(() => {
      this.cleanupOldData();
    }, 5 * 60 * 1000);
  }

  static getInstance(): NotificationRateLimiter {
    if (!NotificationRateLimiter.instance) {
      NotificationRateLimiter.instance = new NotificationRateLimiter();
    }
    return NotificationRateLimiter.instance;
  }

  /**
   * Check if a notification is allowed under rate limits
   */
  async checkRateLimit(
    userId: string,
    notificationType: string,
    actorId?: string
  ): Promise<{
    allowed: boolean;
    reason?: string;
    retryAfter?: number; // seconds
    currentCount?: number;
    limit?: number;
  }> {
    try {
      // Get or create user rate limit data
      const userLimit = this.getUserLimit(userId);
      
      // Check if user is on cooldown
      if (userLimit.isOnCooldown && userLimit.cooldownUntil) {
        if (new Date() < userLimit.cooldownUntil) {
          const retryAfter = Math.ceil((userLimit.cooldownUntil.getTime() - Date.now()) / 1000);
          return {
            allowed: false,
            reason: 'User is on cooldown due to rate limit exceeded',
            retryAfter
          };
        } else {
          // Cooldown expired, reset
          userLimit.isOnCooldown = false;
          userLimit.cooldownUntil = undefined;
          userLimit.warningsSent = 0;
        }
      }

      // Check total user limit
      const totalCheck = this.checkSpecificLimit(userLimit, 'user_total');
      if (!totalCheck.allowed) {
        return this.handleRateLimitExceeded(userId, userLimit, 'user_total', totalCheck);
      }

      // Check type-specific limit
      if (this.DEFAULT_RULES[notificationType]) {
        const typeCheck = this.checkSpecificLimit(userLimit, notificationType);
        if (!typeCheck.allowed) {
          return this.handleRateLimitExceeded(userId, userLimit, notificationType, typeCheck);
        }
      }

      // Check for actor-based abuse (same actor sending too many notifications)
      if (actorId) {
        const actorCheck = this.checkActorLimit(userId, actorId);
        if (!actorCheck.allowed) {
          return {
            allowed: false,
            reason: `Too many notifications from the same user (${actorId})`,
            retryAfter: 300 // 5 minutes
          };
        }
      }

      return { allowed: true };
    } catch (error) {
      console.error('Error checking rate limit:', error);
      // On error, allow the notification to prevent blocking
      return { allowed: true };
    }
  }

  /**
   * Record a notification for rate limiting purposes
   */
  async recordNotification(
    userId: string,
    notificationType: string,
    actorId?: string
  ): Promise<void> {
    try {
      const userLimit = this.getUserLimit(userId);
      const now = new Date();
      
      // Add to user's notification history
      userLimit.notifications.push(now);
      
      // Store actor information for abuse detection
      if (actorId) {
        const actorKey = `${userId}_actor_${actorId}`;
        const actorLimit = this.getUserLimit(actorKey);
        actorLimit.notifications.push(now);
      }
    } catch (error) {
      console.error('Error recording notification for rate limiting:', error);
    }
  }

  /**
   * Check a specific rate limit rule
   */
  private checkSpecificLimit(
    userLimit: UserRateLimit,
    ruleKey: string
  ): {
    allowed: boolean;
    currentCount: number;
    limit: number;
    timeWindow: number;
  } {
    const rule = this.DEFAULT_RULES[ruleKey];
    if (!rule) {
      return { allowed: true, currentCount: 0, limit: 0, timeWindow: 0 };
    }

    const now = new Date();
    const windowStart = new Date(now.getTime() - (rule.timeWindowMinutes * 60 * 1000));
    
    // Count notifications within the time window
    const recentNotifications = userLimit.notifications.filter(
      timestamp => timestamp >= windowStart
    );

    const currentCount = recentNotifications.length;
    
    // Check burst limit first
    if (rule.burstLimit) {
      const burstWindowStart = new Date(now.getTime() - (5 * 60 * 1000)); // 5 minutes
      const burstCount = userLimit.notifications.filter(
        timestamp => timestamp >= burstWindowStart
      ).length;
      
      if (burstCount >= rule.burstLimit) {
        return {
          allowed: false,
          currentCount: burstCount,
          limit: rule.burstLimit,
          timeWindow: 5
        };
      }
    }

    // Check main limit
    const allowed = currentCount < rule.maxNotifications;
    
    return {
      allowed,
      currentCount,
      limit: rule.maxNotifications,
      timeWindow: rule.timeWindowMinutes
    };
  }

  /**
   * Check for actor-based abuse
   */
  private checkActorLimit(userId: string, actorId: string): { allowed: boolean } {
    const actorKey = `${userId}_actor_${actorId}`;
    const actorLimit = this.getUserLimit(actorKey);
    
    const now = new Date();
    const windowStart = new Date(now.getTime() - (10 * 60 * 1000)); // 10 minutes
    
    const recentFromActor = actorLimit.notifications.filter(
      timestamp => timestamp >= windowStart
    ).length;
    
    // Allow max 5 notifications from same actor in 10 minutes
    return { allowed: recentFromActor < 5 };
  }

  /**
   * Handle rate limit exceeded scenario
   */
  private handleRateLimitExceeded(
    userId: string,
    userLimit: UserRateLimit,
    ruleKey: string,
    checkResult: any
  ): {
    allowed: boolean;
    reason: string;
    retryAfter?: number;
    currentCount: number;
    limit: number;
  } {
    const rule = this.DEFAULT_RULES[ruleKey];
    
    // Send warning notification if not already sent too many
    if (userLimit.warningsSent < 3) {
      this.sendRateLimitWarning(userId, ruleKey, checkResult);
      userLimit.warningsSent++;
    }

    // Apply cooldown if configured
    if (rule.cooldownMinutes && userLimit.warningsSent >= 2) {
      userLimit.isOnCooldown = true;
      userLimit.cooldownUntil = new Date(Date.now() + (rule.cooldownMinutes * 60 * 1000));
      
      console.warn(`User ${userId} put on cooldown for ${rule.cooldownMinutes} minutes due to rate limit violations`);
    }

    const retryAfter = rule.cooldownMinutes ? rule.cooldownMinutes * 60 : checkResult.timeWindow * 60;
    
    return {
      allowed: false,
      reason: `Rate limit exceeded for ${ruleKey}: ${checkResult.currentCount}/${checkResult.limit} in ${checkResult.timeWindow} minutes`,
      retryAfter,
      currentCount: checkResult.currentCount,
      limit: checkResult.limit
    };
  }

  /**
   * Send a warning notification about rate limiting
   */
  private async sendRateLimitWarning(
    userId: string,
    ruleKey: string,
    checkResult: any
  ): Promise<void> {
    try {
      // Import NotificationService dynamically to avoid circular dependency
      const { NotificationService } = await import('@/db/services/notificationService');
      
      await NotificationService.createNotification({
        userId,
        type: 'rate_limit_warning',
        title: 'Notification Rate Limit Warning',
        message: `You're approaching the rate limit for ${ruleKey}. Current: ${checkResult.currentCount}/${checkResult.limit}`,
        category: 'system',
        priority: 'medium',
        expiresAt: new Date(Date.now() + (24 * 60 * 60 * 1000)) // 24 hours
      });
    } catch (error) {
      console.error('Failed to send rate limit warning:', error);
    }
  }

  /**
   * Get or create user rate limit data
   */
  private getUserLimit(userId: string): UserRateLimit {
    if (!this.userLimits.has(userId)) {
      this.userLimits.set(userId, {
        notifications: [],
        isOnCooldown: false,
        warningsSent: 0
      });
    }
    return this.userLimits.get(userId)!;
  }

  /**
   * Clean up old notification data
   */
  private cleanupOldData(): void {
    const cutoffTime = new Date(Date.now() - (2 * 60 * 60 * 1000)); // 2 hours ago
    let cleanedCount = 0;

    for (const [userId, userLimit] of this.userLimits) {
      const originalLength = userLimit.notifications.length;
      
      // Remove old notifications
      userLimit.notifications = userLimit.notifications.filter(
        timestamp => timestamp >= cutoffTime
      );
      
      cleanedCount += originalLength - userLimit.notifications.length;
      
      // Remove empty entries
      if (userLimit.notifications.length === 0 && !userLimit.isOnCooldown) {
        this.userLimits.delete(userId);
      }
    }

    if (cleanedCount > 0) {
      console.log(`Cleaned up ${cleanedCount} old rate limit entries`);
    }
  }

  /**
   * Get rate limiting statistics
   */
  getRateLimitStats(): {
    totalUsers: number;
    usersOnCooldown: number;
    totalNotificationsTracked: number;
    rules: Record<string, RateLimitRule>;
  } {
    let usersOnCooldown = 0;
    let totalNotifications = 0;

    for (const userLimit of this.userLimits.values()) {
      if (userLimit.isOnCooldown) {
        usersOnCooldown++;
      }
      totalNotifications += userLimit.notifications.length;
    }

    return {
      totalUsers: this.userLimits.size,
      usersOnCooldown,
      totalNotificationsTracked: totalNotifications,
      rules: this.DEFAULT_RULES
    };
  }

  /**
   * Update rate limiting rules
   */
  updateRule(ruleKey: string, rule: RateLimitRule): void {
    this.DEFAULT_RULES[ruleKey] = rule;
  }

  /**
   * Reset rate limits for a user (admin function)
   */
  resetUserLimits(userId: string): void {
    this.userLimits.delete(userId);
  }

  /**
   * Get user's current rate limit status
   */
  getUserStatus(userId: string): {
    isOnCooldown: boolean;
    cooldownUntil?: Date;
    recentNotificationCount: number;
    warningsSent: number;
  } {
    const userLimit = this.userLimits.get(userId);
    
    if (!userLimit) {
      return {
        isOnCooldown: false,
        recentNotificationCount: 0,
        warningsSent: 0
      };
    }

    const now = new Date();
    const windowStart = new Date(now.getTime() - (60 * 60 * 1000)); // 1 hour
    const recentCount = userLimit.notifications.filter(
      timestamp => timestamp >= windowStart
    ).length;

    return {
      isOnCooldown: userLimit.isOnCooldown,
      cooldownUntil: userLimit.cooldownUntil,
      recentNotificationCount: recentCount,
      warningsSent: userLimit.warningsSent
    };
  }
}

/**
 * Helper function to check rate limits before creating a notification
 */
export async function createNotificationWithRateLimit(
  notificationData: {
    userId: string;
    type: string;
    actorId?: string;
    [key: string]: any;
  },
  createFunction: () => Promise<any>
): Promise<{
  success: boolean;
  notificationId?: string;
  rateLimited?: boolean;
  reason?: string;
  retryAfter?: number;
}> {
  const rateLimiter = NotificationRateLimiter.getInstance();
  
  try {
    // Check rate limits
    const rateCheck = await rateLimiter.checkRateLimit(
      notificationData.userId,
      notificationData.type,
      notificationData.actorId
    );

    if (!rateCheck.allowed) {
      console.warn(
        `Rate limit exceeded for user ${notificationData.userId}, type ${notificationData.type}:`,
        rateCheck.reason
      );
      
      return {
        success: false,
        rateLimited: true,
        reason: rateCheck.reason,
        retryAfter: rateCheck.retryAfter
      };
    }

    // Create the notification
    const result = await createFunction();
    
    if (result && result.id) {
      // Record the notification for rate limiting
      await rateLimiter.recordNotification(
        notificationData.userId,
        notificationData.type,
        notificationData.actorId
      );
      
      return {
        success: true,
        notificationId: result.id
      };
    } else {
      return {
        success: false,
        reason: 'Notification creation failed'
      };
    }
  } catch (error) {
    console.error('Error in createNotificationWithRateLimit:', error);
    return {
      success: false,
      reason: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Export singleton instance
export const notificationRateLimiter = NotificationRateLimiter.getInstance();