// Test script to debug celestial point calculations
// Birth data: February 1, 1994, 9:28 AM, Zamboanga City (6.9214°N, 122.0790°E)

const Astronomy = require('astronomy-engine');

// Birth data
const birthDate = new Date('1994-02-01T01:28:00Z'); // 9:28 AM local = 1:28 AM UTC (UTC+8)
console.log('Birth Date (UTC):', birthDate.toISOString());

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
    degree: degreeInSign.toFixed(1)
  };
}

console.log('\n=== CHIRON CALCULATION ===');
try {
  // Orbital elements for 2060 Chiron (Epoch J2000.0)
  const semiMajorAxis = 13.7053530; // AU
  const eccentricity = 0.3831649;
  const inclination = 6.93524; // degrees
  const meanAnomalyAtEpoch = 359.46170; // degrees at J2000.0
  const longitudeOfAscendingNode = 208.65735; // degrees
  const argumentOfPerihelion = 339.58061 - longitudeOfAscendingNode; // degrees
  const orbitalPeriod = 50.39; // years

  // J2000.0 epoch
  const j2000 = new Date('2000-01-01T12:00:00Z');
  const yearsSinceEpoch = (birthDate.getTime() - j2000.getTime()) / (1000 * 60 * 60 * 24 * 365.25);

  console.log('Years since J2000:', yearsSinceEpoch.toFixed(4));

  // Calculate mean anomaly
  const meanMotion = 360 / orbitalPeriod; // degrees per year
  let meanAnomaly = (meanAnomalyAtEpoch + meanMotion * yearsSinceEpoch) % 360;
  if (meanAnomaly < 0) meanAnomaly += 360;

  console.log('Mean Anomaly:', meanAnomaly.toFixed(2));

  // Convert to radians
  const M = meanAnomaly * Math.PI / 180;
  const e = eccentricity;

  // Solve Kepler's equation
  let E = M;
  for (let i = 0; i < 10; i++) {
    const deltaE = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
    E -= deltaE;
    if (Math.abs(deltaE) < 1e-6) break;
  }

  // Calculate true anomaly
  const trueAnomaly = 2 * Math.atan2(
    Math.sqrt(1 + e) * Math.sin(E / 2),
    Math.sqrt(1 - e) * Math.cos(E / 2)
  );

  // Calculate heliocentric longitude
  const omega = argumentOfPerihelion * Math.PI / 180;
  const Omega = longitudeOfAscendingNode * Math.PI / 180;
  const i = inclination * Math.PI / 180;

  const u = trueAnomaly + omega;
  let longitude = Math.atan2(
    Math.sin(u) * Math.cos(i),
    Math.cos(u)
  ) + Omega;

  // Convert to degrees
  longitude = longitude * 180 / Math.PI;
  if (longitude < 0) longitude += 360;
  longitude = longitude % 360;

  const chironInfo = getLongitudeInfo(longitude);
  console.log('Chiron Calculated:', chironInfo);
  console.log('Expected: Virgo (~150-180°)');
} catch (error) {
  console.error('Chiron error:', error);
}

console.log('\n=== LUNAR NODES CALCULATION ===');
try {
  const astroTime = new Astronomy.AstroTime(birthDate);

  // Search for node event
  const searchStartTime = astroTime.AddDays(-30);
  const nodeEvent = Astronomy.SearchMoonNode(searchStartTime);

  console.log('Node event found:', nodeEvent ? 'YES' : 'NO');

  if (nodeEvent) {
    console.log('Node type:', nodeEvent.kind === Astronomy.NodeEventKind.Ascending ? 'Ascending (North)' : 'Descending (South)');
    console.log('Node time:', nodeEvent.time.date.toISOString());

    // Get Moon's position at node event
    const moonVector = Astronomy.GeoMoon(nodeEvent.time);
    const ecliptic = Astronomy.Ecliptic(moonVector);

    console.log('Moon ecliptic longitude at node:', ecliptic.elon.toFixed(2));

    let northNodeLongitude;
    if (nodeEvent.kind === Astronomy.NodeEventKind.Ascending) {
      northNodeLongitude = ecliptic.elon;
    } else {
      northNodeLongitude = (ecliptic.elon + 180) % 360;
    }

    const southNodeLongitude = (northNodeLongitude + 180) % 360;

    const northInfo = getLongitudeInfo(northNodeLongitude);
    const southInfo = getLongitudeInfo(southNodeLongitude);

    console.log('North Node Calculated:', northInfo);
    console.log('Expected: Scorpio (~210-240°)');
    console.log('South Node Calculated:', southInfo);
    console.log('Expected: Taurus (~30-60°)');
  }
} catch (error) {
  console.error('Lunar nodes error:', error);
}

console.log('\n=== TESTING WITH ACTUAL EPHEMERIS VALUES ===');
console.log('For Feb 1, 1994:');
console.log('Chiron should be around 155° (Virgo)');
console.log('North Node should be around 225° (Scorpio)');
console.log('South Node should be around 45° (Taurus)');
