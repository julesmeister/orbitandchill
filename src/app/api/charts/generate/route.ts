/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { ChartService } from '@/db/services/chartService';
import { UserService } from '@/db/services/userService';

// Import the natal chart generation functionality
import { generateNatalChart } from '@/utils/natalChart';
import { detectStelliums } from '@/utils/stelliumDetection';

// Global type for loop detection
declare global {
  // eslint-disable-next-line no-var
  var lastChartRequest: {
    userId: string;
    timestamp: number;
  } | undefined;
}

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
    console.log('🚀 API generateChartSVG: Starting chart generation with data:', {
      name: request.subjectName,
      dateOfBirth: request.dateOfBirth,
      timeOfBirth: request.timeOfBirth,
      locationOfBirth: request.locationOfBirth,
      coordinates: request.coordinates
    });

    // Use the same chart generation logic as the frontend
    const result = await generateNatalChart({
      name: request.subjectName,
      dateOfBirth: request.dateOfBirth,
      timeOfBirth: request.timeOfBirth,
      locationOfBirth: request.locationOfBirth,
      coordinates: request.coordinates
    });

    const allPlanetNames = result.metadata?.chartData?.planets?.map(p => p.name) || [];
    const celestialPointsFound = result.metadata?.chartData?.planets?.filter(p => {
      const name = p.name?.toLowerCase() || '';
      return ['lilith', 'chiron', 'northnode', 'southnode', 'partoffortune', 'northNode', 'southNode', 'partOfFortune'].includes(name);
    }) || [];

    console.log('✅ API generateChartSVG: Chart generation completed:', {
      hasSvg: !!result.svg,
      svgLength: result.svg?.length || 0,
      hasMetadata: !!result.metadata,
      hasChartData: !!result.metadata?.chartData,
      totalPlanetsInResult: allPlanetNames.length,
      allPlanetNames: allPlanetNames,
      celestialPointsInResult: celestialPointsFound.length,
      celestialPointsFound: celestialPointsFound.map(p => ({
        name: p.name,
        originalName: p.name,
        lowerName: p.name?.toLowerCase(),
        isPlanet: p.isPlanet,
        pointType: p.pointType
      }))
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
    console.error('❌ API generateChartSVG error:', error);
    throw new Error(`Chart generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if request has body content
    const contentLength = request.headers.get('content-length');
    const contentType = request.headers.get('content-type');
    
    console.log('🔍 Chart Generation API: Request headers:', {
      contentLength,
      contentType,
      hasBody: contentLength !== '0'
    });
    
    if (!contentLength || contentLength === '0') {
      console.error('🔍 Chart Generation API: Empty request body');
      return NextResponse.json(
        { error: 'Request body is required' },
        { status: 400 }
      );
    }
    
    const body: ChartGenerationRequest = await request.json();

    // Only log if we detect potential issues or it's a fresh request
    const isLikelyLoop = global.lastChartRequest && 
      global.lastChartRequest.userId === body.userId &&
      global.lastChartRequest.timestamp > Date.now() - 5000; // Within 5 seconds
    
    if (isLikelyLoop) {
      console.warn('🔄 POTENTIAL LOOP DETECTED - Chart generation request:', {
        userId: body.userId?.slice(-8),
        coordinates: body.coordinates,
        timeSinceLastRequest: global.lastChartRequest ? Date.now() - global.lastChartRequest.timestamp : 0,
        callStack: new Error().stack?.split('\n').slice(1, 4).join('\n')
      });
    }
    
    global.lastChartRequest = {
      userId: body.userId,
      timestamp: Date.now()
    };

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
        // Track cached chart analytics (only if not in loop)
        if (!isLikelyLoop) {
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

    // Debug what's being saved to database
    console.log('💾 Saving to database with metadata:', {
      hasSvg: !!svg,
      hasMetadata: !!metadata,
      metadataKeys: metadata ? Object.keys(metadata) : null,
      hasChartDataInMetadata: !!metadata?.chartData,
      planetsCountInSaveMetadata: metadata?.chartData?.planets?.length || 0,
      celestialPointsInSaveMetadata: metadata?.chartData?.planets?.filter((p: any) => {
        const name = p.name?.toLowerCase() || '';
        return ['lilith', 'chiron', 'northnode', 'southnode', 'partoffortune', 'northNode', 'southNode', 'partOfFortune'].includes(name);
      })?.length || 0
    });

    // Save to database
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


    // Track chart generation analytics (only if not in loop)
    if (savedChart && !isLikelyLoop) {
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
        // Only log stellium detection if not in a loop
        if (!isLikelyLoop) {
          console.log('🔍 Detecting stelliums for user chart...');
        }
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
        
        if (!isLikelyLoop) {
          console.log('📊 Chart data extracted for user update:', userUpdateData);
        }
        
        // Update user profile with extracted chart data
        await UserService.updateUser(body.userId, userUpdateData);
        
        if (!isLikelyLoop) {
          console.log('✅ User chart data updated successfully');
        }
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