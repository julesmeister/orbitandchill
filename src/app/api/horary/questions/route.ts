/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { db, getDbAsync } from '@/db';
import { horaryQuestions, users } from '@/db/schema';
import { eq, desc, and, or } from 'drizzle-orm';
import crypto from 'crypto';
import { withDatabaseResilience } from '@/db/resilience';

// POST - Create new horary question
export async function POST(request: NextRequest) {
  try {
    // Ensure database is initialized
    const dbInstance = db || await getDbAsync();
    
    const body = await request.json();
    const {
      question,
      date,
      userId,
      location,
      latitude,
      longitude,
      timezone,
      category,
      tags,
      customLocation
    } = body;

    // Validate required fields
    if (!question || !date) {
      return NextResponse.json(
        { success: false, error: 'Question and date are required' },
        { status: 400 }
      );
    }

    // Verify user exists in database if userId is provided
    if (userId) {
      try {
        const userExists = await withDatabaseResilience(
          db,
          async () => {
            const result = await db.select({ id: users.id }).from(users).where(eq(users.id, userId)).limit(1);
            return result.length > 0;
          },
          {
            fallbackValue: true, // Allow creation if database check fails
            serviceName: 'HoraryAPI',
            methodName: 'verifyUser'
          }
        );

        if (!userExists) {
          console.warn(`⚠️ User ${userId} not found in database, but allowing question creation`);
          // Log the issue but don't fail - allow question creation for better UX
        } else {
        }
      } catch (error) {
        console.warn(`⚠️ User verification failed for ${userId}:`, error);
        // Continue with question creation even if verification fails
      }
    }

    // Generate unique ID for question
    const questionId = `horary_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

    // Use custom location if provided, otherwise use system location
    const questionLocation = customLocation?.name || location;
    const questionLatitude = customLocation?.coordinates?.lat 
      ? parseFloat(customLocation.coordinates.lat) 
      : latitude;
    const questionLongitude = customLocation?.coordinates?.lon 
      ? parseFloat(customLocation.coordinates.lon) 
      : longitude;

    // Try database insert with explicit error handling
    let newQuestion = null;
    try {
      
      if (!dbInstance) {
        throw new Error('Database not available');
      }
      
      const now = new Date();
      const [result] = await dbInstance.insert(horaryQuestions).values({
        id: questionId,
        userId: userId || null, // Allow anonymous questions
        question: question.trim(),
        date: new Date(date),
        location: questionLocation,
        latitude: questionLatitude,
        longitude: questionLongitude,
        timezone: timezone || 'UTC',
        category: category || null,
        tags: tags ? JSON.stringify(tags) : null,
        // Initial values - will be updated when chart analysis completes
        answer: null,
        timing: null,
        interpretation: null,
        chartData: null,
        chartSvg: null,
        isRadical: null,
        moonVoidOfCourse: null,
        // Explicitly provide timestamps since Turso HTTP client doesn't execute $defaultFn
        createdAt: now,
        updatedAt: now,
      }).returning();
      
      newQuestion = result;
    } catch (dbError) {
      // Don't throw, just set newQuestion to null to trigger fallback
      newQuestion = null;
    }

    if (!newQuestion) {
      return NextResponse.json(
        { success: false, error: 'Failed to create horary question' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      question: {
        id: newQuestion.id,
        question: newQuestion.question,
        date: newQuestion.date,
        userId: newQuestion.userId,
        location: newQuestion.location,
        latitude: newQuestion.latitude,
        longitude: newQuestion.longitude,
        timezone: newQuestion.timezone,
        category: newQuestion.category,
        tags: newQuestion.tags ? JSON.parse(newQuestion.tags) : [],
        answer: newQuestion.answer,
        timing: newQuestion.timing,
        interpretation: newQuestion.interpretation,
        chartData: newQuestion.chartData ? JSON.parse(newQuestion.chartData) : null,
        isRadical: newQuestion.isRadical,
        createdAt: newQuestion.createdAt,
      }
    });

  } catch (error) {
    console.error('❌ Error creating horary question:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - Retrieve user's horary questions
export async function GET(request: NextRequest) {
  try {
    // Ensure database is initialized
    const dbInstance = db || await getDbAsync();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const category = searchParams.get('category');
    const includeAnonymous = searchParams.get('includeAnonymous') === 'true';

    // Build query conditions
    let userCondition = null;
    
    if (userId) {
      if (includeAnonymous) {
        // Include both user's questions and anonymous questions
        userCondition = or(
          eq(horaryQuestions.userId, userId),
          eq(horaryQuestions.userId, null)
        );
      } else {
        // Only user's questions - STRICT FILTERING
        userCondition = eq(horaryQuestions.userId, userId);
      }
    } else if (includeAnonymous) {
      // Only anonymous questions if no userId provided
      userCondition = eq(horaryQuestions.userId, null);
    } else {
      // No questions if no userId and not including anonymous
      return NextResponse.json({
        success: true,
        questions: [],
        total: 0,
        hasMore: false
      });
    }

    // Build final conditions array
    const conditions = [];
    if (userCondition) {
      conditions.push(userCondition);
    }

    if (category) {
      conditions.push(eq(horaryQuestions.category, category));
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
          .limit(limit + 1) // Get one extra to check if there are more
          .offset(offset);
        
        return results;
      },
      {
        fallbackValue: [],
        serviceName: 'HoraryAPI',
        methodName: 'getQuestions'
      }
    );

    // Check if there are more questions
    const hasMore = questions.length > limit;
    const returnQuestions = hasMore ? questions.slice(0, limit) : questions;

    // Transform questions for response
    const transformedQuestions = returnQuestions.map(q => ({
      id: q.id,
      question: q.question,
      date: q.date,
      userId: q.userId,
      location: q.location,
      latitude: q.latitude,
      longitude: q.longitude,
      timezone: q.timezone,
      category: q.category,
      tags: q.tags ? JSON.parse(q.tags) : [],
      answer: q.answer,
      timing: q.timing,
      interpretation: q.interpretation,
      chartData: q.chartData ? JSON.parse(q.chartData) : null,
      chartSvg: q.chartSvg,
      ascendantDegree: q.ascendantDegree,
      moonSign: q.moonSign,
      moonVoidOfCourse: q.moonVoidOfCourse,
      planetaryHour: q.planetaryHour,
      isRadical: q.isRadical,
      chartWarnings: q.chartWarnings ? JSON.parse(q.chartWarnings) : [],
      isShared: q.isShared,
      shareToken: q.shareToken,
      aspectCount: q.aspectCount,
      retrogradeCount: q.retrogradeCount,
      significatorPlanet: q.significatorPlanet,
      createdAt: q.createdAt,
      updatedAt: q.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      questions: transformedQuestions,
      total: returnQuestions.length,
      hasMore,
      pagination: {
        limit,
        offset,
        hasMore
      }
    });

  } catch (error) {
    console.error('❌ Error fetching horary questions:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}