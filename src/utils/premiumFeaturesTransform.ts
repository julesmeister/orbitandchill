/* eslint-disable @typescript-eslint/no-unused-vars */
import { DatabaseRow, PremiumFeature, FeatureCategory } from '@/types/premiumFeatures';

export class PremiumFeaturesTransform {
  /**
   * Convert database row to application format
   */
  static dbRowToFeature(row: DatabaseRow): PremiumFeature {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      category: row.category as FeatureCategory,
      isEnabled: Boolean(row.is_enabled),
      isPremium: Boolean(row.is_premium),
      component: row.component || undefined,
      section: row.section || undefined,
      sortOrder: row.sort_order || 0,
      createdAt: this.convertTimestamp(row.created_at),
      updatedAt: this.convertTimestamp(row.updated_at)
    };
  }

  /**
   * Convert multiple database rows to application format
   */
  static dbRowsToFeatures(rows: DatabaseRow[]): PremiumFeature[] {
    return rows.map(row => this.dbRowToFeature(row));
  }

  /**
   * Convert feature to database insert format
   */
  static featureToDbInsert(feature: PremiumFeature): {
    sql: string;
    args: any[];
  } {
    const now = Math.floor(Date.now() / 1000);
    
    return {
      sql: `INSERT INTO premium_features (
        id, name, description, category, is_enabled, is_premium, 
        component, section, sort_order, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        feature.id,
        feature.name,
        feature.description,
        feature.category,
        feature.isEnabled ? 1 : 0,
        feature.isPremium ? 1 : 0,
        feature.component || null,
        feature.section || null,
        feature.sortOrder || 0,
        now,
        now
      ]
    };
  }

  /**
   * Convert update object to database format
   */
  static updatesToDbFormat(updates: Record<string, any>): {
    fields: string[];
    values: any[];
  } {
    const updateFields: string[] = [];
    const updateValues: any[] = [];
    
    for (const [key, value] of Object.entries(updates)) {
      let dbKey = key;
      
      // Convert camelCase to snake_case
      switch (key) {
        case 'isEnabled':
          dbKey = 'is_enabled';
          break;
        case 'isPremium':
          dbKey = 'is_premium';
          break;
        case 'sortOrder':
          dbKey = 'sort_order';
          break;
        case 'updatedAt':
          dbKey = 'updated_at';
          break;
      }
      
      updateFields.push(`${dbKey} = ?`);
      updateValues.push(this.convertValueForDb(value));
    }
    
    // Add updated_at timestamp
    updateFields.push('updated_at = ?');
    updateValues.push(Math.floor(Date.now() / 1000));
    
    return { fields: updateFields, values: updateValues };
  }

  /**
   * Convert JavaScript value to SQLite-compatible format
   */
  private static convertValueForDb(value: any): any {
    if (typeof value === 'boolean') {
      return value ? 1 : 0;
    }
    
    if (value instanceof Date) {
      return Math.floor(value.getTime() / 1000);
    }
    
    return value;
  }

  /**
   * Convert timestamp from database to Date object
   */
  private static convertTimestamp(timestamp?: string | number): Date | undefined {
    if (!timestamp) {
      return undefined;
    }
    
    // Handle both string and number timestamps
    if (typeof timestamp === 'string') {
      // Check if it's an ISO string or unix timestamp
      if (timestamp.includes('T') || timestamp.includes('-')) {
        return new Date(timestamp);
      } else {
        return new Date(parseInt(timestamp) * 1000);
      }
    }
    
    // Number timestamp (assume unix seconds)
    return new Date(timestamp * 1000);
  }

  /**
   * Validate and sanitize feature data
   */
  static sanitizeFeatureData(data: any): PremiumFeature {
    return {
      id: String(data.id || '').trim(),
      name: String(data.name || '').trim(),
      description: String(data.description || '').trim(),
      category: data.category as FeatureCategory,
      isEnabled: Boolean(data.isEnabled ?? true),
      isPremium: Boolean(data.isPremium ?? false),
      component: data.component ? String(data.component).trim() : undefined,
      section: data.section ? String(data.section).trim() : undefined,
      sortOrder: typeof data.sortOrder === 'number' ? data.sortOrder : 0,
      createdAt: data.createdAt instanceof Date ? data.createdAt : undefined,
      updatedAt: data.updatedAt instanceof Date ? data.updatedAt : undefined
    };
  }

  /**
   * Sort features by category and sort order
   */
  static sortFeatures(features: PremiumFeature[]): PremiumFeature[] {
    const categoryOrder = ['chart', 'interpretation', 'sharing', 'analysis'];
    
    return features.sort((a, b) => {
      // First sort by category
      const categoryA = categoryOrder.indexOf(a.category);
      const categoryB = categoryOrder.indexOf(b.category);
      
      if (categoryA !== categoryB) {
        return categoryA - categoryB;
      }
      
      // Then sort by sortOrder
      const sortOrderA = a.sortOrder ?? 0;
      const sortOrderB = b.sortOrder ?? 0;
      
      if (sortOrderA !== sortOrderB) {
        return sortOrderA - sortOrderB;
      }
      
      // Finally sort by name
      return a.name.localeCompare(b.name);
    });
  }

  /**
   * Filter features by category
   */
  static filterByCategory(features: PremiumFeature[], category: FeatureCategory): PremiumFeature[] {
    return features.filter(feature => feature.category === category);
  }

  /**
   * Filter enabled features only
   */
  static filterEnabled(features: PremiumFeature[]): PremiumFeature[] {
    return features.filter(feature => feature.isEnabled);
  }

  /**
   * Filter premium features only
   */
  static filterPremium(features: PremiumFeature[]): PremiumFeature[] {
    return features.filter(feature => feature.isPremium);
  }
}