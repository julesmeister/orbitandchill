/* eslint-disable @typescript-eslint/no-explicit-any */

import type { AdminUser } from './types';
import { authApi } from './api';

/**
 * Authentication slice for admin store
 */
export const createAuthSlice = (set: any, get: any) => ({
  // Authentication state
  isAuthenticated: false,
  adminUser: null as AdminUser | null,
  authToken: null as string | null,
  authLoading: false,

  // Authentication actions
  initializeAuth: () => {
    if (typeof window !== 'undefined') {
      // Prevent duplicate initialization
      const state = get();
      if (state.isAuthenticated || state.authLoading) {
        return;
      }

      // First check if current user is master admin
      setTimeout(async () => {
        const currentState = get();
        if (currentState.isAuthenticated || currentState.authLoading) {
          return; // Already authenticated or in progress
        }

        const isAdmin = await get().checkCurrentUserAdmin();
        if (!isAdmin) {
          // If not master admin, check for stored admin token
          const token = localStorage.getItem('admin_token');
          if (token) {
            set({ authToken: token });
            // Verify token
            get().verifyAuth();
          }
        }
      }, 0);
    }
  },

  login: async (email: string, adminKey: string): Promise<boolean> => {
    set({ authLoading: true });

    try {
      const data = await authApi.login(email, adminKey);

      if (data.success && data.token && data.user) {
        // Store token in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('admin_token', data.token);
        }

        set({
          isAuthenticated: true,
          adminUser: data.user,
          authToken: data.token,
          authLoading: false,
        });

        return true;
      } else {
        set({ authLoading: false });
        return false;
      }
    } catch (error) {
      set({ authLoading: false });
      return false;
    }
  },

  logout: async (): Promise<void> => {
    const { authToken } = get();
    
    if (authToken) {
      try {
        await authApi.logout(authToken);
      } catch (error) {
        // Silently handle logout errors
      }
    }

    // Clear local state
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
    }

    set({
      isAuthenticated: false,
      adminUser: null,
      authToken: null,
    });

    // Redirect to home page
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  },

  verifyAuth: async (): Promise<boolean> => {
    const { authToken } = get();
    
    if (!authToken) {
      set({ isAuthenticated: false, adminUser: null });
      return false;
    }

    try {
      const data = await authApi.verify(authToken);

      if (data.success && data.user) {
        set({
          isAuthenticated: true,
          adminUser: data.user,
        });
        return true;
      } else {
        // Token invalid, clear auth
        if (typeof window !== 'undefined') {
          localStorage.removeItem('admin_token');
        }
        set({
          isAuthenticated: false,
          adminUser: null,
          authToken: null,
        });
        return false;
      }
    } catch (error) {
      set({
        isAuthenticated: false,
        adminUser: null,
        authToken: null,
      });
      return false;
    }
  },

  checkCurrentUserAdmin: async (): Promise<boolean> => {
    // Check if already authenticated to prevent duplicate calls
    const currentState = get();
    if (currentState.isAuthenticated) {
      return true;
    }

    // Import here to avoid circular dependency
    const { useUserStore } = await import('@/store/userStore');
    const currentUser = useUserStore.getState().user;
    
    if (!currentUser || !currentUser.email) {
      return false;
    }

    // Master admin account - orbitandchill@gmail.com
    const MASTER_ADMIN_EMAIL = 'orbitandchill@gmail.com';
    
    // Check if current user is the master admin
    if (currentUser.email === MASTER_ADMIN_EMAIL) {
      try {
        // Set loading state to prevent duplicate calls
        set({ authLoading: true });

        const data = await authApi.masterLogin(currentUser.id, currentUser.email);

        if (data.success && data.token) {
          const adminUser: AdminUser = {
            id: currentUser.id,
            username: currentUser.username || 'Master Admin',
            email: currentUser.email,
            role: 'master_admin',
            permissions: ['all'] // Master admin has all permissions
          };

          set({
            isAuthenticated: true,
            adminUser: adminUser,
            authToken: data.token,
            authLoading: false,
          });

          return true;
        } else {
          set({ authLoading: false });
          return false;
        }
      } catch (error) {
        set({ authLoading: false });
        return false;
      }
    }

    // Fallback: Check if current user has admin role (for future admin users)
    if (currentUser.role === 'admin' || currentUser.role === 'moderator') {
      // Auto-login other admins using their existing Google session
      const success = await get().login(currentUser.email, process.env.NEXT_PUBLIC_ADMIN_ACCESS_KEY || 'admin-development-key-123');
      return success;
    }
    
    return false;
  },
});