/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Age-specific destiny arcana calculations for Matrix of Destiny
 * Based on the DestinyMatrix implementation algorithm
 */

// Reduction function to keep numbers within 1-22 range (Major Arcana)
const reduceNumber = (number: number): number => {
  let num = number;
  if (number > 22) {
    num = (number % 10) + Math.floor(number / 10);
  }
  return num;
};

// Extract birth date components and calculate base points
const calculateBasePoints = (dateOfBirth: string) => {
  const [year, month, day] = dateOfBirth.split('-').map(Number);
  
  // A point: Day (reduced)
  const aPoint = day > 22 ? reduceNumber(day) : day;
  
  // B point: Month
  const bPoint = month;
  
  // C point: Year (sum of digits, reduced)
  const yearSum = year.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  const cPoint = yearSum > 22 ? reduceNumber(yearSum) : yearSum;
  
  // D point: A + B + C (reduced)
  const dPoint = reduceNumber(aPoint + bPoint + cPoint);
  
  // Additional matrix points
  const fPoint = reduceNumber(aPoint + bPoint);  // Past Heritage
  const gPoint = reduceNumber(bPoint + cPoint);  // Talents
  const hPoint = reduceNumber(dPoint + aPoint);  // Material Karma
  const iPoint = reduceNumber(cPoint + dPoint);  // Spiritual Task
  
  return { aPoint, bPoint, cPoint, dPoint, fPoint, gPoint, hPoint, iPoint };
};


// Main function to calculate all age destiny arcana using correct bracket system
export const calculateAgeDestinyArcana = (dateOfBirth: string): Record<number, number> => {
  const basePoints = calculateBasePoints(dateOfBirth);
  const ageDestinyMap: Record<number, number> = {};
  
  // Edge A-F: Ages 1-7 (7 unique destiny points)
  const afpoint = reduceNumber(basePoints.aPoint + basePoints.fPoint);
  const af1point = reduceNumber(basePoints.aPoint + afpoint);
  const af2point = reduceNumber(basePoints.aPoint + af1point);
  const af3point = reduceNumber(afpoint + af1point);
  const af4point = reduceNumber(afpoint + basePoints.fPoint);
  const af5point = reduceNumber(afpoint + af4point);
  const af6point = reduceNumber(af4point + basePoints.fPoint);
  
  ageDestinyMap[1] = af2point;
  ageDestinyMap[2] = af1point;
  ageDestinyMap[3] = af3point;
  ageDestinyMap[4] = afpoint;
  ageDestinyMap[5] = af4point;
  ageDestinyMap[6] = af5point;
  ageDestinyMap[7] = af6point;
  
  // Edge F-B: Ages 11-17 (7 unique destiny points)
  const fbpoint = reduceNumber(basePoints.fPoint + basePoints.bPoint);
  const fb1point = reduceNumber(basePoints.fPoint + fbpoint);
  const fb2point = reduceNumber(basePoints.fPoint + fb1point);
  const fb3point = reduceNumber(fbpoint + fb1point);
  const fb4point = reduceNumber(fbpoint + basePoints.bPoint);
  const fb5point = reduceNumber(fbpoint + fb4point);
  const fb6point = reduceNumber(fb4point + basePoints.bPoint);
  
  ageDestinyMap[11] = fb2point;
  ageDestinyMap[12] = fb1point;
  ageDestinyMap[13] = fb3point;
  ageDestinyMap[14] = fbpoint;
  ageDestinyMap[15] = fb4point;
  ageDestinyMap[16] = fb5point;
  ageDestinyMap[17] = fb6point;
  
  // Edge B-G: Ages 21-27 (7 unique destiny points)
  const bgpoint = reduceNumber(basePoints.bPoint + basePoints.gPoint);
  const bg1point = reduceNumber(basePoints.bPoint + bgpoint);
  const bg2point = reduceNumber(basePoints.bPoint + bg1point);
  const bg3point = reduceNumber(bgpoint + bg1point);
  const bg4point = reduceNumber(bgpoint + basePoints.gPoint);
  const bg5point = reduceNumber(bgpoint + bg4point);
  const bg6point = reduceNumber(bg4point + basePoints.gPoint);
  
  ageDestinyMap[21] = bg2point;
  ageDestinyMap[22] = bg1point;
  ageDestinyMap[23] = bg3point;
  ageDestinyMap[24] = bgpoint;
  ageDestinyMap[25] = bg4point;
  ageDestinyMap[26] = bg5point;
  ageDestinyMap[27] = bg6point;
  
  // Edge G-C: Ages 31-37 (7 unique destiny points)
  const gcpoint = reduceNumber(basePoints.gPoint + basePoints.cPoint);
  const gc1point = reduceNumber(basePoints.gPoint + gcpoint);
  const gc2point = reduceNumber(basePoints.gPoint + gc1point);
  const gc3point = reduceNumber(gcpoint + gc1point);
  const gc4point = reduceNumber(gcpoint + basePoints.cPoint);
  const gc5point = reduceNumber(gcpoint + gc4point);
  const gc6point = reduceNumber(gc4point + basePoints.cPoint);
  
  ageDestinyMap[31] = gc2point;
  ageDestinyMap[32] = gc1point;
  ageDestinyMap[33] = gc3point;
  ageDestinyMap[34] = gcpoint;
  ageDestinyMap[35] = gc4point;
  ageDestinyMap[36] = gc5point;
  ageDestinyMap[37] = gc6point;
  
  // Edge C-H: Ages 41-47 (7 unique destiny points)
  const cipoint = reduceNumber(basePoints.cPoint + basePoints.iPoint);
  const ci1point = reduceNumber(basePoints.cPoint + cipoint);
  const ci2point = reduceNumber(basePoints.cPoint + ci1point);
  const ci3point = reduceNumber(cipoint + ci1point);
  const ci4point = reduceNumber(cipoint + basePoints.iPoint);
  const ci5point = reduceNumber(cipoint + ci4point);
  const ci6point = reduceNumber(ci4point + basePoints.iPoint);
  
  ageDestinyMap[41] = ci2point;
  ageDestinyMap[42] = ci1point;
  ageDestinyMap[43] = ci3point;
  ageDestinyMap[44] = cipoint;
  ageDestinyMap[45] = ci4point;
  ageDestinyMap[46] = ci5point;
  ageDestinyMap[47] = ci6point;
  
  // Edge H-D: Ages 51-57 (7 unique destiny points)
  const idpoint = reduceNumber(basePoints.iPoint + basePoints.dPoint);
  const id1point = reduceNumber(basePoints.iPoint + idpoint);
  const id2point = reduceNumber(basePoints.iPoint + id1point);
  const id3point = reduceNumber(idpoint + id1point);
  const id4point = reduceNumber(idpoint + basePoints.dPoint);
  const id5point = reduceNumber(idpoint + id4point);
  const id6point = reduceNumber(id4point + basePoints.dPoint);
  
  ageDestinyMap[51] = id2point;
  ageDestinyMap[52] = id1point;
  ageDestinyMap[53] = id3point;
  ageDestinyMap[54] = idpoint;
  ageDestinyMap[55] = id4point;
  ageDestinyMap[56] = id5point;
  ageDestinyMap[57] = id6point;
  
  // Edge D-I: Ages 61-67 (7 unique destiny points)
  const dhpoint = reduceNumber(basePoints.dPoint + basePoints.hPoint);
  const dh1point = reduceNumber(basePoints.dPoint + dhpoint);
  const dh2point = reduceNumber(basePoints.dPoint + dh1point);
  const dh3point = reduceNumber(dhpoint + dh1point);
  const dh4point = reduceNumber(dhpoint + basePoints.hPoint);
  const dh5point = reduceNumber(dhpoint + dh4point);
  const dh6point = reduceNumber(dh4point + basePoints.hPoint);
  
  ageDestinyMap[61] = dh2point;
  ageDestinyMap[62] = dh1point;
  ageDestinyMap[63] = dh3point;
  ageDestinyMap[64] = dhpoint;
  ageDestinyMap[65] = dh4point;
  ageDestinyMap[66] = dh5point;
  ageDestinyMap[67] = dh6point;
  
  // Edge I-A: Ages 71-77 (7 unique destiny points)
  const hapoint = reduceNumber(basePoints.hPoint + basePoints.aPoint);
  const ha1point = reduceNumber(basePoints.hPoint + hapoint);
  const ha2point = reduceNumber(basePoints.hPoint + ha1point);
  const ha3point = reduceNumber(hapoint + ha1point);
  const ha4point = reduceNumber(hapoint + basePoints.aPoint);
  const ha5point = reduceNumber(hapoint + ha4point);
  const ha6point = reduceNumber(ha4point + basePoints.aPoint);
  
  ageDestinyMap[71] = ha2point;
  ageDestinyMap[72] = ha1point;
  ageDestinyMap[73] = ha3point;
  ageDestinyMap[74] = hapoint;
  ageDestinyMap[75] = ha4point;
  ageDestinyMap[76] = ha5point;
  ageDestinyMap[77] = ha6point;
  
  return ageDestinyMap;
};

// Helper function to get destiny arcana for a specific age
export const getDestinyArcanaForAge = (dateOfBirth: string, age: number): number | null => {
  if (age < 0 || age > 79) return null;
  
  const ageDestinyMap = calculateAgeDestinyArcana(dateOfBirth);
  return ageDestinyMap[age] || null;
};

// Helper function to get all ages with their destiny arcana
export const getAllAgeDestinyArcana = (dateOfBirth: string): Array<{ age: number; arcana: number }> => {
  const ageDestinyMap = calculateAgeDestinyArcana(dateOfBirth);
  
  return Object.entries(ageDestinyMap).map(([age, arcana]) => ({
    age: parseInt(age),
    arcana
  })).sort((a, b) => a.age - b.age);
};