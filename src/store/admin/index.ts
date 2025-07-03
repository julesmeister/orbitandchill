/* eslint-disable @typescript-eslint/no-explicit-any */

import { create } from "zustand";
import type { AdminState } from './types';
import { createAuthSlice } from './auth';
import { createAnalyticsSlice } from './analytics';
import { createThreadsSlice } from './threads';
import { createSettingsSlice } from './settings';

/**
 * Main admin store combining all slices
 * Refactored from monolithic adminStore.ts into modular slices
 */
export const useAdminStore = create<AdminState>((set, get) => ({
  // Global loading state
  isLoading: false,

  // Combine all slices
  ...createAuthSlice(set, get),
  ...createAnalyticsSlice(set, get),
  ...createThreadsSlice(set, get),
  ...createSettingsSlice(set, get),
}));

// Export types for external use
export type { AdminState, Thread, AdminUser, SiteMetrics, UserAnalytics, TrafficData, HealthMetrics, NotificationSummary, AdminSetting } from './types';

// Export API functions for potential external use
export { authApi, analyticsApi, threadsApi, settingsApi } from './api';