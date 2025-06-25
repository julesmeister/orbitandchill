/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useCallback } from 'react';

interface MoonPhaseInfo {
  phase: string;
  illumination: number;
  nextNewMoon: Date;
  nextFullMoon: Date;
  waxingPeriod: { start: Date; end: Date } | null;
}

interface MercuryInfo {
  isRetrograde: boolean;
  nextDirect: Date | null;
  nextRetrograde: Date | null;
  stationaryPeriod: { start: Date; end: Date } | null;
}

interface AstronomicalContext {
  currentMonth: Date;
  moonPhase: MoonPhaseInfo;
  mercury: MercuryInfo;
  isLoading: boolean;
}

export function useAstronomicalContext(currentDate: Date = new Date()) {
  const [context, setContext] = useState<AstronomicalContext>({
    currentMonth: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
    moonPhase: {
      phase: 'unknown',
      illumination: 0,
      nextNewMoon: new Date(),
      nextFullMoon: new Date(),
      waxingPeriod: null
    },
    mercury: {
      isRetrograde: false,
      nextDirect: null,
      nextRetrograde: null,
      stationaryPeriod: null
    },
    isLoading: true
  });

  // Calculate lunar phase based on simplified algorithm
  const calculateMoonPhase = useCallback((date: Date) => {
    // Simplified moon phase calculation
    // In a real implementation, this would use astronomy libraries or APIs
    const knownNewMoon = new Date('2024-01-11'); // A known new moon date
    const lunarCycle = 29.53059; // Average lunar cycle in days
    
    const timeDiff = date.getTime() - knownNewMoon.getTime();
    const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
    const cyclePosition = (daysDiff % lunarCycle + lunarCycle) % lunarCycle;
    
    let phase: string;
    let illumination: number;
    
    if (cyclePosition < 1) {
      phase = 'new';
      illumination = 0;
    } else if (cyclePosition < 7.38) {
      phase = 'waxing_crescent';
      illumination = cyclePosition / 7.38 * 50;
    } else if (cyclePosition < 8.38) {
      phase = 'first_quarter';
      illumination = 50;
    } else if (cyclePosition < 14.76) {
      phase = 'waxing_gibbous';
      illumination = 50 + ((cyclePosition - 8.38) / 6.38) * 50;
    } else if (cyclePosition < 15.76) {
      phase = 'full';
      illumination = 100;
    } else if (cyclePosition < 22.14) {
      phase = 'waning_gibbous';
      illumination = 100 - ((cyclePosition - 15.76) / 6.38) * 50;
    } else if (cyclePosition < 23.14) {
      phase = 'last_quarter';
      illumination = 50;
    } else {
      phase = 'waning_crescent';
      illumination = 50 - ((cyclePosition - 23.14) / 6.39) * 50;
    }

    // Calculate next new moon and full moon
    const daysToNextNew = lunarCycle - cyclePosition;
    const daysToNextFull = cyclePosition < 14.76 ? 14.76 - cyclePosition : lunarCycle - cyclePosition + 14.76;
    
    const nextNewMoon = new Date(date.getTime() + daysToNextNew * 24 * 60 * 60 * 1000);
    const nextFullMoon = new Date(date.getTime() + daysToNextFull * 24 * 60 * 60 * 1000);

    // Calculate waxing period for the current month
    let waxingPeriod = null;
    if (phase === 'new' || phase === 'waxing_crescent' || phase === 'first_quarter' || phase === 'waxing_gibbous') {
      // Currently in waxing phase
      const currentWaxingStart = new Date(date.getTime() - cyclePosition * 24 * 60 * 60 * 1000);
      const currentWaxingEnd = new Date(currentWaxingStart.getTime() + 14.76 * 24 * 60 * 60 * 1000);
      waxingPeriod = { start: currentWaxingStart, end: currentWaxingEnd };
    } else {
      // In waning phase, next waxing starts at next new moon
      waxingPeriod = { 
        start: nextNewMoon, 
        end: new Date(nextNewMoon.getTime() + 14.76 * 24 * 60 * 60 * 1000) 
      };
    }

    return {
      phase,
      illumination: Math.round(illumination),
      nextNewMoon,
      nextFullMoon,
      waxingPeriod
    };
  }, []);

  // Calculate Mercury retrograde periods (simplified)
  const calculateMercuryInfo = useCallback((date: Date) => {
    // Simplified Mercury retrograde calculation
    // In reality, this would use ephemeris data or astronomy APIs
    
    // Known Mercury retrograde periods for 2024-2025 (approximate)
    const retrogradePeriodsKnown = [
      { start: new Date('2024-04-01'), end: new Date('2024-04-25') },
      { start: new Date('2024-08-05'), end: new Date('2024-08-28') },
      { start: new Date('2024-11-25'), end: new Date('2024-12-15') },
      { start: new Date('2025-03-15'), end: new Date('2025-04-07') },
      { start: new Date('2025-07-18'), end: new Date('2025-08-11') },
      { start: new Date('2025-11-09'), end: new Date('2025-11-29') }
    ];

    // Check if currently in retrograde
    const currentRetrograde = retrogradePeriodsKnown.find(period => 
      date >= period.start && date <= period.end
    );

    const isRetrograde = !!currentRetrograde;

    // Find next direct and retrograde dates
    let nextDirect = null;
    let nextRetrograde = null;

    if (isRetrograde && currentRetrograde) {
      nextDirect = currentRetrograde.end;
      // Find next retrograde after current one ends
      const futureRetrogrades = retrogradePeriodsKnown.filter(period => 
        period.start > currentRetrograde.end
      );
      nextRetrograde = futureRetrogrades.length > 0 ? futureRetrogrades[0].start : null;
    } else {
      // Find next retrograde
      const futureRetrogrades = retrogradePeriodsKnown.filter(period => 
        period.start > date
      );
      nextRetrograde = futureRetrogrades.length > 0 ? futureRetrogrades[0].start : null;
      
      // Next direct would be end of next retrograde
      if (futureRetrogrades.length > 0) {
        nextDirect = futureRetrogrades[0].end;
      }
    }

    return {
      isRetrograde,
      nextDirect,
      nextRetrograde,
      stationaryPeriod: currentRetrograde || null
    };
  }, []);

  // Update context when currentDate changes
  useEffect(() => {
    setContext(prev => ({ ...prev, isLoading: true }));

    // Simulate async calculation (in real app, this might be API calls)
    const updateContext = async () => {
      const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const moonPhase = calculateMoonPhase(currentDate);
      const mercury = calculateMercuryInfo(currentDate);

      setContext({
        currentMonth: monthStart,
        moonPhase,
        mercury,
        isLoading: false
      });
    };

    updateContext();
  }, [currentDate, calculateMoonPhase, calculateMercuryInfo]);

  // Helper function to get user-friendly messages
  const getContextualMessage = useCallback((filterType: string, filterValue: string) => {
    if (context.isLoading) {
      return `Analyzing ${filterType} for ${filterValue}...`;
    }

    const monthName = context.currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    switch (filterType) {
      case 'Mercury':
        if (filterValue === 'Direct Mercury') {
          if (context.mercury.isRetrograde) {
            const directDate = context.mercury.nextDirect?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            return `Filtering for Direct Mercury - currently retrograde until ${directDate}. Perfect choice for avoiding communication issues!`;
          } else {
            const retrogradeDate = context.mercury.nextRetrograde?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            return `Filtering for Direct Mercury - excellent timing! Mercury goes retrograde ${retrogradeDate}`;
          }
        } else if (filterValue === 'All Mercury') {
          if (context.mercury.isRetrograde) {
            return `Showing all Mercury periods - currently in retrograde until ${context.mercury.nextDirect?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}. Expect communication challenges`;
          } else {
            return `Showing all Mercury periods - currently direct. Next retrograde begins ${context.mercury.nextRetrograde?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
          }
        }
        break;

      case 'Moon Phase':
        if (filterValue === 'Waxing Moon') {
          if (context.moonPhase.waxingPeriod) {
            const isCurrentlyWaxing = context.moonPhase.phase.includes('waxing') || context.moonPhase.phase === 'new';
            if (isCurrentlyWaxing) {
              const waxingEnd = context.moonPhase.waxingPeriod.end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              return `Filtering for Waxing Moon - perfect timing for growth! Current waxing phase ends ${waxingEnd}`;
            } else {
              const nextWaxingStart = context.moonPhase.waxingPeriod.start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              return `Filtering for Waxing Moon - next waxing phase begins ${nextWaxingStart}. Ideal for new beginnings!`;
            }
          }
        } else if (filterValue === 'All Phases') {
          const currentPhase = context.moonPhase.phase.replace('_', ' ');
          const nextNew = context.moonPhase.nextNewMoon.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          return `Showing all moon phases - currently ${currentPhase}. Next new moon ${nextNew} (best for new beginnings)`;
        }
        break;

      case 'Traditional':
        if (filterValue === 'Ready') {
          if (context.mercury.isRetrograde) {
            return `Filtering for electional-ready dates - Mercury retrograde reduces options this month. Best timing after direct motion`;
          } else if (context.moonPhase.phase === 'full') {
            return `Filtering for electional-ready dates - avoiding full moon period. Waxing phases preferred for new ventures`;
          } else {
            return `Filtering for electional-ready dates - good conditions this month for traditional timing standards`;
          }
        }
        break;
    }

    return `Now filtering for ${filterType}: ${filterValue}`;
  }, [context]);

  return {
    context,
    getContextualMessage,
    isLoading: context.isLoading
  };
}