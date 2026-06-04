/* eslint-disable @typescript-eslint/no-unused-vars */

export type AyanamsaType = 'lahiri' | 'raman' | 'krishnamurti' | 'fagan-bradley' | 'djwhal-khool';

interface AyanamsaConfig {
  zeroYear: number;
  rate: number;
}

const AYANAMSA_CONFIGS: Record<AyanamsaType, AyanamsaConfig> = {
  'lahiri': { zeroYear: 285, rate: 50.2719 },
  'raman': { zeroYear: 397, rate: 50.33 },
  'krishnamurti': { zeroYear: 291, rate: 50.2388475 },
  'fagan-bradley': { zeroYear: 221, rate: 50.25 },
  'djwhal-khool': { zeroYear: 232, rate: 50.302748 },
};

function dateToJulianDay(date: Date): number {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hour = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;

  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }

  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);

  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + hour / 24 + B - 1524.5;
}

function yearToJulianDay(year: number): number {
  return dateToJulianDay(new Date(Date.UTC(year, 0, 1, 12, 0, 0)));
}

export function calculateAyanamsa(jd: number, type: AyanamsaType = 'lahiri'): number {
  const config = AYANAMSA_CONFIGS[type];
  const zeroJd = yearToJulianDay(config.zeroYear);
  const yearsSinceZero = (jd - zeroJd) / 365.25;
  const ayanamsaArcsec = yearsSinceZero * config.rate;
  return ayanamsaArcsec / 3600.0;
}

export function calculateAyanamsaForYear(year: number, type: AyanamsaType = 'lahiri'): number {
  const jd = yearToJulianDay(year);
  return calculateAyanamsa(jd, type);
}

export function tropicalToSidereal(longitude: number, ayanamsa: number): number {
  return ((longitude - ayanamsa) % 360 + 360) % 360;
}

export function siderealToTropical(longitude: number, ayanamsa: number): number {
  return ((longitude + ayanamsa) % 360 + 360) % 360;
}
