/* eslint-disable @typescript-eslint/no-unused-vars */
// Authentication configuration for Google OAuth
export const AUTH_CONFIG = {
  // Google OAuth Configuration
  google: {
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
    redirectUri: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    scopes: ['profile', 'email'],
    
    // Google Identity Services configuration
    // See: https://developers.google.com/identity/gsi/web/guides/overview
    gsi: {
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
      scope: 'profile email',
      callback: 'handleGoogleSignIn', // Function name for callback
      auto_select: false, // Don't auto-select account
      cancel_on_tap_outside: true,
      context: 'signin',
      ux_mode: 'popup', // or 'redirect'
      login_uri: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    }
  },

  // Feature flags
  features: {
    // Enable/disable authentication providers
    googleOAuth: true,
    
    // Enable mock mode for development (disable for production)
    mockMode: process.env.NODE_ENV === 'development',
    
    // Automatic sign-in prompting
    autoPrompt: {
      enabled: true,
      delayMs: 2000, // Show prompt after 2 seconds
      dismissible: true, // Allow users to dismiss
      rememberDismissal: true, // Remember if user dismissed
    }
  },

  // Session configuration
  session: {
    // Session timeout in milliseconds (24 hours)
    timeoutMs: 24 * 60 * 60 * 1000,
    
    // Session storage key
    storageKey: 'luckstrology_session',
    
    // Refresh token before expiration (6 hours before)
    refreshBeforeExpiryMs: 6 * 60 * 60 * 1000,
  },

  // URLs for authentication flows
  urls: {
    loginSuccess: '/profile',
    loginFailure: '/',
    logoutRedirect: '/',
  }
};

// Environment validation
export const validateAuthConfig = () => {
  const warnings: string[] = [];
  const errors: string[] = [];

  // Check required environment variables for production
  if (process.env.NODE_ENV === 'production') {
    if (!AUTH_CONFIG.google.clientId) {
      errors.push('NEXT_PUBLIC_GOOGLE_CLIENT_ID is required for production');
    }
    
    if (!process.env.NEXT_PUBLIC_APP_URL) {
      warnings.push('NEXT_PUBLIC_APP_URL should be set for production');
    }
  }

  // Log warnings and errors
  if (warnings.length > 0) {
    console.warn('Authentication config warnings:', warnings);
  }
  
  if (errors.length > 0) {
    console.error('Authentication config errors:', errors);
    throw new Error(`Authentication configuration errors: ${errors.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    warnings,
    errors
  };
};

// Helper function to check if Google OAuth is ready
export const isGoogleOAuthReady = (): boolean => {
  if (AUTH_CONFIG.features.mockMode) {
    return true; // Always ready in mock mode
  }
  
  return !!(
    AUTH_CONFIG.google.clientId && 
    AUTH_CONFIG.features.googleOAuth &&
    typeof window !== 'undefined'
  );
};

// Google OAuth scope helpers
export const GOOGLE_SCOPES = {
  PROFILE: 'profile',
  EMAIL: 'email',
  OPENID: 'openid',
} as const;

// Default user preferences for new accounts
export const DEFAULT_USER_PREFERENCES = {
  privacy: {
    showZodiacPublicly: true,
    showStelliumsPublicly: false,
    showBirthInfoPublicly: false,
    allowDirectMessages: true,
    showOnlineStatus: true,
  },
  notifications: {
    emailNotifications: true,
    discussionNotifications: false,
    eventReminders: true,
    weeklyDigest: false,
  },
  appearance: {
    defaultChartTheme: 'light' as const,
    compactMode: false,
    animations: true,
  },
  astrology: {
    preferredHouseSystem: 'placidus' as const,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: 'en' as const,
  }
};

export type UserPreferences = typeof DEFAULT_USER_PREFERENCES;