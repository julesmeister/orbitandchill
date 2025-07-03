// DEPRECATED: This file has been refactored into modular slices
// Please use the new modular admin store from @/store/admin
// This file is kept for backwards compatibility

export { useAdminStore } from './admin';
export type { AdminState, Thread, AdminUser, SiteMetrics, UserAnalytics, TrafficData, HealthMetrics, NotificationSummary, AdminSetting } from './admin';