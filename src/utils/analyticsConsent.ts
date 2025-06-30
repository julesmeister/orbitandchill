/* eslint-disable @typescript-eslint/no-unused-vars */
// Analytics consent management utility

export type ConsentStatus = 'accepted' | 'declined' | 'pending';

interface ConsentData {
  status: ConsentStatus;
  date?: string;
  version?: string;
}

const CONSENT_KEY = 'analytics_consent';
const CONSENT_DATE_KEY = 'analytics_consent_date';
const CONSENT_VERSION = '1.0';

export class AnalyticsConsent {
  private static instance: AnalyticsConsent;
  private listeners: ((status: ConsentStatus) => void)[] = [];

  private constructor() {}

  static getInstance(): AnalyticsConsent {
    if (!AnalyticsConsent.instance) {
      AnalyticsConsent.instance = new AnalyticsConsent();
    }
    return AnalyticsConsent.instance;
  }

  getConsentStatus(): ConsentStatus {
    if (typeof window === 'undefined') return 'pending';
    
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) return 'pending';
    
    return consent as ConsentStatus;
  }

  getConsentData(): ConsentData {
    if (typeof window === 'undefined') {
      return { status: 'pending' };
    }

    const status = this.getConsentStatus();
    const date = localStorage.getItem(CONSENT_DATE_KEY);
    
    return {
      status,
      date: date || undefined,
      version: CONSENT_VERSION
    };
  }

  setConsent(status: ConsentStatus): void {
    if (typeof window === 'undefined') return;

    localStorage.setItem(CONSENT_KEY, status);
    localStorage.setItem(CONSENT_DATE_KEY, new Date().toISOString());
    
    // Notify listeners
    this.listeners.forEach(listener => listener(status));
    
    // Clear analytics data if declined
    if (status === 'declined') {
      this.clearAnalyticsData();
    }
  }

  acceptConsent(): void {
    this.setConsent('accepted');
  }

  declineConsent(): void {
    this.setConsent('declined');
  }

  resetConsent(): void {
    if (typeof window === 'undefined') return;

    localStorage.removeItem(CONSENT_KEY);
    localStorage.removeItem(CONSENT_DATE_KEY);
    
    // Notify listeners
    this.listeners.forEach(listener => listener('pending'));
  }

  hasConsent(): boolean {
    return this.getConsentStatus() === 'accepted';
  }

  shouldShowBanner(): boolean {
    return this.getConsentStatus() === 'pending';
  }

  isConsentRequired(): boolean {
    // Always require consent for analytics
    return true;
  }

  private clearAnalyticsData(): void {
    if (typeof window === 'undefined') return;

    // Clear analytics-related localStorage items
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (
        key.startsWith('analytics_') || 
        key.startsWith('location_analytics_') ||
        key.startsWith('session_')
      )) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.warn('Failed to remove analytics data:', key, error);
      }
    });

    // Clear session storage as well
    try {
      sessionStorage.removeItem('analytics_session_id');
    } catch (error) {
      console.warn('Failed to clear session analytics data:', error);
    }
  }

  onConsentChange(listener: (status: ConsentStatus) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // GDPR compliance methods
  exportUserData(): object {
    if (typeof window === 'undefined') return {};

    const data: any = {
      consent: this.getConsentData(),
      analyticsData: {}
    };

    // Collect analytics data for export
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('analytics_')) {
        try {
          data.analyticsData[key] = localStorage.getItem(key);
        } catch (error) {
          console.warn('Failed to export analytics data:', key, error);
        }
      }
    }

    return data;
  }

  deleteAllUserData(): void {
    this.clearAnalyticsData();
    this.resetConsent();
  }
}

// Create singleton instance
export const analyticsConsent = AnalyticsConsent.getInstance();

// Convenience functions
export const hasAnalyticsConsent = (): boolean => {
  return analyticsConsent.hasConsent();
};

export const shouldTrackAnalytics = (): boolean => {
  // Always check consent before tracking
  return analyticsConsent.hasConsent();
};

export const acceptAnalyticsConsent = (): void => {
  analyticsConsent.acceptConsent();
};

export const declineAnalyticsConsent = (): void => {
  analyticsConsent.declineConsent();
};

export const resetAnalyticsConsent = (): void => {
  analyticsConsent.resetConsent();
};

export const getConsentStatus = (): ConsentStatus => {
  return analyticsConsent.getConsentStatus();
};