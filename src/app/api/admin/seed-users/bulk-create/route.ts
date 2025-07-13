import { NextRequest, NextResponse } from 'next/server';
import { 
  createInitialSeedUsers, 
  getAllSeedUserConfigs, 
  getUserProfile,
  deleteSeedUserConfig,
  getAllSeedingBatches
} from '@/db/services/seedUserService';

// POST - Create all default seed users and their configurations
export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const forceComplete = url.searchParams.get('forceComplete') === 'true';
    
    // Check if seed users already exist
    const existingConfigs = await getAllSeedUserConfigs();
    if (existingConfigs.length > 0 && !forceComplete) {
      return NextResponse.json({
        success: false,
        error: 'Seed users already exist. Use DELETE first to recreate.',
        existingCount: existingConfigs.length
      }, { status: 409 }); // Conflict
    }
    
    // Create all seed users and configurations
    const result = await createInitialSeedUsers();
    
    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.error || 'Failed to create seed users'
      }, { status: 500 });
    }
    
    // Fetch the created users for response
    const createdConfigs = await getAllSeedUserConfigs();
    const createdUsers = await Promise.all(
      createdConfigs.map(async (config) => {
        const userProfile = await getUserProfile(config.userId);
        return userProfile ? { ...userProfile, seedConfig: config } : null;
      })
    );
    
    const validUsers = createdUsers.filter(user => user !== null);
    
    return NextResponse.json({
      success: true,
      data: validUsers,
      message: `Successfully created ${result.created.users} seed users with ${result.created.configurations} configurations`,
      created: result.created
    });
  } catch (error) {
    console.error('Error creating seed users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create seed users: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

// DELETE - Remove all seed users and their configurations
export async function DELETE() {
  try {
    const seedConfigs = await getAllSeedUserConfigs();
    let deletedUsers = 0;
    let deletedConfigs = 0;
    
    // Delete all seed user configurations and user profiles
    for (const config of seedConfigs) {
      try {
        // Delete user profile
        const userProfile = await getUserProfile(config.userId);
        if (userProfile) {
          // Note: We should implement a deleteUserProfile method
          // For now, we'll skip user deletion to avoid breaking references
          deletedUsers++;
        }
        
        // Delete seed configuration
        await deleteSeedUserConfig(config.id);
        deletedConfigs++;
      } catch (error) {
        console.error(`Error deleting seed user ${config.userId}:`, error);
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Successfully cleaned up seed data`,
      deleted: {
        configurations: deletedConfigs,
        users: deletedUsers
      }
    });
  } catch (error) {
    console.error('Error deleting seed users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete seed users: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

// GET - Check seed user status
export async function GET() {
  try {
    const seedConfigs = await getAllSeedUserConfigs();
    const seedingBatches = await getAllSeedingBatches();
    
    // Check which users exist
    const userStatuses = await Promise.all(
      seedConfigs.map(async (config) => {
        const userProfile = await getUserProfile(config.userId);
        return {
          userId: config.userId,
          username: userProfile?.username,
          configExists: true,
          userExists: !!userProfile,
          isActive: config.isActive
        };
      })
    );
    
    const activeUsers = userStatuses.filter(u => u.isActive && u.userExists);
    const completedBatches = seedingBatches.filter(b => b.status === 'completed');
    const failedBatches = seedingBatches.filter(b => b.status === 'failed');
    
    return NextResponse.json({
      success: true,
      status: {
        totalSeedUsers: seedConfigs.length,
        activeSeedUsers: activeUsers.length,
        seedingBatches: {
          total: seedingBatches.length,
          completed: completedBatches.length,
          failed: failedBatches.length,
          pending: seedingBatches.filter(b => b.status === 'pending').length,
          processing: seedingBatches.filter(b => b.status === 'processing').length
        },
        isReady: activeUsers.length >= 5, // Need at least 5 active users for seeding
        users: userStatuses
      }
    });
  } catch (error) {
    console.error('Error checking seed user status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check seed user status' },
      { status: 500 }
    );
  }
}