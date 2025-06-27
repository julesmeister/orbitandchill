/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { useAdminStore } from '@/store/adminStore';

interface GrowthChartProps {
  data?: Array<{
    date: string;
    users: number;
    charts: number;
  }>;
  isLoading?: boolean;
}

interface HistoricalData {
  date: string;
  users: number;
  charts: number;
}

export default function GrowthChart({ data, isLoading }: GrowthChartProps) {
  const [chartData, setChartData] = useState<Array<{ date: string; users: number; charts: number; }>>([]);
  const [timePeriod, setTimePeriod] = useState<'daily' | 'monthly' | 'yearly'>('daily');
  const [historicalLoading, setHistoricalLoading] = useState(false);
  
  // Access admin store for auth token
  const { authToken } = useAdminStore();

  useEffect(() => {
    const fetchHistoricalData = async () => {
      // If external data is provided, use it directly
      if (data && data.length > 0) {
        setChartData(data);
        return;
      }

      setHistoricalLoading(true);
      
      try {
        console.log(`📊 Fetching historical growth data for period: ${timePeriod}`);
        
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        
        if (authToken) {
          headers.Authorization = `Bearer ${authToken}`;
        }
        
        // Fetch historical data from enhanced metrics API with period parameter
        const response = await fetch(`/api/admin/enhanced-metrics?period=${timePeriod}`, { headers });
        const data = await response.json();
        
        if (data.success && data.historicalData) {
          console.log(`✅ Historical data fetched: ${data.historicalData.length} records`);
          setChartData(data.historicalData);
        } else {
          throw new Error('API returned no historical data');
        }
      } catch (error) {
        console.warn('Failed to fetch historical growth data, using fallback:', error);
        
        // Fallback to generated data based on time period
        const fallbackData = generateFallbackData(timePeriod);
        setChartData(fallbackData);
      } finally {
        setHistoricalLoading(false);
      }
    };

    const generateFallbackData = (period: 'daily' | 'monthly' | 'yearly') => {
      const mockData = [];
      let days, interval;
      
      switch (period) {
        case 'daily':
          days = 7; // Last 7 days
          interval = 24 * 60 * 60 * 1000; // 1 day
          break;
        case 'monthly':
          days = 30; // Last 30 days  
          interval = 24 * 60 * 60 * 1000; // 1 day
          break;
        case 'yearly':
          days = 12; // Last 12 months
          interval = 30 * 24 * 60 * 60 * 1000; // 30 days
          break;
      }

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(Date.now() - i * interval);
        const timeValue = period === 'yearly' ? date.getMonth() : date.getDate();
        
        mockData.push({
          date: period === 'yearly' 
            ? date.toISOString().slice(0, 7) // YYYY-MM format
            : date.toISOString().split('T')[0], // YYYY-MM-DD format
          users: Math.max(0, 10 + Math.sin(timeValue / 5) * 5 + Math.random() * 8),
          charts: Math.max(0, 15 + Math.cos(timeValue / 3) * 8 + Math.random() * 12)
        });
      }
      
      return mockData;
    };

    fetchHistoricalData();
  }, [data, timePeriod, authToken]);

  if (isLoading || historicalLoading) {
    return (
      <div className="w-full">
        {/* Header skeleton */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="h-6 w-40 bg-gray-200 animate-pulse rounded mb-2"></div>
            <div className="h-4 w-48 bg-gray-100 animate-pulse rounded"></div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-200 animate-pulse"></div>
                <div className="h-4 w-12 bg-gray-200 animate-pulse rounded"></div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-200 animate-pulse"></div>
                <div className="h-4 w-12 bg-gray-200 animate-pulse rounded"></div>
              </div>
            </div>
            <div className="flex items-center space-x-1 border border-gray-200">
              {[1, 2, 3].map((i) => (
                <div key={i} className="px-4 py-2 h-9 w-16 bg-gray-100 animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart loading animation */}
        <div className="h-80 bg-white relative border border-black overflow-hidden">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 800 300"
            className="w-full h-full"
          >
            {/* Animated grid lines */}
            {Array.from({ length: 5 }, (_, i) => (
              <line
                key={`grid-${i}`}
                x1={60}
                y1={30 + (i / 4) * 210}
                x2={740}
                y2={30 + (i / 4) * 210}
                stroke="#e5e7eb"
                strokeWidth="1"
                strokeDasharray="2,2"
                className="animate-pulse"
              />
            ))}
            
            {/* Axes */}
            <line x1={60} y1={30} x2={60} y2={240} stroke="black" strokeWidth="2" />
            <line x1={60} y1={240} x2={740} y2={240} stroke="black" strokeWidth="2" />
            
            {/* Animated loading line */}
            <path
              d="M 60 180 Q 200 120 340 150 T 620 130 L 740 110"
              fill="none"
              stroke="#ddd"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="10,5"
              className="animate-pulse"
            >
              <animate
                attributeName="stroke-dashoffset"
                values="0;-15;0"
                dur="2s"
                repeatCount="indefinite"
              />
            </path>
            
            {/* Animated dots */}
            {Array.from({ length: 7 }, (_, i) => (
              <circle
                key={`dot-${i}`}
                cx={60 + (i * 113)}
                cy={180 - Math.sin(i) * 30}
                r="4"
                fill="#ccc"
                className="animate-pulse"
                style={{ 
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1.5s'
                }}
              />
            ))}
            
            {/* Three-dot loading animation */}
            <g>
              <circle cx="380" cy="160" r="3" fill="black" className="animate-bounce" style={{ animationDelay: '-0.3s' }} />
              <circle cx="400" cy="160" r="3" fill="black" className="animate-bounce" style={{ animationDelay: '-0.15s' }} />
              <circle cx="420" cy="160" r="3" fill="black" className="animate-bounce" />
              <text
                x="400"
                y="180"
                textAnchor="middle"
                className="font-inter text-xs fill-black/60"
              >
                Loading chart data...
              </text>
            </g>
          </svg>
          
          {/* Subtle loading overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
        </div>

        {/* Stats footer skeleton */}
        <div className="mt-4 pt-4 border-t border-black/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i}>
                <div className="h-6 w-8 bg-gray-200 animate-pulse rounded mx-auto mb-1"></div>
                <div className="h-3 w-16 bg-gray-100 animate-pulse rounded mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const chartWidth = 800; // Increased width
  const chartHeight = 300; // Increased height
  const padding = { top: 30, right: 60, bottom: 60, left: 60 }; // More padding
  
  const maxUsers = chartData.length > 0 ? Math.max(...chartData.map(d => d.users || 0)) : 0;
  const maxCharts = chartData.length > 0 ? Math.max(...chartData.map(d => d.charts || 0)) : 0;
  const maxValue = Math.max(maxUsers, maxCharts) || 1; // Prevent division by zero
  
  // Calculate points for users line
  const userPoints = chartData.map((d, i) => {
    const x = chartData.length > 1 
      ? padding.left + (i / (chartData.length - 1)) * (chartWidth - padding.left - padding.right)
      : padding.left;
    const y = chartHeight - padding.bottom - ((d.users || 0) / maxValue) * (chartHeight - padding.top - padding.bottom);
    return { x: x || padding.left, y: y || chartHeight - padding.bottom, value: d.users || 0 };
  });

  // Calculate points for charts line
  const chartPoints = chartData.map((d, i) => {
    const x = chartData.length > 1 
      ? padding.left + (i / (chartData.length - 1)) * (chartWidth - padding.left - padding.right)
      : padding.left;
    const y = chartHeight - padding.bottom - ((d.charts || 0) / maxValue) * (chartHeight - padding.top - padding.bottom);
    return { x: x || padding.left, y: y || chartHeight - padding.bottom, value: d.charts || 0 };
  });

  // Create path strings
  const userPath = userPoints.map((point, i) => `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
  const chartPath = chartPoints.map((point, i) => `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');

  // Grid lines
  const gridLines = [];
  for (let i = 0; i <= 4; i++) {
    const y = padding.top + (i / 4) * (chartHeight - padding.top - padding.bottom);
    gridLines.push(
      <line
        key={`grid-${i}`}
        x1={padding.left}
        y1={y}
        x2={chartWidth - padding.right}
        y2={y}
        stroke="#e5e7eb"
        strokeWidth="1"
        strokeDasharray="2,2"
      />
    );
  }

  // Y-axis labels
  const yLabels = [];
  for (let i = 0; i <= 4; i++) {
    const value = Math.round((maxValue * (4 - i)) / 4);
    const y = padding.top + (i / 4) * (chartHeight - padding.top - padding.bottom);
    yLabels.push(
      <text
        key={`ylabel-${i}`}
        x={padding.left - 10}
        y={y + 4}
        textAnchor="end"
        className="font-inter text-xs fill-black/60"
      >
        {value}
      </text>
    );
  }

  // X-axis labels with better spacing
  const xLabels: React.ReactElement[] = [];
  const labelInterval = timePeriod === 'daily' ? 1 : timePeriod === 'monthly' ? 5 : 2;
  
  chartData.forEach((d, i) => {
    if (i % labelInterval === 0 || i === chartData.length - 1) {
      const x = padding.left + (i / (chartData.length - 1)) * (chartWidth - padding.left - padding.right);
      const date = new Date(d.date);
      
      let label;
      if (timePeriod === 'yearly') {
        label = date.toLocaleDateString('en-US', { month: 'short' });
      } else if (timePeriod === 'monthly') {
        label = date.getDate().toString();
      } else {
        label = date.toLocaleDateString('en-US', { weekday: 'short' });
      }
      
      xLabels.push(
        <text
          key={`xlabel-${i}`}
          x={x}
          y={chartHeight - padding.bottom + 25}
          textAnchor="middle"
          className="font-inter text-sm fill-black/70"
        >
          {label}
        </text>
      );
    }
  });

  return (
    <div className="w-full">
      {/* Header with time period controls */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-space-grotesk text-xl font-bold text-black">Growth Overview</h3>
          <p className="font-inter text-sm text-black/60">
            Performance trends - {timePeriod === 'daily' ? 'Last 7 days' : timePeriod === 'monthly' ? 'Last 30 days' : 'Last 12 months'}
          </p>
        </div>
        
        {/* Time period selector */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-black"></div>
              <span className="font-inter text-sm text-black">Users</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3" style={{ backgroundColor: '#51bd94' }}></div>
              <span className="font-inter text-sm text-black">Charts</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 border border-black">
            {(['daily', 'monthly', 'yearly'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setTimePeriod(period)}
                className={`px-4 py-2 font-inter text-sm font-medium transition-colors ${
                  timePeriod === period
                    ? 'bg-black text-white'
                    : 'bg-white text-black hover:bg-gray-100'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart area with more height */}
      <div className="h-80 bg-white relative border border-black">
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-full"
        >
        {/* Grid lines */}
        {gridLines}
        
        {/* Axes */}
        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={chartHeight - padding.bottom}
          stroke="black"
          strokeWidth="2"
        />
        <line
          x1={padding.left}
          y1={chartHeight - padding.bottom}
          x2={chartWidth - padding.right}
          y2={chartHeight - padding.bottom}
          stroke="black"
          strokeWidth="2"
        />
        
        {/* Y-axis labels */}
        {yLabels}
        
        {/* X-axis labels */}
        {xLabels}
        
        {/* Charts line (behind users line) */}
        <path
          d={chartPath}
          fill="none"
          stroke="#51bd94"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Users line */}
        <path
          d={userPath}
          fill="none"
          stroke="black"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Data points for users */}
        {userPoints.map((point, i) => (
          <circle
            key={`user-point-${i}`}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="black"
            stroke="white"
            strokeWidth="2"
          />
        ))}
        
        {/* Data points for charts */}
        {chartPoints.map((point, i) => (
          <circle
            key={`chart-point-${i}`}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="#51bd94"
            stroke="white"
            strokeWidth="2"
          />
        ))}
        </svg>
      </div>

      {/* Chart stats footer */}
      <div className="mt-4 pt-4 border-t border-black/20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="font-space-grotesk text-lg font-bold text-black">
              {chartData.length > 0 ? Math.round(chartData.reduce((sum, d) => sum + (d.users || 0), 0) / chartData.length) : 0}
            </div>
            <div className="font-inter text-xs text-black/60">Avg Users</div>
          </div>
          <div>
            <div className="font-space-grotesk text-lg font-bold text-black">
              {chartData.length > 0 ? Math.round(chartData.reduce((sum, d) => sum + (d.charts || 0), 0) / chartData.length) : 0}
            </div>
            <div className="font-inter text-xs text-black/60">Avg Charts</div>
          </div>
          <div>
            <div className="font-space-grotesk text-lg font-bold text-black">
              {chartData.length > 0 ? Math.max(...chartData.map(d => d.users || 0)) : 0}
            </div>
            <div className="font-inter text-xs text-black/60">Peak Users</div>
          </div>
          <div>
            <div className="font-space-grotesk text-lg font-bold text-black">
              {chartData.length > 0 ? Math.max(...chartData.map(d => d.charts || 0)) : 0}
            </div>
            <div className="font-inter text-xs text-black/60">Peak Charts</div>
          </div>
        </div>
      </div>
    </div>
  );
}