import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase } from '@/db/index';

interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  category: 'chart' | 'interpretation' | 'sharing' | 'analysis';
  isEnabled: boolean;
  isPremium: boolean;
  component?: string;
  section?: string;
  sortOrder?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface DatabaseRow {
  id: string;
  name: string;
  description: string;
  category: string;
  is_enabled: number | boolean;
  is_premium: number | boolean;
  component?: string;
  section?: string;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

export async function GET() {
  try {
    const { client } = await initializeDatabase();
    
    if (!client) {
      console.error('❌ Premium Features API: Database not available');
      return NextResponse.json(
        { success: false, error: 'Database not available' },
        { status: 500 }
      );
    }

    // First check if table exists
    const tableCheck = await client.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='premium_features'
    `);
    
    if (tableCheck.rows.length === 0) {
      console.warn('⚠️ Premium Features API: Table not found');
      return NextResponse.json({
        success: true,
        features: [],
        message: 'Premium features table not found. Run migrations to create it.'
      });
    }
    
    // Get all features using raw SQL
    const result = await client.execute(`
      SELECT * FROM premium_features ORDER BY sort_order ASC
    `);

    // Convert database format to API format
    const features: PremiumFeature[] = result.rows.map((row: DatabaseRow) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      category: row.category as 'chart' | 'interpretation' | 'sharing' | 'analysis',
      isEnabled: Boolean(row.is_enabled),
      isPremium: Boolean(row.is_premium),
      component: row.component,
      section: row.section,
      sortOrder: row.sort_order,
      createdAt: row.created_at ? new Date(row.created_at) : undefined,
      updatedAt: row.updated_at ? new Date(row.updated_at) : undefined
    }));
    
    return NextResponse.json({
      success: true,
      features
    });
  } catch (error) {
    console.error('❌ Premium Features API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get premium features' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check content length
    const contentLength = request.headers.get('content-length');
    if (!contentLength || contentLength === '0') {
      return NextResponse.json(
        { success: false, error: 'Request body is required' },
        { status: 400 }
      );
    }

    // Validate content type
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { success: false, error: 'Content-Type must be application/json' },
        { status: 400 }
      );
    }

    // Safe JSON parsing
    let body;
    try {
      body = await request.json();
    } catch (jsonError) {
      console.error('JSON parsing error:', jsonError);
      return NextResponse.json(
        { success: false, error: 'Invalid JSON format' },
        { status: 400 }
      );
    }

    const { features } = body;

    if (!Array.isArray(features)) {
      return NextResponse.json(
        { success: false, error: 'Features must be an array' },
        { status: 400 }
      );
    }

    // Validate each feature
    for (const feature of features) {
      if (!feature.id || !feature.name || !feature.category) {
        return NextResponse.json(
          { success: false, error: 'Each feature must have id, name, and category' },
          { status: 400 }
        );
      }
    }

    // Update features in database using raw SQL
    const { client } = await initializeDatabase();
    
    if (!client) {
      return NextResponse.json(
        { success: false, error: 'Database not available' },
        { status: 500 }
      );
    }

    // Delete all existing features
    await client.execute('DELETE FROM premium_features');

    // Insert all new features
    const now = Math.floor(Date.now() / 1000);
    
    for (const feature of features) {
      await client.execute({
        sql: `INSERT INTO premium_features (id, name, description, category, is_enabled, is_premium, component, section, sort_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          feature.id,
          feature.name,
          feature.description,
          feature.category,
          feature.isEnabled ? 1 : 0,
          feature.isPremium ? 1 : 0,
          feature.component || null,
          feature.section || null,
          feature.sortOrder || 0,
          now,
          now
        ]
      });
    }

    // Get updated features
    const result = await client.execute(`
      SELECT * FROM premium_features ORDER BY sort_order ASC
    `);

    const updatedFeatures: PremiumFeature[] = result.rows.map((row: DatabaseRow) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      category: row.category as 'chart' | 'interpretation' | 'sharing' | 'analysis',
      isEnabled: Boolean(row.is_enabled),
      isPremium: Boolean(row.is_premium),
      component: row.component,
      section: row.section,
      sortOrder: row.sort_order,
      createdAt: row.created_at ? new Date(row.created_at) : undefined,
      updatedAt: row.updated_at ? new Date(row.updated_at) : undefined
    }));

    return NextResponse.json({
      success: true,
      message: 'Premium features updated successfully',
      features: updatedFeatures
    });
  } catch (error) {
    console.error('Error updating premium features:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Check content length
    const contentLength = request.headers.get('content-length');
    if (!contentLength || contentLength === '0') {
      return NextResponse.json(
        { success: false, error: 'Request body is required' },
        { status: 400 }
      );
    }

    // Validate content type
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { success: false, error: 'Content-Type must be application/json' },
        { status: 400 }
      );
    }

    // Safe JSON parsing
    let body;
    try {
      body = await request.json();
    } catch (jsonError) {
      console.error('JSON parsing error:', jsonError);
      return NextResponse.json(
        { success: false, error: 'Invalid JSON format' },
        { status: 400 }
      );
    }

    const { featureId, updates } = body;

    if (!featureId) {
      return NextResponse.json(
        { success: false, error: 'Feature ID is required' },
        { status: 400 }
      );
    }

    if (!updates || typeof updates !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Updates object is required' },
        { status: 400 }
      );
    }

    // Update the feature in database using raw SQL
    const { client } = await initializeDatabase();
    
    if (!client) {
      return NextResponse.json(
        { success: false, error: 'Database not available' },
        { status: 500 }
      );
    }

    // Build update query
    const updateFields = [];
    const updateValues = [];
    
    for (const [key, value] of Object.entries(updates)) {
      let dbKey = key;
      
      // Convert camelCase to snake_case
      if (key === 'isEnabled') dbKey = 'is_enabled';
      else if (key === 'isPremium') dbKey = 'is_premium';
      else if (key === 'sortOrder') dbKey = 'sort_order';
      else if (key === 'updatedAt') dbKey = 'updated_at';
      
      updateFields.push(`${dbKey} = ?`);
      
      // Convert values for SQLite
      if (typeof value === 'boolean') {
        updateValues.push(value ? 1 : 0);
      } else if (value instanceof Date) {
        updateValues.push(Math.floor(value.getTime() / 1000));
      } else {
        updateValues.push(value);
      }
    }
    
    // Add updated_at timestamp
    updateFields.push('updated_at = ?');
    updateValues.push(Math.floor(Date.now() / 1000));
    
    // Add featureId to end of values array
    updateValues.push(featureId);
    
    const updateQuery = `UPDATE premium_features SET ${updateFields.join(', ')} WHERE id = ?`;
    
    // Execute update
    const updateResult = await client.execute({
      sql: updateQuery,
      args: updateValues
    });
    
    // Get the updated feature
    const selectResult = await client.execute({
      sql: 'SELECT * FROM premium_features WHERE id = ?',
      args: [featureId]
    });
    
    if (selectResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Feature not found' },
        { status: 404 }
      );
    }
    
    const row = selectResult.rows[0];
    const updatedFeature: PremiumFeature = {
      id: row.id,
      name: row.name,
      description: row.description,
      category: row.category,
      isEnabled: Boolean(row.is_enabled),
      isPremium: Boolean(row.is_premium),
      component: row.component,
      section: row.section,
      sortOrder: row.sort_order,
      createdAt: new Date(row.created_at * 1000),
      updatedAt: new Date(row.updated_at * 1000)
    };

    return NextResponse.json({
      success: true,
      message: 'Feature updated successfully',
      feature: updatedFeature
    });
  } catch (error) {
    console.error('Error updating feature:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}