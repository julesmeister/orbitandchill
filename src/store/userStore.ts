import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, BirthData, UserPrivacySettings } from "@/types/user";
import { trackUserRegistration } from "@/lib/analytics";

interface UserState {
  // State
  user: User | null;
  isLoading: boolean;
  isAuthenticating: boolean; // Lock to prevent race conditions

  // Computed values
  isProfileComplete: boolean;
  hasStoredData: boolean;

  // Actions
  updateUser: (data: Partial<User>) => Promise<void>;
  updateBirthData: (data: Partial<BirthData>) => Promise<void>;
  updatePrivacySettings: (data: Partial<UserPrivacySettings>) => Promise<void>;
  loadProfile: () => Promise<void>;
  clearProfile: () => Promise<void>;
  ensureAnonymousUser: (customName?: string) => Promise<void>;
  generateAnonymousId: () => string;
  setAuthenticating: (value: boolean) => void;
  forceSetUser: (user: User) => void;
}

const generateAnonymousId = (): string => {
  return (
    "anon_" + Math.random().toString(36).substring(2, 11) + Date.now().toString(36)
  );
};

const createInitialUser = (persistentId?: string): User => {
  const now = new Date();
  const userId = persistentId || generateAnonymousId();
  
  return {
    id: userId,
    username: "Anonymous", // Will be updated with creative name in Navbar
    authProvider: "anonymous",
    createdAt: now,
    updatedAt: now,
    hasNatalChart: false,
    subscriptionTier: "free", // Default to free tier
    privacy: {
      showZodiacPublicly: false,
      showStelliumsPublicly: false,
      showBirthInfoPublicly: false,
      allowDirectMessages: true,
      showOnlineStatus: false,
    }
  };
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Initial state - will be overridden by persisted data if it exists
      user: null,
      isLoading: false,
      isAuthenticating: false,

      // Computed values
      get isProfileComplete() {
        const user = get().user;
        return !!(
          user?.birthData?.dateOfBirth &&
          user?.birthData?.timeOfBirth &&
          user?.birthData?.locationOfBirth &&
          user?.birthData?.coordinates.lat &&
          user?.birthData?.coordinates.lon
        );
      },

      get hasStoredData() {
        return get().user !== null;
      },

      // Actions
      updateUser: async (data) => {
        const currentUser = get().user;
        
        // IMPORTANT: Preserve authProvider if we're updating a Google user
        // Don't let anonymous overwrites happen after Google auth
        if (currentUser?.authProvider === 'google' && !data.authProvider) {
          console.warn('⚠️ Attempted to update Google user without authProvider, preserving Google auth');
          data = { ...data, authProvider: 'google' };
        }

        const updatedUser: User = currentUser
          ? {
              ...currentUser,
              ...data,
              updatedAt: new Date(),
            }
          : {
              ...createInitialUser(localStorage.getItem('luckstrology-anonymous-id') || undefined),
              ...data,
            };

        set({ user: updatedUser });

        // Save to database if user exists and we're updating important fields
        if (currentUser?.id && (data.preferredAvatar !== undefined || data.username || data.email)) {
          try {
            const response = await fetch('/api/users/profile', {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: currentUser.id,
                username: data.username,
                email: data.email,
                preferredAvatar: data.preferredAvatar
              })
            });
            
            if (response.ok) {
              const result = await response.json();
              if (result.success && result.user) {
                // Update local state with server response to ensure consistency
                const convertedUser = {
                  ...result.user,
                  createdAt: new Date(result.user.createdAt),
                  updatedAt: new Date(result.user.updatedAt),
                  preferredAvatar: result.user.preferredAvatar,
                  birthData: result.user.dateOfBirth ? {
                    dateOfBirth: result.user.dateOfBirth,
                    timeOfBirth: result.user.timeOfBirth || '',
                    locationOfBirth: result.user.locationOfBirth || '',
                    coordinates: {
                      lat: result.user.latitude?.toString() || '',
                      lon: result.user.longitude?.toString() || '',
                    }
                  } : undefined,
                  privacy: {
                    showZodiacPublicly: result.user.showZodiacPublicly || false,
                    showStelliumsPublicly: result.user.showStelliumsPublicly || false,
                    showBirthInfoPublicly: result.user.showBirthInfoPublicly || false,
                    allowDirectMessages: result.user.allowDirectMessages ?? true,
                    showOnlineStatus: result.user.showOnlineStatus ?? true,
                  }
                };
                
                set({ user: convertedUser });
                console.log('✅ User profile updated successfully and synced with server');
              }
            } else {
              console.error('Failed to update user profile:', response.statusText);
              // Revert to previous state on server error
              set({ user: currentUser });
            }
          } catch (error) {
            console.error('Error updating user profile:', error);
            // Revert to previous state on network error
            set({ user: currentUser });
          }
        }
      },

      updateBirthData: async (data) => {
        const currentUser = get().user;
        if (!currentUser) return;

        const updatedBirthData: BirthData = {
          dateOfBirth: '',
          timeOfBirth: '',
          locationOfBirth: '',
          coordinates: { lat: '', lon: '' },
          ...currentUser.birthData,
          ...data
        };

        try {
          // Call the API to persist birth data
          const response = await fetch('/api/users/profile', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: currentUser.id,
              birthData: updatedBirthData
            })
          });

          if (response.ok) {
            const result = await response.json();
            if (result.success && result.user) {
              // Convert flat database structure back to nested store structure
              const convertedUser = {
                ...result.user,
                createdAt: new Date(result.user.createdAt),
                updatedAt: new Date(result.user.updatedAt),
                preferredAvatar: result.user.preferredAvatar, // Include preferred avatar
                birthData: result.user.dateOfBirth ? {
                  dateOfBirth: result.user.dateOfBirth,
                  timeOfBirth: result.user.timeOfBirth || '',
                  locationOfBirth: result.user.locationOfBirth || '',
                  coordinates: {
                    lat: result.user.latitude?.toString() || '',
                    lon: result.user.longitude?.toString() || '',
                  }
                } : undefined,
                privacy: {
                  showZodiacPublicly: result.user.showZodiacPublicly || false,
                  showStelliumsPublicly: result.user.showStelliumsPublicly || false,
                  showBirthInfoPublicly: result.user.showBirthInfoPublicly || false,
                  allowDirectMessages: result.user.allowDirectMessages ?? true,
                  showOnlineStatus: result.user.showOnlineStatus ?? true,
                }
              };

              set({ user: convertedUser });
            }
          } else {
            console.error('Failed to update birth data:', response.statusText);
          }
        } catch (error) {
          console.error('Error updating birth data:', error);
          // Fallback to local update only
          await get().updateUser({
            birthData: updatedBirthData,
            hasNatalChart: !!(updatedBirthData.dateOfBirth && updatedBirthData.timeOfBirth && updatedBirthData.locationOfBirth)
          });
        }
      },

      updatePrivacySettings: async (data) => {
        const currentUser = get().user;
        if (!currentUser) return;

        const updatedPrivacy = {
          ...currentUser.privacy,
          ...data
        };

        await get().updateUser({ privacy: updatedPrivacy });
      },

      loadProfile: async () => {
        set({ isLoading: true });

        try {
          // Get the current user (should already be rehydrated by Navbar)
          let localUser = get().user;
          
          // If no user in store, try manual localStorage parsing as fallback
          if (!localUser) {
            const storedData = localStorage.getItem('luckstrology-user-storage');
            
            if (storedData) {
              try {
                const parsedData = JSON.parse(storedData);
                
                if (parsedData.state && parsedData.state.user) {
                  // Convert date strings back to Date objects for consistency
                  const userData = {
                    ...parsedData.state.user,
                    createdAt: new Date(parsedData.state.user.createdAt),
                    updatedAt: new Date(parsedData.state.user.updatedAt)
                  };
                  set({ user: userData });
                  localUser = userData; // Update the local reference
                }
              } catch (parseError) {
                console.error('Failed to manually parse localStorage:', parseError);
              }
            }
          }
          
          if (localUser?.id) {
            // Fetch from Turso database via API
            const response = await fetch(`/api/users/profile?userId=${localUser.id}`);
            
            if (response.ok) {
              const result = await response.json();
              if (result.user) {
                // Validate that server user matches local user ID to prevent data contamination
                if (result.user.id !== localUser.id) {
                  console.warn('loadProfile: Server user ID mismatch, skipping update', {
                    localId: localUser.id,
                    serverId: result.user.id
                  });
                  return;
                }
                
                // Convert flat database structure to nested store structure with validation
                const convertedUser = {
                  ...result.user,
                  createdAt: new Date(result.user.createdAt),
                  updatedAt: new Date(result.user.updatedAt),
                  preferredAvatar: result.user.preferredAvatar, // Include preferred avatar
                  // Prevent admin data contamination
                  username: result.user.username === 'Orbit Chill' ? localUser.username : result.user.username,
                  email: result.user.email === 'orbitandchill@gmail.com' ? undefined : result.user.email,
                  birthData: result.user.dateOfBirth ? {
                    dateOfBirth: result.user.dateOfBirth,
                    timeOfBirth: result.user.timeOfBirth || '',
                    locationOfBirth: result.user.locationOfBirth || '',
                    coordinates: {
                      lat: result.user.latitude?.toString() || '',
                      lon: result.user.longitude?.toString() || '',
                    }
                  } : undefined,
                  privacy: {
                    showZodiacPublicly: result.user.showZodiacPublicly || false,
                    showStelliumsPublicly: result.user.showStelliumsPublicly || false,
                    showBirthInfoPublicly: result.user.showBirthInfoPublicly || false,
                    allowDirectMessages: result.user.allowDirectMessages ?? true,
                    showOnlineStatus: result.user.showOnlineStatus ?? true,
                  }
                };
                set({ user: convertedUser });
              } else {
                // Create user in Turso
                const createResponse = await fetch('/api/users/profile', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    id: localUser.id,
                    username: localUser.username,
                    email: localUser.email,
                    profilePictureUrl: localUser.profilePictureUrl,
                    authProvider: localUser.authProvider,
                    dateOfBirth: localUser.birthData?.dateOfBirth,
                    timeOfBirth: localUser.birthData?.timeOfBirth,
                    locationOfBirth: localUser.birthData?.locationOfBirth,
                    latitude: localUser.birthData?.coordinates?.lat,
                    longitude: localUser.birthData?.coordinates?.lon,
                    sunSign: localUser.sunSign,
                    stelliumSigns: localUser.stelliumSigns,
                    stelliumHouses: localUser.stelliumHouses,
                    hasNatalChart: localUser.hasNatalChart,
                    showZodiacPublicly: localUser.privacy?.showZodiacPublicly,
                    showStelliumsPublicly: localUser.privacy?.showStelliumsPublicly,
                    showBirthInfoPublicly: localUser.privacy?.showBirthInfoPublicly,
                    allowDirectMessages: localUser.privacy?.allowDirectMessages,
                    showOnlineStatus: localUser.privacy?.showOnlineStatus
                  })
                });
                
                if (createResponse.ok) {
                  const createResult = await createResponse.json();
                  if (createResult.user) {
                    // Convert flat database structure to nested store structure
                    const convertedUser = {
                      ...createResult.user,
                      createdAt: new Date(createResult.user.createdAt),
                      updatedAt: new Date(createResult.user.updatedAt),
                      preferredAvatar: createResult.user.preferredAvatar, // Include preferred avatar
                      birthData: createResult.user.dateOfBirth ? {
                        dateOfBirth: createResult.user.dateOfBirth,
                        timeOfBirth: createResult.user.timeOfBirth || '',
                        locationOfBirth: createResult.user.locationOfBirth || '',
                        coordinates: {
                          lat: createResult.user.latitude?.toString() || '',
                          lon: createResult.user.longitude?.toString() || '',
                        }
                      } : undefined,
                      privacy: {
                        showZodiacPublicly: createResult.user.showZodiacPublicly || false,
                        showStelliumsPublicly: createResult.user.showStelliumsPublicly || false,
                        showBirthInfoPublicly: createResult.user.showBirthInfoPublicly || false,
                        allowDirectMessages: createResult.user.allowDirectMessages ?? true,
                        showOnlineStatus: createResult.user.showOnlineStatus ?? true,
                      }
                    };
                    set({ user: convertedUser });
                  }
                }
              }
            }
          }
        } catch (error) {
          console.error("Error loading user from Turso:", error);
          // Keep local user if API fails
        } finally {
          set({ isLoading: false });
        }
      },

      ensureAnonymousUser: async (customName?: string) => {
        const currentUser = get().user;
        
        if (!currentUser) {
          // Check if we have a persistent anonymous ID in localStorage
          let persistentId = localStorage.getItem('luckstrology-anonymous-id');
          
          if (!persistentId) {
            persistentId = generateAnonymousId();
            localStorage.setItem('luckstrology-anonymous-id', persistentId);
          }
          
          const initialUser = createInitialUser(persistentId);
          
          const newUser = {
            ...initialUser,
            username: customName || initialUser.username
          };
          
          set({ user: newUser });
          
          // Save the new user to Turso database via API
          try {
            const response = await fetch('/api/users/profile', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                profilePictureUrl: newUser.profilePictureUrl,
                authProvider: newUser.authProvider,
                showZodiacPublicly: newUser.privacy.showZodiacPublicly,
                showStelliumsPublicly: newUser.privacy.showStelliumsPublicly,
                showBirthInfoPublicly: newUser.privacy.showBirthInfoPublicly,
                allowDirectMessages: newUser.privacy.allowDirectMessages,
                showOnlineStatus: newUser.privacy.showOnlineStatus
              })
            });
            
            if (response.ok) {
              const result = await response.json();
              // Track anonymous user registration
              trackUserRegistration('anonymous');
              
              // Validate server response and preserve clean local user
              if (result.user && result.user.id === newUser.id) {
                // Only update with clean server fields, preserve local anonymous user structure
                const validatedUser = {
                  ...newUser, // Keep our clean local user as base
                  id: result.user.id,
                  username: result.user.username || newUser.username,
                  authProvider: result.user.authProvider || newUser.authProvider,
                  createdAt: result.user.createdAt ? new Date(result.user.createdAt) : newUser.createdAt,
                  updatedAt: result.user.updatedAt ? new Date(result.user.updatedAt) : newUser.updatedAt,
                  // Explicitly prevent admin data contamination
                  email: result.user.email === 'orbitandchill@gmail.com' ? undefined : result.user.email,
                  profilePictureUrl: result.user.profilePictureUrl || newUser.profilePictureUrl,
                };
                
                // Additional validation - if username is admin, reset it
                if (validatedUser.username === 'Orbit Chill') {
                  validatedUser.username = customName || 'Anonymous';
                }
                
                set({ user: validatedUser });
              }
            }
          } catch (error) {
            console.error("Error saving new anonymous user to Turso:", error);
          }
        }
      },

      clearProfile: async () => {
        set({ user: null });
        
        // Clear all localStorage cached data
        try {
          localStorage.removeItem('luckstrology-anonymous-id');
          localStorage.removeItem('luckstrology-user');
          localStorage.removeItem('userStore');
          
          // Clear any other cached user data
          const keysToRemove = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.startsWith('luckstrology-') || key.includes('user'))) {
              keysToRemove.push(key);
            }
          }
          keysToRemove.forEach(key => localStorage.removeItem(key));
        } catch (error) {
          console.warn('Error clearing localStorage:', error);
        }
        
        // Clear IndexedDB cached data
        try {
          const { db } = await import('../store/database');
          await db.cache.clear();
        } catch (error) {
          console.warn('Error clearing IndexedDB cache:', error);
        }
        
        // Note: For now, we keep the user in Turso database for data persistence
        // In the future, we could add a DELETE endpoint if needed
      },

      generateAnonymousId,
      
      // Lock mechanism to prevent race conditions
      setAuthenticating: (value: boolean) => {
        set({ isAuthenticating: value });
      },
      
      // Force set user (bypasses any checks - used for Google auth)
      forceSetUser: (user: User) => {
        console.log('🔐 Force setting user:', user.authProvider, user.username);
        set({ user, isAuthenticating: false });
        
        // Manually trigger persistence with the full user object
        const storage = window.localStorage;
        // Use the same partialize function to ensure consistency
        const persistedUser = {
          id: user.id,
          username: user.username,
          email: user.email,
          profilePictureUrl: user.profilePictureUrl,
          preferredAvatar: user.preferredAvatar,
          authProvider: user.authProvider, // CRITICAL: Must persist authProvider
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          birthData: user.birthData,
          hasNatalChart: user.hasNatalChart,
          subscriptionTier: user.subscriptionTier,
          privacy: user.privacy,
        };
        
        const stateToStore = {
          state: { user: persistedUser },
          version: 0
        };
        
        console.log('🔐 Persisting to localStorage:', { 
          authProvider: persistedUser.authProvider,
          username: persistedUser.username 
        });
        
        storage.setItem('luckstrology-user-storage', JSON.stringify(stateToStore));
      },
    }),
    {
      name: "luckstrology-user-storage",
      // Only persist essential data to localStorage as fallback
      partialize: (state) => ({
        user: state.user
          ? {
              id: state.user.id,
              username: state.user.username,
              email: state.user.email,
              profilePictureUrl: state.user.profilePictureUrl,
              preferredAvatar: state.user.preferredAvatar, // Include preferred avatar in persistence
              authProvider: state.user.authProvider,
              createdAt: state.user.createdAt,
              updatedAt: state.user.updatedAt,
              birthData: state.user.birthData,
              hasNatalChart: state.user.hasNatalChart,
              subscriptionTier: state.user.subscriptionTier,
              privacy: state.user.privacy,
            }
          : null,
      }),
      // Allow hydration but don't rehydrate automatically
      skipHydration: false,
    }
  )
);
