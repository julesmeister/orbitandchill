/* eslint-disable @typescript-eslint/no-unused-vars */

interface TrafficSource {
  name: string;
  value: number;
  color: string;
}

interface TrafficSourcesChartProps {
  data?: TrafficSource[];
  isLoading?: boolean;
}

export default function TrafficSourcesChart({ data, isLoading }: TrafficSourcesChartProps) {
  const defaultData: TrafficSource[] = [
    { name: 'Organic Search', value: 45, color: '#51bd94' },
    { name: 'Direct', value: 30, color: '#6bdbff' },
    { name: 'Social Media', value: 15, color: '#ff91e9' },
    { name: 'Referrals', value: 10, color: '#f2e356' }
  ];

  const chartData = data || defaultData;
  const maxValue = Math.max(...chartData.map(d => d.value));

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center bg-gray-50 border border-black">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-2 h-2 bg-black animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-black animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-black animate-bounce"></div>
          </div>
          <p className="font-open-sans text-black/60 text-sm">Loading traffic data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-black p-6">
      <h3 className="font-space-grotesk text-lg font-bold text-black mb-6">Traffic Sources</h3>
      
      <div className="space-y-4">
        {chartData.map((source, index) => {
          const percentage = (source.value / maxValue) * 100;
          
          return (
            <div key={index} className="space-y-2">
              {/* Source name and value */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 border border-black"
                    style={{ backgroundColor: source.color }}
                  ></div>
                  <span className="font-open-sans text-sm text-black">{source.name}</span>
                </div>
                <span className="font-space-grotesk text-sm font-bold text-black">
                  {source.value}%
                </span>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-200 border border-black h-4">
                <div
                  className="h-full border-r border-black transition-all duration-500"
                  style={{ 
                    width: `${percentage}%`,
                    backgroundColor: source.color
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total */}
      <div className="mt-6 pt-4 border-t border-black/20">
        <div className="flex items-center justify-between">
          <span className="font-open-sans text-sm font-medium text-black">Total Traffic</span>
          <span className="font-space-grotesk text-sm font-bold text-black">
            {chartData.reduce((sum, source) => sum + source.value, 0)}%
          </span>
        </div>
      </div>
    </div>
  );
}