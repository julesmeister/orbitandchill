/* eslint-disable @typescript-eslint/no-unused-vars */
import type { AstrologicalEvent } from '../../types/events';

export interface EventStyling {
  bg: string;
  text: string;
  hover: string;
  icon: string;
  bgColor: string;
}

/**
 * Get styling configuration for an event based on its properties
 */
export function getEventStyling(event: AstrologicalEvent): EventStyling {
  if (event.title.includes('⚠️')) {
    return {
      bg: 'text-black',
      text: 'text-black',
      hover: 'hover:bg-gray-50',
      icon: 'text-black',
      bgColor: '#ff91e9' // Synapsas purple for warnings/challenging
    };
  } else if (event.score >= 8) {
    return {
      bg: 'text-black',
      text: 'text-black',
      hover: 'hover:bg-gray-50',
      icon: 'text-black',
      bgColor: '#e7fff6' // Synapsas light green for high scores
    };
  } else if (event.score >= 6) {
    return {
      bg: 'text-black',
      text: 'text-black',
      hover: 'hover:bg-gray-50',
      icon: 'text-black',
      bgColor: '#6bdbff' // Synapsas blue for good scores
    };
  } else {
    return {
      bg: 'text-black',
      text: 'text-black',
      hover: 'hover:bg-gray-50',
      icon: 'text-black',
      bgColor: '#fffbed' // Synapsas light yellow for neutral/lower scores
    };
  }
}

/**
 * Get emoji icon for event based on score
 */
export function getEventIcon(score: number): string {
  if (score >= 8) return '✨';
  if (score >= 6) return '⭐';
  if (score >= 4) return '💫';
  return '⚡';
}

/**
 * Get score background color class
 */
export function getScoreBackgroundClass(event: AstrologicalEvent): string {
  if (event.title.includes('⚠️')) return 'bg-red-500';
  if (event.score >= 8) return 'bg-emerald-500';
  if (event.score >= 6) return 'bg-blue-500';
  return 'bg-slate-500';
}