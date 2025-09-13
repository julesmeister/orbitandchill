// Re-export all types for easy importing
export * from "./user";
export * from "./threads";
export * from "./charts";

// Common utility types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface SearchFilters {
  query?: string;
  category?: string;
  tags?: string[];
  sortBy?: "recent" | "popular" | "replies" | "views";
  dateRange?: {
    from: Date;
    to: Date;
  };
}

export interface Location {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  importance: number;
}

export interface LocationOption {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
}

// Form validation utility types
export type FormField<T> = keyof T;
export type FormErrors<T> = Partial<Record<keyof T, string>>;
export type FormTouched<T> = Partial<Record<keyof T, boolean>>;
