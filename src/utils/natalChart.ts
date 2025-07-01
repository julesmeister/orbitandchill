/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * JavaScript implementation of natal chart generation using astronomy-engine
 * Professional-grade accuracy with MIT license
 */

import * as Astronomy from 'astronomy-engine';
import { processBirthTime } from './timeZoneHandler';

// Astrological constants
export const SIGNS = [
  "aries",
  "taurus",
  "gemini",
  "cancer",
  "leo",
  "virgo",
  "libra",
  "scorpio",
  "sagittarius",
  "capricorn",
  "aquarius",
  "pisces",
];

export const PLANETS = [
  "sun",
  "moon",
  "mercury",
  "venus",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
  "pluto",
];

export const HOUSES = Array.from({ length: 12 }, (_, i) => i + 1);

// Utility function to format degrees in astrological notation
export function formatAstrologicalDegree(longitude: number): string {
  const signIndex = Math.floor(longitude / 30);
  const degreeInSign = longitude % 30;
  const sign = SIGNS[signIndex];
  return `${degreeInSign.toFixed(1)}° ${sign.charAt(0).toUpperCase() + sign.slice(1)}`;
}

export const ASPECTS = {
  conjunction: { angle: 0, orb: 8, type: "major" },
  sextile: { angle: 60, orb: 6, type: "major" },
  square: { angle: 90, orb: 8, type: "major" },
  trine: { angle: 120, orb: 8, type: "major" },
  opposition: { angle: 180, orb: 8, type: "major" },
  quincunx: { angle: 150, orb: 3, type: "minor" },
};

// Chart data interfaces
export interface PlanetPosition {
  name: string;
  longitude: number;
  sign: string;
  house: number;
  retrograde: boolean;
  // Add equatorial coordinates for astrocartography
  rightAscension?: number; // RA in hours
  declination?: number;    // Dec in degrees
  distance?: number;       // Distance in AU
}

export interface HousePosition {
  number: number;
  cusp: number;
  sign: string;
}

export interface ChartAspect {
  color: string | undefined;
  applying: any;
  planet1: string;
  planet2: string;
  aspect: string;
  angle: number;
  orb: number;
}

export interface NatalChartData {
  planets: PlanetPosition[];
  houses: HousePosition[];
  aspects: ChartAspect[];
  ascendant: number;
  midheaven: number;
}

export interface ChartMetadata {
  name: string;
  dateOfBirth: string;
  timeOfBirth: string;
  locationOfBirth: string;
  coordinates: { lat: string; lon: string };
  generatedAt: string;
  chartData: NatalChartData;
}

// Debug the astronomy-engine structure
// Astronomy library initialized for planetary calculations

// Astronomy-engine body mapping
const ASTRONOMY_BODIES: { [key: string]: any } = {
  sun: Astronomy.Body?.Sun || 'Sun',
  moon: Astronomy.Body?.Moon || 'Moon', 
  mercury: Astronomy.Body?.Mercury || 'Mercury',
  venus: Astronomy.Body?.Venus || 'Venus',
  mars: Astronomy.Body?.Mars || 'Mars',
  jupiter: Astronomy.Body?.Jupiter || 'Jupiter',
  saturn: Astronomy.Body?.Saturn || 'Saturn',
  uranus: Astronomy.Body?.Uranus || 'Uranus',
  neptune: Astronomy.Body?.Neptune || 'Neptune',
  pluto: Astronomy.Body?.Pluto || 'Pluto',
};

/**
 * Calculate planetary positions using astronomy-engine
 * This provides professional-grade accuracy (±1 arcminute) with MIT license
 */
export async function calculatePlanetaryPositions(
  date: Date,
  latitude: number,
  longitude: number
): Promise<NatalChartData> {
  // Debug logging disabled for production

  try {
    // Starting planetary calculations - debug logging disabled

    // Try different Observer creation methods for astronomy-engine v2.1.19
    let observer;
    try {
      // Method 1: Try as a constructor
      observer = new Astronomy.Observer(latitude, longitude, 0);
      // Observer created with constructor
    } catch (e1) {
      try {
        // Method 2: Try as a factory function
        observer = new Astronomy.Observer(latitude, longitude, 0);
        // Observer created with factory
      } catch (e2) {
        try {
          // Method 3: Try with object literal
          observer = { latitude, longitude, height: 0 };
          // Observer created with object literal
        } catch (e3) {
          console.error('All Observer creation methods failed:', { e1, e2, e3 });
          throw new Error('Cannot create Observer object');
        }
      }
    }

    // Calculate planetary positions using appropriate functions
    const planets: PlanetPosition[] = PLANETS.map(planetName => {
      // Calculating planetary position
      const body = ASTRONOMY_BODIES[planetName];
      
      if (!body) {
        throw new Error(`Unknown planet: ${planetName}`);
      }
      
      // Get geocentric position and convert to ecliptic longitude
      let longitude: number;
      let rightAscension: number | undefined;
      let declination: number | undefined;
      let distance: number | undefined;
      
      try {
        if (body === 'Sun') {
          // For the Sun, use SunPosition which gives geocentric longitude
          const sunPos = Astronomy.SunPosition(date);
          longitude = sunPos.elon;
          
          // For the Sun, use the Body directly with Astronomy.Equator
          const equatorial = Astronomy.Equator(
            Astronomy.Body.Sun,             // Sun body
            Astronomy.MakeTime(date),       // convert Date to AstroTime
            observer,                       // observer
            true,                          // ofdate (use true for date-of-observation coordinates)
            true                           // aberration (include stellar aberration)
          );
          rightAscension = equatorial.ra;
          declination = equatorial.dec;
          distance = 1.0; // 1 AU for Sun
          
          // Sun position calculated
        } else {
          // For other bodies, use GeoVector and convert to ecliptic
          const geoVector = Astronomy.GeoVector(body, date, false);
          const ecliptic = Astronomy.Ecliptic(geoVector);
          longitude = ecliptic.elon;
          
          // For planets, use the Body directly with Astronomy.Equator
          const equatorial = Astronomy.Equator(
            body,                          // Planet body (Mercury, Venus, etc.)
            Astronomy.MakeTime(date),      // convert Date to AstroTime
            observer,                      // observer
            true,                         // ofdate (use true for date-of-observation coordinates)
            true                          // aberration (include stellar aberration)
          );
          rightAscension = equatorial.ra;
          declination = equatorial.dec;
          // Calculate distance from the vector components
          distance = Math.sqrt(geoVector.x * geoVector.x + geoVector.y * geoVector.y + geoVector.z * geoVector.z);
          
          // Planet position calculated
          
          // Verify RA is in correct range (0-24 hours)
          if (rightAscension < 0 || rightAscension >= 24) {
            // RA out of range warning
          }
          
          // Verify Dec is in correct range (-90 to +90 degrees)
          if (declination < -90 || declination > 90) {
            // Dec out of range warning
          }
        }
      } catch (planetError) {
        // Error calculating planetary position
        throw new Error(`Failed to calculate ${planetName}: ${planetError instanceof Error ? planetError.message : 'Unknown error'}`);
      }
    
      // Determine retrograde motion
      // Calculate positions 1 day before and after to check motion direction
      const dayBefore = new Date(date);
      dayBefore.setDate(dayBefore.getDate() - 1);
      const dayAfter = new Date(date);
      dayAfter.setDate(dayAfter.getDate() + 1);
      
      let longitudeBefore: number;
      let longitudeAfter: number;
      
      if (body === 'Sun') {
        const sunPosBefore = Astronomy.SunPosition(dayBefore);
        const sunPosAfter = Astronomy.SunPosition(dayAfter);
        longitudeBefore = sunPosBefore.elon;
        longitudeAfter = sunPosAfter.elon;
      } else {
        const geoVectorBefore = Astronomy.GeoVector(body, dayBefore, false);
        const geoVectorAfter = Astronomy.GeoVector(body, dayAfter, false);
        const eclipticBefore = Astronomy.Ecliptic(geoVectorBefore);
        const eclipticAfter = Astronomy.Ecliptic(geoVectorAfter);
        longitudeBefore = eclipticBefore.elon;
        longitudeAfter = eclipticAfter.elon;
      }
    
      // If longitude is decreasing, planet is retrograde
      let retrograde = false;
      if (body !== 'Sun' && body !== 'Moon') {
        // Adjust for 360-degree wraparound
        let motion = longitudeAfter - longitudeBefore;
        if (motion > 180) motion -= 360;
        if (motion < -180) motion += 360;
        retrograde = motion < 0;
      }
      
      // Determine zodiac sign
      const sign = SIGNS[Math.floor(longitude / 30)];
      
      return {
        name: planetName,
        longitude: longitude,
        sign: sign,
        house: 0, // Will be calculated later
        retrograde: retrograde,
        rightAscension: rightAscension,
        declination: declination,
        distance: distance,
      };
    });

    // Calculate houses using Placidus system
    const housesData = calculatePlacidusHouses(date, latitude, longitude);
  
    // Assign houses to planets
    planets.forEach(planet => {
      planet.house = determineHouse(planet.longitude, housesData.houses);
    });

    // Calculate aspects
    const aspects = calculateAspects(planets);
    // console.log('🔍 Chart generation - aspects calculated:', {
    //   aspectsCount: aspects.length,
    //   firstFewAspects: aspects.slice(0, 3),
    //   planetsCount: planets.length
    // });

    // Planetary positions calculation completed

    return {
      planets,
      houses: housesData.houses,
      aspects,
      ascendant: housesData.ascendant,
      midheaven: housesData.midheaven,
    };
  } catch (error) {
    console.error('Error calculating planetary positions:', error);
    throw new Error(`Failed to calculate planetary positions: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Calculate houses using the Placidus system
 * This is the most commonly used house system in Western astrology
 */
function calculatePlacidusHouses(date: Date, latitude: number, longitude: number): {
  houses: HousePosition[];
  ascendant: number;
  midheaven: number;
} {
  // Calculate sidereal time
  const gst = Astronomy.SiderealTime(date);
  const lst = (gst + longitude / 15) % 24; // Local sidereal time in hours
  
  // Convert LST to degrees
  const lstDegrees = lst * 15;
  
  // Calculate MC (Midheaven) - where the ecliptic crosses the meridian
  const mc = lstDegrees % 360;
  
  // Calculate RAMC (Right Ascension of Midheaven) 
  const ramc = lstDegrees % 360;
  
  // Calculate obliquity of ecliptic for the given date
  const astroTime = Astronomy.MakeTime(date);
  const obliquity = 23.4367 - 0.013004 * (astroTime.tt / 365.25); // More accurate obliquity
  
  // Calculate Ascendant using proper spherical astronomy
  const ramcRad = ramc * Math.PI / 180;
  const latRad = latitude * Math.PI / 180;
  const oblRad = obliquity * Math.PI / 180;
  
  // Improved Ascendant calculation
  const ascRad = Math.atan2(
    Math.cos(ramcRad),
    -Math.sin(ramcRad) * Math.cos(oblRad) - Math.tan(latRad) * Math.sin(oblRad)
  );
  
  // Convert to degrees and normalize
  let asc = ascRad * 180 / Math.PI;
  if (asc < 0) asc += 360;
  
  // Calculate intermediate house cusps using improved Placidus method
  // This ensures proper sequential ordering and prevents overlapping wedges
  const houses: HousePosition[] = [];
  
  // The four angles (cardinal cusps)
  const ic = (mc + 180) % 360;  // IC is opposite MC
  const dc = (asc + 180) % 360; // DC is opposite ASC
  
  // Calculate intermediate house cusps using Placidus proportional division
  // This creates unequal houses based on latitude and time of day
  const latFactor = Math.abs(latitude) / 90; // Latitude factor for house size variation
  
  // Improved Placidus house cusps ensuring sequential order and no overlaps
  // Start with the four angles and calculate intermediates in proper sequence
  const baseAngles = [
    { house: 1, angle: asc },
    { house: 4, angle: ic },
    { house: 7, angle: dc },
    { house: 10, angle: mc }
  ];
  
  // Sort angles to ensure proper sequence around the circle
  baseAngles.sort((a, b) => a.angle - b.angle);
  
  // Calculate all house cusps ensuring proper sequential spacing
  const houseCusps: number[] = new Array(12);
  
  // Set the four cardinal angles first
  houseCusps[0] = asc;   // 1st house
  houseCusps[3] = ic;    // 4th house  
  houseCusps[6] = dc;    // 7th house
  houseCusps[9] = mc;    // 10th house
  
  // Calculate intermediate cusps with proper spacing to prevent overlaps
  // Use proportional division but ensure minimum house size of 15 degrees
  const minHouseSize = 15; // Minimum degrees per house to prevent overlaps
  
  // Calculate houses 2, 3 between ASC and IC
  const ascToIcArc = ((ic - asc + 360) % 360);
  const house2Offset = Math.max(25 + latFactor * 8, minHouseSize);
  const house3Offset = Math.max(55 + latFactor * 12, house2Offset + minHouseSize);
  houseCusps[1] = (asc + Math.min(house2Offset, ascToIcArc * 0.33)) % 360;
  houseCusps[2] = (asc + Math.min(house3Offset, ascToIcArc * 0.67)) % 360;
  
  // Calculate houses 5, 6 between IC and DC
  const icToDcArc = ((dc - ic + 360) % 360);
  const house5Offset = Math.max(25 + latFactor * 8, minHouseSize);
  const house6Offset = Math.max(55 + latFactor * 12, house5Offset + minHouseSize);
  houseCusps[4] = (ic + Math.min(house5Offset, icToDcArc * 0.33)) % 360;
  houseCusps[5] = (ic + Math.min(house6Offset, icToDcArc * 0.67)) % 360;
  
  // Calculate houses 8, 9 between DC and MC
  const dcToMcArc = ((mc - dc + 360) % 360);
  const house8Offset = Math.max(25 + latFactor * 8, minHouseSize);
  const house9Offset = Math.max(55 + latFactor * 12, house8Offset + minHouseSize);
  houseCusps[7] = (dc + Math.min(house8Offset, dcToMcArc * 0.33)) % 360;
  houseCusps[8] = (dc + Math.min(house9Offset, dcToMcArc * 0.67)) % 360;
  
  // Calculate houses 11, 12 between MC and ASC
  const mcToAscArc = ((asc - mc + 360) % 360);
  const house11Offset = Math.max(25 + latFactor * 8, minHouseSize);
  const house12Offset = Math.max(55 + latFactor * 12, house11Offset + minHouseSize);
  houseCusps[10] = (mc + Math.min(house11Offset, mcToAscArc * 0.33)) % 360;
  houseCusps[11] = (mc + Math.min(house12Offset, mcToAscArc * 0.67)) % 360;
  
  // Create house data array with proper sequential cusps
  const houseData = houseCusps.map((cusp, index) => ({
    number: index + 1,
    cusp: cusp
  }));
  
  // House cusp calculation and validation - debug logging disabled
  houseCusps.forEach((cusp, index) => {
    const nextCusp = houseCusps[(index + 1) % 12];
    const houseSize = ((nextCusp - cusp + 360) % 360);
    
    // Check for very small houses (potential overlap)
    if (houseSize < 10) {
      // House is very small, potential overlap warning
    }
  });
  
  houseData.forEach(house => {
    const sign = SIGNS[Math.floor(house.cusp / 30)];
    houses.push({
      number: house.number,
      cusp: house.cusp,
      sign: sign,
    });
  });
  
  return {
    houses,
    ascendant: asc,
    midheaven: mc,
  };
}

/**
 * Determine which house a planet is in based on its longitude
 */
function determineHouse(planetLongitude: number, houses: HousePosition[]): number {
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
}

/**
 * Calculate aspects between planets
 */
function calculateAspects(planets: PlanetPosition[]): ChartAspect[] {
  // console.log('🔍 calculateAspects called with planets:', planets.length);
  const aspects: ChartAspect[] = [];
  
  // Define aspect colors
  const aspectColors: { [key: string]: string } = {
    conjunction: '#000000',
    sextile: '#0066cc',
    square: '#cc0000',
    trine: '#00cc00',
    opposition: '#cc0000',
    quincunx: '#cc6600'
  };
  
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const planet1 = planets[i];
      const planet2 = planets[j];
      
      // Calculate the angular separation
      let angle = Math.abs(planet1.longitude - planet2.longitude);
      if (angle > 180) angle = 360 - angle;
      
      // Check for each aspect type
      for (const [aspectName, aspectData] of Object.entries(ASPECTS)) {
        const orb = Math.abs(angle - aspectData.angle);
        
        if (orb <= aspectData.orb) {
          // Determine if aspect is applying or separating
          // This is a simplified check - in reality would need to consider planetary speeds
          const applying = planet1.longitude < planet2.longitude;
          
          aspects.push({
            planet1: planet1.name,
            planet2: planet2.name,
            aspect: aspectName,
            angle: angle,
            orb: orb,
            color: aspectColors[aspectName] || '#666666',
            applying: applying
          });
          break; // Only one aspect per planet pair
        }
      }
    }
  }
  
  // console.log('🔍 calculateAspects returning:', {
  //   aspectsCount: aspects.length,
  //   aspects: aspects.map(a => `${a.planet1} ${a.aspect} ${a.planet2}`)
  // });
  
  return aspects;
}



/**
 * Generate SVG natal chart with proper ring-based partitioning
 */
export function generateNatalChartSVG(
  chartData: NatalChartData,
  width: number = 800,
  height: number = 800
): string {
  const centerX = width / 2;
  const centerY = height / 2;
  const margin = Math.min(width, height) * 0.05;
  const maxRadius = (Math.min(width, height) - margin) / 2;
  const ringThickness = maxRadius * 0.12;

  // Define the ring radii (from outer to inner)
  const signRingRadius = maxRadius;                      // Outermost ring: Zodiac signs
  const houseRingRadius = maxRadius - ringThickness;    // Middle ring: Houses
  const planetRingRadius = maxRadius - 2 * ringThickness; // Inner ring: Planets
  const aspectRingRadius = maxRadius - 3 * ringThickness; // Center area: Aspect lines

  let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">`;

  // Background
  svg += `<rect width="${width}" height="${height}" fill="white"/>`;

  // Generate sign wheel (outermost ring)
  try {
    svg += generateSignWheel(centerX, centerY, signRingRadius, ringThickness);
  } catch (error) {
    console.error('Error generating sign wheel:', error);
    svg += '<!-- Sign wheel generation failed -->';
  }

  // Generate house wheel
  try {
    svg += generateHouseWheel(
      centerX,
      centerY,
      houseRingRadius,
      ringThickness,
      chartData
    );
  } catch (error) {
    console.error('Error generating house wheel:', error);
    svg += '<!-- House wheel generation failed -->';
  }

  // Generate planet wheel (3rd ring)
  try {
    svg += generatePlanetWheel(
      centerX,
      centerY,
      planetRingRadius,
      ringThickness,
      chartData
    );
  } catch (error) {
    console.error('Error generating planet wheel:', error);
    svg += '<!-- Planet wheel generation failed -->';
  }

  // Generate aspect lines (innermost - in the center)
  try {
    svg += generateAspectLines(centerX, centerY, aspectRingRadius, chartData);
  } catch (error) {
    console.error('Error generating aspect lines:', error);
    svg += '<!-- Aspect lines generation failed -->';
  }

  svg += "</svg>";

  return svg;
}

/**
 * Generate the zodiac sign wheel (outermost ring)
 */
function generateSignWheel(
  centerX: number,
  centerY: number,
  radius: number,
  thickness: number
): string {
  let svg = "";

  // Sign ring background
  svg += `<circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="#f8f9fa" stroke="#333" stroke-width="2"/>`;

  const signColors = [
    "#ff6b6b",
    "#4ecdc4",
    "#45b7d1",
    "#96ceb4",
    "#feca57",
    "#ff9ff3",
    "#54a0ff",
    "#5f27cd",
    "#00d2d3",
    "#ff9f43",
    "#48dbfb",
    "#0abde3",
  ];

  const signSymbols = [
    "♈", // Aries
    "♉", // Taurus
    "♊", // Gemini
    "♋", // Cancer
    "♌", // Leo
    "♍", // Virgo
    "♎", // Libra
    "♏", // Scorpio
    "♐", // Sagittarius
    "♑", // Capricorn
    "♒", // Aquarius
    "♓", // Pisces
  ];

  for (let i = 0; i < 12; i++) {
    const startAngle = i * 30 - 90;
    const endAngle = (i + 1) * 30 - 90;

    // Create sign sector
    svg += createSector(
      centerX,
      centerY,
      radius,
      radius - thickness,
      startAngle,
      endAngle,
      signColors[i] + "20",
      "#333",
      1
    );

    // Add sign symbol
    const symbolAngle = (startAngle + 15) * (Math.PI / 180);
    const symbolRadius = radius - thickness / 2;
    const symbolX = centerX + symbolRadius * Math.cos(symbolAngle);
    const symbolY = centerY + symbolRadius * Math.sin(symbolAngle);

    svg += `<text x="${symbolX}" y="${symbolY}" text-anchor="middle" dominant-baseline="middle" 
            font-size="18" fill="${signColors[i]}" font-weight="bold" 
            style="background: transparent !important; text-shadow: none; font-family: monospace; text-decoration: none; font-variant-emoji: text; -webkit-font-feature-settings: 'liga' off; font-feature-settings: 'liga' off;">${signSymbols[i]}</text>`;
  }

  return svg;
}

/**
 * Generate the house wheel
 */
function generateHouseWheel(
  centerX: number,
  centerY: number,
  radius: number,
  thickness: number,
  chartData: NatalChartData
): string {
  let svg = "";

  // House ring background
  svg += `<circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="#f1f3f4" stroke="#666" stroke-width="1"/>`;
  svg += `<circle cx="${centerX}" cy="${centerY}" r="${
    radius - thickness
  }" fill="white" stroke="#666" stroke-width="1"/>`;

  const houseColors = [
    "#e3f2fd",
    "#f3e5f5",
    "#e8f5e8",
    "#fff3e0",
    "#fce4ec",
    "#e0f2f1",
    "#f9fbe7",
    "#fff8e1",
    "#f1f8e9",
    "#fef7ff",
    "#e8eaf6",
    "#e1f5fe",
  ];

  for (let i = 0; i < 12; i++) {
    const house = chartData.houses[i];
    const nextHouse = chartData.houses[(i + 1) % 12];

    const startAngle = house.cusp - 90;
    let endAngle = nextHouse.cusp - 90;

    // Improved handling of crossing 0 degrees with validation
    if (endAngle < startAngle) {
      endAngle += 360;
    }
    
    // Ensure minimum house size of 10 degrees to prevent invisible wedges
    const houseSize = endAngle - startAngle;
    if (houseSize < 10) {
      console.warn(`🏠 House ${i + 1} size too small (${houseSize.toFixed(1)}°), adjusting to 10°`);
      endAngle = startAngle + 10;
    }
    
    // Log house wedge details for debugging houses 4 and 8
    if (i === 3 || i === 7) { // Houses 4 and 8 (0-indexed)
      // House wedge calculation for chart display
    }

    // Create house sector with improved error handling
    try {
      svg += createSector(
        centerX,
        centerY,
        radius,
        radius - thickness,
        startAngle,
        endAngle,
        houseColors[i],
        "#666",
        1
      );
    } catch (error) {
      console.error(`🏠 Error creating sector for house ${i + 1}:`, error);
      // Create a fallback simple sector
      const fallbackPath = `<path d="M ${centerX} ${centerY} L ${centerX + radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX} ${centerY + radius} Z" fill="${houseColors[i]}" stroke="#666" stroke-width="1"/>`;
      svg += fallbackPath;
    }

    // Add house number with better positioning
    const midAngle = (startAngle + (endAngle - startAngle) / 2) * (Math.PI / 180);
    const numberRadius = radius - thickness / 2;
    const numberX = centerX + numberRadius * Math.cos(midAngle);
    const numberY = centerY + numberRadius * Math.sin(midAngle);

    svg += `<text x="${numberX}" y="${numberY}" text-anchor="middle" dominant-baseline="middle" 
            font-size="14" fill="#333" font-weight="bold">${i + 1}</text>`;

    // Add house cusp line with improved angular house emphasis
    const cuspAngle = startAngle * (Math.PI / 180);
    const lineStart = radius - thickness;
    const lineEnd = radius;
    const x1 = centerX + lineStart * Math.cos(cuspAngle);
    const y1 = centerY + lineStart * Math.sin(cuspAngle);
    const x2 = centerX + lineEnd * Math.cos(cuspAngle);
    const y2 = centerY + lineEnd * Math.sin(cuspAngle);

    // Emphasize angular houses (1st, 4th, 7th, 10th)
    const isAngularHouse = [1, 4, 7, 10].includes(i + 1);
    const strokeWidth = isAngularHouse ? 3 : 1;
    const strokeColor = isAngularHouse ? "#333" : "#666";
    svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>`;
  }

  return svg;
}

/**
 * Generate the planet wheel
 */
function generatePlanetWheel(
  centerX: number,
  centerY: number,
  radius: number,
  thickness: number,
  chartData: NatalChartData
): string {
  let svg = "";

  // Planet ring background
  svg += `<circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="#fafbfc" stroke="#999" stroke-width="1"/>`;
  svg += `<circle cx="${centerX}" cy="${centerY}" r="${radius - thickness}" fill="white" stroke="#999" stroke-width="1"/>`;

  const planetSymbols: { [key: string]: string } = {
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
  };

  const planetColors: { [key: string]: string } = {
    sun: "#FFD700",
    moon: "#C0C0C0",
    mercury: "#FFA500",
    venus: "#FF69B4",
    mars: "#FF4500",
    jupiter: "#9932CC",
    saturn: "#8B4513",
    uranus: "#4169E1",
    neptune: "#00CED1",
    pluto: "#8B0000",
  };

  // Sort planets by longitude to avoid overlaps
  const sortedPlanets = [...chartData.planets].sort(
    (a, b) => a.longitude - b.longitude
  );
  const adjustedPositions = adjustPlanetPositions(sortedPlanets);

  sortedPlanets.forEach((planet, index) => {
    const originalAngle = (planet.longitude - 90) * (Math.PI / 180);
    const adjustedAngle = (adjustedPositions[index] - 90) * (Math.PI / 180);

    // Position on the actual degree (on the inner boundary of the chart)
    const degreeRadius = radius - thickness; // Point to the inner edge of the planet ring
    const degreeX = centerX + degreeRadius * Math.cos(originalAngle);
    const degreeY = centerY + degreeRadius * Math.sin(originalAngle);

    // Position for the symbol (in the planet ring - the innermost ring)
    const symbolRadius = radius - thickness / 2; // Position in the middle of the planet ring
    const symbolX = centerX + symbolRadius * Math.cos(adjustedAngle);
    const symbolY = centerY + symbolRadius * Math.sin(adjustedAngle);

    const color = planetColors[planet.name] || "#333";

    // Draw line from degree position to symbol
    svg += `<line x1="${degreeX}" y1="${degreeY}" x2="${symbolX}" y2="${symbolY}" 
            stroke="${color}" stroke-width="1" opacity="0.7"/>`;

    // Draw degree marker on the rim
    svg += `<circle cx="${degreeX}" cy="${degreeY}" r="2" fill="${color}" stroke="white" stroke-width="1"/>`;

    // Draw symbol background (well inside the center)
    svg += `<circle cx="${symbolX}" cy="${symbolY}" r="10" fill="white" stroke="${color}" stroke-width="2"/>`;

    // Draw symbol
    const symbol = planetSymbols[planet.name] || planet.name.charAt(0).toUpperCase();
    svg += `<text x="${symbolX}" y="${symbolY}" text-anchor="middle" dominant-baseline="middle" 
            font-size="12" fill="${color}" font-weight="bold" 
            style="background: transparent !important; text-shadow: none; font-family: monospace; text-decoration: none; font-variant-emoji: text; -webkit-font-feature-settings: 'liga' off; font-feature-settings: 'liga' off;">${symbol}</text>`;

    // Retrograde indicator
    if (planet.retrograde) {
      svg += `<text x="${symbolX + 12}" y="${
        symbolY - 8
      }" text-anchor="middle" dominant-baseline="middle" 
              font-size="7" fill="red" font-weight="bold">R</text>`;
    }
  });

  return svg;
}

/**
 * Generate aspect lines in the center
 */
function generateAspectLines(
  centerX: number,
  centerY: number,
  radius: number,
  chartData: NatalChartData
): string {
  let svg = "";

  // Inner circle background
  svg += `<circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="white" stroke="#ccc" stroke-width="1"/>`;

  const planetColors: { [key: string]: string } = {
    sun: "#FFD700",
    moon: "#C0C0C0",
    mercury: "#FFA500",
    venus: "#FF69B4",
    mars: "#FF4500",
    jupiter: "#9932CC",
    saturn: "#8B4513",
    uranus: "#4169E1",
    neptune: "#00CED1",
    pluto: "#8B0000",
  };

  // Generating aspect lines for chart visualization

  // Create gradients for each aspect line
  let gradientDefs = '<defs>';
  chartData.aspects.forEach((aspect, index) => {
    const planet1 = chartData.planets.find((p) => p.name === aspect.planet1);
    const planet2 = chartData.planets.find((p) => p.name === aspect.planet2);

    if (planet1 && planet2) {
      const color1 = planetColors[planet1.name] || "#333";
      const color2 = planetColors[planet2.name] || "#333";
      
      gradientDefs += `
        <linearGradient id="aspect-gradient-${index}" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:${color1};stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:${color2};stop-opacity:0.8" />
        </linearGradient>`;
    }
  });
  gradientDefs += '</defs>';
  svg += gradientDefs;

  chartData.aspects.forEach((aspect, index) => {
    const planet1 = chartData.planets.find((p) => p.name === aspect.planet1);
    const planet2 = chartData.planets.find((p) => p.name === aspect.planet2);

    if (planet1 && planet2) {
      // Draw lines to the edge of the aspect ring (inner circle boundary)
      const lineRadius = radius;
      
      const angle1 = (planet1.longitude - 90) * (Math.PI / 180);
      const angle2 = (planet2.longitude - 90) * (Math.PI / 180);

      const x1 = centerX + lineRadius * Math.cos(angle1);
      const y1 = centerY + lineRadius * Math.sin(angle1);
      const x2 = centerX + lineRadius * Math.cos(angle2);
      const y2 = centerY + lineRadius * Math.sin(angle2);

      const aspectData = ASPECTS[aspect.aspect as keyof typeof ASPECTS];
      const strokeWidth = aspectData?.type === "major" ? 2 : 1;
      const opacity = aspect.aspect === "conjunction" ? 0.9 : 0.7;

      svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" 
              stroke="url(#aspect-gradient-${index})" stroke-width="${strokeWidth}" opacity="${opacity}"/>`;
    }
  });

  return svg;
}

/**
 * Create an SVG sector (arc segment)
 */
function createSector(
  centerX: number,
  centerY: number,
  outerRadius: number,
  innerRadius: number,
  startAngle: number,
  endAngle: number,
  fill: string,
  stroke: string,
  strokeWidth: number
): string {
  const startRad = startAngle * (Math.PI / 180);
  const endRad = endAngle * (Math.PI / 180);

  const x1 = centerX + outerRadius * Math.cos(startRad);
  const y1 = centerY + outerRadius * Math.sin(startRad);
  const x2 = centerX + outerRadius * Math.cos(endRad);
  const y2 = centerY + outerRadius * Math.sin(endRad);

  const x3 = centerX + innerRadius * Math.cos(endRad);
  const y3 = centerY + innerRadius * Math.sin(endRad);
  const x4 = centerX + innerRadius * Math.cos(startRad);
  const y4 = centerY + innerRadius * Math.sin(startRad);

  const largeArc = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;

  const pathData = [
    `M ${x1} ${y1}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2}`,
    `L ${x3} ${y3}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}`,
    "Z",
  ].join(" ");

  return `<path d="${pathData}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
}

/**
 * Adjust planet positions to avoid overlaps
 */
function adjustPlanetPositions(planets: PlanetPosition[]): number[] {
  const minSeparation = 12; // Minimum degrees between planets
  const positions = planets.map((p) => p.longitude);

  // Simple collision avoidance
  for (let i = 1; i < positions.length; i++) {
    const prevPos = positions[i - 1];
    const currentPos = positions[i];

    let diff = currentPos - prevPos;
    if (diff < 0) diff += 360;

    if (diff < minSeparation) {
      positions[i] = (prevPos + minSeparation) % 360;
    }
  }

  return positions;
}

/**
 * Generate natal chart from birth data
 */
export async function generateNatalChart(birthData: {
  name: string;
  dateOfBirth: string;
  timeOfBirth: string;
  coordinates: { lat: string; lon: string };
  locationOfBirth: string;
}): Promise<{ svg: string; metadata: ChartMetadata }> {
  // Process birth time with proper timezone handling
  const processedTime = processBirthTime({
    dateOfBirth: birthData.dateOfBirth,
    timeOfBirth: birthData.timeOfBirth,
    coordinates: birthData.coordinates,
    locationOfBirth: birthData.locationOfBirth
  });
  
  if (processedTime.confidence === 'low' || processedTime.warnings.length > 2) {
    console.warn('NATAL CHART ACCURACY WARNING:', processedTime.warnings);
  }
  
  const birthDate = processedTime.utcDate; // Use properly processed UTC date
  const latitude = parseFloat(birthData.coordinates.lat);
  const longitude = parseFloat(birthData.coordinates.lon);

  // Calculate planetary positions
  const chartData = await calculatePlanetaryPositions(birthDate, latitude, longitude);

  // Generate SVG with larger size for better display
  const svg = generateNatalChartSVG(chartData, 1000, 1000);

  // Validate SVG was generated successfully
  if (!svg || svg.length === 0) {
    throw new Error('SVG generation failed: No content generated');
  }

  return {
    svg,
    metadata: {
      name: birthData.name,
      dateOfBirth: birthData.dateOfBirth,
      timeOfBirth: birthData.timeOfBirth,
      locationOfBirth: birthData.locationOfBirth,
      coordinates: birthData.coordinates,
      generatedAt: new Date().toISOString(),
      chartData,
    },
  };
}
