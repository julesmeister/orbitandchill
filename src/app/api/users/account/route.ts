/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/db/services/userService';

export async function DELETE(request: NextRequest) {
  try {
    // Get user ID from the request
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 401 }
      );
    }

    // Use the UserService's built-in deleteUser method
    const result = await UserService.deleteUser(userId);

    if (!result) {
      return NextResponse.json(
        { error: 'User not found or failed to delete' },
        { status: 404 }
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Account successfully deleted',
      deletedUserId: userId
    });

  } catch (error) {
    console.error('Error deleting user account:', error);
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    );
  }
}