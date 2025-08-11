/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextResponse } from 'next/server';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string;
  [key: string]: any;
}

export interface CacheHeaders {
  'Cache-Control': string;
  'ETag'?: string;
  'Last-Modified'?: string;
  'Vary'?: string;
  'Link'?: string;
}

/**
 * HTTP Response Utilities for Discussion APIs
 * Standardizes response formats and caching strategies
 */
export class HttpResponseUtils {
  /**
   * Create success response with optimized caching headers
   */
  static success<T>(
    data: T,
    headers: Partial<CacheHeaders> = {},
    status: number = 200
  ): NextResponse {
    const response = {
      success: true,
      ...data
    };

    return NextResponse.json(response, {
      status,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    });
  }

  /**
   * Create error response with appropriate headers
   */
  static error(
    error: string,
    details?: string,
    status: number = 500,
    additionalData: Record<string, any> = {}
  ): NextResponse {
    const response: ApiResponse = {
      success: false,
      error,
      ...(details && { details }),
      ...additionalData
    };

    return NextResponse.json(response, {
      status,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store' // Don't cache error responses
      }
    });
  }

  /**
   * Create validation error response
   */
  static validationError(
    error: string,
    details?: string
  ): NextResponse {
    return this.error(error, details, 400);
  }

  /**
   * Create not found error response
   */
  static notFound(
    resource: string = 'Resource'
  ): NextResponse {
    return this.error(`${resource} not found`, undefined, 404);
  }

  /**
   * Generate standard cache headers for discussion replies
   */
  static generateReplyCacheHeaders(
    discussionId: string,
    offset: number,
    limit: number,
    options: {
      maxAge?: number;
      sMaxAge?: number;
      staleWhileRevalidate?: number;
    } = {}
  ): CacheHeaders {
    const {
      maxAge = 60,
      sMaxAge = 300,
      staleWhileRevalidate = 900
    } = options;

    const timestamp = Math.floor(Date.now() / 60000); // Changes every minute
    
    return {
      'Cache-Control': `public, max-age=${maxAge}, s-maxage=${sMaxAge}, stale-while-revalidate=${staleWhileRevalidate}`,
      'ETag': `"replies-${discussionId}-${offset}-${limit}-${timestamp}"`,
      'Last-Modified': new Date().toUTCString(),
      'Vary': 'Accept-Encoding'
    };
  }

  /**
   * Generate cache headers for empty responses
   */
  static generateEmptyCacheHeaders(
    resource: string,
    maxAge: number = 300
  ): CacheHeaders {
    return {
      'Cache-Control': `public, max-age=${maxAge}, s-maxage=${maxAge * 2}`,
      'ETag': `"empty-${resource}-${Math.floor(Date.now() / (maxAge * 1000))}"` // Update every cache period
    };
  }

  /**
   * Generate pagination link headers
   */
  static generatePaginationLinks(
    baseUrl: string,
    offset: number,
    limit: number,
    hasMore: boolean,
    hasPrev: boolean = true
  ): string {
    const links: string[] = [];

    if (hasPrev && offset > 0) {
      const prevOffset = Math.max(0, offset - limit);
      links.push(`<${baseUrl}?offset=${prevOffset}&limit=${limit}>; rel="prev"`);
    }

    if (hasMore) {
      const nextOffset = offset + limit;
      links.push(`<${baseUrl}?offset=${nextOffset}&limit=${limit}>; rel="next"`);
    }

    return links.join(', ');
  }

  /**
   * Create reply fetch response with optimized headers
   */
  static repliesFetchResponse(
    replies: any[],
    total: number,
    pagination: any,
    discussionId: string
  ): NextResponse {
    const cacheHeaders = this.generateReplyCacheHeaders(
      discussionId,
      pagination.offset,
      pagination.limit
    );

    // Add pagination links
    if (pagination.offset > 0 || pagination.hasMore) {
      const baseUrl = `/api/discussions/${discussionId}/replies`;
      cacheHeaders.Link = this.generatePaginationLinks(
        baseUrl,
        pagination.offset,
        pagination.limit,
        pagination.hasMore,
        pagination.offset > 0
      );
    }

    return this.success(
      {
        replies,
        total,
        pagination
      },
      cacheHeaders
    );
  }

  /**
   * Create empty replies response
   */
  static emptyRepliesResponse(
    discussionId: string,
    limit: number,
    offset: number
  ): NextResponse {
    const cacheHeaders = this.generateEmptyCacheHeaders(
      `replies-${discussionId}`,
      300 // Cache empty results for 5 minutes
    );

    return this.success(
      {
        replies: [],
        total: 0,
        pagination: {
          limit,
          offset,
          hasMore: false
        }
      },
      cacheHeaders
    );
  }

  /**
   * Create reply creation response
   */
  static replyCreatedResponse(reply: any): NextResponse {
    return this.success(
      { reply },
      {
        'Cache-Control': 'no-store' // Don't cache creation responses
      },
      201
    );
  }

  /**
   * Parse and validate pagination parameters
   */
  static parsePaginationParams(url: URL): { limit: number; offset: number } {
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '50')));
    const offset = Math.max(0, parseInt(url.searchParams.get('offset') || '0'));

    return { limit, offset };
  }

  /**
   * Validate required request parameters
   */
  static validateRequiredParams(params: Record<string, any>): string | null {
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null || value === '') {
        return `${key} is required`;
      }
    }
    return null;
  }
}