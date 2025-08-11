/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from 'react';
import { FaTwitter, FaFacebook, FaLinkedin, FaWhatsapp, FaLink, FaShare } from 'react-icons/fa';

interface SocialShareButtonsProps {
  url?: string;
  title?: string;
  description?: string;
  variant?: 'horizontal' | 'vertical' | 'floating';
  className?: string;
}

export default function SocialShareButtons({ 
  url, 
  title = "Check out this astrology tool!", 
  description = "Free natal chart calculator and astrology insights",
  variant = 'horizontal',
  className = ""
}: SocialShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const openShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], '_blank', 'width=600,height=400');
  };

  const buttonClass = variant === 'floating' 
    ? "p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
    : "p-2 rounded-lg hover:bg-opacity-80 transition-all duration-200";

  const containerClass = variant === 'vertical' 
    ? "flex flex-col gap-2"
    : variant === 'floating'
    ? "fixed bottom-6 right-6 flex flex-col gap-3 z-50"
    : "flex gap-2";

  return (
    <div className={`${containerClass} ${className}`}>
      {variant === 'floating' && (
        <div className="mb-2 text-sm font-semibold text-gray-700 bg-white px-3 py-1 rounded-lg shadow">
          Share
        </div>
      )}
      
      <button
        onClick={() => openShare('twitter')}
        className={`${buttonClass} bg-black text-white hover:bg-gray-800`}
        aria-label="Share on Twitter"
        title="Share on Twitter"
      >
        <FaTwitter className="w-5 h-5" />
      </button>

      <button
        onClick={() => openShare('facebook')}
        className={`${buttonClass} bg-blue-600 text-white hover:bg-blue-700`}
        aria-label="Share on Facebook"
        title="Share on Facebook"
      >
        <FaFacebook className="w-5 h-5" />
      </button>

      <button
        onClick={() => openShare('linkedin')}
        className={`${buttonClass} bg-blue-700 text-white hover:bg-blue-800`}
        aria-label="Share on LinkedIn"
        title="Share on LinkedIn"
      >
        <FaLinkedin className="w-5 h-5" />
      </button>

      <button
        onClick={() => openShare('whatsapp')}
        className={`${buttonClass} bg-green-600 text-white hover:bg-green-700`}
        aria-label="Share on WhatsApp"
        title="Share on WhatsApp"
      >
        <FaWhatsapp className="w-5 h-5" />
      </button>

      <button
        onClick={copyToClipboard}
        className={`${buttonClass} ${copied ? 'bg-green-500' : 'bg-gray-600'} text-white hover:bg-gray-700`}
        aria-label="Copy link"
        title={copied ? "Copied!" : "Copy link"}
      >
        <FaLink className="w-5 h-5" />
      </button>
    </div>
  );
}