/* eslint-disable @typescript-eslint/no-unused-vars */

export interface AspectInfo {
  interpretation: string;
  type: 'harmonious' | 'challenging' | 'neutral';
  icon: string;
  color: string;
}

export const getAspectType = (aspectName: string): AspectInfo['type'] => {
  const aspectTypes: Record<string, AspectInfo['type']> = {
    conjunction: 'neutral',
    sextile: 'harmonious',
    square: 'challenging',
    trine: 'harmonious',
    opposition: 'challenging',
    quincunx: 'challenging'
  };
  return aspectTypes[aspectName] || 'neutral';
};

export const getAspectIcon = (aspectType: AspectInfo['type']): string => {
  const icons: Record<AspectInfo['type'], string> = {
    harmonious: 'faHeart', // FontAwesome heart for positive aspects
    challenging: 'faBolt', // FontAwesome lightning bolt for challenging aspects
    neutral: 'faCircle' // FontAwesome circle for neutral aspects
  };
  return icons[aspectType];
};

export const getAspectColor = (aspectType: AspectInfo['type']): string => {
  const colors: Record<AspectInfo['type'], string> = {
    harmonious: 'text-green-600',
    challenging: 'text-red-600',
    neutral: 'text-blue-600'
  };
  return colors[aspectType];
};