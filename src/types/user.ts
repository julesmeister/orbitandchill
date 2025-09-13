// Birth data interface for natal chart generation
export interface BirthData {
  dateOfBirth: string;
  timeOfBirth: string;
  locationOfBirth: string;
  coordinates: {
    lat: string;
    lon: string;
  };
  timezone?: string;
}

// Privacy settings interface
export interface UserPrivacySettings {
  showZodiacPublicly: boolean;
  showStelliumsPublicly: boolean;
  showBirthInfoPublicly: boolean;
  allowDirectMessages: boolean;
  showOnlineStatus: boolean;
}

// Core user interface
export interface User {
  id: string; // unique identifier (Google ID or generated ID for anonymous)
  username: string; // public display name (Google display name or "Anonymous")
  email?: string; // optional, provided by Google login
  profilePictureUrl?: string; // optional URL to profile picture, provided by Google
  preferredAvatar?: string; // optional path to user's chosen avatar
  authProvider: "google" | "anonymous"; // To know how the user is authenticated
  createdAt: Date;
  updatedAt: Date;
  
  // Birth and chart data
  birthData?: BirthData; // Complete birth data for chart generation
  sunSign?: string;
  stelliumSigns?: string[];
  stelliumHouses?: string[];
  detailedStelliums?: Array<{
    type: 'sign' | 'house';
    sign?: string;
    house?: number;
    planets: { name: string; sign: string; house: number }[];
  }>;
  hasNatalChart?: boolean;
  
  // Subscription and premium features
  subscriptionTier?: "free" | "premium" | "pro";
  
  // Admin and role management
  role?: "user" | "admin" | "moderator";
  permissions?: string[];
  isActive?: boolean;
  
  // Privacy settings
  privacy: UserPrivacySettings;
}

// User profile for public display (filtered based on privacy settings)
export interface PublicUserProfile {
  id: string;
  username: string;
  profilePictureUrl?: string;
  sunSign?: string; // only if privacy.showZodiacPublicly is true
  stelliumSigns?: string[]; // only if privacy.showStelliumsPublicly is true
  stelliumHouses?: string[]; // only if privacy.showStelliumsPublicly is true
  hasNatalChart: boolean;
  createdAt: Date;
}