/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from 'react';
import { validateVideoUrl, generateThumbnailUrl, getPlatformIcon } from '../../utils/videoSharing';

interface VideoAttachmentToastProps {
  isOpen: boolean;
  onClose: () => void;
  onVideoSelect: (url: string) => Promise<void>;
  isLoading: boolean;
}

export default function VideoAttachmentToast({ 
  isOpen, 
  onClose, 
  onVideoSelect, 
  isLoading 
}: VideoAttachmentToastProps) {
  const [videoUrl, setVideoUrl] = useState('');
  const [validation, setValidation] = useState<{ isValid: boolean; error?: string; platform?: string; videoId?: string }>({ isValid: false });
  const [previewThumbnail, setPreviewThumbnail] = useState<string>('');
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);

  // Animate in when opened
  useEffect(() => {
    if (isOpen) {
      setIsAnimatingIn(true);
    } else {
      setIsAnimatingIn(false);
    }
  }, [isOpen]);

  // Validate URL as user types
  useEffect(() => {
    if (!videoUrl.trim()) {
      setValidation({ isValid: false });
      setPreviewThumbnail('');
      return;
    }

    const result = validateVideoUrl(videoUrl);
    setValidation(result);

    // Generate preview thumbnail if valid
    if (result.isValid && result.platform && result.videoId) {
      const thumbnail = generateThumbnailUrl(result.platform, result.videoId);
      setPreviewThumbnail(thumbnail);
    } else {
      setPreviewThumbnail('');
    }
  }, [videoUrl]);

  const handleSubmit = async () => {
    if (!validation.isValid || !videoUrl.trim()) {
      return;
    }

    try {
      await onVideoSelect(videoUrl.trim());
      // Reset form on success
      setVideoUrl('');
      setValidation({ isValid: false });
      setPreviewThumbnail('');
    } catch (error) {
      // Error handling will be done in parent component
      console.error('Error attaching video:', error);
    }
  };

  const handleClose = () => {
    setVideoUrl('');
    setValidation({ isValid: false });
    setPreviewThumbnail('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop overlay for mobile */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
        onClick={handleClose}
      />

      {/* Toast container */}
      <div 
        className={`
          fixed bottom-4 right-4 z-50 w-full max-w-md
          transform transition-all duration-300 ease-out
          ${isAnimatingIn 
            ? 'translate-y-0 opacity-100 scale-100' 
            : 'translate-y-8 opacity-0 scale-95'
          }
        `}
      >
        <div className="bg-white border-2 border-black shadow-lg">
          {/* Header */}
          <div className="p-4 border-b border-black bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-black flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-space-grotesk font-bold text-black text-lg">Add Video</h3>
                  <p className="text-xs text-black/70 font-open-sans">YouTube or Vimeo</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                disabled={isLoading}
                className="p-1 hover:bg-gray-200 border border-black transition-colors disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* URL Input */}
            <div className="mb-4">
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && validation.isValid && !isLoading) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                placeholder="https://youtube.com/watch?v=..."
                className={`w-full px-3 py-2 text-sm border bg-white focus:outline-none focus:ring-1 focus:ring-black/20 font-open-sans ${
                  videoUrl && !validation.isValid ? 'border-red-500' : 'border-black'
                }`}
                disabled={isLoading}
              />
              
              {/* Validation Message */}
              {videoUrl && !validation.isValid && validation.error && (
                <p className="text-red-600 text-xs mt-1 font-open-sans">{validation.error}</p>
              )}
              
              {/* Success Message */}
              {validation.isValid && (
                <div className="flex items-center mt-1 text-green-600 text-xs font-open-sans">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Valid {validation.platform} video
                </div>
              )}
            </div>

            {/* Video Preview */}
            {validation.isValid && previewThumbnail && validation.platform && (
              <div className="mb-4 p-3 border border-gray-300 bg-gray-50">
                <div className="flex items-start gap-3">
                  <div className="relative flex-shrink-0">
                    <img
                      src={previewThumbnail}
                      alt="Video thumbnail"
                      className="w-16 h-12 object-cover border border-gray-300 rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA2NCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAyMEwzNiAyOEwyNCAzNlYyMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black bg-opacity-70 rounded-full p-1">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-sm">{getPlatformIcon(validation.platform as 'youtube' | 'vimeo')}</span>
                      <span className="font-space-grotesk font-bold text-black text-xs capitalize">
                        {validation.platform}
                      </span>
                    </div>
                    <p className="text-xs text-black/70 font-open-sans">
                      Ready to attach
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Supported Platforms */}
            <div className="mb-4">
              <p className="text-xs font-space-grotesk font-bold text-black mb-2">Supported:</p>
              <div className="flex gap-2">
                <div className="flex items-center text-xs text-black/70 font-open-sans">
                  <span className="mr-1">📺</span>
                  YouTube
                </div>
                <div className="flex items-center text-xs text-black/70 font-open-sans">
                  <span className="mr-1">🎬</span>
                  Vimeo
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="flex-1 px-3 py-2 text-xs border border-black bg-white text-black hover:bg-gray-50 transition-colors font-space-grotesk font-bold disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!validation.isValid || isLoading}
                className="flex-1 px-3 py-2 text-xs bg-black text-white hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-space-grotesk font-bold"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                    Attaching...
                  </div>
                ) : (
                  'Attach'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}