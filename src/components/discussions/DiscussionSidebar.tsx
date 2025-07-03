/* eslint-disable @typescript-eslint/no-unused-vars */
import Link from 'next/link';
import { useState } from 'react';
import { DiscussionTemp } from '../../types/threads';
import VoteButtons from '../reusable/VoteButtons';
import { FirstImageData } from './DiscussionContent';

interface DiscussionSidebarProps {
  discussion: DiscussionTemp;
  relatedDiscussions: DiscussionTemp[];
  firstImage?: FirstImageData | null;
}

export default function DiscussionSidebar({ discussion, relatedDiscussions, firstImage }: DiscussionSidebarProps) {
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  // Format date for display
  const formatDate = (dateValue: string | Date | number) => {
    try {
      let date: Date;
      if (typeof dateValue === 'number') {
        date = new Date(dateValue * 1000); // Convert from Unix timestamp
      } else {
        date = new Date(dateValue);
      }
      return isNaN(date.getTime()) ? 'Recently' : date.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return 'Recently';
    }
  };

  // Estimate reading time based on content length
  const estimateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `~${minutes} min read`;
  };

  return (
    <div className="sticky top-6 space-y-0">
      {/* Featured Image */}
      {firstImage && (
        <div className="bg-white border-b border-black relative group cursor-pointer" onClick={() => setShowImageModal(true)}>
          <img 
            src={firstImage.url} 
            alt={firstImage.alt || "Discussion featured image"} 
            className="w-full h-auto object-cover"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowImageModal(true);
            }}
            className="absolute bottom-2 right-2 bg-black text-white px-3 py-1 text-xs font-open-sans hover:bg-gray-800 transition-colors opacity-0 group-hover:opacity-100"
          >
            View Full
          </button>
        </div>
      )}

      {/* Author Info Card */}
      <div className="bg-white border-b border-black p-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-16 h-16 border border-black flex items-center justify-center flex-shrink-0 bg-gray-100">
            <span className="text-black font-bold text-lg font-space-grotesk">
              {discussion.avatar}
            </span>
          </div>
          <div>
            <h4 className="font-space-grotesk font-bold text-black text-lg">{discussion.author}</h4>
            <p className="text-sm text-black/60 font-open-sans">Discussion Author</p>
          </div>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex items-start justify-between border-b border-black pb-2 gap-4">
            <span className="text-black/60 font-open-sans flex-shrink-0">Created</span>
            <span className="text-black font-medium font-open-sans text-right leading-relaxed">{formatDate(discussion.createdAt || discussion.lastActivity)}</span>
          </div>
          <div className="flex items-start justify-between border-b border-black pb-2 gap-4">
            <span className="text-black/60 font-open-sans flex-shrink-0">Reading time</span>
            <span className="text-black font-medium font-open-sans text-right">{estimateReadingTime(discussion.content || discussion.excerpt)}</span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <span className="text-black/60 font-open-sans flex-shrink-0">Last activity</span>
            <span className="text-black font-medium font-open-sans text-right leading-relaxed">{formatDate(discussion.lastActivity)}</span>
          </div>
        </div>
      </div>

      {/* Discussion Metrics */}
      <div className="bg-white border-b border-black p-4">
        <h4 className="font-space-grotesk font-bold text-black mb-4 text-lg">
          Discussion Metrics
        </h4>

        <div className="grid grid-cols-2 gap-3">
          {/* Views */}
          <div className="text-center p-4 border border-black bg-white">
            <div className="w-8 h-8 bg-black mx-auto mb-3 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div className="text-lg font-bold text-black font-space-grotesk">{discussion.views.toLocaleString()}</div>
            <div className="text-xs text-black/60 font-open-sans">Views</div>
          </div>

          {/* Replies */}
          <div className="text-center p-4 border border-black bg-white">
            <div className="w-8 h-8 bg-black mx-auto mb-3 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div className="text-lg font-bold text-black font-space-grotesk">{discussion.replies}</div>
            <div className="text-xs text-black/60 font-open-sans">Replies</div>
          </div>

          {/* Upvotes */}
          <div className="text-center p-4 border border-black bg-white">
            <div className="w-8 h-8 bg-black mx-auto mb-3 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div className="text-lg font-bold text-black font-space-grotesk">{discussion.upvotes}</div>
            <div className="text-xs text-black/60 font-open-sans">Upvotes</div>
          </div>

          {/* Engagement */}
          <div className="text-center p-4 border border-black bg-white">
            <div className="w-8 h-8 bg-black mx-auto mb-3 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="text-lg font-bold text-black font-space-grotesk">{Math.round(((discussion.replies + discussion.upvotes) / discussion.views) * 100)}%</div>
            <div className="text-xs text-black/60 font-open-sans">Engagement</div>
          </div>
        </div>

      </div>

      {/* Vote on Discussion */}
      <div className="bg-white border-b border-black p-4">
        <h4 className="font-space-grotesk font-bold text-black mb-3 text-lg">Rate this Discussion</h4>
        <div className="flex items-center justify-center">
          <VoteButtons
            type="discussion"
            id={discussion.id}
            upvotes={discussion.upvotes}
            downvotes={discussion.downvotes}
            size="md"
            userVote={discussion.userVote}
            useHook={true}
            onAuthRequired={() => setShowAuthPrompt(true)}
          />
        </div>
        {showAuthPrompt ? (
          <p className="text-xs text-black font-open-sans text-center mt-3 px-2">
            Creating anonymous user session... Please try voting again.
          </p>
        ) : (
          <p className="text-xs text-black/60 font-open-sans text-center mt-3">
            Help the community by rating this discussion
          </p>
        )}
      </div>

      {/* Related Discussions */}
      <div className="bg-white p-4">
        <h4 className="font-space-grotesk font-bold text-black mb-4 text-lg">Related Discussions</h4>
        <div className="space-y-0">
          {relatedDiscussions.slice(0, 3).map((related, index) => (
            <Link
              key={related.id}
              href={`/discussions/${related.slug || related.id}`}
              className="group block p-3 border border-black border-b-0 last:border-b hover:bg-black hover:text-white transition-all duration-300"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-black group-hover:bg-white flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4 text-white group-hover:text-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-black group-hover:text-white transition-colors leading-relaxed font-open-sans">
                    {related.title.length > 50 ? related.title.substring(0, 50) + '...' : related.title}
                  </p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-black/60 group-hover:text-white/60 transition-colors">
                    <span className="flex items-center font-open-sans">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {related.views}
                    </span>
                    <span className="flex items-center font-open-sans">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      {related.replies}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && firstImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-6xl max-h-[90vh]">
            <img 
              src={firstImage.url} 
              alt={firstImage.alt || "Discussion featured image"} 
              className="max-w-full max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 bg-black text-white p-2 hover:bg-gray-800 transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}