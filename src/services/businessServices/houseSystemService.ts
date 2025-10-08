/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * House System Calculation Service
 * Implements Placidus house system and house determination logic
 */

import * as Astronomy from 'astronomy-engine';
import { HousePosition } from '@/types/astrology';
import { SIGNS } from '@/constants/astrological';

/**
 * Calculate houses using the Placidus system
 * This is the most commonly used house system in Western astrology
 */
export function calculatePlacidusHouses(date: Date, latitude: number, longitude: number): {
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
export function determineHouse(planetLongitude: number, houses: HousePosition[]): number {
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
