/* eslint-disable @typescript-eslint/no-unused-vars */
import MetricsCard from '../MetricsCard';

interface TrafficData {
  date: string;
  visitors: number;
  pageViews: number;
  chartsGenerated: number;
  topCountries?: Array<{ country: string; count: number; percentage: number }>;
  locationBreakdown?: {
    currentLocation: number;
    birthLocation: number;
    fallbackLocation: number;
  };
}

interface Trend {
  value: number;
  isPositive: boolean;
}

interface TrafficMetricsSectionProps {
  // Use consolidated real metrics from useRealMetrics hook
  dailyVisitors: number;
  totalPageViews: number;
  chartsGenerated: number;
  trends: {
    visitors: number;
    charts: number;
  };
  filteredTrafficData: TrafficData[];
  isLoading: boolean;
}

export default function TrafficMetricsSection({ 
  dailyVisitors, 
  totalPageViews, 
  chartsGenerated, 
  trends,
  filteredTrafficData,
  isLoading 
}: TrafficMetricsSectionProps) {
  // Calculate page views trend from filtered data since it's not in main trends
  const calculatePageViewsTrend = (metricData: number[]): Trend => {
    if (metricData.length < 7) return { value: 0, isPositive: true };
    
    const recentWeek = metricData.slice(-7).reduce((a, b) => a + b, 0);
    const previousWeek = metricData.slice(-14, -7).reduce((a, b) => a + b, 0);
    
    if (previousWeek === 0) return { value: 0, isPositive: true };
    
    const percentChange = ((recentWeek - previousWeek) / previousWeek) * 100;
    return {
      value: Math.abs(Math.round(percentChange)),
      isPositive: percentChange >= 0
    };
  };

  const pageViewsTrend = calculatePageViewsTrend(filteredTrafficData.map(d => d.pageViews));

  const trafficMetrics = [
    {
      title: 'Daily Visitors',
      value: dailyVisitors,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      color: 'blue' as const,
      trend: { value: trends.visitors, isPositive: trends.visitors > 0 }
    },
    {
      title: 'Total Page Views',
      value: totalPageViews,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      ),
      color: 'green' as const,
      trend: pageViewsTrend
    },
    {
      title: 'Charts Generated',
      value: chartsGenerated,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'purple' as const,
      trend: { value: trends.charts, isPositive: trends.charts > 0 }
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {trafficMetrics.map((metric) => (
        <MetricsCard
          key={metric.title}
          title={metric.title}
          value={metric.value}
          icon={metric.icon}
          color={metric.color}
          trend={metric.trend}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}