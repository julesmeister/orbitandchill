/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { ChartService } from '@/db/services/chartService';
import { UserService } from '@/db/services/userService';

// Import the natal chart generation functionality
import { generateNatalChart } from '@/utils/natalChart';
import { detectStelliums } from '@/utils/stelliumDetection';

interface ChartGenerationRequest {
  userId: string;
  subjectName: string;
  dateOfBirth: string; // YYYY-MM-DD
  timeOfBirth: string; // HH:MM
  locationOfBirth: string;
  coordinates: {
    lat: string;
    lon: string;
  };
  chartType?: 'natal' | 'transit' | 'synastry' | 'composite';
  title?: string;
  description?: string;
  theme?: string;
  isPublic?: boolean;
  forceRegenerate?: boolean;
}

/**
 * Generate chart using real astronomical calculations
 */
async function generateChartSVG(request: ChartGenerationRequest): Promise<{ svg: string; metadata: any }> {
  try {
    // Use the same chart generation logic as the frontend
    const result = await generateNatalChart({
      name: request.subjectName,
      dateOfBirth: request.dateOfBirth,
      timeOfBirth: request.timeOfBirth,
      locationOfBirth: request.locationOfBirth,
      coordinates: request.coordinates
    });

    return {
      svg: result.svg,
      metadata: {
        name: request.subjectName,
        birthData: {
          dateOfBirth: request.dateOfBirth,
          timeOfBirth: request.timeOfBirth,
          locationOfBirth: request.locationOfBirth,
          coordinates: request.coordinates,
        },
        chartData: result.metadata.chartData,
        generatedAt: result.metadata.generatedAt,
        version: '1.0.0',
      }
    };
  } catch (error) {
    console.error('Error generating chart:', error);
    throw new Error(`Chart generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ChartGenerationRequest = await request.json();

    console.log('Chart generation request received:', {
      userId: !!body.userId,
      subjectName: !!body.subjectName,
      dateOfBirth: !!body.dateOfBirth,
      timeOfBirth: !!body.timeOfBirth,
      locationOfBirth: !!body.locationOfBirth,
      coordinates: !!body.coordinates,
      coordinatesDetails: body.coordinates
    });

    // Validate required fields
    if (!body.userId || !body.subjectName || !body.dateOfBirth || !body.timeOfBirth || !body.locationOfBirth || !body.coordinates) {
      console.error('Validation failed - missing required fields:', {
        userId: !!body.userId,
        subjectName: !!body.subjectName,
        dateOfBirth: !!body.dateOfBirth,
        timeOfBirth: !!body.timeOfBirth,
        locationOfBirth: !!body.locationOfBirth,
        coordinates: !!body.coordinates
      });
      return NextResponse.json(
        { error: 'Missing required fields: userId, subjectName, dateOfBirth, timeOfBirth, locationOfBirth, coordinates' },
        { status: 400 }
      );
    }

    const { lat, lon } = body.coordinates;
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    if (isNaN(latitude) || isNaN(longitude)) {
      return NextResponse.json(
        { error: 'Invalid coordinates' },
        { status: 400 }
      );
    }

    // Check if chart already exists (unless force regenerate is true)
    if (!body.forceRegenerate) {
      const existingChart = await ChartService.findExistingChart(
        body.userId,
        body.dateOfBirth,
        body.timeOfBirth,
        latitude,
        longitude
      );

      if (existingChart) {
        // Track cached chart analytics
        try {
          await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/analytics/track`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              event: 'chart_generated',
              data: {
                chartType: body.chartType || 'natal',
                userId: body.userId,
                chartId: existingChart.id,
                title: body.title || 'Natal Chart',
                theme: body.theme || 'default',
                cached: true,
                source: 'api_cache'
              }
            })
          });
        } catch (analyticsError) {
          console.debug('Analytics tracking failed (non-critical):', analyticsError);
        }

        return NextResponse.json({
          success: true,
          chart: existingChart,
          cached: true,
        });
      }
    }

    // Generate the chart SVG and metadata
    const { svg, metadata } = await generateChartSVG(body);

    // Validate that we have valid chart data before attempting to save
    if (!svg || svg.length === 0) {
      console.error('Chart generation failed: Empty SVG returned');
      return NextResponse.json(
        { error: 'Chart generation failed: No SVG content generated' },
        { status: 500 }
      );
    }

    if (!svg.includes('<svg')) {
      console.error('Chart generation failed: Invalid SVG format');
      return NextResponse.json(
        { error: 'Chart generation failed: Invalid SVG format' },
        { status: 500 }
      );
    }

    // Save to database
    console.log('Saving chart to database...');
    const savedChart = await ChartService.createChart({
      userId: body.userId,
      subjectName: body.subjectName,
      dateOfBirth: body.dateOfBirth,
      timeOfBirth: body.timeOfBirth,
      locationOfBirth: body.locationOfBirth,
      latitude,
      longitude,
      chartType: body.chartType || 'natal',
      title: body.title,
      description: body.description,
      theme: body.theme,
      isPublic: body.isPublic || false,
      chartData: svg,
      metadata,
    });

    console.log('Chart saved:', !!savedChart, savedChart?.id);

    // Track chart generation analytics
    if (savedChart) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/analytics/track`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'chart_generated',
            data: {
              chartType: body.chartType || 'natal',
              userId: body.userId,
              chartId: savedChart.id,
              title: body.title || 'Natal Chart',
              theme: body.theme || 'default',
              isPublic: body.isPublic || false,
              hasCoordinates: !!(latitude && longitude),
              source: 'api_endpoint'
            }
          })
        });
      } catch (analyticsError) {
        console.debug('Analytics tracking failed (non-critical):', analyticsError);
      }
    }

    // Update user stellium data if this is their own chart and we have chart data
    if (savedChart && metadata?.chartData) {
      try {
        console.log('Detecting stelliums for user chart...');
        const stelliumResult = detectStelliums(metadata.chartData);
        
        // Prepare user update data
        const userUpdateData: any = { hasNatalChart: true };
        
        if (stelliumResult.signStelliums.length > 0) {
          userUpdateData.stelliumSigns = stelliumResult.signStelliums;
        }
        
        if (stelliumResult.houseStelliums.length > 0) {
          userUpdateData.stelliumHouses = stelliumResult.houseStelliums;
        }
        
        if (stelliumResult.sunSign) {
          userUpdateData.sunSign = stelliumResult.sunSign;
        }
        
        if (stelliumResult.detailedStelliums && stelliumResult.detailedStelliums.length > 0) {
          userUpdateData.detailedStelliums = stelliumResult.detailedStelliums;
        }
        
        console.log('Chart data extracted for user update:', userUpdateData);
        
        // Update user profile with extracted chart data
        await UserService.updateUser(body.userId, userUpdateData);
        
        console.log('User chart data updated successfully');
      } catch (stelliumError) {
        console.error('Error detecting/updating stelliums:', stelliumError);
        // Don't fail the chart generation if stellium detection fails
      }
    }

    // If database save failed, still return the chart data for immediate use
    if (!savedChart) {
      console.warn('Database save failed, returning temporary chart data');
      return NextResponse.json({
        success: true,
        chart: {
          id: 'temp-' + Date.now(),
          userId: body.userId,
          subjectName: body.subjectName,
          dateOfBirth: body.dateOfBirth,
          timeOfBirth: body.timeOfBirth,
          locationOfBirth: body.locationOfBirth,
          latitude,
          longitude,
          chartType: body.chartType || 'natal',
          chartData: svg,
          metadata,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        cached: false,
        temporary: true, // Indicate this wasn't saved to DB
      });
    }

    return NextResponse.json({
      success: true,
      chart: savedChart,
      cached: false,
    });

  } catch (error) {
    console.error('Chart generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate chart' },
      { status: 500 }
    );
  }
}