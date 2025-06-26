/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getDb, adminSettings } from '@/db/index';
import { eq, inArray, like } from 'drizzle-orm';
import { executeRawSelect, executeRawSelectOne, executeRawUpdate, executeRawDelete, RawSqlPatterns, transformDatabaseRow } from '@/db/rawSqlUtils';
import { AdminAuditService } from './adminAuditService';
import { BRAND } from '../../config/brand';

export interface AdminSetting {
  key: string;
  value: string;
  type: 'string' | 'number' | 'boolean' | 'json';
  category: string;
  description?: string;
  isRequired?: boolean;
  defaultValue?: any;
  updatedAt: Date;
  updatedBy?: string;
}

export interface CreateAdminSettingData {
  key: string;
  value: any;
  type: AdminSetting['type'];
  category: string;
  description?: string;
  isRequired?: boolean;
  defaultValue?: any;
  updatedBy?: string;
}

export interface UpdateAdminSettingData {
  value?: any;
  description?: string;
  updatedBy?: string;
}

export interface AdminSettingsFilters {
  category?: string;
  search?: string;
  keys?: string[];
}

export class AdminSettingsService {
  /**
   * Default settings schema with predefined settings
   */
  static readonly DEFAULT_SETTINGS: Record<string, Omit<AdminSetting, 'updatedAt' | 'updatedBy'>> = {
    // SEO Settings
    'seo.site_title': {
      key: 'seo.site_title',
      value: `${BRAND.name} - Astrology & Natal Charts`,
      type: 'string',
      category: 'seo',
      description: 'Main site title used in meta tags',
      isRequired: true,
      defaultValue: `${BRAND.name} - Astrology & Natal Charts`
    },
    'seo.meta_description': {
      key: 'seo.meta_description',
      value: 'Professional astrology services, natal chart readings, and celestial insights. Discover your cosmic blueprint with our expert astrologers.',
      type: 'string',
      category: 'seo',
      description: 'Default meta description for pages',
      isRequired: true,
      defaultValue: 'Professional astrology services, natal chart readings, and celestial insights.'
    },
    'seo.meta_keywords': {
      key: 'seo.meta_keywords',
      value: 'astrology, natal charts, horoscope, zodiac, celestial, planetary positions',
      type: 'string',
      category: 'seo',
      description: 'Default meta keywords (comma-separated)',
      isRequired: false,
      defaultValue: 'astrology, natal charts, horoscope, zodiac'
    },
    'seo.og_image_url': {
      key: 'seo.og_image_url',
      value: '/images/og-image.jpg',
      type: 'string',
      category: 'seo',
      description: 'Open Graph image URL for social sharing',
      isRequired: false,
      defaultValue: '/images/og-image.jpg'
    },

    // Analytics Settings
    'analytics.google_analytics_id': {
      key: 'analytics.google_analytics_id',
      value: '',
      type: 'string',
      category: 'analytics',
      description: 'Google Analytics tracking ID (GA4)',
      isRequired: false,
      defaultValue: ''
    },
    'analytics.google_tag_manager_id': {
      key: 'analytics.google_tag_manager_id',
      value: '',
      type: 'string',
      category: 'analytics',
      description: 'Google Tag Manager container ID',
      isRequired: false,
      defaultValue: ''
    },
    'analytics.tracking_enabled': {
      key: 'analytics.tracking_enabled',
      value: 'true',
      type: 'boolean',
      category: 'analytics',
      description: 'Enable/disable analytics tracking',
      isRequired: true,
      defaultValue: true
    },
    'analytics.cookie_consent_required': {
      key: 'analytics.cookie_consent_required',
      value: 'true',
      type: 'boolean',
      category: 'analytics',
      description: 'Require cookie consent before tracking',
      isRequired: true,
      defaultValue: true
    },

    // General App Settings
    'general.maintenance_mode': {
      key: 'general.maintenance_mode',
      value: 'false',
      type: 'boolean',
      category: 'general',
      description: 'Enable maintenance mode (shows maintenance page)',
      isRequired: true,
      defaultValue: false
    },
    'general.registration_enabled': {
      key: 'general.registration_enabled',
      value: 'true',
      type: 'boolean',
      category: 'general',
      description: 'Allow new user registrations',
      isRequired: true,
      defaultValue: true
    },
    'general.contact_email': {
      key: 'general.contact_email',
      value: 'contact@luckstrology.com',
      type: 'string',
      category: 'general',
      description: 'Main contact email address',
      isRequired: true,
      defaultValue: 'contact@luckstrology.com'
    },
    'general.max_charts_per_user': {
      key: 'general.max_charts_per_user',
      value: '10',
      type: 'number',
      category: 'general',
      description: 'Maximum number of charts per user (0 = unlimited)',
      isRequired: true,
      defaultValue: 10
    },
    'general.featured_categories': {
      key: 'general.featured_categories',
      value: '["Natal Chart Analysis", "Transits & Predictions", "Synastry & Compatibility"]',
      type: 'json',
      category: 'general',
      description: 'Featured discussion categories for homepage',
      isRequired: false,
      defaultValue: ["Natal Chart Analysis", "Transits & Predictions", "Synastry & Compatibility"]
    },

    // Email Settings
    'email.smtp_host': {
      key: 'email.smtp_host',
      value: '',
      type: 'string',
      category: 'email',
      description: 'SMTP server hostname',
      isRequired: false,
      defaultValue: ''
    },
    'email.smtp_port': {
      key: 'email.smtp_port',
      value: '587',
      type: 'number',
      category: 'email',
      description: 'SMTP server port',
      isRequired: false,
      defaultValue: 587
    },
    'email.smtp_secure': {
      key: 'email.smtp_secure',
      value: 'true',
      type: 'boolean',
      category: 'email',
      description: 'Use TLS/SSL for SMTP connection',
      isRequired: false,
      defaultValue: true
    },
    'email.smtp_username': {
      key: 'email.smtp_username',
      value: '',
      type: 'string',
      category: 'email',
      description: 'SMTP authentication username',
      isRequired: false,
      defaultValue: ''
    },
    'email.smtp_password': {
      key: 'email.smtp_password',
      value: '',
      type: 'string',
      category: 'email',
      description: 'SMTP authentication password (encrypted)',
      isRequired: false,
      defaultValue: ''
    },
    'email.from_email': {
      key: 'email.from_email',
      value: 'noreply@luckstrology.com',
      type: 'string',
      category: 'email',
      description: 'Default "from" email address',
      isRequired: false,
      defaultValue: 'noreply@luckstrology.com'
    },
    'email.from_name': {
      key: 'email.from_name',
      value: BRAND.name,
      type: 'string',
      category: 'email',
      description: 'Default "from" name',
      isRequired: false,
      defaultValue: BRAND.name
    },
    'email.notifications_enabled': {
      key: 'email.notifications_enabled',
      value: 'true',
      type: 'boolean',
      category: 'email',
      description: 'Enable email notifications',
      isRequired: true,
      defaultValue: true
    },

    // Security Settings
    'security.session_timeout': {
      key: 'security.session_timeout',
      value: '3600',
      type: 'number',
      category: 'security',
      description: 'Session timeout in seconds (0 = no timeout)',
      isRequired: true,
      defaultValue: 3600
    },
    'security.rate_limit_requests': {
      key: 'security.rate_limit_requests',
      value: '100',
      type: 'number',
      category: 'security',
      description: 'Rate limit: requests per window',
      isRequired: true,
      defaultValue: 100
    },
    'security.rate_limit_window': {
      key: 'security.rate_limit_window',
      value: '60',
      type: 'number',
      category: 'security',
      description: 'Rate limit: window in seconds',
      isRequired: true,
      defaultValue: 60
    },
    'security.password_min_length': {
      key: 'security.password_min_length',
      value: '8',
      type: 'number',
      category: 'security',
      description: 'Minimum password length for user accounts',
      isRequired: true,
      defaultValue: 8
    },
    'security.require_email_verification': {
      key: 'security.require_email_verification',
      value: 'false',
      type: 'boolean',
      category: 'security',
      description: 'Require email verification for new accounts',
      isRequired: true,
      defaultValue: false
    },

    // Newsletter Settings
    'newsletter.enabled': {
      key: 'newsletter.enabled',
      value: 'true',
      type: 'boolean',
      category: 'newsletter',
      description: 'Enable/disable newsletter signup section in footer',
      isRequired: true,
      defaultValue: true
    },
    'newsletter.title': {
      key: 'newsletter.title',
      value: 'Stay Connected to the Cosmos',
      type: 'string',
      category: 'newsletter',
      description: 'Newsletter section title text',
      isRequired: false,
      defaultValue: 'Stay Connected to the Cosmos'
    },
    'newsletter.description': {
      key: 'newsletter.description',
      value: 'Get weekly astrology insights, new feature updates, and cosmic wisdom delivered to your inbox.',
      type: 'string',
      category: 'newsletter',
      description: 'Newsletter section description text',
      isRequired: false,
      defaultValue: 'Get weekly astrology insights, new feature updates, and cosmic wisdom delivered to your inbox.'
    },
    'newsletter.placeholder_text': {
      key: 'newsletter.placeholder_text',
      value: 'Enter your email',
      type: 'string',
      category: 'newsletter',
      description: 'Email input placeholder text',
      isRequired: false,
      defaultValue: 'Enter your email'
    },
    'newsletter.button_text': {
      key: 'newsletter.button_text',
      value: 'Subscribe',
      type: 'string',
      category: 'newsletter',
      description: 'Subscribe button text',
      isRequired: false,
      defaultValue: 'Subscribe'
    },
    'newsletter.privacy_text': {
      key: 'newsletter.privacy_text',
      value: 'No spam, unsubscribe anytime. We respect your cosmic privacy.',
      type: 'string',
      category: 'newsletter',
      description: 'Privacy disclaimer text below signup form',
      isRequired: false,
      defaultValue: 'No spam, unsubscribe anytime. We respect your cosmic privacy.'
    },
    'newsletter.background_color': {
      key: 'newsletter.background_color',
      value: '#f0e3ff',
      type: 'string',
      category: 'newsletter',
      description: 'Background color for newsletter section (hex color)',
      isRequired: false,
      defaultValue: '#f0e3ff'
    },
    'newsletter.mailchimp_api_key': {
      key: 'newsletter.mailchimp_api_key',
      value: '',
      type: 'string',
      category: 'newsletter',
      description: 'Mailchimp API key for newsletter subscriptions',
      isRequired: false,
      defaultValue: ''
    },
    'newsletter.mailchimp_list_id': {
      key: 'newsletter.mailchimp_list_id',
      value: '',
      type: 'string',
      category: 'newsletter',
      description: 'Mailchimp audience/list ID for subscriptions',
      isRequired: false,
      defaultValue: ''
    }
  };

  /**
   * Initialize default settings in database
   */
  static async initializeDefaults(): Promise<void> {
    const db = getDb();
    if (!db) {
      
      return;
    }

    console.log('🔧 Initializing default admin settings...');

    try {
      // Get existing settings
      const existingSettings = await db.select().from(adminSettings);
      const existingKeys = new Set(existingSettings.map((s: { key: any; }) => s.key));

      // Insert missing default settings
      const missingSettings = Object.entries(AdminSettingsService.DEFAULT_SETTINGS)
        .filter(([key]) => !existingKeys.has(key))
        .map(([, setting]) => ({
          key: setting.key,
          value: this.serializeValue(setting.value, setting.type),
          type: setting.type,
          category: setting.category,
          description: setting.description || null,
          updatedAt: new Date(),
          updatedBy: 'system'
        }));

      if (missingSettings.length > 0) {
        await db.insert(adminSettings).values(missingSettings);
        console.log(`✅ Initialized ${missingSettings.length} default admin settings`);
      } else {
        console.log('✅ All default admin settings already exist');
      }
    } catch (error) {
      console.error('❌ Failed to initialize default admin settings:', error);
      throw error;
    }
  }

  /**
   * Get all settings, optionally filtered
   */
  static async getSettings(filters: AdminSettingsFilters = {}): Promise<AdminSetting[]> {
    const db = getDb();
    if (!db) {
      
      // Return default settings transformed to proper format
      return Object.values(AdminSettingsService.DEFAULT_SETTINGS).map(setting => ({
        ...setting,
        updatedAt: new Date(),
        updatedBy: 'system'
      }));
    }

    // Build where conditions
    const conditions = [];

    // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
    const rawConditions = [];
    
    if (filters.category) {
      rawConditions.push({ column: 'category', value: filters.category });
    }
    
    if (filters.keys && filters.keys.length > 0) {
      // For array conditions, we need to use a different approach
      const keyConditions = filters.keys.map(key => `key = '${key}'`).join(' OR ');
      if (keyConditions) {
        // Handle this as a custom condition
        const settings = await executeRawSelect(db, {
          table: 'admin_settings',
          customWhere: `(${keyConditions})${filters.category ? ` AND category = '${filters.category}'` : ''}${filters.search ? ` AND key LIKE '%${filters.search}%'` : ''}`
        });
        return settings.map(s => this.transformSetting(transformDatabaseRow(s)));
      }
    }
    
    if (filters.search) {
      rawConditions.push({ column: 'key', value: `%${filters.search}%`, operator: 'LIKE' });
    }
    
    const settings = await executeRawSelect(db, {
      table: 'admin_settings',
      conditions: rawConditions
    });

    return settings.map(s => this.transformSetting(transformDatabaseRow(s)));
  }

  /**
   * Get settings by category
   */
  static async getSettingsByCategory(category: string): Promise<AdminSetting[]> {
    return this.getSettings({ category });
  }

  /**
   * Get a single setting by key
   */
  static async getSetting(key: string): Promise<AdminSetting | null> {
    const db = getDb();
    if (!db) {
      
      const defaultSetting = AdminSettingsService.DEFAULT_SETTINGS[key];
      if (!defaultSetting) return null;
      return {
        ...defaultSetting,
        updatedAt: new Date(),
        updatedBy: 'system'
      };
    }

    try {
      // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
      console.log(`🔍 getSetting: Looking for setting with key: ${key}`);
      
      const result = await executeRawSelectOne(db, {
        table: 'admin_settings',
        conditions: [{ column: 'key', value: key }]
      });
      
      console.log(`🔍 getSetting: Raw result for ${key}:`, result);

      if (!result) {
        console.log(`🔍 getSetting: No result found for key: ${key}`);
        return null;
      }

      const transformed = transformDatabaseRow(result);
      console.log(`🔍 getSetting: Transformed result for ${key}:`, transformed);
      
      const setting = this.transformSetting(transformed);
      console.log(`🔍 getSetting: Final setting for ${key}:`, setting);
      
      return setting;
      
    } catch (error) {
      console.error(`❌ getSetting: Error retrieving setting ${key}:`, error);
      return null;
    }
  }

  /**
   * Get setting value by key with type conversion
   */
  static async getSettingValue<T = any>(key: string): Promise<T | null> {
    const setting = await this.getSetting(key);
    if (!setting) return null;

    return this.deserializeValue(setting.value, setting.type) as T;
  }

  /**
   * Create or update a setting
   */
  static async setSetting(
    key: string,
    value: any,
    options: {
      type?: AdminSetting['type'];
      category?: string;
      description?: string;
      updatedBy?: string;
      adminUsername?: string;
      auditContext?: {
        ipAddress?: string;
        userAgent?: string;
        requestUrl?: string;
        requestMethod?: string;
      };
    } = {}
  ): Promise<AdminSetting> {
    const db = getDb();
    if (!db) {
      
      const defaultSetting = AdminSettingsService.DEFAULT_SETTINGS[key];
      return {
        key,
        value: this.serializeValue(value, options.type || 'string'),
        type: options.type || defaultSetting?.type || 'string',
        category: options.category || defaultSetting?.category || 'general',
        description: options.description || defaultSetting?.description,
        isRequired: defaultSetting?.isRequired || false,
        defaultValue: defaultSetting?.defaultValue,
        updatedAt: new Date(),
        updatedBy: options.updatedBy || 'system'
      };
    }

    const existingSetting = await this.getSetting(key);
    const serializedValue = this.serializeValue(value, options.type || 'string');

    let result: AdminSetting;

    if (existingSetting) {
      // Update existing setting
      const beforeValues = { ...existingSetting };
      
      // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
      await executeRawUpdate(db, 'admin_settings', {
        value: serializedValue,
        description: options.description || existingSetting.description,
        updated_at: new Date(),
        updated_by: options.updatedBy || null
      }, [{ column: 'key', value: key }]);

      // Fetch the updated setting since .returning() might not work consistently
      const updatedSetting = await this.getSetting(key);
      if (!updatedSetting) {
        throw new Error(`Failed to update setting: ${key}`);
      }
      
      result = updatedSetting;

      // Log audit trail
      if (options.adminUsername) {
        try {
          await AdminAuditService.logSystemAction(
            options.adminUsername,
            'configure',
            `Updated admin setting: ${key}`,
            {
              adminUserId: options.updatedBy,
              entityType: 'admin_setting',
              entityId: key,
              beforeValues,
              afterValues: result,
              severity: 'medium',
              requestContext: options.auditContext
            }
          );
        } catch (auditError) {
          console.warn('Failed to log audit trail for setting update:', auditError);
        }
      }
    } else {
      // Create new setting
      const newSetting = {
        key,
        value: serializedValue,
        type: options.type || 'string',
        category: options.category || 'general',
        description: options.description || null,
        updatedAt: new Date(),
        updatedBy: options.updatedBy || null // Use null for system updates
      };

      // BYPASS DRIZZLE ORM - Use raw SQL for consistency
      const dbObj = db as any;
      const client = dbObj?.client;
      
      if (!client) {
        throw new Error('Database client not available');
      }

      await client.execute({
        sql: `INSERT INTO admin_settings (key, value, type, category, description, updated_at, updated_by) 
              VALUES (?, ?, ?, ?, ?, ?, ?)`,
        args: [
          newSetting.key,
          newSetting.value,
          newSetting.type,
          newSetting.category,
          newSetting.description,
          newSetting.updatedAt.toISOString(),
          newSetting.updatedBy
        ]
      });

      // Fetch the created setting since .returning() might not work consistently
      console.log(`🔍 Attempting to verify created setting: ${key}`);
      const createdSetting = await this.getSetting(key);
      if (!createdSetting) {
        console.error(`❌ Failed to retrieve setting after creation: ${key}`);
        console.log(`🔧 Attempting direct database query for verification...`);
        
        // Try a direct verification query
        try {
          const verifyResult = await client.execute({
            sql: 'SELECT * FROM admin_settings WHERE key = ?',
            args: [key]
          });
          console.log(`🔍 Direct query result:`, verifyResult.rows);
        } catch (verifyError) {
          console.error(`❌ Direct verification failed:`, verifyError);
        }
        
        throw new Error(`Failed to create setting: ${key}. Setting may not have been inserted or retrieval failed.`);
      } else {
        console.log(`✅ Successfully created and verified setting: ${key}`);
      }
      
      result = createdSetting;

      // Log audit trail
      if (options.adminUsername) {
        try {
          await AdminAuditService.logSystemAction(
            options.adminUsername,
            'configure',
            `Created admin setting: ${key}`,
            {
              adminUserId: options.updatedBy,
              entityType: 'admin_setting',
              entityId: key,
              afterValues: result,
              severity: 'medium',
              requestContext: options.auditContext
            }
          );
        } catch (auditError) {
          console.warn('Failed to log audit trail for setting creation:', auditError);
        }
      }
    }

    return result;
  }

  /**
   * Update multiple settings at once
   */
  static async updateSettings(
    settings: Record<string, any>,
    options: {
      updatedBy?: string;
      adminUsername?: string;
      auditContext?: {
        ipAddress?: string;
        userAgent?: string;
        requestUrl?: string;
        requestMethod?: string;
      };
    } = {}
  ): Promise<AdminSetting[]> {
    const results: AdminSetting[] = [];

    for (const [key, value] of Object.entries(settings)) {
      // Get default setting info if available
      const defaultSetting = AdminSettingsService.DEFAULT_SETTINGS[key];
      
      const result = await this.setSetting(key, value, {
        type: defaultSetting?.type,
        category: defaultSetting?.category,
        description: defaultSetting?.description,
        updatedBy: options.updatedBy,
        adminUsername: options.adminUsername,
        auditContext: options.auditContext
      });

      results.push(result);
    }

    return results;
  }

  /**
   * Delete a setting
   */
  static async deleteSetting(
    key: string,
    options: {
      adminUsername?: string;
      adminUserId?: string;
      auditContext?: {
        ipAddress?: string;
        userAgent?: string;
        requestUrl?: string;
        requestMethod?: string;
      };
    } = {}
  ): Promise<boolean> {
    const db = getDb();
    if (!db) {
      
      return false;
    }

    const existingSetting = await this.getSetting(key);
    if (!existingSetting) return false;

    // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
    await executeRawDelete(db, 'admin_settings', [{ column: 'key', value: key }]);

    // Log audit trail
    if (options.adminUsername) {
      try {
        await AdminAuditService.logSystemAction(
          options.adminUsername,
          'configure',
          `Deleted admin setting: ${key}`,
          {
            adminUserId: options.adminUserId,
            entityType: 'admin_setting',
            entityId: key,
            beforeValues: existingSetting,
            severity: 'high',
            requestContext: options.auditContext
          }
        );
      } catch (auditError) {
        console.warn('Failed to log audit trail for setting deletion:', auditError);
      }
    }

    return true;
  }

  /**
   * Get all available categories
   */
  static async getCategories(): Promise<Array<{ category: string; count: number }>> {
    const db = getDb();
    if (!db) {
      
      // Return categories from default settings
      const categoryCount: Record<string, number> = {};
      Object.values(AdminSettingsService.DEFAULT_SETTINGS).forEach(setting => {
        categoryCount[setting.category] = (categoryCount[setting.category] || 0) + 1;
      });
      return Object.entries(categoryCount)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => a.category.localeCompare(b.category));
    }

    const result = await db
      .select({
        category: adminSettings.category,
      })
      .from(adminSettings);

    // Group by category and count
    const categoryCount: Record<string, number> = {};
    result.forEach((row: { category: string | number; }) => {
      categoryCount[row.category] = (categoryCount[row.category] || 0) + 1;
    });

    return Object.entries(categoryCount)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => a.category.localeCompare(b.category));
  }

  /**
   * Reset settings to defaults
   */
  static async resetToDefaults(
    category?: string,
    options: {
      adminUsername?: string;
      adminUserId?: string;
      auditContext?: {
        ipAddress?: string;
        userAgent?: string;
        requestUrl?: string;
        requestMethod?: string;
      };
    } = {}
  ): Promise<void> {
    const db = getDb();
    if (!db) {
      
      return;
    }

    const defaultsToReset = category
      ? Object.entries(AdminSettingsService.DEFAULT_SETTINGS).filter(([, setting]) => setting.category === category)
      : Object.entries(AdminSettingsService.DEFAULT_SETTINGS);

    for (const [key, defaultSetting] of defaultsToReset) {
      await this.setSetting(key, defaultSetting.value, {
        type: defaultSetting.type,
        category: defaultSetting.category,
        description: defaultSetting.description,
        updatedBy: options.adminUserId || 'system',
        adminUsername: options.adminUsername,
        auditContext: options.auditContext
      });
    }

    // Log audit trail
    if (options.adminUsername) {
      try {
        await AdminAuditService.logSystemAction(
          options.adminUsername,
          'configure',
          category 
            ? `Reset ${category} settings to defaults` 
            : 'Reset all settings to defaults',
          {
            adminUserId: options.adminUserId,
            entityType: 'admin_setting',
            details: { category, settingsCount: defaultsToReset.length },
            severity: 'high',
            requestContext: options.auditContext
          }
        );
      } catch (auditError) {
        console.warn('Failed to log audit trail for settings reset:', auditError);
      }
    }
  }

  /**
   * Transform database setting to API format
   */
  private static transformSetting(dbSetting: any): AdminSetting {
    if (!dbSetting || !dbSetting.key) {
      console.error(`❌ transformSetting: Invalid database setting:`, dbSetting);
      throw new Error('Invalid database setting: missing key');
    }
    
    console.log(`🔍 transformSetting: Processing setting ${dbSetting.key}:`, dbSetting);
    
    const defaultSetting = AdminSettingsService.DEFAULT_SETTINGS[dbSetting.key];
    
    // Handle potential date parsing issues
    let updatedAt: Date;
    try {
      updatedAt = dbSetting.updatedAt ? new Date(dbSetting.updatedAt) : new Date();
      if (isNaN(updatedAt.getTime())) {
        console.warn(`⚠️ transformSetting: Invalid date for ${dbSetting.key}, using current date`);
        updatedAt = new Date();
      }
    } catch (dateError) {
      console.warn(`⚠️ transformSetting: Date parsing error for ${dbSetting.key}:`, dateError);
      updatedAt = new Date();
    }
    
    const result = {
      key: dbSetting.key,
      value: dbSetting.value,
      type: dbSetting.type,
      category: dbSetting.category,
      description: dbSetting.description,
      isRequired: defaultSetting?.isRequired || false,
      defaultValue: defaultSetting?.defaultValue,
      updatedAt: updatedAt,
      updatedBy: dbSetting.updatedBy
    };
    
    console.log(`🔍 transformSetting: Final result for ${dbSetting.key}:`, result);
    return result;
  }

  /**
   * Serialize value for database storage
   */
  private static serializeValue(value: any, type: AdminSetting['type']): string {
    switch (type) {
      case 'string':
        return String(value);
      case 'number':
        return String(Number(value));
      case 'boolean':
        return String(Boolean(value));
      case 'json':
        return typeof value === 'string' ? value : JSON.stringify(value);
      default:
        return String(value);
    }
  }

  /**
   * Deserialize value from database
   */
  private static deserializeValue(value: string, type: AdminSetting['type']): any {
    switch (type) {
      case 'string':
        return value;
      case 'number':
        return Number(value);
      case 'boolean':
        return value === 'true';
      case 'json':
        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      default:
        return value;
    }
  }
}