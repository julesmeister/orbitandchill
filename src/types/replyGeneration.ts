/* eslint-disable @typescript-eslint/no-unused-vars */

export interface ReplyGenerationRequest {
  discussionData: DiscussionData;
  aiConfig: AIConfig;
  replyIndex: number;
  selectedMood: string;
  activePersonas: string[];
  timingConfig: TimingConfig | null;
}

export interface DiscussionData {
  id: string;
  transformedTitle: string;
  content: string;
  createdAt: string;
  replies?: Reply[];
}

export interface Reply {
  id: string;
  content: string;
  authorName?: string;
  authorId: string;
  avatar: string;
  timestamp: string;
  createdAt: string;
  upvotes: number;
  downvotes?: number;
  reactionType?: string;
  aiGenerated?: boolean;
}

export interface AIConfig {
  provider: 'deepseek' | 'openrouter' | 'mock';
  apiKey: string;
  model?: string;
  temperature?: number;
}

export interface TimingConfig {
  type: 'immediate' | 'scheduled' | 'random';
  scheduledHours?: number;
  maxRandomHours?: number;
}

export interface SeedUserConfig {
  userId: string;
  username: string;
  profilePictureUrl?: string;
  preferredAvatar?: string;
  writingStyle: WritingStyle;
  expertiseAreas?: string[];
}

export type WritingStyle = 
  | 'professional_educational'
  | 'enthusiastic_personal'
  | 'analytical_questioning'
  | 'beginner_enthusiastic'
  | 'specialist_timing';

export interface PersonalityDetails {
  personality: string;
  emojis: string;
  background: string;
  replyStyle: string;
}

export interface SchedulingInfo {
  timestamp: string;
  scheduledDelay: number;
}

export interface GeneratedReply {
  id: string;
  content: string;
  authorName: string;
  authorId: string;
  avatar: string;
  timestamp: string;
  createdAt: string;
  scheduledDelay: number;
  upvotes: number;
  downvotes: number;
  reactionType: string;
  addingValue: string;
  aiGenerated: boolean;
  writingStyle: WritingStyle;
  userExpertise?: string[];
  contentHash?: string;
}

export interface AIProviderResponse {
  choices?: {
    message?: {
      content?: string;
      reasoning?: string;
    };
    finish_reason?: string;
  }[];
}

export interface ReplyTemplate {
  [key: string]: string[];
}

export type MoodType = 'supportive' | 'questioning' | 'excited' | 'wise' | 'concerned' | 'empathetic';