/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Chart generation utilities for event charts
 */

export interface ChartGenerationParams {
  eventTitle: string;
  eventDate: string;
  selectedTime: string;
  userBirthData: {
    locationOfBirth: string;
    coordinates: { lat: string; lon: string };
  };
}

export interface ChartData {
  svg: string;
  metadata?: {
    chartData?: any;
  };
}

/**
 * Build chart parameters for event chart generation
 * 
 * @param params - Chart generation parameters
 * @returns Chart parameters object
 */
export function buildChartParameters(params: ChartGenerationParams) {
  const { eventTitle, eventDate, selectedTime, userBirthData } = params;
  
  return {
    name: `${eventTitle} - ${eventDate}`,
    dateOfBirth: eventDate,
    timeOfBirth: selectedTime,
    locationOfBirth: userBirthData.locationOfBirth,
    coordinates: userBirthData.coordinates,
  };
}

/**
 * Create chart share data for social sharing
 * 
 * @param eventTitle - Title of the event
 * @param eventDate - Date of the event
 * @returns Share data object
 */
export function createChartShareData(eventTitle: string, eventDate: string) {
  const formattedDate = new Date(eventDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return {
    title: `Event Chart: ${eventTitle}`,
    text: `Astrological chart for ${eventTitle} on ${formattedDate}`,
    url: window.location.href,
  };
}

/**
 * Generate birth data object for chart display
 * 
 * @param eventDate - Event date
 * @param selectedTime - Selected time
 * @param userBirthData - User birth data
 * @returns Birth data object
 */
export function generateBirthDataForChart(
  eventDate: string,
  selectedTime: string,
  userBirthData?: {
    locationOfBirth?: string;
    coordinates?: { lat: string; lon: string };
  }
) {
  return {
    dateOfBirth: eventDate,
    timeOfBirth: selectedTime,
    locationOfBirth: userBirthData?.locationOfBirth || '',
    coordinates: userBirthData?.coordinates || { lat: '', lon: '' }
  };
}