/* eslint-disable @typescript-eslint/no-unused-vars */
// TypeScript definitions for Google Identity Services

interface GoogleTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  authuser?: string;
  prompt?: string;
  error?: string;
  error_description?: string;
}

interface GoogleTokenClient {
  requestAccessToken(): void;
}

interface GoogleOAuth2 {
  initTokenClient(config: {
    client_id: string;
    scope: string;
    callback: (response: GoogleTokenResponse) => void;
    error_callback?: (error: { type: string; details?: string }) => void;
  }): GoogleTokenClient;
}

interface GoogleAccounts {
  oauth2: GoogleOAuth2;
}

interface GoogleAPI {
  accounts: GoogleAccounts;
}

// Extend the Window interface to include Google Identity Services
declare global {
  interface Window {
    google?: GoogleAPI;
  }
}

// Google OAuth2 User Info API response
export interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

// Export the types for use in other files
export type { GoogleTokenResponse, GoogleTokenClient, GoogleOAuth2, GoogleAccounts, GoogleAPI };