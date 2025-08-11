/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Person types and interfaces for birth data management
 */

export interface Coordinates {
  lat: string;
  lon: string;
}

export interface BirthData {
  dateOfBirth: string;
  timeOfBirth: string;
  locationOfBirth: string;
  coordinates: Coordinates | null;
}

export interface Person {
  id: string;
  userId: string;
  name: string;
  relationship: string;
  birthData: BirthData;
  notes?: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePersonRequest {
  userId: string;
  name: string;
  relationship: string;
  birthData: BirthData;
  notes?: string | null;
  isDefault?: boolean;
}

export interface UpdatePersonRequest {
  personId: string;
  userId: string;
  updates: Partial<{
    name: string;
    relationship: string;
    birthData: BirthData;
    notes: string | null;
    isDefault: boolean;
  }>;
}

export interface DeletePersonRequest {
  personId: string;
  userId: string;
}

export interface PersonFilters {
  userId: string;
  relationship?: string;
  isDefault?: boolean;
  limit?: number;
  offset?: number;
}

/**
 * Database row interface (snake_case from database)
 */
export interface PersonRow {
  id: string;
  user_id: string;
  name: string;
  relationship: string;
  date_of_birth: string;
  time_of_birth: string;
  location_of_birth: string;
  coordinates: string; // JSON string
  notes?: string | null;
  is_default: number; // SQLite boolean (0/1)
  created_at: string;
  updated_at: string;
}

/**
 * Response interfaces
 */
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