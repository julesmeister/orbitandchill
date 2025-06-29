/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    
    // For now, return empty array since we don't have a replies system implemented yet
    // This prevents the 404 error in the logs
    return NextResponse.json({
      replies: [],
      totalCount: 0,
      userId
    });
  } catch (error) {
    console.error('Error fetching user replies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user replies' },
      { status: 500 }
    );
  }
}