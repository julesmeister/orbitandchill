import { BirthData } from './user';

// Re-export BirthData for backwards compatibility
export type { BirthData } from './user';

// Coordinates interface
export interface Coordinates {
  lat: string;
  lon: string;
}

// Main Person interface
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

// API Request/Response interfaces
export interface CreatePersonRequest {
  userId: string;
  name: string;
  relationship: 'self' | 'friend' | 'family' | 'partner' | 'colleague' | 'other';
  birthData: BirthData;
  notes?: string;
  isDefault?: boolean;
}

export interface UpdatePersonRequest {
  personId: string;
  userId: string;
  updates: Partial<{
    name: string;
    relationship: 'self' | 'friend' | 'family' | 'partner' | 'colleague' | 'other';
    birthData: BirthData;
    notes: string;
    isDefault: boolean;
  }>;
}

export interface DeletePersonRequest {
  personId: string;
  userId: string;
}

export interface PersonFilters {
  userId: string;
  relationship?: 'self' | 'friend' | 'family' | 'partner' | 'colleague' | 'other';
  isDefault?: boolean;
  limit?: number;
  offset?: number;
}

// Database row interface (snake_case from database)
export interface PersonRow {
  id: string;
  user_id: string;
  name: string;
  relationship: 'self' | 'friend' | 'family' | 'partner' | 'colleague' | 'other';
  date_of_birth: string;
  time_of_birth: string;
  location_of_birth: string;
  coordinates: string; // JSON string
  notes?: string;
  is_default: number; // SQLite boolean (0/1)
  created_at: string;
  updated_at: string;
}

// Response interfaces
export interface PersonResponse {
  success: boolean;
  person?: Person;
  error?: string;
  message?: string;
}

export interface PeopleResponse {
  success: boolean;
  people?: Person[];
  count?: number;
  error?: string;
}

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