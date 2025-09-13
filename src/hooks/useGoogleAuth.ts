import { useState, useCallback } from 'react';
import { useUserStore } from '../store/userStore';
import { UserActivityService } from '@/db/services/userActivityService';
import { trackUserRegistration } from '@/lib/analytics';
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
  const { updateUser, setAuthenticating, forceSetUser } = useUserStore();

  const signInWithGoogle = useCallback(async (): Promise<GoogleUser | null> => {
    console.log('🔐 Starting Google sign-in process...');
    setIsLoading(true);
    setError(null);
    
    // Set authentication lock to prevent race conditions
    setAuthenticating(true);

    try {
      // Check if Google OAuth is ready - use graceful degradation instead of throwing
      if (!isGoogleOAuthReady()) {
        const errorMessage = 'Google OAuth is not configured properly';
        setError(errorMessage);
        console.warn('⚠️ Google OAuth not available:', errorMessage);
        return null; // Return null instead of throwing to allow graceful degradation
      }

      console.log('🔐 Mock mode enabled:', AUTH_CONFIG.features.mockMode);
      console.log('🔐 Google Client ID:', AUTH_CONFIG.google.clientId?.substring(0, 20) + '...');
      
      let googleUser: GoogleUser;

      if (AUTH_CONFIG.features.mockMode) {
        // Mock implementation for development
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        googleUser = {
          id: 'google_' + Date.now(),
          email: 'john.doe@gmail.com',
          name: 'John Doe',
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

      console.log('🔐 Google user obtained:', googleUser ? { id: googleUser.id, name: googleUser.name } : null);

      // Persist user to server database first, then update store
      try {
        const response = await fetch('/api/users/profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: googleUser.id,
            username: googleUser.name,
            email: googleUser.email,
            profilePictureUrl: googleUser.picture,
            authProvider: 'google',
            // Include default privacy settings
            showZodiacPublicly: DEFAULT_USER_PREFERENCES.privacy.showZodiacPublicly,
            showStelliumsPublicly: DEFAULT_USER_PREFERENCES.privacy.showStelliumsPublicly,
            showBirthInfoPublicly: DEFAULT_USER_PREFERENCES.privacy.showBirthInfoPublicly,
            allowDirectMessages: DEFAULT_USER_PREFERENCES.privacy.allowDirectMessages,
            showOnlineStatus: DEFAULT_USER_PREFERENCES.privacy.showOnlineStatus,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          console.log(`✅ User persisted to server database:`, {
            action: result.action,
            userId: googleUser.id,
            userType: 'google'
          });
          
          // Track user registration for analytics
          trackUserRegistration('google');
          
          // Update local store with the user data from server response
          if (result.user) {
            // Use the user data returned from the server, ensuring proper data types
            const serverUser = {
              ...result.user,
              // Ensure dates are Date objects for local store
              createdAt: result.user.createdAt ? new Date(result.user.createdAt) : new Date(),
              updatedAt: result.user.updatedAt ? new Date(result.user.updatedAt) : new Date(),
            };
            console.log('🔐 Updating user store with server user:', serverUser);
            // Use forceSetUser to ensure no anonymous data persists
            forceSetUser(serverUser as any);
            
            // Force Zustand to persist to localStorage immediately
            await useUserStore.persist.rehydrate();
            
            // Verify the update actually happened
            const updatedState = useUserStore.getState();
            console.log('🔐 Updated state after updateUser:', updatedState.user);
            
            if (updatedState.user?.authProvider === 'google') {
              console.log('✅ Local store updated with server user data, verified Google auth');
            } else {
              console.warn('⚠️ User state update may have failed, retrying...');
              console.log('⚠️ Current user auth provider:', updatedState.user?.authProvider);
              // Retry the update
              await updateUser(serverUser);
              const retryState = useUserStore.getState();
              console.log('🔐 State after retry:', retryState.user);
            }
          } else {
            // Fallback to local user data if server doesn't return user
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
            console.log('✅ Local store updated with fallback user data');
          }
        } else {
          console.warn('⚠️ Failed to persist user to server database:', response.status);
          
          // Still update local store even if server fails
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
        }
      } catch (dbError) {
        console.warn('⚠️ Could not persist user to server database:', dbError);
        
        // Update local store even if database persistence fails
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
      }

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
      console.warn('⚠️ Google sign-in failed:', errorMessage);
      return null; // Return null instead of throwing to allow graceful degradation
    } finally {
      setIsLoading(false);
      // Release authentication lock
      setAuthenticating(false);
    }
  }, [updateUser, setAuthenticating, forceSetUser]);

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