/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Horary chart astronomical calculation utilities
 * Extracted from InteractiveHoraryChart.tsx for better separation of concerns
 */

import { NatalChartData, HousePosition, SIGNS } from "./natalChart";

// Function to convert longitude to zodiac sign name
const getZodiacSignFromLongitude = (longitude: number): string => {
  return SIGNS[Math.floor(longitude / 30)];
};

// Import the determineHouse function to properly calculate house positions
const determineHouse = (planetLongitude: number, houses: HousePosition[]): number => {
  for (let i = 0; i < 12; i++) {
    const currentHouse = houses[i];
    const nextHouse = houses[(i + 1) % 12];
    
    const houseStart = currentHouse.cusp;
    const houseEnd = nextHouse.cusp;
    
    // Handle house that crosses 0 degrees
    if (houseEnd < houseStart) {
      if (planetLongitude >= houseStart || planetLongitude < houseEnd) {
        return currentHouse.number;
      }
    } else {
      if (planetLongitude >= houseStart && planetLongitude < houseEnd) {
        return currentHouse.number;
      }
    }
  }
  
  return 1; // Default to first house if not found
};

// Extended house interface for chart rendering
export interface HouseWithAngle extends HousePosition {
  angle: number;
}

// Helper function to get day of year
export const getDayOfYear = (date: Date): number => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

// Calculate lunar nodes using astronomical formulas
export const calculateLunarNodes = (date: Date) => {
  const yearsSince2000 = (date.getFullYear() - 2000) + (getDayOfYear(date) / 365.25);
  const nodeMeanLongitude = 125.04452 - 1934.136261 * yearsSince2000 / 365.25;
  const northNodeLongitude = ((nodeMeanLongitude % 360) + 360) % 360;
  const southNodeLongitude = (northNodeLongitude + 180) % 360;
  
  return { northNodeLongitude, southNodeLongitude };
};

// Calculate Part of Fortune
export const calculatePartOfFortune = (
  ascendant: number, 
  sunLongitude: number, 
  moonLongitude: number, 
  isDayChart: boolean
): number => {
  if (isDayChart) {
    return (ascendant + moonLongitude - sunLongitude + 360) % 360;
  } else {
    return (ascendant + sunLongitude - moonLongitude + 360) % 360;
  }
};

// Convert chart data to format with angle information
export const convertToNatalFormat = async (
  questionDate: Date,
  coordinates?: { lat: number; lng: number }
): Promise<NatalChartData> => {
  // Use provided coordinates or fall back to London
  const latitude = coordinates?.lat ?? 51.5074; // London fallback
  const longitude = coordinates?.lng ?? -0.1278; // London fallback
  
  // Debug logging to verify coordinate usage
    providedCoordinates: coordinates,
    finalLatitude: latitude,
    finalLongitude: longitude,
    usingFallback: !coordinates,
    questionDate: questionDate.toISOString()
  });
  
  const { calculatePlanetaryPositions } = await import('./natalChart');
  const realChartData = await calculatePlanetaryPositions(questionDate, latitude, longitude);
  
  const { northNodeLongitude, southNodeLongitude } = calculateLunarNodes(questionDate);
  
  const sun = realChartData.planets.find(p => p.name === 'sun');
  const moon = realChartData.planets.find(p => p.name === 'moon');
  const sunLongitude = sun?.longitude ?? 0;
  const moonLongitude = moon?.longitude ?? 0;
  const isDayChart = questionDate.getHours() >= 6 && questionDate.getHours() < 18;
  const partOfFortune = calculatePartOfFortune(
    realChartData.ascendant, 
    sunLongitude, 
    moonLongitude, 
    isDayChart
  );
  
  // Calculate proper house positions for North Node, South Node, and Part of Fortune
  const northNodeHouse = determineHouse(northNodeLongitude, realChartData.houses);
  const southNodeHouse = determineHouse(southNodeLongitude, realChartData.houses);
  const partOfFortuneHouse = determineHouse(partOfFortune, realChartData.houses);

  const enhancedPlanets = [
    ...realChartData.planets,
    {
      name: 'northNode',
      longitude: northNodeLongitude,
      sign: getZodiacSignFromLongitude(northNodeLongitude),
      house: northNodeHouse,
      retrograde: true
    },
    {
      name: 'southNode', 
      longitude: southNodeLongitude,
      sign: getZodiacSignFromLongitude(southNodeLongitude),
      house: southNodeHouse,
      retrograde: true
    },
    {
      name: 'partOfFortune',
      longitude: partOfFortune,
      sign: getZodiacSignFromLongitude(partOfFortune),
      house: partOfFortuneHouse,
      retrograde: false
    }
  ];
  
  return {
    ...realChartData,
    planets: enhancedPlanets
  };
};

// Process houses with angle information
export const processHousesWithAngles = (houses: HousePosition[]): HouseWithAngle[] => {
  return houses.map(house => ({
    ...house,
    angle: house.cusp
  }));
};

// Get planet color for rendering
export const getPlanetColor = (planetName: string): string => {
  const colors: Record<string, string> = {
    sun: "#FFD700",
    moon: "#C0C0C0", 
    mercury: "#FFA500",
    venus: "#90EE90",
    mars: "#FF4500",
    jupiter: "#9370DB",
    saturn: "#8B4513",
    uranus: "#00CED1",
    neptune: "#4169E1", 
    pluto: "#8B0000",
    north_node: "#32CD32",
    south_node: "#32CD32",
    part_of_fortune: "#FFD700"
  };
  
  return colors[planetName] || "#666666";
};

// Get planet symbol
export const getPlanetSymbol = (planetName: string): string => {
  const symbols: Record<string, string> = {
    sun: "☉",
    moon: "☽", 
    mercury: "☿",
    venus: "♀",
    mars: "♂",
    jupiter: "♃",
    saturn: "♄",
    uranus: "♅",
    neptune: "♆",
    pluto: "♇",
    north_node: "☊",
    south_node: "☋", 
    part_of_fortune: "⊕"
  };
  
  return symbols[planetName] || planetName.charAt(0).toUpperCase();
};

// Calculate angle for SVG positioning
export const calculateSVGAngle = (longitude: number): number => {
  return (-longitude - 90) * Math.PI / 180;
};

// Calculate position coordinates
export const calculatePosition = (angle: number, radius: number): { x: number; y: number } => {
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius
  };
};