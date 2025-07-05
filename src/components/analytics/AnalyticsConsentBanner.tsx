/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from 'react';

interface AnalyticsConsentBannerProps {
  onAccept: () => void;
  onDecline: () => void;
}

export default function AnalyticsConsentBanner({ onAccept, onDecline }: AnalyticsConsentBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('analytics_consent');
    if (!consent) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('analytics_consent', 'accepted');
    localStorage.setItem('analytics_consent_date', new Date().toISOString());
    setIsVisible(false);
    onAccept();
  };

  const handleDecline = () => {
    localStorage.setItem('analytics_consent', 'declined');
    localStorage.setItem('analytics_consent_date', new Date().toISOString());
    setIsVisible(false);
    onDecline();
  };

  const handleDismiss = () => {
    // Temporary dismissal - will show again on next visit
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-black">
      <div className="w-full">
        <div className="flex gap-0 border-b border-black">
          
          {/* Main Content Section - Blue */}
          <div className="flex-1 p-4 border-r border-black" style={{ backgroundColor: '#6bdbff' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-6 h-6 bg-black flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">🍪</span>
                </div>
                <div>
                  <h3 className="font-space-grotesk text-lg font-bold text-black">
                    Analytics & Privacy
                  </h3>
                  <p className="font-open-sans text-sm text-black leading-tight">
                    We use analytics to improve your experience and understand how our astrology tools are used. 
                    <span className="font-semibold"> No personal data is shared with third parties.</span>
                  </p>
                </div>
              </div>

              {/* Button Group - Connected */}
              <div className="flex gap-0 border border-black ml-4">
                <button
                  onClick={handleAccept}
                  className="group relative px-4 py-2 bg-black text-white font-space-grotesk font-semibold text-sm border-r border-black hover:bg-gray-800 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-200/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <span className="relative">Accept</span>
                </button>
                
                <button
                  onClick={handleDecline}
                  className="group relative px-4 py-2 bg-white text-black font-space-grotesk font-semibold text-sm border-r border-black hover:bg-black hover:text-white transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent via-red-200/20 to-transparent translate-x-[100%] group-hover:translate-x-[-100%] transition-transform duration-700"></div>
                  <span className="relative">Decline</span>
                </button>
                
                <button
                  onClick={handleDismiss}
                  className="group relative px-4 py-2 bg-white text-black font-space-grotesk font-semibold text-sm hover:bg-black hover:text-white transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-200/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <span className="relative">Later</span>
                </button>
              </div>
            </div>
          </div>

          {/* Expandable Data Info Section - Yellow */}
          <div className="w-64 border-r border-black" style={{ backgroundColor: '#f2e356' }}>
            <details className="group">
              <summary className="group relative cursor-pointer font-space-grotesk text-sm font-bold text-black hover:bg-black hover:text-white transition-all duration-300 list-none overflow-hidden h-16 flex items-center">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-200/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <div className="relative px-4 flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-black group-hover:bg-white flex items-center justify-center transition-colors duration-300">
                      <span className="text-white group-hover:text-black text-xs transition-colors duration-300">?</span>
                    </div>
                    <span>What data?</span>
                  </div>
                  <div className="w-5 h-5 bg-black group-hover:bg-white flex items-center justify-center transition-colors duration-300">
                    <span className="text-white group-hover:text-black text-xs group-open:rotate-180 transition-all duration-300">▼</span>
                  </div>
                </div>
              </summary>
              <div className="border-t border-black bg-white">
                {/* We Collect Section - Green */}
                <div className="p-3 border-b border-black" style={{ backgroundColor: '#51bd94' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 bg-black flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <p className="font-space-grotesk text-xs font-bold text-black">We collect:</p>
                  </div>
                  <ul className="font-open-sans text-xs text-black space-y-1">
                    <li>• Page views</li>
                    <li>• Chart usage</li>
                    <li>• Discussions</li>
                    <li>• Location permissions</li>
                    <li>• Session data</li>
                  </ul>
                </div>
                
                {/* We Do NOT Collect Section - Purple */}
                <div className="p-3" style={{ backgroundColor: '#ff91e9' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 bg-black flex items-center justify-center">
                      <span className="text-white text-xs">✗</span>
                    </div>
                    <p className="font-space-grotesk text-xs font-bold text-black">We do NOT collect:</p>
                  </div>
                  <ul className="font-open-sans text-xs text-black space-y-1">
                    <li>• Birth information</li>
                    <li>• Messages/content</li>
                    <li>• Email addresses</li>
                    <li>• Precise location</li>
                  </ul>
                </div>
              </div>
            </details>
          </div>

          {/* Dismiss Button */}
          <button
            onClick={handleDismiss}
            className="w-12 p-4 bg-black text-white hover:bg-gray-800 transition-colors flex items-center justify-center"
            aria-label="Dismiss"
          >
            <span className="text-lg leading-none">×</span>
          </button>
        </div>
      </div>
    </div>
  );
}