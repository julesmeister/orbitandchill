 
import { NextRequest, NextResponse } from 'next/server';
import { ChartService } from '@/db/services/chartService';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { userId } = body;

    if (!id || !userId) {
      return NextResponse.json(
        { error: 'Chart ID and userId are required' },
        { status: 400 }
      );
    }

    const shareToken = await ChartService.generateShareToken(id, userId);

    if (!shareToken) {
      return NextResponse.json(
        { error: 'Chart not found or share token generation failed' },
        { status: 404 }
      );
    }

    // Construct the share URL - redirect to main chart page with share token
    const baseUrl = request.nextUrl.origin;
    const shareUrl = `${baseUrl}/chart?shareToken=${shareToken}`;

    return NextResponse.json({
      success: true,
      shareToken,
      shareUrl,
    });

  } catch (error) {
    console.error('Share token generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate share token' },
      { status: 500 }
    );
  }
}