/* eslint-disable @typescript-eslint/no-unused-vars */
import { 
  db, 
  getDbAsync, 
  executePooledQueryDirect, 
  isUsingConnectionPool 
} from '@/db';
import { horaryQuestions, users } from '@/db/schema';
import { eq, desc, and, or } from 'drizzle-orm';
import { withDatabaseResilience } from '@/db/resilience';
import crypto from 'crypto';
import { 
  DatabaseHoraryQuestion, 
  CreateHoraryQuestionRequest, 
  UpdateHoraryQuestionRequest,
  GetHoraryQuestionsQuery
} from '@/types/horaryQuestions';

export class HoraryQuestionsDatabase {
  /**
   * Generate unique ID for horary question
   */
  static generateQuestionId(): string {
    return `horary_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
  }

  /**
   * Check if user exists in database
   */
  static async verifyUser(userId: string): Promise<boolean> {
    try {
      const result = await withDatabaseResilience(
        db,
        async () => {
          const userResult = await db.select({ id: users.id })
            .from(users)
            .where(eq(users.id, userId))
            .limit(1);
          return userResult.length > 0;
        },
        {
          fallbackValue: true, // Allow creation if database check fails
          serviceName: 'HoraryDatabase',
          methodName: 'verifyUser'
        }
      );

      if (!result) {
        console.warn(`⚠️ User ${userId} not found in database, but allowing question creation`);
      } else {
        console.log(`✅ User ${userId} verified in database`);
      }

      return result;
    } catch (error) {
      console.warn(`⚠️ User verification failed for ${userId}:`, error);
      return true; // Continue with question creation even if verification fails
    }
  }

  /**
   * Create new horary question
   */
  static async createQuestion(request: CreateHoraryQuestionRequest): Promise<DatabaseHoraryQuestion | null> {
    try {
      const dbInstance = db || await getDbAsync();
      
      if (!dbInstance) {
        throw new Error('Database not available');
      }

      const questionId = this.generateQuestionId();
      const now = new Date();

      const [result] = await dbInstance.insert(horaryQuestions).values({
        id: questionId,
        userId: request.userId || null,
        question: request.question.trim(),
        date: new Date(request.date),
        location: request.location || '',
        latitude: request.latitude || 0,
        longitude: request.longitude || 0,
        timezone: request.timezone || 'UTC',
        category: request.category || null,
        tags: request.tags ? JSON.stringify(request.tags) : null,
        // Initial values - will be updated when chart analysis completes
        answer: null,
        timing: null,
        interpretation: null,
        chartData: null,
        chartSvg: null,
        isRadical: null,
        moonVoidOfCourse: null,
        createdAt: now,
        updatedAt: now,
      }).returning();

      return result as DatabaseHoraryQuestion;
    } catch (error) {
      console.error('Database error creating question:', error);
      return null;
    }
  }

  /**
   * Get horary questions with filtering and pagination
   */
  static async getQuestions(query: GetHoraryQuestionsQuery): Promise<DatabaseHoraryQuestion[]> {
    try {
      const dbInstance = db || await getDbAsync();

      // Build query conditions
      const conditions: any[] = [];
      
      if (query.userId) {
        if (query.includeAnonymous) {
          // Include both user's questions and anonymous questions
          conditions.push(or(
            eq(horaryQuestions.userId, query.userId),
            eq(horaryQuestions.userId, null)
          ));
        } else {
          // Only user's questions - STRICT FILTERING
          conditions.push(eq(horaryQuestions.userId, query.userId));
        }
      } else if (query.includeAnonymous) {
        // Only anonymous questions if no userId provided
        conditions.push(eq(horaryQuestions.userId, null));
      } else {
        // No questions if no userId and not including anonymous
        return [];
      }

      if (query.category) {
        conditions.push(eq(horaryQuestions.category, query.category));
      }

      // Execute query with resilience
      const questions = await withDatabaseResilience(
        dbInstance,
        async () => {
          const results = await dbInstance
            .select()
            .from(horaryQuestions)
            .where(conditions.length > 0 ? and(...conditions) : undefined)
            .orderBy(desc(horaryQuestions.createdAt))
            .limit((query.limit || 50) + 1) // Get one extra to check if there are more
            .offset(query.offset || 0);
          
          return results as DatabaseHoraryQuestion[];
        },
        {
          fallbackValue: [],
          serviceName: 'HoraryDatabase',
          methodName: 'getQuestions'
        }
      );

      return questions;
    } catch (error) {
      console.error('Database error getting questions:', error);
      return [];
    }
  }

  /**
   * Get single horary question by ID
   */
  static async getQuestionById(questionId: string): Promise<DatabaseHoraryQuestion | null> {
    try {
      // Try connection pool first if available
      if (isUsingConnectionPool()) {
        console.log('🔄 Using connection pool for GET query');
        try {
          const rawResult = await executePooledQueryDirect(
            'SELECT * FROM horary_questions WHERE id = ? LIMIT 1',
            [questionId]
          );
          
          if (rawResult.rows && rawResult.rows.length > 0) {
            return rawResult.rows[0] as DatabaseHoraryQuestion;
          }
        } catch (poolError) {
          console.warn('Pool query failed, falling back to Drizzle:', poolError);
        }
      }

      // Fallback to Drizzle ORM
      console.log('🔄 Using Drizzle ORM for GET query');
      const [result] = await db
        .select()
        .from(horaryQuestions)
        .where(eq(horaryQuestions.id, questionId))
        .limit(1);

      return result as DatabaseHoraryQuestion || null;
    } catch (error) {
      console.error('Database error getting question by ID:', error);
      return null;
    }
  }

  /**
   * Update horary question
   */
  static async updateQuestion(
    questionId: string, 
    updates: UpdateHoraryQuestionRequest
  ): Promise<DatabaseHoraryQuestion | null> {
    try {
      const dbInstance = db || await getDbAsync();
      
      if (!dbInstance) {
        throw new Error('Database not available for update');
      }

      // Build update object with only provided fields
      const updateData: any = {
        updatedAt: new Date()
      };

      // Map all possible update fields
      if (updates.answer !== undefined) updateData.answer = updates.answer;
      if (updates.timing !== undefined) updateData.timing = updates.timing;
      if (updates.interpretation !== undefined) updateData.interpretation = updates.interpretation;
      if (updates.chartData !== undefined) updateData.chartData = JSON.stringify(updates.chartData);
      if (updates.chartSvg !== undefined) updateData.chartSvg = updates.chartSvg;
      if (updates.ascendantDegree !== undefined) updateData.ascendantDegree = updates.ascendantDegree;
      if (updates.moonSign !== undefined) updateData.moonSign = updates.moonSign;
      if (updates.moonVoidOfCourse !== undefined) updateData.moonVoidOfCourse = updates.moonVoidOfCourse;
      if (updates.planetaryHour !== undefined) updateData.planetaryHour = updates.planetaryHour;
      if (updates.isRadical !== undefined) updateData.isRadical = updates.isRadical;
      if (updates.chartWarnings !== undefined) updateData.chartWarnings = JSON.stringify(updates.chartWarnings);
      if (updates.aspectCount !== undefined) updateData.aspectCount = updates.aspectCount;
      if (updates.retrogradeCount !== undefined) updateData.retrogradeCount = updates.retrogradeCount;
      if (updates.significatorPlanet !== undefined) updateData.significatorPlanet = updates.significatorPlanet;
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.tags !== undefined) updateData.tags = JSON.stringify(updates.tags);
      if (updates.isShared !== undefined) updateData.isShared = updates.isShared;
      if (updates.shareToken !== undefined) updateData.shareToken = updates.shareToken;

      console.log('🔍 Attempting to update horary question:', {
        questionId,
        updateFields: Object.keys(updateData),
        hasChartData: !!updateData.chartData,
        hasAnswer: !!updateData.answer
      });

      const [result] = await dbInstance
        .update(horaryQuestions)
        .set(updateData)
        .where(eq(horaryQuestions.id, questionId))
        .returning();

      console.log('✅ Database update successful:', { questionId, hasResult: !!result });
      
      return result as DatabaseHoraryQuestion || null;
    } catch (error) {
      console.error('❌ Database update error:', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        questionId,
        updateFields: Object.keys(updates)
      });
      return null;
    }
  }

  /**
   * Delete horary question
   */
  static async deleteQuestion(questionId: string): Promise<{ success: boolean; rowsAffected?: number }> {
    try {
      // Try connection pool first if available
      if (isUsingConnectionPool()) {
        console.log('🔄 Using connection pool for DELETE operation');
        try {
          const deleteResult = await executePooledQueryDirect(
            'DELETE FROM horary_questions WHERE id = ?',
            [questionId]
          );
          
          console.log('✅ Pool delete result:', deleteResult);
          return { 
            success: true, 
            rowsAffected: deleteResult.rowsAffected || 0 
          };
        } catch (poolError) {
          console.error('❌ Pool DELETE failed, falling back to Drizzle:', poolError);
        }
      }

      // Fallback to Drizzle ORM with direct SQL
      console.log('🔄 Using direct SQL for DELETE operation');
      try {
        const sqlDeleteResult = await db.client.execute({
          sql: 'DELETE FROM horary_questions WHERE id = ?',
          args: [questionId]
        });

        console.log('✅ Direct SQL delete result:', sqlDeleteResult);
        
        return { 
          success: true, 
          rowsAffected: sqlDeleteResult.rowsAffected || 0 
        };
      } catch (sqlError) {
        console.error('❌ Direct SQL delete failed:', sqlError);
        return { success: false };
      }
    } catch (error) {
      console.error('❌ Database delete error:', error);
      return { success: false };
    }
  }

  /**
   * Check if question exists and get basic info for ownership verification
   */
  static async getQuestionForVerification(questionId: string): Promise<{
    id: string;
    question: string;
    userId: string | null;
  } | null> {
    try {
      // Try connection pool first if available
      if (isUsingConnectionPool()) {
        console.log('🔄 Using connection pool for verification query');
        try {
          const checkResult = await executePooledQueryDirect(
            'SELECT id, question, user_id FROM horary_questions WHERE id = ? LIMIT 1',
            [questionId]
          );
          
          if (checkResult.rows && checkResult.rows.length > 0) {
            const row = checkResult.rows[0];
            return {
              id: row.id as string,
              question: row.question as string,
              userId: row.user_id as string | null
            };
          }
        } catch (poolError) {
          console.warn('Pool verification query failed, falling back to Drizzle:', poolError);
        }
      }

      // Fallback to direct SQL query
      try {
        const result = await db.client.execute({
          sql: 'SELECT id, question, user_id FROM horary_questions WHERE id = ? LIMIT 1',
          args: [questionId]
        });
        
        if (result.rows && result.rows.length > 0) {
          const row = result.rows[0];
          return {
            id: row.id as string,
            question: row.question as string,
            userId: row.user_id as string | null
          };
        }
      } catch (sqlError) {
        console.error('❌ SQL verification query failed:', sqlError);
      }

      return null;
    } catch (error) {
      console.error('Database error in verification query:', error);
      return null;
    }
  }
}