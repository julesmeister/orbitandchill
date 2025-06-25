/* eslint-disable @typescript-eslint/no-unused-vars */
import { EmbeddedVideo, VideoMetadata } from '../types/threads';

export interface VideoValidationResult {
  isValid: boolean;
  platform?: 'youtube' | 'vimeo';
  videoId?: string;
  error?: string;
}

/**
 * Extract YouTube video ID from various YouTube URL formats
 */
export function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    /youtu\.be\/([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Extract Vimeo video ID from Vimeo URLs
 */
export function extractVimeoVideoId(url: string): string | null {
  const patterns = [
    /vimeo\.com\/(\d+)/,
    /vimeo\.com\/video\/(\d+)/,
    /player\.vimeo\.com\/video\/(\d+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Validate and parse video URL
 */
export function validateVideoUrl(url: string): VideoValidationResult {
  if (!url || typeof url !== 'string') {
    return { isValid: false, error: 'Please enter a valid URL' };
  }

  // Normalize URL
  const normalizedUrl = url.trim().toLowerCase();

  // Check for YouTube
  if (normalizedUrl.includes('youtube.com') || normalizedUrl.includes('youtu.be')) {
    const videoId = extractYouTubeVideoId(url);
    if (videoId) {
      return { isValid: true, platform: 'youtube', videoId };
    } else {
      return { isValid: false, error: 'Could not extract YouTube video ID from URL' };
    }
  }

  // Check for Vimeo
  if (normalizedUrl.includes('vimeo.com')) {
    const videoId = extractVimeoVideoId(url);
    if (videoId) {
      return { isValid: true, platform: 'vimeo', videoId };
    } else {
      return { isValid: false, error: 'Could not extract Vimeo video ID from URL' };
    }
  }

  return { isValid: false, error: 'Please enter a YouTube or Vimeo URL' };
}

/**
 * Generate embed URL for video platform
 */
export function generateEmbedUrl(platform: 'youtube' | 'vimeo', videoId: string): string {
  switch (platform) {
    case 'youtube':
      return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
    case 'vimeo':
      return `https://player.vimeo.com/video/${videoId}`;
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
}

/**
 * Generate thumbnail URL for video
 */
export function generateThumbnailUrl(platform: 'youtube' | 'vimeo', videoId: string): string {
  switch (platform) {
    case 'youtube':
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    case 'vimeo':
      // Vimeo thumbnails require API call, using a placeholder for now
      return `https://vumbnail.com/${videoId}.jpg`;
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
}

/**
 * Fetch video metadata (simplified version without API calls)
 */
export async function fetchVideoMetadata(platform: 'youtube' | 'vimeo', videoId: string, originalUrl: string): Promise<VideoMetadata> {
  // In a real implementation, you would make API calls to YouTube/Vimeo APIs
  // For now, we'll return basic metadata based on the URL
  
  const defaultMetadata: VideoMetadata = {
    title: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Video`,
    description: 'Video shared in discussion',
    channelName: 'Unknown Channel',
    duration: 'Unknown',
    publishedAt: new Date().toISOString()
  };

  try {
    // Attempt to extract title from URL parameters or page title
    // This is a simplified approach - in production you'd use proper APIs
    if (platform === 'youtube') {
      // You could implement oEmbed API calls here
      // const response = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(originalUrl)}&format=json`);
      // const data = await response.json();
      // return { title: data.title, channelName: data.author_name, ... };
    }
    
    return defaultMetadata;
  } catch (error) {
    console.error('Error fetching video metadata:', error);
    return defaultMetadata;
  }
}

/**
 * Create embedded video object from URL
 */
export async function createEmbeddedVideo(url: string): Promise<EmbeddedVideo> {
  const validation = validateVideoUrl(url);
  
  if (!validation.isValid || !validation.platform || !validation.videoId) {
    throw new Error(validation.error || 'Invalid video URL');
  }

  const embedUrl = generateEmbedUrl(validation.platform, validation.videoId);
  const thumbnail = generateThumbnailUrl(validation.platform, validation.videoId);
  const metadata = await fetchVideoMetadata(validation.platform, validation.videoId, url);

  return {
    id: generateVideoId(),
    platform: validation.platform,
    videoId: validation.videoId,
    url: url,
    embedUrl,
    title: metadata.title,
    description: metadata.description,
    thumbnail,
    duration: metadata.duration,
    channelName: metadata.channelName,
    publishedAt: metadata.publishedAt,
    tags: metadata.tags,
    createdAt: new Date()
  };
}

/**
 * Generate unique video ID
 */
function generateVideoId(): string {
  return `video_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Format duration for display (if available)
 */
export function formatDuration(duration?: string): string {
  if (!duration || duration === 'Unknown') {
    return '';
  }
  
  // Handle ISO 8601 duration format (PT4M13S) or simple formats
  if (duration.startsWith('PT')) {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (match) {
      const hours = parseInt(match[1] || '0');
      const minutes = parseInt(match[2] || '0');
      const seconds = parseInt(match[3] || '0');
      
      if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      } else {
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
      }
    }
  }
  
  return duration;
}

/**
 * Get platform icon/emoji
 */
export function getPlatformIcon(platform: 'youtube' | 'vimeo'): string {
  switch (platform) {
    case 'youtube':
      return '📺';
    case 'vimeo':
      return '🎬';
    default:
      return '📹';
  }
}

/**
 * Get platform color
 */
export function getPlatformColor(platform: 'youtube' | 'vimeo'): string {
  switch (platform) {
    case 'youtube':
      return '#FF0000';
    case 'vimeo':
      return '#1AB7EA';
    default:
      return '#666666';
  }
}