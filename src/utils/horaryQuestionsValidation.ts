/* eslint-disable @typescript-eslint/no-unused-vars */
import { 
  CreateHoraryQuestionRequest, 
  UpdateHoraryQuestionRequest,
  GetHoraryQuestionsQuery,
  DeleteHoraryQuestionRequest,
  HoraryCategory,
  CustomLocation
} from '@/types/horaryQuestions';

export class HoraryQuestionsValidation {
  private static readonly VALID_CATEGORIES: HoraryCategory[] = [
    'love', 'career', 'health', 'money', 'travel', 
    'family', 'legal', 'education', 'spiritual', 'general'
  ];

  private static readonly MAX_QUESTION_LENGTH = 1000;
  private static readonly MAX_LOCATION_LENGTH = 200;
  private static readonly MAX_TIMEZONE_LENGTH = 50;
  private static readonly MAX_TAGS_COUNT = 10;
  private static readonly MAX_TAG_LENGTH = 50;

  /**
   * Validate create horary question request
   */
  static validateCreateRequest(body: any): { 
    valid: boolean; 
    request?: CreateHoraryQuestionRequest; 
    error?: string 
  } {
    if (!body) {
      return { valid: false, error: 'Request body is required' };
    }

    // Validate required fields
    if (!body.question || typeof body.question !== 'string') {
      return { valid: false, error: 'Question is required and must be a string' };
    }

    if (!body.date) {
      return { valid: false, error: 'Date is required' };
    }

    // Validate question length
    const question = body.question.trim();
    if (question.length === 0) {
      return { valid: false, error: 'Question cannot be empty' };
    }

    if (question.length > this.MAX_QUESTION_LENGTH) {
      return { 
        valid: false, 
        error: `Question must be ${this.MAX_QUESTION_LENGTH} characters or less` 
      };
    }

    // Validate date
    const dateValidation = this.validateDate(body.date);
    if (!dateValidation.valid) {
      return dateValidation;
    }

    // Validate optional fields
    if (body.userId && typeof body.userId !== 'string') {
      return { valid: false, error: 'userId must be a string' };
    }

    if (body.location && typeof body.location !== 'string') {
      return { valid: false, error: 'location must be a string' };
    }

    if (body.location && body.location.length > this.MAX_LOCATION_LENGTH) {
      return { 
        valid: false, 
        error: `Location must be ${this.MAX_LOCATION_LENGTH} characters or less` 
      };
    }

    // Validate coordinates
    if (body.latitude !== undefined) {
      const latValidation = this.validateLatitude(body.latitude);
      if (!latValidation.valid) return latValidation;
    }

    if (body.longitude !== undefined) {
      const lonValidation = this.validateLongitude(body.longitude);
      if (!lonValidation.valid) return lonValidation;
    }

    // Validate timezone
    if (body.timezone && typeof body.timezone !== 'string') {
      return { valid: false, error: 'timezone must be a string' };
    }

    if (body.timezone && body.timezone.length > this.MAX_TIMEZONE_LENGTH) {
      return { 
        valid: false, 
        error: `Timezone must be ${this.MAX_TIMEZONE_LENGTH} characters or less` 
      };
    }

    // Validate category
    if (body.category) {
      const categoryValidation = this.validateCategory(body.category);
      if (!categoryValidation.valid) return categoryValidation;
    }

    // Validate tags
    if (body.tags) {
      const tagsValidation = this.validateTags(body.tags);
      if (!tagsValidation.valid) return tagsValidation;
    }

    // Validate custom location
    if (body.customLocation) {
      const customLocationValidation = this.validateCustomLocation(body.customLocation);
      if (!customLocationValidation.valid) return customLocationValidation;
    }

    return {
      valid: true,
      request: {
        question: question,
        date: body.date,
        userId: body.userId || undefined,
        location: body.location || undefined,
        latitude: body.latitude || undefined,
        longitude: body.longitude || undefined,
        timezone: body.timezone || undefined,
        category: body.category || undefined,
        tags: body.tags || undefined,
        customLocation: body.customLocation || undefined
      }
    };
  }

  /**
   * Validate update horary question request
   */
  static validateUpdateRequest(body: any): { 
    valid: boolean; 
    request?: UpdateHoraryQuestionRequest; 
    error?: string 
  } {
    if (!body) {
      return { valid: false, error: 'Request body is required' };
    }

    const request: UpdateHoraryQuestionRequest = {};

    // Validate optional string fields
    if (body.answer !== undefined) {
      if (typeof body.answer !== 'string') {
        return { valid: false, error: 'answer must be a string' };
      }
      request.answer = body.answer;
    }

    if (body.timing !== undefined) {
      if (typeof body.timing !== 'string') {
        return { valid: false, error: 'timing must be a string' };
      }
      request.timing = body.timing;
    }

    if (body.interpretation !== undefined) {
      if (typeof body.interpretation !== 'string') {
        return { valid: false, error: 'interpretation must be a string' };
      }
      request.interpretation = body.interpretation;
    }

    if (body.chartSvg !== undefined) {
      if (typeof body.chartSvg !== 'string') {
        return { valid: false, error: 'chartSvg must be a string' };
      }
      request.chartSvg = body.chartSvg;
    }

    if (body.moonSign !== undefined) {
      if (typeof body.moonSign !== 'string') {
        return { valid: false, error: 'moonSign must be a string' };
      }
      request.moonSign = body.moonSign;
    }

    if (body.planetaryHour !== undefined) {
      if (typeof body.planetaryHour !== 'string') {
        return { valid: false, error: 'planetaryHour must be a string' };
      }
      request.planetaryHour = body.planetaryHour;
    }

    if (body.significatorPlanet !== undefined) {
      if (typeof body.significatorPlanet !== 'string') {
        return { valid: false, error: 'significatorPlanet must be a string' };
      }
      request.significatorPlanet = body.significatorPlanet;
    }

    if (body.shareToken !== undefined) {
      if (typeof body.shareToken !== 'string') {
        return { valid: false, error: 'shareToken must be a string' };
      }
      request.shareToken = body.shareToken;
    }

    // Validate number fields
    if (body.ascendantDegree !== undefined) {
      if (typeof body.ascendantDegree !== 'number' || body.ascendantDegree < 0 || body.ascendantDegree >= 360) {
        return { valid: false, error: 'ascendantDegree must be a number between 0 and 360' };
      }
      request.ascendantDegree = body.ascendantDegree;
    }

    if (body.aspectCount !== undefined) {
      if (typeof body.aspectCount !== 'number' || body.aspectCount < 0) {
        return { valid: false, error: 'aspectCount must be a non-negative number' };
      }
      request.aspectCount = body.aspectCount;
    }

    if (body.retrogradeCount !== undefined) {
      if (typeof body.retrogradeCount !== 'number' || body.retrogradeCount < 0) {
        return { valid: false, error: 'retrogradeCount must be a non-negative number' };
      }
      request.retrogradeCount = body.retrogradeCount;
    }

    // Validate boolean fields
    if (body.moonVoidOfCourse !== undefined) {
      if (typeof body.moonVoidOfCourse !== 'boolean') {
        return { valid: false, error: 'moonVoidOfCourse must be a boolean' };
      }
      request.moonVoidOfCourse = body.moonVoidOfCourse;
    }

    if (body.isRadical !== undefined) {
      if (typeof body.isRadical !== 'boolean') {
        return { valid: false, error: 'isRadical must be a boolean' };
      }
      request.isRadical = body.isRadical;
    }

    if (body.isShared !== undefined) {
      if (typeof body.isShared !== 'boolean') {
        return { valid: false, error: 'isShared must be a boolean' };
      }
      request.isShared = body.isShared;
    }

    // Validate complex fields
    if (body.chartData !== undefined) {
      // Allow any valid JSON object/array for chart data
      request.chartData = body.chartData;
    }

    if (body.chartWarnings !== undefined) {
      if (!Array.isArray(body.chartWarnings)) {
        return { valid: false, error: 'chartWarnings must be an array' };
      }
      request.chartWarnings = body.chartWarnings;
    }

    if (body.category !== undefined) {
      const categoryValidation = this.validateCategory(body.category);
      if (!categoryValidation.valid) return categoryValidation;
      request.category = body.category;
    }

    if (body.tags !== undefined) {
      const tagsValidation = this.validateTags(body.tags);
      if (!tagsValidation.valid) return tagsValidation;
      request.tags = body.tags;
    }

    return { valid: true, request };
  }

  /**
   * Validate get questions query parameters
   */
  static validateGetQuestionsQuery(searchParams: URLSearchParams): { 
    valid: boolean; 
    query?: GetHoraryQuestionsQuery; 
    error?: string 
  } {
    const query: GetHoraryQuestionsQuery = {};

    // Validate userId
    const userId = searchParams.get('userId');
    if (userId) {
      query.userId = userId;
    }

    // Validate limit
    const limitStr = searchParams.get('limit');
    if (limitStr) {
      const limit = parseInt(limitStr, 10);
      if (isNaN(limit) || limit < 1 || limit > 1000) {
        return { valid: false, error: 'limit must be a number between 1 and 1000' };
      }
      query.limit = limit;
    }

    // Validate offset
    const offsetStr = searchParams.get('offset');
    if (offsetStr) {
      const offset = parseInt(offsetStr, 10);
      if (isNaN(offset) || offset < 0) {
        return { valid: false, error: 'offset must be a non-negative number' };
      }
      query.offset = offset;
    }

    // Validate category
    const category = searchParams.get('category');
    if (category) {
      const categoryValidation = this.validateCategory(category);
      if (!categoryValidation.valid) return categoryValidation;
      query.category = category;
    }

    // Validate includeAnonymous
    const includeAnonymousStr = searchParams.get('includeAnonymous');
    if (includeAnonymousStr) {
      query.includeAnonymous = includeAnonymousStr === 'true';
    }

    return { valid: true, query };
  }

  /**
   * Validate delete request
   */
  static validateDeleteRequest(body: any): { 
    valid: boolean; 
    request?: DeleteHoraryQuestionRequest; 
    error?: string 
  } {
    const request: DeleteHoraryQuestionRequest = {};

    if (body && body.userId) {
      if (typeof body.userId !== 'string') {
        return { valid: false, error: 'userId must be a string' };
      }
      request.userId = body.userId;
    }

    return { valid: true, request };
  }

  /**
   * Private validation helpers
   */
  private static validateDate(date: any): { valid: boolean; error?: string } {
    if (typeof date !== 'string') {
      return { valid: false, error: 'date must be a string' };
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return { valid: false, error: 'date must be a valid ISO date string' };
    }

    return { valid: true };
  }

  private static validateLatitude(latitude: any): { valid: boolean; error?: string } {
    if (typeof latitude !== 'number') {
      return { valid: false, error: 'latitude must be a number' };
    }

    if (latitude < -90 || latitude > 90) {
      return { valid: false, error: 'latitude must be between -90 and 90' };
    }

    return { valid: true };
  }

  private static validateLongitude(longitude: any): { valid: boolean; error?: string } {
    if (typeof longitude !== 'number') {
      return { valid: false, error: 'longitude must be a number' };
    }

    if (longitude < -180 || longitude > 180) {
      return { valid: false, error: 'longitude must be between -180 and 180' };
    }

    return { valid: true };
  }

  private static validateCategory(category: any): { valid: boolean; error?: string } {
    if (typeof category !== 'string') {
      return { valid: false, error: 'category must be a string' };
    }

    if (!this.VALID_CATEGORIES.includes(category as HoraryCategory)) {
      return { 
        valid: false, 
        error: `category must be one of: ${this.VALID_CATEGORIES.join(', ')}` 
      };
    }

    return { valid: true };
  }

  private static validateTags(tags: any): { valid: boolean; error?: string } {
    if (!Array.isArray(tags)) {
      return { valid: false, error: 'tags must be an array' };
    }

    if (tags.length > this.MAX_TAGS_COUNT) {
      return { 
        valid: false, 
        error: `tags array cannot have more than ${this.MAX_TAGS_COUNT} items` 
      };
    }

    for (let i = 0; i < tags.length; i++) {
      const tag = tags[i];
      if (typeof tag !== 'string') {
        return { valid: false, error: `tag at index ${i} must be a string` };
      }

      if (tag.length > this.MAX_TAG_LENGTH) {
        return { 
          valid: false, 
          error: `tag at index ${i} must be ${this.MAX_TAG_LENGTH} characters or less` 
        };
      }
    }

    return { valid: true };
  }

  private static validateCustomLocation(customLocation: any): { valid: boolean; error?: string } {
    if (!customLocation || typeof customLocation !== 'object') {
      return { valid: false, error: 'customLocation must be an object' };
    }

    if (!customLocation.name || typeof customLocation.name !== 'string') {
      return { valid: false, error: 'customLocation.name is required and must be a string' };
    }

    if (!customLocation.coordinates || typeof customLocation.coordinates !== 'object') {
      return { valid: false, error: 'customLocation.coordinates is required and must be an object' };
    }

    const { coordinates } = customLocation;
    
    if (!coordinates.lat || typeof coordinates.lat !== 'string') {
      return { valid: false, error: 'customLocation.coordinates.lat is required and must be a string' };
    }

    if (!coordinates.lon || typeof coordinates.lon !== 'string') {
      return { valid: false, error: 'customLocation.coordinates.lon is required and must be a string' };
    }

    // Validate coordinate values
    const lat = parseFloat(coordinates.lat);
    const lon = parseFloat(coordinates.lon);

    if (isNaN(lat) || lat < -90 || lat > 90) {
      return { valid: false, error: 'customLocation.coordinates.lat must be a valid latitude' };
    }

    if (isNaN(lon) || lon < -180 || lon > 180) {
      return { valid: false, error: 'customLocation.coordinates.lon must be a valid longitude' };
    }

    return { valid: true };
  }
}