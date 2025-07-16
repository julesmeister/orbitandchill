/* eslint-disable @typescript-eslint/no-unused-vars */
import { getAvatarByIdentifier } from '@/utils/avatarUtils';

interface UseUserAvatarProps {
  author: string;
  avatar?: string;
  preferredAvatar?: string;
  profilePictureUrl?: string;
}

export function useUserAvatar({ author, avatar, preferredAvatar, profilePictureUrl }: UseUserAvatarProps) {
  // Priority order:
  // 1. preferredAvatar (user's selected avatar)
  // 2. profilePictureUrl (Google profile picture)
  // 3. avatar (legacy/fallback avatar)
  // 4. Generated avatar based on username
  // 5. User initials as final fallback
  
  const getAvatarSrc = (): string | null => {
    if (preferredAvatar) {
      return preferredAvatar;
    }
    
    if (profilePictureUrl) {
      return profilePictureUrl;
    }
    
    if (avatar && avatar.startsWith('/')) {
      return avatar;
    }
    
    // Generate deterministic avatar based on username
    if (author) {
      return getAvatarByIdentifier(author);
    }
    
    return null;
  };

  const getInitials = (): string => {
    if (!author) return '?';
    return author.split(' ').map((n: string) => n[0]).join('').toUpperCase();
  };

  const avatarSrc = getAvatarSrc();
  const initials = getInitials();

  return {
    avatarSrc,
    initials,
    hasAvatar: !!avatarSrc,
  };
}