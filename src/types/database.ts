/* eslint-disable @typescript-eslint/no-unused-vars */

// Core database interfaces for IndexedDB storage
export interface UserProfile {
  id: string;
  username: string;
  email?: string;
  profilePictureUrl?: string;
  authProvider: "google" | "anonymous";
  createdAt: string; // ISO string for storage
  updatedAt: string; // ISO string for storage
  
  // Birth data (flattened for easier database storage)
  dateOfBirth?: string;
  timeOfBirth?: string;
  locationOfBirth?: string;
  coordinates?: {
    lat: string;
    lon: string;
  };
  
  // Astrology data
  sunSign?: string;
  stelliumSigns?: string[];
  stelliumHouses?: string[];
  hasNatalChart?: boolean;
  
  // Subscription and premium features
  subscriptionTier?: "free" | "premium" | "pro";
  
  // Privacy settings (flattened for easier database storage)
  showZodiacPublicly: boolean;
  showStelliumsPublicly: boolean;
  showBirthInfoPublicly: boolean;
  allowDirectMessages: boolean;
  showOnlineStatus: boolean;
}

export interface NatalChartStorage {
  id: string;
  userId: string;
  chartData: string; // SVG or JSON data
  chartType: "natal" | "transit" | "synastry" | "composite";
  createdAt: string;
  metadata?: {
    title?: string;
    description?: string;
    theme?: string;
    personId?: string; // ID of the person this chart was generated for
  };
}

export interface CacheEntry {
  key: string;
  data: unknown;
  expiry: number;
  createdAt: string;
}

// Seeding-specific interfaces
export interface SeedUserConfig {
  id: string;
  userId: string;
  writingStyle: string;
  expertiseAreas: string[];
  responsePattern: string;
  replyProbability: number;
  votingBehavior: string;
  aiPromptTemplate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SeedingBatch {
  id: string;
  sourceType: string;
  contentInput?: string;
  aiConfig?: {
    provider: string;
    model: string;
    apiKey: string;
    temperature: number;
  };
  generationSettings?: {
    discussionsToGenerate: number;
    repliesPerDiscussion: { min: number; max: number };
    maxNestingDepth: number;
    contentVariation: number;
  };
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdDiscussions: number;
  createdReplies: number;
  createdVotes: number;
  errorMessage?: string;
  createdAt: string;
  completedAt?: string;
}

// Database configuration interface
export interface DatabaseSchema {
  [tableName: string]: string;
  userProfiles: string;
  natalCharts: string;
  people: string;
  cache: string;
  seedUserConfigs: string;
  seedingBatches: string;
}

export const DATABASE_VERSION = 2;
export const DATABASE_NAME = "LuckstrologyDB";

export const DATABASE_INDEXES: DatabaseSchema = {
  userProfiles: "id, username, authProvider, updatedAt, email",
  natalCharts: "id, userId, chartType, createdAt",
  people: "id, userId, name, relationship, updatedAt, isDefault",
  cache: "key, expiry",
  seedUserConfigs: "id, userId, writingStyle, isActive, updatedAt",
  seedingBatches: "id, status, createdAt, completedAt",
};