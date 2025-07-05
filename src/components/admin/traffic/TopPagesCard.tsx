/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';

interface TopPage {
  page: string;
  views: number;
  percentage: number;
}

interface TopPagesCardProps {
  isLoading: boolean;
  trafficData: any[];
}

export default function TopPagesCard({ isLoading, trafficData }: TopPagesCardProps) {
  const [topPages, setTopPages] = useState<TopPage[]>([]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  useEffect(() => {
    const fetchTopPages = async () => {
      try {
        const pagesResponse = await fetch('/api/admin/top-pages');
        if (pagesResponse.ok) {
          const pagesData = await pagesResponse.json();
          if (pagesData.success) {
            setTopPages(pagesData.pages);
          }
        }
      } catch (error) {
        console.warn('Failed to fetch top pages:', error);
        // Set empty data instead of fallback
        setTopPages([]);
      }
    };

    if (trafficData.length > 0) {
      fetchTopPages();
    }
  }, [trafficData]);

  return (
    <div className="bg-white border border-black p-6">
      <h3 className="text-lg font-semibold text-black mb-4 font-space-grotesk">Popular Pages</h3>
      <div className="space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="animate-pulse p-3 bg-gray-50 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-4 bg-gray-200 w-24 mb-2"></div>
                    <div className="h-3 bg-gray-200 w-16"></div>
                  </div>
                  <div className="text-right">
                    <div className="h-3 bg-gray-200 w-8 mb-1"></div>
                    <div className="w-16 bg-gray-200 h-1"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          topPages.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200">
              <div>
                <div className="font-medium text-black font-open-sans">{item.page}</div>
                <div className="text-sm text-gray-600 font-open-sans">{formatNumber(item.views)} views</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-black">{item.percentage}%</div>
                <div className="w-16 bg-gray-200 h-1 mt-1">
                  <div 
                    className="bg-[#6bdbff] h-1"
                    style={{ width: `${Math.min(item.percentage * 3, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}