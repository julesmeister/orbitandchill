/* eslint-disable @typescript-eslint/no-unused-vars */

export interface HoraryQuestion {
  id: string;
  question: string;
  userId?: string | null;
  date: Date;
  location: string;
  latitude: number;
  longitude: number;
  timezone: string;
  category?: string | null;
  tags: string[];
  answer?: string | null;
  timing?: string | null;
  interpretation?: string | null;
  chartData?: any | null;
  chartSvg?: string | null;
  ascendantDegree?: number | null;
  moonSign?: string | null;
  moonVoidOfCourse?: boolean | null;
  planetaryHour?: string | null;
  isRadical?: boolean | null;
  chartWarnings: any[];
  isShared?: boolean | null;
  shareToken?: string | null;
  aspectCount?: number | null;
  retrogradeCount?: number | null;
  significatorPlanet?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DatabaseHoraryQuestion {
  id: string;
  question: string;
  user_id?: string | null;
  date: string | Date;
  location: string;
  latitude: number;
  longitude: number;
  timezone: string;
  category?: string | null;
  tags?: string | null;
  answer?: string | null;
  timing?: string | null;
  interpretation?: string | null;
  chart_data?: string | null;
  chart_svg?: string | null;
  ascendant_degree?: number | null;
  moon_sign?: string | null;
  moon_void_of_course?: boolean | number | null;
  planetary_hour?: string | null;
  is_radical?: boolean | number | null;
  chart_warnings?: string | null;
  is_shared?: boolean | number | null;
  share_token?: string | null;
  aspect_count?: number | null;
  retrograde_count?: number | null;
  significator_planet?: string | null;
  created_at: string | Date;
  updated_at: string | Date;
}

export interface CreateHoraryQuestionRequest {
  question: string;
  date: string;
  userId?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  category?: string;
  tags?: string[];
  customLocation?: {
    name: string;
    coordinates: {
      lat: string;
      lon: string;
    };
  };
}

export interface UpdateHoraryQuestionRequest {
  answer?: string;
  timing?: string;
  interpretation?: string;
  chartData?: any;
  chartSvg?: string;
  ascendantDegree?: number;
  moonSign?: string;
  moonVoidOfCourse?: boolean;
  planetaryHour?: string;
  isRadical?: boolean;
  chartWarnings?: any[];
  aspectCount?: number;
  retrogradeCount?: number;
  significatorPlanet?: string;
  category?: string;
  tags?: string[];
  isShared?: boolean;
  shareToken?: string;
}

export interface GetHoraryQuestionsQuery {
  userId?: string | null;
  limit?: number;
  offset?: number;
  category?: string | null;
  includeAnonymous?: boolean;
}

export interface HoraryQuestionsResponse {
  success: boolean;
  questions?: HoraryQuestion[];
  question?: HoraryQuestion;
  total?: number;
  hasMore?: boolean;
  pagination?: {
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  message?: string;
  error?: string;
  deletedQuestion?: {
    id: string;
    question: string;
  };
}

export interface CustomLocation {
  name: string;
  coordinates: {
    lat: string;
    lon: string;
  };
}

export type HoraryCategory = 
  | 'love'
  | 'career'
  | 'health'
  | 'money'
  | 'travel'
  | 'family'
  | 'legal'
  | 'education'
  | 'spiritual'
  | 'general';

export interface ChartWarning {
  type: 'moon_void' | 'late_degrees' | 'combustion' | 'retrograde';
  message: string;
  severity: 'low' | 'medium' | 'high';
}

export interface ChartData {
  planets: Record<string, any>;
  houses: Record<string, any>;
  aspects: any[];
  ephemeris?: any;
}

export interface DeleteHoraryQuestionRequest {
  userId?: string;
}