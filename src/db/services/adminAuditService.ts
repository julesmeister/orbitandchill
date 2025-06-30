/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
// TODO: Convert to direct database connection pattern per API_DATABASE_PROTOCOL.md
// Temporary fix to resolve gte import error while maintaining current functionality
import { db, adminLogs } from '@/db/index';
import { desc, eq, and, like, inArray, gte } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { executeRawSelect, executeRawSelectOne, executeRawUpdate, executeRawDelete, RawSqlPatterns, transformDatabaseRow } from '@/db/rawSqlUtils';

export interface AdminLogEntry {
  id: string;
  adminUserId: string | null;
  adminUsername: string;
  action: 'create' | 'update' | 'delete' | 'login' | 'logout' | 'view' | 'export' | 'import' | 'seed' | 'migrate' | 'configure';
  entityType: 'user' | 'discussion' | 'reply' | 'chart' | 'event' | 'category' | 'tag' | 'premium_feature' | 'admin_setting' | 'analytics' | 'system';
  entityId?: string;
  description: string;
  details?: any;
  beforeValues?: any;
  afterValues?: any;
  ipAddress?: string;
  userAgent?: string;
  requestUrl?: string;
  requestMethod?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  tags?: string[];
  createdAt: Date;
}

export interface CreateAuditLogData {
  adminUserId?: string;
  adminUsername: string;
  action: AdminLogEntry['action'];
  entityType: AdminLogEntry['entityType'];
  entityId?: string;
  description: string;
  details?: any;
  beforeValues?: any;
  afterValues?: any;
  ipAddress?: string;
  userAgent?: string;
  requestUrl?: string;
  requestMethod?: string;
  severity?: AdminLogEntry['severity'];
  tags?: string[];
}

export interface AuditLogFilters {
  action?: string[];
  entityType?: string[];
  adminUserId?: string;
  severity?: string[];
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
  limit?: number;
  offset?: number;
}

export class AdminAuditService {
  /**
   * Create a new audit log entry
   */
  static async log(data: CreateAuditLogData): Promise<AdminLogEntry> {
    if (!db) {
      
      // Return a mock audit log entry for UI consistency
      return {
        id: `local_${Date.now()}`,
        adminUserId: data.adminUserId || null,
        adminUsername: data.adminUsername,
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        description: data.description,
        details: data.details,
        beforeValues: data.beforeValues,
        afterValues: data.afterValues,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        requestUrl: data.requestUrl,
        requestMethod: data.requestMethod,
        severity: data.severity || 'medium',
        tags: data.tags,
        createdAt: new Date()
      };
    }

    const id = nanoid(12);
    const now = new Date();

    const logEntry = await db.insert(adminLogs).values({
      id,
      adminUserId: data.adminUserId || null,
      adminUsername: data.adminUsername,
      action: data.action,
      entityType: data.entityType,
      entityId: data.entityId || null,
      description: data.description,
      details: data.details ? JSON.stringify(data.details) : null,
      beforeValues: data.beforeValues ? JSON.stringify(data.beforeValues) : null,
      afterValues: data.afterValues ? JSON.stringify(data.afterValues) : null,
      ipAddress: data.ipAddress || null,
      userAgent: data.userAgent || null,
      requestUrl: data.requestUrl || null,
      requestMethod: data.requestMethod || null,
      severity: data.severity || 'medium',
      tags: data.tags ? JSON.stringify(data.tags) : null,
      createdAt: now,
    }).returning();

    const result = logEntry[0];
    return this.transformLogEntry(result);
  }

  /**
   * Log user management actions
   */
  static async logUserAction(
    adminUsername: string,
    action: 'create' | 'update' | 'delete',
    userId: string,
    description: string,
    options: {
      adminUserId?: string;
      beforeValues?: any;
      afterValues?: any;
      requestContext?: {
        ipAddress?: string;
        userAgent?: string;
        requestUrl?: string;
        requestMethod?: string;
      };
    } = {}
  ): Promise<AdminLogEntry> {
    return this.log({
      adminUserId: options.adminUserId,
      adminUsername,
      action,
      entityType: 'user',
      entityId: userId,
      description,
      beforeValues: options.beforeValues,
      afterValues: options.afterValues,
      severity: action === 'delete' ? 'high' : 'medium',
      tags: ['user-management'],
      ...options.requestContext,
    });
  }

  /**
   * Log content management actions
   */
  static async logContentAction(
    adminUsername: string,
    action: 'create' | 'update' | 'delete',
    contentType: 'discussion' | 'reply',
    contentId: string,
    description: string,
    options: {
      adminUserId?: string;
      beforeValues?: any;
      afterValues?: any;
      requestContext?: {
        ipAddress?: string;
        userAgent?: string;
        requestUrl?: string;
        requestMethod?: string;
      };
    } = {}
  ): Promise<AdminLogEntry> {
    return this.log({
      adminUserId: options.adminUserId,
      adminUsername,
      action,
      entityType: contentType,
      entityId: contentId,
      description,
      beforeValues: options.beforeValues,
      afterValues: options.afterValues,
      severity: action === 'delete' ? 'high' : 'medium',
      tags: ['content-management'],
      ...options.requestContext,
    });
  }

  /**
   * Log system/admin settings changes
   */
  static async logSystemAction(
    adminUsername: string,
    action: 'configure' | 'seed' | 'migrate' | 'export' | 'import',
    description: string,
    options: {
      adminUserId?: string;
      entityType?: AdminLogEntry['entityType'];
      entityId?: string;
      details?: any;
      beforeValues?: any;
      afterValues?: any;
      severity?: AdminLogEntry['severity'];
      requestContext?: {
        ipAddress?: string;
        userAgent?: string;
        requestUrl?: string;
        requestMethod?: string;
      };
    } = {}
  ): Promise<AdminLogEntry> {
    return this.log({
      adminUserId: options.adminUserId,
      adminUsername,
      action,
      entityType: options.entityType || 'system',
      entityId: options.entityId,
      description,
      details: options.details,
      beforeValues: options.beforeValues,
      afterValues: options.afterValues,
      severity: options.severity || (action === 'migrate' ? 'high' : 'medium'),
      tags: ['system-management'],
      ...options.requestContext,
    });
  }

  /**
   * Log premium feature changes
   */
  static async logPremiumFeatureAction(
    adminUsername: string,
    action: 'create' | 'update' | 'delete',
    featureId: string,
    description: string,
    options: {
      adminUserId?: string;
      beforeValues?: any;
      afterValues?: any;
      requestContext?: {
        ipAddress?: string;
        userAgent?: string;
        requestUrl?: string;
        requestMethod?: string;
      };
    } = {}
  ): Promise<AdminLogEntry> {
    return this.log({
      adminUserId: options.adminUserId,
      adminUsername,
      action,
      entityType: 'premium_feature',
      entityId: featureId,
      description,
      beforeValues: options.beforeValues,
      afterValues: options.afterValues,
      severity: 'medium',
      tags: ['premium-management'],
      ...options.requestContext,
    });
  }

  /**
   * Log authentication events
   */
  static async logAuthAction(
    adminUsername: string,
    action: 'login' | 'logout',
    description: string,
    options: {
      adminUserId?: string;
      severity?: AdminLogEntry['severity'];
      requestContext?: {
        ipAddress?: string;
        userAgent?: string;
        requestUrl?: string;
        requestMethod?: string;
      };
    } = {}
  ): Promise<AdminLogEntry> {
    return this.log({
      adminUserId: options.adminUserId,
      adminUsername,
      action,
      entityType: 'system',
      description,
      severity: options.severity || 'low',
      tags: ['authentication'],
      ...options.requestContext,
    });
  }

  /**
   * Get audit logs with filtering and pagination
   */
  static async getLogs(filters: AuditLogFilters = {}): Promise<{
    logs: AdminLogEntry[];
    total: number;
    hasMore: boolean;
  }> {
    if (!db) {
      
      return { logs: [], total: 0, hasMore: false };
    }

    const limit = filters.limit || 50;
    const offset = filters.offset || 0;

    // Build where conditions
    const conditions = [];

    if (filters.action && filters.action.length > 0) {
      conditions.push(inArray(adminLogs.action, filters.action as any));
    }

    if (filters.entityType && filters.entityType.length > 0) {
      conditions.push(inArray(adminLogs.entityType, filters.entityType as any));
    }

    if (filters.adminUserId) {
      // Note: This is part of a complex Drizzle query that would need complete rewrite
      // For now, keeping this one Drizzle condition since it's less critical
      conditions.push(eq(adminLogs.adminUserId, filters.adminUserId));
    }

    if (filters.severity && filters.severity.length > 0) {
      conditions.push(inArray(adminLogs.severity, filters.severity as any));
    }

    if (filters.dateFrom) {
      conditions.push(gte(adminLogs.createdAt, filters.dateFrom));
    }

    if (filters.dateTo) {
      conditions.push(lte(adminLogs.createdAt, filters.dateTo));
    }

    if (filters.search) {
      conditions.push(like(adminLogs.description, `%${filters.search}%`));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get logs with pagination
    const logs = await db
      .select()
      .from(adminLogs)
      .where(whereClause)
      .orderBy(desc(adminLogs.createdAt))
      .limit(limit + 1) // Get one extra to check if there are more
      .offset(offset);

    const hasMore = logs.length > limit;
    const resultLogs = hasMore ? logs.slice(0, limit) : logs;

    // Get total count for pagination info
    const totalResult = await db
      .select({ count: adminLogs.id })
      .from(adminLogs)
      .where(whereClause);

    return {
      logs: resultLogs.map(this.transformLogEntry),
      total: totalResult.length,
      hasMore,
    };
  }

  /**
   * Get audit log statistics
   */
  static async getStatistics(days: number = 30): Promise<{
    totalLogs: number;
    logsByAction: Record<string, number>;
    logsByEntityType: Record<string, number>;
    logsBySeverity: Record<string, number>;
    recentActivity: AdminLogEntry[];
    topAdmins: Array<{ adminUsername: string; count: number }>;
  }> {
    if (!db) {
      
      return {
        totalLogs: 0,
        logsByAction: {},
        logsByEntityType: {},
        logsBySeverity: {},
        recentActivity: [],
        topAdmins: []
      };
    }

    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - days);

    // Get logs for the specified period
    const logs = await db
      .select()
      .from(adminLogs)
      .where(gte(adminLogs.createdAt, dateFrom))
      .orderBy(desc(adminLogs.createdAt));

    const totalLogs = logs.length;

    // Aggregate statistics
    const logsByAction: Record<string, number> = {};
    const logsByEntityType: Record<string, number> = {};
    const logsBySeverity: Record<string, number> = {};
    const adminCounts: Record<string, number> = {};

    logs.forEach((log: { action: string | number; entityType: string | number; severity: string | number; adminUsername: string | number; }) => {
      logsByAction[log.action] = (logsByAction[log.action] || 0) + 1;
      logsByEntityType[log.entityType] = (logsByEntityType[log.entityType] || 0) + 1;
      logsBySeverity[log.severity] = (logsBySeverity[log.severity] || 0) + 1;
      adminCounts[log.adminUsername] = (adminCounts[log.adminUsername] || 0) + 1;
    });

    // Get top admins by activity
    const topAdmins = Object.entries(adminCounts)
      .map(([adminUsername, count]) => ({ adminUsername, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Get recent activity (last 10 logs)
    const recentActivity = logs
      .slice(0, 10)
      .map(this.transformLogEntry);

    return {
      totalLogs,
      logsByAction,
      logsByEntityType,
      logsBySeverity,
      recentActivity,
      topAdmins,
    };
  }

  /**
   * Transform database log entry to API format
   */
  private static transformLogEntry(dbLog: any): AdminLogEntry {
    return {
      id: dbLog.id,
      adminUserId: dbLog.adminUserId,
      adminUsername: dbLog.adminUsername,
      action: dbLog.action,
      entityType: dbLog.entityType,
      entityId: dbLog.entityId,
      description: dbLog.description,
      details: dbLog.details ? JSON.parse(dbLog.details) : null,
      beforeValues: dbLog.beforeValues ? JSON.parse(dbLog.beforeValues) : null,
      afterValues: dbLog.afterValues ? JSON.parse(dbLog.afterValues) : null,
      ipAddress: dbLog.ipAddress,
      userAgent: dbLog.userAgent,
      requestUrl: dbLog.requestUrl,
      requestMethod: dbLog.requestMethod,
      severity: dbLog.severity,
      tags: dbLog.tags ? JSON.parse(dbLog.tags) : [],
      createdAt: new Date(dbLog.createdAt),
    };
  }

  /**
   * Helper method to extract request context from NextJS request
   */
  static extractRequestContext(request: Request, headers?: any): {
    ipAddress?: string;
    userAgent?: string;
    requestUrl?: string;
    requestMethod?: string;
  } {
    return {
      ipAddress: headers?.['x-forwarded-for'] || headers?.['x-real-ip'] || 'unknown',
      userAgent: headers?.['user-agent'] || 'unknown',
      requestUrl: request.url,
      requestMethod: request.method,
    };
  }
}