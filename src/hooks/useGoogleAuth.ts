import { useState, useCallback } from 'react';
import { useUserStore } from '../store/userStore';
import { UserActivityService } from '@/db/services/userActivityService';
import { AUTH_CONFIG, isGoogleOAuthReady, DEFAULT_USER_PREFERENCES } from '@/config/auth';

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
}

// Utility function to get user IP (for activity logging)
const getUserIP = async (): Promise<string | undefined> => {
  try {
    // In a real implementation, you might use a service like:
    // const response = await fetch('https://api.ipify.org?format=json');
    // const data = await response.json();
    // return data.ip;
    
    // For now, return undefined (will be handled gracefully by activity service)
    return undefined;
  } catch (error) {
    console.warn('Could not fetch user IP:', error);
    return undefined;
  }
};

export function useGoogleAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { updateUser } = useUserStore();

  const signInWithGoogle = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check if Google OAuth is ready
      if (!isGoogleOAuthReady()) {
        throw new Error('Google OAuth is not configured properly');
      }

      let googleUser: GoogleUser;

      if (AUTH_CONFIG.features.mockMode) {
        // Mock implementation for development
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        googleUser = {
          id: 'google_' + Date.now(),
          email: 'user@gmail.com',
          name: 'Google User',
          picture: 'https://lh3.googleusercontent.com/a/default-user=s96-c'
        };
      } else {
        // Real Google OAuth implementation using Google Identity Services
        const response = await new Promise<GoogleUser>((resolve, reject) => {
          // Check if Google Identity Services is loaded
          if (!window.google || !window.google.accounts) {
            reject(new Error('Google Identity Services not loaded. Please refresh the page.'));
            return;
          }

          // Initialize the OAuth2 token client
          const tokenClient = window.google.accounts.oauth2.initTokenClient({
            client_id: AUTH_CONFIG.google.clientId,
            scope: AUTH_CONFIG.google.scopes.join(' '),
            callback: async (tokenResponse: any) => {
              try {
                if (tokenResponse.error) {
                  reject(new Error(`Google OAuth error: ${tokenResponse.error}`));
                  return;
                }

                // Fetch user info from Google API using the access token
                const userResponse = await fetch(
                  `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenResponse.access_token}`,
                  {
                    headers: {
                      'Authorization': `Bearer ${tokenResponse.access_token}`,
                      'Accept': 'application/json',
                    },
                  }
                );

                if (!userResponse.ok) {
                  throw new Error(`Failed to fetch user info: ${userResponse.status} ${userResponse.statusText}`);
                }

                const userData = await userResponse.json();
                
                // Validate required user data
                if (!userData.id || !userData.email || !userData.name) {
                  throw new Error('Incomplete user data received from Google');
                }

                resolve({
                  id: userData.id,
                  email: userData.email,
                  name: userData.name,
                  picture: userData.picture || 'https://lh3.googleusercontent.com/a/default-user=s96-c'
                });
              } catch (error) {
                reject(error instanceof Error ? error : new Error('Unknown error occurred during user info fetch'));
              }
            },
            error_callback: (error: any) => {
              reject(new Error(`Google OAuth error: ${error.type || 'Unknown error'}`));
            }
          });

          // Request access token (this will trigger the OAuth popup)
          tokenClient.requestAccessToken();
        });

        googleUser = response;
      }

      // Update user store with Google auth data and default preferences
      await updateUser({
        id: googleUser.id,
        username: googleUser.name,
        email: googleUser.email,
        profilePictureUrl: googleUser.picture,
        authProvider: 'google',
        privacy: DEFAULT_USER_PREFERENCES.privacy,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Log user activity
      await UserActivityService.recordUserActivity(
        googleUser.id,
        'user_login',
        { authProvider: 'google' },
        {
          sessionId: `session_${Date.now()}`,
          ipAddress: typeof window !== 'undefined' ? await getUserIP() : undefined
        }
      );

      // Clear the Google prompt dismissal flag since user signed in
      if (typeof window !== 'undefined') {
        localStorage.removeItem('google-signin-prompt-dismissed');
      }

      return googleUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in with Google';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [updateUser]);

  const signOut = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get current user for activity logging
      const currentUser = useUserStore.getState().user;
      
      // Log logout activity before clearing user data
      if (currentUser) {
        await UserActivityService.recordUserActivity(
          currentUser.id,
          'user_logout',
          { authProvider: currentUser.authProvider },
          {
            sessionId: `session_${Date.now()}`,
            ipAddress: typeof window !== 'undefined' ? await getUserIP() : undefined
          }
        );
      }

      // Sign out from Google if user is authenticated with Google
      if (currentUser?.authProvider === 'google') {
        try {
          // Note: Google Identity Services doesn't have a direct sign out method
          // The token will naturally expire, but we can revoke it for security
          // This is optional but recommended for security
          
          // For now, we just clear local session data
          // In a production app, you might want to revoke the token:
          // await fetch(`https://oauth2.googleapis.com/revoke?token=${accessToken}`, { method: 'POST' });
          
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.warn('Could not revoke Google token:', error);
          // Continue with logout even if token revocation fails
        }
      } else {
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Generate new anonymous user name
      const adjectives = [
        'Cosmic', 'Stellar', 'Mystic', 'Lunar', 'Solar', 'Astral', 'Celestial', 'Divine',
        'Ethereal', 'Radiant', 'Serene', 'Mystical', 'Enchanted', 'Starlight', 'Moonbeam',
        'Supernova', 'Galactic', 'Nebular', 'Orbital', 'Planetary'
      ];
      
      const nouns = [
        'Seeker', 'Wanderer', 'Observer', 'Dreamer', 'Voyager', 'Explorer', 'Sage',
        'Oracle', 'Mystic', 'Stargazer', 'Moonchild', 'Starseed', 'Lightbringer',
        'Pathfinder', 'Navigator', 'Guardian', 'Keeper', 'Whisper', 'Echo', 'Soul'
      ];
      
      const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
      const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
      const randomNumber = Math.floor(Math.random() * 999) + 1;
      
      // Clear user data - Navbar will handle creating new anonymous user
      await useUserStore.getState().clearProfile();
      
      const anonymousName = `${randomAdjective} ${randomNoun} ${randomNumber}`;
      return anonymousName;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign out';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    signInWithGoogle,
    signOut,
    isLoading,
    error,
    clearError
  };
}