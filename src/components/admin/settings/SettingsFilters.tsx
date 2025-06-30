/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';
import SynapsasDropdown from '@/components/reusable/SynapsasDropdown';

import { Category, CategoryInfo } from '@/types/adminSettings';

interface SettingsFiltersProps {
  categories: Category[];
  categoryInfo: Record<string, CategoryInfo>;
  selectedCategory: string;
  searchQuery: string;
  showAdvanced: boolean;
  onCategoryChange: (category: string) => void;
  onSearchChange: (query: string) => void;
  onAdvancedToggle: (show: boolean) => void;
}

export default function SettingsFilters({
  categories,
  categoryInfo,
  selectedCategory,
  searchQuery,
  showAdvanced,
  onCategoryChange,
  onSearchChange,
  onAdvancedToggle
}: SettingsFiltersProps) {
  return (
    <section className="px-6 py-4">
      <div className="max-w-none mx-auto">
        <div className="bg-white border border-black p-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-end">
            <div className="synapsas-input-group">
              <label className="synapsas-label">
                Category
              </label>
              <div className="w-full">
                <SynapsasDropdown
                  options={[
                    { value: 'all', label: 'All Categories' },
                    ...categories.map((cat) => ({
                      value: cat.category,
                      label: `${categoryInfo[cat.category]?.name || cat.category} (${cat.count})`
                    }))
                  ]}
                  value={selectedCategory}
                  onChange={onCategoryChange}
                  placeholder="Select category"
                  className="w-full"
                />
                <style jsx>{`
                  :global(.synapsas-sort-field) {
                    border: 1px solid #e5e7eb !important;
                  }
                  :global(.synapsas-sort-select) {
                    padding: 1rem 0.75rem !important;
                    font-size: 1rem !important;
                    font-weight: 500 !important;
                  }
                `}</style>
              </div>
            </div>

            <div className="synapsas-input-group">
              <label className="synapsas-label">Search settings</label>
              <input
                type="text"
                placeholder="Search by name or description..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="synapsas-input"
              />
            </div>

            <div className="flex items-center justify-end">
              <div className="synapsas-checkbox-group">
                <input
                  type="checkbox"
                  checked={showAdvanced}
                  onChange={(e) => onAdvancedToggle(e.target.checked)}
                  className="synapsas-checkbox"
                  id="show-advanced"
                />
                <label htmlFor="show-advanced" className="synapsas-checkbox-label">
                  Show advanced
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}