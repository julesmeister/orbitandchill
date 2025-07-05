import Dexie, { Table } from "dexie";
import { PersonStorage } from "@/types/people";

// Storage interface that matches our database schema
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

// Chart interface - using simplified version for now, will migrate to full NatalChart type later
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

export class LuckstrologyDatabase extends Dexie {
  userProfiles!: Table<UserProfile>;
  natalCharts!: Table<NatalChartStorage>;
  people!: Table<PersonStorage>;
  cache!: Table<CacheEntry>;

  constructor() {
    super("LuckstrologyDB");

    this.version(1).stores({
      userProfiles: "id, username, authProvider, updatedAt, email",
      natalCharts: "id, userId, chartType, createdAt",
      people: "id, userId, name, relationship, updatedAt, isDefault",
      cache: "key, expiry",
    });
  }

  // Cache methods
  async setCache(
    key: string,
    data: unknown,
    ttlMinutes: number = 60
  ): Promise<void> {
    const expiry = Date.now() + ttlMinutes * 60 * 1000;
    await this.cache.put({
      key,
      data,
      expiry,
      createdAt: new Date().toISOString(),
    });
  }

  async getCache<T>(key: string): Promise<T | null> {
    const entry = await this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiry) {
      await this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  async clearExpiredCache(): Promise<void> {
    const now = Date.now();
    await this.cache.where("expiry").below(now).delete();
  }

  // User profile methods
  async saveUserProfile(profile: UserProfile): Promise<void> {
    await this.userProfiles.put(profile);
  }

  async getUserProfile(id: string): Promise<UserProfile | null> {
    const profile = await this.userProfiles.get(id);
    return profile || null;
  }

  async getCurrentUserProfile(): Promise<UserProfile | null> {
    try {
      // Get the most recently updated profile
      const profiles = await this.userProfiles.toArray();
      
      if (profiles.length === 0) {
        return null;
      }

      // Sort by updatedAt and get the most recent
      profiles.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      
      const mostRecentProfile = profiles[0];
      return mostRecentProfile;
    } catch (error) {
      console.error('🔍 [getCurrentUserProfile] Error fetching profile:', error);
      return null;
    }
  }

  // Utility method to convert UserProfile to User type
  userProfileToUser(profile: UserProfile): import("../types/user").User {
      createdAt: profile.createdAt,
      createdAtType: typeof profile.createdAt,
      updatedAt: profile.updatedAt,
      updatedAtType: typeof profile.updatedAt
    });
    
    const user = {
      id: profile.id,
      username: profile.username,
      email: profile.email,
      profilePictureUrl: profile.profilePictureUrl,
      authProvider: profile.authProvider,
      createdAt: new Date(profile.createdAt),
      updatedAt: new Date(profile.updatedAt),
      
      // Convert birth data to nested object
      birthData: profile.dateOfBirth && profile.timeOfBirth && profile.locationOfBirth && profile.coordinates
        ? {
            dateOfBirth: profile.dateOfBirth,
            timeOfBirth: profile.timeOfBirth,
            locationOfBirth: profile.locationOfBirth,
            coordinates: profile.coordinates
          }
        : undefined,
      
      sunSign: profile.sunSign,
      stelliumSigns: profile.stelliumSigns,
      stelliumHouses: profile.stelliumHouses,
      hasNatalChart: profile.hasNatalChart,
      
      // Subscription tier
      subscriptionTier: profile.subscriptionTier,
      
      // Convert privacy settings to nested object
      privacy: {
        showZodiacPublicly: profile.showZodiacPublicly,
        showStelliumsPublicly: profile.showStelliumsPublicly,
        showBirthInfoPublicly: profile.showBirthInfoPublicly,
        allowDirectMessages: profile.allowDirectMessages,
        showOnlineStatus: profile.showOnlineStatus,
      }
    };
    
      createdAtType: typeof user.createdAt,
      createdAtIsDate: user.createdAt instanceof Date,
      updatedAtType: typeof user.updatedAt,
      updatedAtIsDate: user.updatedAt instanceof Date
    });
    
    return user;
  }

  // Utility method to convert User type to UserProfile for storage
  userToUserProfile(user: import("../types/user").User): UserProfile {
      createdAt: user.createdAt,
      createdAtType: typeof user.createdAt,
      createdAtIsDate: user.createdAt instanceof Date,
      updatedAt: user.updatedAt,
      updatedAtType: typeof user.updatedAt,
      updatedAtIsDate: user.updatedAt instanceof Date
    });
    
    const profile = {
      id: user.id,
      username: user.username,
      email: user.email,
      profilePictureUrl: user.profilePictureUrl,
      authProvider: user.authProvider,
      createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : user.createdAt,
      updatedAt: user.updatedAt instanceof Date ? user.updatedAt.toISOString() : user.updatedAt,
      
      // Flatten birth data
      dateOfBirth: user.birthData?.dateOfBirth,
      timeOfBirth: user.birthData?.timeOfBirth,
      locationOfBirth: user.birthData?.locationOfBirth,
      coordinates: user.birthData?.coordinates,
      
      sunSign: user.sunSign,
      stelliumSigns: user.stelliumSigns,
      stelliumHouses: user.stelliumHouses,
      hasNatalChart: user.hasNatalChart,
      
      // Subscription tier
      subscriptionTier: user.subscriptionTier,
      
      // Flatten privacy settings
      showZodiacPublicly: user.privacy.showZodiacPublicly,
      showStelliumsPublicly: user.privacy.showStelliumsPublicly,
      showBirthInfoPublicly: user.privacy.showBirthInfoPublicly,
      allowDirectMessages: user.privacy.allowDirectMessages,
      showOnlineStatus: user.privacy.showOnlineStatus,
    };
    
    return profile;
  }

  // Chart methods
  async saveChart(chart: NatalChartStorage): Promise<void> {
    await this.natalCharts.put(chart);
  }

  async getUserCharts(userId: string): Promise<NatalChartStorage[]> {
    const charts = await this.natalCharts
      .where("userId")
      .equals(userId)
      .toArray();

    // Sort by createdAt in descending order (most recent first)
    return charts.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async deleteChart(chartId: string): Promise<void> {
    await this.natalCharts.delete(chartId);
  }

  // People management methods
  async savePerson(person: PersonStorage): Promise<void> {
    await this.people.put(person);
  }

  async getPerson(id: string): Promise<PersonStorage | null> {
    const person = await this.people.get(id);
    return person || null;
  }

  async getUserPeople(userId: string): Promise<PersonStorage[]> {
    const people = await this.people
      .where("userId")
      .equals(userId)
      .toArray();

    // Sort by updatedAt in descending order, with default person first
    return people.sort((a, b) => {
      if (a.isDefault && !b.isDefault) return -1;
      if (!a.isDefault && b.isDefault) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }

  async getDefaultPerson(userId: string): Promise<PersonStorage | null> {
    const person = await this.people
      .where("userId")
      .equals(userId)
      .and(p => p.isDefault === true)
      .first();
    return person || null;
  }

  async setDefaultPerson(userId: string, personId: string): Promise<void> {
    // First, remove default flag from all user's people
    const userPeople = await this.getUserPeople(userId);
    const updatePromises = userPeople.map(person => 
      this.people.update(person.id, { isDefault: false })
    );
    await Promise.all(updatePromises);

    // Then set the new default
    await this.people.update(personId, { isDefault: true });
  }

  async deletePerson(personId: string): Promise<void> {
    await this.people.delete(personId);
  }

  // Utility method to convert PersonStorage to Person type
  personStorageToPerson(storage: PersonStorage): import("../types/people").Person {
    return {
      id: storage.id,
      userId: storage.userId,
      name: storage.name,
      relationship: storage.relationship,
      birthData: {
        dateOfBirth: storage.dateOfBirth,
        timeOfBirth: storage.timeOfBirth,
        locationOfBirth: storage.locationOfBirth,
        coordinates: storage.coordinates
      },
      notes: storage.notes,
      createdAt: new Date(storage.createdAt),
      updatedAt: new Date(storage.updatedAt),
      isDefault: storage.isDefault
    };
  }

  // Utility method to convert Person type to PersonStorage for database
  personToPersonStorage(person: import("../types/people").Person): PersonStorage {
    return {
      id: person.id,
      userId: person.userId,
      name: person.name,
      relationship: person.relationship,
      dateOfBirth: person.birthData.dateOfBirth,
      timeOfBirth: person.birthData.timeOfBirth,
      locationOfBirth: person.birthData.locationOfBirth,
      coordinates: person.birthData.coordinates,
      notes: person.notes,
      createdAt: person.createdAt.toISOString(),
      updatedAt: person.updatedAt.toISOString(),
      isDefault: person.isDefault
    };
  }
}

export const db = new LuckstrologyDatabase();
