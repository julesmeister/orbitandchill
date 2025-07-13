import { NextRequest, NextResponse } from 'next/server';
import { 
  createInitialSeedUsers, 
  getAllSeedUserConfigs,
  getUserProfile
} from '@/db/services/seedUserService';
import { SEED_PERSONA_TEMPLATES } from '@/data/seedPersonas';

// POST - Create any missing seed users to complete all 20 personas
export async function POST() {
  try {
    // Get existing configurations
    const existingConfigs = await getAllSeedUserConfigs();
    const existingUserIds = new Set(existingConfigs.map(config => config.userId));
    
    // Find missing personas
    const missingPersonas = SEED_PERSONA_TEMPLATES.filter(persona => 
      !existingUserIds.has(persona.id)
    );
    
    console.log(`Found ${existingConfigs.length} existing personas, ${missingPersonas.length} missing personas`);
    console.log('Missing persona IDs:', missingPersonas.map(p => p.id));
    
    if (missingPersonas.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'All 20 personas are already created',
        existing: existingConfigs.length,
        created: 0,
        total: SEED_PERSONA_TEMPLATES.length
      });
    }
    
    // Force create all personas (including missing ones)
    const result = await createInitialSeedUsers();
    
    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.error || 'Failed to create missing personas'
      }, { status: 500 });
    }
    
    // Get updated count
    const updatedConfigs = await getAllSeedUserConfigs();
    const newlyCreated = updatedConfigs.length - existingConfigs.length;
    
    return NextResponse.json({
      success: true,
      message: `Successfully created ${newlyCreated} missing personas. All ${updatedConfigs.length} personas are now available.`,
      existing: existingConfigs.length,
      created: newlyCreated,
      total: updatedConfigs.length,
      missingBefore: missingPersonas.map(p => p.username)
    });
  } catch (error) {
    console.error('Error completing personas:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to complete personas: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

// GET - Check how many personas are missing
export async function GET() {
  try {
    const existingConfigs = await getAllSeedUserConfigs();
    const existingUserIds = new Set(existingConfigs.map(config => config.userId));
    
    const missingPersonas = SEED_PERSONA_TEMPLATES.filter(persona => 
      !existingUserIds.has(persona.id)
    );
    
    const existingPersonas = SEED_PERSONA_TEMPLATES.filter(persona => 
      existingUserIds.has(persona.id)
    );
    
    return NextResponse.json({
      success: true,
      total: SEED_PERSONA_TEMPLATES.length,
      existing: existingPersonas.length,
      missing: missingPersonas.length,
      existingPersonas: existingPersonas.map(p => ({ id: p.id, username: p.username })),
      missingPersonas: missingPersonas.map(p => ({ id: p.id, username: p.username })),
      isComplete: missingPersonas.length === 0
    });
  } catch (error) {
    console.error('Error checking personas status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check personas status' },
      { status: 500 }
    );
  }
}