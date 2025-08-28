/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { db, users, accountDeletionRequests, natalCharts, discussions, discussionReplies, votes, astrologicalEvents, userActivity, adminLogs } from '@/db/index';
import { eq, and, isNull } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import * as crypto from 'crypto';
import { AuditService } from './auditService';
import { createResilientService } from '@/db/resilience';
import { executeRawSelectOne, executeRawSelect, executeRawUpdate, executeRawDelete, RawSqlPatterns, transformDatabaseRow } from '@/db/rawSqlUtils';

export interface CreateUserData {
  id?: string; // Optional ID for Google users
  username: string;
  email?: string;
  profilePictureUrl?: string;
  authProvider: 'google' | 'anonymous';
}

export interface UpdateUserData {
  username?: string;
  email?: string;
  profilePictureUrl?: string;
  preferredAvatar?: string;
  avatar?: string;
  dateOfBirth?: string;
  timeOfBirth?: string;
  locationOfBirth?: string;
  latitude?: number;
  longitude?: number;
  // Current location data
  currentLocationName?: string;
  currentLatitude?: number;
  currentLongitude?: number;
  currentLocationUpdatedAt?: Date;
  sunSign?: string;
  stelliumSigns?: string[];
  stelliumHouses?: string[];
  detailedStelliums?: Array<{
    type: 'sign' | 'house';
    sign?: string;
    house?: number;
    planets: { name: string; sign: string; house: number }[];
  }>;
  hasNatalChart?: boolean;
  showZodiacPublicly?: boolean;
  showStelliumsPublicly?: boolean;
  showBirthInfoPublicly?: boolean;
  allowDirectMessages?: boolean;
  showOnlineStatus?: boolean;
  updatedAt?: Date;
}

export interface AccountDeletionRequest {
  userId: string;
  requestedBy: string; // 'self' or admin user ID
  requestType: 'immediate' | 'scheduled' | 'grace_period';
  reason?: string;
  scheduledFor?: Date;
  gracePeriodDays?: number;
  userAgent?: string;
  ipAddress?: string;
}

export interface DeletionCleanupStatus {
  natalCharts: boolean;
  discussions: boolean;
  replies: boolean;
  votes: boolean;
  events: boolean;
  activity: boolean;
  adminLogs: boolean;
  completed: boolean;
  errors?: string[];
}

// Create resilient service instance
const resilient = createResilientService('UserService');

export class UserService {
  static async createUser(data: CreateUserData) {
    return resilient.operation(db, 'createUser', async () => {
      // Use provided ID for Google users, or generate for anonymous users
      const id = data.id || (data.authProvider === 'anonymous' 
        ? `anon_${nanoid(10)}` 
        : data.email || nanoid(12));

      const now = new Date();
      
      // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
      const dbObj = db as any;
      const client = dbObj.client;
      
      const result = await client.execute({
        sql: `INSERT INTO users (
          id, username, email, profile_picture_url, auth_provider, 
          created_at, updated_at, stellium_signs, stellium_houses, has_natal_chart,
          show_zodiac_publicly, show_stelliums_publicly, show_birth_info_publicly,
          allow_direct_messages, show_online_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          id,
          data.username,
          data.email || null,
          data.profilePictureUrl || null,
          data.authProvider,
          now.toISOString(),
          now.toISOString(),
          JSON.stringify([]),
          JSON.stringify([]),
          false,
          false,
          false,
          false,
          true,
          true
        ]
      });

      // Return the created user by fetching it
      return await this.getUserById(id);
    }, null);
  }

  static async getUserById(id: string) {
    return resilient.item(db, 'getUserById', async () => {
      // console.log('🔍 Looking for user with ID:', id);
      
      // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
      const userData = await RawSqlPatterns.findById(db, 'users', id);
      
      if (!userData) {
        // console.log('🔍 No user found with ID:', id);
        return null;
      }
      
      // console.log('🔍 User found:', userData.username);
      
      // Transform snake_case to camelCase and parse JSON fields
      const transformedUser = transformDatabaseRow(userData);
      
      const finalUser = {
        ...transformedUser,
        stelliumSigns: userData.stellium_signs ? JSON.parse(userData.stellium_signs) : [],
        stelliumHouses: userData.stellium_houses ? JSON.parse(userData.stellium_houses) : [],
        detailedStelliums: userData.detailed_stelliums ? JSON.parse(userData.detailed_stelliums) : [],
      };
      
      // Debug: Check if authProvider is being properly transformed
      console.log('🔍 DB getUserById result:', {
        originalAuthProvider: userData.auth_provider,
        transformedAuthProvider: finalUser.authProvider,
        username: finalUser.username,
        id: finalUser.id
      });
      
      return finalUser;
    });
  }

  static async getUserByEmail(email: string) {
    return resilient.item(db, 'getUserByEmail', async () => {
      // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
      const userData = await executeRawSelectOne(db, {
        table: 'users',
        conditions: [{ column: 'email', value: email }]
      });
      
      if (!userData) return null;
      
      // Transform snake_case to camelCase and parse JSON fields
      const transformedUser = transformDatabaseRow(userData);
      return {
        ...transformedUser,
        stelliumSigns: userData.stellium_signs ? JSON.parse(userData.stellium_signs) : [],
        stelliumHouses: userData.stellium_houses ? JSON.parse(userData.stellium_houses) : [],
        detailedStelliums: userData.detailed_stelliums ? JSON.parse(userData.detailed_stelliums) : [],
      };
    });
  }

  static async getUserByUsername(username: string) {
    return resilient.item(db, 'getUserByUsername', async () => {
      // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
      const userData = await executeRawSelectOne(db, {
        table: 'users',
        conditions: [{ column: 'username', value: username }]
      });
      
      if (!userData) return null;
      
      // Transform snake_case to camelCase and parse JSON fields
      const transformedUser = transformDatabaseRow(userData);
      return {
        ...transformedUser,
        stelliumSigns: userData.stellium_signs ? JSON.parse(userData.stellium_signs) : [],
        stelliumHouses: userData.stellium_houses ? JSON.parse(userData.stellium_houses) : [],
        detailedStelliums: userData.detailed_stelliums ? JSON.parse(userData.detailed_stelliums) : [],
      };
    });
  }

  static async updateUser(id: string, data: UpdateUserData) {
    return resilient.item(db, 'updateUser', async () => {
      const updateData: any = {
        ...data,
        updatedAt: new Date().toISOString(),
      };

      // Handle Date objects - convert to ISO strings
      if (data.currentLocationUpdatedAt instanceof Date) {
        updateData.currentLocationUpdatedAt = data.currentLocationUpdatedAt.toISOString();
      }
      if (data.updatedAt instanceof Date) {
        updateData.updatedAt = data.updatedAt.toISOString();
      }

      // Handle JSON fields
      if (data.stelliumSigns) {
        updateData.stelliumSigns = JSON.stringify(data.stelliumSigns);
      }
      if (data.stelliumHouses) {
        updateData.stelliumHouses = JSON.stringify(data.stelliumHouses);
      }
      if (data.detailedStelliums) {
        updateData.detailedStelliums = JSON.stringify(data.detailedStelliums);
      }

      // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
      const rowsAffected = await RawSqlPatterns.updateById(db, 'users', id, updateData);

      if (rowsAffected === 0) return null;

      // Fetch the updated user to return
      return await this.getUserById(id);
    });
  }

  static async requestAccountDeletion(request: AccountDeletionRequest): Promise<string | null> {
    return resilient.operation(db, 'requestAccountDeletion', async () => {
      const deletionId = nanoid(16);
      const confirmationToken = crypto.randomBytes(32).toString('hex');
      const now = new Date();
      
      // Calculate grace period end date
      const gracePeriodEnd = new Date(now);
      gracePeriodEnd.setDate(gracePeriodEnd.getDate() + (request.gracePeriodDays || 30));
      
      const scheduledFor = request.requestType === 'scheduled' && request.scheduledFor 
        ? request.scheduledFor 
        : (request.requestType === 'grace_period' ? gracePeriodEnd : null);
      
      await db.insert(accountDeletionRequests).values({
        id: deletionId,
        userId: request.userId,
        requestedBy: request.requestedBy,
        requestType: request.requestType,
        reason: request.reason,
        scheduledFor: scheduledFor,
        gracePeriodDays: request.gracePeriodDays || 30,
        confirmationToken,
        userAgent: request.userAgent,
        ipAddress: request.ipAddress,
        dataCleanupStatus: JSON.stringify({
          natalCharts: false,
          discussions: false,
          replies: false,
          votes: false,
          events: false,
          activity: false,
          adminLogs: false,
          completed: false
        } as DeletionCleanupStatus),
        createdAt: now,
        updatedAt: now,
      });

      // Update user to mark deletion requested
      // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
      await RawSqlPatterns.updateById(db, 'users', request.userId, {
        deletionRequestedAt: now,
        updatedAt: now,
      });

      // Log the account deletion request
      try {
        const user = await this.getUserById(request.userId);
        if (user) {
          await AuditService.logAccountDeletionRequest({
            userId: request.userId,
            username: user.username,
            requestedBy: request.requestedBy,
            requestType: request.requestType,
            reason: request.reason,
            ipAddress: request.ipAddress,
            userAgent: request.userAgent
          });
        }
      } catch (auditError) {
        console.error('Failed to log account deletion request:', auditError);
        // Don't fail the main operation if audit logging fails
      }

      return confirmationToken;
    }, null);
  }

  static async confirmAccountDeletion(confirmationToken: string): Promise<boolean> {
    if (!db) throw new Error('Database not available');
    
    // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
    const request = await executeRawSelect(db, {
      table: 'account_deletion_requests',
      conditions: [{ column: 'confirmation_token', value: confirmationToken }],
      limit: 1
    });
    
    if (request.length === 0) return false;
    const requestRecord = transformDatabaseRow(request[0]);
    
    const now = new Date();
    await executeRawUpdate(db, 'account_deletion_requests', {
      status: 'confirmed',
      confirmed_at: now,
      updated_at: now,
    }, [{ column: 'id', value: requestRecord.id }]);

    // Update user
    await executeRawUpdate(db, 'users', {
      deletion_confirmed_at: now,
      updated_at: now,
    }, [{ column: 'id', value: requestRecord.userId }]);

    // Log the confirmation
    try {
      const user = await this.getUserById(request[0].userId);
      if (user) {
        await AuditService.logAccountDeletionConfirmation({
          userId: request[0].userId,
          username: user.username,
          confirmationMethod: 'email_token'
        });
      }
    } catch (auditError) {
      console.error('Failed to log account deletion confirmation:', auditError);
      // Don't fail the main operation if audit logging fails
    }

    return true;
  }

  static async processAccountDeletion(userId: string, deletionType: 'soft' | 'hard' = 'soft'): Promise<DeletionCleanupStatus> {
    if (!db) throw new Error('Database not available');
    
    const cleanupStatus: DeletionCleanupStatus = {
      natalCharts: false,
      discussions: false,
      replies: false,
      votes: false,
      events: false,
      activity: false,
      adminLogs: false,
      completed: false,
      errors: []
    };

    try {
      // Start transaction-like cleanup process
      const now = new Date();
      
      // Update deletion request status
      await executeRawUpdate(db, 'account_deletion_requests', {
        status: 'processing',
        processed_at: now,
        updated_at: now,
      }, [{ column: 'user_id', value: userId }]);

      if (deletionType === 'hard') {
        // Hard delete: Remove all user data permanently
        
        // 1. Delete natal charts
        try {
          await executeRawDelete(db, 'natal_charts', [{ column: 'user_id', value: userId }]);
          cleanupStatus.natalCharts = true;
        } catch (error) {
          cleanupStatus.errors?.push(`Failed to delete natal charts: ${error}`);
        }

        // 2. Delete user votes
        try {
          await executeRawDelete(db, 'votes', [{ column: 'user_id', value: userId }]);
          cleanupStatus.votes = true;
        } catch (error) {
          cleanupStatus.errors?.push(`Failed to delete votes: ${error}`);
        }

        // 3. Delete astrological events
        try {
          await executeRawDelete(db, 'astrological_events', [{ column: 'user_id', value: userId }]);
          cleanupStatus.events = true;
        } catch (error) {
          cleanupStatus.errors?.push(`Failed to delete events: ${error}`);
        }

        // 4. Delete user activity (preserve admin logs for audit)
        try {
          await executeRawDelete(db, 'user_activity', [{ column: 'user_id', value: userId }]);
          cleanupStatus.activity = true;
        } catch (error) {
          cleanupStatus.errors?.push(`Failed to delete user activity: ${error}`);
        }

        // 5. Handle discussions and replies - anonymize rather than delete to preserve conversations
        try {
          await executeRawUpdate(db, 'discussions', {
            author_id: null,
            author_name: '[Deleted User]',
            updated_at: now,
          }, [{ column: 'author_id', value: userId }]);
          
          await executeRawUpdate(db, 'discussion_replies', {
            author_id: null,
            updated_at: now,
          }, [{ column: 'author_id', value: userId }]);
          
          cleanupStatus.discussions = true;
          cleanupStatus.replies = true;
        } catch (error) {
          cleanupStatus.errors?.push(`Failed to anonymize discussions/replies: ${error}`);
        }

        // 6. Anonymize admin logs (preserve for audit, but remove user reference)
        try {
          await executeRawUpdate(db, 'admin_logs', {
            admin_user_id: null,
            admin_username: '[Deleted User]',
          }, [{ column: 'admin_user_id', value: userId }]);
          cleanupStatus.adminLogs = true;
        } catch (error) {
          cleanupStatus.errors?.push(`Failed to anonymize admin logs: ${error}`);
        }

        // 7. Finally delete the user record
        await executeRawDelete(db, 'users', [{ column: 'id', value: userId }]);
        
      } else {
        // Soft delete: Mark as deleted but preserve data for recovery
        await executeRawUpdate(db, 'users', {
          is_deleted: true,
          deleted_at: now,
          deletion_type: 'soft',
          updated_at: now,
          // Clear sensitive data
          email: null,
          profile_picture_url: null,
          date_of_birth: null,
          time_of_birth: null,
          location_of_birth: null,
          latitude: null,
          longitude: null,
        }, [{ column: 'id', value: userId }]);

        // Mark cleanup as completed for soft delete (data preserved)
        cleanupStatus.natalCharts = true;
        cleanupStatus.discussions = true;
        cleanupStatus.replies = true;
        cleanupStatus.votes = true;
        cleanupStatus.events = true;
        cleanupStatus.activity = true;
        cleanupStatus.adminLogs = true;
      }

      cleanupStatus.completed = cleanupStatus.errors?.length === 0;

      // Log the account deletion execution
      try {
        const user = await this.getUserById(userId);
        if (user) {
          await AuditService.logAccountDeletionExecution({
            userId,
            username: user.username,
            deletionType,
            executedBy: 'system', // Could be parameterized to include admin ID
            cleanupStatus
          });
        }
      } catch (auditError) {
        console.error('Failed to log account deletion execution:', auditError);
        // Don't fail the main operation if audit logging fails
      }

      // Update deletion request with cleanup status
      await executeRawUpdate(db, 'account_deletion_requests', {
        status: cleanupStatus.completed ? 'completed' : 'processing',
        completed_at: cleanupStatus.completed ? now : null,
        data_cleanup_status: JSON.stringify(cleanupStatus),
        updated_at: now,
      }, [{ column: 'user_id', value: userId }]);

      return cleanupStatus;

    } catch (error) {
      cleanupStatus.errors?.push(`Critical error during deletion: ${error}`);
      cleanupStatus.completed = false;
      
      // Update deletion request with error status
      await executeRawUpdate(db, 'account_deletion_requests', {
        status: 'processing',
        data_cleanup_status: JSON.stringify(cleanupStatus),
        updated_at: new Date(),
      }, [{ column: 'user_id', value: userId }]);

      return cleanupStatus;
    }
  }

  static async cancelAccountDeletion(userId: string): Promise<boolean> {
    if (!db) throw new Error('Database not available');
    
    const now = new Date();
    
    // Update deletion request status
    const updated = await db.update(accountDeletionRequests).set({
      status: 'cancelled',
      updatedAt: now,
    }).where(
      and(
        eq(accountDeletionRequests.userId, userId),
        eq(accountDeletionRequests.status, 'pending')
      )
    ).returning();

    if (updated.length === 0) return false;

    // Clear deletion markers from user
    await executeRawUpdate(db, 'users', {
      deletion_requested_at: null,
      deletion_confirmed_at: null,
      grace_period_ends: null,
      updated_at: now,
    }, [{ column: 'id', value: userId }]);

    // Log the cancellation
    try {
      const user = await this.getUserById(userId);
      if (user) {
        await AuditService.logAccountDeletionCancellation({
          userId,
          username: user.username,
          cancelledBy: 'self' // Could be parameterized for admin cancellations
        });
      }
    } catch (auditError) {
      console.error('Failed to log account deletion cancellation:', auditError);
      // Don't fail the main operation if audit logging fails
    }

    return true;
  }

  static async getAccountDeletionStatus(userId: string) {
    if (!db) throw new Error('Database not available');
    
    const requests = await executeRawSelect(db, {
      table: 'account_deletion_requests',
      conditions: [{ column: 'user_id', value: userId }],
      orderBy: [{ column: 'created_at', direction: 'ASC' }]
    });

    return requests;
  }

  static async getActiveUsers(limit: number = 50, offset: number = 0) {
    return resilient.array(db, 'getActiveUsers', async () => {
      const activeUsers = await db.select()
        .from(users)
        .where(
          and(
            eq(users.isDeleted, false),
            isNull(users.deletedAt)
          )
        )
        .limit(limit)
        .offset(offset);
      
      return activeUsers.map((user: any) => ({
        ...user,
        stelliumSigns: user.stelliumSigns ? JSON.parse(user.stelliumSigns) : [],
        stelliumHouses: user.stelliumHouses ? JSON.parse(user.stelliumHouses) : [],
      }));
    });
  }

  // Legacy method for backward compatibility - now performs soft delete
  static async deleteUser(id: string) {
    const cleanupStatus = await this.processAccountDeletion(id, 'soft');
    return cleanupStatus.completed;
  }

  static async getAllUsers(limit: number = 50, offset: number = 0) {
    return resilient.array(db, 'getAllUsers', async () => {
      const allUsers = await db.select().from(users).limit(limit).offset(offset);
      
      return allUsers.map((user: { stelliumSigns: string; stelliumHouses: string; }) => ({
        ...user,
        stelliumSigns: user.stelliumSigns ? JSON.parse(user.stelliumSigns) : [],
        stelliumHouses: user.stelliumHouses ? JSON.parse(user.stelliumHouses) : [],
      }));
    });
  }

  static async getPublicProfile(id: string) {
    const user = await this.getUserById(id);
    
    if (!user) return null;

    // Return only public information based on privacy settings
    return {
      id: user.id,
      username: user.username,
      profilePictureUrl: user.profilePictureUrl,
      sunSign: user.showZodiacPublicly ? user.sunSign : null,
      stelliumSigns: user.showStelliumsPublicly ? user.stelliumSigns : null,
      stelliumHouses: user.showStelliumsPublicly ? user.stelliumHouses : null,
      hasNatalChart: user.hasNatalChart,
      createdAt: user.createdAt,
      authProvider: user.authProvider,
      // Birth info only if public
      locationOfBirth: user.showBirthInfoPublicly ? user.locationOfBirth : null,
      dateOfBirth: user.showBirthInfoPublicly ? user.dateOfBirth : null,
    };
  }
}