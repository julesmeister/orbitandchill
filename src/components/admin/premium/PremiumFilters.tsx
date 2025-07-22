/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import AdminDropdown from '@/components/reusable/AdminDropdown';
import { PremiumFiltersProps } from '@/types/premium';

export default function PremiumFilters({
  filterCategory,
  setFilterCategory,
  filterStatus,
  setFilterStatus,
  activeSection,
  setActiveSection,
  categoryOptions,
  statusOptions,
  sectionTabs,
  onToggleAll
}: PremiumFiltersProps) {
  return (
    <div className="bg-white border border-black">
      <div className="p-4">
        {/* Section Tabs */}
        <div className="flex gap-0 border border-black mb-4 overflow-x-auto">
          {sectionTabs.map((section, index) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`relative group px-3 py-2 font-space-grotesk font-medium text-xs transition-all duration-300 whitespace-nowrap overflow-hidden ${
                activeSection === section
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-black hover:text-white'
              } ${index < sectionTabs.length - 1 ? 'border-r border-black' : ''}`}
            >
              {/* Slide animation for inactive tabs */}
              {activeSection !== section && (
                <div className="absolute inset-0 bg-black translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300"></div>
              )}
              <span className="relative z-10">{section}</span>
            </button>
          ))}
        </div>
        
        {/* Filters and Bulk Actions Row */}
        <div className="flex items-center justify-between gap-4 text-sm">
          {/* Left: Filters */}
          <div className="flex flex-wrap items-center gap-6">
            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <span className="font-open-sans text-xs text-black font-medium">Category:</span>
              <AdminDropdown
                options={categoryOptions}
                value={filterCategory}
                onChange={setFilterCategory}
                className="w-32 text-xs"
              />
            </div>
            
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="font-open-sans text-xs text-black font-medium">Status:</span>
              <AdminDropdown
                options={statusOptions}
                value={filterStatus}
                onChange={setFilterStatus}
                className="w-32 text-xs"
              />
            </div>
          </div>
          
          {/* Right: Bulk Actions */}
          <div className="flex items-center gap-4">
            {/* Enable/Disable All */}
            <div className="flex items-center gap-1">
              <span className="font-open-sans text-xs text-black font-medium">Enable:</span>
              <button
                onClick={() => onToggleAll('isEnabled', true)}
                className="px-3 py-2 bg-green-500 text-white text-xs font-medium border border-black hover:bg-green-600 transition-colors"
              >
                All
              </button>
              <button
                onClick={() => onToggleAll('isEnabled', false)}
                className="px-3 py-2 bg-red-500 text-white text-xs font-medium border border-black hover:bg-red-600 transition-colors"
              >
                None
              </button>
            </div>
            
            {/* Premium All/None */}
            <div className="flex items-center gap-1">
              <span className="font-open-sans text-xs text-black font-medium">Premium:</span>
              <button
                onClick={() => onToggleAll('isPremium', true)}
                className="px-3 py-2 bg-purple-500 text-white text-xs font-medium border border-black hover:bg-purple-600 transition-colors"
              >
                All
              </button>
              <button
                onClick={() => onToggleAll('isPremium', false)}
                className="px-3 py-2 bg-blue-500 text-white text-xs font-medium border border-black hover:bg-blue-600 transition-colors"
              >
                None
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}