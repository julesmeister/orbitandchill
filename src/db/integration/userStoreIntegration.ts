/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Integration layer between Drizzle database and Zustand user store
 * This file provides helper functions to sync data between the database and the store
 */

import { UserService, type CreateUserData, type UpdateUserData } from '../services/userService';

// Types that match your existing store interfaces
export interface User {
  id: string;
  username: string;
  email?: string;
  profilePictureUrl?: string;
  authProvider: "google" | "anonymous";
  createdAt: Date;
  updatedAt: Date;
  
  // Birth and astrological data
  birthData?: BirthData;
  sunSign?: string;
  stelliumSigns?: string[];
  stelliumHouses?: string[];
  hasNatalChart?: boolean;
  
  // Privacy controls
  privacy: UserPrivacySettings;
}

export interface BirthData {
  dateOfBirth: string;
  timeOfBirth: string;
  locationOfBirth: string;
  coordinates: {
    lat: string;
    lon: string;
  };
}

export interface UserPrivacySettings {
  showZodiacPublicly: boolean;
  showStelliumsPublicly: boolean;
  showBirthInfoPublicly: boolean;
  allowDirectMessages: boolean;
  showOnlineStatus: boolean;
}

/**
 * Convert database user to store format
 */
export function dbUserToStoreUser(dbUser: any): User {
  return {
    id: dbUser.id,
    username: dbUser.username,
    email: dbUser.email,
    profilePictureUrl: dbUser.profilePictureUrl,
    authProvider: dbUser.authProvider,
    createdAt: new Date(dbUser.createdAt),
    updatedAt: new Date(dbUser.updatedAt),
    
    // Birth data (if available)
    birthData: dbUser.dateOfBirth ? {
      dateOfBirth: dbUser.dateOfBirth,
      timeOfBirth: dbUser.timeOfBirth || '',
      locationOfBirth: dbUser.locationOfBirth || '',
      coordinates: {
        lat: dbUser.latitude?.toString() || '',
        lon: dbUser.longitude?.toString() || '',
      }
    } : undefined,
    
    sunSign: dbUser.sunSign,
    stelliumSigns: dbUser.stelliumSigns || [],
    stelliumHouses: dbUser.stelliumHouses || [],
    hasNatalChart: dbUser.hasNatalChart || false,
    
    // Privacy settings
    privacy: {
      showZodiacPublicly: dbUser.showZodiacPublicly || false,
      showStelliumsPublicly: dbUser.showStelliumsPublicly || false,
      showBirthInfoPublicly: dbUser.showBirthInfoPublicly || false,
      allowDirectMessages: dbUser.allowDirectMessages ?? true,
      showOnlineStatus: dbUser.showOnlineStatus ?? true,
    }
  };
}

/**
 * Convert store user to database format
 */
export function storeUserToDbUser(user: User): UpdateUserData {
  return {
    username: user.username,
    email: user.email,
    profilePictureUrl: user.profilePictureUrl,
    
    // Birth data
    dateOfBirth: user.birthData?.dateOfBirth,
    timeOfBirth: user.birthData?.timeOfBirth,
    locationOfBirth: user.birthData?.locationOfBirth,
    latitude: user.birthData?.coordinates.lat ? parseFloat(user.birthData.coordinates.lat) : undefined,
    longitude: user.birthData?.coordinates.lon ? parseFloat(user.birthData.coordinates.lon) : undefined,
    
    sunSign: user.sunSign,
    stelliumSigns: user.stelliumSigns,
    stelliumHouses: user.stelliumHouses,
    hasNatalChart: user.hasNatalChart,
    
    // Privacy settings
    showZodiacPublicly: user.privacy.showZodiacPublicly,
    showStelliumsPublicly: user.privacy.showStelliumsPublicly,
    showBirthInfoPublicly: user.privacy.showBirthInfoPublicly,
    allowDirectMessages: user.privacy.allowDirectMessages,
    showOnlineStatus: user.privacy.showOnlineStatus,
  };
}

/**
 * Database operations that can be used in your Zustand store
 */
export class UserStoreDBIntegration {
  /**
   * Create a new user and return in store format
   */
  static async createUser(data: CreateUserData): Promise<User> {
    const dbUser = await UserService.createUser(data);
    return dbUserToStoreUser(dbUser);
  }

  /**
   * Load user from database by ID
   */
  static async loadUser(id: string): Promise<User | null> {
    const dbUser = await UserService.getUserById(id);
    return dbUser ? dbUserToStoreUser(dbUser) : null;
  }

  /**
   * Load user from database by email
   */
  static async loadUserByEmail(email: string): Promise<User | null> {
    const dbUser = await UserService.getUserByEmail(email);
    return dbUser ? dbUserToStoreUser(dbUser) : null;
  }

  /**
   * Update user in database and return updated store format
   */
  static async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    // Convert store format to database format
    const dbUpdates = storeUserToDbUser({ ...updates } as User);
    
    const dbUser = await UserService.updateUser(id, dbUpdates);
    return dbUser ? dbUserToStoreUser(dbUser) : null;
  }

  /**
   * Update birth data specifically
   */
  static async updateBirthData(id: string, birthData: Partial<BirthData>): Promise<User | null> {
    const dbUpdates: UpdateUserData = {
      dateOfBirth: birthData.dateOfBirth,
      timeOfBirth: birthData.timeOfBirth,
      locationOfBirth: birthData.locationOfBirth,
      latitude: birthData.coordinates?.lat ? parseFloat(birthData.coordinates.lat) : undefined,
      longitude: birthData.coordinates?.lon ? parseFloat(birthData.coordinates.lon) : undefined,
      hasNatalChart: !!(birthData.dateOfBirth && birthData.timeOfBirth && birthData.locationOfBirth),
    };

    const dbUser = await UserService.updateUser(id, dbUpdates);
    return dbUser ? dbUserToStoreUser(dbUser) : null;
  }

  /**
   * Update privacy settings specifically
   */
  static async updatePrivacySettings(id: string, privacy: Partial<UserPrivacySettings>): Promise<User | null> {
    const dbUser = await UserService.updateUser(id, privacy);
    return dbUser ? dbUserToStoreUser(dbUser) : null;
  }

  /**
   * Delete user
   */
  static async deleteUser(id: string): Promise<boolean> {
    const result = await UserService.deleteUser(id);
    return !!result;
  }

  /**
   * Get public profile (respects privacy settings)
   */
  static async getPublicProfile(id: string) {
    return await UserService.getPublicProfile(id);
  }

  /**
   * Generate anonymous user ID with persistence support
   */
  static generateAnonymousId(): string {
    // Check for existing persistent ID first
    if (typeof localStorage !== 'undefined') {
      const persistentId = localStorage.getItem('luckstrology-anonymous-id');
      if (persistentId) {
        return persistentId;
      }
    }
    
    // Generate new ID and store it
    const newId = `anon_${Math.random().toString(36).substring(2, 11)}${Date.now().toString(36)}`;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('luckstrology-anonymous-id', newId);
    }
    
    return newId;
  }
}

/**
 * Helper function to migrate existing localStorage data to database
 * Call this once during transition period
 */
export async function migrateLocalStorageToDatabase(localUser: any): Promise<User | null> {
  try {
    // Check if user already exists in database
    if (localUser.id && localUser.id.startsWith('anon_')) {
      const existing = await UserService.getUserById(localUser.id);
      if (existing) {
        return dbUserToStoreUser(existing);
      }
    }

    // Create new user from localStorage data
    const userData: CreateUserData = {
      username: localUser.username || 'Anonymous',
      email: localUser.email,
      profilePictureUrl: localUser.profilePictureUrl,
      authProvider: localUser.authProvider || 'anonymous',
    };

    const dbUser = await UserService.createUser(userData);

    // Update with additional data if available
    if (localUser.birthData || localUser.sunSign || localUser.privacy) {
      const updates: UpdateUserData = {
        dateOfBirth: localUser.birthData?.dateOfBirth,
        timeOfBirth: localUser.birthData?.timeOfBirth,
        locationOfBirth: localUser.birthData?.locationOfBirth,
        latitude: localUser.birthData?.coordinates?.lat ? parseFloat(localUser.birthData.coordinates.lat) : undefined,
        longitude: localUser.birthData?.coordinates?.lon ? parseFloat(localUser.birthData.coordinates.lon) : undefined,
        sunSign: localUser.sunSign,
        stelliumSigns: localUser.stelliumSigns,
        stelliumHouses: localUser.stelliumHouses,
        hasNatalChart: localUser.hasNatalChart,
        showZodiacPublicly: localUser.privacy?.showZodiacPublicly,
        showStelliumsPublicly: localUser.privacy?.showStelliumsPublicly,
        showBirthInfoPublicly: localUser.privacy?.showBirthInfoPublicly,
        allowDirectMessages: localUser.privacy?.allowDirectMessages,
        showOnlineStatus: localUser.privacy?.showOnlineStatus,
      };

      const updatedDbUser = await UserService.updateUser(dbUser.id, updates);
      return updatedDbUser ? dbUserToStoreUser(updatedDbUser) : dbUserToStoreUser(dbUser);
    }

    return dbUserToStoreUser(dbUser);
  } catch (error) {
    console.error('Migration failed:', error);
    return null;
  }
}