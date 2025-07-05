/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from 'react';
import { validateVideoUrl, generateThumbnailUrl, getPlatformIcon } from '../../utils/videoSharing';

interface VideoSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVideoSelect: (url: string) => Promise<void>;
  isLoading: boolean;
}

export default function VideoSelectionModal({ 
  isOpen, 
  onClose, 
  onVideoSelect, 
  isLoading 
}: VideoSelectionModalProps) {
  const [videoUrl, setVideoUrl] = useState('');
  const [validation, setValidation] = useState<{ isValid: boolean; error?: string; platform?: string; videoId?: string }>({ isValid: false });
  const [previewThumbnail, setPreviewThumbnail] = useState<string>('');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-black max-w-lg w-full">
        {/* Header */}
        <div className="p-6 border-b border-black">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-space-grotesk text-2xl font-bold text-black">
                Add Video
              </h2>
              <p className="font-open-sans text-black/70 mt-1">
                Add a YouTube or Vimeo video to your discussion
              </p>
            </div>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="p-2 hover:bg-gray-100 border border-black transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* URL Input */}
          <div className="mb-6">
            <label className="font-space-grotesk font-bold text-black mb-3 block">
              Video URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/..."
              className={`w-full px-4 py-3 border bg-white focus:outline-none focus:ring-2 focus:ring-black/20 font-open-sans ${
                videoUrl && !validation.isValid ? 'border-red-500' : 'border-black'
              }`}
              disabled={isLoading}
            />
            
            {/* Validation Message */}
            {videoUrl && !validation.isValid && validation.error && (
              <p className="text-red-600 text-sm mt-2 font-open-sans">{validation.error}</p>
            )}
            
            {/* Success Message */}
            {validation.isValid && (
              <div className="flex items-center mt-2 text-green-600 text-sm font-open-sans">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Valid {validation.platform} video detected
              </div>
            )}
          </div>

          {/* Video Preview */}
          {validation.isValid && previewThumbnail && validation.platform && (
            <div className="mb-6">
              <h3 className="font-space-grotesk font-bold text-black mb-3">Preview</h3>
              <div className="border border-black p-4 bg-gray-50">
                <div className="flex items-start gap-4">
                  <div className="relative flex-shrink-0">
                    <img
                      src={previewThumbnail}
                      alt="Video thumbnail"
                      className="w-32 h-24 object-cover border border-gray-300 rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9Ijk2IiB2aWV3Qm94PSIwIDAgMTI4IDk2IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTI4IiBoZWlnaHQ9Ijk2IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00OCA0MEw4MCA1Nkw0OCA3MlY0MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black bg-opacity-70 rounded-full p-2">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{getPlatformIcon(validation.platform as 'youtube' | 'vimeo')}</span>
                      <span className="font-space-grotesk font-bold text-black text-sm capitalize">
                        {validation.platform} Video
                      </span>
                    </div>
                    <p className="text-sm text-black/70 font-open-sans">
                      Ready to attach to your discussion
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Supported Platforms */}
          <div className="mb-6">
            <h3 className="font-space-grotesk font-bold text-black text-sm mb-3">Supported Platforms</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center p-3 border border-black bg-white">
                <span className="text-lg mr-3">📺</span>
                <div>
                  <div className="font-space-grotesk font-bold text-black text-sm">YouTube</div>
                  <div className="text-xs text-black/60 font-open-sans">youtube.com, youtu.be</div>
                </div>
              </div>
              <div className="flex items-center p-3 border border-black bg-white">
                <span className="text-lg mr-3">🎬</span>
                <div>
                  <div className="font-space-grotesk font-bold text-black text-sm">Vimeo</div>
                  <div className="text-xs text-black/60 font-open-sans">vimeo.com</div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-6 py-3 border border-black bg-white text-black hover:bg-gray-50 transition-colors font-space-grotesk font-bold disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!validation.isValid || isLoading}
              className="px-6 py-3 bg-black text-white hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-space-grotesk font-bold"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Attaching...
                </div>
              ) : (
                'Attach Video'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}