import React from 'react';
import { DiscussionTemp } from '../../types/threads';
import EmbeddedChartDisplay from '../charts/EmbeddedChartDisplay';
import EmbeddedVideoDisplay from '../videos/EmbeddedVideoDisplay';

// Pass first image to parent component via context or props
export interface FirstImageData {
  url: string;
  alt?: string;
}

interface DiscussionContentProps {
  discussion: DiscussionTemp;
  onFirstImageExtracted?: (imageData: FirstImageData | null) => void;
}

export default function DiscussionContent({ discussion, onFirstImageExtracted }: DiscussionContentProps) {
  // Safely format date for better SEO
  const getValidDate = (dateValue: string | Date | number) => {
    try {
      // Handle Unix timestamps (from database)
      if (typeof dateValue === 'number') {
        const date = new Date(dateValue * 1000); // Convert from Unix timestamp
        return isNaN(date.getTime()) ? new Date() : date;
      }
      const date = new Date(dateValue);
      return isNaN(date.getTime()) ? new Date() : date;
    } catch {
      return new Date();
    }
  };
  
  const validDate = getValidDate(discussion.lastActivity);
  const formattedDate = validDate.toISOString();
  
  // Format for display
  const displayDate = validDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  // Extract first image from content
  const extractFirstImage = (content: string) => {
    if (!content) return null;
    
    // Check for HTML img tags
    const imgTagMatch = content.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
    if (imgTagMatch) {
      return imgTagMatch[1];
    }
    
    // Check for markdown images
    const markdownMatch = content.match(/!\[[^\]]*\]\(([^)]+)\)/);
    if (markdownMatch) {
      return markdownMatch[1];
    }
    
    return null;
  };

  // Remove first image from content if it exists
  const removeFirstImage = (content: string) => {
    if (!content) return content;
    
    // Find and remove the first img tag, preserving everything else
    const imgMatch = content.match(/<img[^>]+>/i);
    if (imgMatch) {
      const imgTag = imgMatch[0];
      const imgIndex = content.indexOf(imgTag);
      
      // Remove just the image tag, keeping content before and after
      const beforeImg = content.substring(0, imgIndex);
      const afterImg = content.substring(imgIndex + imgTag.length);
      
      return (beforeImg + afterImg).trim();
    }
    
    // Remove markdown image if present
    const markdownMatch = content.match(/!\[[^\]]*\]\([^)]+\)/);
    if (markdownMatch) {
      const markdownImg = markdownMatch[0];
      const imgIndex = content.indexOf(markdownImg);
      
      // Remove just the markdown image, keeping content before and after
      const beforeImg = content.substring(0, imgIndex);
      const afterImg = content.substring(imgIndex + markdownImg.length);
      
      return (beforeImg + afterImg).trim();
    }
    
    return content;
  };

  const firstImageUrl = extractFirstImage(discussion.content || '');
  const contentWithoutFirstImage = firstImageUrl ? removeFirstImage(discussion.content || '') : discussion.content;

  // DEBUG: Log the actual content structure
  console.log('🔍 DiscussionContent DEBUG:', {
    hasFirstImage: !!firstImageUrl,
    contentLength: contentWithoutFirstImage?.length,
    isHTML: contentWithoutFirstImage?.includes('<'),
    hasBR: contentWithoutFirstImage?.includes('<br'),
    hasP: contentWithoutFirstImage?.includes('<p>'),
    hasDIV: contentWithoutFirstImage?.includes('<div>'),
    contentPreview: contentWithoutFirstImage?.substring(0, 300),
    rawContent: discussion.content?.substring(0, 300),
    // Show actual HTML structure
    htmlStructure: contentWithoutFirstImage?.match(/<[^>]+>/g)?.slice(0, 10)
  });

  // Notify parent component about the first image
  React.useEffect(() => {
    if (onFirstImageExtracted) {
      onFirstImageExtracted(firstImageUrl ? { url: firstImageUrl } : null);
    }
  }, [firstImageUrl, onFirstImageExtracted]);
  
  return (
    <article 
      className="bg-white p-6 sm:p-8"
      itemScope 
      itemType="https://schema.org/DiscussionForumPosting"
    >
      <header className="mb-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-black/60 mb-4 font-open-sans">
          <time 
            dateTime={formattedDate}
            itemProp="datePublished"
          >
            {displayDate}
          </time>
          <span>•</span>
          <span itemProp="interactionStatistic" itemScope itemType="https://schema.org/InteractionCounter">
            <meta itemProp="interactionType" content="https://schema.org/ViewAction" />
            <span itemProp="userInteractionCount">{discussion.views}</span> views
          </span>
          <span>•</span>
          <span itemProp="interactionStatistic" itemScope itemType="https://schema.org/InteractionCounter">
            <meta itemProp="interactionType" content="https://schema.org/ReplyAction" />
            <span itemProp="userInteractionCount">{discussion.replies}</span> replies
          </span>
        </div>
        
        {/* Hidden metadata for SEO */}
        <meta itemProp="author" content={discussion.author} />
        <meta itemProp="url" content={`/discussions/${discussion.id}`} />
        {discussion.tags.length > 0 && (
          <div className="hidden">
            {discussion.tags.map((tag, index) => (
              <meta key={index} itemProp="keywords" content={tag} />
            ))}
          </div>
        )}
      </header>
      
      <div 
        className="prose prose-black max-w-none font-open-sans"
        itemProp="text"
      >
        {contentWithoutFirstImage?.includes('<') ? (
          // Render HTML content with enhanced styling
          <>
            {/* DEBUG: Show raw HTML for debugging */}
            {process.env.NODE_ENV === 'development' && (
              <details className="mb-4 p-2 bg-yellow-100 border border-yellow-400 text-xs">
                <summary>🐛 DEBUG: Raw HTML Structure</summary>
                <pre className="mt-2 whitespace-pre-wrap">{contentWithoutFirstImage}</pre>
              </details>
            )}
            <div 
              className={`
                text-black leading-relaxed text-base sm:text-lg
                /* Preserve newlines when no block elements exist */
                whitespace-pre-wrap
                /* Headings - Mobile Responsive */
                [&_h1]:font-space-grotesk [&_h1]:text-2xl sm:[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-black [&_h1]:mt-6 sm:[&_h1]:mt-8 [&_h1]:mb-4 sm:[&_h1]:mb-6 [&_h1]:border-b [&_h1]:border-black [&_h1]:pb-2 sm:[&_h1]:pb-3
                [&_h2]:font-space-grotesk [&_h2]:text-xl sm:[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-black [&_h2]:mt-6 sm:[&_h2]:mt-8 [&_h2]:mb-3 sm:[&_h2]:mb-4 [&_h2]:border-b [&_h2]:border-black [&_h2]:pb-2
                [&_h3]:font-space-grotesk [&_h3]:text-lg sm:[&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-black [&_h3]:mt-4 sm:[&_h3]:mt-6 [&_h3]:mb-2 sm:[&_h3]:mb-3 [&_h3]:text-right [&_h3]:relative
                [&_h3::after]:content-[""] [&_h3::after]:absolute [&_h3::after]:right-0 [&_h3::after]:bottom-[-8px] [&_h3::after]:w-[100px] [&_h3::after]:h-[4px] [&_h3::after]:bg-black
                /* Paragraphs - Mobile Responsive with proper line break handling */
                [&_p]:text-black [&_p]:leading-relaxed [&_p]:mb-2 sm:[&_p]:mb-3 [&_p]:text-base sm:[&_p]:text-lg
                /* Line breaks - match TipTap editor styling */
                [&_br]:block [&_br]:mb-2
                /* DIV handling for contenteditable output */
                [&_div]:text-black [&_div]:leading-relaxed [&_div]:mb-2 sm:[&_div]:mb-3 [&_div]:text-base sm:[&_div]:text-lg
                /* Empty paragraphs */
                [&_p:empty]:h-2 [&_p:empty]:mb-1
                [&_p:has(br:only-child)]:h-2 [&_p:has(br:only-child)]:mb-1
                [&_div:empty]:h-2 [&_div:empty]:mb-1
                /* Text formatting */
                [&_strong]:text-black [&_strong]:font-bold
                [&_em]:text-black [&_em]:italic
                [&_mark]:bg-yellow-200 [&_mark]:px-1 [&_mark]:py-0.5
                /* Lists - Mobile Responsive */
                [&_ul]:list-disc [&_ul]:ml-4 sm:[&_ul]:ml-6 [&_ul]:pl-2 [&_ul]:mb-2 sm:[&_ul]:mb-3 [&_ul]:space-y-1 sm:[&_ul]:space-y-2
                [&_ol]:list-decimal [&_ol]:ml-4 sm:[&_ol]:ml-6 [&_ol]:pl-2 [&_ol]:mb-2 sm:[&_ol]:mb-3 [&_ol]:space-y-1 sm:[&_ol]:space-y-2
                [&_li]:text-black [&_li]:leading-relaxed [&_li]:text-base sm:[&_li]:text-lg [&_li]:ml-0 [&_li]:pl-1
                /* Blockquotes - Mobile Responsive */
                [&_blockquote]:border-l-4 [&_blockquote]:border-black [&_blockquote]:bg-gray-50 [&_blockquote]:pl-3 sm:[&_blockquote]:pl-6 [&_blockquote]:pr-3 sm:[&_blockquote]:pr-4 [&_blockquote]:py-3 sm:[&_blockquote]:py-4 [&_blockquote]:italic [&_blockquote]:mb-2 sm:[&_blockquote]:mb-3 [&_blockquote]:text-black/80
                /* Code - Mobile Responsive */
                [&_code]:bg-gray-100 [&_code]:px-1 sm:[&_code]:px-2 [&_code]:py-0.5 sm:[&_code]:py-1 [&_code]:font-mono [&_code]:text-xs sm:[&_code]:text-sm [&_code]:border [&_code]:border-gray-300 [&_code]:rounded [&_code]:break-words
                [&_pre]:bg-gray-900 [&_pre]:text-white [&_pre]:p-3 sm:[&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-xs sm:[&_pre]:text-sm [&_pre]:border [&_pre]:border-black [&_pre]:rounded [&_pre]:mb-2 sm:[&_pre]:mb-3 [&_pre]:overflow-x-auto [&_pre]:max-w-full [&_pre]:-mx-2 sm:[&_pre]:mx-0
                [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:border-0 [&_pre_code]:text-white [&_pre_code]:text-xs sm:[&_pre_code]:text-sm
                /* Links - Mobile Touch Friendly */
                [&_a]:text-black [&_a]:underline [&_a]:underline-offset-4 [&_a]:font-medium hover:[&_a]:bg-black hover:[&_a]:text-white [&_a]:transition-colors [&_a]:px-1 [&_a]:py-1 [&_a]:min-h-[44px] [&_a]:inline-flex [&_a]:items-center
                /* Images - Mobile Responsive */
                [&_img]:rounded [&_img]:border [&_img]:border-black [&_img]:mb-2 sm:[&_img]:mb-3 [&_img]:max-w-full [&_img]:h-auto [&_img]:block [&_img]:mx-auto [&_img]:object-contain
                /* Tables - Mobile Responsive */
                [&_table]:border-collapse [&_table]:border [&_table]:border-black [&_table]:mb-2 sm:[&_table]:mb-3 [&_table]:w-full [&_table]:text-sm [&_table]:overflow-x-auto [&_table]:block sm:[&_table]:table
                [&_th]:border [&_th]:border-black [&_th]:bg-gray-100 [&_th]:px-2 sm:[&_th]:px-4 [&_th]:py-2 [&_th]:font-space-grotesk [&_th]:font-bold [&_th]:text-left [&_th]:text-xs sm:[&_th]:text-sm
                [&_td]:border [&_td]:border-black [&_td]:px-2 sm:[&_td]:px-4 [&_td]:py-2 [&_td]:text-black [&_td]:text-xs sm:[&_td]:text-sm
                /* Horizontal rules */
                [&_hr]:border-black [&_hr]:my-6 sm:[&_hr]:my-8
              `}
              dangerouslySetInnerHTML={{ __html: contentWithoutFirstImage }}
            />
          </>
        ) : (
          // Render plain text with enhanced markdown-like parsing
          <div className="space-y-3">
            {contentWithoutFirstImage?.split('\n').map((paragraph, index) => {
              // Skip empty lines
              if (!paragraph.trim()) {
                return <div key={index} className="h-4" />;
              }
              
              // Headers
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={index} className="font-space-grotesk text-xl font-bold text-black mt-6 mb-3 text-right relative after:content-[''] after:absolute after:right-0 after:bottom-[-8px] after:w-[100px] after:h-[4px] after:bg-black">
                    {paragraph.slice(4)}
                  </h3>
                );
              }
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={index} className="font-space-grotesk text-2xl font-bold text-black mt-8 mb-4 border-b border-black pb-2">
                    {paragraph.slice(3)}
                  </h2>
                );
              }
              if (paragraph.startsWith('# ')) {
                return (
                  <h1 key={index} className="font-space-grotesk text-3xl font-bold text-black mt-8 mb-6 border-b border-black pb-3">
                    {paragraph.slice(2)}
                  </h1>
                );
              }
              
              // Bold headings (legacy format)
              if (paragraph.startsWith('**') && paragraph.endsWith(':**')) {
                return (
                  <h3 key={index} className="font-space-grotesk text-xl font-bold text-black mt-6 mb-3 text-right relative after:content-[''] after:absolute after:right-0 after:bottom-[-8px] after:w-[100px] after:h-[4px] after:bg-black">
                    {paragraph.slice(2, -3)}
                  </h3>
                );
              }
              
              // Lists
              if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
                return (
                  <div key={index} className="flex items-start mb-2">
                    <div className="w-2 h-2 bg-black rounded-full mt-2 sm:mt-3 mr-3 sm:mr-4 flex-shrink-0"></div>
                    <p className="text-black leading-relaxed text-base sm:text-lg flex-1 mb-2">{paragraph.slice(2)}</p>
                  </div>
                );
              }
              
              // Numbered lists
              if (paragraph.match(/^\d+\./)) {
                const number = paragraph.match(/^(\d+)\./)?.[1];
                const content = paragraph.replace(/^\d+\.\s*/, '');
                return (
                  <div key={index} className="flex items-start mb-2">
                    <div className="bg-black text-white text-xs sm:text-sm font-bold w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center mr-3 sm:mr-4 mt-1 flex-shrink-0">
                      {number}
                    </div>
                    <p className="text-black leading-relaxed text-base sm:text-lg flex-1 mb-2">{content}</p>
                  </div>
                );
              }
              
              // Blockquotes
              if (paragraph.startsWith('> ')) {
                return (
                  <blockquote key={index} className="border-l-4 border-black bg-gray-50 pl-3 sm:pl-6 pr-3 sm:pr-4 py-3 sm:py-4 italic mb-3 sm:mb-4 text-black/80 text-base sm:text-lg">
                    {paragraph.slice(2)}
                  </blockquote>
                );
              }
              
              // Regular paragraphs with basic formatting
              const formattedContent = paragraph
                .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-black">$1</strong>')
                .replace(/\*(.*?)\*/g, '<em class="italic text-black">$1</em>')
                .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 sm:px-2 py-0.5 sm:py-1 font-mono text-xs sm:text-sm border border-gray-300 rounded break-words">$1</code>');
              
              return (
                <p 
                  key={index} 
                  className="text-black mb-2 sm:mb-3 leading-relaxed text-base sm:text-lg"
                  dangerouslySetInnerHTML={{ __html: formattedContent }}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Embedded Chart Display */}
      {(discussion as any).embeddedChart && (
        <div className="mt-8">
          <EmbeddedChartDisplay 
            chart={(discussion as any).embeddedChart} 
            isPreview={true}
          />
        </div>
      )}

      {/* Embedded Video Display */}
      {(discussion as any).embeddedVideo && (
        <div className="mt-8">
          <EmbeddedVideoDisplay 
            video={(discussion as any).embeddedVideo} 
            isPreview={true}
          />
        </div>
      )}
      
      {/* Tags section for better SEO */}
      {discussion.tags.length > 0 && (
        <footer className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-black">
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 items-start sm:items-center">
            <span className="font-space-grotesk text-sm font-bold text-black">Related Topics:</span>
            <div className="flex flex-wrap gap-2">
              {discussion.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-2 sm:px-3 py-1 bg-black text-white text-xs sm:text-sm border border-black font-open-sans hover:bg-gray-800 transition-colors cursor-pointer min-h-[44px] sm:min-h-auto"
                  itemProp="keywords"
                  title={`View more discussions about ${tag}`}
                >
                  <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  <span className="break-words">{tag}</span>
                </span>
              ))}
            </div>
          </div>
        </footer>
      )}
    </article>
  );
}