/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { getAllSeedUserConfigs } from '@/db/services/seedUserService';
import { ReplyGenerationValidation } from '@/utils/replyGenerationValidation';
import { PersonalityService } from '@/services/personalityService';
import { AIProviderService } from '@/services/aiProviderService';
import { SeedUserConfig } from '@/types/replyGeneration';

// POST - Generate a single AI reply for a discussion
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate and parse request
    const validatedRequest = ReplyGenerationValidation.validateRequest(body);
    ReplyGenerationValidation.logValidationDebug(validatedRequest);
    
    // Get available seed users
    const allSeedConfigs = await getAllSeedUserConfigs();
    ReplyGenerationValidation.validateSeedConfigs(allSeedConfigs);
    
    // Filter personas and log debug info
    const seedConfigs = PersonalityService.filterActivePersonas(
      allSeedConfigs as SeedUserConfig[], 
      validatedRequest.activePersonas
    );
    
    PersonalityService.logPersonaDebugInfo(
      allSeedConfigs as SeedUserConfig[], 
      validatedRequest.activePersonas,
      seedConfigs
    );
    
    // Select user for this reply
    const selectedUser = PersonalityService.selectUser(
      seedConfigs.filter(user => user.username && user.writingStyle),
      validatedRequest.discussionData.replies,
      validatedRequest.replyIndex
    );
    
    console.log('Selected user for reply:', selectedUser.username);
    
    // Generate reply using AI provider service
    const reply = await AIProviderService.generateReply(
      validatedRequest.discussionData,
      selectedUser,
      validatedRequest.aiConfig,
      validatedRequest.selectedMood,
      validatedRequest.timingConfig
    );
    
    return NextResponse.json({
      success: true,
      data: reply,
      message: 'Successfully generated AI reply'
    });
  } catch (error) {
    console.error('Error generating reply:', error);
    
    // Determine appropriate status code
    let statusCode = 500;
    if (error instanceof Error) {
      if (error.message.includes('required') || 
          error.message.includes('Invalid') || 
          error.message.includes('not found')) {
        statusCode = 400;
      }
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to generate reply: ' + (error as Error).message },
      { status: statusCode }
    );
  }
}