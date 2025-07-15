export interface Thread {
  id: string;
  title: string;
  slug: string; // URL-friendly slug for SEO
  excerpt: string;
  content: string; // Full content for the discussion page
  author: string;
  authorId: string;
  avatar: string;
  category: string;
  replies: number;
  views: number;
  lastActivity: string;
  createdAt: Date;
  updatedAt: Date;
  isLocked: boolean;
  isPinned: boolean;
  tags: string[];
  upvotes: number;
  downvotes: number;
  userVote?: 'up' | 'down' | null; // Current user's vote
  isBlogPost: boolean;
  embeddedChart?: EmbeddedChart; // Shared chart data
  embeddedVideo?: EmbeddedVideo; // Shared video data
}

export interface ThreadReply {
  id: string;
  threadId: string;
  content: string;
  author: string;
  authorId: string;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
  upvotes: number;
  downvotes: number;
  userVote?: 'up' | 'down' | null;
  parentReplyId?: string; // For nested replies
}

export interface ThreadCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  threadCount: number;
}

export interface ThreadVote {
  id: string;
  userId: string;
  threadId?: string;
  replyId?: string;
  voteType: 'up' | 'down';
  createdAt: Date;
}

// Temporary interface for current mock data implementation
export interface ThreadTemp {
  id: string;
  title: string;
  slug?: string; // URL-friendly slug for SEO
  excerpt: string;
  author: string;
  authorId?: string;
  avatar: string;
  preferredAvatar?: string; // User's selected avatar
  profilePictureUrl?: string; // Google profile picture
  category: string;
  replies: number;
  views: number;
  lastActivity: string;
  isLocked: boolean;
  isPinned: boolean;
  tags: string[];
  upvotes: number;
  downvotes: number;
  userVote?: 'up' | 'down' | null;
  content?: string;
  createdAt?: Date | string | number;
  updatedAt?: Date | string | number;
  isBlogPost?: boolean;
  embeddedChart?: EmbeddedChart;
  embeddedVideo?: EmbeddedVideo;
}

export interface Reply {
  id: string;
  author: string;
  avatar: string;
  preferredAvatar?: string;
  profilePictureUrl?: string;
  content: string;
  timestamp: string;
  upvotes: number;
  downvotes: number;
  userVote?: 'up' | 'down' | null;
  isAuthor?: boolean;
  parentId?: string;
  replyToAuthor?: string;
  children?: Reply[];
}

export interface ReplyFormState {
  newReply: string;
  replyingTo: string | null;
  replyingToAuthor: string | null;
}

// Chart sharing interfaces
export interface EmbeddedChart {
  id: string;
  chartType: 'natal' | 'horary' | 'event';
  chartData: string; // SVG content
  metadata: ChartMetadata;
  shareUrl?: string;
  createdAt: Date;
}

export interface ChartMetadata {
  name: string;
  chartTitle: string;
  birthData?: ChartBirthData;
  eventData?: ChartEventData;
  horaryData?: ChartHoraryData;
  planetSummary: PlanetSummary[];
  houseSummary: HouseSummary[];
  majorAspects: string[];
  chartScore?: number;
  // Chart-specific data for different chart types
  natalChartData?: import('../utils/natalChart').NatalChartData;
  horaryChartData?: any; // TODO: Import proper type when available
  eventChartData?: any; // TODO: Import proper type when available
}

export interface ChartBirthData {
  dateOfBirth: string;
  timeOfBirth: string;
  locationOfBirth: string;
  coordinates: {
    lat: string;
    lon: string;
  };
}

export interface ChartEventData {
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  isOptimal?: boolean;
  optimalScore?: number;
}

export interface ChartHoraryData {
  question: string;
  questionDate: string;
  answer?: string;
  timing?: string;
}

export interface PlanetSummary {
  planet: string;
  sign: string;
  house: string;
  degree: number;
  isRetrograde?: boolean;
  dignity?: string;
}

export interface HouseSummary {
  house: string;
  sign: string;
  planets: string[];
  isEmpty: boolean;
}

// Video sharing interfaces
export interface EmbeddedVideo {
  id: string;
  platform: 'youtube' | 'vimeo';
  videoId: string;
  url: string;
  embedUrl: string;
  title: string;
  description?: string;
  thumbnail: string;
  duration?: string;
  channelName?: string;
  publishedAt?: string;
  tags?: string[];
  createdAt: Date;
}

export interface VideoMetadata {
  title: string;
  description?: string;
  channelName?: string;
  duration?: string;
  publishedAt?: string;
  viewCount?: string;
  likeCount?: string;
  tags?: string[];
}

// Legacy aliases for backward compatibility
export type Discussion = Thread;
export type DiscussionReply = ThreadReply;
export type DiscussionCategory = ThreadCategory;
export type DiscussionVote = ThreadVote;
export type DiscussionTemp = ThreadTemp;