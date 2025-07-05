import { NextResponse } from 'next/server';
import { initializeDatabase } from '@/db/index';
import { PremiumFeatureService } from '@/db/services/premiumFeatureService';

export async function POST() {
  try {
    // Initialize database connection
    const { client } = await initializeDatabase();
    
    if (!client) {
      return NextResponse.json(
        { success: false, error: 'Database not available - missing Turso credentials' },
        { status: 500 }
      );
    }

    // Create the premium_features table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS premium_features (
        id text PRIMARY KEY NOT NULL,
        name text NOT NULL,
        description text NOT NULL,
        category text NOT NULL,
        is_enabled integer DEFAULT 1 NOT NULL,
        is_premium integer DEFAULT 0 NOT NULL,
        component text,
        section text,
        sort_order integer DEFAULT 0 NOT NULL,
        created_at integer NOT NULL,
        updated_at integer NOT NULL
      )
    `);

    // Add subscription_tier column to users table if it doesn't exist
    try {
      await client.execute(`
        ALTER TABLE users ADD COLUMN subscription_tier text DEFAULT 'free'
      `);
    } catch (error) {
      // Column might already exist, ignore error
      console.log('subscription_tier column already exists or error adding it:', error instanceof Error ? error.message : String(error));
    }

    // Seed the default premium features using direct SQL
    const defaultFeatures = [
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

    const now = Math.floor(Date.now() / 1000);
    
    for (const feature of defaultFeatures) {
      await client.execute({
        sql: `INSERT INTO premium_features (id, name, description, category, is_enabled, is_premium, component, section, sort_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          feature.id,
          feature.name,
          feature.description,
          feature.category,
          feature.isEnabled ? 1 : 0,
          feature.isPremium ? 1 : 0,
          feature.component,
          feature.section,
          feature.sortOrder,
          now,
          now
        ]
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Premium features migration completed successfully'
    });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { success: false, error: 'Migration failed', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}