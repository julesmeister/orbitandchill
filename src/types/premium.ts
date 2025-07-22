/* eslint-disable @typescript-eslint/no-unused-vars */

export interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  category: 'chart' | 'interpretation' | 'sharing' | 'analysis';
  isEnabled: boolean;
  isPremium: boolean;
  component?: string;
  section?: string;
}

export interface PremiumTabProps {
  isLoading?: boolean;
}

export interface PremiumFeatureCardProps {
  feature: PremiumFeature;
  onToggle: (featureId: string, field: 'isEnabled' | 'isPremium') => void;
}

export interface PremiumStatsCardsProps {
  features: PremiumFeature[];
}

export interface PremiumFiltersProps {
  filterCategory: string;
  setFilterCategory: (category: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
  categoryOptions: Array<{ value: string; label: string }>;
  statusOptions: Array<{ value: string; label: string }>;
  sectionTabs: string[];
  onToggleAll: (field: 'isEnabled' | 'isPremium', value: boolean) => void;
}