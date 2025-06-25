import { useState } from 'react';
import TrafficMetricsSection from './traffic/TrafficMetricsSection';
import DailyAveragesCard from './traffic/DailyAveragesCard';
import TrafficSourcesCard from './traffic/TrafficSourcesCard';
import TopPagesCard from './traffic/TopPagesCard';
import TrafficTable from './traffic/TrafficTable';

interface TrafficData {
  date: string;
  visitors: number;
  pageViews: number;
  chartsGenerated: number;
}

interface TrafficTabProps {
  trafficData: TrafficData[];
  isLoading: boolean;
}

export default function TrafficTab({ trafficData, isLoading }: TrafficTabProps) {
  const [timeRange, setTimeRange] = useState('Last 30 days');

  // Filter traffic data based on time range
  const getFilteredTrafficData = () => {
    const now = new Date();
    let daysBack = 30;
    
    switch (timeRange) {
      case 'Last 7 days':
        daysBack = 7;
        break;
      case 'Last 24 hours':
        daysBack = 1;
        break;
      default:
        daysBack = 30;
    }
    
    const cutoffDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));
    return trafficData.filter(day => new Date(day.date) >= cutoffDate);
  };
  
  const filteredTrafficData = getFilteredTrafficData();

  return (
    <div className="px-4 py-6 sm:px-0">
      <TrafficMetricsSection 
        filteredTrafficData={filteredTrafficData}
        isLoading={isLoading}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <DailyAveragesCard filteredTrafficData={filteredTrafficData} />
        <TrafficSourcesCard isLoading={isLoading} trafficData={trafficData} />
        <TopPagesCard isLoading={isLoading} trafficData={trafficData} />
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