/* eslint-disable @typescript-eslint/no-unused-vars */
import { 
  HoraryQuestion, 
  DatabaseHoraryQuestion,
  CreateHoraryQuestionRequest,
  CustomLocation
} from '@/types/horaryQuestions';

export class HoraryQuestionsTransform {
  /**
   * Convert database row to application format
   */
  static dbRowToQuestion(row: DatabaseHoraryQuestion): HoraryQuestion {
    return {
      id: row.id,
      question: row.question,
      userId: row.user_id || null,
      date: new Date(row.date),
      location: row.location,
      latitude: row.latitude,
      longitude: row.longitude,
      timezone: row.timezone,
      category: row.category || null,
      tags: this.parseTags(row.tags),
      answer: row.answer || null,
      timing: row.timing || null,
      interpretation: row.interpretation || null,
      chartData: this.parseChartData(row.chart_data),
      chartSvg: row.chart_svg || null,
      ascendantDegree: row.ascendant_degree || null,
      moonSign: row.moon_sign || null,
      moonVoidOfCourse: this.convertToBoolean(row.moon_void_of_course),
      planetaryHour: row.planetary_hour || null,
      isRadical: this.convertToBoolean(row.is_radical),
      chartWarnings: this.parseChartWarnings(row.chart_warnings),
      isShared: this.convertToBoolean(row.is_shared),
      shareToken: row.share_token || null,
      aspectCount: row.aspect_count || null,
      retrogradeCount: row.retrograde_count || null,
      significatorPlanet: row.significator_planet || null,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  /**
   * Convert multiple database rows to application format
   */
  static dbRowsToQuestions(rows: DatabaseHoraryQuestion[]): HoraryQuestion[] {
    return rows.map(row => this.dbRowToQuestion(row));
  }

  /**
   * Process create request with custom location handling
   */
  static processCreateRequest(request: CreateHoraryQuestionRequest): CreateHoraryQuestionRequest {
    const processed = { ...request };

    // Handle custom location
    if (request.customLocation) {
      processed.location = request.customLocation.name || processed.location;
      processed.latitude = request.customLocation.coordinates?.lat 
        ? parseFloat(request.customLocation.coordinates.lat) 
        : processed.latitude;
      processed.longitude = request.customLocation.coordinates?.lon 
        ? parseFloat(request.customLocation.coordinates.lon) 
        : processed.longitude;
    }

    // Ensure required defaults
    processed.location = processed.location || '';
    processed.latitude = processed.latitude || 0;
    processed.longitude = processed.longitude || 0;
    processed.timezone = processed.timezone || 'UTC';

    return processed;
  }

  /**
   * Sort questions by creation date (most recent first)
   */
  static sortQuestionsByDate(questions: HoraryQuestion[]): HoraryQuestion[] {
    return questions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Filter questions by category
   */
  static filterByCategory(questions: HoraryQuestion[], category: string): HoraryQuestion[] {
    return questions.filter(question => question.category === category);
  }

  /**
   * Filter questions by user
   */
  static filterByUser(
    questions: HoraryQuestion[], 
    userId: string, 
    includeAnonymous: boolean = false
  ): HoraryQuestion[] {
    if (includeAnonymous) {
      return questions.filter(question => 
        question.userId === userId || question.userId === null
      );
    }
    
    return questions.filter(question => question.userId === userId);
  }

  /**
   * Filter only anonymous questions
   */
  static filterAnonymous(questions: HoraryQuestion[]): HoraryQuestion[] {
    return questions.filter(question => question.userId === null);
  }

  /**
   * Calculate pagination info
   */
  static calculatePagination(
    questions: HoraryQuestion[], 
    limit: number, 
    offset: number
  ): {
    items: HoraryQuestion[];
    hasMore: boolean;
    total: number;
    pagination: {
      limit: number;
      offset: number;
      hasMore: boolean;
    };
  } {
    const hasMore = questions.length > limit;
    const items = hasMore ? questions.slice(0, limit) : questions;
    
    return {
      items,
      hasMore,
      total: items.length,
      pagination: {
        limit,
        offset,
        hasMore
      }
    };
  }

  /**
   * Sanitize question data for response
   */
  static sanitizeForResponse(question: HoraryQuestion): HoraryQuestion {
    return {
      ...question,
      question: question.question.trim(),
      location: question.location.trim(),
      tags: question.tags.map(tag => tag.trim()).filter(tag => tag.length > 0),
      answer: question.answer ? question.answer.trim() : null,
      timing: question.timing ? question.timing.trim() : null,
      interpretation: question.interpretation ? question.interpretation.trim() : null,
    };
  }

  /**
   * Extract question summary for deletion confirmation
   */
  static extractQuestionSummary(question: HoraryQuestion): {
    id: string;
    question: string;
  } {
    const maxLength = 50;
    const questionText = question.question.length > maxLength 
      ? question.question.substring(0, maxLength) + '...'
      : question.question;

    return {
      id: question.id,
      question: questionText
    };
  }

  /**
   * Check if question has complete chart analysis
   */
  static hasCompleteAnalysis(question: HoraryQuestion): boolean {
    return !!(
      question.answer && 
      question.interpretation && 
      question.chartData && 
      question.isRadical !== null
    );
  }

  /**
   * Get question status
   */
  static getQuestionStatus(question: HoraryQuestion): 'pending' | 'analyzing' | 'complete' {
    if (this.hasCompleteAnalysis(question)) {
      return 'complete';
    }
    
    if (question.chartData || question.chartSvg) {
      return 'analyzing';
    }
    
    return 'pending';
  }

  /**
   * Private helper methods
   */
  private static parseTags(tags: string | null | undefined): string[] {
    if (!tags) return [];
    
    try {
      if (typeof tags === 'string') {
        return JSON.parse(tags);
      }
      return Array.isArray(tags) ? tags : [];
    } catch (error) {
      console.warn('Failed to parse tags:', error);
      return [];
    }
  }

  private static parseChartData(chartData: string | any | null | undefined): any | null {
    if (!chartData) return null;
    
    try {
      if (typeof chartData === 'string') {
        return JSON.parse(chartData);
      }
      return chartData;
    } catch (error) {
      console.warn('Failed to parse chart data:', error);
      return null;
    }
  }

  private static parseChartWarnings(warnings: string | any[] | null | undefined): any[] {
    if (!warnings) return [];
    
    try {
      if (typeof warnings === 'string') {
        return JSON.parse(warnings);
      }
      return Array.isArray(warnings) ? warnings : [];
    } catch (error) {
      console.warn('Failed to parse chart warnings:', error);
      return [];
    }
  }

  private static convertToBoolean(value: boolean | number | null | undefined): boolean | null {
    if (value === null || value === undefined) return null;
    
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value === 1;
    
    return null;
  }

  /**
   * Validate coordinates are within valid ranges
   */
  static validateCoordinates(latitude: number, longitude: number): boolean {
    return latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
  }

  /**
   * Format location string for display
   */
  static formatLocationDisplay(question: HoraryQuestion): string {
    if (!question.location) {
      return `${question.latitude.toFixed(4)}, ${question.longitude.toFixed(4)}`;
    }
    
    return question.location;
  }

  /**
   * Generate share URL for question (if shareable)
   */
  static generateShareUrl(question: HoraryQuestion, baseUrl: string): string | null {
    if (!question.isShared || !question.shareToken) {
      return null;
    }
    
    return `${baseUrl}/horary/shared/${question.shareToken}`;
  }
}