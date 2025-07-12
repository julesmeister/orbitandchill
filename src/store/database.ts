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

export class LuckstrologyDatabase extends Dexie {
  userProfiles!: Table<UserProfile>;
  natalCharts!: Table<NatalChartStorage>;
  people!: Table<PersonStorage>;
  cache!: Table<CacheEntry>;
  seedUserConfigs!: Table<SeedUserConfig>;
  seedingBatches!: Table<SeedingBatch>;

  constructor() {
    super("LuckstrologyDB");

    this.version(2).stores({
      userProfiles: "id, username, authProvider, updatedAt, email",
      natalCharts: "id, userId, chartType, createdAt",
      people: "id, userId, name, relationship, updatedAt, isDefault",
      cache: "key, expiry",
      seedUserConfigs: "id, userId, writingStyle, isActive, updatedAt",
      seedingBatches: "id, status, createdAt, completedAt",
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
    console.log("🔍 [getCurrentUserProfile] Fetching current user profile from IndexedDB");
    try {
      // Get the most recently updated profile
      const profiles = await this.userProfiles.toArray();
      console.log("🔍 [getCurrentUserProfile] Found profiles in database:", profiles.length);
      
      if (profiles.length === 0) {
        console.log("🔍 [getCurrentUserProfile] No profiles found in database");
        return null;
      }

      // Sort by updatedAt and get the most recent
      profiles.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      
      const mostRecentProfile = profiles[0];
      console.log("🔍 [getCurrentUserProfile] Most recent profile:", mostRecentProfile);
      return mostRecentProfile;
    } catch (error) {
      console.error('🔍 [getCurrentUserProfile] Error fetching profile:', error);
      return null;
    }
  }

  // Utility method to convert UserProfile to User type
  userProfileToUser(profile: UserProfile): import("../types/user").User {
    console.log("🔍 [userProfileToUser] Converting profile to user:", profile);
    console.log("🔍 [userProfileToUser] Profile date fields:", {
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
    
    console.log("🔍 [userProfileToUser] Final user object:", user);
    console.log("🔍 [userProfileToUser] User date field types after conversion:", {
      createdAtType: typeof user.createdAt,
      createdAtIsDate: user.createdAt instanceof Date,
      updatedAtType: typeof user.updatedAt,
      updatedAtIsDate: user.updatedAt instanceof Date
    });
    
    return user;
  }

  // Utility method to convert User type to UserProfile for storage
  userToUserProfile(user: import("../types/user").User): UserProfile {
    console.log("🔍 [userToUserProfile] Converting user to profile:", user);
    console.log("🔍 [userToUserProfile] Date field types:", {
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
    
    console.log("🔍 [userToUserProfile] Final profile object:", profile);
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

  // Seed user configuration methods
  async saveSeedUserConfig(config: SeedUserConfig): Promise<void> {
    await this.seedUserConfigs.put(config);
  }

  async getSeedUserConfig(id: string): Promise<SeedUserConfig | null> {
    const config = await this.seedUserConfigs.get(id);
    return config || null;
  }

  async getAllSeedUserConfigs(): Promise<SeedUserConfig[]> {
    const configs = await this.seedUserConfigs
      .where("isActive")
      .equals(1)
      .toArray();
    
    return configs.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  async getSeedUserConfigByUserId(userId: string): Promise<SeedUserConfig | null> {
    const config = await this.seedUserConfigs
      .where("userId")
      .equals(userId)
      .first();
    return config || null;
  }

  async deleteSeedUserConfig(id: string): Promise<void> {
    await this.seedUserConfigs.delete(id);
  }

  // Seeding batch methods
  async saveSeedingBatch(batch: SeedingBatch): Promise<void> {
    await this.seedingBatches.put(batch);
  }

  async getSeedingBatch(id: string): Promise<SeedingBatch | null> {
    const batch = await this.seedingBatches.get(id);
    return batch || null;
  }

  async getAllSeedingBatches(): Promise<SeedingBatch[]> {
    const batches = await this.seedingBatches.toArray();
    return batches.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async updateSeedingBatchStatus(
    id: string, 
    status: SeedingBatch['status'], 
    stats?: Partial<Pick<SeedingBatch, 'createdDiscussions' | 'createdReplies' | 'createdVotes' | 'errorMessage'>>
  ): Promise<void> {
    const updateData: Partial<SeedingBatch> = { status };
    
    if (stats) {
      Object.assign(updateData, stats);
    }
    
    if (status === 'completed' || status === 'failed') {
      updateData.completedAt = new Date().toISOString();
    }
    
    await this.seedingBatches.update(id, updateData);
  }

  async deleteSeedingBatch(id: string): Promise<void> {
    await this.seedingBatches.delete(id);
  }

  // Utility method to create initial seed users
  async createInitialSeedUsers(): Promise<void> {
    const seedUsers = [
      {
        id: 'seed_user_astromaven',
        username: 'AstroMaven',
        email: 'astromaven@example.com',
        authProvider: 'anonymous' as const,
        subscriptionTier: 'premium' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        dateOfBirth: '1975-04-15',
        timeOfBirth: '15:45',
        locationOfBirth: 'Los Angeles, CA',
        coordinates: { lat: '34.0522', lon: '-118.2437' },
        hasNatalChart: true,
        showZodiacPublicly: true,
        showStelliumsPublicly: true,
        showBirthInfoPublicly: false,
        allowDirectMessages: true,
        showOnlineStatus: true
      },
      {
        id: 'seed_user_starseeker23',
        username: 'StarSeeker23',
        email: 'starseeker23@example.com',
        authProvider: 'anonymous' as const,
        subscriptionTier: 'free' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        dateOfBirth: '1990-09-03',
        timeOfBirth: '07:30',
        locationOfBirth: 'New York, NY',
        coordinates: { lat: '40.7128', lon: '-74.0060' },
        hasNatalChart: true,
        showZodiacPublicly: true,
        showStelliumsPublicly: false,
        showBirthInfoPublicly: false,
        allowDirectMessages: true,
        showOnlineStatus: true
      },
      {
        id: 'seed_user_cosmicskeptic',
        username: 'CosmicSkeptic',
        email: 'cosmicskeptic@example.com',
        authProvider: 'anonymous' as const,
        subscriptionTier: 'free' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        dateOfBirth: '1985-12-10',
        timeOfBirth: '',
        locationOfBirth: '',
        coordinates: { lat: '', lon: '' },
        hasNatalChart: false,
        showZodiacPublicly: false,
        showStelliumsPublicly: false,
        showBirthInfoPublicly: false,
        allowDirectMessages: false,
        showOnlineStatus: false
      },
      {
        id: 'seed_user_moonchild92',
        username: 'MoonChild92',
        email: 'moonchild92@example.com',
        authProvider: 'anonymous' as const,
        subscriptionTier: 'free' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        hasNatalChart: false,
        showZodiacPublicly: false,
        showStelliumsPublicly: false,
        showBirthInfoPublicly: false,
        allowDirectMessages: true,
        showOnlineStatus: true
      },
      {
        id: 'seed_user_retroguru',
        username: 'RetroGuru',
        email: 'retroguru@example.com',
        authProvider: 'anonymous' as const,
        subscriptionTier: 'premium' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        dateOfBirth: '1980-06-21',
        timeOfBirth: '12:00',
        locationOfBirth: 'San Francisco, CA',
        coordinates: { lat: '37.7749', lon: '-122.4194' },
        hasNatalChart: true,
        showZodiacPublicly: true,
        showStelliumsPublicly: true,
        showBirthInfoPublicly: true,
        allowDirectMessages: true,
        showOnlineStatus: true
      }
    ];

    const seedConfigs = [
      {
        id: 'config_astromaven',
        userId: 'seed_user_astromaven',
        writingStyle: 'professional_educational',
        expertiseAreas: ['natal_charts', 'transits', 'aspects', 'houses'],
        responsePattern: 'detailed_explanations',
        replyProbability: 0.8,
        votingBehavior: 'upvotes_quality_content',
        aiPromptTemplate: 'Respond as AstroMaven, a professional astrologer. Be educational, detailed, and helpful. Reference chart elements when appropriate.',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'config_starseeker23',
        userId: 'seed_user_starseeker23',
        writingStyle: 'enthusiastic_personal',
        expertiseAreas: ['relationships', 'personal_experience', 'learning'],
        responsePattern: 'questions_and_sharing',
        replyProbability: 0.6,
        votingBehavior: 'supportive_upvoting',
        aiPromptTemplate: 'Respond as StarSeeker23, an enthusiastic student. Share personal experiences, ask thoughtful questions, and show excitement about learning.',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'config_cosmicskeptic',
        userId: 'seed_user_cosmicskeptic',
        writingStyle: 'analytical_questioning',
        expertiseAreas: ['research', 'statistics', 'methodology', 'critical_thinking'],
        responsePattern: 'challenging_questions',
        replyProbability: 0.4,
        votingBehavior: 'selective_critical',
        aiPromptTemplate: 'Respond as CosmicSkeptic, analytically minded. Ask challenging questions, seek evidence, and approach topics from a scientific perspective.',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'config_moonchild92',
        userId: 'seed_user_moonchild92',
        writingStyle: 'beginner_enthusiastic',
        expertiseAreas: ['learning', 'basic_concepts', 'curiosity'],
        responsePattern: 'grateful_questions',
        replyProbability: 0.5,
        votingBehavior: 'thankful_upvoting',
        aiPromptTemplate: 'Respond as MoonChild92, a beginner. Ask basic questions, show gratitude for help, and express excitement about learning.',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'config_retroguru',
        userId: 'seed_user_retroguru',
        writingStyle: 'specialist_timing',
        expertiseAreas: ['retrogrades', 'timing', 'transits', 'electional'],
        responsePattern: 'timing_advice',
        replyProbability: 0.7,
        votingBehavior: 'expertise_focused',
        aiPromptTemplate: 'Respond as RetroGuru, a timing specialist. Focus on planetary movements, retrograde periods, and optimal timing.',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    // Create user profiles
    for (const user of seedUsers) {
      await this.saveUserProfile(user);
    }

    // Create seed user configurations
    for (const config of seedConfigs) {
      await this.saveSeedUserConfig(config);
    }
  }
}

export const db = new LuckstrologyDatabase();
