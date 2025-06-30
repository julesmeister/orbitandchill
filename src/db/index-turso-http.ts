/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
// Pure HTTP implementation for Turso without native dependencies
import * as schema from './schema';

let client: any = null;
let db: any = null;

// Import connection pool functionality (dynamic import to avoid build issues)
// import { initializeConnectionPool, getConnectionPool, executePooledQuery } from './connectionPool';

// Initialize Turso connection with HTTP-only client
async function initializeTurso() {
  try {
    // Try to load environment variables, with fallback loading
    let databaseUrl = process.env.TURSO_DATABASE_URL;
    let authToken = process.env.TURSO_AUTH_TOKEN;
    
    // If environment variables are missing, try to load them manually from .env.local
    // Only attempt this on server-side (Node.js environment)
    if (!databaseUrl || !authToken) {
      console.log('🔍 Environment variables missing, attempting manual load...');
      
      // Check if we're in a server environment (Node.js)
      if (typeof window === 'undefined' && typeof process !== 'undefined' && process.cwd) {
        try {
          const fs = await import('fs');
          const path = await import('path');
          const envPath = path.join(process.cwd(), '.env.local');
          
          if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf8');
            const envLines = envContent.split('\n');
            
            for (const line of envLines) {
              const [key, ...valueParts] = line.split('=');
              if (key && valueParts.length > 0) {
                const value = valueParts.join('=').trim();
                if (key.trim() === 'TURSO_DATABASE_URL' && !databaseUrl) {
                  databaseUrl = value;
                  console.log('✅ Loaded TURSO_DATABASE_URL from .env.local');
                }
                if (key.trim() === 'TURSO_AUTH_TOKEN' && !authToken) {
                  authToken = value;
                  console.log('✅ Loaded TURSO_AUTH_TOKEN from .env.local');
                }
              }
            }
          }
        } catch (loadError) {
          console.warn('⚠️ Could not manually load .env.local:', loadError);
        }
      } else {
        console.log('🌐 Running in browser environment, skipping .env.local file loading');
      }
    }
    
    if (!databaseUrl || !authToken) {
      console.warn('⚠️  Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN environment variables');
      console.warn('⚠️  Environment check:', {
        hasDatabaseUrl: !!databaseUrl,
        hasAuthToken: !!authToken,
        databaseUrlLength: databaseUrl ? databaseUrl.length : 0,
        authTokenLength: authToken ? authToken.length : 0,
        databaseUrlValue: databaseUrl ? databaseUrl.substring(0, 20) + '...' : 'UNDEFINED',
        authTokenValue: authToken ? authToken.substring(0, 10) + '...' : 'UNDEFINED',
        nodeEnv: process.env.NODE_ENV,
        allEnvVars: Object.keys(process.env).filter(key => key.startsWith('TURSO'))
      });
      console.warn('⚠️  Database will not be available - using fallback mode');
      return null;
    }
    
    // Use direct client approach for now (connection pool available on demand)
    const { createClient } = await import('@libsql/client/http');
    
    client = createClient({
      url: databaseUrl,
      authToken: authToken,
    });
    
    // Test connection with retry mechanism
    let retries = 3;
    while (retries > 0) {
      try {
        await client.execute('SELECT 1 as test');
        break; // Success, exit retry loop
      } catch (testError) {
        retries--;
        if (retries === 0) throw testError;
        console.warn(`⚠️ Database connection test failed, retrying... (${3 - retries}/3)`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s before retry
      }
    }
    
    return client;
  } catch (error) {
    console.error('❌ Failed to connect to Turso database after retries:', error);
    return null;
  }
}

// Create a mock db object that uses the HTTP client directly
const createMockDb = () => ({
  client, // Expose the client for raw SQL operations
  insert: (table: any) => ({
    values: (data: any) => ({
      returning: async () => {
        if (!client) throw new Error('Database not available');
        
        // Determine table name from schema
        let tableName = '';
        if (table === schema.users) tableName = 'users';
        else if (table === schema.discussions) tableName = 'discussions';
        else if (table === schema.discussionReplies) tableName = 'discussion_replies';
        else if (table === schema.votes) tableName = 'votes';
        else if (table === schema.categories) tableName = 'categories';
        else if (table === schema.tags) tableName = 'tags';
        else if (table === schema.discussionTags) tableName = 'discussion_tags';
        else if (table === schema.analyticsTraffic) tableName = 'analytics_traffic';
        else if (table === schema.analyticsEngagement) tableName = 'analytics_engagement';
        else if (table === schema.premiumFeatures) tableName = 'premium_features';
        else if (table === schema.natalCharts) tableName = 'natal_charts';
        else if (table === schema.astrologicalEvents) tableName = 'astrological_events';
        else if (table === schema.adminLogs) tableName = 'admin_logs';
        else if (table === schema.accountDeletionRequests) tableName = 'account_deletion_requests';
        else if (table === schema.notifications) tableName = 'notifications';
        else if (table === schema.notificationPreferences) tableName = 'notification_preferences';
        else if (table === schema.notificationTemplates) tableName = 'notification_templates';
        else if (table === schema.adminSettings) tableName = 'admin_settings';
        else if (table === schema.userActivity) tableName = 'user_activity';
        else if (table === schema.horaryQuestions) tableName = 'horary_questions';
        else throw new Error('Unknown table');
        
        // Build INSERT query with camelCase to snake_case conversion
        const fields = Object.keys(data);
        const placeholders = fields.map(() => '?').join(', ');
        
        // Convert camelCase to snake_case for database columns
        const camelToSnake = (str: string): string => {
          return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        };
        
        const dbFieldNames = fields.map(field => {
          // Handle special cases that don't follow standard camelCase conversion
          if (field === 'profilePictureUrl') return 'profile_picture_url';
          if (field === 'authProvider') return 'auth_provider';
          if (field === 'createdAt') return 'created_at';
          if (field === 'updatedAt') return 'updated_at';
          if (field === 'stelliumSigns') return 'stellium_signs';
          if (field === 'stelliumHouses') return 'stellium_houses';
          if (field === 'dateOfBirth') return 'date_of_birth';
          if (field === 'timeOfBirth') return 'time_of_birth';
          if (field === 'locationOfBirth') return 'location_of_birth';
          if (field === 'sunSign') return 'sun_sign';
          if (field === 'hasNatalChart') return 'has_natal_chart';
          if (field === 'showZodiacPublicly') return 'show_zodiac_publicly';
          if (field === 'showStelliumsPublicly') return 'show_stelliums_publicly';
          if (field === 'showBirthInfoPublicly') return 'show_birth_info_publicly';
          if (field === 'allowDirectMessages') return 'allow_direct_messages';
          if (field === 'showOnlineStatus') return 'show_online_status';
          // Discussion fields
          if (field === 'authorId') return 'author_id';
          if (field === 'authorName') return 'author_name';
          if (field === 'isBlogPost') return 'is_blog_post';
          if (field === 'isPublished') return 'is_published';
          if (field === 'isLocked') return 'is_locked';
          if (field === 'isPinned') return 'is_pinned';
          if (field === 'lastActivity') return 'last_activity';
          if (field === 'embeddedChart') return 'embedded_chart';
          if (field === 'embeddedVideo') return 'embedded_video';
          // Vote fields
          if (field === 'userId') return 'user_id';
          if (field === 'discussionId') return 'discussion_id';
          if (field === 'replyId') return 'reply_id';
          if (field === 'voteType') return 'vote_type';
          // Natal charts fields
          if (field === 'chartData') return 'chart_data';
          if (field === 'chartType') return 'chart_type';
          if (field === 'subjectName') return 'subject_name';
          if (field === 'isPublic') return 'is_public';
          if (field === 'shareToken') return 'share_token';
          // Astrological events fields
          if (field === 'planetaryPositions') return 'planetary_positions';
          if (field === 'isGenerated') return 'is_generated';
          if (field === 'isBookmarked') return 'is_bookmarked';
          if (field === 'timeWindow') return 'time_window';
          // Admin logs fields
          if (field === 'adminUserId') return 'admin_user_id';
          if (field === 'adminUsername') return 'admin_username';
          if (field === 'entityType') return 'entity_type';
          if (field === 'entityId') return 'entity_id';
          if (field === 'beforeValues') return 'before_values';
          if (field === 'afterValues') return 'after_values';
          if (field === 'ipAddress') return 'ip_address';
          if (field === 'userAgent') return 'user_agent';
          if (field === 'requestUrl') return 'request_url';
          if (field === 'requestMethod') return 'request_method';
          // Account deletion fields
          if (field === 'requestedBy') return 'requested_by';
          if (field === 'requestType') return 'request_type';
          if (field === 'scheduledFor') return 'scheduled_for';
          if (field === 'gracePeriodDays') return 'grace_period_days';
          if (field === 'confirmationToken') return 'confirmation_token';
          if (field === 'confirmationSentAt') return 'confirmation_sent_at';
          if (field === 'confirmedAt') return 'confirmed_at';
          if (field === 'processedAt') return 'processed_at';
          if (field === 'completedAt') return 'completed_at';
          if (field === 'dataCleanupStatus') return 'data_cleanup_status';
          if (field === 'recoveryDataPath') return 'recovery_data_path';
          return camelToSnake(field);
        });
        
        const fieldNames = dbFieldNames.join(', ');
        const values = fields.map(field => data[field]);
        
        // Handle JSON fields and data type conversion
        const processedValues = values.map((value, index) => {
          const fieldName = fields[index];
          
          // Handle null/undefined
          if (value === null || value === undefined) {
            return null;
          }
          
          // Handle Date objects - convert to timestamp
          if (value instanceof Date) {
            return Math.floor(value.getTime() / 1000); // Unix timestamp
          }
          
          // Handle boolean values - convert to integer for SQLite
          if (typeof value === 'boolean') {
            return value ? 1 : 0;
          }
          
          // Handle arrays and objects - convert to JSON string
          if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
            return JSON.stringify(value);
          }
          
          // Handle strings and numbers as-is
          return value;
        });
        
        const query = `INSERT INTO ${tableName} (${fieldNames}) VALUES (${placeholders}) RETURNING *`;
        
        // Debug logging removed for cleaner output
        
        try {
          const result = await client.execute({
            sql: query,
            args: processedValues
          });
          
          // Insert successful
          return result.rows || [data];
        } catch (error) {
          console.error('❌ Insert failed:', {
            error: error instanceof Error ? error.message : String(error),
            table: tableName,
            query,
            values: processedValues
          });
          throw error;
        }
      },
      onConflictDoNothing: () => ({
        returning: async () => {
          // For now, just return empty array on conflict
          return [];
        }
      })
    })
  }),
  
  select: (fields?: any) => ({
    from: (table: any) => {
      let tableName = '';
      if (table === schema.users) tableName = 'users';
      else if (table === schema.discussions) tableName = 'discussions';
      else if (table === schema.discussionReplies) tableName = 'discussion_replies';
      else if (table === schema.categories) tableName = 'categories';
      else if (table === schema.tags) tableName = 'tags';
      else if (table === schema.votes) tableName = 'votes';
      else if (table === schema.analyticsTraffic) tableName = 'analytics_traffic';
      else if (table === schema.analyticsEngagement) tableName = 'analytics_engagement';
      else if (table === schema.premiumFeatures) tableName = 'premium_features';
      else if (table === schema.natalCharts) tableName = 'natal_charts';
      else if (table === schema.astrologicalEvents) tableName = 'astrological_events';
      else if (table === schema.adminLogs) tableName = 'admin_logs';
      else if (table === schema.accountDeletionRequests) tableName = 'account_deletion_requests';
      else if (table === schema.notifications) tableName = 'notifications';
      else if (table === schema.notificationPreferences) tableName = 'notification_preferences';
      else if (table === schema.notificationTemplates) tableName = 'notification_templates';
      else if (table === schema.adminSettings) tableName = 'admin_settings';
      else if (table === schema.horaryQuestions) tableName = 'horary_questions';
      else tableName = 'unknown';
      
      // Query builder state
      let queryState = {
        table: tableName,
        where: '',
        whereParams: [] as any[],
        orderBy: '',
        limit: '',
        offset: ''
      };
      
      const buildQuery = () => {
        let sql = `SELECT * FROM ${queryState.table}`;
        if (queryState.where) sql += ` WHERE ${queryState.where}`;
        if (queryState.orderBy) sql += ` ORDER BY ${queryState.orderBy}`;
        if (queryState.limit) sql += ` LIMIT ${queryState.limit}`;
        if (queryState.offset) sql += ` OFFSET ${queryState.offset}`;
        return { sql, params: queryState.whereParams };
      };
      
      const executeQuery = async () => {
        if (!client) throw new Error('Database not available');
        
        try {
          const { sql, params } = buildQuery();
          
          if (!client) {
            throw new Error('Database client not available');
          }
          
          const result = params.length > 0 
            ? await client.execute({ sql, args: params })
            : await client.execute(sql);
          
          // Ensure we always return an array
          const rows = result.rows || [];
          
          // Force conversion to array if needed
          if (!Array.isArray(rows)) {
            return [];
          }
          
          // Convert snake_case database fields back to camelCase for Drizzle compatibility
          const convertedRows = rows.map(row => {
            const converted: any = {};
            for (const [key, value] of Object.entries(row)) {
              // Convert snake_case to camelCase
              const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
              converted[camelKey] = value;
            }
            return converted;
          });
          
          return convertedRows;
        } catch (error) {
          console.error('Select failed:', error);
          return [];
        }
      };
      
      return {
        where: (condition: any) => {
          // Parse WHERE condition
          try {
            if (condition && typeof condition === 'object') {
              // Handle simple eq() conditions
              if ('type' in condition && condition.type === 'eq' && 'left' in condition && 'right' in condition) {
                const fieldName = condition.left.name || condition.left;
                const value = condition.right.value !== undefined ? condition.right.value : condition.right;
                
                // Processing eq condition
                
                // Convert camelCase field name to snake_case for database
                let dbFieldName = fieldName;
                if (typeof fieldName === 'string') {
                  dbFieldName = fieldName
                    .replace('userId', 'user_id')
                    .replace('isGenerated', 'is_generated')
                    .replace('isBookmarked', 'is_bookmarked')
                    .replace('isBlogPost', 'is_blog_post')
                    .replace('isPublished', 'is_published')
                    .replace('isPinned', 'is_pinned')
                    .replace('isLocked', 'is_locked')
                    .replace('authorId', 'author_id')
                    .replace('authorName', 'author_name')
                    .replace('lastActivity', 'last_activity')
                    .replace('createdAt', 'created_at')
                    .replace('updatedAt', 'updated_at');
                }
                
                // Handle boolean values for SQLite (convert to 0/1)
                const paramValue = typeof value === 'boolean' ? (value ? 1 : 0) : value;
                
                queryState.where = `${dbFieldName} = ?`;
                queryState.whereParams.push(paramValue);
                // Simple WHERE clause set
              }
              // Handle queryChunks-based conditions (modern Drizzle structure)
              else if ('queryChunks' in condition) {
                
                // Check if this condition contains specific field references
                let hasBlogPost = false;
                let hasPublished = false;
                let hasDate = false;
                
                // Safely inspect the condition structure
                try {
                  const chunks = (condition as any).queryChunks;
                  if (Array.isArray(chunks)) {
                    for (const chunk of chunks) {
                      if (chunk && chunk.name) {
                        if (chunk.name === 'isBlogPost') hasBlogPost = true;
                        if (chunk.name === 'isPublished') hasPublished = true;
                        if (chunk.name === 'date') hasDate = true;
                      }
                      // Check nested conditions
                      if (chunk && chunk.queryChunks) {
                        for (const nestedChunk of chunk.queryChunks) {
                          if (nestedChunk && nestedChunk.name) {
                            if (nestedChunk.name === 'isBlogPost') hasBlogPost = true;
                            if (nestedChunk.name === 'isPublished') hasPublished = true;
                            if (nestedChunk.name === 'date') hasDate = true;
                          }
                        }
                      }
                    }
                  }
                } catch (e) {
                  // Silently handle chunk inspection errors
                }
                
                // Build appropriate WHERE clause
                if (hasBlogPost && hasPublished) {
                  // This is an AND condition with both isBlogPost and isPublished
                  queryState.where = 'is_blog_post = ? AND is_published = ?';
                  queryState.whereParams = [1, 1]; // Both true
                } else if (hasBlogPost) {
                  // Just isBlogPost condition
                  queryState.where = 'is_blog_post = ?';
                  queryState.whereParams = [1];
                } else if (hasPublished) {
                  // Just isPublished condition
                  queryState.where = 'is_published = ?';
                  queryState.whereParams = [1];
                } else if (hasDate) {
                  // Skip date conditions for now (they're probably analytics related)
                } else {
                  // Unknown condition structure, skip
                }
              }
            }
          } catch (error) {
            console.error('Failed to parse SELECT WHERE:', error);
            // Continue without WHERE clause rather than failing completely
          }
          
          return {
            limit: (n: number) => {
              queryState.limit = n.toString();
              return { 
                execute: executeQuery,
                then: (resolve: any, reject: any) => {
                  return executeQuery().then(resolve, reject);
                }
              };
            },
            orderBy: (order: any) => {
              // Simple ordering - assume descending by last_activity for discussions
              if (tableName === 'discussions') {
                queryState.orderBy = 'last_activity DESC';
              }
              return {
                limit: (n: number) => {
                  queryState.limit = n.toString();
                  return {
                    offset: (o: number) => {
                      queryState.offset = o.toString();
                      return { 
                        execute: executeQuery,
                        then: (resolve: any, reject: any) => {
                          return executeQuery().then(resolve, reject);
                        }
                      };
                    },
                    execute: executeQuery,
                    then: (resolve: any, reject: any) => {
                      return executeQuery().then(resolve, reject);
                    }
                  };
                },
                execute: executeQuery,
                then: (resolve: any, reject: any) => {
                  return executeQuery().then(resolve, reject);
                }
              };
            },
            execute: executeQuery,
            then: (resolve: any, reject: any) => {
              return executeQuery().then(resolve, reject);
            }
          };
        },
        orderBy: (order: any) => {
          // Simple ordering - assume descending by last_activity for discussions
          if (tableName === 'discussions') {
            queryState.orderBy = 'last_activity DESC';
          } else if (tableName === 'categories') {
            queryState.orderBy = 'sort_order ASC';
          }
          
          return {
            limit: (n: number) => {
              queryState.limit = n.toString();
              return {
                offset: (o: number) => {
                  queryState.offset = o.toString();
                  return { 
                    execute: executeQuery,
                    then: (resolve: any, reject: any) => {
                      return executeQuery().then(resolve, reject);
                    }
                  };
                },
                execute: executeQuery,
                then: (resolve: any, reject: any) => {
                  return executeQuery().then(resolve, reject);
                }
              };
            },
            execute: executeQuery,
            then: (resolve: any, reject: any) => {
              return executeQuery().then(resolve, reject);
            }
          };
        },
        limit: (n: number) => {
          queryState.limit = n.toString();
          return {
            offset: (o: number) => {
              queryState.offset = o.toString();
              // Return a promise-like object that executes the query when awaited
              return {
                execute: executeQuery,
                then: (resolve: any, reject: any) => {
                  return executeQuery().then(resolve, reject);
                }
              };
            },
            execute: executeQuery,
            // Make this awaitable too
            then: (resolve: any, reject: any) => {
              return executeQuery().then(resolve, reject);
            }
          };
        },
        execute: executeQuery,
        then: (resolve: any, reject: any) => {
          return executeQuery().then(resolve, reject);
        }
      };
    }
  }),
  
  update: (table: any) => {
    let tableName = '';
    if (table === schema.users) tableName = 'users';
    else if (table === schema.discussions) tableName = 'discussions';
    else if (table === schema.discussionReplies) tableName = 'discussion_replies';
    else if (table === schema.categories) tableName = 'categories';
    else if (table === schema.tags) tableName = 'tags';
    else if (table === schema.votes) tableName = 'votes';
    else if (table === schema.analyticsTraffic) tableName = 'analytics_traffic';
    else if (table === schema.analyticsEngagement) tableName = 'analytics_engagement';
    else if (table === schema.premiumFeatures) tableName = 'premium_features';
    else if (table === schema.natalCharts) tableName = 'natal_charts';
    else if (table === schema.astrologicalEvents) tableName = 'astrological_events';
    else if (table === schema.adminLogs) tableName = 'admin_logs';
    else if (table === schema.accountDeletionRequests) tableName = 'account_deletion_requests';
    else if (table === schema.notifications) tableName = 'notifications';
    else if (table === schema.notificationPreferences) tableName = 'notification_preferences';
    else if (table === schema.notificationTemplates) tableName = 'notification_templates';
    else if (table === schema.adminSettings) tableName = 'admin_settings';
    else if (table === schema.horaryQuestions) tableName = 'horary_questions';
    
    return {
      set: (data: any) => {
        const updates: string[] = [];
        const values: any[] = [];
        
        // Process SET clause
        for (const [key, value] of Object.entries(data)) {
          // Handle SQL expressions like sql`${discussions.upvotes} + 1`
          if (value && typeof value === 'object' && 'queryChunks' in value) {
            let sqlExpr = '';
            for (const chunk of (value as any).queryChunks) {
              if (chunk && chunk.value) {
                if (Array.isArray(chunk.value)) {
                  sqlExpr += chunk.value.join('');
                } else {
                  sqlExpr += chunk.value;
                }
              } else if (chunk && chunk.name) {
                // Convert column names in SQL expressions to snake_case
                const snakeName = chunk.name.replace(/[A-Z]/g, (letter: string) => `_${letter.toLowerCase()}`);
                sqlExpr += snakeName;
              }
            }
            // Convert camelCase key to snake_case for SQL expressions too
            const dbColumnName = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
            updates.push(`${dbColumnName} = ${sqlExpr}`);
          } else {
            // Convert camelCase to snake_case for database column names
            const dbColumnName = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
            updates.push(`${dbColumnName} = ?`);
            
            // Handle special data types
            if (value instanceof Date) {
              values.push(Math.floor(value.getTime() / 1000));
            } else if (typeof value === 'boolean') {
              values.push(value ? 1 : 0);
            } else {
              values.push(value);
            }
          }
        }
        
        return {
          where: (condition: any) => {
            let whereClause = '';
            let whereParams: any[] = [];
            
            // Parse WHERE condition
            try {
              
              if (condition && typeof condition === 'object' && 'queryChunks' in condition) {
                const chunks = (condition as any).queryChunks;
                let clause = '';
                
                for (let i = 0; i < chunks.length; i++) {
                  const chunk = chunks[i];
                  // Skip logging chunks to avoid circular reference issues
                  
                  if (chunk && chunk.value !== undefined) {
                    // Check if this is a parameter value (has encoder property)
                    if (chunk.encoder) {
                      clause += '?';
                      whereParams.push(chunk.value);
                    } else if (Array.isArray(chunk.value)) {
                      // Handle array values (like operators)
                      clause += chunk.value.join('');
                    } else if (typeof chunk.value === 'string' && chunk.value.includes('=')) {
                      // This is an operator or SQL fragment
                      clause += chunk.value;
                    } else {
                      // This might be a literal value that should be parameterized
                      clause += '?';
                      whereParams.push(chunk.value);
                    }
                  } else if (chunk && chunk.name) {
                    // This is a column name
                    clause += chunk.name;
                  } else if (chunk && typeof chunk === 'object' && chunk.brand === undefined && chunk.encoder) {
                    // Fallback parameter detection
                    clause += '?';
                    whereParams.push(chunk.value);
                  }
                }
                
                whereClause = clause;
                // WHERE clause parsed
              }
            } catch (error) {
              console.error('Failed to parse UPDATE WHERE:', error);
            }
            
            const executeUpdate = async () => {
              if (!client) throw new Error('Database not available');
              
              if (!whereClause) {
                console.error('❌ UPDATE without WHERE clause is dangerous, aborting');
                throw new Error('UPDATE requires a WHERE clause');
              }
              
              const sql = `UPDATE ${tableName} SET ${updates.join(', ')} WHERE ${whereClause}`;
              const allParams = [...values, ...whereParams];
              
              try {
                const result = await client.execute({ sql, args: allParams });
                // Update successful
                return result;
              } catch (error) {
                console.error('❌ Update failed:', error);
                throw error;
              }
            };
            
            return {
              returning: executeUpdate,
              execute: executeUpdate,
              then: (resolve: any, reject: any) => {
                return executeUpdate().then(resolve, reject);
              }
            };
          }
        };
      }
    };
  },
  
  delete: (table: any) => {
    let tableName = '';
    if (table === schema.users) tableName = 'users';
    else if (table === schema.discussions) tableName = 'discussions';
    else if (table === schema.discussionReplies) tableName = 'discussion_replies';
    else if (table === schema.categories) tableName = 'categories';
    else if (table === schema.tags) tableName = 'tags';
    else if (table === schema.votes) tableName = 'votes';
    else if (table === schema.analyticsTraffic) tableName = 'analytics_traffic';
    else if (table === schema.analyticsEngagement) tableName = 'analytics_engagement';
    else if (table === schema.premiumFeatures) tableName = 'premium_features';
    else if (table === schema.natalCharts) tableName = 'natal_charts';
    else if (table === schema.astrologicalEvents) tableName = 'astrological_events';
    else if (table === schema.adminLogs) tableName = 'admin_logs';
    else if (table === schema.accountDeletionRequests) tableName = 'account_deletion_requests';
    else if (table === schema.notifications) tableName = 'notifications';
    else if (table === schema.notificationPreferences) tableName = 'notification_preferences';
    else if (table === schema.notificationTemplates) tableName = 'notification_templates';
    else if (table === schema.horaryQuestions) tableName = 'horary_questions';
    
    return {
      where: (condition: any) => {
        let whereClause = '';
        let whereParams: any[] = [];
        
        // Parse WHERE condition
        try {
          if (condition && typeof condition === 'object' && 'queryChunks' in condition) {
            const chunks = (condition as any).queryChunks;
            let clause = '';
            
            // Parse query chunks for WHERE clause
            
            for (const chunk of chunks) {
              if (chunk && chunk.value) {
                // Handle both array and string values
                if (Array.isArray(chunk.value)) {
                  clause += chunk.value.join('');
                } else {
                  // Don't add parameter values directly to clause
                  // This should be a SQL template, not a value
                  if (typeof chunk.value === 'string' && chunk.value.includes('=')) {
                    clause += chunk.value;
                  } else {
                    // This is a parameter value, add placeholder
                    clause += '?';
                    whereParams.push(chunk.value);
                  }
                }
              } else if (chunk && chunk.name) {
                clause += chunk.name;
              } else if (chunk && typeof chunk === 'object' && chunk.brand === undefined && chunk.encoder) {
                clause += '?';
                whereParams.push(chunk.value);
              }
            }
            
            whereClause = clause;
            // WHERE clause generated successfully
          } else {
            // Fallback: try to handle simple conditions
            whereClause = 'id = ?';
            whereParams = [condition]; // This might be the actual value
          }
        } catch (error) {
          console.error('Failed to parse DELETE WHERE:', error);
          // Emergency fallback
          whereClause = '';
          whereParams = [];
        }
        
        // Safety check: ensure we have a valid WHERE clause
        if (!whereClause || whereClause.trim() === '') {
          console.error('❌ Empty WHERE clause generated - aborting delete for safety');
          throw new Error('Invalid WHERE clause - deletion aborted for safety');
        }
        
        const executeDelete = async () => {
          if (!client) throw new Error('Database not available');
          
          const sql = `DELETE FROM ${tableName} WHERE ${whereClause}`;
          
          try {
            const result = await client.execute({ sql, args: whereParams });
            return result;
          } catch (error) {
            console.error('❌ Delete failed:', error);
            throw error;
          }
        };
        
        return {
          returning: executeDelete,
          execute: executeDelete,
          then: (resolve: any, reject: any) => {
            return executeDelete().then(resolve, reject);
          }
        };
      }
    };
  }
});

// Database initialization with proper promise handling and connection pooling
let initializationPromise: Promise<any> | null = null;
let poolInitialized = false;

const ensureInitialized = async () => {
  if (!initializationPromise) {
    initializationPromise = (async () => {
      try {
        // Check if we can reuse the existing connection pool first
        if (!poolInitialized) {
          try {
            const { getConnectionPool, initializeConnectionPool } = await import('./connectionPool');
            const existingPool = getConnectionPool();
            
            if (existingPool) {
              // Pool already exists and is healthy, reuse it
              const stats = existingPool.getStats();
              if (stats && stats.totalConnections > 0) {
                client = { execute: existingPool.execute.bind(existingPool) };
                db = createMockDb();
                poolInitialized = true;
                return db;
              }
            }
            
            // Initialize new pool
            const databaseUrl = process.env.TURSO_DATABASE_URL;
            const authToken = process.env.TURSO_AUTH_TOKEN;
            
            if (databaseUrl && authToken) {
              const pool = await initializeConnectionPool(databaseUrl, authToken, {
                minConnections: 1,
                maxConnections: 3,     // Reduced from 8 to 3
                acquireTimeoutMs: 3000, // Reduced from 5s to 3s
                idleTimeoutMs: 180000,  // Reduced from 5m to 3m
                maxLifetimeMs: 900000   // Reduced from 30m to 15m
              });
              
              if (pool) {
                client = { 
                  execute: pool.execute.bind(pool),
                  close: pool.destroy.bind(pool)
                };
                db = createMockDb();
                poolInitialized = true;
                return db;
              }
            }
          } catch (poolError) {
            console.warn('⚠️ Connection pool failed, falling back to direct connection:', poolError);
          }
        }
        
        // Fallback to direct connection if pool fails
        client = await initializeTurso();
        if (client) {
          db = createMockDb();
          return db;
        } else {
          db = null;
          return null;
        }
      } catch (error) {
        console.error('❌ Database initialization failed:', error);
        db = null;
        return null;
      }
    })();
  }
  return initializationPromise;
};

// Create a database wrapper that ensures initialization
const getDatabase = async () => {
  await ensureInitialized();
  return db;
};

// Initialize immediately and add startup delay if needed
const startupInitialization = async () => {
  await ensureInitialized();
  
  // Initialize connection pool for better performance
  if (client) {
    try {
      const { initializeConnectionPool } = await import('./connectionPool');
      const databaseUrl = process.env.TURSO_DATABASE_URL;
      const authToken = process.env.TURSO_AUTH_TOKEN;
      
      if (databaseUrl && authToken) {
        await initializeConnectionPool(databaseUrl, authToken, {
          minConnections: 2,
          maxConnections: 8,
          acquireTimeoutMs: 5000,
          idleTimeoutMs: 300000, // 5 minutes
          maxLifetimeMs: 1800000  // 30 minutes
        });
      }
    } catch (poolError) {
      console.warn('⚠️ Connection pool initialization failed:', poolError);
    }
  }
  
  // Run warmup queries after initialization
  if (db) {
    try {
      await db.client.execute('SELECT 1 as startup_warmup');
    } catch (warmupError) {
      // Database warmup queries failed silently
    }
  }
};

// Only start initialization on server-side (Node.js environment)
if (typeof window === 'undefined') {
  startupInitialization();
}

// Export a getter function that ensures initialization
export function getDb() {
  // If db is already initialized, return it immediately
  if (db) return db;
  
  // If initialization is in progress, log warning but don't block
  if (initializationPromise) {
    console.warn('⚠️ Database still initializing, returning null');
    return null;
  }
  
  // Start initialization if not started yet
  console.warn('⚠️ Database not initialized, starting initialization');
  ensureInitialized();
  return null;
}

// Export async version that waits for initialization
export async function getDbAsync() {
  await ensureInitialized();
  return db;
}

// Export the db variable directly - it will be null until initialized
export { db, getDatabase };

// Export initialization function
export async function initializeDatabase() {
  if (!client) {
    client = await initializeTurso();
    if (client) {
      db = createMockDb();
      
      // Try to create tables if they don't exist
      await createTablesIfNeeded();
    }
  }
  
  if (client && db) {
    // Turso database ready
    return { client, db };
  } else {
    console.log('⚠️  Database not available, using fallback mode');
    return { client: null, db: null };
  }
}

// Create tables if they don't exist
async function createTablesIfNeeded() {
  if (!client) return;
  
  try {
    // Check if tables exist
    
    // Check if critical tables exist
    const discussionsResult = await client.execute('SELECT name FROM sqlite_master WHERE type="table" AND name="discussions"');
    const repliesResult = await client.execute('SELECT name FROM sqlite_master WHERE type="table" AND name="discussion_replies"');
    const eventsResult = await client.execute('SELECT name FROM sqlite_master WHERE type="table" AND name="astrological_events"');
    const horaryResult = await client.execute('SELECT name FROM sqlite_master WHERE type="table" AND name="horary_questions"');
    
    if (discussionsResult.rows.length === 0 || repliesResult.rows.length === 0 || eventsResult.rows.length === 0 || horaryResult.rows.length === 0) {
      console.log('📋 Creating/recreating database schema...');
      
      // Create basic tables for now
      await client.execute(`
        CREATE TABLE IF NOT EXISTS discussions (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          excerpt TEXT NOT NULL,
          content TEXT NOT NULL,
          author_id TEXT,
          author_name TEXT NOT NULL,
          category TEXT NOT NULL,
          tags TEXT,
          embedded_chart TEXT,
          embedded_video TEXT,
          replies INTEGER DEFAULT 0,
          views INTEGER DEFAULT 0,
          upvotes INTEGER DEFAULT 0,
          downvotes INTEGER DEFAULT 0,
          is_locked INTEGER DEFAULT 0,
          is_pinned INTEGER DEFAULT 0,
          is_blog_post INTEGER DEFAULT 0,
          is_published INTEGER DEFAULT 1,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL,
          last_activity INTEGER NOT NULL
        )
      `);
      
      await client.execute(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          username TEXT NOT NULL,
          email TEXT,
          profile_picture_url TEXT,
          auth_provider TEXT NOT NULL,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL,
          date_of_birth TEXT,
          time_of_birth TEXT,
          location_of_birth TEXT,
          latitude REAL,
          longitude REAL,
          sun_sign TEXT,
          stellium_signs TEXT,
          stellium_houses TEXT,
          has_natal_chart INTEGER DEFAULT 0,
          show_zodiac_publicly INTEGER DEFAULT 0,
          show_stelliums_publicly INTEGER DEFAULT 0,
          show_birth_info_publicly INTEGER DEFAULT 0,
          allow_direct_messages INTEGER DEFAULT 1,
          show_online_status INTEGER DEFAULT 1,
          is_deleted INTEGER DEFAULT 0,
          deleted_at INTEGER,
          deletion_type TEXT,
          deletion_reason TEXT,
          deletion_requested_at INTEGER,
          deletion_confirmed_at INTEGER,
          grace_period_ends INTEGER,
          deleted_by TEXT
        )
      `);
      
      await client.execute(`
        CREATE TABLE IF NOT EXISTS categories (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL UNIQUE,
          description TEXT,
          sort_order INTEGER DEFAULT 0,
          discussion_count INTEGER DEFAULT 0,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        )
      `);
      
      await client.execute(`
        CREATE TABLE IF NOT EXISTS tags (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL UNIQUE,
          description TEXT,
          usage_count INTEGER DEFAULT 0,
          is_popular INTEGER DEFAULT 0,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        )
      `);
      
      await client.execute(`
        CREATE TABLE IF NOT EXISTS discussion_replies (
          id TEXT PRIMARY KEY,
          discussion_id TEXT NOT NULL,
          author_id TEXT,
          content TEXT NOT NULL,
          parent_reply_id TEXT,
          upvotes INTEGER DEFAULT 0,
          downvotes INTEGER DEFAULT 0,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL,
          FOREIGN KEY (discussion_id) REFERENCES discussions(id) ON DELETE CASCADE,
          FOREIGN KEY (parent_reply_id) REFERENCES discussion_replies(id) ON DELETE CASCADE
        )
      `);
      
      await client.execute(`
        CREATE TABLE IF NOT EXISTS votes (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          discussion_id TEXT,
          reply_id TEXT,
          vote_type TEXT NOT NULL CHECK (vote_type IN ('up', 'down')),
          created_at INTEGER NOT NULL,
          FOREIGN KEY (discussion_id) REFERENCES discussions(id) ON DELETE CASCADE,
          FOREIGN KEY (reply_id) REFERENCES discussion_replies(id) ON DELETE CASCADE
        )
      `);
      
      // Analytics tables for admin dashboard
      await client.execute(`
        CREATE TABLE IF NOT EXISTS analytics_traffic (
          id TEXT PRIMARY KEY,
          date TEXT NOT NULL,
          visitors INTEGER DEFAULT 0,
          page_views INTEGER DEFAULT 0,
          charts_generated INTEGER DEFAULT 0,
          new_users INTEGER DEFAULT 0,
          returning_users INTEGER DEFAULT 0,
          avg_session_duration INTEGER DEFAULT 0,
          bounce_rate REAL DEFAULT 0,
          top_pages TEXT,
          traffic_sources TEXT,
          created_at INTEGER NOT NULL
        )
      `);
      
      await client.execute(`
        CREATE TABLE IF NOT EXISTS analytics_engagement (
          id TEXT PRIMARY KEY,
          date TEXT NOT NULL,
          discussions_created INTEGER DEFAULT 0,
          replies_posted INTEGER DEFAULT 0,
          charts_generated INTEGER DEFAULT 0,
          active_users INTEGER DEFAULT 0,
          popular_discussions TEXT,
          top_contributors TEXT,
          created_at INTEGER NOT NULL
        )
      `);
      
      await client.execute(`
        CREATE TABLE IF NOT EXISTS natal_charts (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          chart_data TEXT NOT NULL,
          metadata TEXT NOT NULL,
          chart_type TEXT NOT NULL CHECK (chart_type IN ('natal', 'transit', 'synastry', 'composite')),
          subject_name TEXT NOT NULL,
          date_of_birth TEXT NOT NULL,
          time_of_birth TEXT NOT NULL,
          location_of_birth TEXT NOT NULL,
          latitude REAL NOT NULL,
          longitude REAL NOT NULL,
          title TEXT,
          description TEXT,
          theme TEXT DEFAULT 'default',
          is_public INTEGER DEFAULT 0,
          share_token TEXT,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `);
      
      await client.execute(`
        CREATE TABLE IF NOT EXISTS premium_features (
          id TEXT PRIMARY KEY,
          feature_id TEXT NOT NULL UNIQUE,
          name TEXT NOT NULL,
          description TEXT,
          category TEXT NOT NULL,
          is_enabled INTEGER DEFAULT 1,
          is_premium INTEGER DEFAULT 0,
          component TEXT,
          section TEXT,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        )
      `);
      
      await client.execute(`
        CREATE TABLE IF NOT EXISTS astrological_events (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          title TEXT NOT NULL,
          date TEXT NOT NULL,
          time TEXT,
          type TEXT NOT NULL CHECK (type IN ('benefic', 'challenging', 'neutral')),
          description TEXT NOT NULL,
          aspects TEXT NOT NULL,
          planetary_positions TEXT NOT NULL,
          score INTEGER NOT NULL DEFAULT 5,
          is_generated INTEGER NOT NULL DEFAULT 0,
          priorities TEXT,
          chart_data TEXT,
          is_bookmarked INTEGER NOT NULL DEFAULT 0,
          time_window TEXT,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `);
      
      await client.execute(`
        CREATE TABLE IF NOT EXISTS admin_logs (
          id TEXT PRIMARY KEY,
          admin_user_id TEXT,
          admin_username TEXT NOT NULL,
          action TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete', 'login', 'logout', 'view', 'export', 'import', 'seed', 'migrate', 'configure')),
          entity_type TEXT NOT NULL CHECK (entity_type IN ('user', 'discussion', 'reply', 'chart', 'event', 'category', 'tag', 'premium_feature', 'admin_setting', 'analytics', 'system')),
          entity_id TEXT,
          description TEXT NOT NULL,
          details TEXT,
          before_values TEXT,
          after_values TEXT,
          ip_address TEXT,
          user_agent TEXT,
          request_url TEXT,
          request_method TEXT,
          severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
          tags TEXT,
          created_at INTEGER NOT NULL,
          FOREIGN KEY (admin_user_id) REFERENCES users(id) ON DELETE SET NULL
        )
      `);
      
      await client.execute(`
        CREATE TABLE IF NOT EXISTS account_deletion_requests (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          requested_by TEXT NOT NULL,
          request_type TEXT NOT NULL CHECK (request_type IN ('immediate', 'scheduled', 'grace_period')),
          reason TEXT,
          scheduled_for INTEGER,
          grace_period_days INTEGER DEFAULT 30,
          status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'completed', 'cancelled')),
          confirmation_token TEXT,
          confirmation_sent_at INTEGER,
          confirmed_at INTEGER,
          processed_at INTEGER,
          completed_at INTEGER,
          data_cleanup_status TEXT,
          recovery_data_path TEXT,
          user_agent TEXT,
          ip_address TEXT,
          notes TEXT,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `);
      
      await client.execute(`
        CREATE TABLE IF NOT EXISTS horary_questions (
          id TEXT PRIMARY KEY,
          user_id TEXT,
          question TEXT NOT NULL,
          date INTEGER NOT NULL,
          location TEXT,
          latitude REAL,
          longitude REAL,
          timezone TEXT,
          answer TEXT,
          timing TEXT,
          interpretation TEXT,
          chart_data TEXT,
          chart_svg TEXT,
          ascendant_degree REAL,
          moon_sign TEXT,
          moon_void_of_course INTEGER,
          planetary_hour TEXT,
          is_radical INTEGER,
          chart_warnings TEXT,
          category TEXT,
          tags TEXT,
          is_shared INTEGER DEFAULT 0,
          share_token TEXT,
          aspect_count INTEGER,
          retrograde_count INTEGER,
          significator_planet TEXT,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `);
      
      console.log('✅ All tables (including analytics, charts, premium features, astrological events, audit logs, account deletion, and horary questions) created successfully');
    } else {
      // Some tables exist, checking astrological_events specifically
      
      // Force create astrological_events table if it doesn't exist
      if (eventsResult.rows.length === 0) {
        console.log('🔧 Creating missing astrological_events table...');
        await client.execute(`
          CREATE TABLE IF NOT EXISTS astrological_events (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            title TEXT NOT NULL,
            date TEXT NOT NULL,
            time TEXT,
            type TEXT NOT NULL CHECK (type IN ('benefic', 'challenging', 'neutral')),
            description TEXT NOT NULL,
            aspects TEXT NOT NULL,
            planetary_positions TEXT NOT NULL,
            score INTEGER NOT NULL DEFAULT 5,
            is_generated INTEGER NOT NULL DEFAULT 0,
            priorities TEXT,
            chart_data TEXT,
            is_bookmarked INTEGER NOT NULL DEFAULT 0,
            time_window TEXT,
            created_at INTEGER NOT NULL,
            updated_at INTEGER NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
          )
        `);
        // astrological_events table created successfully
      } else {
        // astrological_events table already exists
      }
      
      // Force create horary_questions table if it doesn't exist
      if (horaryResult.rows.length === 0) {
        console.log('🔧 Creating missing horary_questions table...');
        await client.execute(`
          CREATE TABLE IF NOT EXISTS horary_questions (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            question TEXT NOT NULL,
            date INTEGER NOT NULL,
            location TEXT,
            latitude REAL,
            longitude REAL,
            timezone TEXT,
            answer TEXT,
            timing TEXT,
            interpretation TEXT,
            chart_data TEXT,
            chart_svg TEXT,
            ascendant_degree REAL,
            moon_sign TEXT,
            moon_void_of_course INTEGER,
            planetary_hour TEXT,
            is_radical INTEGER,
            chart_warnings TEXT,
            category TEXT,
            tags TEXT,
            is_shared INTEGER DEFAULT 0,
            share_token TEXT,
            aspect_count INTEGER,
            retrograde_count INTEGER,
            significator_planet TEXT,
            created_at INTEGER NOT NULL,
            updated_at INTEGER NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
          )
        `);
        console.log('✅ horary_questions table created successfully');
      } else {
        console.log('✅ horary_questions table already exists');
      }
    }
  } catch (error) {
    console.error('❌ Failed to create tables:', error);
  }
}

// Export schema
export * from './schema';

// Connection Pool convenience functions
export function getPoolStats() {
  try {
    const poolModule = require('./connectionPool');
    const pool = poolModule.getConnectionPool();
    return pool ? pool.getStats() : null;
  } catch (error) {
    return null;
  }
}

export async function executePooledQueryDirect(sql: string, args?: any[]) {
  try {
    const { executePooledQuery } = await import('./connectionPool');
    return await executePooledQuery(sql, args);
  } catch (error) {
    console.error('❌ Pooled query failed:', error);
    throw error;
  }
}

export function isUsingConnectionPool() {
  return client && client.pool !== undefined;
}

export function getConnectionPoolInstance() {
  try {
    const poolModule = require('./connectionPool');
    return poolModule.getConnectionPool();
  } catch (error) {
    return null;
  }
}

// Enable connection pool at runtime
export async function enableConnectionPool() {
  if (isUsingConnectionPool()) {
    console.log('Connection pool already enabled');
    return true;
  }

  try {
    const databaseUrl = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    if (!databaseUrl || !authToken) {
      throw new Error('Missing database credentials');
    }

    console.log('🔄 Enabling connection pool at runtime...');
    const { initializeConnectionPool, executePooledQuery } = await import('./connectionPool');
    
    const pool = await initializeConnectionPool(databaseUrl, authToken, {
      minConnections: 1,
      maxConnections: 3,
      acquireTimeoutMs: 5000,
      idleTimeoutMs: 60000,
      maxLifetimeMs: 600000,
      retryAttempts: 2
    });

    // Test the pool
    await executePooledQuery('SELECT 1 as test');
    console.log('✅ Connection pool enabled successfully');

    // Replace the client with a pooled version
    const oldClient = client;
    client = {
      execute: (query: any) => {
        if (typeof query === 'string') {
          return executePooledQuery(query);
        } else if (query && typeof query === 'object' && query.sql) {
          return executePooledQuery(query.sql, query.args);
        }
        throw new Error('Invalid query format');
      },
      pool // Expose pool for advanced operations
    };

    // Close old client if it has a close method
    if (oldClient && typeof oldClient.close === 'function') {
      try {
        oldClient.close();
      } catch (error) {
        console.warn('Error closing old client:', error);
      }
    }

    return true;
  } catch (error) {
    console.error('❌ Failed to enable connection pool:', error);
    return false;
  }
}

// Close function
export function closeDatabase() {
  if (client) {
    // If using connection pool, destroy it
    if (client.pool) {
      import('./connectionPool').then(({ destroyConnectionPool }) => {
        destroyConnectionPool().catch(error => {
          console.warn('Error destroying connection pool:', error);
        });
      });
    } else if (client.close) {
      client.close();
    }
    client = null;
    db = null;
  }
}