/* eslint-disable @typescript-eslint/no-unused-vars */
import { Table } from 'dexie';
import { UserProfile } from '@/types/database';
import { User } from '@/types/user';

export class UserRepository {
  constructor(private userProfiles: Table<UserProfile>) {}

  async save(profile: UserProfile): Promise<void> {
    await this.userProfiles.put(profile);
  }

  async getById(id: string): Promise<UserProfile | null> {
    const profile = await this.userProfiles.get(id);
    return profile || null;
  }

  async getCurrent(): Promise<UserProfile | null> {
    console.log("🔍 [UserRepository] Fetching current user profile from IndexedDB");
    try {
      const profiles = await this.userProfiles.toArray();
      console.log("🔍 [UserRepository] Found profiles in database:", profiles.length);
      
      if (profiles.length === 0) {
        console.log("🔍 [UserRepository] No profiles found in database");
        return null;
      }

      // Sort by updatedAt and get the most recent
      profiles.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      
      const mostRecentProfile = profiles[0];
      console.log("🔍 [UserRepository] Most recent profile:", mostRecentProfile);
      return mostRecentProfile;
    } catch (error) {
      console.error('🔍 [UserRepository] Error fetching profile:', error);
      return null;
    }
  }

  // Transformation utilities
  toUser(profile: UserProfile): User {
    console.log("🔍 [UserRepository] Converting profile to user:", profile);
    console.log("🔍 [UserRepository] Profile date fields:", {
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
    
    return user;
  }

  fromUser(user: User): UserProfile {
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
}