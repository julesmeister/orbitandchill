/* eslint-disable @typescript-eslint/no-unused-vars */

import { BirthData } from './user';

/**
 * Form data structure extending BirthData with optional name field
 * Used for natal chart form components
 */
export interface NatalChartFormData extends BirthData {
  name: string; // Optional name field for the form
}

/**
 * Options for natal chart form components
 */
export interface NatalChartFormOptions {
  mode?: 'user' | 'person';
  editingPerson?: any | null; // Person type from people.ts
  onPersonSaved?: (person: any) => void;
  onSubmit?: (formData: NatalChartFormData) => void;
  submitText?: string;
}

/**
 * Common form validation interface
 */
export interface FormValidation {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Location search form data
 */
export interface LocationFormData {
  locationQuery: string;
  selectedLocation: {
    display_name: string;
    lat: string;
    lon: string;
  } | null;
}

/**
 * Date/Time form data
 */
export interface DateTimeFormData {
  dateOfBirth: string;
  timeOfBirth: string;
}