import React, { useState } from 'react';
import { ShareData, generateSocialMediaButtons, shareToSocialMedia } from '@/utils/socialSharing';

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareData: ShareData;
  onCopyLink: () => void;
}

export default function SocialShareModal({ isOpen, onClose, shareData, onCopyLink }: SocialShareModalProps) {
  const [copiedPlatform, setCopiedPlatform] = useState<string | null>(null);
  
  if (!isOpen) return null;

  const socialButtons = generateSocialMediaButtons(shareData);

  const handlePlatformShare = async (platform: string, onClick: () => Promise<boolean>) => {
    try {
      const success = await onClick();
      if (success && platform === 'instagram') {
        setCopiedPlatform(platform);
        setTimeout(() => setCopiedPlatform(null), 2000);
      }
    } catch (error) {
      console.error('Error sharing to platform:', error);
    }
  };

  const handleGenericShare = async () => {
    try {
      const success = await shareToSocialMedia(shareData);
      if (success) {
        onClose();
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white border-2 border-black max-w-md w-full">
        {/* Header */}
        <div className="border-b border-black p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-space-grotesk text-lg font-bold text-black">
              Share Chart
            </h3>
            <button
              onClick={onClose}
              className="text-black hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="font-open-sans text-sm text-black/70 mt-1">
            {shareData.subjectName}'s natal chart
          </p>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={handleGenericShare}
              className="flex items-center gap-2 p-3 border border-black bg-black text-white hover:bg-gray-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              <span className="font-semibold text-sm">Share Now</span>
            </button>
            
            <button
              onClick={onCopyLink}
              className="flex items-center gap-2 p-3 border border-black bg-white text-black hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span className="font-semibold text-sm">Copy Link</span>
            </button>
          </div>

          {/* Social Media Platforms */}
          <div>
            <h4 className="font-space-grotesk text-sm font-bold text-black mb-3">
              Share on Social Media
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {socialButtons.map((platform) => (
                <button
                  key={platform.key}
                  onClick={() => handlePlatformShare(platform.key, platform.onClick)}
                  className="flex items-center gap-3 p-3 border border-gray-200 hover:border-black transition-colors text-left"
                  style={{ backgroundColor: `${platform.color}08` }}
                >
                  <span className="text-xl">{platform.icon}</span>
                  <div>
                    <div className="font-space-grotesk font-semibold text-sm text-black">
                      {platform.name}
                    </div>
                    {platform.key === 'instagram' && copiedPlatform === platform.key && (
                      <div className="font-open-sans text-xs text-green-600">
                        Copied to clipboard!
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="mt-6 p-3 bg-gray-50 border border-gray-200">
            <h5 className="font-space-grotesk text-xs font-bold text-black mb-2">
              Preview Message
            </h5>
            <p className="font-open-sans text-xs text-black/70">
              {socialButtons[0].shareData.text}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}