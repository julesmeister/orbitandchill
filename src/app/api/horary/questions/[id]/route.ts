/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { horaryQuestions } from '@/db/schema';
import { eq } from 'drizzle-orm';

// GET - Retrieve specific horary question by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const questionId = resolvedParams.id;

    const [question] = await db
      .select()
      .from(horaryQuestions)
      .where(eq(horaryQuestions.id, questionId))
      .limit(1);

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

    // Update the question
    const [updatedQuestion] = await db
      .update(horaryQuestions)
      .set(updateData)
      .where(eq(horaryQuestions.id, questionId))
      .returning();

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
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Build where conditions (allow user to delete their own questions, or admin to delete any)
    let whereCondition = eq(horaryQuestions.id, questionId);
    
    if (userId) {
      // Regular user can only delete their own questions
      whereCondition = and(
        eq(horaryQuestions.id, questionId),
        eq(horaryQuestions.userId, userId)
      ) as any;
    }

    // First check if question exists and user has permission
    const [existingQuestion] = await db
      .select()
      .from(horaryQuestions)
      .where(whereCondition)
      .limit(1);

    if (!existingQuestion) {
      return NextResponse.json(
        { success: false, error: 'Horary question not found or access denied' },
        { status: 404 }
      );
    }

    // Delete the question
    const deletedQuestions = await db
      .delete(horaryQuestions)
      .where(whereCondition)
      .returning();

    if (deletedQuestions.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete horary question' },
        { status: 500 }
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
    console.error('❌ Error deleting horary question:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}