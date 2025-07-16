import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@libsql/client/http';

// Direct database connection following API_DATABASE_PROTOCOL.md pattern
const createDirectConnection = async () => {
  const databaseUrl = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  
  if (!databaseUrl || !authToken) {
    throw new Error('Database environment variables not configured');
  }
  
  return createClient({
    url: databaseUrl,
    authToken: authToken,
  });
};

// GET /api/people - Get all people for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }
    
    const client = await createDirectConnection();
    
    // Query people for user with proper ordering (default person first)
    const result = await client.execute({
      sql: `
        SELECT * FROM people 
        WHERE user_id = ? 
        ORDER BY is_default DESC, updated_at DESC
      `,
      args: [userId]
    });
    
    console.log('API - People query result:', {
      userId,
      rowCount: result.rows.length,
      rows: result.rows
    });
    
    // Convert snake_case to camelCase for frontend
    const people = result.rows.map((row: any) => ({
      id: row.id,
      userId: row.user_id,
      name: row.name,
      relationship: row.relationship,
      birthData: {
        dateOfBirth: row.date_of_birth,
        timeOfBirth: row.time_of_birth,
        locationOfBirth: row.location_of_birth,
        coordinates: row.coordinates ? JSON.parse(row.coordinates) : null,
      },
      notes: row.notes,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      isDefault: row.is_default === 1, // SQLite boolean conversion
    }));
    
    return NextResponse.json({
      success: true,
      people,
      count: people.length
    });
    
  } catch (error) {
    console.error('API - Failed to get people:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get people',
        people: [] // Fallback for graceful degradation
      },
      { status: 500 }
    );
  }
}

// POST /api/people - Create a new person
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, name, relationship, birthData, notes, isDefault } = body;
    
    console.log('API - Creating person:', {
      userId,
      name,
      relationship,
      isDefault,
      hasBirthData: !!birthData
    });
    
    if (!userId || !name || !relationship || !birthData) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const client = await createDirectConnection();
    const now = new Date().toISOString();
    const personId = `person_${Math.random().toString(36).substring(2, 11)}${Date.now().toString(36)}`;
    
    // If this is the first person or marked as default, make it default
    if (isDefault) {
      // First, remove default flag from all user's people
      await client.execute({
        sql: 'UPDATE people SET is_default = 0 WHERE user_id = ?',
        args: [userId]
      });
    }
    
    // Insert new person
    const result = await client.execute({
      sql: `
        INSERT INTO people (
          id, user_id, name, relationship, 
          date_of_birth, time_of_birth, location_of_birth, coordinates,
          notes, is_default, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        personId,
        userId,
        name,
        relationship,
        birthData.dateOfBirth,
        birthData.timeOfBirth,
        birthData.locationOfBirth,
        JSON.stringify(birthData.coordinates),
        notes || null,
        isDefault ? 1 : 0,
        now,
        now
      ]
    });
    
    console.log('API - Person created:', {
      personId,
      insertedRowCount: result.changes,
    });
    
    // Return the created person
    const createdPerson = {
      id: personId,
      userId,
      name,
      relationship,
      birthData,
      notes,
      createdAt: now,
      updatedAt: now,
      isDefault: !!isDefault,
    };
    
    return NextResponse.json({
      success: true,
      person: createdPerson,
      message: 'Person created successfully'
    });
    
  } catch (error) {
    console.error('API - Failed to create person:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create person'
      },
      { status: 500 }
    );
  }
}

// PATCH /api/people - Update a person
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { personId, userId, updates } = body;
    
    if (!personId || !userId) {
      return NextResponse.json(
        { success: false, error: 'Person ID and User ID required' },
        { status: 400 }
      );
    }
    
    const client = await createDirectConnection();
    
    // Check if person exists and belongs to user
    const existingResult = await client.execute({
      sql: 'SELECT * FROM people WHERE id = ? AND user_id = ?',
      args: [personId, userId]
    });
    
    if (existingResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Person not found or access denied' },
        { status: 404 }
      );
    }
    
    // If setting as default, remove default from other people
    if (updates.isDefault) {
      await client.execute({
        sql: 'UPDATE people SET is_default = 0 WHERE user_id = ? AND id != ?',
        args: [userId, personId]
      });
    }
    
    // Build dynamic update query
    const updateFields = [];
    const updateValues = [];
    
    if (updates.name !== undefined) {
      updateFields.push('name = ?');
      updateValues.push(updates.name);
    }
    
    if (updates.relationship !== undefined) {
      updateFields.push('relationship = ?');
      updateValues.push(updates.relationship);
    }
    
    if (updates.birthData !== undefined) {
      updateFields.push('date_of_birth = ?', 'time_of_birth = ?', 'location_of_birth = ?', 'coordinates = ?');
      updateValues.push(
        updates.birthData.dateOfBirth,
        updates.birthData.timeOfBirth,
        updates.birthData.locationOfBirth,
        JSON.stringify(updates.birthData.coordinates)
      );
    }
    
    if (updates.notes !== undefined) {
      updateFields.push('notes = ?');
      updateValues.push(updates.notes);
    }
    
    if (updates.isDefault !== undefined) {
      updateFields.push('is_default = ?');
      updateValues.push(updates.isDefault ? 1 : 0);
    }
    
    // Always update the timestamp
    updateFields.push('updated_at = ?');
    updateValues.push(new Date().toISOString());
    
    // Add WHERE clause values
    updateValues.push(personId, userId);
    
    const updateQuery = `
      UPDATE people 
      SET ${updateFields.join(', ')} 
      WHERE id = ? AND user_id = ?
    `;
    
    await client.execute({
      sql: updateQuery,
      args: updateValues
    });
    
    return NextResponse.json({
      success: true,
      message: 'Person updated successfully'
    });
    
  } catch (error) {
    console.error('API - Failed to update person:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update person'
      },
      { status: 500 }
    );
  }
}

// DELETE /api/people - Delete a person
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const personId = searchParams.get('personId');
    const userId = searchParams.get('userId');
    
    if (!personId || !userId) {
      return NextResponse.json(
        { success: false, error: 'Person ID and User ID required' },
        { status: 400 }
      );
    }
    
    const client = await createDirectConnection();
    
    // Check if person exists and belongs to user
    const existingResult = await client.execute({
      sql: 'SELECT * FROM people WHERE id = ? AND user_id = ?',
      args: [personId, userId]
    });
    
    if (existingResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Person not found or access denied' },
        { status: 404 }
      );
    }
    
    const personToDelete = existingResult.rows[0];
    
    // Delete the person
    await client.execute({
      sql: 'DELETE FROM people WHERE id = ? AND user_id = ?',
      args: [personId, userId]
    });
    
    // If we deleted the default person, make another person default
    if (personToDelete.is_default === 1) {
      const remainingResult = await client.execute({
        sql: 'SELECT id FROM people WHERE user_id = ? ORDER BY created_at ASC LIMIT 1',
        args: [userId]
      });
      
      if (remainingResult.rows.length > 0) {
        const newDefaultId = remainingResult.rows[0].id;
        await client.execute({
          sql: 'UPDATE people SET is_default = 1 WHERE id = ?',
          args: [newDefaultId]
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Person deleted successfully'
    });
    
  } catch (error) {
    console.error('API - Failed to delete person:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete person'
      },
      { status: 500 }
    );
  }
}