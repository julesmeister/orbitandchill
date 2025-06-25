/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { horaryQuestions, users } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import crypto from 'crypto';

// POST - Create new horary question
export async function POST(request: NextRequest) {
  try {
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

    // Generate unique ID for question
    const questionId = `horary_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

    // Use custom location if provided, otherwise use system location
    const questionLocation = customLocation?.name || location;
    const questionLatitude = customLocation?.coordinates?.lat || latitude;
    const questionLongitude = customLocation?.coordinates?.lon || longitude;

    // Create horary question record
    const [newQuestion] = await db.insert(horaryQuestions).values({
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
    }).returning();

    if (!newQuestion) {
      return NextResponse.json(
        { success: false, error: 'Failed to create horary question' },
        { status: 500 }
      );
    }

    console.log(`✨ Created horary question: ${questionId} - "${question.substring(0, 50)}..."`);

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
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const category = searchParams.get('category');
    const includeAnonymous = searchParams.get('includeAnonymous') === 'true';

    // Build query conditions
    const conditions = [];
    
    if (userId) {
      if (includeAnonymous) {
        // Include both user's questions and anonymous questions
        conditions.push(
          eq(horaryQuestions.userId, userId)
        );
      } else {
        // Only user's questions
        conditions.push(eq(horaryQuestions.userId, userId));
      }
    } else if (includeAnonymous) {
      // Only anonymous questions if no userId provided
      conditions.push(eq(horaryQuestions.userId, null));
    } else {
      // No questions if no userId and not including anonymous
      return NextResponse.json({
        success: true,
        questions: [],
        total: 0,
        hasMore: false
      });
    }

    if (category) {
      conditions.push(eq(horaryQuestions.category, category));
    }

    // Execute query
    const questions = await db
      .select()
      .from(horaryQuestions)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(horaryQuestions.createdAt))
      .limit(limit + 1) // Get one extra to check if there are more
      .offset(offset);

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