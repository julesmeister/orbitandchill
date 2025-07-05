/* eslint-disable @typescript-eslint/no-unused-vars */
import { TrafficData } from '@/store/admin/types';

interface DailyAveragesCardProps {
  filteredTrafficData: TrafficData[];
}

export default function DailyAveragesCard({ filteredTrafficData }: DailyAveragesCardProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  // Calculate totals based on filtered data
  const totals = filteredTrafficData.reduce(
    (acc, day) => ({
      visitors: acc.visitors + day.visitors,
      pageViews: acc.pageViews + day.pageViews,
      chartsGenerated: acc.chartsGenerated + day.chartsGenerated,
    }),
    { visitors: 0, pageViews: 0, chartsGenerated: 0 }
  );

  // Calculate averages based on filtered data
  const averages = {
    visitors: Math.round(totals.visitors / (filteredTrafficData.length || 1)),
    pageViews: Math.round(totals.pageViews / (filteredTrafficData.length || 1)),
    chartsGenerated: Math.round(totals.chartsGenerated / (filteredTrafficData.length || 1)),
  };

  return (
    <div className="bg-white border border-black">
      <div className="px-6 py-4 border-b border-black" style={{ backgroundColor: '#6bdbff' }}>
        <h3 className="text-lg font-bold text-black font-space-grotesk">Daily Averages</h3>
      </div>
      <div className="divide-y divide-black">
        <div className="p-4 hover:bg-gray-50 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3" style={{ backgroundColor: '#6bdbff' }}></div>
              <span className="text-sm font-medium text-black font-open-sans">Visitors</span>
            </div>
            <span className="text-2xl font-bold text-black font-space-grotesk">{formatNumber(averages.visitors)}</span>
          </div>
        </div>
        <div className="p-4 hover:bg-gray-50 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3" style={{ backgroundColor: '#51bd94' }}></div>
              <span className="text-sm font-medium text-black font-open-sans">Page Views</span>
            </div>
            <span className="text-2xl font-bold text-black font-space-grotesk">{formatNumber(averages.pageViews)}</span>
          </div>
        </div>
        <div className="p-4 hover:bg-gray-50 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3" style={{ backgroundColor: '#ff91e9' }}></div>
              <span className="text-sm font-medium text-black font-open-sans">Charts</span>
            </div>
            <span className="text-2xl font-bold text-black font-space-grotesk">{formatNumber(averages.chartsGenerated)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}