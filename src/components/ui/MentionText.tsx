/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import Link from 'next/link';

interface MentionTextProps {
  text: string;
  className?: string;
  mentionClassName?: string;
  userProfileBaseUrl?: string;
}

/**
 * Component to render text with @mentions as clickable links
 * 
 * @param text - The text content containing @mentions
 * @param className - CSS classes for the container
 * @param mentionClassName - CSS classes for mention links
 * @param userProfileBaseUrl - Base URL for user profiles
 */
export const MentionText: React.FC<MentionTextProps> = ({
  text,
  className = '',
  mentionClassName = 'text-blue-600 hover:text-blue-800 font-medium underline',
  userProfileBaseUrl = '/users'
}) => {
  // Regular expression to match @mentions
  const mentionRegex = /@([a-zA-Z0-9_-]+)/g;
  
  const renderWithMentions = (text: string) => {
    const parts = [];
    let lastIndex = 0;
    let match;
    
    while ((match = mentionRegex.exec(text)) !== null) {
      const [fullMatch, username] = match;
      const startIndex = match.index!;
      
      // Add text before the mention
      if (startIndex > lastIndex) {
        parts.push(text.slice(lastIndex, startIndex));
      }
      
      // Add the mention as a clickable link
      parts.push(
        <Link
          key={`mention-${username}-${startIndex}`}
          href={`${userProfileBaseUrl}/${username}`}
          className={mentionClassName}
        >
          @{username}
        </Link>
      );
      
      lastIndex = startIndex + fullMatch.length;
    }
    
    // Add remaining text after last mention
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }
    
    return parts;
  };
  
  return (
    <span className={className}>
      {renderWithMentions(text)}
    </span>
  );
};

/**
 * Hook to detect mentions in text
 */
export const useMentions = (text: string) => {
  const mentionRegex = /@([a-zA-Z0-9_-]+)/g;
  
  const mentions = React.useMemo(() => {
    const found: string[] = [];
    let match;
    
    while ((match = mentionRegex.exec(text)) !== null) {
      const username = match[1];
      if (!found.includes(username)) {
        found.push(username);
      }
    }
    
    return found;
  }, [text]);
  
  return {
    mentions,
    hasMentions: mentions.length > 0,
    mentionCount: mentions.length
  };
};

/**
 * Component to show mention statistics
 */
export const MentionStats: React.FC<{ text: string }> = ({ text }) => {
  const { mentions, hasMentions, mentionCount } = useMentions(text);
  
  if (!hasMentions) return null;
  
  return (
    <div className="text-sm text-gray-500 mt-1">
      <span className="inline-flex items-center gap-1">
        <span className="text-blue-600">@</span>
        {mentionCount === 1 ? (
          <span>Mentioned {mentions[0]}</span>
        ) : (
          <span>Mentioned {mentionCount} users</span>
        )}
      </span>
    </div>
  );
};

export default MentionText;