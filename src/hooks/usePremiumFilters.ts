/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';

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

export function usePremiumFilters(features: PremiumFeature[]) {
  const [filterCategory, setFilterCategory] = useState<string>('All Categories');
  const [filterStatus, setFilterStatus] = useState<string>('All Features');
  const [activeSection, setActiveSection] = useState('All Sections');

  const categoryOptions = [
    { value: 'All Categories', label: 'All Categories' },
    { value: 'Chart Display', label: 'Chart Display' },
    { value: 'Interpretation', label: 'Interpretation' },
    { value: 'Sharing', label: 'Sharing' },
    { value: 'Analysis', label: 'Analysis' }
  ];
  
  const statusOptions = [
    { value: 'All Features', label: 'All Features' },
    { value: 'Enabled', label: 'Enabled' },
    { value: 'Disabled', label: 'Disabled' },
    { value: 'Premium Only', label: 'Premium Only' },
    { value: 'Free Features', label: 'Free Features' }
  ];
  
  const sectionTabs = ['All Sections', 'Chart Display', 'Interpretations', 'Sharing', 'Analysis', 'Horary', 'Events'];

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

    const sectionMatch = activeSection === 'All Sections' ||
      (activeSection === 'Chart Display' && feature.section === 'chart-display') ||
      (activeSection === 'Interpretations' && feature.section === 'interpretations') ||
      (activeSection === 'Sharing' && feature.section === 'sharing') ||
      (activeSection === 'Analysis' && feature.section === 'analysis') ||
      (activeSection === 'Horary' && feature.section === 'horary') ||
      (activeSection === 'Events' && feature.section === 'events');

    return categoryMatch && statusMatch && sectionMatch;
  });

  return {
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
  };
}