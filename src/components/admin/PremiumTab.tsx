/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import AdminDropdown from '../reusable/AdminDropdown';

interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  category: 'chart' | 'interpretation' | 'sharing' | 'analysis';
  isEnabled: boolean;
  isPremium: boolean;
  component?: string;
  section?: string;
}

interface PremiumTabProps {
  isLoading?: boolean;
}

export default function PremiumTab({ isLoading = false }: PremiumTabProps) {
  const [features, setFeatures] = useState<PremiumFeature[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('All Categories');
  const [filterStatus, setFilterStatus] = useState<string>('All Features');
  const [hasChanges, setHasChanges] = useState(false);

  // Load features from API
  useEffect(() => {
    const loadFeatures = async () => {
      try {
        const response = await fetch('/api/admin/premium-features');
        const data = await response.json();
        
        if (data.success) {
          setFeatures(data.features);
        } else {
          console.error('Failed to load features:', data.error);
          toast.error('Failed to load premium features');
        }
      } catch (error) {
        console.error('Error loading features:', error);
        toast.error('Failed to load premium features');
      }
    };

    loadFeatures();
  }, []);

  const categoryOptions = ['All Categories', 'Chart Display', 'Interpretation', 'Sharing', 'Analysis'];
  const statusOptions = ['All Features', 'Enabled', 'Disabled', 'Premium Only', 'Free Features'];

  const filteredFeatures = features.filter(feature => {
    const categoryMatch = filterCategory === 'All Categories' || 
      (filterCategory === 'Chart Display' && feature.category === 'chart') ||
      (filterCategory === 'Interpretation' && feature.category === 'interpretation') ||
      (filterCategory === 'Sharing' && feature.category === 'sharing') ||
      (filterCategory === 'Analysis' && feature.category === 'analysis');

    const statusMatch = filterStatus === 'All Features' ||
      (filterStatus === 'Enabled' && feature.isEnabled) ||
      (filterStatus === 'Disabled' && !feature.isEnabled) ||
      (filterStatus === 'Premium Only' && feature.isPremium) ||
      (filterStatus === 'Free Features' && !feature.isPremium);

    return categoryMatch && statusMatch;
  });

  const handleFeatureToggle = (featureId: string, field: 'isEnabled' | 'isPremium') => {
    setFeatures(prev => prev.map(feature => 
      feature.id === featureId 
        ? { ...feature, [field]: !feature[field] }
        : feature
    ));
    setHasChanges(true);
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch('/api/admin/premium-features', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ features }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Premium features settings saved successfully!');
        setHasChanges(false);
        
        // Also save to localStorage as backup
        localStorage.setItem('premium-features', JSON.stringify(features));
      } else {
        console.error('Failed to save features:', data.error);
        toast.error(`Failed to save: ${data.error}`);
      }
    } catch (error) {
      console.error('Error saving features:', error);
      toast.error('Failed to save premium features settings');
    }
  };

  const handleResetToDefaults = () => {
    // You could implement a reset to defaults functionality here
    toast.info('Reset to defaults functionality coming soon');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'chart':
        return '📊';
      case 'interpretation':
        return '🔮';
      case 'sharing':
        return '🔗';
      case 'analysis':
        return '⚡';
      default:
        return '⭐';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'chart':
        return '#6bdbff';
      case 'interpretation':
        return '#ff91e9';
      case 'sharing':
        return '#f2e356';
      case 'analysis':
        return '#51bd94';
      default:
        return '#f3f4f6';
    }
  };

  const getEnabledCount = (category?: string) => {
    const targetFeatures = category 
      ? features.filter(f => f.category === category)
      : features;
    return targetFeatures.filter(f => f.isEnabled).length;
  };

  const getPremiumCount = (category?: string) => {
    const targetFeatures = category 
      ? features.filter(f => f.category === category)
      : features;
    return targetFeatures.filter(f => f.isPremium).length;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
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
          <p className="font-inter text-black/70">
            Control which features are available to free vs premium users
          </p>
        </div>
        
        {hasChanges && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleResetToDefaults}
              className="px-4 py-2 font-inter text-sm bg-white text-black font-semibold border-2 border-black transition-all duration-300 hover:bg-gray-50"
            >
              Reset to Defaults
            </button>
            <button
              onClick={handleSaveChanges}
              className="px-6 py-2 font-inter text-sm bg-black text-white font-semibold border-2 border-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/25"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border border-black">
        <div className="p-6 border-black md:border-r" style={{ backgroundColor: '#f0e3ff' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-inter text-sm text-black/70">Total Features</p>
              <p className="font-space-grotesk text-2xl font-bold text-black">{features.length}</p>
            </div>
            <div className="w-10 h-10 bg-black flex items-center justify-center">
              <span className="text-white text-lg">⭐</span>
            </div>
          </div>
        </div>
        
        <div className="p-6 border-black md:border-r" style={{ backgroundColor: '#4ade80' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-inter text-sm text-black/70">Enabled</p>
              <p className="font-space-grotesk text-2xl font-bold text-black">{getEnabledCount()}</p>
            </div>
            <div className="w-10 h-10 bg-black flex items-center justify-center">
              <span className="text-white text-lg">✅</span>
            </div>
          </div>
        </div>
        
        <div className="p-6 border-black md:border-r" style={{ backgroundColor: '#f2e356' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-inter text-sm text-black/70">Premium</p>
              <p className="font-space-grotesk text-2xl font-bold text-black">{getPremiumCount()}</p>
            </div>
            <div className="w-10 h-10 bg-black flex items-center justify-center">
              <span className="text-white text-lg">💎</span>
            </div>
          </div>
        </div>
        
        <div className="p-6" style={{ backgroundColor: '#6bdbff' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-inter text-sm text-black/70">Free</p>
              <p className="font-space-grotesk text-2xl font-bold text-black">{features.length - getPremiumCount()}</p>
            </div>
            <div className="w-10 h-10 bg-black flex items-center justify-center">
              <span className="text-white text-lg">🆓</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-black p-6">
        <h3 className="font-space-grotesk text-lg font-bold text-black mb-4">Filter Features</h3>
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block font-inter text-sm font-medium text-black mb-2">Category</label>
            <AdminDropdown
              options={categoryOptions}
              value={filterCategory}
              onChange={setFilterCategory}
              className="w-48"
            />
          </div>
          <div>
            <label className="block font-inter text-sm font-medium text-black mb-2">Status</label>
            <AdminDropdown
              options={statusOptions}
              value={filterStatus}
              onChange={setFilterStatus}
              className="w-48"
            />
          </div>
        </div>
      </div>

      {/* Features List */}
      <div className="bg-white border border-black">
        <div className="p-6 border-b border-black">
          <h3 className="font-space-grotesk text-lg font-bold text-black">
            Features ({filteredFeatures.length})
          </h3>
          <p className="font-inter text-sm text-black/70">
            Manage which features are available to different user tiers
          </p>
        </div>
        
        <div className="divide-y divide-black">
          {filteredFeatures.map((feature) => (
            <div key={feature.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div 
                    className="w-10 h-10 flex items-center justify-center border border-black"
                    style={{ backgroundColor: getCategoryColor(feature.category) }}
                  >
                    <span className="text-lg">{getCategoryIcon(feature.category)}</span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-space-grotesk text-lg font-semibold text-black">
                        {feature.name}
                      </h4>
                      <span className="px-2 py-1 text-xs font-medium border border-black bg-white text-black capitalize">
                        {feature.category}
                      </span>
                      {feature.component && (
                        <span className="px-2 py-1 text-xs font-medium border border-black bg-gray-100 text-black">
                          {feature.component}
                        </span>
                      )}
                    </div>
                    <p className="font-inter text-sm text-black/70 mb-3">
                      {feature.description}
                    </p>
                    {feature.section && (
                      <p className="font-inter text-xs text-black/50">
                        Section: {feature.section}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Enable/Disable Toggle */}
                  <div className="flex items-center gap-2">
                    <span className="font-inter text-sm text-black">Enabled</span>
                    <button
                      onClick={() => handleFeatureToggle(feature.id, 'isEnabled')}
                      className={`relative w-12 h-6 border-2 border-black transition-colors ${
                        feature.isEnabled ? 'bg-black' : 'bg-white'
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 w-4 h-4 bg-white border border-black transition-transform ${
                          feature.isEnabled ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>
                  
                  {/* Premium Toggle */}
                  <div className="flex items-center gap-2">
                    <span className="font-inter text-sm text-black">Premium</span>
                    <button
                      onClick={() => handleFeatureToggle(feature.id, 'isPremium')}
                      className={`relative w-12 h-6 border-2 border-black transition-colors ${
                        feature.isPremium ? 'bg-black' : 'bg-white'
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 w-4 h-4 bg-white border border-black transition-transform ${
                          feature.isPremium ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
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
            <p className="font-inter text-black/70">
              Try adjusting your filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}