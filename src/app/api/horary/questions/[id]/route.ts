/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { db, getDbAsync, executePooledQueryDirect, isUsingConnectionPool } from '@/db';
import { horaryQuestions } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

// GET - Retrieve specific horary question by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const questionId = resolvedParams.id;

    // Use connection pool if available, otherwise fallback to Drizzle ORM
    let question = null;
    
    if (isUsingConnectionPool()) {
      console.log('🔄 Using connection pool for GET query');
      try {
        const rawResult = await executePooledQueryDirect(
          'SELECT * FROM horary_questions WHERE id = ? LIMIT 1',
          [questionId]
        );
        
        if (rawResult.rows && rawResult.rows.length > 0) {
          const row = rawResult.rows[0];
          question = {
            id: row.id,
            question: row.question,
            userId: row.user_id,
            date: row.date,
            location: row.location,
            latitude: row.latitude,
            longitude: row.longitude,
            timezone: row.timezone,
            category: row.category,
            tags: row.tags,
            answer: row.answer,
            timing: row.timing,
            interpretation: row.interpretation,
            chartData: row.chart_data,
            chartSvg: row.chart_svg,
            ascendantDegree: row.ascendant_degree,
            moonSign: row.moon_sign,
            moonVoidOfCourse: row.moon_void_of_course,
            planetaryHour: row.planetary_hour,
            isRadical: row.is_radical,
            chartWarnings: row.chart_warnings,
            isShared: row.is_shared,
            shareToken: row.share_token,
            aspectCount: row.aspect_count,
            retrogradeCount: row.retrograde_count,
            significatorPlanet: row.significator_planet,
            createdAt: row.created_at,
            updatedAt: row.updated_at
          };
        }
      } catch (poolError) {
        console.warn('Pool query failed, falling back to Drizzle:', poolError);
      }
    }
    
    // Fallback to Drizzle ORM if pool not available or failed
    if (!question) {
      console.log('🔄 Using Drizzle ORM for GET query');
      const [result] = await db
        .select()
        .from(horaryQuestions)
        .where(eq(horaryQuestions.id, questionId))
        .limit(1);
      question = result;
    }

    if (!question) {
      return NextResponse.json(
        { success: false, error: 'Horary question not found' },
        { status: 404 }
      );
    }

    // Transform question for response
    const transformedQuestion = {
      id: question.id,
      question: question.question,
      date: question.date,
      userId: question.userId,
      location: question.location,
      latitude: question.latitude,
      longitude: question.longitude,
      timezone: question.timezone,
      category: question.category,
      tags: question.tags ? JSON.parse(question.tags) : [],
      answer: question.answer,
      timing: question.timing,
      interpretation: question.interpretation,
      chartData: question.chartData ? JSON.parse(question.chartData) : null,
      chartSvg: question.chartSvg,
      ascendantDegree: question.ascendantDegree,
      moonSign: question.moonSign,
      moonVoidOfCourse: question.moonVoidOfCourse,
      planetaryHour: question.planetaryHour,
      isRadical: question.isRadical,
      chartWarnings: question.chartWarnings ? JSON.parse(question.chartWarnings) : [],
      isShared: question.isShared,
      shareToken: question.shareToken,
      aspectCount: question.aspectCount,
      retrogradeCount: question.retrogradeCount,
      significatorPlanet: question.significatorPlanet,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    };

    return NextResponse.json({
      success: true,
      question: transformedQuestion
    });

  } catch (error) {
    console.error('❌ Error fetching horary question:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH - Update horary question with analysis results
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Ensure database is initialized
    const dbInstance = db || await getDbAsync();
    console.log('🔍 Database instance in PATCH:', !!dbInstance);
    
    const resolvedParams = await params;
    const questionId = resolvedParams.id;
    const body = await request.json();

    const {
      answer,
      timing,
      interpretation,
      chartData,
      chartSvg,
      ascendantDegree,
      moonSign,
      moonVoidOfCourse,
      planetaryHour,
      isRadical,
      chartWarnings,
      aspectCount,
      retrogradeCount,
      significatorPlanet,
      category,
      tags,
      isShared,
      shareToken
    } = body;

    // Build update object with only provided fields
    const updateData: any = {
      updatedAt: new Date()
    };

    if (answer !== undefined) updateData.answer = answer;
    if (timing !== undefined) updateData.timing = timing;
    if (interpretation !== undefined) updateData.interpretation = interpretation;
    if (chartData !== undefined) updateData.chartData = JSON.stringify(chartData);
    if (chartSvg !== undefined) updateData.chartSvg = chartSvg;
    if (ascendantDegree !== undefined) updateData.ascendantDegree = ascendantDegree;
    if (moonSign !== undefined) updateData.moonSign = moonSign;
    if (moonVoidOfCourse !== undefined) updateData.moonVoidOfCourse = moonVoidOfCourse;
    if (planetaryHour !== undefined) updateData.planetaryHour = planetaryHour;
    if (isRadical !== undefined) updateData.isRadical = isRadical;
    if (chartWarnings !== undefined) updateData.chartWarnings = JSON.stringify(chartWarnings);
    if (aspectCount !== undefined) updateData.aspectCount = aspectCount;
    if (retrogradeCount !== undefined) updateData.retrogradeCount = retrogradeCount;
    if (significatorPlanet !== undefined) updateData.significatorPlanet = significatorPlanet;
    if (category !== undefined) updateData.category = category;
    if (tags !== undefined) updateData.tags = JSON.stringify(tags);
    if (isShared !== undefined) updateData.isShared = isShared;
    if (shareToken !== undefined) updateData.shareToken = shareToken;

    // Update the question with explicit error handling
    console.log('🔍 Attempting to update horary question:', {
      questionId,
      updateFields: Object.keys(updateData),
      hasChartData: !!updateData.chartData,
      hasAnswer: !!updateData.answer
    });
    
    let updatedQuestion = null;
    try {
      console.log('🔍 Database instance available for update:', !!dbInstance);
      
      if (!dbInstance) {
        console.error('❌ Database instance is null/undefined for update');
        throw new Error('Database not available for update');
      }
      
      const [result] = await dbInstance
        .update(horaryQuestions)
        .set(updateData)
        .where(eq(horaryQuestions.id, questionId))
        .returning();
        
      console.log('✅ Database update successful:', { questionId, hasResult: !!result });
      updatedQuestion = result;
    } catch (dbError) {
      console.error('❌ Database update error details:', {
        error: dbError instanceof Error ? dbError.message : String(dbError),
        stack: dbError instanceof Error ? dbError.stack : undefined,
        questionId,
        updateData: Object.keys(updateData)
      });
      
      // Don't throw, just set to null to trigger error response
      updatedQuestion = null;
    }

    if (!updatedQuestion) {
      return NextResponse.json(
        { success: false, error: 'Horary question not found or update failed' },
        { status: 404 }
      );
    }

    console.log(`🔮 Updated horary question: ${questionId} - Answer: ${answer || 'pending'}`);

    // Transform updated question for response
    const transformedQuestion = {
      id: updatedQuestion.id,
      question: updatedQuestion.question,
      date: updatedQuestion.date,
      userId: updatedQuestion.userId,
      location: updatedQuestion.location,
      latitude: updatedQuestion.latitude,
      longitude: updatedQuestion.longitude,
      timezone: updatedQuestion.timezone,
      category: updatedQuestion.category,
      tags: updatedQuestion.tags ? JSON.parse(updatedQuestion.tags) : [],
      answer: updatedQuestion.answer,
      timing: updatedQuestion.timing,
      interpretation: updatedQuestion.interpretation,
      chartData: updatedQuestion.chartData ? JSON.parse(updatedQuestion.chartData) : null,
      chartSvg: updatedQuestion.chartSvg,
      ascendantDegree: updatedQuestion.ascendantDegree,
      moonSign: updatedQuestion.moonSign,
      moonVoidOfCourse: updatedQuestion.moonVoidOfCourse,
      planetaryHour: updatedQuestion.planetaryHour,
      isRadical: updatedQuestion.isRadical,
      chartWarnings: updatedQuestion.chartWarnings ? JSON.parse(updatedQuestion.chartWarnings) : [],
      isShared: updatedQuestion.isShared,
      shareToken: updatedQuestion.shareToken,
      aspectCount: updatedQuestion.aspectCount,
      retrogradeCount: updatedQuestion.retrogradeCount,
      significatorPlanet: updatedQuestion.significatorPlanet,
      createdAt: updatedQuestion.createdAt,
      updatedAt: updatedQuestion.updatedAt,
    };

    return NextResponse.json({
      success: true,
      question: transformedQuestion
    });

  } catch (error) {
    console.error('❌ Error updating horary question:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Remove horary question
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const questionId = resolvedParams.id;
    
    // Get userId from request body for proper authentication
    let userId = null;
    try {
      const body = await request.json();
      userId = body.userId;
    } catch (error) {
      // If no body, try query params
      const { searchParams } = new URL(request.url);
      userId = searchParams.get('userId');
    }

    console.log('🗑️ DELETE request:', { questionId, userId });

    // Use connection pool if available, otherwise fallback to Drizzle ORM
    let existingQuestion = null;
    let deleteResult = null;
    
    if (isUsingConnectionPool()) {
      console.log('🔄 Using connection pool for DELETE operations');
      try {
        // First check if question exists
        const checkResult = await executePooledQueryDirect(
          'SELECT * FROM horary_questions WHERE id = ? LIMIT 1',
          [questionId]
        );
        
        if (checkResult.rows && checkResult.rows.length > 0) {
          const row = checkResult.rows[0];
          existingQuestion = {
            id: row.id,
            question: row.question,
            userId: row.user_id,
            date: row.date,
            location: row.location
          };
          
          console.log('🔍 Question found in DB:', {
            requestedId: questionId,
            foundId: existingQuestion.id,
            idMatch: questionId === existingQuestion.id,
            questionOwner: existingQuestion.userId,
            requestingUser: userId,
            questionText: existingQuestion.question?.substring(0, 50) + '...'
          });
          
          // Check ownership if userId provided
          if (userId && existingQuestion.userId !== userId) {
            console.log('❌ Permission denied:', { requestingUserId: userId, questionOwner: existingQuestion.userId });
            return NextResponse.json(
              { success: false, error: 'Access denied - you can only delete your own questions' },
              { status: 403 }
            );
          }
          
          // Delete the question
          console.log('🗑️ Deleting question:', questionId);
          deleteResult = await executePooledQueryDirect(
            'DELETE FROM horary_questions WHERE id = ?',
            [questionId]
          );
          
          console.log('✅ Direct SQL delete result:', deleteResult);
        }
        
      } catch (poolError) {
        console.error('❌ Pool DELETE failed, falling back to Drizzle:', poolError);
        existingQuestion = null; // Reset to trigger fallback
      }
    }
    
    // Fallback to Drizzle ORM if pool not available or failed
    if (!existingQuestion) {
      console.log('🔄 Using Drizzle ORM for DELETE operations');
      
      try {
        // First check if question exists using raw SQL to avoid WHERE clause parsing issues
        let foundQuestion = null;
        try {
          // Use direct SQL to bypass Drizzle WHERE clause issues
          const result = await db.client.execute({
            sql: 'SELECT * FROM horary_questions WHERE id = ? LIMIT 1',
            args: [questionId]
          });
          
          if (result.rows && result.rows.length > 0) {
            const row = result.rows[0];
            foundQuestion = {
              id: row.id,
              question: row.question,
              userId: row.user_id,
              date: row.date,
              location: row.location,
              latitude: row.latitude,
              longitude: row.longitude,
              timezone: row.timezone,
              category: row.category,
              tags: row.tags,
              answer: row.answer,
              timing: row.timing,
              interpretation: row.interpretation,
              chartData: row.chart_data,
              chartSvg: row.chart_svg,
              ascendantDegree: row.ascendant_degree,
              moonSign: row.moon_sign,
              moonVoidOfCourse: row.moon_void_of_course,
              planetaryHour: row.planetary_hour,
              isRadical: row.is_radical,
              chartWarnings: row.chart_warnings,
              isShared: row.is_shared,
              shareToken: row.share_token,
              aspectCount: row.aspect_count,
              retrogradeCount: row.retrograde_count,
              significatorPlanet: row.significator_planet,
              createdAt: row.created_at,
              updatedAt: row.updated_at
            };
          }
        } catch (sqlError) {
          console.error('❌ Raw SQL query failed, falling back to Drizzle:', sqlError);
          // Fallback to Drizzle as last resort
          const [drizzleResult] = await db
            .select()
            .from(horaryQuestions)
            .where(eq(horaryQuestions.id, questionId))
            .limit(1);
          foundQuestion = drizzleResult;
        }
        
        if (!foundQuestion) {
          return NextResponse.json(
            { success: false, error: 'Horary question not found' },
            { status: 404 }
          );
        }
        
        existingQuestion = foundQuestion;
        
        console.log('🔍 Question found in DB:', {
          requestedId: questionId,
          foundId: existingQuestion.id,
          questionOwner: existingQuestion.userId,
          requestingUser: userId,
          questionText: existingQuestion.question?.substring(0, 50) + '...'
        });
        
        // Check ownership if userId provided
        if (userId && existingQuestion.userId !== userId) {
          console.log('❌ Permission denied:', { requestingUserId: userId, questionOwner: existingQuestion.userId });
          return NextResponse.json(
            { success: false, error: 'Access denied - you can only delete your own questions' },
            { status: 403 }
          );
        }

        // Delete the question using direct SQL to avoid WHERE clause parsing issues
        console.log('🗑️ Deleting question with direct SQL:', questionId);
        try {
          const sqlDeleteResult = await db.client.execute({
            sql: 'DELETE FROM horary_questions WHERE id = ?',
            args: [questionId]
          });

          console.log('✅ Direct SQL delete result:', sqlDeleteResult);
          
          if (sqlDeleteResult.rowsAffected === 0) {
            return NextResponse.json(
              { success: false, error: 'Question not found or already deleted' },
              { status: 404 }
            );
          }
          
          deleteResult = { rowsAffected: sqlDeleteResult.rowsAffected };
        } catch (deleteError) {
          console.error('❌ Direct SQL delete failed:', deleteError);
          return NextResponse.json(
            { success: false, error: 'Failed to delete horary question' },
            { status: 500 }
          );
        }
        
      } catch (drizzleError) {
        console.error('❌ Drizzle DELETE failed:', drizzleError);
        return NextResponse.json(
          { success: false, error: 'Database operation failed' },
          { status: 500 }
        );
      }
    }

    if (!existingQuestion) {
      return NextResponse.json(
        { success: false, error: 'Horary question not found or access denied' },
        { status: 404 }
      );
    }

    // Check delete result
    if (deleteResult && deleteResult.rowsAffected === 0) {
      return NextResponse.json(
        { success: false, error: 'Question not found or already deleted' },
        { status: 404 }
      );
    }

    console.log(`🗑️ Deleted horary question: ${questionId} - "${existingQuestion.question.substring(0, 50)}..."`);

    return NextResponse.json({
      success: true,
      message: 'Horary question deleted successfully',
      deletedQuestion: {
        id: existingQuestion.id,
        question: existingQuestion.question
      }
    });

  } catch (error) {
    console.error('❌ Error deleting horary question:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      questionId,
      userId,
      isUsingPool: isUsingConnectionPool()
    });
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}