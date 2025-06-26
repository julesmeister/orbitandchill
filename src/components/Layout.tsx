"use client";

import React from 'react';
import Link from 'next/link';
import Navbar from './Navbar';
import { useNewsletterSettings } from '@/hooks/useNewsletterSettings';
import { usePageTracking } from '@/hooks/usePageTracking';
import { useUserStore } from '@/store/userStore';
import AnalyticsConsentBanner from './analytics/AnalyticsConsentBanner';
import { acceptAnalyticsConsent, declineAnalyticsConsent } from '@/utils/analyticsConsent';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { settings: newsletterSettings, isLoading: newsletterLoading, refresh: refreshNewsletterSettings } = useNewsletterSettings();
  const { user } = useUserStore();
  
  // Debug logging for newsletter state
  React.useEffect(() => {
    console.log('🔍 Layout Newsletter Debug:', {
      isLoading: newsletterLoading,
      settings: newsletterSettings,
      enabled: newsletterSettings.enabled,
      willRender: !newsletterLoading && newsletterSettings.enabled,
      timestamp: new Date().toISOString()
    });
  }, [newsletterLoading, newsletterSettings]);
  
  // Automatically track page views
  usePageTracking(user?.id);

  // Listen for admin settings updates
  React.useEffect(() => {
    const handleSettingsUpdate = () => {
      console.log('🔔 Admin settings updated event received, refreshing newsletter settings...');
      refreshNewsletterSettings();
    };

    // Listen for custom event from admin settings
    window.addEventListener('adminSettingsUpdated', handleSettingsUpdate);
    
    return () => {
      window.removeEventListener('adminSettingsUpdated', handleSettingsUpdate);
    };
  }, [refreshNewsletterSettings]);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="w-screen bg-white mt-auto">
        {/* Newsletter Section - Conditionally rendered based on admin settings */}
        {!newsletterLoading && newsletterSettings.enabled && (
          <section className="px-[5%] py-16" style={{ backgroundColor: newsletterSettings.backgroundColor }}>
            <div className="w-full text-center">
              <h3 className="font-space-grotesk text-3xl font-bold text-black mb-4">
                {newsletterSettings.title}
              </h3>
              <p className="font-inter text-lg text-black/80 mb-8 max-w-2xl mx-auto leading-relaxed">
                {newsletterSettings.description}
              </p>
              <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-0 border border-black">
                <input
                  type="email"
                  placeholder={newsletterSettings.placeholderText}
                  className="flex-1 px-6 py-4 text-black placeholder-black/50 focus:outline-none border-r border-black bg-white font-inter"
                />
                <button className="bg-black text-white px-8 py-4 font-semibold font-inter hover:bg-gray-800 transition-colors">
                  {newsletterSettings.buttonText}
                </button>
              </div>
              <p className="font-inter text-sm text-black/60 mt-4">
                {newsletterSettings.privacyText}
              </p>
            </div>
          </section>
        )}

        {/* Main Footer Content */}
        <section className="px-[5%] py-12">
          <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
              {/* Brand Section */}
              <div className="md:border-r md:border-gray-200 md:pr-8">
                <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">Orbit and Chill</h3>
                <p className="font-inter text-sm text-black/80 leading-relaxed mb-6">
                  Professional astrology tools combining ancient wisdom with modern technology. Generate natal charts, explore horary questions, and discover your ideal locations worldwide.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-black hover:text-black/70 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-black hover:text-black/70 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-black hover:text-black/70 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.748-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-black hover:text-black/70 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.40s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Features */}
              <div className="md:border-r md:border-gray-200 md:pr-8">
                <h4 className="font-space-grotesk text-sm font-bold text-black mb-6">Features</h4>
                <ul className="space-y-4">
                  <li>
                    <Link href="/chart" className="font-inter text-sm text-black hover:text-black/70 transition-colors">
                      Natal Charts
                    </Link>
                  </li>
                  <li>
                    <Link href="/horary" className="font-inter text-sm text-black hover:text-black/70 transition-colors">
                      Horary Astrology
                    </Link>
                  </li>
                  <li>
                    <Link href="/astrocartography" className="font-inter text-sm text-black hover:text-black/70 transition-colors">
                      Astrocartography
                    </Link>
                  </li>
                  <li>
                    <Link href="/events" className="font-inter text-sm text-black hover:text-black/70 transition-colors">
                      Event Planning
                    </Link>
                  </li>
                  <li>
                    <Link href="/event-chart" className="font-inter text-sm text-black hover:text-black/70 transition-colors">
                      Event Charts
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Resources */}
              <div className="md:border-r md:border-gray-200 md:pr-8">
                <h4 className="font-space-grotesk text-sm font-bold text-black mb-6">Resources</h4>
                <ul className="space-y-4">
                  <li>
                    <Link href="/learning-center" className="font-inter text-sm text-black hover:text-black/70 transition-colors">
                      Learning Center
                    </Link>
                  </li>
                  <li>
                    <Link href="/guides" className="font-inter text-sm text-black hover:text-black/70 transition-colors">
                      Astrology Guides
                    </Link>
                  </li>
                  <li>
                    <Link href="/discussions" className="font-inter text-sm text-black hover:text-black/70 transition-colors">
                      Community Forum
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog" className="font-inter text-sm text-black hover:text-black/70 transition-colors">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="/faq" className="font-inter text-sm text-black hover:text-black/70 transition-colors">
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 className="font-space-grotesk text-sm font-bold text-black mb-6">Company</h4>
                <ul className="space-y-4">
                  <li>
                    <Link href="/about" className="font-inter text-sm text-black hover:text-black/70 transition-colors">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="font-inter text-sm text-black hover:text-black/70 transition-colors">
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="font-inter text-sm text-black hover:text-black/70 transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="font-inter text-sm text-black hover:text-black/70 transition-colors">
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="font-inter text-sm text-black/60">
                  © 2025 Orbit and Chill. All rights reserved.
                </p>
                <div className="flex items-center space-x-6 mt-4 md:mt-0">
                  <span className="font-inter text-sm text-black/60">Made with ✨ for cosmic souls</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-inter text-xs text-black/50">Powered by</span>
                    <span className="font-inter text-xs font-semibold text-black">Astronomy-Engine</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </footer>
      
      {/* Analytics Consent Banner */}
      <AnalyticsConsentBanner
        onAccept={acceptAnalyticsConsent}
        onDecline={declineAnalyticsConsent}
      />
    </div>
  );
};

export default Layout;
