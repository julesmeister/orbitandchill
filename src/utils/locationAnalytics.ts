/* eslint-disable @typescript-eslint/no-unused-vars */

interface LocationAnalyticsEvent {
  type: 'location_request' | 'permission_granted' | 'permission_denied' | 'location_error' | 'fallback_used';
  source: 'birth' | 'current' | 'fallback';
  coordinates?: { lat: string; lon: string };
  errorType?: 'permission_denied' | 'position_unavailable' | 'timeout' | 'not_supported' | 'unknown';
  timestamp: Date;
  userAgent: string;
  sessionId?: string;
}

class LocationAnalytics {
  private static instance: LocationAnalytics;
  private events: LocationAnalyticsEvent[] = [];
  private sessionId: string;
  private isClient: boolean;

  private constructor() {
    this.isClient = typeof window !== 'undefined';
    this.sessionId = this.generateSessionId();
    if (this.isClient) {
      this.loadFromStorage();
    }
  }

  public static getInstance(): LocationAnalytics {
    if (!LocationAnalytics.instance) {
      LocationAnalytics.instance = new LocationAnalytics();
    }
    return LocationAnalytics.instance;
  }

  private generateSessionId(): string {
    return 'session_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
  }

  private loadFromStorage(): void {
    if (!this.isClient) return;
    
    try {
      const stored = localStorage.getItem('location_analytics_events');
      if (stored) {
        this.events = JSON.parse(stored).map((event: any) => ({
          ...event,
          timestamp: new Date(event.timestamp)
        }));
      }
    } catch (error) {
      console.warn('Failed to load location analytics from storage:', error);
    }
  }

  private saveToStorage(): void {
    if (!this.isClient) return;
    
    try {
      // Keep only last 100 events to prevent storage bloat
      const eventsToStore = this.events.slice(-100);
      localStorage.setItem('location_analytics_events', JSON.stringify(eventsToStore));
    } catch (error) {
      console.warn('Failed to save location analytics to storage:', error);
    }
  }

  public trackLocationRequest(): void {
    this.addEvent({
      type: 'location_request',
      source: 'current',
      timestamp: new Date(),
      userAgent: this.isClient ? navigator.userAgent : 'server',
      sessionId: this.sessionId
    });
  }

  public trackPermissionGranted(coordinates: { lat: string; lon: string }): void {
    this.addEvent({
      type: 'permission_granted',
      source: 'current',
      coordinates,
      timestamp: new Date(),
      userAgent: this.isClient ? navigator.userAgent : 'server',
      sessionId: this.sessionId
    });
  }

  public trackPermissionDenied(): void {
    this.addEvent({
      type: 'permission_denied',
      source: 'current',
      timestamp: new Date(),
      userAgent: this.isClient ? navigator.userAgent : 'server',
      sessionId: this.sessionId
    });
  }

  public trackLocationError(errorType: 'permission_denied' | 'position_unavailable' | 'timeout' | 'not_supported' | 'unknown'): void {
    this.addEvent({
      type: 'location_error',
      source: 'current',
      errorType,
      timestamp: new Date(),
      userAgent: this.isClient ? navigator.userAgent : 'server',
      sessionId: this.sessionId
    });
  }

  public trackFallbackUsed(): void {
    this.addEvent({
      type: 'fallback_used',
      source: 'fallback',
      coordinates: { lat: '40.7128', lon: '-74.0060' }, // NYC
      timestamp: new Date(),
      userAgent: this.isClient ? navigator.userAgent : 'server',
      sessionId: this.sessionId
    });
  }

  public trackBirthLocationUsed(coordinates: { lat: string; lon: string }): void {
    this.addEvent({
      type: 'location_request',
      source: 'birth',
      coordinates,
      timestamp: new Date(),
      userAgent: this.isClient ? navigator.userAgent : 'server',
      sessionId: this.sessionId
    });
  }

  private addEvent(event: LocationAnalyticsEvent): void {
    this.events.push(event);
    this.saveToStorage();
    
    // Also try to send to analytics API if available
    this.sendToAPI(event);
  }

  private async sendToAPI(event: LocationAnalyticsEvent): Promise<void> {
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: 'location_analytics',
          data: event
        }),
      });
    } catch (error) {
      // Silently fail - analytics should not break the app
      console.debug('Failed to send location analytics to API:', error);
    }
  }

  public getAnalyticsSummary() {
    const now = new Date();
    const last30Days = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    const recentEvents = this.events.filter(event => event.timestamp >= last30Days);

    const permissionGranted = recentEvents.filter(e => e.type === 'permission_granted').length;
    const permissionDenied = recentEvents.filter(e => e.type === 'permission_denied').length;
    const fallbackUsed = recentEvents.filter(e => e.type === 'fallback_used').length;
    const locationErrors = recentEvents.filter(e => e.type === 'location_error');

    const errorBreakdown = locationErrors.reduce((acc, event) => {
      const errorType = event.errorType || 'unknown';
      acc[errorType] = (acc[errorType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalRequests: recentEvents.length,
      permissionGranted,
      permissionDenied,
      fallbackUsed,
      errorBreakdown,
      recentEvents: recentEvents.slice(-10) // Last 10 events for debugging
    };
  }

  public exportData(): LocationAnalyticsEvent[] {
    return [...this.events];
  }

  public clearData(): void {
    this.events = [];
    if (this.isClient) {
      localStorage.removeItem('location_analytics_events');
    }
  }
}

// Export singleton instance getter to avoid SSR issues
export const getLocationAnalytics = () => {
  if (typeof window === 'undefined') {
    // Return a mock object on server side
    return {
      trackLocationRequest: () => {},
      trackPermissionGranted: () => {},
      trackPermissionDenied: () => {},
      trackLocationError: () => {},
      trackFallbackUsed: () => {},
      trackBirthLocationUsed: () => {},
      getAnalyticsSummary: () => ({
        totalRequests: 0,
        permissionGranted: 0,
        permissionDenied: 0,
        fallbackUsed: 0,
        errorBreakdown: {},
        recentEvents: []
      }),
      exportData: () => [],
      clearData: () => {}
    };
  }
  return LocationAnalytics.getInstance();
};

// For backward compatibility
export const locationAnalytics = typeof window !== 'undefined' ? LocationAnalytics.getInstance() : getLocationAnalytics();

// Utility function to get country from coordinates (basic implementation)
export async function getCountryFromCoordinates(lat: string, lon: string): Promise<string> {
  try {
    const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
    const data = await response.json();
    return data.countryName || 'Unknown';
  } catch (error) {
    console.debug('Failed to get country from coordinates:', error);
    return 'Unknown';
  }
}