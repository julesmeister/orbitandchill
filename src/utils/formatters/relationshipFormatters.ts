/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Get display text for a relationship type
 */
export const getRelationshipDisplay = (relationship: string): string => {
  const displays: Record<string, string> = {
    self: 'Self',
    partner: 'Partner',
    friend: 'Friend',
    family: 'Family',
    colleague: 'Colleague',
    other: 'Other',
  };
  return displays[relationship] || 'Other';
};

/**
 * Get SVG path data for a relationship type
 */
export const getRelationshipIconPath = (relationship: string): string => {
  const icons: Record<string, string> = {
    self: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    partner: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
    friend: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    family: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z',
    colleague: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 002 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2v-8a2 2 0 013-2V6',
    other: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  };
  return icons[relationship] || icons.other;
};

/**
 * Get color classes for relationship badges
 */
export const getRelationshipColor = (relationship: string): string => {
  const colors: Record<string, string> = {
    self: 'bg-purple-100 text-purple-800',
    partner: 'bg-pink-100 text-pink-800',
    friend: 'bg-blue-100 text-blue-800',
    family: 'bg-green-100 text-green-800',
    colleague: 'bg-yellow-100 text-yellow-800',
    other: 'bg-gray-100 text-gray-800',
  };
  return colors[relationship] || 'bg-gray-100 text-gray-800';
};