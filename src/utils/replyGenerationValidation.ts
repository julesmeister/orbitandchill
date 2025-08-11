/* eslint-disable @typescript-eslint/no-unused-vars */
import { 
  ReplyGenerationRequest, 
  DiscussionData, 
  AIConfig, 
  TimingConfig,
  MoodType 
} from '@/types/replyGeneration';
import { MoodService } from '@/services/moodService';
import { SchedulingService } from '@/services/schedulingService';

export class ReplyGenerationValidation {
  static validateRequest(body: any): ReplyGenerationRequest {
    const discussionData = this.validateDiscussionData(body.discussionData);
    const aiConfig = this.validateAIConfig(body.aiConfig);
    const replyIndex = this.validateReplyIndex(body.replyIndex);
    const selectedMood = MoodService.validateMood(body.selectedMood); // Always returns a string with 'supportive' as default
    const activePersonas = this.validateActivePersonas(body.activePersonas); // Always returns an array (empty if none)
    const timingConfig = SchedulingService.validateTimingConfig(body.timingConfig); // Always returns null or valid config

    return {
      discussionData,
      aiConfig,
      replyIndex,
      selectedMood,
      activePersonas,
      timingConfig
    };
  }

  private static validateDiscussionData(discussionData: any): DiscussionData {
    if (!discussionData || typeof discussionData !== 'object') {
      throw new Error('Discussion data is required');
    }

    if (!discussionData.transformedTitle || typeof discussionData.transformedTitle !== 'string') {
      throw new Error('Discussion title is required');
    }

    // Ensure we have required fields with defaults
    return {
      id: discussionData.id || 'unknown',
      transformedTitle: discussionData.transformedTitle.trim(),
      content: discussionData.content || '',
      createdAt: discussionData.createdAt || new Date().toISOString(),
      replies: Array.isArray(discussionData.replies) ? discussionData.replies : []
    };
  }

  private static validateAIConfig(aiConfig: any): AIConfig {
    if (!aiConfig || typeof aiConfig !== 'object') {
      throw new Error('AI configuration is required');
    }

    if (!aiConfig.provider || typeof aiConfig.provider !== 'string') {
      throw new Error('AI provider is required');
    }

    const validProviders = ['deepseek', 'openrouter', 'mock'];
    if (!validProviders.includes(aiConfig.provider)) {
      throw new Error(`Invalid AI provider. Must be one of: ${validProviders.join(', ')}`);
    }

    // For non-mock providers, API key is required
    if (aiConfig.provider !== 'mock' && (!aiConfig.apiKey || typeof aiConfig.apiKey !== 'string')) {
      throw new Error('API key is required for AI providers');
    }

    return {
      provider: aiConfig.provider,
      apiKey: aiConfig.apiKey || '',
      model: aiConfig.model || undefined,
      temperature: this.validateTemperature(aiConfig.temperature)
    };
  }

  private static validateTemperature(temperature: any): number {
    if (temperature === undefined || temperature === null) {
      return 0.7; // default
    }

    if (typeof temperature !== 'number') {
      console.warn('Invalid temperature type, using default 0.7');
      return 0.7;
    }

    if (temperature < 0 || temperature > 2) {
      console.warn('Temperature out of range (0-2), clamping to valid range');
      return Math.max(0, Math.min(2, temperature));
    }

    return temperature;
  }

  private static validateReplyIndex(replyIndex: any): number {
    if (replyIndex === undefined || replyIndex === null) {
      return 0;
    }

    if (typeof replyIndex !== 'number' || replyIndex < 0) {
      console.warn('Invalid reply index, using 0');
      return 0;
    }

    return Math.floor(replyIndex);
  }

  private static validateActivePersonas(activePersonas: any): string[] {
    if (!activePersonas) {
      return [];
    }

    if (!Array.isArray(activePersonas)) {
      console.warn('Active personas must be an array, using empty array');
      return [];
    }

    // Filter out invalid entries
    const validPersonas = activePersonas.filter(persona => 
      typeof persona === 'string' && persona.trim().length > 0
    );

    return validPersonas.map(persona => persona.trim());
  }

  static validateSeedConfigs(seedConfigs: any[]): void {
    if (!Array.isArray(seedConfigs) || seedConfigs.length === 0) {
      throw new Error('No seed user configurations found. Please create seed users first.');
    }

    const validConfigs = seedConfigs.filter(config => 
      config && 
      config.username && 
      typeof config.username === 'string' &&
      config.userId &&
      typeof config.userId === 'string' &&
      config.writingStyle &&
      typeof config.writingStyle === 'string'
    );

    if (validConfigs.length === 0) {
      throw new Error('No valid seed user configurations found. Please check seed user setup.');
    }
  }

  static sanitizeContent(content: string): string {
    if (!content || typeof content !== 'string') {
      return '';
    }

    return content
      .trim()
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .substring(0, 1000); // Limit length
  }

  static validateReplyContent(content: string): void {
    if (!content || typeof content !== 'string') {
      throw new Error('Reply content is required');
    }

    const trimmed = content.trim();
    
    if (trimmed.length === 0) {
      throw new Error('Reply content cannot be empty');
    }

    if (trimmed.length < 5) {
      throw new Error('Reply content is too short (minimum 5 characters)');
    }

    if (trimmed.length > 2000) {
      throw new Error('Reply content is too long (maximum 2000 characters)');
    }
  }

  static logValidationDebug(request: ReplyGenerationRequest): void {
    console.log('🎭 Mood selected for reply generation:', request.selectedMood);
    console.log('🎭 Request validation completed successfully');
    console.log('📝 Discussion:', {
      id: request.discussionData.id,
      title: request.discussionData.transformedTitle,
      repliesCount: request.discussionData.replies?.length || 0
    });
    console.log('🤖 AI Config:', {
      provider: request.aiConfig.provider,
      model: request.aiConfig.model || 'default',
      temperature: request.aiConfig.temperature
    });
    console.log('👥 Active personas:', request.activePersonas?.length || 0);
    console.log('⏰ Timing:', request.timingConfig?.type || 'immediate');
  }
}