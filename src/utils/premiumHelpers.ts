/* eslint-disable @typescript-eslint/no-unused-vars */

// User types for premium checking
interface User {
  subscriptionTier?: 'free' | 'premium' | 'pro';
  email?: string;
  id?: string;
}

// Check if user has premium access
export const hasPremiumAccess = (user: User | null): boolean => {
  if (!user) return false;
  
  // Admin override - orbitandchill@gmail.com gets full access
  if (user.email === 'orbitandchill@gmail.com') {
    return true;
  }
  
  return user.subscriptionTier === 'premium' || user.subscriptionTier === 'pro';
};

// Check if user has specific tier
export const hasSubscriptionTier = (user: User | null, tier: 'free' | 'premium' | 'pro'): boolean => {
  if (!user) return tier === 'free';
  return user.subscriptionTier === tier;
};

// Get user's subscription tier display name
export const getSubscriptionTierName = (user: User | null): string => {
  if (!user || !user.subscriptionTier) return 'Free';
  switch (user.subscriptionTier) {
    case 'premium':
      return 'Premium';
    case 'pro':
      return 'Pro';
    default:
      return 'Free';
  }
};

// Check if feature requires premium access
export const isFeaturePremium = (featureName: string): boolean => {
  const premiumFeatures = [
    'tarot-learning',
    'advanced-interpretations',
    'chart-sharing',
    'detailed-analysis',
    'premium-templates'
  ];
  return premiumFeatures.includes(featureName);
};

export const getCategoryIcon = (category: string) => {
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

export const getCategoryColor = (category: string) => {
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