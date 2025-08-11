/* eslint-disable @typescript-eslint/no-unused-vars */
import { TimingConfig, SchedulingInfo } from '@/types/replyGeneration';

export class SchedulingService {
  static calculateScheduledTimestamp(
    timingConfig: TimingConfig | null, 
    discussionCreatedAt: string
  ): SchedulingInfo {
    const discussionDate = new Date(discussionCreatedAt);
    const now = new Date();
    
    if (!timingConfig || timingConfig.type === 'immediate') {
      // Post immediately
      return {
        timestamp: now.toISOString(),
        scheduledDelay: 0
      };
    }
    
    if (timingConfig.type === 'scheduled') {
      // Schedule for specific hours after discussion creation
      const scheduledHours = timingConfig.scheduledHours || 1;
      const scheduledDate = new Date(discussionDate.getTime() + (scheduledHours * 60 * 60 * 1000));
      
      return {
        timestamp: scheduledDate.toISOString(),
        scheduledDelay: scheduledHours * 60 // in minutes
      };
    }
    
    if (timingConfig.type === 'random') {
      // Random delay between 1 hour and maxRandomHours
      const minHours = 1;
      const maxHours = timingConfig.maxRandomHours || 24;
      const randomHours = Math.random() * (maxHours - minHours) + minHours;
      const scheduledDate = new Date(discussionDate.getTime() + (randomHours * 60 * 60 * 1000));
      
      return {
        timestamp: scheduledDate.toISOString(),
        scheduledDelay: Math.round(randomHours * 60) // in minutes
      };
    }
    
    // Default to immediate if unknown type
    return {
      timestamp: now.toISOString(),
      scheduledDelay: 0
    };
  }

  static validateTimingConfig(timingConfig: any): TimingConfig | null {
    if (!timingConfig || typeof timingConfig !== 'object') {
      return null;
    }

    const validTypes = ['immediate', 'scheduled', 'random'];
    
    if (!validTypes.includes(timingConfig.type)) {
      console.warn('Invalid timing config type, defaulting to immediate');
      return { type: 'immediate' };
    }

    const config: TimingConfig = {
      type: timingConfig.type
    };

    if (timingConfig.type === 'scheduled') {
      if (typeof timingConfig.scheduledHours === 'number' && timingConfig.scheduledHours > 0) {
        config.scheduledHours = timingConfig.scheduledHours;
      } else {
        console.warn('Invalid scheduledHours, defaulting to 1 hour');
        config.scheduledHours = 1;
      }
    }

    if (timingConfig.type === 'random') {
      if (typeof timingConfig.maxRandomHours === 'number' && timingConfig.maxRandomHours > 1) {
        config.maxRandomHours = timingConfig.maxRandomHours;
      } else {
        console.warn('Invalid maxRandomHours, defaulting to 24 hours');
        config.maxRandomHours = 24;
      }
    }

    return config;
  }

  static getTimingDescription(timingConfig: TimingConfig | null): string {
    if (!timingConfig || timingConfig.type === 'immediate') {
      return 'Reply will be posted immediately';
    }

    if (timingConfig.type === 'scheduled') {
      const hours = timingConfig.scheduledHours || 1;
      return `Reply will be posted ${hours} hour${hours !== 1 ? 's' : ''} after discussion creation`;
    }

    if (timingConfig.type === 'random') {
      const maxHours = timingConfig.maxRandomHours || 24;
      return `Reply will be posted randomly between 1 and ${maxHours} hours after discussion creation`;
    }

    return 'Unknown timing configuration';
  }

  static isScheduledInFuture(scheduledTimestamp: string): boolean {
    const scheduled = new Date(scheduledTimestamp);
    const now = new Date();
    
    return scheduled > now;
  }

  static getScheduledDelay(scheduledTimestamp: string): number {
    const scheduled = new Date(scheduledTimestamp);
    const now = new Date();
    
    if (scheduled <= now) {
      return 0;
    }

    // Return delay in minutes
    return Math.round((scheduled.getTime() - now.getTime()) / (1000 * 60));
  }
}