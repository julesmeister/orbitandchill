/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, location } = body;

    if (!userId || !location) {
      return NextResponse.json(
        { success: false, error: 'Missing userId or location data' },
        { status: 400 }
      );
    }

    if (!location.name || !location.coordinates?.lat || !location.coordinates?.lon) {
      return NextResponse.json(
        { success: false, error: 'Invalid location data format' },
        { status: 400 }
      );
    }

    // Update user's current location in database (direct connection)
    try {
      const databaseUrl = process.env.TURSO_DATABASE_URL;
      const authToken = process.env.TURSO_AUTH_TOKEN;
      
      if (databaseUrl && authToken) {
        const { createClient } = await import('@libsql/client/http');
        const client = createClient({
          url: databaseUrl,
          authToken: authToken,
        });
        
        // Update timezone in the user preferences if provided
        if (location.timezone) {
          await client.execute({
            sql: 'UPDATE users SET timezone = ? WHERE id = ?',
            args: [location.timezone, userId]
          });
        }
        
        const result = await client.execute({
          sql: 'UPDATE users SET current_location_name = ?, current_latitude = ?, current_longitude = ?, current_location_updated_at = ? WHERE id = ?',
          args: [
            location.name,
            parseFloat(location.coordinates.lat),
            parseFloat(location.coordinates.lon),
            new Date().toISOString(),
            userId
          ]
        });
        
        if (!result.rowsAffected || result.rowsAffected === 0) {
          return NextResponse.json(
            { success: false, error: 'Failed to update user location - user may not exist' },
            { status: 500 }
          );
        }
      } else {
        return NextResponse.json(
          { success: false, error: 'Database connection not available' },
          { status: 500 }
        );
      }
    } catch (dbError) {
      console.error('[Location API] Database update error:', dbError);
      return NextResponse.json(
        { success: false, error: 'Failed to update user location' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Location updated successfully',
      location: {
        name: location.name,
        coordinates: location.coordinates,
        updatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    // console.error('Location update error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get user's current location
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Missing userId parameter' },
        { status: 400 }
      );
    }

    // Direct database connection (bypassing UserService issues)
    let user = null;
    try {
      const databaseUrl = process.env.TURSO_DATABASE_URL;
      const authToken = process.env.TURSO_AUTH_TOKEN;
      
      if (databaseUrl && authToken) {
        const { createClient } = await import('@libsql/client/http');
        const client = createClient({
          url: databaseUrl,
          authToken: authToken,
        });
        
        const result = await client.execute({
          sql: 'SELECT * FROM users WHERE id = ?',
          args: [userId]
        });
        
        if (result.rows && result.rows.length > 0) {
          const userData = result.rows[0] as any;
          user = {
            id: userData.id,
            username: userData.username,
            email: userData.email,
            currentLocationName: userData.current_location_name,
            currentLatitude: userData.current_latitude,
            currentLongitude: userData.current_longitude,
            currentLocationUpdatedAt: userData.current_location_updated_at,
            locationOfBirth: userData.location_of_birth,
            latitude: userData.latitude,
            longitude: userData.longitude,
            timezone: userData.timezone
          };
        }
      }
    } catch (dbError) {
      console.error('[Location API] Database error:', dbError);
    }

    if (!user) {
      // Log for debugging without exposing sensitive info
      console.warn(`[Location API] User not found: ${userId.substring(0, 10)}...`);
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Return current location if available
    if (user.currentLocationName && user.currentLatitude && user.currentLongitude) {
      return NextResponse.json({
        success: true,
        location: {
          name: user.currentLocationName,
          coordinates: {
            lat: user.currentLatitude.toString(),
            lon: user.currentLongitude.toString()
          },
          timezone: user.timezone,
          updatedAt: user.currentLocationUpdatedAt ? new Date(user.currentLocationUpdatedAt).toISOString() : undefined
        }
      });
    }

    // Fall back to birth location if no current location set
    if (user.locationOfBirth && user.latitude && user.longitude) {
      return NextResponse.json({
        success: true,
        location: {
          name: user.locationOfBirth,
          coordinates: {
            lat: user.latitude.toString(),
            lon: user.longitude.toString()
          },
          source: 'birth_location'
        }
      });
    }

    // No location data available
    return NextResponse.json({
      success: false,
      error: 'No location data available'
    });

  } catch (error) {
    // console.error('Location fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}