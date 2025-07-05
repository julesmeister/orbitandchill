/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { AdminAuditService, AuditLogFilters } from '@/db/services/adminAuditService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse filters from query parameters
    const filters: AuditLogFilters = {};
    
    // Action filter
    const actions = searchParams.get('actions');
    if (actions) {
      filters.action = actions.split(',');
    }
    
    // Entity type filter
    const entityTypes = searchParams.get('entityTypes');
    if (entityTypes) {
      filters.entityType = entityTypes.split(',');
    }
    
    // Admin user filter
    const adminUserId = searchParams.get('adminUserId');
    if (adminUserId) {
      filters.adminUserId = adminUserId;
    }
    
    // Severity filter
    const severities = searchParams.get('severities');
    if (severities) {
      filters.severity = severities.split(',');
    }
    
    // Date range filters
    const dateFrom = searchParams.get('dateFrom');
    if (dateFrom) {
      filters.dateFrom = new Date(dateFrom);
    }
    
    const dateTo = searchParams.get('dateTo');
    if (dateTo) {
      filters.dateTo = new Date(dateTo);
    }
    
    // Search filter
    const search = searchParams.get('search');
    if (search) {
      filters.search = search;
    }
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    filters.limit = Math.min(limit, 100); // Cap at 100 for performance
    filters.offset = (page - 1) * filters.limit;

    const result = await AdminAuditService.getLogs(filters);
    
    return NextResponse.json({
      success: true,
      logs: result.logs,
      pagination: {
        page,
        limit: filters.limit,
        total: result.total,
        hasMore: result.hasMore,
        totalPages: Math.ceil(result.total / filters.limit),
      },
    });
    
  } catch (error) {
    console.error('❌ Error fetching audit logs:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch audit logs',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}