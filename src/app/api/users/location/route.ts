/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/db/services/userService';

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

    // Update user's current location in database
    const updatedUser = await UserService.updateUser(userId, {
      currentLocationName: location.name,
      currentLatitude: parseFloat(location.coordinates.lat),
      currentLongitude: parseFloat(location.coordinates.lon),
      currentLocationUpdatedAt: new Date()
    });

    if (!updatedUser) {
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
    console.error('Location update error:', error);
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

    const user = await UserService.getUserById(userId);

    if (!user) {
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
    console.error('Location fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}