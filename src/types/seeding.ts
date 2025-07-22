/* eslint-disable @typescript-eslint/no-unused-vars */

export interface SeedingTabProps {
  isLoading?: boolean;
}

export interface ProcessStep {
  number: number;
  title: string;
  description: string;
  color: string;
}

export interface GenerationSettings {
  discussionsToGenerate: number;
  repliesPerDiscussion: { min: number; max: number };
  maxNestingDepth: number;
  contentVariation: number;
}

export interface SeedingResults {
  success: boolean;
  message?: string;
  error?: string;
  finalStats?: {
    discussionsCreated: number;
    usersCreated: number;
    repliesCreated: number;
    votesDistributed: number;
  };
  scrapedPosts?: number;
  processedDiscussions?: number;
  totalReplies?: number;
  estimatedReplies?: number;
  fixedAvatars?: boolean;
  fixedCount?: number;
  totalUsers?: number;
  fixedUsers?: any[];
  restoredFromCache?: boolean;
  restoredMessage?: string;
  summary?: any;
  processedComments?: boolean;
  addedToExisting?: boolean;
  createdNew?: boolean;
  hasPartialResults?: boolean;
  batchId?: string;
}

export interface SeedingTabHeaderProps {
  activeTab: 'generation' | 'management';
}

export interface SeedingTabNavigationProps {
  activeTab: 'generation' | 'management';
  onTabChange: (tab: 'generation' | 'management') => void;
}

export interface SeedingStatusSectionProps {
  seedUsersInitialized: boolean;
  allPersonasComplete: boolean;
  showPersonasCompleteMessage: boolean;
  usersNeedingFix: number;
  totalUsers: number;
  avatarStatusLoading: boolean;
  seedingInProgress: boolean;
  onInitializeSeedUsers: () => void;
  onCompleteAllPersonas: () => void;
  onFixAvatarPaths: () => void;
}

export interface SeedingControlPanelProps {
  isControlPanelCollapsed: boolean;
  onToggleCollapsed: () => void;
  seedingInProgress: boolean;
  seedingProgress: number;
  seedingResults?: SeedingResults;
  pastedContent: string;
  scrapedContent: any[];
  previewContent: any[];
  aiApiKey: string;
  seedUsersInitialized: boolean;
  areConfigSectionsHidden: boolean;
  onProcessContent: () => void;
  onProcessWithAI: () => void;
  onExecuteSeeding: () => void;
  onClearAll: () => void;
  onToggleConfigSections: () => void;
}