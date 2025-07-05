/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import AdminDropdown from '@/components/reusable/AdminDropdown';
import TablePagination from '@/components/reusable/TablePagination';

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

interface TrafficTableProps {
  trafficData: TrafficData[];
  isLoading: boolean;
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
}

export default function TrafficTable({ trafficData, isLoading, timeRange, onTimeRangeChange }: TrafficTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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
  
  // Pagination calculations
  const totalPages = Math.ceil(filteredTrafficData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredTrafficData.slice(startIndex, endIndex);

  // Reset to page 1 when time range changes
  useEffect(() => {
    setCurrentPage(1);
  }, [timeRange]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    <div className="bg-white border border-black">
      <div className="px-6 py-5 border-b border-black">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-black font-space-grotesk">Daily Traffic Data</h3>
            <p className="mt-1 text-sm text-gray-600 font-open-sans">Last 30 days of detailed analytics</p>
          </div>
          <div className="flex items-center space-x-3">
            <AdminDropdown
              options={['5', '10', '25', '50']}
              value={itemsPerPage.toString()}
              onChange={(value) => {
                setItemsPerPage(parseInt(value));
                setCurrentPage(1);
              }}
              label="Show"
            />
            <AdminDropdown
              options={['Last 30 days', 'Last 7 days', 'Last 24 hours']}
              value={timeRange}
              onChange={onTimeRangeChange}
            />
            <button className="px-4 py-2 text-sm font-medium text-black bg-white border-2 border-black hover:bg-[#6bdbff] hover:text-black transition-colors font-open-sans">
              Export CSV
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-black">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider font-space-grotesk">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider font-space-grotesk">
                Visitors
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider font-space-grotesk">
                Page Views
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider font-space-grotesk">
                Charts Generated
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider font-space-grotesk">
                Top Countries
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider font-space-grotesk">
                Location Source
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider font-space-grotesk">
                Conversion Rate
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              [1, 2, 3, 4, 5].map((item) => (
                <tr key={item} className="animate-pulse">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 w-20"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-4 bg-gray-200 w-12"></div>
                      <div className="ml-2 w-8 h-2 bg-gray-200"></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-4 bg-gray-200 w-12"></div>
                      <div className="ml-2 w-8 h-2 bg-gray-200"></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-4 bg-gray-200 w-8"></div>
                      <div className="ml-2 w-8 h-2 bg-gray-200"></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-6 bg-gray-200 w-12"></div>
                  </td>
                </tr>
              ))
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <div className="text-gray-500">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No traffic data</h3>
                    <p className="mt-1 text-sm text-gray-500">No traffic data available for the selected time range.</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData
                .slice()
                .reverse()
                .map((day, index) => {
                  const conversionRate = day.visitors > 0 ? ((day.chartsGenerated / day.visitors) * 100).toFixed(1) : '0.0';
                  const isHighConversion = parseFloat(conversionRate) > 15;
                  
                  // Calculate max values for progress bars from filtered data
                  const maxVisitors = Math.max(...filteredTrafficData.map(d => d.visitors));
                  const maxPageViews = Math.max(...filteredTrafficData.map(d => d.pageViews));
                  const maxCharts = Math.max(...filteredTrafficData.map(d => d.chartsGenerated));
                  
                  return (
                    <tr key={`${day.date}-${index}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black font-open-sans">
                        {formatDate(day.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black font-open-sans">
                        <div className="flex items-center">
                          <span>{formatNumber(day.visitors)}</span>
                          <div className="ml-2 w-8 h-2 bg-gray-200">
                            <div 
                              className="h-2 bg-[#6bdbff]"
                              style={{ width: `${maxVisitors > 0 ? (day.visitors / maxVisitors) * 100 : 0}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black font-open-sans">
                        <div className="flex items-center">
                          <span>{formatNumber(day.pageViews)}</span>
                          <div className="ml-2 w-8 h-2 bg-gray-200">
                            <div 
                              className="h-2 bg-[#51bd94]"
                              style={{ width: `${maxPageViews > 0 ? (day.pageViews / maxPageViews) * 100 : 0}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black font-open-sans">
                        <div className="flex items-center">
                          <span>{formatNumber(day.chartsGenerated)}</span>
                          <div className="ml-2 w-8 h-2 bg-gray-200">
                            <div 
                              className="h-2 bg-[#ff91e9]"
                              style={{ width: `${maxCharts > 0 ? (day.chartsGenerated / maxCharts) * 100 : 0}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black font-open-sans">
                        <div className="space-y-1">
                          {day.topCountries && day.topCountries.length > 0 ? (
                            day.topCountries.slice(0, 2).map((country, i) => (
                              <div key={country.country} className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span className="text-xs">{country.country}</span>
                                <span className="text-xs text-gray-500">({country.percentage}%)</span>
                              </div>
                            ))
                          ) : (
                            <span className="text-xs text-gray-400">No data</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black font-open-sans">
                        <div className="space-y-1">
                          {day.locationBreakdown ? (
                            <>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-1">
                                  <span className="text-green-600">📍</span>
                                  <span className="text-xs">Current</span>
                                </div>
                                <span className="text-xs font-bold">{day.locationBreakdown.currentLocation}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-1">
                                  <span className="text-gray-600">🏙️</span>
                                  <span className="text-xs">Fallback</span>
                                </div>
                                <span className="text-xs font-bold">{day.locationBreakdown.fallbackLocation}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-1">
                                  <span className="text-blue-600">🏠</span>
                                  <span className="text-xs">Birth</span>
                                </div>
                                <span className="text-xs font-bold">{day.locationBreakdown.birthLocation}</span>
                              </div>
                            </>
                          ) : (
                            <span className="text-xs text-gray-400">No data</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium border font-open-sans ${
                          isHighConversion 
                            ? 'bg-[#51bd94] text-white border-black' 
                            : 'bg-[#f2e356] text-black border-black'
                        }`}>
                          {conversionRate}%
                        </span>
                      </td>
                    </tr>
                  );
                })
            )}
          </tbody>
        </table>
      </div>

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredTrafficData.length}
        itemsPerPage={itemsPerPage}
        startIndex={startIndex}
        endIndex={endIndex}
        onPageChange={setCurrentPage}
        backgroundColor="#f0f9ff"
        label={`entries (${timeRange.toLowerCase()})`}
      />
    </div>
  );
}