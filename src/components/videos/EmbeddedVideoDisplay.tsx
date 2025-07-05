/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { EmbeddedVideo } from '../../types/threads';
import { getPlatformIcon, getPlatformColor, formatDuration } from '../../utils/videoSharing';

interface EmbeddedVideoDisplayProps {
  video: EmbeddedVideo;
  isPreview?: boolean;
  showFullDetails?: boolean;
}

export default function EmbeddedVideoDisplay({ 
  video, 
  isPreview = false, 
  showFullDetails = false 
}: EmbeddedVideoDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(showFullDetails);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayVideo = () => {
    if (isPreview) {
      setShowVideoModal(true);
    } else {
      setIsPlaying(true);
    }
  };

  const handleViewMore = () => {
    if (isPreview) {
      setIsExpanded(true);
    } else {
      setShowVideoModal(true);
    }
  };

  return (
    <>
      <div className="my-6 border border-black bg-white">
        {/* Video Header */}
        <div 
          className="p-4 border-b border-black"
          style={{ backgroundColor: getPlatformColor(video.platform) + '20' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-black flex items-center justify-center mr-3">
                <span className="text-white text-lg">{getPlatformIcon(video.platform)}</span>
              </div>
              <div>
                <h3 className="font-space-grotesk font-bold text-black">
                  📹 Shared Video
                </h3>
                <p className="text-sm text-black/70 font-inter">
                  {video.title}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span 
                className="text-xs text-white px-2 py-1 font-space-grotesk font-bold"
                style={{ backgroundColor: getPlatformColor(video.platform) }}
              >
                {video.platform.toUpperCase()}
              </span>
              {video.duration && formatDuration(video.duration) && (
                <span className="text-xs bg-black text-white px-2 py-1 font-space-grotesk font-bold">
                  {formatDuration(video.duration)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Video Content */}
        <div className="p-4">
          {isPreview && !isExpanded ? (
            /* Preview Mode - Thumbnail with Play Button */
            <div className="space-y-4">
              <div className="relative">
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  width={640}
                  height={192}
                  className="w-full h-48 object-cover border border-gray-300 rounded cursor-pointer"
                  onClick={handlePlayVideo}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQwIiBoZWlnaHQ9IjM2MCIgdmlld0JveD0iMCAwIDY0MCAzNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2NDAiIGhlaWdodD0iMzYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNjAgMjAwTDM4MCAyODBMMjYwIDM2MFYyMDBaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPg==';
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={handlePlayVideo}
                    className="bg-black bg-opacity-70 hover:bg-opacity-90 rounded-full p-4 transition-all duration-200"
                  >
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Video Info */}
              <div className="space-y-2">
                <h4 className="font-space-grotesk font-bold text-black">{video.title}</h4>
                {video.channelName && (
                  <p className="text-sm text-black/70 font-inter">
                    by {video.channelName}
                  </p>
                )}
                {video.description && (
                  <p className="text-sm text-black/70 font-inter line-clamp-2">
                    {video.description.substring(0, 100)}...
                  </p>
                )}
              </div>

              {/* View More Button */}
              <button
                onClick={handleViewMore}
                className="w-full py-3 border border-black bg-white text-black hover:bg-black hover:text-white transition-colors font-space-grotesk font-bold text-sm"
              >
                Watch Video
              </button>
            </div>
          ) : (
            /* Full Display Mode - Embedded Video */
            <div className="space-y-4">
              {!isPlaying ? (
                /* Thumbnail with Play Button */
                <div className="relative">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-64 object-cover border border-gray-300 rounded cursor-pointer"
                    onClick={() => setIsPlaying(true)}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={() => setIsPlaying(true)}
                      className="bg-black bg-opacity-70 hover:bg-opacity-90 rounded-full p-6 transition-all duration-200"
                    >
                      <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                /* Embedded Video Player */
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    src={video.embedUrl}
                    title={video.title}
                    className="absolute top-0 left-0 w-full h-full border border-gray-300 rounded"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}

              {/* Video Details */}
              <div className="space-y-3">
                <h4 className="font-space-grotesk font-bold text-black text-lg">{video.title}</h4>
                
                {video.channelName && (
                  <p className="text-black/70 font-inter">
                    <span className="font-medium">Channel:</span> {video.channelName}
                  </p>
                )}
                
                {video.description && (
                  <p className="text-black/70 font-inter">
                    {video.description}
                  </p>
                )}

                {video.publishedAt && (
                  <p className="text-sm text-black/60 font-inter">
                    Published: {new Date(video.publishedAt).toLocaleDateString()}
                  </p>
                )}

                {video.tags && video.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm font-space-grotesk font-bold text-black">Tags:</span>
                    {video.tags.slice(0, 5).map((tag, index) => (
                      <span 
                        key={index}
                        className="text-xs bg-gray-100 border border-gray-300 px-2 py-1 font-inter"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Collapse Button for expanded preview */}
          {isPreview && isExpanded && (
            <button
              onClick={() => setIsExpanded(false)}
              className="w-full mt-4 py-2 border border-black bg-gray-50 text-black hover:bg-gray-100 transition-colors font-space-grotesk font-bold text-sm"
            >
              Show Less
            </button>
          )}
        </div>

        {/* Video Attribution */}
        <div className="px-4 py-2 bg-gray-50 border-t border-black">
          <div className="flex items-center justify-between text-xs text-black/60 font-inter">
            <span>
              Video shared {new Date(video.createdAt).toLocaleDateString()}
            </span>
            <a
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-black transition-colors"
            >
              Watch on {video.platform.charAt(0).toUpperCase() + video.platform.slice(1)} ↗
            </a>
          </div>
        </div>
      </div>

      {/* Full Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-black max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-black">
              <div className="flex items-center justify-between">
                <h2 className="font-space-grotesk text-2xl font-bold text-black">
                  {video.title}
                </h2>
                <button
                  onClick={() => setShowVideoModal(false)}
                  className="p-2 hover:bg-gray-100 border border-black transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Embedded Video Player */}
              <div className="relative w-full mb-6" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src={video.embedUrl}
                  title={video.title}
                  className="absolute top-0 left-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Video Info */}
              <div className="space-y-4">
                {video.channelName && (
                  <p className="text-black/70 font-inter">
                    <span className="font-medium">Channel:</span> {video.channelName}
                  </p>
                )}
                
                {video.description && (
                  <p className="text-black/70 font-inter">
                    {video.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-black bg-white text-black hover:bg-black hover:text-white transition-colors font-space-grotesk font-bold text-sm"
                  >
                    Watch on {video.platform.charAt(0).toUpperCase() + video.platform.slice(1)}
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                  
                  {video.publishedAt && (
                    <span className="text-sm text-black/60 font-inter">
                      Published: {new Date(video.publishedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}