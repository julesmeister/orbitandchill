/* eslint-disable @typescript-eslint/no-unused-vars */

// Chart Data Types
export interface SharedChart {
  id: string;
  shareToken: string;
  subjectName: string;
  dateOfBirth: string;
  timeOfBirth: string;
  locationOfBirth: string;
  latitude: number;
  longitude: number;
  chartData: string; // SVG content
  metadata?: any;
  createdAt?: Date;
  updatedAt?: Date;
  isPublic: boolean;
  expiresAt?: Date;
}

// Birth Data Format
export interface BirthData {
  dateOfBirth: string;
  timeOfBirth: string;
  locationOfBirth: string;
  coordinates: {
    lat: string;
    lon: string;
  };
}

// Component Props
export interface SharedChartClientProps {
  token: string;
  initialChart?: SharedChart | any | null;
}

// API Response Types
export interface SharedChartResponse {
  success: boolean;
  chart?: SharedChart;
  error?: string;
}

// Loading States
export type LoadingState = 'idle' | 'loading' | 'success' | 'error' | 'not-found';

// UI State
export interface SharedChartUIState {
  chart: SharedChart | null;
  loadingState: LoadingState;
  error: string | null;
}

// Share Options
export interface ShareOptions {
  title: string;
  text: string;
  url: string;
}

export interface ShareResult {
  success: boolean;
  method: 'native' | 'clipboard' | 'manual';
  message?: string;
}

// Feature Card Data
export interface FeatureCard {
  icon: string;
  title: string;
  description: string;
  backgroundColor: string;
}

// Navigation Link Data
export interface NavigationLink {
  href: string;
  label: string;
  icon: string;
}