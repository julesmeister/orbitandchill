/**
 * Astrocartography Distance Calculator
 * 
 * Calculates distances from any geographic point to astrocartography lines
 * and identifies line crossings (parans) for detailed analysis.
 */

import { AstrocartographySVGLine } from './astrocartographyLineRenderer';
import { Paran, ParanProximity, findParansAtLatitude } from './paranCalculations';
import { LocationInfo, cachedReverseGeocode } from './reverseGeocoding';
import { CountryInfo } from './countryDetection';

export interface LineProximityResult {
  line: AstrocartographySVGLine;
  distanceKm: number;
  closestPoint: {
    lat: number;
    lng: number;
  };
}

export interface LineCrossing {
  planet1: string;
  planet2: string;
  lineType1: string;
  lineType2: string;
  crossingPoint: {
    lat: number;
    lng: number;
  };
  distanceKm: number;
}

export interface LatitudinalInfluence {
  latitude: number;
  crossings: Array<{
    planet1: string;
    planet2: string;
    lineType1: string;
    lineType2: string;
  }>;
}

export interface AstrocartographyAnalysis {
  clickedPoint: {
    lat: number;
    lng: number;
  };
  locationInfo: LocationInfo | null;       // Location information from reverse geocoding
  countryInfo: CountryInfo | null;         // Country information from SVG detection
  nearbyLines: LineProximityResult[];
  crossings: LineCrossing[];
  parans: ParanProximity[];                // Parans within orb
  latitudinalInfluences: LatitudinalInfluence[];
}

/**
 * Calculate the great circle distance between two geographic points
 * Using the Haversine formula for accuracy
 */
export function calculateDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Find the closest point on a line segment to a given point
 */
export function closestPointOnLineSegment(
  pointLat: number,
  pointLng: number,
  lineLat1: number,
  lineLng1: number,
  lineLat2: number,
  lineLng2: number
): { lat: number; lng: number; } {
  // Vector from line start to point
  const AP = [pointLat - lineLat1, pointLng - lineLng1];
  // Vector of the line segment
  const AB = [lineLat2 - lineLat1, lineLng2 - lineLng1];
  
  // Dot products
  const AB_squared = AB[0] * AB[0] + AB[1] * AB[1];
  const AP_dot_AB = AP[0] * AB[0] + AP[1] * AB[1];
  
  if (AB_squared === 0) {
    // Line segment is actually a point
    return { lat: lineLat1, lng: lineLng1 };
  }
  
  // Parameter t represents position along line segment (0 = start, 1 = end)
  const t = Math.max(0, Math.min(1, AP_dot_AB / AB_squared));
  
  return {
    lat: lineLat1 + t * AB[0],
    lng: lineLng1 + t * AB[1]
  };
}

/**
 * Calculate distance from a point to an astrocartography line
 */
export function calculateLineDistance(
  pointLat: number,
  pointLng: number,
  line: AstrocartographySVGLine
): LineProximityResult {
  let minDistance = Infinity;
  let closestPoint = { lat: pointLat, lng: pointLng };
  
  // Parse SVG path to get coordinate points using calibrated transformation
  const coordinates = parseSVGPathToCoordinates(line.path);
  
  if (coordinates.length === 0) {
    console.warn(`No coordinates found for line: ${line.planet}/${line.lineType}`);
    return {
      line,
      distanceKm: Infinity,
      closestPoint
    };
  }

  console.log(`Calculating distance for ${line.planet}/${line.lineType} line with ${coordinates.length} points`);
  
  // For meridian lines (MC/IC), they are vertical lines at constant longitude
  if (line.lineType === 'MC' || line.lineType === 'IC') {
    // Find the longitude of the meridian line (should be consistent across all points)
    const lineLongitude = coordinates[0].lng;
    
    // Distance from point to meridian is the great circle distance to the same latitude on the meridian
    const distance = calculateDistanceKm(pointLat, pointLng, pointLat, lineLongitude);
    const closest = { lat: pointLat, lng: lineLongitude };
    
    console.log(`Meridian line ${line.planet}/${line.lineType}: longitude=${lineLongitude}, distance=${distance.toFixed(1)}km`);
    
    return {
      line,
      distanceKm: distance,
      closestPoint: closest
    };
  }
  
  // For horizon lines (AC/DC), find closest point on the curve
  for (let i = 0; i < coordinates.length - 1; i++) {
    const segmentClosest = closestPointOnLineSegment(
      pointLat, pointLng,
      coordinates[i].lat, coordinates[i].lng,
      coordinates[i + 1].lat, coordinates[i + 1].lng
    );
    
    const distance = calculateDistanceKm(
      pointLat, pointLng,
      segmentClosest.lat, segmentClosest.lng
    );
    
    if (distance < minDistance) {
      minDistance = distance;
      closestPoint = segmentClosest;
    }
  }
  
  console.log(`Horizon line ${line.planet}/${line.lineType}: closest distance=${minDistance.toFixed(1)}km at lat=${closestPoint.lat.toFixed(2)}, lng=${closestPoint.lng.toFixed(2)}`);
  
  return {
    line,
    distanceKm: minDistance,
    closestPoint
  };
}

/**
 * Convert SVG coordinates back to geographic coordinates
 * Uses the empirically calibrated reverse transformation that accounts for 
 * the world-states.svg projection distortions documented in astrocartography.md
 */
function svgToGeoCoordinates(svgX: number, svgY: number): { lat: number; lng: number } {
  const svgWidth = 1000;
  const svgHeight = 507.209;
  
  // Step 1: Reverse the base transformation
  const rawX = svgX + 27; // Remove global longitude offset (-27px globally)
  let lng = ((rawX / svgWidth) * 360) - 180;
  let lat = 90 - ((svgY / svgHeight) * 180);
  
  // Step 2: Apply reverse regional corrections based on empirical calibration
  // These corrections reverse the adjustments from geoToWorldMapSVG function
  
  if (lng >= 0 && lng <= 180) {
    // Asia/Pacific region - reverse the corrections
    if (lng >= 60 && lng <= 150) {
      // Asia: Reverse the -23px X, -9px Y correction
      svgX += 23; // Reverse westward correction
      svgY += 9;  // Reverse Y correction
      // Recalculate with corrected SVG coordinates
      const correctedRawX = svgX + 27;
      lng = ((correctedRawX / svgWidth) * 360) - 180;
      lat = 90 - ((svgY / svgHeight) * 180);
    } else if (lng >= 150 && lng <= 180) {
      // Pacific: Reverse the -40px X, +12px Y correction
      svgX += 40; // Reverse westward adjustment
      svgY -= 12; // Reverse Y adjustment
      const correctedRawX = svgX + 27;
      lng = ((correctedRawX / svgWidth) * 360) - 180;
      lat = 90 - ((svgY / svgHeight) * 180);
    }
  } else {
    // Americas region (negative longitude) - reverse corrections
    if (lng >= -120 && lng <= -30) {
      if (lng >= -80 && lng <= -60) {
        // North America: Reverse the +19px X, -13px Y correction
        svgX -= 19; // Reverse eastward correction
        svgY += 13; // Reverse Y correction
        const correctedRawX = svgX + 27;
        lng = ((correctedRawX / svgWidth) * 360) - 180;
        lat = 90 - ((svgY / svgHeight) * 180);
      } else if (lng >= -60 && lng <= -30) {
        // South America: Reverse the +8px X, +5px Y correction
        svgX -= 8;  // Reverse eastward correction
        svgY -= 5;  // Reverse Y correction
        const correctedRawX = svgX + 27;
        lng = ((correctedRawX / svgWidth) * 360) - 180;
        lat = 90 - ((svgY / svgHeight) * 180);
      }
    }
  }
  
  // Europe region (around 0° longitude) - reverse London-specific correction
  if (lng >= -10 && lng <= 30) {
    if (lat >= 50 && lat <= 52 && lng >= -2 && lng <= 2) {
      // London area: Reverse the -18px Y correction
      svgY += 18;
      lat = 90 - ((svgY / svgHeight) * 180);
    }
  }
  
  return { lat, lng };
}

/**
 * Parse SVG path string to extract geographic coordinates
 */
function parseSVGPathToCoordinates(svgPath: string): Array<{ lat: number; lng: number; }> {
  // Extract M and L commands from SVG path
  const commands = svgPath.match(/[ML]\s*([^ML]+)/g) || [];
  const coordinates: Array<{ lat: number; lng: number; }> = [];
  
  commands.forEach(command => {
    const coords = command.substring(1).trim().split(/\s+/);
    for (let i = 0; i < coords.length; i += 2) {
      if (coords[i] && coords[i + 1]) {
        const svgX = parseFloat(coords[i]);
        const svgY = parseFloat(coords[i + 1]);
        
        // Convert SVG coordinates back to geographic coordinates
        const geoCoord = svgToGeoCoordinates(svgX, svgY);
        coordinates.push(geoCoord);
      }
    }
  });
  
  return coordinates;
}

/**
 * Find line crossings (parans) between astrocartography lines
 */
export function findLineCrossings(
  lines: AstrocartographySVGLine[],
  clickedPoint: { lat: number; lng: number; },
  maxDistanceKm: number = 200
): LineCrossing[] {
  const crossings: LineCrossing[] = [];
  
  // Compare each line with every other line
  for (let i = 0; i < lines.length; i++) {
    for (let j = i + 1; j < lines.length; j++) {
      const line1 = lines[i];
      const line2 = lines[j];
      
      // Skip if same planet and line type
      if (line1.planet === line2.planet && line1.lineType === line2.lineType) {
        continue;
      }
      
      const intersection = findLineIntersection(line1, line2);
      if (intersection) {
        const distance = calculateDistanceKm(
          clickedPoint.lat, clickedPoint.lng,
          intersection.lat, intersection.lng
        );
        
        if (distance <= maxDistanceKm) {
          crossings.push({
            planet1: line1.planet,
            planet2: line2.planet,
            lineType1: line1.lineType,
            lineType2: line2.lineType,
            crossingPoint: intersection,
            distanceKm: distance
          });
        }
      }
    }
  }
  
  return crossings.sort((a, b) => a.distanceKm - b.distanceKm);
}

/**
 * Find intersection point between two astrocartography lines
 */
function findLineIntersection(
  line1: AstrocartographySVGLine,
  line2: AstrocartographySVGLine
): { lat: number; lng: number; } | null {
  // Simplified intersection calculation
  // For meridian lines (MC/IC), intersection is straightforward
  // For horizon lines (AC/DC), this would need more complex curve intersection
  
  const coords1 = parseSVGPathToCoordinates(line1.path);
  const coords2 = parseSVGPathToCoordinates(line2.path);
  
  if (coords1.length === 0 || coords2.length === 0) {
    return null;
  }
  
  // For now, return a simplified intersection point
  // This needs proper geometric intersection calculation
  return {
    lat: (coords1[0].lat + coords2[0].lat) / 2,
    lng: (coords1[0].lng + coords2[0].lng) / 2
  };
}

/**
 * Analyze astrocartography influences for a clicked geographic point
 */
export async function analyzeAstrocartographyPoint(
  clickedLat: number,
  clickedLng: number,
  astrocartographyLines: AstrocartographySVGLine[],
  parans?: Paran[],  // Optional parans data
  countryInfo?: CountryInfo | null  // Optional country info from SVG detection
): Promise<AstrocartographyAnalysis> {
  // Get location information through reverse geocoding
  const locationInfo = await cachedReverseGeocode(clickedLat, clickedLng);
  
  // Find nearby lines within reasonable distance
  const nearbyLines = astrocartographyLines
    .map(line => calculateLineDistance(clickedLat, clickedLng, line))
    .filter(result => result.distanceKm <= 300) // Within 300km
    .sort((a, b) => a.distanceKm - b.distanceKm);
  
  // Find line crossings near the clicked point
  const crossings = findLineCrossings(
    astrocartographyLines,
    { lat: clickedLat, lng: clickedLng },
    200 // Within 200km
  );
  
  // Find parans affecting this latitude
  const paranProximities = parans ? findParansAtLatitude(parans, clickedLat, 75) : [];
  
  // Find latitudinal influences (simplified for now)
  const latitudinalInfluences: LatitudinalInfluence[] = [];
  
  const displayLocation = countryInfo?.countryName || locationInfo?.displayName || 'coordinates';
  console.log(`Analysis for ${displayLocation} (${clickedLat.toFixed(2)}, ${clickedLng.toFixed(2)}): ${nearbyLines.length} nearby lines, ${crossings.length} crossings, ${paranProximities.length} parans`);
  
  return {
    clickedPoint: { lat: clickedLat, lng: clickedLng },
    locationInfo,
    countryInfo: countryInfo || null,
    nearbyLines: nearbyLines.slice(0, 5), // Top 5 closest lines
    crossings,
    parans: paranProximities,
    latitudinalInfluences
  };
}

/**
 * Format coordinates for display (similar to Astrodienst format)
 */
export function formatCoordinates(lat: number, lng: number): string {
  const latDir = lat >= 0 ? 'n' : 's';
  const lngDir = lng >= 0 ? 'e' : 'w';
  
  const latDeg = Math.floor(Math.abs(lat));
  const latMin = Math.round((Math.abs(lat) - latDeg) * 60);
  
  const lngDeg = Math.floor(Math.abs(lng));
  const lngMin = Math.round((Math.abs(lng) - lngDeg) * 60);
  
  return `${lngDeg}${lngDir}${lngMin.toString().padStart(2, '0')}', ${latDeg}${latDir}${latMin.toString().padStart(2, '0')}'`;
}