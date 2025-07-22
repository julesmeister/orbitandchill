/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from 'react';
import StatusToast from '../reusable/StatusToast';
import LoadingSpinner from '../reusable/LoadingSpinner';
import PremiumStatsCards from './premium/PremiumStatsCards';
import PremiumFilters from './premium/PremiumFilters';
import PremiumFeatureCard from './premium/PremiumFeatureCard';
import { usePremiumFilters } from '@/hooks/usePremiumFilters';
import { usePremiumAdmin } from '@/hooks/usePremiumAdmin';
import { PremiumTabProps } from '@/types/premium';

export default function PremiumTab({ isLoading = false }: PremiumTabProps) {
  // StatusToast state
  const [toast, setToast] = useState({
    isVisible: false,
    title: '',
    message: '',
    status: 'info' as 'loading' | 'success' | 'error' | 'info'
  });

  const showToast = (title: string, message: string, status: 'loading' | 'success' | 'error' | 'info') => {
    setToast({ isVisible: true, title, message, status });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  // Use premium admin hook
  const {
    features,
    hasChanges,
    isLoading: adminIsLoading,
    saveChanges,
    handleFeatureToggle,
    handleToggleAll,
    resetToDefaults
  } = usePremiumAdmin(showToast);

  // Use filter hook
  const {
    filterCategory,
    setFilterCategory,
    filterStatus,
    setFilterStatus,
    activeSection,
    setActiveSection,
    categoryOptions,
    statusOptions,
    sectionTabs,
    filteredFeatures,
  } = usePremiumFilters(features);

  if (isLoading || adminIsLoading) {
    return (
      <LoadingSpinner
        variant="dots"
        size="lg"
        title="Loading Premium Features"
        subtitle="Preparing premium feature management interface..."
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-space-grotesk text-3xl font-bold text-black mb-2">
            Premium Features
          </h1>
          <p className="font-open-sans text-black/70">
            Control which features are available to free vs premium users
          </p>
        </div>
        
        {hasChanges && (
          <div className="flex items-center gap-3">
            <button
              onClick={resetToDefaults}
              className="px-4 py-2 font-open-sans text-sm bg-white text-black font-semibold border-2 border-black transition-all duration-300 hover:bg-gray-50"
            >
              Reset to Defaults
            </button>
            <button
              onClick={saveChanges}
              className="px-6 py-2 font-open-sans text-sm bg-black text-white font-semibold border-2 border-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/25"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Statistics Cards */}
      <PremiumStatsCards features={features} />

      {/* Filters */}
      <PremiumFilters
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        categoryOptions={categoryOptions}
        statusOptions={statusOptions}
        sectionTabs={sectionTabs}
        onToggleAll={handleToggleAll}
      />

      {/* Features List */}
      <div className="bg-white border border-black">
        <div className="p-6 border-b border-black">
          <h3 className="font-space-grotesk text-lg font-bold text-black">
            Features ({filteredFeatures.length})
          </h3>
          <p className="font-open-sans text-sm text-black/70">
            Manage which features are available to different user tiers
          </p>
        </div>
        
        <div className="divide-y divide-black">
          {filteredFeatures.map((feature) => (
            <PremiumFeatureCard
              key={feature.id}
              feature={feature}
              onToggle={handleFeatureToggle}
            />
          ))}
        </div>
        
        {filteredFeatures.length === 0 && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-black flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">🔍</span>
            </div>
            <h3 className="font-space-grotesk text-lg font-bold text-black mb-2">
              No features found
            </h3>
            <p className="font-open-sans text-black/70">
              Try adjusting your filter criteria
            </p>
          </div>
        )}
      </div>

      {/* StatusToast */}
      <StatusToast
        title={toast.title}
        message={toast.message}
        status={toast.status}
        isVisible={toast.isVisible}
        onHide={hideToast}
        duration={toast.status === 'loading' ? 0 : 5000}
      />
    </div>
  );
}