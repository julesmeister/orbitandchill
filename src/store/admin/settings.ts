/* eslint-disable @typescript-eslint/no-explicit-any */

import type { AdminSetting } from './types';
import { settingsApi } from './api';

/**
 * Settings slice for admin store
 */
export const createSettingsSlice = (set: any, get: any) => ({
  // Settings state
  adminSettings: [] as AdminSetting[],
  settingsCategories: [] as Array<{ category: string; count: number }>,

  // Settings actions
  loadAdminSettings: async (category?: string): Promise<void> => {
    set({ isLoading: true });

    try {
      const data = await settingsApi.getAll(category);

      if (data.success) {
        set({
          adminSettings: data.settings || [],
          settingsCategories: data.categories || [],
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ isLoading: false });
    }
  },

  updateAdminSettings: async (settings: Record<string, any>): Promise<void> => {
    set({ isLoading: true });

    try {
      const data = await settingsApi.update(settings);

      if (data.success) {
        set({
          adminSettings: data.settings || [],
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
        throw new Error(data.error || 'Failed to update settings');
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  resetAdminSettings: async (category?: string): Promise<void> => {
    set({ isLoading: true });

    try {
      const data = await settingsApi.reset(category);

      if (data.success) {
        set({
          adminSettings: data.settings || [],
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
        throw new Error(data.error || 'Failed to reset settings');
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  getAdminSetting: (key: string): AdminSetting | null => {
    const state = get();
    return state.adminSettings.find((setting: AdminSetting) => setting.key === key) || null;
  },
});