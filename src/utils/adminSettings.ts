/* eslint-disable @typescript-eslint/no-unused-vars */
import { AdminSetting, CategoryInfo } from '@/types/adminSettings';

// Category configuration data
export const CATEGORY_INFO: Record<string, CategoryInfo> = {
  newsletter: {
    name: 'Newsletter & Marketing',
    description: 'Newsletter signup form, content, and subscription management',
    icon: '📬'
  },
  seo: {
    name: 'SEO & Meta Tags',
    description: 'Search engine optimization and social media meta tags',
    icon: '🔍'
  },
  analytics: {
    name: 'Analytics & Tracking',
    description: 'Google Analytics, Tag Manager, and tracking configuration',
    icon: '📊'
  },
  general: {
    name: 'General Settings',
    description: 'Basic application configuration and limits',
    icon: '⚙️'
  },
  email: {
    name: 'Email & SMTP',
    description: 'Email server configuration and notification settings',
    icon: '📧'
  },
  security: {
    name: 'Security & Authentication',
    description: 'Security policies, rate limits, and authentication settings',
    icon: '🔒'
  }
};

// Category color mapping
export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    newsletter: '#ffd5f7',  // purple
    seo: '#b9e9f9',         // blue
    analytics: '#f2e356',   // yellow
    general: '#b1ffe1',     // green
    email: '#ffbfa7',       // coral
    security: '#e4c9ff',    // light purple
  };
  return colors[category] || '#b9e8f7';
};

// Determine if a setting is considered "advanced"
export const isAdvancedSetting = (setting: AdminSetting): boolean => {
  return setting.key.includes('password') || 
         setting.key.includes('smtp') || 
         setting.type === 'json';
};

// Filter settings based on search query
export const filterSettings = (settings: AdminSetting[], searchQuery: string): AdminSetting[] => {
  if (!searchQuery) return settings;
  
  const query = searchQuery.toLowerCase();
  return settings.filter(setting => 
    setting.key.toLowerCase().includes(query) ||
    setting.description?.toLowerCase().includes(query)
  );
};

// Group settings by category
export const groupSettingsByCategory = (settings: AdminSetting[]): Record<string, AdminSetting[]> => {
  return settings.reduce((acc, setting) => {
    if (!acc[setting.category]) {
      acc[setting.category] = [];
    }
    acc[setting.category].push(setting);
    return acc;
  }, {} as Record<string, AdminSetting[]>);
};

// Deserialize setting value based on type
export const deserializeSettingValue = (setting: AdminSetting): any => {
  switch (setting.type) {
    case 'boolean':
      return setting.value === 'true';
    case 'number':
      return Number(setting.value);
    case 'json':
      try {
        return JSON.parse(setting.value);
      } catch {
        return setting.value;
      }
    default:
      return setting.value;
  }
};

// Create setting display name from key
export const getSettingDisplayName = (key: string): string => {
  return key
    .split('.')
    .pop()
    ?.replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase()) || key;
};

// Create placeholder text for setting input
export const getSettingPlaceholder = (setting: AdminSetting): string => {
  switch (setting.type) {
    case 'number':
      return 'Enter number value';
    case 'json':
      return 'Valid JSON required';
    case 'boolean':
      return '';
    default:
      return `Enter ${getSettingDisplayName(setting.key).toLowerCase()}`;
  }
};