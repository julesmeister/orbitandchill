export interface TimingPriority {
  id: string;
  label: string;
  icon: string;
  description: string;
}

export interface PriorityCriteria {
  favorablePlanets: string[];
  favorableHouses: number[];
  favorableAspects: string[];
  challengingAspects: string[]; // Aspects to avoid or reduce score
  weight: Record<string, number>;
  comboCriteria?: ComboCriteria[];
  // Enhanced electional criteria
  prohibitions?: ElectionalProhibition[];
  requiredConditions?: RequiredCondition[];
  moonPhaseRequirements?: MoonPhaseRequirement;
}

export interface ElectionalProhibition {
  id: string;
  name: string;
  description: string;
  type: 'mercury_retrograde' | 'malefic_opposition' | 'full_moon_launch' | 'planetary_debility' | 'combustion';
  severity: 'critical' | 'major' | 'moderate'; // How severely this affects the timing
  penaltyMultiplier: number; // Score reduction multiplier
  checkFunction: (chartData: any, date: Date) => boolean;
}

export interface RequiredCondition {
  id: string;
  name: string;
  description: string;
  planet: string;
  condition: 'direct_motion' | 'dignified' | 'angular' | 'swift' | 'free_from_combustion';
  bonusMultiplier: number; // Score boost when condition is met
}

export interface MoonPhaseRequirement {
  preferredPhases: ('new' | 'waxing_crescent' | 'first_quarter' | 'waxing_gibbous' | 'full' | 'waning_gibbous' | 'last_quarter' | 'waning_crescent')[];
  avoidedPhases: ('new' | 'waxing_crescent' | 'first_quarter' | 'waxing_gibbous' | 'full' | 'waning_gibbous' | 'last_quarter' | 'waning_crescent')[];
  phaseMultiplier: Record<string, number>;
}

export interface ComboCriteria {
  id: string;
  name: string;
  description: string;
  planets: string[];
  house: number;
  bonus: number; // Extra points for this combo (negative for challenging combos)
  required?: boolean; // If true, timing is only valid if this combo exists
  type?: 'favorable' | 'challenging'; // Type of combo
}

export interface OptimalTimingResult {
  date: string;
  time: string;
  score: number;
  description: string;
  priorities: string[];
  chartData: any;
  timingMethod: 'houses' | 'aspects' | 'electional' | 'combined'; // Track which analysis method generated this result
  timeWindow?: {
    startTime: string;
    endTime: string;
    duration: string;
  };
}

export interface UseOptimalTimingOptions {
  latitude: number;
  longitude: number;
  currentDate: Date;
  selectedPriorities: string[];
  userId: string; // Required for saving events to database
  onEventsGenerated: (events: any[]) => void;
}