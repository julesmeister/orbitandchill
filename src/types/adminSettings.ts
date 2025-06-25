/* eslint-disable @typescript-eslint/no-unused-vars */

export interface AdminSetting {
  key: string;
  value: string;
  type: 'string' | 'number' | 'boolean' | 'json';
  category: string;
  description?: string;
  isRequired?: boolean;
  defaultValue?: any;
  updatedAt: Date;
  updatedBy?: string;
}

export interface Category {
  category: string;
  count: number;
}

export interface CategoryInfo {
  name: string;
  description: string;
  icon: string;
}

export interface NotificationData {
  type: 'success' | 'error';
  message: string;
}

export interface SettingsFilters {
  selectedCategory: string;
  searchQuery: string;
  showAdvanced: boolean;
}

export interface SettingsState {
  settings: AdminSetting[];
  categories: Category[];
  editedSettings: Record<string, any>;
  expandedCategories: Set<string>;
  isLoading: boolean;
  isSaving: boolean;
  isResetting: boolean;
  notification: NotificationData | null;
}

export interface SettingsActions {
  loadSettings: () => Promise<void>;
  saveSettings: () => Promise<void>;
  resetSettings: (category?: string) => Promise<void>;
  updateSetting: (key: string, value: any, type: string) => void;
  toggleCategory: (category: string) => void;
  showNotification: (type: 'success' | 'error', message: string) => void;
  getSettingValue: (setting: AdminSetting) => any;
}