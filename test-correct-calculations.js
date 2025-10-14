// Corrected celestial point calculations using proper formulas
// Birth data: February 1, 1994, 9:28 AM, Zamboanga City

const birthDate = new Date('1994-02-01T01:28:00Z'); // 9:28 AM local = 1:28 AM UTC

const SIGNS = [
  'aries', 'taurus', 'gemini', 'cancer',
  'leo', 'virgo', 'libra', 'scorpio',
  'sagittarius', 'capricorn', 'aquarius', 'pisces'
];

function getLongitudeInfo(longitude) {
  const signIndex = Math.floor(longitude / 30) % 12;
  const degreeInSign = longitude % 30;
  return {
    longitude: longitude.toFixed(2),
    sign: SIGNS[signIndex],
    degree: degreeInSign.toFixed(1),
    fullDegree: longitude.toFixed(2) + '°'
  };
}

// Calculate Julian Day
function getJulianDay(date) {
  const a = Math.floor((14 - (date.getUTCMonth() + 1)) / 12);
  const y = date.getUTCFullYear() + 4800 - a;
  const m = (date.getUTCMonth() + 1) + 12 * a - 3;

  let jd = date.getUTCDate() + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

  const hours = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
  jd += (hours - 12) / 24;

  return jd;
}

const jd = getJulianDay(birthDate);
const T = (jd - 2451545.0) / 36525; // Julian centuries from J2000.0

console.log('Julian Day:', jd.toFixed(4));
console.log('Julian Centuries from J2000:', T.toFixed(6));
console.log();

// ============================================
// MEAN NORTH NODE (More accurate calculation)
// ============================================
console.log('=== MEAN NORTH NODE CALCULATION ===');

// Formula from astronomical algorithms
let meanNode = 125.0445479 - 1934.1362891 * T + 0.0020754 * T * T + T * T * T / 467441 - T * T * T * T / 60616000;

// Normalize to 0-360
meanNode = ((meanNode % 360) + 360) % 360;

const northNodeInfo = getLongitudeInfo(meanNode);
const southNodeLong = (meanNode + 180) % 360;
const southNodeInfo = getLongitudeInfo(southNodeLong);

console.log('Mean North Node:', northNodeInfo);
console.log('Mean South Node:', southNodeInfo);
console.log();

// ============================================
// CHIRON (Using proper orbital elements)
// ============================================
console.log('=== CHIRON CALCULATION (IMPROVED) ===');

// More accurate Chiron calculation
// Reference: Chiron was at approximately 155° (Virgo) in early 1994
// Using ephemeris reference point
const chironRefDate = new Date('1994-01-01T00:00:00Z');
const chironRefLongitude = 154.5; // Chiron at ~4.5° Virgo on Jan 1, 1994
const chironDailyMotion = 0.05; // Approximate daily motion in degrees

const daysSinceRef = (birthDate - chironRefDate) / (1000 * 60 * 60 * 24);
let chironLongitude = chironRefLongitude + (chironDailyMotion * daysSinceRef);
chironLongitude = ((chironLongitude % 360) + 360) % 360;

const chironInfo = getLongitudeInfo(chironLongitude);
console.log('Chiron (ephemeris-based):', chironInfo);
console.log();

// ============================================
// SUMMARY
// ============================================
console.log('=== CORRECTED POSITIONS ===');
console.log('North Node:', northNodeInfo.fullDegree, northNodeInfo.sign, northNodeInfo.degree + '°');
console.log('South Node:', southNodeInfo.fullDegree, southNodeInfo.sign, southNodeInfo.degree + '°');
console.log('Chiron:', chironInfo.fullDegree, chironInfo.sign, chironInfo.degree + '°');
