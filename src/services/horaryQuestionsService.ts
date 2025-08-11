/* eslint-disable @typescript-eslint/no-unused-vars */
import { HoraryQuestionsDatabase } from './horaryQuestionsDatabase';
import { HoraryQuestionsTransform } from '@/utils/horaryQuestionsTransform';
import { 
  HoraryQuestion,
  HoraryQuestionsResponse,
  CreateHoraryQuestionRequest,
  UpdateHoraryQuestionRequest,
  GetHoraryQuestionsQuery,
  DeleteHoraryQuestionRequest
} from '@/types/horaryQuestions';

export class HoraryQuestionsService {
  /**
   * Create a new horary question
   */
  static async createQuestion(request: CreateHoraryQuestionRequest): Promise<HoraryQuestionsResponse> {
    try {
      // Verify user exists if userId is provided
      if (request.userId) {
        await HoraryQuestionsDatabase.verifyUser(request.userId);
      }

      // Process the request (handle custom location, defaults, etc.)
      const processedRequest = HoraryQuestionsTransform.processCreateRequest(request);

      // Create the question in the database
      const dbQuestion = await HoraryQuestionsDatabase.createQuestion(processedRequest);
      
      if (!dbQuestion) {
        return {
          success: false,
          error: 'Failed to create horary question'
        };
      }

      // Transform to application format
      const question = HoraryQuestionsTransform.dbRowToQuestion(dbQuestion);
      const sanitizedQuestion = HoraryQuestionsTransform.sanitizeForResponse(question);

      return {
        success: true,
        question: sanitizedQuestion
      };
    } catch (error) {
      console.error('❌ Error creating horary question:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      };
    }
  }

  /**
   * Get horary questions with filtering and pagination
   */
  static async getQuestions(query: GetHoraryQuestionsQuery): Promise<HoraryQuestionsResponse> {
    try {
      // Set defaults
      const limit = query.limit || 50;
      const offset = query.offset || 0;

      // Handle case where no userId and not including anonymous
      if (!query.userId && !query.includeAnonymous) {
        return {
          success: true,
          questions: [],
          total: 0,
          hasMore: false,
          pagination: {
            limit,
            offset,
            hasMore: false
          }
        };
      }

      // Get questions from database
      const dbQuestions = await HoraryQuestionsDatabase.getQuestions({
        ...query,
        limit: limit + 1 // Get one extra to check if there are more
      });

      // Transform to application format
      const questions = HoraryQuestionsTransform.dbRowsToQuestions(dbQuestions);

      // Calculate pagination
      const paginationResult = HoraryQuestionsTransform.calculatePagination(questions, limit, offset);

      // Sanitize questions for response
      const sanitizedQuestions = paginationResult.items.map(q => 
        HoraryQuestionsTransform.sanitizeForResponse(q)
      );

      return {
        success: true,
        questions: sanitizedQuestions,
        total: paginationResult.total,
        hasMore: paginationResult.hasMore,
        pagination: paginationResult.pagination
      };
    } catch (error) {
      console.error('❌ Error fetching horary questions:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      };
    }
  }

  /**
   * Get single horary question by ID
   */
  static async getQuestionById(questionId: string): Promise<HoraryQuestionsResponse> {
    try {
      const dbQuestion = await HoraryQuestionsDatabase.getQuestionById(questionId);
      
      if (!dbQuestion) {
        return {
          success: false,
          error: 'Horary question not found'
        };
      }

      // Transform to application format
      const question = HoraryQuestionsTransform.dbRowToQuestion(dbQuestion);
      const sanitizedQuestion = HoraryQuestionsTransform.sanitizeForResponse(question);

      return {
        success: true,
        question: sanitizedQuestion
      };
    } catch (error) {
      console.error('❌ Error fetching horary question:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      };
    }
  }

  /**
   * Update horary question with analysis results
   */
  static async updateQuestion(
    questionId: string, 
    updates: UpdateHoraryQuestionRequest
  ): Promise<HoraryQuestionsResponse> {
    try {
      const dbQuestion = await HoraryQuestionsDatabase.updateQuestion(questionId, updates);
      
      if (!dbQuestion) {
        return {
          success: false,
          error: 'Horary question not found or update failed'
        };
      }

      console.log(`🔮 Updated horary question: ${questionId} - Answer: ${updates.answer || 'pending'}`);

      // Transform to application format
      const question = HoraryQuestionsTransform.dbRowToQuestion(dbQuestion);
      const sanitizedQuestion = HoraryQuestionsTransform.sanitizeForResponse(question);

      return {
        success: true,
        question: sanitizedQuestion
      };
    } catch (error) {
      console.error('❌ Error updating horary question:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      };
    }
  }

  /**
   * Delete horary question with ownership verification
   */
  static async deleteQuestion(
    questionId: string, 
    deleteRequest: DeleteHoraryQuestionRequest
  ): Promise<HoraryQuestionsResponse> {
    try {
      // First verify the question exists and get ownership info
      const questionForVerification = await HoraryQuestionsDatabase.getQuestionForVerification(questionId);
      
      if (!questionForVerification) {
        return {
          success: false,
          error: 'Horary question not found'
        };
      }

      console.log('🔍 Question found for deletion:', {
        requestedId: questionId,
        foundId: questionForVerification.id,
        questionOwner: questionForVerification.userId,
        requestingUser: deleteRequest.userId,
        questionText: questionForVerification.question.substring(0, 50) + '...'
      });

      // Check ownership if userId provided
      if (deleteRequest.userId && questionForVerification.userId !== deleteRequest.userId) {
        console.log('❌ Permission denied:', { 
          requestingUserId: deleteRequest.userId, 
          questionOwner: questionForVerification.userId 
        });
        
        return {
          success: false,
          error: 'Access denied - you can only delete your own questions'
        };
      }

      // Delete the question
      console.log('🗑️ Deleting question:', questionId);
      const deleteResult = await HoraryQuestionsDatabase.deleteQuestion(questionId);

      if (!deleteResult.success) {
        return {
          success: false,
          error: 'Failed to delete horary question'
        };
      }

      if (deleteResult.rowsAffected === 0) {
        return {
          success: false,
          error: 'Question not found or already deleted'
        };
      }

      console.log(`🗑️ Deleted horary question: ${questionId} - "${questionForVerification.question.substring(0, 50)}..."`);

      return {
        success: true,
        message: 'Horary question deleted successfully',
        deletedQuestion: {
          id: questionForVerification.id,
          question: questionForVerification.question
        }
      };
    } catch (error) {
      console.error('❌ Error deleting horary question:', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        questionId,
        userId: deleteRequest.userId
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      };
    }
  }

  /**
   * Get questions by category
   */
  static async getQuestionsByCategory(
    category: string, 
    query: Omit<GetHoraryQuestionsQuery, 'category'>
  ): Promise<HoraryQuestionsResponse> {
    return this.getQuestions({
      ...query,
      category
    });
  }

  /**
   * Get questions by user
   */
  static async getQuestionsByUser(
    userId: string, 
    query: Omit<GetHoraryQuestionsQuery, 'userId'>
  ): Promise<HoraryQuestionsResponse> {
    return this.getQuestions({
      ...query,
      userId
    });
  }

  /**
   * Get anonymous questions only
   */
  static async getAnonymousQuestions(
    query: Omit<GetHoraryQuestionsQuery, 'userId' | 'includeAnonymous'>
  ): Promise<HoraryQuestionsResponse> {
    return this.getQuestions({
      ...query,
      userId: undefined,
      includeAnonymous: true
    });
  }

  /**
   * Get question analysis status
   */
  static async getQuestionStatus(questionId: string): Promise<{
    success: boolean;
    status?: 'pending' | 'analyzing' | 'complete';
    error?: string;
  }> {
    try {
      const result = await this.getQuestionById(questionId);
      
      if (!result.success || !result.question) {
        return {
          success: false,
          error: result.error || 'Question not found'
        };
      }

      const status = HoraryQuestionsTransform.getQuestionStatus(result.question);
      
      return {
        success: true,
        status
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      };
    }
  }

  /**
   * Check if question has complete analysis
   */
  static async hasCompleteAnalysis(questionId: string): Promise<{
    success: boolean;
    hasComplete?: boolean;
    error?: string;
  }> {
    try {
      const result = await this.getQuestionById(questionId);
      
      if (!result.success || !result.question) {
        return {
          success: false,
          error: result.error || 'Question not found'
        };
      }

      const hasComplete = HoraryQuestionsTransform.hasCompleteAnalysis(result.question);
      
      return {
        success: true,
        hasComplete
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      };
    }
  }
}