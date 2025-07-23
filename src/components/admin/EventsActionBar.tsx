/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Search, Plus, Trash2 } from 'lucide-react';
import { FilterType, FilterSource } from '@/hooks/useFilterState';

interface EventsActionBarProps {
  // Form actions
  openCreateForm: () => void;
  
  // Selection actions
  selectedEvents: string[];
  handleBulkDelete: (selectedEvents: string[]) => Promise<void>;
  
  // Filter state
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedType: FilterType;
  setSelectedType: (type: FilterType) => void;
  selectedSource: FilterSource;
  setSelectedSource: (source: FilterSource) => void;
}

export default function EventsActionBar({
  openCreateForm,
  selectedEvents,
  handleBulkDelete,
  searchQuery,
  setSearchQuery,
  selectedType,
  setSelectedType,
  selectedSource,
  setSelectedSource
}: EventsActionBarProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
      <div className="flex items-center gap-4">
        <button
          onClick={openCreateForm}
          className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white border border-black font-medium hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Event
        </button>
        
        {selectedEvents.length > 0 && (
          <button
            onClick={() => handleBulkDelete(selectedEvents)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white border border-red-600 font-medium hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete ({selectedEvents.length})
          </button>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 focus:outline-none focus:border-black w-64"
          />
        </div>
        
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as FilterType)}
          className="px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
        >
          <option value="all">All Types</option>
          <option value="benefic">Benefic</option>
          <option value="challenging">Challenging</option>
          <option value="neutral">Neutral</option>
        </select>
        
        <select
          value={selectedSource}
          onChange={(e) => setSelectedSource(e.target.value as FilterSource)}
          className="px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
        >
          <option value="all">All Sources</option>
          <option value="generated">Generated</option>
          <option value="manual">Manual</option>
        </select>
      </div>
    </div>
  );
}