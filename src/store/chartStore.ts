/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Chart tab types
export type ChartTab = 'chart' | 'interpretation' | 'transits' | 'matrix-destiny';

// Aspect filter types
export type AspectCategory = 'all' | 'personality' | 'relationships' | 'money' | 'career' | 'spirituality' | 'communication';
export type AspectType = 'all' | 'harmonious' | 'challenging' | 'neutral';

export interface AspectFilters {
  selectedCategory: AspectCategory;
  selectedType: AspectType;
  showFilters: boolean;
}

// Available interpretation sections
export interface InterpretationSection {
  id: string;
  name: string;
  description: string;
  icon: string;
  isVisible: boolean;
  order: number;
  isPremium: boolean;
}

// Default sections configuration
export const DEFAULT_SECTIONS: InterpretationSection[] = [
  {
    id: 'core-personality',
    name: 'Core Personality',
    description: 'Your sun, moon, and rising signs',
    icon: '🌟',
    isVisible: true,
    order: 1,
    isPremium: false
  },
  {
    id: 'stellium-analysis',
    name: 'Stellium Analysis',
    description: 'Groups of 3+ planets in signs or houses',
    icon: '✨',
    isVisible: true,
    order: 2,
    isPremium: true
  },
  {
    id: 'planetary-influences',
    name: 'Planetary Influences',
    description: 'How planets affect your personality',
    icon: '🪐',
    isVisible: true,
    order: 3,
    isPremium: false
  },
  {
    id: 'planetary-positions',
    name: 'Planetary Positions',
    description: 'Detailed planetary placements',
    icon: '📍',
    isVisible: true,
    order: 4,
    isPremium: true
  },
  {
    id: 'detailed-aspects',
    name: 'Major Aspects',
    description: 'Planetary relationships and energies',
    icon: '🔗',
    isVisible: true,
    order: 5,
    isPremium: true
  },
  {
    id: 'planetary-dignities',
    name: 'Planetary Dignities',
    description: 'Planet strength and weaknesses',
    icon: '👑',
    isVisible: true,
    order: 6,
    isPremium: true
  },
  {
    id: 'house-analysis',
    name: 'Houses Analysis',
    description: 'Life areas and themes',
    icon: '🏠',
    isVisible: true,
    order: 7,
    isPremium: true
  },
  {
    id: 'celestial-points',
    name: 'Celestial Points',
    description: 'Lilith, Chiron, Nodes & Part of Fortune',
    icon: '🌙',
    isVisible: true,
    order: 8,
    isPremium: false
  }
];

interface ChartStoreState {
  // Current active tab
  activeTab: ChartTab;
  
  // Interpretation sections configuration
  interpretationSections: InterpretationSection[];
  
  // Aspect filters
  aspectFilters: AspectFilters;
  
  // Sidebar preferences
  sidebarCollapsed: boolean;
  
  // Chart display preferences
  chartPreferences: {
    showAspectLines: boolean;
    showPlanetSymbols: boolean;
    showHouseNumbers: boolean;
    chartTheme: 'light' | 'dark' | 'classic';
    chartSize: 'small' | 'medium' | 'large';
  };
}

interface ChartStoreActions {
  // Tab management
  setActiveTab: (tab: ChartTab) => void;
  
  // Section management
  reorderSections: (newOrder: InterpretationSection[]) => void;
  toggleSectionVisibility: (sectionId: string) => void;
  resetSectionsToDefault: () => void;
  
  // Aspect filter management
  setAspectCategory: (category: AspectCategory) => void;
  setAspectType: (type: AspectType) => void;
  toggleAspectFilters: () => void;
  clearAspectFilters: () => void;
  
  // Sidebar management
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  // Chart preferences
  updateChartPreferences: (preferences: Partial<ChartStoreState['chartPreferences']>) => void;
  
  // Utility functions
  getVisibleSections: () => InterpretationSection[];
  getSectionByOrder: () => InterpretationSection[];
}

type ChartStore = ChartStoreState & ChartStoreActions;

export const useChartStore = create<ChartStore>()(
  persist(
    (set, get) => ({
      // Initial state
      activeTab: 'interpretation' as ChartTab,
      interpretationSections: DEFAULT_SECTIONS,
      aspectFilters: {
        selectedCategory: 'all',
        selectedType: 'all',
        showFilters: false
      },
      sidebarCollapsed: false,
      chartPreferences: {
        showAspectLines: true,
        showPlanetSymbols: true,
        showHouseNumbers: true,
        chartTheme: 'light',
        chartSize: 'medium'
      },

      // Tab management
      setActiveTab: (tab: ChartTab) => {
        set({ activeTab: tab });
      },

      // Section management
      reorderSections: (newOrder: InterpretationSection[]) => {
        // Update order property based on array index
        const orderedSections = newOrder.map((section, index) => ({
          ...section,
          order: index + 1
        }));
        
        set({ interpretationSections: orderedSections });
      },

      toggleSectionVisibility: (sectionId: string) => {
        const sections = get().interpretationSections;
        const updatedSections = sections.map(section =>
          section.id === sectionId
            ? { ...section, isVisible: !section.isVisible }
            : section
        );
        
        set({ interpretationSections: updatedSections });
      },

      resetSectionsToDefault: () => {
        set({ interpretationSections: DEFAULT_SECTIONS });
      },

      // Aspect filter management
      setAspectCategory: (category: AspectCategory) => {
        set(state => ({
          aspectFilters: { ...state.aspectFilters, selectedCategory: category }
        }));
      },

      setAspectType: (type: AspectType) => {
        set(state => ({
          aspectFilters: { ...state.aspectFilters, selectedType: type }
        }));
      },

      toggleAspectFilters: () => {
        set(state => ({
          aspectFilters: { ...state.aspectFilters, showFilters: !state.aspectFilters.showFilters }
        }));
      },

      clearAspectFilters: () => {
        set(state => ({
          aspectFilters: {
            ...state.aspectFilters,
            selectedCategory: 'all',
            selectedType: 'all'
          }
        }));
      },

      // Sidebar management
      toggleSidebar: () => {
        set(state => ({ sidebarCollapsed: !state.sidebarCollapsed }));
      },

      setSidebarCollapsed: (collapsed: boolean) => {
        set({ sidebarCollapsed: collapsed });
      },

      // Chart preferences
      updateChartPreferences: (preferences) => {
        set(state => ({
          chartPreferences: { ...state.chartPreferences, ...preferences }
        }));
      },

      // Utility functions
      getVisibleSections: () => {
        return get().interpretationSections
          .filter(section => section.isVisible)
          .sort((a, b) => a.order - b.order);
      },

      getSectionByOrder: () => {
        return get().interpretationSections
          .sort((a, b) => a.order - b.order);
      }
    }),
    {
      name: 'chart-store',
      version: 2,
      // Only persist user preferences, not the current active tab
      partialize: (state) => ({
        interpretationSections: state.interpretationSections,
        aspectFilters: state.aspectFilters,
        sidebarCollapsed: state.sidebarCollapsed,
        chartPreferences: state.chartPreferences,
        // Persist activeTab as well for better UX
        activeTab: state.activeTab
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Ensure sections have proper default values if missing
          const currentSections = state.interpretationSections || [];
          const mergedSections = DEFAULT_SECTIONS.map(defaultSection => {
            const existingSection = currentSections.find(s => s.id === defaultSection.id);
            return existingSection ? { ...defaultSection, ...existingSection } : defaultSection;
          });
          
          // Add any new sections that weren't in the stored config
          const mergedIds = mergedSections.map(s => s.id);
          const newSections = DEFAULT_SECTIONS.filter(s => !mergedIds.includes(s.id));
          
          // Deduplicate sections by ID and sort by order
          const allSections = [...mergedSections, ...newSections];
          const deduplicatedSections = allSections.filter((section, index, arr) => 
            arr.findIndex(s => s.id === section.id) === index
          );
          
          state.interpretationSections = deduplicatedSections
            .sort((a, b) => a.order - b.order);
            
          // In development, always default to interpretation tab to help with debugging
          if (process.env.NODE_ENV === 'development' && !state.activeTab) {
            state.activeTab = 'interpretation';
          }
        }
      }
    }
  )
);

// Utility hooks for common operations
export const useChartTab = () => {
  const activeTab = useChartStore(state => state.activeTab);
  const setActiveTab = useChartStore(state => state.setActiveTab);
  
  return { activeTab, setActiveTab };
};

export const useInterpretationSections = () => {
  const sections = useChartStore(state => state.interpretationSections);
  const getVisibleSections = useChartStore(state => state.getVisibleSections);
  const getSectionByOrder = useChartStore(state => state.getSectionByOrder);
  const reorderSections = useChartStore(state => state.reorderSections);
  const toggleSectionVisibility = useChartStore(state => state.toggleSectionVisibility);
  const resetSectionsToDefault = useChartStore(state => state.resetSectionsToDefault);
  
  return {
    sections,
    visibleSections: getVisibleSections(),
    orderedSections: getSectionByOrder(),
    reorderSections,
    toggleSectionVisibility,
    resetSectionsToDefault
  };
};

export const useChartPreferences = () => {
  const chartPreferences = useChartStore(state => state.chartPreferences);
  const updateChartPreferences = useChartStore(state => state.updateChartPreferences);
  
  return { chartPreferences, updateChartPreferences };
};

export const useChartSidebar = () => {
  const sidebarCollapsed = useChartStore(state => state.sidebarCollapsed);
  const toggleSidebar = useChartStore(state => state.toggleSidebar);
  const setSidebarCollapsed = useChartStore(state => state.setSidebarCollapsed);
  
  return { sidebarCollapsed, toggleSidebar, setSidebarCollapsed };
};

export const useAspectFilters = () => {
  const aspectFilters = useChartStore(state => state.aspectFilters);
  const setAspectCategory = useChartStore(state => state.setAspectCategory);
  const setAspectType = useChartStore(state => state.setAspectType);
  const toggleAspectFilters = useChartStore(state => state.toggleAspectFilters);
  const clearAspectFilters = useChartStore(state => state.clearAspectFilters);
  
  return {
    ...aspectFilters,
    setAspectCategory,
    setAspectType,
    toggleAspectFilters,
    clearAspectFilters,
    hasActiveFilters: aspectFilters.selectedCategory !== 'all' || aspectFilters.selectedType !== 'all'
  };
};