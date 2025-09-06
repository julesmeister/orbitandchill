/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

export interface AstrologicalEvent {
  id: string;
  userId: string;
  title: string;
  date: string;
  time: string;
  type: 'benefic' | 'challenging' | 'neutral';
  description: string;
  aspects: string[];
  planetaryPositions: string[];
  score: number;
  isGenerated: boolean;
  createdAt: string;
  priorities?: string[];
  chartData?: {
    planets?: Array<{
      name: string;
      retrograde?: boolean;
      [key: string]: any;
    }>;
    [key: string]: any;
  };
  isBookmarked?: boolean;
  timingMethod?: 'houses' | 'aspects' | 'electional' | 'combined';
  timeWindow?: {
    startTime: string;
    endTime: string;
    duration: string;
  };
  locationName?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  electionalData?: {
    mercuryStatus: 'direct' | 'retrograde';
    moonPhase: 'new' | 'waxing_crescent' | 'first_quarter' | 'waxing_gibbous' | 'full' | 'waning_gibbous' | 'last_quarter' | 'waning_crescent';
    beneficsAngular: boolean;
    maleficAspects: string[];
    prohibitions: string[];
    dignifiedPlanets: { planet: string; dignity: 'exaltation' | 'rulership' | 'detriment' | 'fall' | 'neutral' }[];
    electionalReady: boolean;
  };
}

export interface EventsState {
  events: Record<string, AstrologicalEvent>;
  generatedEvents: Record<string, AstrologicalEvent>;
  eventIds: string[];
  generatedEventIds: string[];
  
  cachedMonths: Map<string, { 
    eventIds: string[];
    loadedAt: number;
    tab: 'all' | 'bookmarked' | 'manual';
  }>;
  loadedMonths: Set<string>;
  showCalendar: boolean;
  currentDate: Date;
  selectedType: 'all' | 'benefic' | 'challenging' | 'neutral';
  selectedPriorities: string[];
  showAddForm: boolean;
  showTimingOptions: boolean;
  isGenerating: boolean;
  selectedTab: 'all' | 'bookmarked' | 'manual';
  hideChallengingDates: boolean;
  showCombosOnly: boolean;
  showAspects: boolean;
  showHousesOnly: boolean;
  showAspectsOnly: boolean;
  showElectionalOnly: boolean;
  isLoading: boolean;
  error: string | null;

  getAllEvents: () => AstrologicalEvent[];
  
  setEvents: (events: AstrologicalEvent[]) => void;
  loadEvents: (userId: string, tab?: string, filters?: any) => Promise<void>;
  loadMonthEvents: (userId: string, month: number, year: number) => Promise<void>;
  getMonthKey: (month: number, year: number) => string;
  addEvent: (event: AstrologicalEvent) => Promise<void>;
  addEvents: (events: AstrologicalEvent[]) => Promise<void>;
  addEventsLocal: (events: AstrologicalEvent[]) => void;
  updateEvent: (id: string, updates: Partial<AstrologicalEvent>) => Promise<void>;
  deleteEvent: (id: string, userId?: string) => Promise<void>;
  toggleBookmark: (id: string, userId?: string) => Promise<void>;
  setShowCalendar: (show: boolean) => void;
  setCurrentDate: (date: Date) => void;
  setSelectedType: (type: 'all' | 'benefic' | 'challenging' | 'neutral') => void;
  setSelectedPriorities: (priorities: string[]) => void;
  togglePriority: (priorityId: string) => void;
  setShowAddForm: (show: boolean) => void;
  setShowTimingOptions: (show: boolean) => void;
  setIsGenerating: (generating: boolean) => void;
  clearGeneratedEvents: (userId: string, targetDate?: Date) => Promise<void>;
  clearPersistedEvents: () => void;
  resetForm: () => void;
  setSelectedTab: (tab: 'all' | 'bookmarked' | 'manual') => void;
  setHideChallengingDates: (hide: boolean) => void;
  setShowCombosOnly: (show: boolean) => void;
  setShowAspects: (show: boolean) => void;
  setShowHousesOnly: (show: boolean) => void;
  setShowAspectsOnly: (show: boolean) => void;
  setShowElectionalOnly: (show: boolean) => void;
  setError: (error: string | null) => void;
  setIsLoading: (loading: boolean) => void;
}