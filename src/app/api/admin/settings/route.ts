/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { AdminSettingsService } from '@/db/services/adminSettingsService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const keys = searchParams.get('keys')?.split(',');

    // Initialize defaults if needed
    await AdminSettingsService.initializeDefaults();

    let settings;
    if (category) {
      settings = await AdminSettingsService.getSettingsByCategory(category);
    } else {
      settings = await AdminSettingsService.getSettings({
        search: search || undefined,
        keys: keys || undefined
      });
    }

    // Also get available categories
    const categories = await AdminSettingsService.getCategories();

    return NextResponse.json({
      success: true,
      settings,
      categories
    });
  } catch (error) {
    console.error('❌ Error fetching admin settings:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch admin settings',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  let requestBody: any;
  let action = 'update';
  
  try {
    requestBody = await request.json();
    const { 
      settings, 
      action: requestAction = 'update',
      category,
      adminUsername = 'Admin User',
      adminUserId = 'admin'
    } = requestBody;
    
    action = requestAction;

    // Extract request context for audit logging
    const headers = Object.fromEntries(request.headers.entries());
    const auditContext = {
      ipAddress: headers['x-forwarded-for'] || headers['x-real-ip'] || 'unknown',
      userAgent: headers['user-agent'] || 'unknown',
      requestUrl: request.url,
      requestMethod: request.method
    };

    let result;

    switch (action) {
      case 'update':
        if (!settings || typeof settings !== 'object') {
          return NextResponse.json(
            {
              success: false,
              error: 'Settings object is required for update action'
            },
            { status: 400 }
          );
        }

        result = await AdminSettingsService.updateSettings(settings, {
          updatedBy: adminUserId,
          adminUsername,
          auditContext
        });
        break;

      case 'reset':
        await AdminSettingsService.resetToDefaults(category, {
          adminUsername,
          adminUserId,
          auditContext
        });

        // Fetch updated settings after reset
        result = category 
          ? await AdminSettingsService.getSettingsByCategory(category)
          : await AdminSettingsService.getSettings();
        break;

      case 'initialize':
        await AdminSettingsService.initializeDefaults();
        result = await AdminSettingsService.getSettings();
        break;

      default:
        return NextResponse.json(
          {
            success: false,
            error: `Unknown action: ${action}`
          },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      settings: result,
      message: `Settings ${action}d successfully`
    });
  } catch (error) {
    console.error(`❌ Error ${action || 'updating'} admin settings:`, error);
    return NextResponse.json(
      {
        success: false,
        error: `Failed to ${action || 'update'} admin settings`,
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json(
        {
          success: false,
          error: 'Setting key is required'
        },
        { status: 400 }
      );
    }

    // Extract request context for audit logging
    const headers = Object.fromEntries(request.headers.entries());
    const auditContext = {
      ipAddress: headers['x-forwarded-for'] || headers['x-real-ip'] || 'unknown',
      userAgent: headers['user-agent'] || 'unknown',
      requestUrl: request.url,
      requestMethod: request.method
    };

    const deleted = await AdminSettingsService.deleteSetting(key, {
      adminUsername: 'Admin User',
      adminUserId: 'admin',
      auditContext
    });

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: 'Setting not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Setting deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting admin setting:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete admin setting',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}