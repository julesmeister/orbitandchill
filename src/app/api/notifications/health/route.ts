/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { notificationHealthMonitor } from '@/utils/notificationHealthMonitor';
import { deliveryManager } from '@/utils/notificationReliability';
import { notificationDeduplicator } from '@/utils/notificationDeduplication';
import { notificationRateLimiter } from '@/utils/notificationRateLimit';

/**
 * Get notification system health status
 * GET /api/notifications/health
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const detailed = url.searchParams.get('detailed') === 'true';
    const format = url.searchParams.get('format') || 'json';

    // Get comprehensive health report
    const healthReport = await notificationHealthMonitor.getHealthStatus();

    if (detailed) {
      // Include additional system statistics
      const detailedReport = {
        ...healthReport,
        systemStats: {
          delivery: deliveryManager.getDeliveryStats(),
          deduplication: notificationDeduplicator.getStats(),
          rateLimit: notificationRateLimiter.getRateLimitStats(),
        },
        performance: {
          uptime: process.uptime(),
          memoryUsage: process.memoryUsage(),
          nodeVersion: process.version
        }
      };

      if (format === 'prometheus') {
        // Return Prometheus-compatible metrics
        const prometheusMetrics = generatePrometheusMetrics(detailedReport);
        return new Response(prometheusMetrics, {
          headers: { 'Content-Type': 'text/plain' }
        });
      }

      return NextResponse.json(detailedReport);
    }

    // Return basic health status
    return NextResponse.json({
      status: healthReport.overall,
      score: healthReport.score,
      alertCount: healthReport.alerts.length,
      lastChecked: healthReport.lastChecked,
      uptime: process.uptime()
    });

  } catch (error) {
    console.error('Error getting notification health:', error);
    return NextResponse.json(
      { 
        status: 'critical',
        score: 0,
        error: error instanceof Error ? error.message : 'Health check failed',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

/**
 * Control health monitoring
 * POST /api/notifications/health
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, intervalMinutes } = body;

    switch (action) {
      case 'start':
        notificationHealthMonitor.startMonitoring(intervalMinutes || 5);
        return NextResponse.json({ 
          success: true, 
          message: `Health monitoring started with ${intervalMinutes || 5} minute interval` 
        });

      case 'stop':
        notificationHealthMonitor.stopMonitoring();
        return NextResponse.json({ 
          success: true, 
          message: 'Health monitoring stopped' 
        });

      case 'check':
        const healthReport = await notificationHealthMonitor.performHealthCheck();
        return NextResponse.json({
          success: true,
          healthReport
        });

      case 'resolve_alert':
        const { alertId } = body;
        if (!alertId) {
          return NextResponse.json(
            { error: 'alertId is required for resolve_alert action' },
            { status: 400 }
          );
        }
        notificationHealthMonitor.resolveAlert(alertId);
        return NextResponse.json({
          success: true,
          message: `Alert ${alertId} resolved`
        });

      case 'get_alerts':
        const alerts = notificationHealthMonitor.getActiveAlerts();
        return NextResponse.json({
          success: true,
          alerts
        });

      case 'cleanup':
        notificationHealthMonitor.clearOldAlerts(body.hoursOld || 24);
        await deliveryManager.cleanupOldAttempts();
        return NextResponse.json({
          success: true,
          message: 'System cleanup completed'
        });

      case 'test_reliability':
        const { userId } = body;
        if (!userId) {
          return NextResponse.json(
            { error: 'userId is required for test_reliability action' },
            { status: 400 }
          );
        }
        
        // Import the test function dynamically to avoid circular dependencies
        const { testNotificationReliability } = await import('@/utils/notificationHelpers');
        await testNotificationReliability(userId);
        
        return NextResponse.json({
          success: true,
          message: 'Reliability test initiated. Check health status for results.'
        });

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Error controlling notification health:', error);
    return NextResponse.json(
      { 
        error: 'Failed to control health monitoring',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Generate Prometheus-compatible metrics
 */
function generatePrometheusMetrics(healthReport: any): string {
  const metrics: string[] = [];
  
  // Overall health score
  metrics.push(`notification_system_health_score ${healthReport.score}`);
  metrics.push(`notification_system_alert_count ${healthReport.alerts.length}`);
  
  // Individual metrics
  for (const metric of healthReport.metrics) {
    const metricName = `notification_${metric.name}`;
    metrics.push(`${metricName} ${metric.value}`);
    
    // Add status as a labeled metric
    const statusValue = metric.status === 'healthy' ? 1 : metric.status === 'warning' ? 0.5 : 0;
    metrics.push(`${metricName}_status{status="${metric.status}"} ${statusValue}`);
  }
  
  // System stats
  if (healthReport.systemStats) {
    const { delivery, deduplication, rateLimit } = healthReport.systemStats;
    
    // Delivery stats
    metrics.push(`notification_delivery_total_attempts ${delivery.totalAttempts || 0}`);
    metrics.push(`notification_delivery_successful ${delivery.successfulDeliveries || 0}`);
    metrics.push(`notification_delivery_failed ${delivery.failedDeliveries || 0}`);
    metrics.push(`notification_delivery_pending_retries ${delivery.pendingRetries || 0}`);
    
    // Rate limit stats
    metrics.push(`notification_rate_limit_users_total ${rateLimit.totalUsers || 0}`);
    metrics.push(`notification_rate_limit_users_on_cooldown ${rateLimit.usersOnCooldown || 0}`);
    metrics.push(`notification_rate_limit_notifications_tracked ${rateLimit.totalNotificationsTracked || 0}`);
    
    // Deduplication stats
    metrics.push(`notification_deduplication_cache_size ${deduplication.cacheSize || 0}`);
    metrics.push(`notification_deduplication_recent_checks ${deduplication.recentChecks || 0}`);
  }
  
  // Performance stats
  if (healthReport.performance) {
    metrics.push(`notification_system_uptime_seconds ${healthReport.performance.uptime || 0}`);
    metrics.push(`notification_system_memory_used_bytes ${healthReport.performance.memoryUsage?.used || 0}`);
    metrics.push(`notification_system_memory_heap_used_bytes ${healthReport.performance.memoryUsage?.heapUsed || 0}`);
  }
  
  // Add timestamp
  const timestamp = new Date().getTime();
  metrics.push(`notification_system_last_update_timestamp ${timestamp}`);
  
  return metrics.join('\n') + '\n';
}

/**
 * Get system diagnostics for debugging
 * PUT /api/notifications/health
 */
export async function PUT() {
  try {
    const diagnostics = {
      timestamp: new Date().toISOString(),
      health: await notificationHealthMonitor.getHealthStatus(),
      delivery: deliveryManager.getDeliveryStats(),
      deduplication: notificationDeduplicator.getStats(),
      rateLimit: notificationRateLimiter.getRateLimitStats(),
      system: {
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch
      }
    };

    return NextResponse.json(diagnostics);
  } catch (error) {
    console.error('Error getting system diagnostics:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get system diagnostics',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}