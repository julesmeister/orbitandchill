import { useState } from 'react';
import { useAdminStore } from '@/store/adminStore';
import { useRealMetrics } from '@/hooks/useRealMetrics';
import TrafficMetricsSection from './traffic/TrafficMetricsSection';
import DailyAveragesCard from './traffic/DailyAveragesCard';
import TrafficSourcesCard from './traffic/TrafficSourcesCard';
import TopPagesCard from './traffic/TopPagesCard';
import LocationAnalyticsCard from './traffic/LocationAnalyticsCard';
import TrafficTable from './traffic/TrafficTable';
import { TrafficData } from '@/store/admin/types';
import { TimeRange, getFilteredTrafficData } from '@/utils/trafficDataUtils';

interface TrafficTabProps {
  trafficData: TrafficData[];
  isLoading: boolean;
}

export default function TrafficTab({ trafficData, isLoading }: TrafficTabProps) {
  const { threads, userAnalytics, totalThreads } = useAdminStore();
  const [timeRange, setTimeRange] = useState<TimeRange>('Last 30 days');
  
  const filteredTrafficData = getFilteredTrafficData(trafficData, timeRange);

  // Use the same consolidated real metrics from useRealMetrics
  const realMetrics = useRealMetrics(userAnalytics, trafficData, totalThreads);
  
  const trends = {
    visitors: realMetrics.dailyVisitors,
    charts: realMetrics.chartsGenerated
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <TrafficMetricsSection 
        dailyVisitors={realMetrics.dailyVisitors}
        totalPageViews={realMetrics.totalPageViews}
        chartsGenerated={realMetrics.chartsGenerated}
        trends={trends}
        filteredTrafficData={filteredTrafficData}
        isLoading={isLoading}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <DailyAveragesCard filteredTrafficData={filteredTrafficData} />
        <TrafficSourcesCard isLoading={isLoading} trafficData={trafficData} />
        <TopPagesCard isLoading={isLoading} trafficData={trafficData} />
        <LocationAnalyticsCard isLoading={isLoading} />
      </div>

      <TrafficTable
        trafficData={trafficData}
        isLoading={isLoading}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
      />
    </div>
  );
}