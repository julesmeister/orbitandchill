// Quick test script to validate coordinate corrections
const fs = require('fs');

// Simulate the corrected coordinate function
function geoToSVGWithCorrections(lat, lng, mapDimensions = { width: 1000, height: 507.209 }) {
  // Apply base coordinate transformation with global -27px offset
  let x = ((lng + 180) / 360) * mapDimensions.width - 27;
  let y = ((90 - lat) / 180) * mapDimensions.height;
  
  // Determine zone
  let zone = 'fallback';
  if (lat >= -35 && lat <= 70 && lng >= -25 && lng <= 50) {
    zone = 'europe';
  } else if (lat >= 15 && lat <= 75 && lng >= -170 && lng <= -50) {
    zone = 'north_america';
  } else if (lat >= -10 && lat <= 70 && lng >= 50 && lng <= 180) {
    zone = 'asia';
  } else if (lat >= -60 && lat <= 15 && lng >= -85 && lng <= -30) {
    zone = 'south_america';
  } else if (lat >= -50 && lat <= 70 && ((lng >= 120 && lng <= 180) || (lng >= -180 && lng <= -120))) {
    zone = 'pacific';
  }
  
  // Apply corrections based on zone
  switch (zone) {
    case 'europe':
      if (Math.abs(lat - 51.5074) < 2 && Math.abs(lng - (-0.1278)) < 2) {
        y -= 18; // London adjustment
      }
      break;
      
    case 'north_america':
      if (Math.abs(lat - 40.7128) < 5 && Math.abs(lng - (-74.006)) < 10) {
        x += 19; y -= 13; // NYC adjustment
      } else if (Math.abs(lat - 24.1426) < 5 && Math.abs(lng - (-110.3128)) < 10) {
        x += 9; y -= 9; // Baja adjustment
      } else {
        x += 15; y -= 10; // General North America
      }
      break;
      
    case 'asia':
      if (Math.abs(lat - 35.6762) < 5 && Math.abs(lng - 139.6503) < 10) {
        x -= 23; y -= 9; // Tokyo adjustment
      } else {
        x -= 20; y -= 5; // General Asia
      }
      break;
      
    case 'pacific':
      if (Math.abs(lat - (-41.2924)) < 5 && Math.abs(lng - 174.7787) < 10) {
        x -= 40; y += 12; // Wellington adjustment
      } else {
        x -= 35; y += 8; // General Pacific
      }
      break;
      
    case 'south_america':
      if (Math.abs(lat - (-34.9011)) < 5 && Math.abs(lng - (-56.1645)) < 10) {
        x += 8; y += 5; // Montevideo adjustment
      } else {
        x += 5; y += 3; // General South America
      }
      break;
  }
  
  return { x: Math.max(0, Math.min(1000, x)), y: Math.max(0, Math.min(507.209, y)), zone };
}

// Test reference points
const referencePoints = [
  { name: "London", lat: 51.5074, lng: -0.1278, expected: { x: 472.6, y: 53.7 } },
  { name: "New York", lat: 40.7128, lng: -74.006, expected: { x: 286.4, y: 116.4 } },
  { name: "Tokyo", lat: 35.6762, lng: 139.6503, expected: { x: 298.8, y: 134.1 } },
  { name: "Wellington", lat: -41.2924, lng: 174.7787, expected: { x: 393.6, y: 390.8 } },
  { name: "Montevideo", lat: -34.9011, lng: -56.1645, expected: { x: 429.9, y: 359.6 } },
  { name: "La Paz, BCS", lat: 24.1426, lng: -110.3128, expected: { x: 214.3, y: 168.0 } }
];

console.log('Testing Coordinate Corrections:');
console.log('================================');

referencePoints.forEach(point => {
  const calculated = geoToSVGWithCorrections(point.lat, point.lng);
  const errorX = calculated.x - point.expected.x;
  const errorY = calculated.y - point.expected.y;
  const errorDistance = Math.sqrt(errorX * errorX + errorY * errorY);
  
  console.log(`\n${point.name}:`);
  console.log(`  Coordinates: (${point.lat}, ${point.lng})`);
  console.log(`  Zone: ${calculated.zone}`);
  console.log(`  Expected: (${point.expected.x}, ${point.expected.y})`);
  console.log(`  Calculated: (${calculated.x.toFixed(1)}, ${calculated.y.toFixed(1)})`);
  console.log(`  Error: (${errorX.toFixed(1)}, ${errorY.toFixed(1)}) = ${errorDistance.toFixed(1)}px`);
  console.log(`  Status: ${errorDistance <= 5 ? '✓ PRECISE' : errorDistance <= 10 ? '✓ ACCURATE' : '✗ NEEDS FIX'}`);
});

const averageError = referencePoints.reduce((sum, point) => {
  const calculated = geoToSVGWithCorrections(point.lat, point.lng);
  const errorX = calculated.x - point.expected.x;
  const errorY = calculated.y - point.expected.y;
  const errorDistance = Math.sqrt(errorX * errorX + errorY * errorY);
  return sum + errorDistance;
}, 0) / referencePoints.length;

console.log('\n================================');
console.log(`Average Error: ${averageError.toFixed(1)}px`);
console.log(`Status: ${averageError <= 5 ? 'EXCELLENT' : averageError <= 10 ? 'GOOD' : 'NEEDS IMPROVEMENT'}`);