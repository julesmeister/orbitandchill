/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import { newsletterConfig } from '../config/newsletter';

export interface NewsletterSettings {
  enabled: boolean;
  title: string;
  description: string;
  placeholderText: string;
  buttonText: string;
  privacyText: string;
  backgroundColor: string;
}

const DEFAULT_NEWSLETTER_SETTINGS: NewsletterSettings = {
  enabled: false, // Default is FALSE - newsletter is disabled by default
  title: 'Stay Connected to the Cosmos',
  description: 'Get weekly astrology insights, new feature updates, and cosmic wisdom delivered to your inbox.',
  placeholderText: 'Enter your email',
  buttonText: 'Subscribe',
  privacyText: 'No spam, unsubscribe anytime. We respect your cosmic privacy.',
  backgroundColor: '#f0e3ff'
};

export function useNewsletterSettings() {
  const [settings, setSettings] = useState<NewsletterSettings>(DEFAULT_NEWSLETTER_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshCounter, setRefreshCounter] = useState(0);

  useEffect(() => {
    async function fetchNewsletterSettings() {
      try {
        // console.log('🚀 Starting newsletter settings fetch, refreshCounter:', refreshCounter);
        // console.log('📋 Newsletter config override:', newsletterConfig);
        setIsLoading(true);
        setError(null);

        // Check config file override first
        if (newsletterConfig.enabled === true) {
          // console.log('🔒 Config override: Newsletter FORCED ON');
          // Force enabled, but still fetch content from database
        } else if (newsletterConfig.enabled === false) {
          // console.log('🔒 Config override: Newsletter FORCED OFF');
          setSettings({ ...newsletterConfig.fallback, enabled: false });
          setIsLoading(false);
          return;
        } else if (newsletterConfig.enabled === 'auto') {
          // console.log('🔄 Config set to AUTO: Using admin database settings');
        }

        // Fetch newsletter settings from admin API
        const url = '/api/admin/settings?keys=newsletter.enabled,newsletter.title,newsletter.description,newsletter.placeholder_text,newsletter.button_text,newsletter.privacy_text,newsletter.background_color';
        // console.log('📡 Fetching from URL:', url);
        
        const response = await fetch(url);
        // console.log('📥 Response status:', response.status, response.statusText);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch settings: ${response.status}`);
        }

        const data = await response.json();
        
        // Debug logging removed
        
        if (data.success && data.settings) {
          // Convert admin settings to newsletter settings object
          const fetchedSettings = data.settings.reduce((acc: any, setting: any) => {
            // Processing setting
            switch (setting.key) {
              case 'newsletter.enabled':
                acc.enabled = setting.value === 'true';
                // Database enabled setting processed
                break;
              case 'newsletter.title':
                acc.title = setting.value;
                break;
              case 'newsletter.description':
                acc.description = setting.value;
                break;
              case 'newsletter.placeholder_text':
                acc.placeholderText = setting.value;
                break;
              case 'newsletter.button_text':
                acc.buttonText = setting.value;
                break;
              case 'newsletter.privacy_text':
                acc.privacyText = setting.value;
                break;
              case 'newsletter.background_color':
                acc.backgroundColor = setting.value;
                break;
            }
            return acc;
          }, {});

          // Apply config override logic
          const baseSettings = { ...DEFAULT_NEWSLETTER_SETTINGS, ...fetchedSettings };
          
          let finalSettings = baseSettings;
          if (typeof newsletterConfig.enabled === 'boolean' && newsletterConfig.enabled === true) {
            // Force enabled regardless of database
            finalSettings = { ...baseSettings, enabled: true };
            // Config override applied: Forced ON
          } else if (typeof newsletterConfig.enabled === 'boolean' && newsletterConfig.enabled === false) {
            // Force disabled regardless of database
            finalSettings = { ...baseSettings, enabled: false };
            // Config override applied: Forced OFF
          }
          // If 'auto', use database value as-is
          
          // Final newsletter settings applied
          setSettings(finalSettings);
        } else {
          // Use fallback settings if API returns no settings
          // Newsletter API returned no settings, using config fallback
          const fallbackSettings = { 
            ...newsletterConfig.fallback, 
            enabled: typeof newsletterConfig.enabled === 'boolean' && newsletterConfig.enabled === true ? true : false 
          };
          setSettings(fallbackSettings);
        }
      } catch (err) {
        console.error('❌ Failed to fetch newsletter settings, using config fallback:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        const fallbackSettings = { 
          ...newsletterConfig.fallback, 
          enabled: typeof newsletterConfig.enabled === 'boolean' && newsletterConfig.enabled === true ? true : false 
        };
        setSettings(fallbackSettings);
      } finally {
        setIsLoading(false);
        // Newsletter settings fetch complete
      }
    }

    fetchNewsletterSettings();
  }, [refreshCounter]);

  return {
    settings,
    isLoading,
    error,
    refresh: () => {
      setRefreshCounter(prev => prev + 1);
    }
  };
}