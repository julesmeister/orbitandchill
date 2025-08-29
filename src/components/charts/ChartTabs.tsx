import React from 'react';
import { ChartTab } from '../../store/chartStore';

interface ChartTabsProps {
  activeTab: ChartTab;
  onTabChange: (tab: ChartTab) => void;
}

const ChartTabs: React.FC<ChartTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="mt-6">
      {/* Synapsas-style tab buttons with black borders and sharp corners */}
      <div className="flex gap-0 border border-black overflow-hidden">
        <button
          onClick={() => onTabChange('chart')}
          className={`group flex-1 flex items-center justify-center px-1 sm:px-4 md:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold transition-all duration-300 border-r border-black relative overflow-hidden ${
            activeTab === 'chart'
              ? 'bg-black text-white'
              : 'bg-white text-black hover:bg-black hover:text-white'
          }`}
        >
          {/* Animated background for inactive tab */}
          {activeTab !== 'chart' && (
            <div className="absolute inset-0 bg-black translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300"></div>
          )}
          
          <div className="relative flex flex-col sm:flex-row items-center">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 mb-0.5 sm:mb-0 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="font-space-grotesk text-[10px] sm:text-xs md:text-sm">Chart</span>
          </div>
        </button>
        
        <button
          onClick={() => onTabChange('interpretation')}
          className={`group flex-1 flex items-center justify-center px-1 sm:px-4 md:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold transition-all duration-300 border-r border-black relative overflow-hidden ${
            activeTab === 'interpretation'
              ? 'bg-black text-white'
              : 'bg-white text-black hover:bg-black hover:text-white'
          }`}
        >
          {/* Animated background for inactive tab */}
          {activeTab !== 'interpretation' && (
            <div className="absolute inset-0 bg-black translate-x-[100%] group-hover:translate-x-0 transition-transform duration-300"></div>
          )}
          
          <div className="relative flex flex-col sm:flex-row items-center">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 mb-0.5 sm:mb-0 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="font-space-grotesk text-[10px] sm:text-xs md:text-sm">Reading</span>
          </div>
        </button>

        <button
          onClick={() => onTabChange('transits')}
          className={`group flex-1 flex items-center justify-center px-1 sm:px-4 md:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold transition-all duration-300 border-r border-black relative overflow-hidden ${
            activeTab === 'transits'
              ? 'bg-black text-white'
              : 'bg-white text-black hover:bg-black hover:text-white'
          }`}
        >
          {/* Animated background for inactive tab */}
          {activeTab !== 'transits' && (
            <div className="absolute inset-0 bg-black translate-x-[100%] group-hover:translate-x-0 transition-transform duration-300"></div>
          )}
          
          <div className="relative flex flex-col sm:flex-row items-center">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 mb-0.5 sm:mb-0 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span className="font-space-grotesk text-[10px] sm:text-xs md:text-sm">Transits</span>
          </div>
        </button>

        <button
          onClick={() => onTabChange('matrix-destiny')}
          className={`group flex-1 flex items-center justify-center px-1 sm:px-4 md:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold transition-all duration-300 relative overflow-hidden ${
            activeTab === 'matrix-destiny'
              ? 'bg-black text-white'
              : 'bg-white text-black hover:bg-black hover:text-white'
          }`}
        >
          {/* Animated background for inactive tab */}
          {activeTab !== 'matrix-destiny' && (
            <div className="absolute inset-0 bg-black translate-x-[100%] group-hover:translate-x-0 transition-transform duration-300"></div>
          )}
          
          <div className="relative flex flex-col sm:flex-row items-center">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 mb-0.5 sm:mb-0 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            <span className="font-space-grotesk text-[10px] sm:text-xs md:text-sm">Matrix</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ChartTabs;