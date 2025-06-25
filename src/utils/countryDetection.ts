/**
 * Country Detection Utilities
 * Detect which SVG country shape contains given coordinates
 */

import { getCountryName } from './countryNames';

export interface CountryInfo {
  countryId: string;
  countryName: string;
}

/**
 * Detect which country an SVG point belongs to by checking SVG group elements
 * @param svgX - X coordinate in SVG viewBox units (0-1000)
 * @param svgY - Y coordinate in SVG viewBox units (0-507.209)
 * @param svgElement - The SVG element containing country shapes
 * @returns CountryInfo if found, null otherwise
 */
export function detectCountryFromSVGPoint(
  svgX: number, 
  svgY: number, 
  svgElement: SVGSVGElement
): CountryInfo | null {
  try {
    // Create a point at the SVG coordinates
    const point = svgElement.createSVGPoint();
    point.x = svgX;
    point.y = svgY;
    
    // Get all country groups (they have IDs)
    const countryGroups = svgElement.querySelectorAll('g[id]');
    
    for (const group of countryGroups) {
      const paths = group.querySelectorAll('path:not(.astrocartography-line)');
      
      for (const path of paths) {
        try {
          // Check if the point is inside this path
          if ((path as SVGPathElement).isPointInFill && (path as SVGPathElement).isPointInFill(point)) {
            const countryId = group.id;
            const countryName = getCountryName(countryId);
            return {
              countryId,
              countryName
            };
          }
        } catch {
          // Some browsers/paths might not support isPointInFill, continue
          continue;
        }
      }
    }
    
    return null;
  } catch (error) {
    console.warn('Error detecting country from SVG point:', error);
    return null;
  }
}

/**
 * Alternative method using bounding box approximation
 * Fallback when isPointInFill is not available
 */
export function detectCountryFromSVGPointFallback(
  svgX: number,
  svgY: number,
  svgElement: SVGSVGElement
): CountryInfo | null {
  try {
    const countryGroups = svgElement.querySelectorAll('g[id]');
    let bestMatch: { countryId: string; distance: number } | null = null;
    
    for (const group of countryGroups) {
      const paths = group.querySelectorAll('path:not(.astrocartography-line)');
      
      for (const path of paths) {
        try {
          const bbox = (path as SVGPathElement).getBBox();
          
          // Check if point is within bounding box
          if (svgX >= bbox.x && svgX <= bbox.x + bbox.width &&
              svgY >= bbox.y && svgY <= bbox.y + bbox.height) {
            
            // Calculate distance from center of bounding box
            const centerX = bbox.x + bbox.width / 2;
            const centerY = bbox.y + bbox.height / 2;
            const distance = Math.sqrt(
              Math.pow(svgX - centerX, 2) + Math.pow(svgY - centerY, 2)
            );
            
            if (!bestMatch || distance < bestMatch.distance) {
              bestMatch = {
                countryId: group.id,
                distance
              };
            }
          }
        } catch {
          continue;
        }
      }
    }
    
    if (bestMatch) {
      return {
        countryId: bestMatch.countryId,
        countryName: getCountryName(bestMatch.countryId)
      };
    }
    
    return null;
  } catch (error) {
    console.warn('Error in fallback country detection:', error);
    return null;
  }
}

/**
 * Main function to detect country - tries primary method, falls back to approximation
 */
export function detectCountryFromCoordinates(
  svgX: number,
  svgY: number,
  svgElement: SVGSVGElement
): CountryInfo | null {
  // Try primary method first
  let result = detectCountryFromSVGPoint(svgX, svgY, svgElement);
  
  // If that fails, try fallback method
  if (!result) {
    result = detectCountryFromSVGPointFallback(svgX, svgY, svgElement);
  }
  
  return result;
}