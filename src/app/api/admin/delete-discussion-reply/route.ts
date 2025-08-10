import { NextRequest, NextResponse } from 'next/server';
import { DiscussionService } from '@/db/services/discussionService';

export async function DELETE(request: NextRequest) {
  try {
    const { replyId } = await request.json();
    
    if (!replyId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Reply ID is required' 
      }, { status: 400 });
    }

    // Delete the reply from the database
    await DiscussionService.deleteReply(replyId);

    return NextResponse.json({ 
      success: true,
      message: 'Reply deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting reply:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete reply' 
    }, { status: 500 });
  }
}