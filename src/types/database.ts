import { BirthData } from './user';
import { Person } from './people';

// Database interfaces
export interface DatabaseUser {
  id: string;
  username: string;
  email?: string;
  profilePictureUrl?: string;
  authProvider: "google" | "anonymous";
  createdAt: string;
  updatedAt: string;
}

export interface DatabasePerson extends Omit<Person, 'birthData' | 'createdAt' | 'updatedAt'> {
  dateOfBirth: string;
  timeOfBirth: string;
  locationOfBirth: string;
  coordinates: {
    lat: string;
    lon: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface DatabaseChart {
  id: string;
  userId: string;
  chartData: string;
  chartType: "natal" | "transit" | "synastry" | "composite";
  createdAt: string;
  metadata?: {
    title?: string;
    description?: string;
    theme?: string;
  };
}

export interface DatabaseSeedingBatch {
  id: string;
  userId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CacheEntry {
  key: string;
  value: string;
  expiry: number;
}

export interface NatalChartStorage {
  id: string;
  userId: string;
  chartData: string;
  chartType: "natal" | "transit" | "synastry" | "composite";
  createdAt: string;
  metadata?: {
    title?: string;
    description?: string;
    theme?: string;
    userId?: string;
  };
}

export interface UserProfile {
  id: string;
  username: string;
  email?: string;
  profilePictureUrl?: string;
  authProvider: "google" | "anonymous";
  createdAt: string;
  updatedAt: string;
  dateOfBirth?: string;
  timeOfBirth?: string;
  locationOfBirth?: string;
  coordinates?: { lat: string; lon: string; };
  sunSign?: string;
  stelliumSigns?: string[];
  stelliumHouses?: string[];
  hasNatalChart?: boolean;
  showZodiacPublicly: boolean;
  showStelliumsPublicly: boolean;
  showBirthInfoPublicly: boolean;
  allowDirectMessages: boolean;
  showOnlineStatus: boolean;
  subscriptionTier?: "free" | "premium" | "pro";
}

export interface SeedUserConfig {
  id: string;
  batchId: string;
  userId?: string;
  name: string;
  personality: string;
  astroProfile: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  replyProbability?: number;
  aiPromptTemplate?: string;
  writingStyle?: string;
  expertiseAreas?: string[];
  responsePattern?: string;
  votingBehavior?: string;
  isActive?: boolean;
}

export interface SeedingBatch {
  id: string;
  userId: string;
  status: string;
  totalUsers: number;
  completedUsers: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  errorMessage?: string;
  createdDiscussions?: number;
  createdReplies?: number;
  createdVotes?: number;
}