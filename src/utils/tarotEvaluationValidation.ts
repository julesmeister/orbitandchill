/* eslint-disable @typescript-eslint/no-unused-vars */
import { EvaluateRequest, AIConfig, CardOrientation } from '@/types/tarotEvaluation';

export class TarotEvaluationValidation {
  private static readonly MAX_INTERPRETATION_LENGTH = 2000;
  private static readonly MAX_SITUATION_LENGTH = 1000;
  private static readonly MAX_CARD_MEANING_LENGTH = 1000;
  private static readonly MAX_KEYWORDS_COUNT = 20;
  private static readonly MAX_KEYWORD_LENGTH = 50;
  private static readonly VALID_ORIENTATIONS: CardOrientation[] = ['upright', 'reversed'];
  private static readonly VALID_AI_PROVIDERS = ['openai', 'anthropic', 'gemini'];

  /**
   * Validate tarot evaluation request
   */
  static validateEvaluateRequest(body: any): {
    valid: boolean;
    request?: EvaluateRequest;
    error?: string;
  } {
    if (!body) {
      return { valid: false, error: 'Request body is required' };
    }

    // Validate required string fields
    const requiredStringFields = ['userId', 'cardId', 'cardOrientation', 'situation', 'interpretation', 'cardMeaning'];
    for (const field of requiredStringFields) {
      if (!body[field] || typeof body[field] !== 'string') {
        return { valid: false, error: `${field} is required and must be a string` };
      }
    }

    // Validate userId
    const userId = body.userId.trim();
    if (userId.length === 0) {
      return { valid: false, error: 'userId cannot be empty' };
    }

    // Validate cardId
    const cardId = body.cardId.trim();
    if (cardId.length === 0) {
      return { valid: false, error: 'cardId cannot be empty' };
    }

    // Validate cardOrientation
    if (!this.VALID_ORIENTATIONS.includes(body.cardOrientation)) {
      return { 
        valid: false, 
        error: `cardOrientation must be one of: ${this.VALID_ORIENTATIONS.join(', ')}` 
      };
    }

    // Validate situation
    const situation = body.situation.trim();
    if (situation.length === 0) {
      return { valid: false, error: 'situation cannot be empty' };
    }
    if (situation.length > this.MAX_SITUATION_LENGTH) {
      return { 
        valid: false, 
        error: `situation must be ${this.MAX_SITUATION_LENGTH} characters or less` 
      };
    }

    // Validate interpretation
    const interpretation = body.interpretation.trim();
    if (interpretation.length === 0) {
      return { valid: false, error: 'interpretation cannot be empty' };
    }
    if (interpretation.length > this.MAX_INTERPRETATION_LENGTH) {
      return { 
        valid: false, 
        error: `interpretation must be ${this.MAX_INTERPRETATION_LENGTH} characters or less` 
      };
    }

    // Validate cardMeaning
    const cardMeaning = body.cardMeaning.trim();
    if (cardMeaning.length === 0) {
      return { valid: false, error: 'cardMeaning cannot be empty' };
    }
    if (cardMeaning.length > this.MAX_CARD_MEANING_LENGTH) {
      return { 
        valid: false, 
        error: `cardMeaning must be ${this.MAX_CARD_MEANING_LENGTH} characters or less` 
      };
    }

    // Validate cardKeywords
    if (!Array.isArray(body.cardKeywords)) {
      return { valid: false, error: 'cardKeywords must be an array' };
    }
    if (body.cardKeywords.length === 0) {
      return { valid: false, error: 'cardKeywords cannot be empty' };
    }
    if (body.cardKeywords.length > this.MAX_KEYWORDS_COUNT) {
      return { 
        valid: false, 
        error: `cardKeywords cannot have more than ${this.MAX_KEYWORDS_COUNT} items` 
      };
    }

    // Validate individual keywords
    for (let i = 0; i < body.cardKeywords.length; i++) {
      const keyword = body.cardKeywords[i];
      if (typeof keyword !== 'string') {
        return { valid: false, error: `keyword at index ${i} must be a string` };
      }
      if (keyword.trim().length === 0) {
        return { valid: false, error: `keyword at index ${i} cannot be empty` };
      }
      if (keyword.length > this.MAX_KEYWORD_LENGTH) {
        return { 
          valid: false, 
          error: `keyword at index ${i} must be ${this.MAX_KEYWORD_LENGTH} characters or less` 
        };
      }
    }

    // Validate optional aiConfig
    let aiConfig: AIConfig | undefined;
    if (body.aiConfig) {
      const aiConfigValidation = this.validateAIConfig(body.aiConfig);
      if (!aiConfigValidation.valid) {
        return aiConfigValidation;
      }
      aiConfig = aiConfigValidation.aiConfig;
    }

    // Validate optional overrideScore
    if (body.overrideScore !== undefined) {
      if (typeof body.overrideScore !== 'number') {
        return { valid: false, error: 'overrideScore must be a number' };
      }
      if (body.overrideScore < 0 || body.overrideScore > 100) {
        return { valid: false, error: 'overrideScore must be between 0 and 100' };
      }
    }

    return {
      valid: true,
      request: {
        userId: userId,
        cardId: cardId,
        cardOrientation: body.cardOrientation,
        situation: situation,
        interpretation: interpretation,
        cardMeaning: cardMeaning,
        cardKeywords: body.cardKeywords.map((k: string) => k.trim()).filter((k: string) => k.length > 0),
        aiConfig: aiConfig,
        overrideScore: body.overrideScore
      }
    };
  }

  /**
   * Validate AI configuration
   */
  private static validateAIConfig(aiConfig: any): {
    valid: boolean;
    aiConfig?: AIConfig;
    error?: string;
  } {
    if (!aiConfig || typeof aiConfig !== 'object') {
      return { valid: false, error: 'aiConfig must be an object' };
    }

    // Validate provider
    if (!aiConfig.provider || typeof aiConfig.provider !== 'string') {
      return { valid: false, error: 'aiConfig.provider is required and must be a string' };
    }
    if (!this.VALID_AI_PROVIDERS.includes(aiConfig.provider)) {
      return { 
        valid: false, 
        error: `aiConfig.provider must be one of: ${this.VALID_AI_PROVIDERS.join(', ')}` 
      };
    }

    // Validate model
    if (!aiConfig.model || typeof aiConfig.model !== 'string') {
      return { valid: false, error: 'aiConfig.model is required and must be a string' };
    }
    if (aiConfig.model.trim().length === 0) {
      return { valid: false, error: 'aiConfig.model cannot be empty' };
    }

    // Validate apiKey
    if (!aiConfig.apiKey || typeof aiConfig.apiKey !== 'string') {
      return { valid: false, error: 'aiConfig.apiKey is required and must be a string' };
    }
    if (aiConfig.apiKey.trim().length === 0) {
      return { valid: false, error: 'aiConfig.apiKey cannot be empty' };
    }

    // Validate temperature
    if (aiConfig.temperature === undefined || typeof aiConfig.temperature !== 'number') {
      return { valid: false, error: 'aiConfig.temperature is required and must be a number' };
    }
    if (aiConfig.temperature < 0 || aiConfig.temperature > 2) {
      return { valid: false, error: 'aiConfig.temperature must be between 0 and 2' };
    }

    return {
      valid: true,
      aiConfig: {
        provider: aiConfig.provider,
        model: aiConfig.model.trim(),
        apiKey: aiConfig.apiKey.trim(),
        temperature: aiConfig.temperature
      }
    };
  }

  /**
   * Validate score value
   */
  static validateScore(score: any): boolean {
    return typeof score === 'number' && score >= 0 && score <= 100;
  }

  /**
   * Sanitize text input
   */
  static sanitizeText(text: string): string {
    return text.trim().replace(/\s+/g, ' ');
  }

  /**
   * Validate card orientation
   */
  static validateOrientation(orientation: any): orientation is CardOrientation {
    return typeof orientation === 'string' && this.VALID_ORIENTATIONS.includes(orientation as CardOrientation);
  }

  /**
   * Check if AI config has required fields
   */
  static hasValidAIConfig(aiConfig: any): boolean {
    return !!(
      aiConfig &&
      aiConfig.provider &&
      aiConfig.model &&
      aiConfig.apiKey &&
      typeof aiConfig.temperature === 'number'
    );
  }

  /**
   * Validate keywords array
   */
  static validateKeywords(keywords: any): keywords is string[] {
    return Array.isArray(keywords) && 
           keywords.length > 0 && 
           keywords.every(k => typeof k === 'string' && k.trim().length > 0);
  }

  /**
   * Clean and validate request data
   */
  static cleanRequest(request: EvaluateRequest): EvaluateRequest {
    return {
      ...request,
      userId: request.userId.trim(),
      cardId: request.cardId.trim(),
      situation: this.sanitizeText(request.situation),
      interpretation: this.sanitizeText(request.interpretation),
      cardMeaning: this.sanitizeText(request.cardMeaning),
      cardKeywords: request.cardKeywords.map(k => k.trim()).filter(k => k.length > 0)
    };
  }
}