/* eslint-disable @typescript-eslint/no-unused-vars */
import { User, UserPrivacySettings, BirthData } from '@/types/user';
import { UserProfile } from '@/types/database';

/**
 * Utility functions for transforming between User and UserProfile types
 */
export class UserTransformations {
  /**
   * Convert database UserProfile to application User type
   */
  static toUser(profile: UserProfile): User {
    console.log("🔍 [UserTransformations] Converting profile to user:", profile);
    console.log("🔍 [UserTransformations] Profile date fields:", {
      createdAt: profile.createdAt,
      createdAtType: typeof profile.createdAt,
      updatedAt: profile.updatedAt,
      updatedAtType: typeof profile.updatedAt
    });
    
    const user: User = {
      id: profile.id,
      username: profile.username,
      email: profile.email,
      profilePictureUrl: profile.profilePictureUrl,
      authProvider: profile.authProvider,
      createdAt: new Date(profile.createdAt),
      updatedAt: new Date(profile.updatedAt),
      
      // Convert birth data to nested object
      birthData: this.extractBirthData(profile),
      
      sunSign: profile.sunSign,
      stelliumSigns: profile.stelliumSigns,
      stelliumHouses: profile.stelliumHouses,
      hasNatalChart: profile.hasNatalChart ?? false,
      
      // Subscription tier
      subscriptionTier: profile.subscriptionTier,
      
      // Convert privacy settings to nested object
      privacy: this.extractPrivacySettings(profile)
    };
    
    return user;
  }

  /**
   * Convert application User type to database UserProfile
   */
  static fromUser(user: User): UserProfile {
    const profile: UserProfile = {
      id: user.id,
      username: user.username,
      email: user.email,
      profilePictureUrl: user.profilePictureUrl,
      authProvider: user.authProvider,
      createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : user.createdAt,
      updatedAt: user.updatedAt instanceof Date ? user.updatedAt.toISOString() : user.updatedAt,
      
      // Flatten birth data
      ...this.flattenBirthData(user.birthData),
      
      sunSign: user.sunSign,
      stelliumSigns: user.stelliumSigns,
      stelliumHouses: user.stelliumHouses,
      hasNatalChart: user.hasNatalChart,
      
      // Subscription tier
      subscriptionTier: user.subscriptionTier,
      
      // Flatten privacy settings
      ...this.flattenPrivacySettings(user.privacy)
    };
    
    return profile;
  }

  /**
   * Extract birth data from flattened profile
   */
  private static extractBirthData(profile: UserProfile): BirthData | undefined {
    if (
      profile.dateOfBirth && 
      profile.timeOfBirth && 
      profile.locationOfBirth && 
      profile.coordinates
    ) {
      return {
        dateOfBirth: profile.dateOfBirth,
        timeOfBirth: profile.timeOfBirth,
        locationOfBirth: profile.locationOfBirth,
        coordinates: profile.coordinates
      };
    }
    
    return undefined;
  }

  /**
   * Extract privacy settings from flattened profile
   */
  private static extractPrivacySettings(profile: UserProfile): UserPrivacySettings {
    return {
      showZodiacPublicly: profile.showZodiacPublicly ?? false,
      showStelliumsPublicly: profile.showStelliumsPublicly ?? false,
      showBirthInfoPublicly: profile.showBirthInfoPublicly ?? false,
      allowDirectMessages: profile.allowDirectMessages ?? true,
      showOnlineStatus: profile.showOnlineStatus ?? true,
    };
  }

  /**
   * Flatten birth data for database storage
   */
  private static flattenBirthData(birthData?: BirthData): Partial<UserProfile> {
    if (!birthData) {
      return {
        dateOfBirth: undefined,
        timeOfBirth: undefined,
        locationOfBirth: undefined,
        coordinates: undefined
      };
    }

    return {
      dateOfBirth: birthData.dateOfBirth,
      timeOfBirth: birthData.timeOfBirth,
      locationOfBirth: birthData.locationOfBirth,
      coordinates: birthData.coordinates
    };
  }

  /**
   * Flatten privacy settings for database storage
   */
  private static flattenPrivacySettings(privacy: UserPrivacySettings): Pick<UserProfile, 
    'showZodiacPublicly' | 'showStelliumsPublicly' | 'showBirthInfoPublicly' | 'allowDirectMessages' | 'showOnlineStatus'
  > {
    return {
      showZodiacPublicly: privacy.showZodiacPublicly,
      showStelliumsPublicly: privacy.showStelliumsPublicly,
      showBirthInfoPublicly: privacy.showBirthInfoPublicly,
      allowDirectMessages: privacy.allowDirectMessages,
      showOnlineStatus: privacy.showOnlineStatus,
    };
  }

  /**
   * Create default privacy settings
   */
  static createDefaultPrivacySettings(): UserPrivacySettings {
    return {
      showZodiacPublicly: false,
      showStelliumsPublicly: false,
      showBirthInfoPublicly: false,
      allowDirectMessages: true,
      showOnlineStatus: true,
    };
  }

  /**
   * Validate user data completeness
   */
  static validateUserCompleteness(user: User): {
    isProfileComplete: boolean;
    hasBirthData: boolean;
    hasPrivacySettings: boolean;
    missingFields: string[];
  } {
    const missingFields: string[] = [];

    if (!user.username || user.username.trim() === '') {
      missingFields.push('username');
    }

    const hasBirthData = !!(
      user.birthData?.dateOfBirth &&
      user.birthData?.timeOfBirth &&
      user.birthData?.locationOfBirth &&
      user.birthData?.coordinates?.lat &&
      user.birthData?.coordinates?.lon
    );

    if (!hasBirthData) {
      missingFields.push('birthData');
    }

    const hasPrivacySettings = user.privacy !== undefined;
    if (!hasPrivacySettings) {
      missingFields.push('privacy');
    }

    return {
      isProfileComplete: missingFields.length === 0,
      hasBirthData,
      hasPrivacySettings,
      missingFields
    };
  }

  /**
   * Merge partial user updates with existing user
   */
  static mergeUserUpdates(existing: User, updates: Partial<User>): User {
    return {
      ...existing,
      ...updates,
      updatedAt: new Date(),
      
      // Handle nested objects properly
      birthData: updates.birthData ? {
        ...existing.birthData,
        ...updates.birthData
      } : existing.birthData,
      
      privacy: updates.privacy ? {
        ...existing.privacy,
        ...updates.privacy
      } : existing.privacy
    };
  }
}