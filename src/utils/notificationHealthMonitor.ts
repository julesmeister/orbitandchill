/* eslint-disable @typescript-eslint/no-unused-vars */
import { deliveryManager } from './notificationReliability';
import { notificationDeduplicator } from './notificationDeduplication';
import { notificationRateLimiter } from './notificationRateLimit';

interface HealthMetric {
  name: string;
  value: number;
  status: 'healthy' | 'warning' | 'critical';
  threshold: {
    warning: number;
    critical: number;
  };
  unit: string;
  description: string;
  lastUpdated: Date;
}

interface SystemAlert {
  id: string;
  type: 'performance' | 'error' | 'capacity' | 'availability';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  timestamp: Date;
  resolved: boolean;
  resolvedAt?: Date;
  context?: Record<string, any>;
}

interface HealthReport {
  overall: 'healthy' | 'degraded' | 'critical';
  score: number; // 0-100
  metrics: HealthMetric[];
  alerts: SystemAlert[];
  recommendations: string[];
  lastChecked: Date;
}

/**
 * Comprehensive health monitoring system for notifications
 */
export class NotificationHealthMonitor {
  private static instance: NotificationHealthMonitor;
  private metrics = new Map<string, HealthMetric>();
  private alerts = new Map<string, SystemAlert>();
  private isMonitoring = false;
  private monitoringInterval?: NodeJS.Timeout;
  
  // Performance tracking
  private performanceLog: Array<{
    operation: string;
    duration: number;
    success: boolean;
    timestamp: Date;
  }> = [];

  private constructor() {
    this.initializeMetrics();
  }

  static getInstance(): NotificationHealthMonitor {
    if (!NotificationHealthMonitor.instance) {
      NotificationHealthMonitor.instance = new NotificationHealthMonitor();
    }
    return NotificationHealthMonitor.instance;
  }

  /**
   * Start health monitoring
   */
  startMonitoring(intervalMinutes = 5): void {
    if (this.isMonitoring) {
      console.log('Health monitoring already running');
      return;
    }

    this.isMonitoring = true;
    
    this.monitoringInterval = setInterval(async () => {
      await this.performHealthCheck();
    }, intervalMinutes * 60 * 1000);

    console.log(`Notification health monitoring started (interval: ${intervalMinutes} minutes)`);
    
    // Perform initial check
    this.performHealthCheck();
  }

  /**
   * Stop health monitoring
   */
  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = undefined;
    }
    this.isMonitoring = false;
    console.log('Notification health monitoring stopped');
  }

  /**
   * Perform comprehensive health check
   */
  async performHealthCheck(): Promise<HealthReport> {
    try {
      console.log('Performing notification system health check...');

      // Update all metrics
      await this.updateDeliveryMetrics();
      await this.updateDeduplicationMetrics();
      await this.updateRateLimitMetrics();
      await this.updatePerformanceMetrics();
      await this.updateSystemMetrics();

      // Check for new alerts
      this.checkForAlerts();

      // Generate recommendations
      const recommendations = this.generateRecommendations();

      // Calculate overall health score
      const healthScore = this.calculateHealthScore();
      const overallStatus = this.determineOverallStatus(healthScore);

      const report: HealthReport = {
        overall: overallStatus,
        score: healthScore,
        metrics: Array.from(this.metrics.values()),
        alerts: Array.from(this.alerts.values()).filter(alert => !alert.resolved),
        recommendations,
        lastChecked: new Date()
      };

      console.log(`Health check complete - Score: ${healthScore}/100, Status: ${overallStatus}`);
      
      return report;
    } catch (error) {
      console.error('Error performing health check:', error);
      
      // Create a critical alert for health check failure
      this.createAlert({
        type: 'availability',
        severity: 'critical',
        title: 'Health Check Failed',
        message: `Health monitoring system encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        context: { error: error instanceof Error ? error.stack : String(error) }
      });

      return {
        overall: 'critical',
        score: 0,
        metrics: [],
        alerts: Array.from(this.alerts.values()),
        recommendations: ['Health monitoring system needs attention'],
        lastChecked: new Date()
      };
    }
  }

  /**
   * Record performance data for monitoring
   */
  recordPerformance(operation: string, duration: number, success: boolean): void {
    this.performanceLog.push({
      operation,
      duration,
      success,
      timestamp: new Date()
    });

    // Keep only last 1000 entries
    if (this.performanceLog.length > 1000) {
      this.performanceLog = this.performanceLog.slice(-1000);
    }
  }

  /**
   * Initialize health metrics
   */
  private initializeMetrics(): void {
    const initialMetrics: Partial<HealthMetric>[] = [
      {
        name: 'notification_delivery_rate',
        unit: '%',
        description: 'Percentage of notifications successfully delivered',
        threshold: { warning: 90, critical: 80 }
      },
      {
        name: 'notification_creation_rate',
        unit: 'per_minute',
        description: 'Rate of notification creation',
        threshold: { warning: 100, critical: 200 }
      },
      {
        name: 'duplicate_prevention_rate',
        unit: '%',
        description: 'Percentage of duplicate notifications prevented',
        threshold: { warning: 95, critical: 90 }
      },
      {
        name: 'rate_limit_violations',
        unit: 'count',
        description: 'Number of rate limit violations in last hour',
        threshold: { warning: 10, critical: 25 }
      },
      {
        name: 'average_response_time',
        unit: 'ms',
        description: 'Average notification system response time',
        threshold: { warning: 1000, critical: 3000 }
      },
      {
        name: 'error_rate',
        unit: '%',
        description: 'Percentage of operations resulting in errors',
        threshold: { warning: 5, critical: 10 }
      },
      {
        name: 'active_sse_connections',
        unit: 'count',
        description: 'Number of active real-time connections',
        threshold: { warning: 1000, critical: 2000 }
      },
      {
        name: 'pending_retries',
        unit: 'count',
        description: 'Number of notifications pending retry',
        threshold: { warning: 50, critical: 100 }
      }
    ];

    for (const metric of initialMetrics) {
      this.metrics.set(metric.name!, {
        ...metric,
        value: 0,
        status: 'healthy',
        lastUpdated: new Date()
      } as HealthMetric);
    }
  }

  /**
   * Update delivery-related metrics
   */
  private async updateDeliveryMetrics(): Promise<void> {
    try {
      const deliveryStats = deliveryManager.getDeliveryStats();
      
      // Delivery rate
      const totalAttempts = deliveryStats.totalAttempts || 1; // Avoid division by zero
      const deliveryRate = (deliveryStats.successfulDeliveries / totalAttempts) * 100;
      this.updateMetric('notification_delivery_rate', deliveryRate);

      // Pending retries
      this.updateMetric('pending_retries', deliveryStats.pendingRetries);
    } catch (error) {
      console.error('Error updating delivery metrics:', error);
    }
  }

  /**
   * Update deduplication metrics
   */
  private async updateDeduplicationMetrics(): Promise<void> {
    try {
      const deduplicationStats = notificationDeduplicator.getStats();
      
      // For demo purposes, assume good deduplication performance
      // In real implementation, you'd track actual prevented duplicates
      const preventionRate = 98; // Mock value
      this.updateMetric('duplicate_prevention_rate', preventionRate);
    } catch (error) {
      console.error('Error updating deduplication metrics:', error);
    }
  }

  /**
   * Update rate limiting metrics
   */
  private async updateRateLimitMetrics(): Promise<void> {
    try {
      const rateLimitStats = notificationRateLimiter.getRateLimitStats();
      
      // Rate limit violations
      this.updateMetric('rate_limit_violations', rateLimitStats.usersOnCooldown);
    } catch (error) {
      console.error('Error updating rate limit metrics:', error);
    }
  }

  /**
   * Update performance metrics
   */
  private async updatePerformanceMetrics(): Promise<void> {
    try {
      const recentOperations = this.performanceLog.filter(
        log => log.timestamp > new Date(Date.now() - 60 * 60 * 1000) // Last hour
      );

      if (recentOperations.length > 0) {
        // Average response time
        const avgResponseTime = recentOperations.reduce((sum, log) => sum + log.duration, 0) / recentOperations.length;
        this.updateMetric('average_response_time', avgResponseTime);

        // Error rate
        const errorCount = recentOperations.filter(log => !log.success).length;
        const errorRate = (errorCount / recentOperations.length) * 100;
        this.updateMetric('error_rate', errorRate);

        // Creation rate (operations per minute)
        const creationRate = recentOperations.length / 60;
        this.updateMetric('notification_creation_rate', creationRate);
      }
    } catch (error) {
      console.error('Error updating performance metrics:', error);
    }
  }

  /**
   * Update system-level metrics
   */
  private async updateSystemMetrics(): Promise<void> {
    try {
      // Mock SSE connections count (in real implementation, track actual connections)
      const activeConnections = Math.floor(Math.random() * 500); // Mock value
      this.updateMetric('active_sse_connections', activeConnections);
    } catch (error) {
      console.error('Error updating system metrics:', error);
    }
  }

  /**
   * Update a specific metric
   */
  private updateMetric(name: string, value: number): void {
    const metric = this.metrics.get(name);
    if (!metric) return;

    metric.value = value;
    metric.lastUpdated = new Date();

    // Determine status based on thresholds
    if (name === 'notification_delivery_rate' || name === 'duplicate_prevention_rate') {
      // For percentage metrics where higher is better
      if (value >= metric.threshold.warning) {
        metric.status = 'healthy';
      } else if (value >= metric.threshold.critical) {
        metric.status = 'warning';
      } else {
        metric.status = 'critical';
      }
    } else {
      // For metrics where lower is better
      if (value <= metric.threshold.warning) {
        metric.status = 'healthy';
      } else if (value <= metric.threshold.critical) {
        metric.status = 'warning';
      } else {
        metric.status = 'critical';
      }
    }
  }

  /**
   * Check for alert conditions
   */
  private checkForAlerts(): void {
    for (const metric of this.metrics.values()) {
      if (metric.status === 'critical') {
        this.createAlert({
          type: 'performance',
          severity: 'critical',
          title: `Critical: ${metric.name}`,
          message: `${metric.description} is critical: ${metric.value}${metric.unit}`,
          context: { metric: metric.name, value: metric.value, threshold: metric.threshold.critical }
        });
      } else if (metric.status === 'warning') {
        this.createAlert({
          type: 'performance',
          severity: 'medium',
          title: `Warning: ${metric.name}`,
          message: `${metric.description} is degraded: ${metric.value}${metric.unit}`,
          context: { metric: metric.name, value: metric.value, threshold: metric.threshold.warning }
        });
      }
    }
  }

  /**
   * Create a system alert
   */
  private createAlert(alertData: {
    type: SystemAlert['type'];
    severity: SystemAlert['severity'];
    title: string;
    message: string;
    context?: Record<string, any>;
  }): void {
    const alertId = `${alertData.type}_${alertData.title}_${Date.now()}`.replace(/\s+/g, '_');
    
    // Check if similar alert already exists
    const existingAlert = Array.from(this.alerts.values()).find(
      alert => alert.title === alertData.title && !alert.resolved
    );

    if (existingAlert) {
      // Update existing alert timestamp
      existingAlert.timestamp = new Date();
      return;
    }

    const alert: SystemAlert = {
      id: alertId,
      ...alertData,
      timestamp: new Date(),
      resolved: false
    };

    this.alerts.set(alertId, alert);
    console.warn(`Alert created: ${alert.title} - ${alert.message}`);
  }

  /**
   * Resolve an alert
   */
  resolveAlert(alertId: string): void {
    const alert = this.alerts.get(alertId);
    if (alert) {
      alert.resolved = true;
      alert.resolvedAt = new Date();
      console.log(`Alert resolved: ${alert.title}`);
    }
  }

  /**
   * Generate health recommendations
   */
  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    
    for (const metric of this.metrics.values()) {
      if (metric.status === 'critical') {
        switch (metric.name) {
          case 'notification_delivery_rate':
            recommendations.push('Check notification delivery infrastructure and retry mechanisms');
            break;
          case 'average_response_time':
            recommendations.push('Optimize notification creation and delivery performance');
            break;
          case 'error_rate':
            recommendations.push('Investigate and fix notification system errors');
            break;
          case 'rate_limit_violations':
            recommendations.push('Review and adjust rate limiting rules');
            break;
        }
      }
    }

    // General recommendations
    const deliveryRate = this.metrics.get('notification_delivery_rate')?.value || 100;
    const errorRate = this.metrics.get('error_rate')?.value || 0;
    
    if (deliveryRate < 95) {
      recommendations.push('Consider implementing additional delivery redundancy');
    }
    
    if (errorRate > 2) {
      recommendations.push('Enable detailed error logging and monitoring');
    }

    return recommendations;
  }

  /**
   * Calculate overall health score
   */
  private calculateHealthScore(): number {
    let totalScore = 0;
    let metricCount = 0;

    for (const metric of this.metrics.values()) {
      let score = 0;
      
      if (metric.status === 'healthy') {
        score = 100;
      } else if (metric.status === 'warning') {
        score = 60;
      } else if (metric.status === 'critical') {
        score = 20;
      }
      
      totalScore += score;
      metricCount++;
    }

    return metricCount > 0 ? Math.round(totalScore / metricCount) : 0;
  }

  /**
   * Determine overall system status
   */
  private determineOverallStatus(score: number): 'healthy' | 'degraded' | 'critical' {
    if (score >= 80) return 'healthy';
    if (score >= 50) return 'degraded';
    return 'critical';
  }

  /**
   * Get current health status
   */
  async getHealthStatus(): Promise<HealthReport> {
    return await this.performHealthCheck();
  }

  /**
   * Get all alerts
   */
  getAllAlerts(): SystemAlert[] {
    return Array.from(this.alerts.values());
  }

  /**
   * Get active alerts only
   */
  getActiveAlerts(): SystemAlert[] {
    return Array.from(this.alerts.values()).filter(alert => !alert.resolved);
  }

  /**
   * Clear resolved alerts older than specified hours
   */
  clearOldAlerts(hoursOld = 24): void {
    const cutoffTime = new Date(Date.now() - (hoursOld * 60 * 60 * 1000));
    const toRemove: string[] = [];

    for (const [id, alert] of this.alerts) {
      if (alert.resolved && alert.resolvedAt && alert.resolvedAt < cutoffTime) {
        toRemove.push(id);
      }
    }

    for (const id of toRemove) {
      this.alerts.delete(id);
    }

    if (toRemove.length > 0) {
      console.log(`Cleaned up ${toRemove.length} old resolved alerts`);
    }
  }
}

// Export singleton instance
export const notificationHealthMonitor = NotificationHealthMonitor.getInstance();