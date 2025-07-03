/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useRef, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUpload, faLink, faImage, faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';

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
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'canva'>('url');
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        const fileName = file.name.replace(/\.[^/.]+$/, ''); // Remove extension
        onImageSelect(base64, fileName);
        onClose();
      };
      reader.onerror = () => {
        setError('Failed to read file');
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError('Failed to process image');
      setIsLoading(false);
    }
  }, [onImageSelect, onClose]);

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
      const knownImageHosts = ['imgur.com', 'cloudinary.com', 'unsplash.com', 'pexels.com', 'canva.com', 'cdn.discordapp.com'];
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
    setActiveTab('url');
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

        {/* Tabs */}
        <div className="flex border-b border-black">
          <button
            onClick={() => setActiveTab('url')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'url'
                ? 'bg-black text-white'
                : 'bg-white text-black hover:bg-gray-100'
            }`}
          >
            <FontAwesomeIcon icon={faLink} className="w-4 h-4 mr-2" />
            From URL
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors border-l border-black ${
              activeTab === 'upload'
                ? 'bg-black text-white'
                : 'bg-white text-black hover:bg-gray-100'
            }`}
          >
            <FontAwesomeIcon icon={faUpload} className="w-4 h-4 mr-2" />
            Upload
          </button>
          <button
            onClick={() => setActiveTab('canva')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors border-l border-black ${
              activeTab === 'canva'
                ? 'bg-black text-white'
                : 'bg-white text-black hover:bg-gray-100'
            }`}
          >
            <FontAwesomeIcon icon={faCloudUploadAlt} className="w-4 h-4 mr-2" />
            Canva
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* URL Tab */}
          {activeTab === 'url' && (
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
                  placeholder="https://example.com/image.jpg"
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
          )}

          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-black p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <FontAwesomeIcon icon={faImage} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-black font-medium mb-2">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-gray-600">
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>
              {isLoading && (
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center">
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Canva Tab */}
          {activeTab === 'canva' && (
            <div className="space-y-4">
              <div className="p-6 bg-gray-50 border border-gray-300 text-center">
                <FontAwesomeIcon icon={faCloudUploadAlt} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="font-medium text-black mb-2">
                  Canva Integration Tips
                </h4>
                <ol className="text-sm text-gray-700 text-left space-y-2 max-w-sm mx-auto">
                  <li>1. Create your design in Canva</li>
                  <li>2. Click "Share" → "More" → "View only link"</li>
                  <li>3. Copy the sharing link</li>
                  <li>4. Use the "From URL" tab with your Canva link</li>
                </ol>
                <p className="text-xs text-gray-600 mt-4">
                  Note: Make sure your Canva design is set to public or has link sharing enabled
                </p>
              </div>
              <button
                onClick={() => setActiveTab('url')}
                className="w-full px-4 py-3 bg-black text-white hover:bg-gray-800 transition-colors font-medium"
              >
                Go to URL Tab
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}