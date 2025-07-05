/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { db, getDbAsync } from '@/db';
import { horaryQuestions, users } from '@/db/schema';
import { eq } from 'drizzle-orm';

// DEBUG: Test horary question creation with enhanced logging
export async function POST(request: NextRequest) {
  try {
    console.log('🔧 DEBUG: Testing horary question creation...');
    
    // Test database initialization exactly like the real API
    const dbInstance = db || await getDbAsync();
    console.log('🔍 Database instance in debug test:', !!dbInstance);
    
    if (!dbInstance) {
      return NextResponse.json({
        success: false,
        error: 'Database instance not available',
        debug: {
          dbFromImport: !!db,
          dbFromAsync: !!(await getDbAsync()),
          dbInstance: !!dbInstance
        }
      }, { status: 500 });
    }

    // Test simple database query first
    console.log('🔍 Testing simple database query...');
    const testQuery = await dbInstance.client.execute('SELECT 1 as test');
    console.log('✅ Simple query successful:', testQuery);

    // First, create a test user to avoid foreign key constraint issues
    const testUserId = `debug_user_${Date.now()}`;
    const now = new Date();
    
    console.log('🔍 Creating test user first...');
    try {
      const testUser = await dbInstance.insert(users).values({
        id: testUserId,
        username: 'Debug Test User',
        authProvider: 'anonymous',
        createdAt: now,
        updatedAt: now,
      }).returning();
      console.log('✅ Test user created:', { userId: testUser[0].id });
    } catch (userError) {
      console.warn('⚠️ Failed to create test user, using anonymous instead:', userError);
      // Continue with null userId for anonymous question
    }

    // Generate test question data (explicitly providing timestamps for Turso HTTP client)
    const questionId = `horary_debug_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const testData = {
      id: questionId,
      userId: testUserId, // Use the test user we just created
      question: 'Debug test question - database integration test',
      date: now,
      location: 'Test Location',
      latitude: 40.7128,
      longitude: -74.0060,
      timezone: 'America/New_York',
      category: 'test',
      tags: JSON.stringify(['debug', 'test']),
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
    };

    console.log('🔍 Attempting to insert test horary question...');
    console.log('🔍 Test data:', { 
      questionId, 
      userId: testData.userId,
      question: testData.question.substring(0, 30) + '...',
      location: testData.location,
      hasRequiredFields: {
        id: !!testData.id,
        question: !!testData.question,
        date: !!testData.date,
        createdAt: !!testData.createdAt,
        updatedAt: !!testData.updatedAt
      }
    });

    // Test database insert using the same method as the real API
    const [result] = await dbInstance.insert(horaryQuestions).values(testData).returning();
    
    console.log('✅ Test question created successfully:', { questionId: result.id });

    // Test query to verify it was saved
    const [savedQuestion] = await dbInstance
      .select()
      .from(horaryQuestions)
      .where(eq(horaryQuestions.id, questionId))
      .limit(1);

    console.log('✅ Test question verified in database:', !!savedQuestion);

    // Cleanup: Remove test data
    console.log('🧹 Cleaning up test data...');
    try {
      await dbInstance.delete(horaryQuestions).where(eq(horaryQuestions.id, questionId));
      await dbInstance.delete(users).where(eq(users.id, testUserId));
      console.log('✅ Test data cleaned up successfully');
    } catch (cleanupError) {
      console.warn('⚠️ Cleanup failed (non-critical):', cleanupError);
    }

    return NextResponse.json({
      success: true,
      message: 'Horary question creation test successful',
      debug: {
        questionId,
        testUserId,
        wasCreated: !!result,
        wasSaved: !!savedQuestion,
        dbInstance: !!dbInstance,
        dbClient: !!dbInstance.client,
        testQuery: testQuery.rows?.[0],
        testDataFields: Object.keys(testData),
        resultFields: result ? Object.keys(result) : []
      }
    });

  } catch (error) {
    console.error('❌ Horary creation test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Horary question creation test failed',
      debug: {
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined,
        dbAvailable: !!db,
        dbAsyncAvailable: !!(await getDbAsync().catch(() => null))
      }
    }, { status: 500 });
  }
}

