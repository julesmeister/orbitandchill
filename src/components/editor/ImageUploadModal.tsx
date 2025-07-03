/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useRef, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faLink, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSelect: (src: string, alt: string) => void;
}

export default function ImageUploadModal({ 
  isOpen, 
  onClose, 
  onImageSelect 
}: ImageUploadModalProps) {
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [error, setError] = useState<string | null>(null);


  const handleUrlSubmit = useCallback(() => {
    if (!imageUrl.trim()) {
      setError('Please enter an image URL');
      return;
    }

    try {
      const url = new URL(imageUrl);
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        setError('Please enter a valid HTTP or HTTPS URL');
        return;
      }

      // Check if URL looks like an image
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
      const hasImageExtension = imageExtensions.some(ext => url.pathname.toLowerCase().endsWith(ext));
      
      // Also accept URLs from known image hosting services
      const knownImageHosts = ['imgur.com', 'cloudinary.com', 'unsplash.com', 'pexels.com', 'imgbb.com', 'i.ibb.co', 'cdn.discordapp.com'];
      const isKnownHost = knownImageHosts.some(host => url.hostname.includes(host));

      if (!hasImageExtension && !isKnownHost) {
        setError('URL does not appear to be an image. Common formats: .jpg, .png, .gif');
        return;
      }

      onImageSelect(imageUrl, imageAlt || 'Image');
      onClose();
    } catch {
      setError('Please enter a valid URL');
    }
  }, [imageUrl, imageAlt, onImageSelect, onClose]);

  const handleClose = useCallback(() => {
    setImageUrl('');
    setImageAlt('');
    setError(null);
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 z-[90]"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="fixed bottom-4 right-4 z-[100] w-[480px] max-w-[calc(100vw-2rem)] bg-white border-2 border-black shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-black">
          <h3 className="font-space-grotesk text-lg font-bold text-black">
            Add Image
          </h3>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-black hover:text-white transition-colors border border-black"
            aria-label="Close"
          >
            <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
          </button>
        </div>


        {/* Content */}
        <div className="p-6">
          {/* ImgBB Recommendation - Synapsas Style */}
          <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-blue-100 border border-black hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-white border border-black flex items-center justify-center">
                <FontAwesomeIcon icon={faExternalLinkAlt} className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-space-grotesk text-lg font-bold text-black mb-2">
                  Need to upload an image?
                </h4>
                <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                  Upload your image to ImgBB first to get a permanent URL that works everywhere
                </p>
                <a
                  href="https://imgbb.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-black text-white font-medium hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300"
                >
                  Go to ImgBB.com
                  <FontAwesomeIcon icon={faExternalLinkAlt} className="w-4 h-4 ml-2" />
                </a>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* URL Form */}
          <div className="space-y-4">
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-black mb-2">
                Image URL <span className="text-red-500">*</span>
              </label>
              <input
                id="imageUrl"
                type="url"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setError(null);
                }}
                placeholder="https://i.ibb.co/example/image.jpg"
                className="w-full px-3 py-2 border border-black focus:outline-none focus:ring-2 focus:ring-black/20"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleUrlSubmit();
                  }
                }}
              />
            </div>
            <div>
              <label htmlFor="imageAlt" className="block text-sm font-medium text-black mb-2">
                Alt Text (optional)
              </label>
              <input
                id="imageAlt"
                type="text"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                placeholder="Describe the image"
                className="w-full px-3 py-2 border border-black focus:outline-none focus:ring-2 focus:ring-black/20"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleUrlSubmit();
                  }
                }}
              />
            </div>
            <div className="pt-2">
              <button
                onClick={handleUrlSubmit}
                className="w-full px-4 py-3 bg-black text-white hover:bg-gray-800 transition-colors font-medium"
              >
                Add Image
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}