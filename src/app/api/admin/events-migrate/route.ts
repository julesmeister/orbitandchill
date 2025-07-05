import { NextRequest, NextResponse } from 'next/server';
import { executePooledQuery } from '@/db/connectionPool';
import { createAdminRoute, type AdminAuthContext } from '@/middleware/adminAuth';

async function handleMigration(request: NextRequest, context: AdminAuthContext) {
  try {

    // Check if timing_method column exists
    try {
      await executePooledQuery('SELECT timing_method FROM astrological_events LIMIT 1');
      return NextResponse.json({
        success: true,
        message: 'timing_method column already exists'
      });
    } catch (error) {
      // Column doesn't exist, add it
    }

    // Add timing_method column
    const addTimingMethodQuery = `
      ALTER TABLE astrological_events 
      ADD COLUMN timing_method TEXT DEFAULT 'electional'
    `;

    await executePooledQuery(addTimingMethodQuery);

    // Update existing records to have electional as default
    const updateExistingQuery = `
      UPDATE astrological_events 
      SET timing_method = 'electional' 
      WHERE timing_method IS NULL
    `;

    await executePooledQuery(updateExistingQuery);

    // Check if planets_involved column exists
    try {
      await executePooledQuery('SELECT planets_involved FROM astrological_events LIMIT 1');
    } catch (error) {
      // Column doesn't exist, add it
      
      const addPlanetsQuery = `
        ALTER TABLE astrological_events 
        ADD COLUMN planets_involved TEXT
      `;

      await executePooledQuery(addPlanetsQuery);
    }

    return NextResponse.json({
      success: true,
      message: 'Database migration completed successfully',
      details: [
        'Added timing_method column with default value electional',
        'Added planets_involved column for storing planet data',
        'Updated existing records with default timing method'
      ]
    });

  } catch (error) {
    console.error('Error during migration:', error);
    return NextResponse.json({
      success: false,
      error: 'Migration failed: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}

// Export protected route
export const POST = createAdminRoute(handleMigration, 'admin.events.migrate');