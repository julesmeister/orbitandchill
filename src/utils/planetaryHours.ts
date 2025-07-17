/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Planetary Hours Calculator using astronomy-engine
 * 
 * Calculates accurate planetary hours based on actual sunrise/sunset times
 * for a given location and date.
 * 
 * Updated: Fixed SearchDirection import error - using numeric directions
 */

import * as Astronomy from 'astronomy-engine';

export interface PlanetaryHour {
  hour: number;
  planet: string;
  symbol: string;
  color: string;
  influence: string;
  timeRange: string;
  isCurrent: boolean;
  startTime: Date;
  endTime: Date;
  isDayHour: boolean;
}

export interface PlanetaryHoursData {
  hours: PlanetaryHour[];
  sunrise: Date;
  sunset: Date;
  currentHour: PlanetaryHour | null;
  nextHour: PlanetaryHour | null;
  dayRuler: string;
  location: {
    lat: number;
    lon: number;
    name?: string;
  };
  date: Date;
}

const PLANETARY_RULERS = [
  { name: 'Sun', symbol: '☉', color: '#FFD700', influence: 'Leadership, success, vitality' },
  { name: 'Moon', symbol: '☽', color: '#C0C0C0', influence: 'Intuition, emotions, dreams' },
  { name: 'Mars', symbol: '♂', color: '#FF4500', influence: 'Action, courage, energy' },
  { name: 'Mercury', symbol: '☿', color: '#00CED1', influence: 'Communication, learning, trade' },
  { name: 'Jupiter', symbol: '♃', color: '#FF8C00', influence: 'Expansion, wisdom, luck' },
  { name: 'Venus', symbol: '♀', color: '#FF69B4', influence: 'Love, beauty, harmony' },
  { name: 'Saturn', symbol: '♄', color: '#8B4513', influence: 'Structure, discipline, responsibility' }
];

// Chaldean order for planetary hours
const CHALDEAN_ORDER = ['Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars'];

// Days of the week rulers (0 = Sunday, 1 = Monday, etc.)
const DAY_RULERS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];

/**
 * Calculate sunrise and sunset times for a given location and date
 */
function calculateSunriseSunset(lat: number, lon: number, date: Date): { sunrise: Date, sunset: Date } {
  const observer = new Astronomy.Observer(lat, lon, 0);
  
  // Search for sunrise starting from the beginning of the day
  const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
  const sunrise = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, 1, startOfDay, 2);
  
  if (!sunrise) {
    throw new Error('Unable to calculate sunrise for the given location and date');
  }
  
  // Search for sunset starting from midday to ensure we get the correct sunset
  const midday = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
  const sunset = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, -1, midday, 2);
  
  if (!sunset) {
    throw new Error('Unable to calculate sunset for the given location and date');
  }
  
  return {
    sunrise: sunrise.date,
    sunset: sunset.date
  };
}

/**
 * Calculate planetary hours for a given location and date
 */
export function calculatePlanetaryHours(
  lat: number, 
  lon: number, 
  date: Date = new Date(),
  locationName?: string
): PlanetaryHoursData {
  const { sunrise, sunset } = calculateSunriseSunset(lat, lon, date);
  
  // Calculate day and night lengths
  const dayLength = sunset.getTime() - sunrise.getTime();
  const dayHourLength = dayLength / 12;
  
  // Validate day length is positive
  if (dayLength <= 0) {
    throw new Error(`Invalid day length: ${dayLength}ms. Sunrise: ${sunrise}, Sunset: ${sunset}`);
  }
  
  // Calculate next day's sunrise for night length
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);
  const { sunrise: nextSunrise } = calculateSunriseSunset(lat, lon, nextDay);
  
  const nightLength = nextSunrise.getTime() - sunset.getTime();
  const nightHourLength = nightLength / 12;
  
  // Get the day ruler based on day of week
  const dayOfWeek = date.getDay();
  const dayRuler = DAY_RULERS[dayOfWeek];
  
  
  // Find starting position in Chaldean order
  const startIndex = CHALDEAN_ORDER.indexOf(dayRuler);
  
  const hours: PlanetaryHour[] = [];
  const now = new Date();
  
  // Calculate day hours (sunrise to sunset)
  for (let i = 0; i < 12; i++) {
    const planetIndex = (startIndex + i) % 7;
    const planet = CHALDEAN_ORDER[planetIndex];
    const planetData = PLANETARY_RULERS.find(p => p.name === planet)!;
    
    const startTime = new Date(sunrise.getTime() + (i * dayHourLength));
    const endTime = new Date(sunrise.getTime() + ((i + 1) * dayHourLength));
    
    const isCurrent = now >= startTime && now < endTime;
    
    
    hours.push({
      hour: i + 1,
      planet: planet,
      symbol: planetData.symbol,
      color: planetData.color,
      influence: planetData.influence,
      timeRange: `${formatTime(startTime)} - ${formatTime(endTime)}`,
      isCurrent,
      startTime,
      endTime,
      isDayHour: true
    });
  }
  
  // Calculate night hours (sunset to next sunrise)
  for (let i = 0; i < 12; i++) {
    const planetIndex = (startIndex + 12 + i) % 7;
    const planet = CHALDEAN_ORDER[planetIndex];
    const planetData = PLANETARY_RULERS.find(p => p.name === planet)!;
    
    const startTime = new Date(sunset.getTime() + (i * nightHourLength));
    const endTime = new Date(sunset.getTime() + ((i + 1) * nightHourLength));
    
    const isCurrent = now >= startTime && now < endTime;
    
    hours.push({
      hour: i + 13,
      planet: planet,
      symbol: planetData.symbol,
      color: planetData.color,
      influence: planetData.influence,
      timeRange: `${formatTime(startTime)} - ${formatTime(endTime)}`,
      isCurrent,
      startTime,
      endTime,
      isDayHour: false
    });
  }
  
  // Find current and next hour
  const currentHour = hours.find(h => h.isCurrent) || null;
  const currentIndex = currentHour ? hours.indexOf(currentHour) : -1;
  const nextHour = currentIndex !== -1 && currentIndex < hours.length - 1 
    ? hours[currentIndex + 1] 
    : hours[0]; // Wrap to first hour of next day
  
  return {
    hours,
    sunrise,
    sunset,
    currentHour,
    nextHour,
    dayRuler,
    location: {
      lat,
      lon,
      name: locationName
    },
    date
  };
}

/**
 * Format time for display
 */
function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: false
  });
}

/**
 * Get the planetary ruler for a given day of the week
 */
export function getDayRuler(date: Date): string {
  return DAY_RULERS[date.getDay()];
}

/**
 * Get planet data by name
 */
export function getPlanetData(planetName: string) {
  return PLANETARY_RULERS.find(p => p.name === planetName);
}

/**
 * Calculate time until next planetary hour
 */
export function getTimeUntilNextHour(currentHour: PlanetaryHour | null): string {
  if (!currentHour) return '';
  
  const now = new Date();
  const timeLeft = currentHour.endTime.getTime() - now.getTime();
  
  if (timeLeft <= 0) return '00:00';
  
  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}