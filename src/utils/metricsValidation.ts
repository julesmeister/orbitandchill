/* eslint-disable @typescript-eslint/no-unused-vars */
import { HistoricalPeriod } from '@/types/metrics';

export class MetricsValidation {
  static isValidPeriod(period: string | null): period is HistoricalPeriod | null {
    if (period === null) return true;
    return ['daily', 'monthly', 'yearly'].includes(period);
  }

  static validatePeriodParameter(period: string | null): HistoricalPeriod | null {
    if (!period) return null;
    
    if (!this.isValidPeriod(period)) {
      throw new Error(`Invalid period parameter: ${period}. Must be one of: daily, monthly, yearly`);
    }
    
    return period;
  }

  static sanitizeNumericValue(value: unknown, fallback: number = 0): number {
    if (typeof value === 'number' && !isNaN(value) && isFinite(value)) {
      return Math.max(0, Math.floor(value)); // Ensure non-negative integer
    }
    return fallback;
  }

  static sanitizeStringValue(value: unknown, fallback: string = ''): string {
    if (typeof value === 'string') {
      return value.trim();
    }
    return fallback;
  }

  static validateResponseSize(data: any): boolean {
    try {
      const jsonString = JSON.stringify(data);
      const sizeInMB = new Blob([jsonString]).size / (1024 * 1024);
      return sizeInMB < 5; // Max 5MB response
    } catch {
      return false;
    }
  }
}