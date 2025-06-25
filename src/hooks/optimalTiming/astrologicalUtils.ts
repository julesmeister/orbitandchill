import { PlanetPosition } from '../../utils/natalChart';

// Electional astrology utility functions
export const isRetrograde = (planetData: any): boolean => {
  // Check if planet is in retrograde motion (negative velocity or retrograde flag)
  return planetData.velocity < 0 || planetData.retrograde === true;
};

// Synchronous version that checks Mercury retrograde status from existing chart data
export const isMercuryRetrogradeFromChart = (chartData: any): boolean => {
  if (!chartData?.planets) return false;
  
  const mercury = chartData.planets.find((planet: any) => planet.name === 'mercury');
  return mercury?.retrograde || false;
};

// Async version that calculates Mercury retrograde status for a specific date
export const isMercuryRetrograde = async (date: Date): Promise<boolean> => {
  try {
    // Use the existing astronomical calculation to determine Mercury's actual retrograde status
    const { calculatePlanetaryPositions } = await import('../../utils/natalChart');
    
    // Calculate planetary positions for this date (using GMT coordinates as reference)
    const chartData = await calculatePlanetaryPositions(date, 0, 0);
    
    // Find Mercury in the planetary positions
    const mercury = chartData.planets.find(planet => planet.name === 'mercury');
    
    // Return Mercury's actual retrograde status
    return mercury?.retrograde || false;
  } catch (error) {
    console.error('Error calculating Mercury retrograde status:', error);
    
    // Fallback to known retrograde periods if calculation fails
    const retrogradePeriodsKnown = [
      { start: new Date('2024-04-01'), end: new Date('2024-04-25') },
      { start: new Date('2024-08-05'), end: new Date('2024-08-28') },
      { start: new Date('2024-11-25'), end: new Date('2024-12-15') },
      { start: new Date('2025-03-15'), end: new Date('2025-04-07') },
      { start: new Date('2025-07-18'), end: new Date('2025-08-11') },
      { start: new Date('2025-11-09'), end: new Date('2025-11-29') }
    ];
    
    return retrogradePeriodsKnown.some(period => 
      date >= period.start && date <= period.end
    );
  }
};

export const getMoonPhase = (date: Date): string => {
  // More accurate lunar phase calculation using known new moon reference
  // Reference: January 6, 2025 was a new moon at 23:56 UTC
  const referenceNewMoon = new Date('2025-01-06T23:56:00.000Z');
  const lunarCycleLength = 29.530588853; // Average lunar cycle in days
  
  // Calculate days since reference new moon
  const daysSinceReference = (date.getTime() - referenceNewMoon.getTime()) / (1000 * 60 * 60 * 24);
  
  // Calculate current position in lunar cycle
  let cyclePosition = daysSinceReference % lunarCycleLength;
  if (cyclePosition < 0) cyclePosition += lunarCycleLength; // Handle negative values
  
  // Calculate phase ratio (0 = new moon, 0.5 = full moon)
  const phaseRatio = cyclePosition / lunarCycleLength;
  
  // Determine phase based on position in cycle
  if (phaseRatio < 0.0625 || phaseRatio >= 0.9375) return 'new';
  if (phaseRatio < 0.1875) return 'waxing_crescent';
  if (phaseRatio < 0.3125) return 'first_quarter';
  if (phaseRatio < 0.4375) return 'waxing_gibbous';
  if (phaseRatio < 0.5625) return 'full';
  if (phaseRatio < 0.6875) return 'waning_gibbous';
  if (phaseRatio < 0.8125) return 'last_quarter';
  return 'waning_crescent';
};

export const isCombust = (planetData: PlanetPosition, sunData: PlanetPosition): boolean => {
  // Check if planet is within 8 degrees of the Sun (combustion)
  const angleDiff = Math.abs(planetData.longitude - sunData.longitude);
  return angleDiff <= 8 || angleDiff >= 352; // Account for 360-degree wraparound
};

export const getHouseSuffix = (house: number): string => {
  if (house === 1 || house === 21) return 'st';
  if (house === 2 || house === 22) return 'nd';
  if (house === 3 || house === 23) return 'rd';
  return 'th';
};

export const checkBeneficsAngular = (chartData: any): boolean => {
  // Check if Venus or Jupiter are in angular houses (1, 4, 7, 10)
  const angularHouses = [1, 4, 7, 10];
  const benefics = ['Venus', 'Jupiter'];
  
  return chartData.planets.some((planet: any) => 
    benefics.includes(planet.name) && angularHouses.includes(planet.house)
  );
};

export const getMaleficAspects = (chartData: any): string[] => {
  // Find challenging aspects involving Mars, Saturn, or Pluto
  const malefics = ['Mars', 'Saturn', 'Pluto'];
  const challengingAspects = ['square', 'opposition'];
  
  return chartData.aspects
    .filter((aspect: any) => 
      challengingAspects.includes(aspect.aspect) &&
      (malefics.includes(aspect.planet1) || malefics.includes(aspect.planet2))
    )
    .map((aspect: any) => `${aspect.planet1} ${aspect.aspect} ${aspect.planet2}`);
};

// Calculate time window based on astrological orbs and planetary movement speeds
export const calculateTimeWindow = (optimalTime: string, score: number, eventType: 'benefic' | 'challenging' | 'neutral'): {
  startTime: string;
  endTime: string;
  duration: string;
} => {
  const [hours, minutes] = optimalTime.split(':').map(Number);
  
  // Base window duration based on score and event type
  let baseWindowHours = 2; // Default 2 hours
  
  // Adjust window based on score - higher scores get longer windows
  if (score >= 8) {
    baseWindowHours = 4; // Exceptional timing lasts longer
  } else if (score >= 6) {
    baseWindowHours = 3; // Good timing
  } else if (score >= 4) {
    baseWindowHours = 2.5; // Average timing
  } else {
    baseWindowHours = 1.5; // Challenging timing has shorter effective window
  }
  
  // Adjust for event type
  if (eventType === 'benefic') {
    baseWindowHours *= 1.2; // Benefic events have longer effective windows
  } else if (eventType === 'challenging') {
    baseWindowHours *= 0.8; // Challenging events have shorter windows
  }
  
  // Calculate start and end times
  const halfWindow = baseWindowHours / 2;
  const startMinutes = Math.max(0, (hours * 60 + minutes) - (halfWindow * 60));
  const endMinutes = Math.min(24 * 60 - 1, (hours * 60 + minutes) + (halfWindow * 60));
  
  // Convert back to time format
  const startHours = Math.floor(startMinutes / 60);
  const startMins = Math.floor(startMinutes % 60);
  const endHours = Math.floor(endMinutes / 60);
  const endMins = Math.floor(endMinutes % 60);
  
  const formatTime = (h: number, m: number) => 
    `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  
  const startTime = formatTime(startHours, startMins);
  const endTime = formatTime(endHours, endMins);
  
  // Calculate duration in human-readable format
  const totalMinutes = endMinutes - startMinutes;
  const durationHours = Math.floor(totalMinutes / 60);
  const durationMins = totalMinutes % 60;
  
  let duration = '';
  if (durationHours > 0) {
    duration += `${durationHours} hour${durationHours !== 1 ? 's' : ''}`;
    if (durationMins > 0) {
      duration += ` ${durationMins} minute${durationMins !== 1 ? 's' : ''}`;
    }
  } else {
    duration = `${durationMins} minute${durationMins !== 1 ? 's' : ''}`;
  }
  
  return {
    startTime,
    endTime,
    duration
  };
};

// Calculate time range between two times for consolidating duplicate entries
export const calculateTimeRange = (time1: string, time2: string): {
  startTime: string;
  endTime: string;
  duration: string;
} => {
  const parseTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes; // Convert to minutes since midnight
  };

  const formatTime = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const minutes1 = parseTime(time1);
  const minutes2 = parseTime(time2);
  
  const startMinutes = Math.min(minutes1, minutes2);
  const endMinutes = Math.max(minutes1, minutes2);
  
  // Ensure minimum window of 1 hour for consolidated entries
  const minimumWindow = 60; // 1 hour in minutes
  const actualWindow = endMinutes - startMinutes;
  
  let adjustedStartMinutes = startMinutes;
  let adjustedEndMinutes = endMinutes;
  
  if (actualWindow < minimumWindow) {
    // Expand window to minimum duration, centered around the range
    const expansion = (minimumWindow - actualWindow) / 2;
    adjustedStartMinutes = Math.max(0, startMinutes - expansion);
    adjustedEndMinutes = Math.min(24 * 60 - 1, endMinutes + expansion);
  }
  
  const startTime = formatTime(adjustedStartMinutes);
  const endTime = formatTime(adjustedEndMinutes);
  
  // Calculate duration
  const totalMinutes = adjustedEndMinutes - adjustedStartMinutes;
  const durationHours = Math.floor(totalMinutes / 60);
  const durationMins = totalMinutes % 60;
  
  let duration = '';
  if (durationHours > 0) {
    duration += `${durationHours} hour${durationHours !== 1 ? 's' : ''}`;
    if (durationMins > 0) {
      duration += ` ${durationMins} minute${durationMins !== 1 ? 's' : ''}`;
    }
  } else {
    duration = `${durationMins} minute${durationMins !== 1 ? 's' : ''}`;
  }
  
  return {
    startTime,
    endTime,
    duration
  };
};