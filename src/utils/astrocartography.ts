/**
 * Astrocartography Line Calculation Utilities
 * 
 * Mathematical algorithms for calculating astrocartography lines based on
 * planetary positions and birth data. Implements spherical trigonometry
 * to determine where specific angular relationships occur geographically.
 */

export interface AstrocartographyLinePoint {
  lat: number;
  lng: number;
}

export interface AstrocartographyLine {
  type: 'meridian' | 'horizon';
  side?: 'rising' | 'setting';
  coordinates: AstrocartographyLinePoint[];
  svgPath?: string;
  planet: string;
  lineType: 'MC' | 'IC' | 'AC' | 'DC';
}

export interface PlanetaryAstrocartography {
  planet: string;
  lines: {
    mc?: AstrocartographyLine;
    ic?: AstrocartographyLine;
    ac?: AstrocartographyLine;
    dc?: AstrocartographyLine;
  };
}

export interface AstrocartographyData {
  birthData: {
    date: Date;
    location: { latitude: number; longitude: number; };
  };
  planets: PlanetaryAstrocartography[];
  calculatedAt: string;
}

/**
 * Calculate Greenwich Mean Sidereal Time for a given date
 * Enhanced precision with higher-order terms for professional accuracy
 */
export function calculateGMST(date: Date): number {
  const jd = dateToJulianDay(date);
  const T = (jd - 2451545.0) / 36525.0;
  
  // Enhanced GMST calculation with higher precision terms
  // Based on IAU 2000 formula for improved accuracy
  let gmst = 280.46061837 + 
             360.98564736629 * (jd - 2451545.0) + 
             0.000387933 * T * T - 
             T * T * T / 38710000.0 +
             T * T * T * T / 58.13 / 1000000000.0; // Higher precision term
  
  // Normalize to 0-360 degrees
  gmst = gmst % 360;
  if (gmst < 0) gmst += 360;
  
  const gmstHours = gmst / 15; // Convert to hours
  
  return gmstHours;
}

/**
 * Convert Date to Julian Day Number
 */
export function dateToJulianDay(date: Date): number {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth() + 1;
  const d = date.getUTCDate();
  const h = date.getUTCHours() + date.getUTCMinutes()/60 + date.getUTCSeconds()/3600;
  
  const a = Math.floor((14 - m) / 12);
  const y1 = y + 4800 - a;
  const m1 = m + 12 * a - 3;
  
  const jdn = d + Math.floor((153 * m1 + 2) / 5) + 
              365 * y1 + Math.floor(y1 / 4) - 
              Math.floor(y1 / 100) + Math.floor(y1 / 400) - 32045;
  
  return jdn + (h - 12) / 24;
}

/**
 * Calculate MC and IC lines (meridian lines)
 */
export function calculateMCICLines(
  planetRA: number, 
  birthTime: Date, 
  planetName: string
): { mc: AstrocartographyLine; ic: AstrocartographyLine; } {
  const gmst = calculateGMST(birthTime);
  const mcLongitude = 15 * (planetRA - gmst);
  
  // Normalize to -180 to +180 range
  const normalizedMC = ((mcLongitude + 180) % 360) - 180;
  const icLongitude = normalizedMC > 0 ? normalizedMC - 180 : normalizedMC + 180;
  
  const mcCoordinates = generateMeridianLine(normalizedMC);
  const icCoordinates = generateMeridianLine(icLongitude);
  
  return {
    mc: {
      type: 'meridian',
      planet: planetName,
      lineType: 'MC',
      coordinates: mcCoordinates,
      svgPath: generateMeridianSVGPath(normalizedMC)
    },
    ic: {
      type: 'meridian',
      planet: planetName,
      lineType: 'IC',
      coordinates: icCoordinates,
      svgPath: generateMeridianSVGPath(icLongitude)
    }
  };
}

/**
 * Generate coordinate points for a meridian line
 */
export function generateMeridianLine(longitude: number): AstrocartographyLinePoint[] {
  const coordinates: AstrocartographyLinePoint[] = [];
  for (let lat = -90; lat <= 90; lat += 0.5) {
    coordinates.push({ lat, lng: longitude });
  }
  
  
  return coordinates;
}

/**
 * Calculate AC and DC lines (horizon lines)
 */
export function calculateACDCLines(
  planetRA: number,
  planetDec: number,
  birthTime: Date,
  planetName: string
): { ac: AstrocartographyLine; dc: AstrocartographyLine; } {
  const acCoordinates: AstrocartographyLinePoint[] = [];
  const dcCoordinates: AstrocartographyLinePoint[] = [];
  const gmst = calculateGMST(birthTime);
  
  // let validLatitudes = 0;
  // let skippedLatitudes = 0;
  
  // Iterate through latitudes with variable step size
  // Use smaller steps at higher latitudes where lines curve more
  for (let lat = -89; lat <= 89; lat += (Math.abs(lat) > 60 ? 0.25 : 0.5)) {
    const risingSetData = calculateRisingSettingLongitudes(
      planetRA, planetDec, lat, gmst
    );
    
    if (risingSetData) {
      acCoordinates.push({
        lat: lat,
        lng: risingSetData.rising
      });
      
      dcCoordinates.push({
        lat: lat,
        lng: risingSetData.setting
      });
      // validLatitudes++;
    } else {
      // skippedLatitudes++;
    }
  }
  
  return {
    ac: { 
      type: 'horizon', 
      side: 'rising', 
      planet: planetName,
      lineType: 'AC',
      coordinates: acCoordinates,
      svgPath: coordinatesToSVGPath(acCoordinates)
    },
    dc: { 
      type: 'horizon', 
      side: 'setting', 
      planet: planetName,
      lineType: 'DC',
      coordinates: dcCoordinates,
      svgPath: coordinatesToSVGPath(dcCoordinates)
    }
  };
}

/**
 * Calculate rising and setting longitudes for a given latitude
 * Enhanced with topocentric corrections for observer location
 */
export function calculateRisingSettingLongitudes(
  ra: number, 
  dec: number, 
  latitude: number, 
  gmst: number,
  elevation: number = 0 // Observer elevation in meters
): { rising: number; setting: number; } | null {
  const latRad = latitude * Math.PI / 180;
  const decRad = dec * Math.PI / 180;
  
  // Apply atmospheric refraction correction (standard ~34 arcminutes = 0.567°)
  const atmosphericRefraction = 0.567 * Math.PI / 180; // Convert to radians
  
  // Apply elevation correction for observer height above sea level
  const elevationCorrection = Math.sqrt(2 * elevation / 6371000) * 180 / Math.PI; // In degrees
  const elevationCorrectionRad = elevationCorrection * Math.PI / 180;
  
  // Corrected declination accounting for refraction and elevation
  const correctedDecRad = decRad + atmosphericRefraction + elevationCorrectionRad;
  
  // Calculate hour angle for rising/setting with corrections
  const cosH = -Math.tan(latRad) * Math.tan(correctedDecRad);
  
  // Check if planet rises/sets at this latitude
  if (Math.abs(cosH) > 1) {
    return null; // Planet is circumpolar or never visible
  }
  
  const H = Math.acos(cosH);
  const hHours = H * 12 / Math.PI; // Convert to hours
  
  // Calculate LST at rising and setting
  const lstRising = ra - hHours;
  const lstSetting = ra + hHours;
  
  // Convert to geographic longitude
  const lngRising = 15 * (lstRising - gmst);
  const lngSetting = 15 * (lstSetting - gmst);
  
  const risingNorm = normalizeLongitude(lngRising);
  const settingNorm = normalizeLongitude(lngSetting);
  
  return {
    rising: risingNorm,
    setting: settingNorm
  };
}

/**
 * Normalize longitude to -180 to +180 range
 */
export function normalizeLongitude(lng: number): number {
  while (lng > 180) lng -= 360;
  while (lng < -180) lng += 360;
  return lng;
}

/**
 * Convert coordinates array to SVG path string
 */
export function coordinatesToSVGPath(coordinates: AstrocartographyLinePoint[]): string {
  if (coordinates.length === 0) return '';
  
  let path = `M ${coordinates[0].lng} ${-coordinates[0].lat}`;
  
  for (let i = 1; i < coordinates.length; i++) {
    // Handle antimeridian crossing
    if (Math.abs(coordinates[i].lng - coordinates[i-1].lng) > 180) {
      // Break the path
      path += ` M ${coordinates[i].lng} ${-coordinates[i].lat}`;
    } else {
      path += ` L ${coordinates[i].lng} ${-coordinates[i].lat}`;
    }
  }
  
  return path;
}

/**
 * Generate SVG path for meridian line
 */
export function generateMeridianSVGPath(longitude: number): string {
  return `M ${longitude} 90 L ${longitude} -90`;
}

/**
 * Split coordinates at antimeridian crossings
 */
export function splitAtAntimeridian(coordinates: AstrocartographyLinePoint[]): AstrocartographyLinePoint[][] {
  const segments: AstrocartographyLinePoint[][] = [];
  let currentSegment: AstrocartographyLinePoint[] = [];
  
  for (let i = 0; i < coordinates.length; i++) {
    if (i > 0) {
      const prevLng = coordinates[i-1].lng;
      const currLng = coordinates[i].lng;
      
      // Check for antimeridian crossing
      if (Math.abs(currLng - prevLng) > 180) {
        // Calculate intersection point
        const crossLat = interpolateAntimeridianCrossing(
          coordinates[i-1], 
          coordinates[i]
        );
        
        // Add intersection points
        if (prevLng > 0) {
          currentSegment.push({ lat: crossLat, lng: 180 });
          segments.push(currentSegment);
          currentSegment = [{ lat: crossLat, lng: -180 }];
        } else {
          currentSegment.push({ lat: crossLat, lng: -180 });
          segments.push(currentSegment);
          currentSegment = [{ lat: crossLat, lng: 180 }];
        }
      }
    }
    
    currentSegment.push(coordinates[i]);
  }
  
  if (currentSegment.length > 0) {
    segments.push(currentSegment);
  }
  
  return segments;
}

/**
 * Interpolate latitude at antimeridian crossing
 */
export function interpolateAntimeridianCrossing(
  point1: AstrocartographyLinePoint, 
  point2: AstrocartographyLinePoint
): number {
  // Linear interpolation of latitude at longitude ±180
  const lng1 = point1.lng > 0 ? point1.lng : point1.lng + 360;
  const lng2 = point2.lng > 0 ? point2.lng : point2.lng + 360;
  
  const targetLng = 180;
  const t = (targetLng - lng1) / (lng2 - lng1);
  
  return point1.lat + t * (point2.lat - point1.lat);
}

/**
 * Calculate all astrocartography lines for a planet
 */
export function calculatePlanetaryAstrocartography(
  planetData: {
    name: string;
    rightAscension: number; // RA in hours
    declination: number;    // Dec in degrees
  },
  birthTime: Date
): PlanetaryAstrocartography {
  const mcicLines = calculateMCICLines(
    planetData.rightAscension, 
    birthTime, 
    planetData.name
  );
  
  const acdcLines = calculateACDCLines(
    planetData.rightAscension,
    planetData.declination,
    birthTime,
    planetData.name
  );
  
  return {
    planet: planetData.name,
    lines: {
      mc: mcicLines.mc,
      ic: mcicLines.ic,
      ac: acdcLines.ac,
      dc: acdcLines.dc
    }
  };
}

/**
 * Calculate complete astrocartography data for all planets
 */
export function calculateCompleteAstrocartography(
  planetsData: Array<{
    name: string;
    rightAscension: number;
    declination: number;
  }>,
  birthData: {
    date: Date;
    location: { latitude: number; longitude: number; };
  }
): AstrocartographyData {
  const planetaryLines = planetsData.map((planetData) => {
    return calculatePlanetaryAstrocartography(planetData, birthData.date);
  });
  
  return {
    birthData,
    planets: planetaryLines,
    calculatedAt: new Date().toISOString()
  };
}

/**
 * Check if a celestial body is circumpolar at given latitude
 */
export function checkCircumpolarStatus(declination: number, latitude: number): 'circumpolar' | 'never-visible' | 'normal' {
  // Calculate critical declination for circumpolar/never-visible
  const criticalDec = 90 - Math.abs(latitude);
  
  if (declination > criticalDec && latitude > 0) {
    return 'circumpolar'; // Never sets in northern hemisphere
  } else if (declination < -criticalDec && latitude > 0) {
    return 'never-visible'; // Never rises in northern hemisphere
  } else if (declination < -criticalDec && latitude < 0) {
    return 'circumpolar'; // Never sets in southern hemisphere
  } else if (declination > criticalDec && latitude < 0) {
    return 'never-visible'; // Never rises in southern hemisphere
  }
  
  return 'normal';
}

/**
 * Optimize line coordinates for rendering performance
 * Uses much smaller tolerance for astrocartography accuracy
 */
export function optimizeLineForRendering(line: AstrocartographyLine): AstrocartographyLine {
  if (!line.coordinates || line.coordinates.length === 0) return line;
  
  // const originalCount = line.coordinates.length;
  
  // Use very conservative tolerance for astrocartography lines
  // 0.01° ≈ 1.1 km at equator - much more accurate than the previous 0.1° (11 km)
  const optimizedCoordinates = simplifyLine(line.coordinates, 0.01);
  
  // const finalCount = optimizedCoordinates.length;
  // const reductionPercent = ((originalCount - finalCount) / originalCount * 100);
  
  return {
    ...line,
    coordinates: optimizedCoordinates,
    svgPath: coordinatesToSVGPath(optimizedCoordinates)
  };
}

/**
 * Simplify line using Douglas-Peucker algorithm
 */
export function simplifyLine(points: AstrocartographyLinePoint[], tolerance: number): AstrocartographyLinePoint[] {
  if (points.length <= 2) return points;
  
  let maxDistance = 0;
  let maxIndex = 0;
  
  for (let i = 1; i < points.length - 1; i++) {
    const distance = perpendicularDistance(
      points[i], points[0], points[points.length - 1]
    );
    
    if (distance > maxDistance) {
      maxDistance = distance;
      maxIndex = i;
    }
  }
  
  if (maxDistance > tolerance) {
    const left = simplifyLine(points.slice(0, maxIndex + 1), tolerance);
    const right = simplifyLine(points.slice(maxIndex), tolerance);
    
    return left.slice(0, -1).concat(right);
  } else {
    return [points[0], points[points.length - 1]];
  }
}

/**
 * Calculate perpendicular distance from point to line
 */
export function perpendicularDistance(
  point: AstrocartographyLinePoint, 
  lineStart: AstrocartographyLinePoint, 
  lineEnd: AstrocartographyLinePoint
): number {
  const dx = lineEnd.lng - lineStart.lng;
  const dy = lineEnd.lat - lineStart.lat;
  
  const mag = Math.sqrt(dx * dx + dy * dy);
  
  if (mag > 0) {
    const u = ((point.lng - lineStart.lng) * dx + 
              (point.lat - lineStart.lat) * dy) / (mag * mag);
    
    const closestPoint = {
      lng: lineStart.lng + u * dx,
      lat: lineStart.lat + u * dy
    };
    
    const dist = Math.sqrt(
      Math.pow(point.lng - closestPoint.lng, 2) + 
      Math.pow(point.lat - closestPoint.lat, 2)
    );
    
    return dist;
  }
  
  return Math.sqrt(
    Math.pow(point.lng - lineStart.lng, 2) + 
    Math.pow(point.lat - lineStart.lat, 2)
  );
}