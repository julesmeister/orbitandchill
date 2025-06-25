interface MetricsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'yellow' | 'red' | 'indigo';
  trend?: {
    value: number;
    isPositive: boolean;
  };
  isLoading?: boolean;
}

const synapsasColors = {
  blue: '#6bdbff',
  green: '#51bd94', 
  purple: '#ff91e9',
  yellow: '#f2e356',
  red: '#ff91e9', // Using purple as red replacement
  indigo: '#6bdbff' // Using blue as indigo replacement
};

export default function MetricsCard({ 
  title, 
  value, 
  icon, 
  color, 
  trend, 
  isLoading = false 
}: MetricsCardProps) {
  const backgroundColor = synapsasColors[color];
  
  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      return new Intl.NumberFormat('en-US').format(val);
    }
    return val;
  };

  return (
    <div className="bg-white border border-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/25">
      <div className="p-6">
        {isLoading ? (
          <div className="animate-pulse">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-black flex items-center justify-center">
                <div className="w-6 h-6 bg-white"></div>
              </div>
              <div className="ml-4 flex-1">
                <div className="h-4 bg-gray-300 w-3/4 mb-2"></div>
                <div className="h-6 bg-gray-400 w-1/2"></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center">
            <div className="w-12 h-12 bg-black flex items-center justify-center text-white">
              {icon}
            </div>
            <div className="ml-4 flex-1">
              <dt className="font-inter text-sm font-medium text-black/80 truncate mb-1">
                {title}
              </dt>
              <dd className="font-space-grotesk text-2xl font-bold text-black leading-none">
                {formatValue(value)}
              </dd>
              {trend && (
                <div className="flex items-center mt-2">
                  <div className={`flex items-center font-inter text-xs font-medium ${
                    trend.isPositive ? 'text-black' : 'text-black/60'
                  }`}>
                    {trend.isPositive ? (
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    {Math.abs(trend.value)}%
                  </div>
                  <span className="font-inter text-xs text-black/50 ml-1">vs last month</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Colored bottom border */}
      <div className="h-2 border-t border-black" style={{ backgroundColor }}></div>
    </div>
  );
}