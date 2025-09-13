/* eslint-disable @typescript-eslint/no-unused-vars */
import { db } from '@/db/index';
import { premiumFeatures } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { createResilientService } from '@/db/resilience';
import { executeRawSelect, executeRawSelectOne, executeRawUpdate, executeRawDelete, RawSqlPatterns, transformDatabaseRow } from '@/db/rawSqlUtils';

// Create resilient service instance
const resilient = createResilientService('PremiumFeatureService');

export interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  category: 'chart' | 'interpretation' | 'sharing' | 'analysis';
  isEnabled: boolean;
  isPremium: boolean;
  component?: string;
  section?: string;
  sortOrder?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const DEFAULT_FEATURES: PremiumFeature[] = [
  // Chart Interpretation Features
  {
    id: 'detailed-aspects',
    name: 'Detailed Aspect Interpretations',
    description: 'Full descriptions for all planetary aspects including minor aspects',
    category: 'interpretation',
    isEnabled: true,
    isPremium: false,
    component: 'ChartInterpretation',
    section: 'aspects',
    sortOrder: 1
  },
  {
    id: 'planetary-dignities',
    name: 'Planetary Dignities Analysis',
    description: 'Complete dignities and debilities table with interpretations',
    category: 'interpretation',
    isEnabled: true,
    isPremium: false,
    component: 'ChartInterpretation',
    section: 'dignities',
    sortOrder: 2
  },
  {
    id: 'house-analysis',
    name: 'Comprehensive House Analysis',
    description: 'Detailed analysis of all 12 houses with cusp interpretations',
    category: 'interpretation',
    isEnabled: true,
    isPremium: false,
    component: 'ChartInterpretation',
    section: 'houses',
    sortOrder: 3
  },
  {
    id: 'core-personality',
    name: 'Core Personality Trio',
    description: 'Sun, Moon, and Rising sign detailed interpretations',
    category: 'interpretation',
    isEnabled: true,
    isPremium: false,
    component: 'ChartInterpretation',
    section: 'core',
    sortOrder: 4
  },
  {
    id: 'planetary-positions',
    name: 'Planetary Positions Overview',
    description: 'Table showing all planetary positions and houses',
    category: 'interpretation',
    isEnabled: true,
    isPremium: false,
    component: 'ChartInterpretation',
    section: 'positions',
    sortOrder: 5
  },
  {
    id: 'stellium-analysis',
    name: 'Stellium Analysis',
    description: 'Detection and interpretation of planetary stelliums in signs and houses',
    category: 'interpretation',
    isEnabled: true,
    isPremium: false,
    component: 'ChartInterpretation',
    section: 'stelliums',
    sortOrder: 6
  },
  {
    id: 'aspect-filtering',
    name: 'Advanced Aspect Filtering',
    description: 'Filter aspects by category, type, and life areas',
    category: 'interpretation',
    isEnabled: true,
    isPremium: true,
    component: 'ChartInterpretation',
    section: 'aspect-filters',
    sortOrder: 7
  },
  {
    id: 'detailed-modals',
    name: 'Detailed Interpretation Modals',
    description: 'In-depth planetary interpretations in modal popups',
    category: 'interpretation',
    isEnabled: true,
    isPremium: true,
    component: 'ChartInterpretation',
    section: 'modals',
    sortOrder: 8
  },
  // Chart Display Features
  {
    id: 'interactive-chart',
    name: 'Interactive Chart Elements',
    description: 'Clickable planets, houses, and aspects with tooltips',
    category: 'chart',
    isEnabled: true,
    isPremium: false,
    component: 'UnifiedAstrologicalChart',
    section: 'interactivity',
    sortOrder: 9
  },
  {
    id: 'aspect-lines',
    name: 'Aspect Lines Visualization',
    description: 'Visual lines showing planetary aspects on the chart',
    category: 'chart',
    isEnabled: true,
    isPremium: true,
    component: 'UnifiedAstrologicalChart',
    section: 'aspects',
    sortOrder: 10
  },
  {
    id: 'angular-markers',
    name: 'Angular Markers (ASC/DSC/MC/IC)',
    description: 'Display of important chart angles and markers',
    category: 'chart',
    isEnabled: true,
    isPremium: false,
    component: 'UnifiedAstrologicalChart',
    section: 'angles',
    sortOrder: 11
  },
  // Sharing Features
  {
    id: 'chart-sharing',
    name: 'Chart Sharing',
    description: 'Generate public links to share charts with others',
    category: 'sharing',
    isEnabled: true,
    isPremium: true,
    component: 'ChartPage',
    section: 'sharing',
    sortOrder: 12
  },
  {
    id: 'chart-export',
    name: 'Chart Export Options',
    description: 'Export charts as PNG, PDF, or SVG files',
    category: 'sharing',
    isEnabled: false,
    isPremium: true,
    component: 'ChartActions',
    section: 'export',
    sortOrder: 13
  },
  // Analysis Features
  {
    id: 'transits-analysis',
    name: 'Current Transits Analysis',
    description: 'Analysis of current planetary transits to natal chart',
    category: 'analysis',
    isEnabled: false,
    isPremium: true,
    component: 'TransitAnalysis',
    section: 'transits',
    sortOrder: 14
  },
  {
    id: 'progressions-analysis',
    name: 'Secondary Progressions',
    description: 'Analysis of progressed planets and their meanings',
    category: 'analysis',
    isEnabled: false,
    isPremium: true,
    component: 'ProgressionAnalysis',
    section: 'progressions',
    sortOrder: 15
  },
  {
    id: 'synastry-compatibility',
    name: 'Synastry Compatibility',
    description: 'Compare two charts for relationship compatibility',
    category: 'analysis',
    isEnabled: false,
    isPremium: true,
    component: 'SynastryAnalysis',
    section: 'synastry',
    sortOrder: 16
  }
];

export class PremiumFeatureService {
  static async getAllFeatures(): Promise<PremiumFeature[]> {
    return resilient.array(db, 'getAllFeatures', async () => {
      const features = await db.select().from(premiumFeatures);
      
      // Convert database format (snake_case, integers) to service format (camelCase, booleans)
      return features.map((feature: { id: any; name: any; description: any; category: any; isEnabled: any; isPremium: any; component: any; section: any; sortOrder: any; createdAt: any; updatedAt: any; }) => ({
        id: feature.id,
        name: feature.name,
        description: feature.description,
        category: feature.category,
        isEnabled: Boolean(feature.isEnabled),
        isPremium: Boolean(feature.isPremium),
        component: feature.component || undefined,
        section: feature.section || undefined,
        sortOrder: feature.sortOrder,
        createdAt: feature.createdAt,
        updatedAt: feature.updatedAt
      }));
    });
  }

  static async updateAllFeatures(features: PremiumFeature[]): Promise<PremiumFeature[]> {
    return resilient.array(db, 'updateAllFeatures', async () => {
      // Delete all existing features
      await db.delete(premiumFeatures);
      
      // Insert all new features
      const insertData = features.map(feature => ({
        id: feature.id,
        name: feature.name,
        description: feature.description,
        category: feature.category,
        isEnabled: feature.isEnabled,
        isPremium: feature.isPremium,
        component: feature.component || null,
        section: feature.section || null,
        sortOrder: feature.sortOrder || 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }));
      
      await db.insert(premiumFeatures).values(insertData);
      
      return await this.getAllFeatures();
    });
  }

  static async updateFeature(featureId: string, updates: Partial<PremiumFeature>): Promise<PremiumFeature | null> {
    return resilient.item(db, 'updateFeature', async () => {
      // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
      const updateData = { ...updates, updatedAt: new Date() };
      const rowsAffected = await RawSqlPatterns.updateById(db, 'premium_features', featureId, updateData);
      
      if (rowsAffected === 0) {
        return null;
      }
      
      // Get the updated feature
      const feature = await RawSqlPatterns.findById(db, 'premium_features', featureId);
      
      if (!feature) {
        return null;
      }
      
      const transformedFeature = transformDatabaseRow(feature);
      return {
        id: transformedFeature.id,
        name: transformedFeature.name,
        description: transformedFeature.description,
        category: transformedFeature.category,
        isEnabled: transformedFeature.isEnabled,
        isPremium: transformedFeature.isPremium,
        component: transformedFeature.component || undefined,
        section: transformedFeature.section || undefined,
        sortOrder: transformedFeature.sortOrder,
        createdAt: transformedFeature.createdAt,
        updatedAt: transformedFeature.updatedAt
      };
    });
  }

  static async seedDefaultFeatures(): Promise<void> {
    return resilient.operation(db, 'seedDefaultFeatures', async () => {
      // Check if features already exist
      const existingFeatures = await db.select().from(premiumFeatures);
      
      if (existingFeatures.length > 0) {
        console.log('Premium features already exist, skipping seed');
        return;
      }
      
      // Insert default features
      const insertData = DEFAULT_FEATURES.map(feature => ({
        id: feature.id,
        name: feature.name,
        description: feature.description,
        category: feature.category,
        isEnabled: feature.isEnabled,
        isPremium: feature.isPremium,
        component: feature.component || null,
        section: feature.section || null,
        sortOrder: feature.sortOrder || 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }));
      
      await db.insert(premiumFeatures).values(insertData);
      console.log(`Seeded ${DEFAULT_FEATURES.length} premium features`);
    }, undefined);
  }

  static async getFeatureById(featureId: string): Promise<PremiumFeature | null> {
    return resilient.item(db, 'getFeatureById', async () => {
      // BYPASS DRIZZLE ORM - Use raw SQL due to Turso HTTP client WHERE clause parsing issues
      const feature = await RawSqlPatterns.findById(db, 'premium_features', featureId);
      
      if (!feature) {
        return null;
      }
      
      const transformedFeature = transformDatabaseRow(feature);
      return {
        id: transformedFeature.id,
        name: transformedFeature.name,
        description: transformedFeature.description,
        category: transformedFeature.category,
        isEnabled: transformedFeature.isEnabled,
        isPremium: transformedFeature.isPremium,
        component: transformedFeature.component || undefined,
        section: transformedFeature.section || undefined,
        sortOrder: transformedFeature.sortOrder,
        createdAt: transformedFeature.createdAt,
        updatedAt: transformedFeature.updatedAt
      };
    });
  }
}