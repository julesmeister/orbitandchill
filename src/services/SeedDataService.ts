/* eslint-disable @typescript-eslint/no-unused-vars */
import { UserProfile, SeedUserConfig } from '@/types/database';

export class SeedDataService {
  /**
   * Generate seed user profiles with realistic data
   */
  static generateSeedUsers(): UserProfile[] {
    const now = new Date().toISOString();
    
    return [
      {
        id: 'seed_user_astromaven',
        username: 'AstroMaven',
        email: 'astromaven@example.com',
        authProvider: 'anonymous' as const,
        subscriptionTier: 'premium' as const,
        createdAt: now,
        updatedAt: now,
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
        createdAt: now,
        updatedAt: now,
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
        createdAt: now,
        updatedAt: now,
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
        createdAt: now,
        updatedAt: now,
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
        createdAt: now,
        updatedAt: now,
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
  }

  /**
   * Generate seed user configurations for AI behavior
   */
  static generateSeedUserConfigs(): SeedUserConfig[] {
    const now = new Date().toISOString();
    
    return [
      {
        id: 'config_astromaven',
        batchId: 'batch_default',
        userId: 'seed_user_astromaven',
        name: 'AstroMaven',
        personality: 'professional_educator',
        astroProfile: 'Experienced astrologer with focus on natal charts',
        status: 'active',
        writingStyle: 'professional_educational',
        expertiseAreas: ['natal_charts', 'transits', 'aspects', 'houses'],
        responsePattern: 'detailed_explanations',
        replyProbability: 0.8,
        votingBehavior: 'upvotes_quality_content',
        aiPromptTemplate: 'Respond as AstroMaven, a professional astrologer. Be educational, detailed, and helpful. Reference chart elements when appropriate.',
        isActive: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'config_starseeker23',
        batchId: 'batch_default',
        userId: 'seed_user_starseeker23',
        name: 'StarSeeker23',
        personality: 'curious_enthusiast',
        astroProfile: 'Enthusiastic beginner learning astrology',
        status: 'active',
        writingStyle: 'enthusiastic_personal',
        expertiseAreas: ['relationships', 'personal_experience', 'learning'],
        responsePattern: 'questions_and_sharing',
        replyProbability: 0.6,
        votingBehavior: 'supportive_upvoting',
        aiPromptTemplate: 'Respond as StarSeeker23, an enthusiastic student. Share personal experiences, ask thoughtful questions, and show excitement about learning.',
        isActive: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'config_cosmicskeptic',
        batchId: 'batch_default_configs',
        userId: 'seed_user_cosmicskeptic',
        name: 'CosmicSkeptic',
        personality: 'analytical_questioning',
        astroProfile: 'research_focused',
        status: 'active',
        writingStyle: 'analytical_questioning',
        expertiseAreas: ['research', 'statistics', 'methodology', 'critical_thinking'],
        responsePattern: 'challenging_questions',
        replyProbability: 0.4,
        votingBehavior: 'selective_critical',
        aiPromptTemplate: 'Respond as CosmicSkeptic, analytically minded. Ask challenging questions, seek evidence, and approach topics from a scientific perspective.',
        isActive: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'config_moonchild92',
        batchId: 'batch_default_configs',
        userId: 'seed_user_moonchild92',
        name: 'MoonChild92',
        personality: 'beginner_enthusiastic',
        astroProfile: 'curious_beginner',
        status: 'active',
        writingStyle: 'beginner_enthusiastic',
        expertiseAreas: ['learning', 'basic_concepts', 'curiosity'],
        responsePattern: 'grateful_questions',
        replyProbability: 0.5,
        votingBehavior: 'thankful_upvoting',
        aiPromptTemplate: 'Respond as MoonChild92, a beginner. Ask basic questions, show gratitude for help, and express excitement about learning.',
        isActive: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'config_retroguru',
        batchId: 'batch_default_configs',
        userId: 'seed_user_retroguru',
        name: 'RetroGuru',
        personality: 'specialist_timing',
        astroProfile: 'timing_specialist',
        status: 'active',
        writingStyle: 'specialist_timing',
        expertiseAreas: ['retrogrades', 'timing', 'transits', 'electional'],
        responsePattern: 'timing_advice',
        replyProbability: 0.7,
        votingBehavior: 'expertise_focused',
        aiPromptTemplate: 'Respond as RetroGuru, a timing specialist. Focus on planetary movements, retrograde periods, and optimal timing.',
        isActive: true,
        createdAt: now,
        updatedAt: now
      }
    ];
  }

  /**
   * Get seed user by persona type
   */
  static getSeedUserByPersona(persona: 'expert' | 'student' | 'skeptic' | 'beginner' | 'specialist'): UserProfile | null {
    const users = this.generateSeedUsers();
    
    const personaMap: Record<string, string> = {
      'expert': 'seed_user_astromaven',
      'student': 'seed_user_starseeker23',
      'skeptic': 'seed_user_cosmicskeptic',
      'beginner': 'seed_user_moonchild92',
      'specialist': 'seed_user_retroguru'
    };

    const userId = personaMap[persona];
    return users.find(user => user.id === userId) || null;
  }

  /**
   * Get seed config by persona type
   */
  static getSeedConfigByPersona(persona: 'expert' | 'student' | 'skeptic' | 'beginner' | 'specialist'): SeedUserConfig | null {
    const configs = this.generateSeedUserConfigs();
    
    const personaMap: Record<string, string> = {
      'expert': 'config_astromaven',
      'student': 'config_starseeker23',
      'skeptic': 'config_cosmicskeptic',
      'beginner': 'config_moonchild92',
      'specialist': 'config_retroguru'
    };

    const configId = personaMap[persona];
    return configs.find(config => config.id === configId) || null;
  }

  /**
   * Generate random variation of seed user
   */
  static generateVariationOfSeedUser(baseUser: UserProfile, suffix?: string): UserProfile {
    const now = new Date().toISOString();
    const randomSuffix = suffix || Math.random().toString(36).substring(2, 7);
    
    return {
      ...baseUser,
      id: `${baseUser.id}_${randomSuffix}`,
      username: `${baseUser.username}${randomSuffix}`,
      email: baseUser.email?.replace('@example.com', `_${randomSuffix}@example.com`),
      createdAt: now,
      updatedAt: now
    };
  }

  /**
   * Validate seed data integrity
   */
  static validateSeedData(): {
    isValid: boolean;
    errors: string[];
    users: number;
    configs: number;
  } {
    const users = this.generateSeedUsers();
    const configs = this.generateSeedUserConfigs();
    const errors: string[] = [];

    // Check that each user has a corresponding config
    for (const user of users) {
      const hasConfig = configs.some(config => config.userId === user.id);
      if (!hasConfig) {
        errors.push(`Missing config for user ${user.username} (${user.id})`);
      }
    }

    // Check that each config has a corresponding user
    for (const config of configs) {
      const hasUser = users.some(user => user.id === config.userId);
      if (!hasUser) {
        errors.push(`Config ${config.id} references non-existent user ${config.userId}`);
      }
    }

    // Validate required fields
    for (const user of users) {
      if (!user.username.trim()) {
        errors.push(`User ${user.id} has empty username`);
      }
      if (!user.authProvider) {
        errors.push(`User ${user.id} missing authProvider`);
      }
    }

    for (const config of configs) {
      if ((config.replyProbability ?? 0) < 0 || (config.replyProbability ?? 0) > 1) {
        errors.push(`Config ${config.id} has invalid replyProbability: ${config.replyProbability}`);
      }
      if (!config.aiPromptTemplate?.trim()) {
        errors.push(`Config ${config.id} missing aiPromptTemplate`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      users: users.length,
      configs: configs.length
    };
  }
}