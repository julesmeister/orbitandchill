/**
 * Newsletter Configuration Override
 * 
 * This file acts as a master switch and fallback for newsletter settings:
 * 
 * - enabled: 'auto' = Use admin database settings (normal operation)
 * - enabled: true = Force newsletter ON (override admin settings)  
 * - enabled: false = Force newsletter OFF (override admin settings)
 * 
 * When enabled: 'auto', all settings come from admin database.
 * When enabled: true/false, database settings are ignored for visibility but still used for content.
 */

export const newsletterConfig: {
  enabled: 'auto' | boolean;
  fallback: {
    title: string;
    description: string;
    placeholderText: string;
    buttonText: string;
    privacyText: string;
    backgroundColor: string;
  };
} = {
  // Master control: 'auto' | true | false
  enabled: 'auto', // Using admin database settings - control via /admin panel
  
  // Fallback settings (used when database is unavailable)
  fallback: {
    title: 'Stay Connected to the Cosmos',
    description: 'Get weekly astrology insights, new feature updates, and cosmic wisdom delivered to your inbox.',
    placeholderText: 'Enter your email',
    buttonText: 'Subscribe',
    privacyText: 'No spam, unsubscribe anytime. We respect your cosmic privacy.',
    backgroundColor: '#f0e3ff'
  }
};