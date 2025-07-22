/* eslint-disable @typescript-eslint/no-unused-vars */

// Admin panel color schemes
export const synapsasColors = {
  blue: '#6bdbff',
  green: '#51bd94', 
  purple: '#ff91e9',
  yellow: '#f2e356',
  red: '#ff91e9', // Using purple as red replacement
  indigo: '#6bdbff', // Using blue as indigo replacement
  orange: '#f97316',
  gray: '#6b7280'
} as const;

export type SynapsasColor = keyof typeof synapsasColors;

// Common admin component classes
export const adminClasses = {
  // Panels and containers
  panel: 'bg-white border border-black',
  panelHeader: 'p-6 border-b border-black',
  panelContent: 'p-6',
  
  // Cards
  card: 'bg-white border border-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/25',
  cardHeader: 'p-4 border-b border-black',
  cardContent: 'p-4',
  
  // Buttons
  primaryButton: 'px-6 py-2 font-open-sans text-sm bg-black text-white font-semibold border-2 border-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/25',
  secondaryButton: 'px-4 py-2 font-open-sans text-sm bg-white text-black font-semibold border-2 border-black transition-all duration-300 hover:bg-gray-50',
  dangerButton: 'px-4 py-2 font-open-sans text-sm bg-red-600 text-white font-semibold border-2 border-red-600 transition-all duration-300 hover:bg-red-700',
  
  // Form elements
  input: 'w-full px-3 py-2 border border-black focus:outline-none focus:border-black font-open-sans',
  select: 'w-full px-3 py-2 border border-black focus:outline-none focus:border-black font-open-sans',
  textarea: 'w-full px-3 py-2 border border-black focus:outline-none focus:border-black font-open-sans resize-vertical',
  
  // Status indicators
  statusSuccess: 'bg-green-50 border-green-200 text-green-800',
  statusError: 'bg-red-50 border-red-200 text-red-800',
  statusWarning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  statusInfo: 'bg-blue-50 border-blue-200 text-blue-800',
  
  // Typography
  heading1: 'font-space-grotesk text-3xl font-bold text-black mb-2',
  heading2: 'font-space-grotesk text-2xl font-bold text-black mb-2',
  heading3: 'font-space-grotesk text-lg font-semibold text-black mb-2',
  body: 'font-open-sans text-sm text-black/70',
  label: 'font-open-sans text-xs text-black font-medium'
} as const;

// Helper functions for generating admin styles
export function getStatusClasses(status: 'success' | 'error' | 'warning' | 'info'): string {
  const statusMap = {
    success: adminClasses.statusSuccess,
    error: adminClasses.statusError,
    warning: adminClasses.statusWarning,
    info: adminClasses.statusInfo
  };
  return statusMap[status];
}

export function getSynapsasColorValue(color: SynapsasColor): string {
  return synapsasColors[color];
}

export function createMetricCardStyle(color: SynapsasColor): React.CSSProperties {
  return {
    backgroundColor: getSynapsasColorValue(color)
  };
}

// Tab styles for admin interfaces
export function getTabClasses(isActive: boolean, hasRightBorder: boolean = true): string {
  const baseClasses = 'px-6 py-4 font-space-grotesk font-semibold text-center transition-colors';
  const activeClasses = isActive ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100';
  const borderClasses = hasRightBorder ? 'border-r border-black' : '';
  
  return `${baseClasses} ${activeClasses} ${borderClasses}`.trim();
}

// Toggle switch styles
export function getToggleSwitchClasses(isActive: boolean): {
  container: string;
  slider: string;
} {
  return {
    container: `relative w-12 h-6 border-2 border-black transition-colors ${
      isActive ? 'bg-black' : 'bg-white'
    }`,
    slider: `absolute top-0.5 w-4 h-4 bg-white border border-black transition-transform ${
      isActive ? 'translate-x-5' : 'translate-x-0.5'
    }`
  };
}

// Full-width breakout utility (used in several admin pages)
export const fullWidthBreakout = 'w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]';

// Common spacing utilities for admin layouts
export const adminSpacing = {
  sectionGap: 'mb-8',
  cardGap: 'mb-6',
  elementGap: 'mb-4',
  smallGap: 'mb-2'
} as const;