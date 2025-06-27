/* eslint-disable @typescript-eslint/no-unused-vars */
import { useChartData, type ChartDataPoint } from '@/hooks/useChartData';
import ChartLoadingAnimation from '@/components/reusable/ChartLoadingAnimation';

interface GrowthChartProps {
  data?: ChartDataPoint[];
  isLoading?: boolean;
}

export default function GrowthChart({ data, isLoading }: GrowthChartProps) {
  const { 
    chartData, 
    timePeriod, 
    setTimePeriod, 
    isLoading: hookLoading,
    error 
  } = useChartData({
    data,
    isLoading,
    autoFetch: true,
    initialPeriod: 'daily'
  });

  if (isLoading || hookLoading) {
    return (
      <ChartLoadingAnimation
        title="Growth Overview"
        subtitle="Loading chart data..."
        showHeader={true}
        showFooter={true}
      />
    );
  }

  // Show error state if data fetching failed
  if (error) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-space-grotesk text-xl font-bold text-black">Growth Overview</h3>
            <p className="font-inter text-sm text-red-600">Failed to load chart data</p>
          </div>
        </div>
        <div className="h-80 bg-white relative border border-red-200 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 mb-2">⚠️</div>
            <p className="font-space-grotesk text-lg font-bold text-red-600 mb-1">Error Loading Data</p>
            <p className="font-inter text-sm text-red-500">{error}</p>
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
                className={`px-4 py-2 font-inter text-sm font-medium transition-colors ${timePeriod === period
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