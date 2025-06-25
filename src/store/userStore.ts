import { create } from "zustand";
import { persist } from "zustand/middleware";
import { db } from "@/store/database";
import { User, BirthData, UserPrivacySettings } from "@/types/user";

interface UserState {
  // State
  user: User | null;
  isLoading: boolean;

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
}

const generateAnonymousId = (): string => {
  return (
    "anon_" + Math.random().toString(36).substring(2, 11) + Date.now().toString(36)
  );
};

const createInitialUser = (): User => {
  const now = new Date();
  return {
    id: generateAnonymousId(),
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

        const updatedUser: User = currentUser
          ? {
              ...currentUser,
              ...data,
              updatedAt: new Date(),
            }
          : {
              ...createInitialUser(),
              ...data,
            };

        set({ user: updatedUser });

        // Convert to storage format and save
        try {
          const profileForStorage = db.userToUserProfile(updatedUser);
          await db.saveUserProfile(profileForStorage);

          // Also cache the profile with a TTL for quick access
          await db.setCache(
            `user_profile_${updatedUser.id}`,
            profileForStorage,
            1440
          ); // 24 hours
        } catch (error) {
          console.error("Error saving user to database:", error);
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

        await get().updateUser({
          birthData: updatedBirthData,
          hasNatalChart: !!(updatedBirthData.dateOfBirth && updatedBirthData.timeOfBirth && updatedBirthData.locationOfBirth)
        });
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
          // First try to get from IndexedDB
          const profile = await db.getCurrentUserProfile();

          if (profile) {
            // Convert storage format to User type
            const user = db.userProfileToUser(profile);
            set({ user });

            // Update cache
            await db.setCache(`user_profile_${profile.id}`, profile, 1440);
          } else {
            // Try to rehydrate from localStorage
            await useUserStore.persist.rehydrate();
            
            // Check if rehydration loaded a user
            const rehydratedUser = get().user;
            
            if (rehydratedUser) {
              // Save the rehydrated user to IndexedDB to ensure persistence
              const profileForStorage = db.userToUserProfile(rehydratedUser);
              await db.saveUserProfile(profileForStorage);
              await db.setCache(`user_profile_${rehydratedUser.id}`, profileForStorage, 1440);
            }
            // Note: Removed automatic user creation here - let components handle it explicitly
          }
        } catch (error) {
          console.error("Error loading user profile from database:", error);
          // Try localStorage fallback
          await useUserStore.persist.rehydrate();
        } finally {
          set({ isLoading: false });
        }
      },

      ensureAnonymousUser: async (customName?: string) => {
        const currentUser = get().user;
        if (!currentUser) {
          const initialUser = createInitialUser();
          const newUser = {
            ...initialUser,
            username: customName || initialUser.username // Use the generated username if no custom name
          };
          set({ user: newUser });
          
          // Save the new user to database
          try {
            const profileForStorage = db.userToUserProfile(newUser);
            await db.saveUserProfile(profileForStorage);
            await db.setCache(`user_profile_${newUser.id}`, profileForStorage, 1440);
          } catch (error) {
            console.error("Error saving new anonymous user:", error);
          }
        }
      },

      clearProfile: async () => {
        const currentUser = get().user;

        set({ user: null });

        if (currentUser) {
          try {
            // Remove from IndexedDB
            await db.userProfiles.delete(currentUser.id);

            // Clear from cache
            await db.cache.delete(`user_profile_${currentUser.id}`);
          } catch (error) {
            console.error("Error clearing user profile from database:", error);
          }
        }
      },

      generateAnonymousId,
    }),
    {
      name: "luckstrology-user-storage",
      // Only persist essential data to localStorage as fallback
      partialize: (state) => ({
        user: state.user
          ? {
              id: state.user.id,
              username: state.user.username,
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
