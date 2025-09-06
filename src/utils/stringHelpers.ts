/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Safely capitalizes the first letter of a string
 * Returns 'Unknown' if the input is null, undefined, or empty
 */
export function capitalizeFirst(str: string | null | undefined): string {
  if (!str) return 'Unknown';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Safely formats a sign or planet name for display
 * Returns 'Unknown' if the input is invalid
 */
export function formatCelestialName(name: string | null | undefined): string {
  if (!name) return 'Unknown';
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

/**
 * Formats a planet/sign combination for display
 * Example: "mars" in "aries" => "Mars in Aries"
 */
export function formatPlanetInSign(
  planetName: string | null | undefined, 
  signName: string | null | undefined
): string {
  const planet = capitalizeFirst(planetName);
  const sign = capitalizeFirst(signName);
  return `${planet} in ${sign}`;
}