import { useState, useEffect, useCallback } from 'react';

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

interface PremiumFeatureState {
  features: PremiumFeature[];
  isFeatureEnabled: (featureId: string) => boolean;
  isFeaturePremium: (featureId: string) => boolean;
  shouldShowFeature: (featureId: string, userIsPremium?: boolean) => boolean;
  loadFeatures: () => void;
  updateFeature: (featureId: string, updates: Partial<PremiumFeature>) => void;
}

// Fallback features that match the sections defined in chartStore.ts
const FALLBACK_FEATURES: PremiumFeature[] = [
  {
    id: 'core-personality',
    name: 'Core Personality Trio',
    description: 'Sun, Moon, and Rising sign detailed interpretations',
    category: 'interpretation',
    isEnabled: true,
    isPremium: false,
    component: 'ChartInterpretation',
    section: 'core'
  },
  {
    id: 'stellium-analysis',
    name: 'Stellium Analysis',
    description: 'Groups of 3+ planets in signs or houses',
    category: 'interpretation',
    isEnabled: true,
    isPremium: true,
    component: 'ChartInterpretation',
    section: 'stellium'
  },
  {
    id: 'planetary-influences',
    name: 'Planetary Influences',
    description: 'How planets affect your personality',
    category: 'interpretation',
    isEnabled: true,
    isPremium: false,
    component: 'ChartInterpretation',
    section: 'planetary'
  },
  {
    id: 'planetary-positions',
    name: 'Planetary Positions',
    description: 'Detailed planetary placements',
    category: 'interpretation',
    isEnabled: true,
    isPremium: true,
    component: 'ChartInterpretation',
    section: 'positions'
  },
  {
    id: 'detailed-aspects',
    name: 'Major Aspects',
    description: 'Planetary relationships and energies',
    category: 'interpretation',
    isEnabled: true,
    isPremium: true,
    component: 'ChartInterpretation',
    section: 'aspects'
  },
  {
    id: 'planetary-dignities',
    name: 'Planetary Dignities',
    description: 'Planet strength and weaknesses',
    category: 'interpretation',
    isEnabled: true,
    isPremium: true,
    component: 'ChartInterpretation',
    section: 'dignities'
  },
  {
    id: 'house-analysis',
    name: 'Houses Analysis',
    description: 'Life areas and themes',
    category: 'interpretation',
    isEnabled: true,
    isPremium: true,
    component: 'ChartInterpretation',
    section: 'houses'
  },
  {
    id: 'celestial-points',
    name: 'Celestial Points',
    description: 'Lilith, Lunar Nodes & Part of Fortune',
    category: 'interpretation',
    isEnabled: true,
    isPremium: false,
    component: 'ChartInterpretation',
    section: 'celestial'
  },
  {
    id: 'aspect-filtering',
    name: 'Advanced Aspect Filtering',
    description: 'Filter aspects by category, type, and life areas',
    category: 'interpretation',
    isEnabled: true,
    isPremium: false,
    component: 'ChartInterpretation',
    section: 'aspect-filters'
  }
];

export const usePremiumFeatures = (): PremiumFeatureState => {
  const [features, setFeatures] = useState<PremiumFeature[]>([]);

  const loadFeatures = useCallback(async () => {
    try {
      // Try to load from API first
      const response = await fetch('/api/admin/premium-features');
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.success) {
          setFeatures(data.features);
          // Also save to localStorage as backup
          localStorage.setItem('premium-features', JSON.stringify(data.features));
          return;
        }
      } else {
        console.warn(`Premium features API returned ${response.status}, using fallback`);
      }
    } catch (error) {
      console.error('Error loading features from API:', error);
    }

    // Fallback to localStorage
    try {
      const savedFeatures = localStorage.getItem('premium-features');
      if (savedFeatures) {
        const parsed = JSON.parse(savedFeatures);
        setFeatures(parsed);
      } else {
        setFeatures(FALLBACK_FEATURES);
      }
    } catch (error) {
      console.error('Error loading premium features from localStorage:', error);
      setFeatures(FALLBACK_FEATURES);
    }
  }, []);

  const updateFeature = useCallback(async (featureId: string, updates: Partial<PremiumFeature>) => {
    // Update locally first for immediate UI response
    setFeatures(prev => {
      const updated = prev.map(feature => 
        feature.id === featureId 
          ? { ...feature, ...updates }
          : feature
      );
      return updated;
    });

    // Try to update via API
    try {
      const response = await fetch('/api/admin/premium-features', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ featureId, updates }),
      });

      const data = await response.json();

      if (data.success) {
        // Update local state with API response
        setFeatures(prev => {
          const updated = prev.map(feature => 
            feature.id === featureId 
              ? data.feature
              : feature
          );
          
          // Save to localStorage as backup
          localStorage.setItem('premium-features', JSON.stringify(updated));
          return updated;
        });
      } else {
        console.error('Failed to update feature via API:', data.error);
        // Revert to localStorage save
        setFeatures(prev => {
          localStorage.setItem('premium-features', JSON.stringify(prev));
          return prev;
        });
      }
    } catch (error) {
      console.error('Error updating feature via API:', error);
      // Revert to localStorage save
      setFeatures(prev => {
        localStorage.setItem('premium-features', JSON.stringify(prev));
        return prev;
      });
    }
  }, []);

  const isFeatureEnabled = useCallback((featureId: string): boolean => {
    const feature = features.find(f => f.id === featureId);
    return feature?.isEnabled ?? false;
  }, [features]);

  const isFeaturePremium = useCallback((featureId: string): boolean => {
    const feature = features.find(f => f.id === featureId);
    if (!feature) {
      const fallbackFeature = FALLBACK_FEATURES.find(f => f.id === featureId);
      return fallbackFeature?.isPremium ?? false;
    }
    return feature.isPremium;
  }, [features]);

  const shouldShowFeature = useCallback((featureId: string, userIsPremium: boolean = false): boolean => {
    const feature = features.find(f => f.id === featureId);
    
    // If feature not found, check FALLBACK_FEATURES
    if (!feature) {
      const fallbackFeature = FALLBACK_FEATURES.find(f => f.id === featureId);
      if (!fallbackFeature) {
        return false; // Feature doesn't exist at all
      }
      
      // Use fallback feature settings
      if (!fallbackFeature.isEnabled) {
        return false;
      }
      
      if (fallbackFeature.isPremium && !userIsPremium) {
        return false;
      }
      
      return true;
    }
    
    // Feature found in loaded features
    if (!feature.isEnabled) {
      return false;
    }
    
    // If feature is premium and user is not premium, don't show
    if (feature.isPremium && !userIsPremium) {
      return false;
    }
    
    return true;
  }, [features]);

  // Load features on mount
  useEffect(() => {
    loadFeatures();
  }, [loadFeatures]);

  return {
    features,
    isFeatureEnabled,
    isFeaturePremium,
    shouldShowFeature,
    loadFeatures,
    updateFeature
  };
};