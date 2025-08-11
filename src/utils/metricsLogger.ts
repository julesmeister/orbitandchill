/* eslint-disable @typescript-eslint/no-unused-vars */

export class MetricsLogger {
  private static isDev = process.env.NODE_ENV === 'development';

  static logMetricsStart(period?: string | null) {
    if (!this.isDev) return;
    console.log('📊 API: Calculating enhanced metrics with trends...');
    if (period) {
      console.log(`📊 API: Including historical data for period: ${period}`);
    }
  }

  static logCacheHit() {
    if (!this.isDev) return;
    console.log('⚡ Using cached metrics data');
  }

  static logDataFetch(source: string) {
    if (!this.isDev) return;
    console.log(`📊 Fetching ${source} data...`);
  }

  static logError(context: string, error: any) {
    console.error(`❌ ${context}:`, error);
  }

  static logPerformance(operation: string, startTime: number) {
    if (!this.isDev) return;
    const duration = Date.now() - startTime;
    console.log(`⏱️  ${operation} completed in ${duration}ms`);
  }

  static logDataPoints(count: number, type: string) {
    if (!this.isDev) return;
    console.log(`✅ Fetched ${count} ${type} data points`);
  }
}