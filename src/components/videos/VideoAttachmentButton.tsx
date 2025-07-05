/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from 'react';
import { EmbeddedVideo } from '../../types/threads';
import { createEmbeddedVideo, validateVideoUrl } from '../../utils/videoSharing';
import VideoAttachmentToast from './VideoAttachmentToast';
import VideoSuccessToast from './VideoSuccessToast';

interface VideoAttachmentButtonProps {
  onVideoAttach: (video: EmbeddedVideo) => void;
  disabled?: boolean;
}

export default function VideoAttachmentButton({ onVideoAttach, disabled = false }: VideoAttachmentButtonProps) {
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [attachedVideo, setAttachedVideo] = useState<EmbeddedVideo | null>(null);

  const handleAttachVideo = async (url: string) => {
    setIsLoading(true);
    try {
      const embeddedVideo = await createEmbeddedVideo(url);
      onVideoAttach(embeddedVideo);
      setShowToast(false);
      
      // Show success toast
      setAttachedVideo(embeddedVideo);
      setShowSuccessToast(true);
    } catch (error) {
      console.error('Error attaching video:', error);
      // Error will be handled in the toast
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setShowToast(true)}
        disabled={disabled || isLoading}
        className={`group relative px-3 py-2 border border-black transition-all duration-300 overflow-hidden ${
          disabled || isLoading
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-black hover:bg-black hover:text-white'
        }`}
        title="Attach a YouTube or Vimeo video to your discussion"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-200/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
        <div className="relative flex items-center">
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
              <span className="font-medium text-sm font-open-sans">Attaching...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span className="font-medium text-sm font-open-sans">Add Video</span>
            </>
          )}
        </div>
      </button>

      <VideoAttachmentToast
        isOpen={showToast}
        onClose={() => setShowToast(false)}
        onVideoSelect={handleAttachVideo}
        isLoading={isLoading}
      />

      {/* Success Toast */}
      {attachedVideo && (
        <VideoSuccessToast
          isVisible={showSuccessToast}
          videoTitle={attachedVideo.title}
          platform={attachedVideo.platform}
          onHide={() => {
            setShowSuccessToast(false);
            setAttachedVideo(null);
          }}
        />
      )}
    </>
  );
}