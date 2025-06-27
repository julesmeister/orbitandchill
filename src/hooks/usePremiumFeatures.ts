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

const DEFAULT_FEATURES: PremiumFeature[] = [
  // Chart Interpretation Features
  {
    id: 'detailed-aspects',
    name: 'Detailed Aspect Interpretations',
    description: 'Full descriptions for all planetary aspects including minor aspects',
    category: 'interpretation',
    isEnabled: true,
    isPremium: false,
    component: 'ChartInterpretation',
    section: 'aspects'
  },
  {
    id: 'planetary-dignities',
    name: 'Planetary Dignities Analysis',
    description: 'Complete dignities and debilities table with interpretations',
    category: 'interpretation',
    isEnabled: true,
    isPremium: false,
    component: 'ChartInterpretation',
    section: 'dignities'
  },
  {
    id: 'house-analysis',
    name: 'Comprehensive House Analysis',
    description: 'Detailed analysis of all 12 houses with cusp interpretations',
    category: 'interpretation',
    isEnabled: true,
    isPremium: false,
    component: 'ChartInterpretation',
    section: 'houses'
  },
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
    id: 'planetary-positions',
    name: 'Planetary Positions Overview',
    description: 'Table showing all planetary positions and houses',
    category: 'interpretation',
    isEnabled: true,
    isPremium: false,
    component: 'ChartInterpretation',
    section: 'positions'
  },
  {
    id: 'stellium-analysis',
    name: 'Stellium Analysis',
    description: 'Detection and interpretation of planetary stelliums in signs and houses',
    category: 'interpretation',
    isEnabled: true,
    isPremium: false,
    component: 'ChartInterpretation',
    section: 'stelliums'
  },
  {
    id: 'aspect-filtering',
    name: 'Advanced Aspect Filtering',
    description: 'Filter aspects by category, type, and life areas',
    category: 'interpretation',
    isEnabled: true,
    isPremium: true,
    component: 'ChartInterpretation',
    section: 'aspect-filters'
  },
  {
    id: 'detailed-modals',
    name: 'Detailed Interpretation Modals',
    description: 'In-depth planetary interpretations in modal popups',
    category: 'interpretation',
    isEnabled: true,
    isPremium: true,
    component: 'ChartInterpretation',
    section: 'modals'
  },
  // Chart Display Features
  {
    id: 'interactive-chart',
    name: 'Interactive Chart Elements',
    description: 'Clickable planets, houses, and aspects with tooltips',
    category: 'chart',
    isEnabled: true,
    isPremium: false,
    component: 'UnifiedAstrologicalChart',
    section: 'interactivity'
  },
  {
    id: 'aspect-lines',
    name: 'Aspect Lines Visualization',
    description: 'Visual lines showing planetary aspects on the chart',
    category: 'chart',
    isEnabled: true,
    isPremium: true,
    component: 'UnifiedAstrologicalChart',
    section: 'aspects'
  },
  {
    id: 'angular-markers',
    name: 'Angular Markers (ASC/DSC/MC/IC)',
    description: 'Display of important chart angles and markers',
    category: 'chart',
    isEnabled: true,
    isPremium: false,
    component: 'UnifiedAstrologicalChart',
    section: 'angles'
  },
  // Sharing Features
  {
    id: 'chart-sharing',
    name: 'Chart Sharing',
    description: 'Generate public links to share charts with others',
    category: 'sharing',
    isEnabled: true,
    isPremium: true,
    component: 'ChartPage',
    section: 'sharing'
  },
  {
    id: 'chart-export',
    name: 'Chart Export Options',
    description: 'Export charts as PNG, PDF, or SVG files',
    category: 'sharing',
    isEnabled: false,
    isPremium: true,
    component: 'ChartActions',
    section: 'export'
  }
];

export const usePremiumFeatures = (): PremiumFeatureState => {
  const [features, setFeatures] = useState<PremiumFeature[]>(DEFAULT_FEATURES);

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
        setFeatures(DEFAULT_FEATURES);
      }
    } catch (error) {
      console.error('Error loading premium features from localStorage:', error);
      setFeatures(DEFAULT_FEATURES);
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
    return feature?.isPremium ?? false;
  }, [features]);

  const shouldShowFeature = useCallback((featureId: string, userIsPremium: boolean = false): boolean => {
    const feature = features.find(f => f.id === featureId);
    if (!feature || !feature.isEnabled) {
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