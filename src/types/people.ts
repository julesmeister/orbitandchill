import { BirthData } from './user';

export interface Person {
  id: string;
  userId: string; // The user who created this person entry
  name: string;
  relationship: 'self' | 'friend' | 'family' | 'partner' | 'colleague' | 'other';
  birthData: BirthData;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  isDefault?: boolean; // Mark if this is the user's primary/self entry
}

export interface PersonStorage {
  id: string;
  userId: string;
  name: string;
  relationship: 'self' | 'friend' | 'family' | 'partner' | 'colleague' | 'other';
  dateOfBirth: string;
  timeOfBirth: string;
  locationOfBirth: string;
  coordinates: {
    lat: string;
    lon: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
  isDefault?: boolean;
}

export type PersonFormData = Omit<Person, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;

export interface SharedChart {
  id: string;
  shareToken: string;
  title?: string;
  subjectName: string;
  dateOfBirth: string;
  timeOfBirth: string;
  locationOfBirth: string;
  latitude: number;
  longitude: number;
  chartData: string; // SVG content
  createdAt: string;
  metadata?: {
    name?: string;
    birthData?: BirthData;
    chartData?: any;
  };
}