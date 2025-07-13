import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllSeedUserConfigs, 
  getUserProfile,
  saveSeedUserConfig,
  getSeedUserConfig,
  deleteSeedUserConfig
} from '@/db/services/seedUserService';

// GET - Get all seed users with their configurations
export async function GET() {
  try {
    // Get all seed user configurations
    const seedConfigs = await getAllSeedUserConfigs();
    
    // Get the corresponding user profiles
    const seedUsers = await Promise.all(
      seedConfigs.map(async (config) => {
        const userProfile = await getUserProfile(config.userId);
        if (!userProfile) {
          return null;
        }
        
        return {
          ...userProfile,
          seedConfig: config
        };
      })
    );
    
    // Filter out null values (users that don't exist)
    const validSeedUsers = seedUsers.filter(user => user !== null);
    
    return NextResponse.json({
      success: true,
      data: validSeedUsers,
      count: validSeedUsers.length
    });
  } catch (error) {
    console.error('Error fetching seed users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch seed users' },
      { status: 500 }
    );
  }
}

// POST - Create or update seed user configuration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, seedConfig } = body;
    
    if (!userId || !seedConfig) {
      return NextResponse.json(
        { success: false, error: 'User ID and seed configuration are required' },
        { status: 400 }
      );
    }
    
    // Validate required seed config fields
    const requiredFields = ['writingStyle', 'expertiseAreas', 'responsePattern', 'replyProbability', 'votingBehavior'];
    for (const field of requiredFields) {
      if (!(field in seedConfig)) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Generate seed config ID if not provided
    const configId = seedConfig.id || `config_${userId.replace('seed_user_', '')}`;
    
    // Create the seed configuration
    const newSeedConfig = {
      id: configId,
      userId,
      writingStyle: seedConfig.writingStyle,
      expertiseAreas: Array.isArray(seedConfig.expertiseAreas) ? seedConfig.expertiseAreas : [],
      responsePattern: seedConfig.responsePattern,
      replyProbability: Number(seedConfig.replyProbability),
      votingBehavior: seedConfig.votingBehavior,
      aiPromptTemplate: seedConfig.aiPromptTemplate || '',
      isActive: seedConfig.isActive !== false, // Default to true
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Save the seed configuration
    await saveSeedUserConfig(newSeedConfig);
    
    return NextResponse.json({
      success: true,
      data: newSeedConfig,
      message: 'Seed user configuration saved successfully'
    });
  } catch (error) {
    console.error('Error saving seed user configuration:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save seed user configuration' },
      { status: 500 }
    );
  }
}

// PUT - Update existing seed user configuration
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, updates } = body;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Configuration ID is required' },
        { status: 400 }
      );
    }
    
    // Get existing configuration
    const existingConfig = await getSeedUserConfig(id);
    if (!existingConfig) {
      return NextResponse.json(
        { success: false, error: 'Seed user configuration not found' },
        { status: 404 }
      );
    }
    
    // Update the configuration
    const updatedConfig = {
      ...existingConfig,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    await saveSeedUserConfig(updatedConfig);
    
    return NextResponse.json({
      success: true,
      data: updatedConfig,
      message: 'Seed user configuration updated successfully'
    });
  } catch (error) {
    console.error('Error updating seed user configuration:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update seed user configuration' },
      { status: 500 }
    );
  }
}

// DELETE - Remove seed user configuration
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Configuration ID is required' },
        { status: 400 }
      );
    }
    
    // Check if configuration exists
    const existingConfig = await getSeedUserConfig(id);
    if (!existingConfig) {
      return NextResponse.json(
        { success: false, error: 'Seed user configuration not found' },
        { status: 404 }
      );
    }
    
    // Delete the configuration
    await deleteSeedUserConfig(id);
    
    return NextResponse.json({
      success: true,
      message: 'Seed user configuration deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting seed user configuration:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete seed user configuration' },
      { status: 500 }
    );
  }
}