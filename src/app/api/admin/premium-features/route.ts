import { NextRequest, NextResponse } from 'next/server';
import { PremiumFeaturesService } from '@/services/premiumFeaturesService';
import { PremiumFeaturesValidation } from '@/utils/premiumFeaturesValidation';

export async function GET() {
  try {
    const result = await PremiumFeaturesService.getAllFeatures();
    
    const statusCode = result.success ? 200 : 500;
    
    return NextResponse.json(result, { status: statusCode });
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
    // Validate request headers
    const headerValidation = PremiumFeaturesValidation.validateRequestHeaders(request);
    if (!headerValidation.isValid) {
      return NextResponse.json(
        { success: false, error: headerValidation.error },
        { status: 400 }
      );
    }

    // Parse request body
    const { data: body, error: parseError } = await PremiumFeaturesValidation.parseRequestBody(request);
    if (parseError) {
      return NextResponse.json(
        { success: false, error: parseError },
        { status: 400 }
      );
    }

    // Validate bulk update request
    const validation = PremiumFeaturesValidation.validateBulkUpdateRequest(body);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // Update features using service
    const result = await PremiumFeaturesService.bulkUpdateFeatures(validation.features!);
    
    const statusCode = result.success ? 201 : 500;
    
    return NextResponse.json(result, { status: statusCode });
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
    // Validate request headers
    const headerValidation = PremiumFeaturesValidation.validateRequestHeaders(request);
    if (!headerValidation.isValid) {
      return NextResponse.json(
        { success: false, error: headerValidation.error },
        { status: 400 }
      );
    }

    // Parse request body
    const { data: body, error: parseError } = await PremiumFeaturesValidation.parseRequestBody(request);
    if (parseError) {
      return NextResponse.json(
        { success: false, error: parseError },
        { status: 400 }
      );
    }

    // Validate update request
    const validation = PremiumFeaturesValidation.validateUpdateRequest(body);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // Update feature using service
    const result = await PremiumFeaturesService.updateFeature(validation.request!);
    
    let statusCode = 500;
    if (result.success) {
      statusCode = 200;
    } else if (result.error?.includes('not found')) {
      statusCode = 404;
    }
    
    return NextResponse.json(result, { status: statusCode });
  } catch (error) {
    console.error('Error updating feature:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}