/* eslint-disable @typescript-eslint/no-unused-vars */

interface SystemHealthChartProps {
  healthMetrics?: {
    status: 'healthy' | 'degraded' | 'down';
    memory: {
      percentage: number;
    };
    database: {
      status: 'connected' | 'disconnected' | 'error';
      responseTime?: number;
    };
    api: {
      status: 'operational' | 'slow' | 'error';
      responseTime?: number;
    };
  };
  isLoading?: boolean;
}

export default function SystemHealthChart({ healthMetrics, isLoading }: SystemHealthChartProps) {
  if (isLoading) {
    return (
      <div className="h-48 flex items-center justify-center bg-gray-50 border border-black">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent animate-spin mx-auto mb-2"></div>
          <p className="font-inter text-black/60 text-sm">Loading system status...</p>
        </div>
      </div>
    );
  }

  // Default values if no health metrics
  const memoryUsage = healthMetrics?.memory.percentage || 45;
  const dbStatus = healthMetrics?.database.status || 'connected';
  const apiStatus = healthMetrics?.api.status || 'operational';
  const overallStatus = healthMetrics?.status || 'healthy';

  // Calculate donut chart for memory usage
  const radius = 50;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const memoryStrokeDasharray = `${(memoryUsage / 100) * circumference} ${circumference}`;

  // Status colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'connected':
      case 'operational':
        return '#51bd94'; // Green
      case 'degraded':
      case 'slow':
        return '#f2e356'; // Yellow
      case 'down':
      case 'disconnected':
      case 'error':
        return '#ff6b6b'; // Red
      default:
        return '#6b7280'; // Gray
    }
  };

  // Memory usage color based on percentage
  const getMemoryColor = (percentage: number) => {
    if (percentage > 80) return '#ff6b6b'; // Red
    if (percentage > 60) return '#f2e356'; // Yellow
    return '#51bd94'; // Green
  };

  return (
    <div className="bg-white border border-black p-6">
      <h3 className="font-space-grotesk text-lg font-bold text-black mb-4">System Health</h3>
      
      <div className="grid grid-cols-2 gap-6">
        {/* Memory Usage Donut Chart */}
        <div className="text-center">
          <div className="relative inline-block">
            <svg width="120" height="120" className="transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth={strokeWidth}
              />
              {/* Progress circle */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke={getMemoryColor(memoryUsage)}
                strokeWidth={strokeWidth}
                strokeDasharray={memoryStrokeDasharray}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
            {/* Center text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="font-space-grotesk text-lg font-bold text-black">
                  {memoryUsage.toFixed(1)}%
                </div>
                <div className="font-inter text-xs text-black/60">Memory</div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="space-y-3">
          {/* Overall System Status */}
          <div className="flex items-center justify-between p-3 border border-black">
            <span className="font-inter text-sm text-black">System</span>
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3"
                style={{ backgroundColor: getStatusColor(overallStatus) }}
              ></div>
              <span className="font-inter text-xs text-black/60 capitalize">
                {overallStatus}
              </span>
            </div>
          </div>

          {/* Database Status */}
          <div className="flex items-center justify-between p-3 border border-black">
            <span className="font-inter text-sm text-black">Database</span>
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3"
                style={{ backgroundColor: getStatusColor(dbStatus) }}
              ></div>
              <span className="font-inter text-xs text-black/60 capitalize">
                {dbStatus}
              </span>
            </div>
          </div>

          {/* API Status */}
          <div className="flex items-center justify-between p-3 border border-black">
            <span className="font-inter text-sm text-black">API</span>
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3"
                style={{ backgroundColor: getStatusColor(apiStatus) }}
              ></div>
              <span className="font-inter text-xs text-black/60 capitalize">
                {apiStatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Response Times */}
      {healthMetrics && (
        <div className="mt-4 pt-4 border-t border-black/20">
          <div className="grid grid-cols-2 gap-4 text-center">
            {healthMetrics.database.responseTime && (
              <div>
                <div className="font-space-grotesk text-sm font-bold text-black">
                  {healthMetrics.database.responseTime}ms
                </div>
                <div className="font-inter text-xs text-black/60">DB Response</div>
              </div>
            )}
            {healthMetrics.api.responseTime && (
              <div>
                <div className="font-space-grotesk text-sm font-bold text-black">
                  {healthMetrics.api.responseTime}ms
                </div>
                <div className="font-inter text-xs text-black/60">API Response</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}