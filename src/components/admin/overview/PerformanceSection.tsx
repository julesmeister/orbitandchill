/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import SystemHealthChart from '../charts/SystemHealthChart';

interface HealthMetrics {
  status: 'healthy' | 'degraded' | 'down';
  uptime: number;
  uptimePercentage: string;
  lastChecked: string;
  database: {
    status: 'connected' | 'disconnected' | 'error';
    responseTime?: number;
  };
  api: {
    status: 'operational' | 'slow' | 'error';
    responseTime?: number;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
}

interface PerformanceSectionProps {
  healthMetrics: HealthMetrics | null;
  activeUsers: number;
  isLoading: boolean;
}

export default function PerformanceSection({ healthMetrics, activeUsers, isLoading }: PerformanceSectionProps) {
  return (
    <>
      {/* System Monitoring */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <SystemHealthChart healthMetrics={healthMetrics || undefined} isLoading={isLoading} />
        
        <div className="bg-white border border-black p-4 sm:p-6">
          <h3 className="font-space-grotesk text-base sm:text-lg font-bold text-black mb-3 sm:mb-4">Performance Overview</h3>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between p-2.5 sm:p-3 border border-black">
              <span className="font-inter text-xs sm:text-sm text-black">Avg. Response Time</span>
              <span className="font-space-grotesk text-xs sm:text-sm font-bold text-black">
                {healthMetrics?.api.responseTime ? `${healthMetrics.api.responseTime}ms` : '< 100ms'}
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 sm:p-3 border border-black">
              <span className="font-inter text-xs sm:text-sm text-black">Database Queries</span>
              <span className="font-space-grotesk text-xs sm:text-sm font-bold text-black">
                {healthMetrics?.database.responseTime ? `${healthMetrics.database.responseTime}ms` : '< 50ms'}
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 sm:p-3 border border-black">
              <span className="font-inter text-xs sm:text-sm text-black">Memory Usage</span>
              <span className="font-space-grotesk text-xs sm:text-sm font-bold text-black">
                {healthMetrics?.memory ? `${healthMetrics.memory.percentage.toFixed(1)}%` : '45.2%'}
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 sm:p-3 border border-black">
              <span className="font-inter text-xs sm:text-sm text-black">Active Connections</span>
              <span className="font-space-grotesk text-xs sm:text-sm font-bold text-black">
                {activeUsers || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* System Health Status */}
      {healthMetrics && (
        <div className="bg-white border border-black p-8">
          <h3 className="font-space-grotesk text-lg font-bold text-black mb-6">System Health</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border border-black" style={{ 
              backgroundColor: healthMetrics.status === 'healthy' ? '#51bd94' : 
                             healthMetrics.status === 'degraded' ? '#f2e356' : '#ff6b6b' 
            }}>
              <div className="text-center">
                <div className="font-inter text-sm font-bold text-black">
                  {healthMetrics.status.toUpperCase()}
                </div>
                <div className="font-inter text-xs text-black/60">System Status</div>
              </div>
            </div>

            <div className="p-4 border border-black" style={{ 
              backgroundColor: healthMetrics.database.status === 'connected' ? '#51bd94' : '#ff6b6b' 
            }}>
              <div className="text-center">
                <div className="font-inter text-sm font-bold text-black">
                  {healthMetrics.database.status.toUpperCase()}
                </div>
                <div className="font-inter text-xs text-black/60">
                  Database {healthMetrics.database.responseTime ? `(${healthMetrics.database.responseTime}ms)` : ''}
                </div>
              </div>
            </div>

            <div className="p-4 border border-black" style={{ 
              backgroundColor: healthMetrics.memory.percentage > 80 ? '#ff6b6b' : 
                             healthMetrics.memory.percentage > 60 ? '#f2e356' : '#51bd94' 
            }}>
              <div className="text-center">
                <div className="font-inter text-sm font-bold text-black">
                  {healthMetrics.memory.percentage.toFixed(1)}%
                </div>
                <div className="font-inter text-xs text-black/60">Memory Usage</div>
              </div>
            </div>

            <div className="p-4 border border-black" style={{ 
              backgroundColor: parseFloat(healthMetrics.uptimePercentage) > 99 ? '#51bd94' : 
                             parseFloat(healthMetrics.uptimePercentage) > 95 ? '#f2e356' : '#ff6b6b' 
            }}>
              <div className="text-center">
                <div className="font-inter text-sm font-bold text-black">
                  {healthMetrics.uptimePercentage}%
                </div>
                <div className="font-inter text-xs text-black/60">Uptime</div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 border border-black bg-gray-50">
            <p className="font-inter text-xs text-black/60">
              Last checked: {new Date(healthMetrics.lastChecked).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </>
  );
}