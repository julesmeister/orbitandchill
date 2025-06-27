#!/usr/bin/env node

// Script to seed premium features table with default features
import { createClient } from '@libsql/client/http';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const premiumFeatures = [
  // Chart Display Features
  {
    id: 'basic-chart',
    name: 'Basic Chart Display',
    description: 'View your natal chart wheel with planets and signs',
    category: 'chart',
    is_enabled: true,
    is_premium: false,
    component: 'ChartWheel',
    section: 'chart-display',
    sort_order: 1
  },
  {
    id: 'aspect-lines',
    name: 'Aspect Lines',
    description: 'See visual connections between planets',
    category: 'chart',
    is_enabled: true,
    is_premium: false,
    component: 'AspectLines',
    section: 'chart-display',
    sort_order: 2
  },
  {
    id: 'house-cusps',
    name: 'House Cusps',
    description: 'Display house divisions in your chart',
    category: 'chart',
    is_enabled: true,
    is_premium: true,
    component: 'HouseCusps',
    section: 'chart-display',
    sort_order: 3
  },
  {
    id: 'chart-export',
    name: 'Export Chart',
    description: 'Download your chart as PNG or PDF',
    category: 'chart',
    is_enabled: true,
    is_premium: true,
    component: 'ChartExport',
    section: 'chart-actions',
    sort_order: 4
  },

  // Interpretation Features
  {
    id: 'core-personality',
    name: 'Core Personality',
    description: 'Sun, Moon, and Rising sign interpretations',
    category: 'interpretation',
    is_enabled: true,
    is_premium: false,
    component: 'CorePersonalitySection',
    section: 'interpretations',
    sort_order: 10
  },
  {
    id: 'stellium-analysis',
    name: 'Stellium Analysis',
    description: 'Identify and interpret planetary stelliums',
    category: 'interpretation',
    is_enabled: true,
    is_premium: false,
    component: 'StelliumsSection',
    section: 'interpretations',
    sort_order: 11
  },
  {
    id: 'planetary-influences',
    name: 'Planetary Influences',
    description: 'Basic planetary position meanings',
    category: 'interpretation',
    is_enabled: true,
    is_premium: false,
    component: 'PlanetaryInfluencesSection',
    section: 'interpretations',
    sort_order: 12
  },
  {
    id: 'planetary-positions',
    name: 'Planetary Positions Table',
    description: 'Detailed table of all planetary positions',
    category: 'interpretation',
    is_enabled: true,
    is_premium: false,
    component: 'PlanetaryPositionsSection',
    section: 'interpretations',
    sort_order: 13
  },
  {
    id: 'detailed-aspects',
    name: 'Detailed Aspects',
    description: 'Complete aspect grid and interpretations',
    category: 'interpretation',
    is_enabled: true,
    is_premium: true,
    component: 'MajorAspectsSection',
    section: 'interpretations',
    sort_order: 14
  },
  {
    id: 'planetary-dignities',
    name: 'Planetary Dignities',
    description: 'Exaltation, detriment, and fall analysis',
    category: 'interpretation',
    is_enabled: true,
    is_premium: true,
    component: 'PlanetaryDignitiesSection',
    section: 'interpretations',
    sort_order: 15
  },
  {
    id: 'house-analysis',
    name: 'House Analysis',
    description: 'Detailed house placements and meanings',
    category: 'interpretation',
    is_enabled: true,
    is_premium: true,
    component: 'HousesSection',
    section: 'interpretations',
    sort_order: 16
  },
  {
    id: 'detailed-modals',
    name: 'Detailed Modal Explanations',
    description: 'In-depth popup explanations for planets and aspects',
    category: 'interpretation',
    is_enabled: true,
    is_premium: true,
    component: 'InterpretationModal',
    section: 'interpretations',
    sort_order: 17
  },

  // Sharing Features
  {
    id: 'basic-sharing',
    name: 'Basic Chart Sharing',
    description: 'Share your chart via link',
    category: 'sharing',
    is_enabled: true,
    is_premium: false,
    component: 'ShareButton',
    section: 'sharing',
    sort_order: 20
  },
  {
    id: 'social-sharing',
    name: 'Social Media Sharing',
    description: 'Share directly to social platforms',
    category: 'sharing',
    is_enabled: true,
    is_premium: true,
    component: 'SocialShareButtons',
    section: 'sharing',
    sort_order: 21
  },
  {
    id: 'chart-privacy',
    name: 'Chart Privacy Controls',
    description: 'Control who can view your shared charts',
    category: 'sharing',
    is_enabled: true,
    is_premium: true,
    component: 'PrivacySettings',
    section: 'sharing',
    sort_order: 22
  },

  // Analysis Features
  {
    id: 'transit-tracking',
    name: 'Transit Tracking',
    description: 'See current planetary transits to your natal chart',
    category: 'analysis',
    is_enabled: true,
    is_premium: true,
    component: 'TransitTracker',
    section: 'analysis',
    sort_order: 30
  },
  {
    id: 'synastry-charts',
    name: 'Synastry Charts',
    description: 'Compare charts for relationship insights',
    category: 'analysis',
    is_enabled: true,
    is_premium: true,
    component: 'SynastryChart',
    section: 'analysis',
    sort_order: 31
  },
  {
    id: 'composite-charts',
    name: 'Composite Charts',
    description: 'Create relationship composite charts',
    category: 'analysis',
    is_enabled: true,
    is_premium: true,
    component: 'CompositeChart',
    section: 'analysis',
    sort_order: 32
  },
  {
    id: 'progression-analysis',
    name: 'Progression Analysis',
    description: 'Secondary progressions and solar arc directions',
    category: 'analysis',
    is_enabled: true,
    is_premium: true,
    component: 'ProgressionAnalysis',
    section: 'analysis',
    sort_order: 33
  },
  {
    id: 'advanced-filtering',
    name: 'Advanced Aspect Filtering',
    description: 'Filter aspects by orb, type, and planet',
    category: 'analysis',
    is_enabled: true,
    is_premium: true,
    component: 'AspectFilters',
    section: 'analysis',
    sort_order: 34
  },

  // Horary Features
  {
    id: 'unlimited-horary-questions',
    name: 'Unlimited Horary Questions',
    description: 'Ask unlimited horary questions (Free: 3/day, 30/month)',
    category: 'analysis',
    is_enabled: true,
    is_premium: true,
    component: 'HoraryQuestions',
    section: 'horary',
    sort_order: 40
  },
  {
    id: 'horary-chart-export',
    name: 'Horary Chart Export',
    description: 'Export horary charts as PDF or image',
    category: 'analysis',
    is_enabled: true,
    is_premium: true,
    component: 'HoraryExport',
    section: 'horary',
    sort_order: 41
  },
  {
    id: 'horary-question-history',
    name: 'Extended Question History',
    description: 'Access all past horary questions (Free: last 10)',
    category: 'analysis',
    is_enabled: true,
    is_premium: true,
    component: 'HoraryHistory',
    section: 'horary',
    sort_order: 42
  },

  // Events Features
  {
    id: 'unlimited-event-generation',
    name: 'Unlimited Event Generation',
    description: 'Generate unlimited astrological events (Free: 5/day, 50/month)',
    category: 'analysis',
    is_enabled: true,
    is_premium: true,
    component: 'EventGeneration',
    section: 'events',
    sort_order: 50
  },
  {
    id: 'unlimited-event-storage',
    name: 'Unlimited Event Storage',
    description: 'Store unlimited events (Free: 100 events max)',
    category: 'analysis',
    is_enabled: true,
    is_premium: true,
    component: 'EventStorage',
    section: 'events',
    sort_order: 51
  },
  {
    id: 'unlimited-bookmarks',
    name: 'Unlimited Bookmarks',
    description: 'Bookmark unlimited events (Free: 20 bookmarks max)',
    category: 'analysis',
    is_enabled: true,
    is_premium: true,
    component: 'EventBookmarks',
    section: 'events',
    sort_order: 52
  },
  {
    id: 'time-windows',
    name: 'Event Time Windows',
    description: 'Access precise timing windows for optimal event planning',
    category: 'analysis',
    is_enabled: true,
    is_premium: true,
    component: 'TimeWindows',
    section: 'events',
    sort_order: 53
  },
  {
    id: 'electional-data',
    name: 'Electional Astrology Data',
    description: 'Advanced electional astrology analysis and data',
    category: 'analysis',
    is_enabled: true,
    is_premium: true,
    component: 'ElectionalData',
    section: 'events',
    sort_order: 54
  },
  {
    id: 'export-events',
    name: 'Export Events',
    description: 'Export events to calendar, PDF, or CSV formats',
    category: 'analysis',
    is_enabled: true,
    is_premium: true,
    component: 'EventExport',
    section: 'events',
    sort_order: 55
  },
  {
    id: 'advanced-event-filtering',
    name: 'Advanced Event Filtering',
    description: 'Filter events by moon phases, planetary dignities, and more',
    category: 'analysis',
    is_enabled: true,
    is_premium: true,
    component: 'AdvancedEventFilters',
    section: 'events',
    sort_order: 56
  }
];

async function seedPremiumFeatures() {
  console.log('🌱 Seeding premium features table...');

  try {
    const client = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });

    // Test connection
    await client.execute('SELECT 1 as test');
    console.log('✅ Connected to Turso database');

    // Clear existing features
    console.log('🧹 Clearing existing features...');
    await client.execute('DELETE FROM premium_features');

    // Insert each feature
    console.log(`📝 Inserting ${premiumFeatures.length} premium features...`);
    
    const now = Math.floor(Date.now() / 1000);
    
    for (const feature of premiumFeatures) {
      await client.execute({
        sql: `INSERT INTO premium_features (
          id, name, description, category, is_enabled, is_premium, 
          component, section, sort_order, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          feature.id,
          feature.name,
          feature.description,
          feature.category,
          feature.is_enabled ? 1 : 0,
          feature.is_premium ? 1 : 0,
          feature.component,
          feature.section,
          feature.sort_order,
          now,
          now
        ]
      });
      
      console.log(`  ✅ Added: ${feature.name} (${feature.is_premium ? 'Premium' : 'Free'})`);
    }

    // Verify insertion
    const result = await client.execute('SELECT COUNT(*) as count FROM premium_features');
    const count = result.rows[0].count;
    
    console.log(`\n🎉 Successfully seeded ${count} premium features!`);
    console.log('\n📊 Feature Summary:');
    console.log(`  - Free features: ${premiumFeatures.filter(f => !f.is_premium).length}`);
    console.log(`  - Premium features: ${premiumFeatures.filter(f => f.is_premium).length}`);
    console.log(`  - Chart features: ${premiumFeatures.filter(f => f.category === 'chart').length}`);
    console.log(`  - Interpretation features: ${premiumFeatures.filter(f => f.category === 'interpretation').length}`);
    console.log(`  - Sharing features: ${premiumFeatures.filter(f => f.category === 'sharing').length}`);
    console.log(`  - Analysis features: ${premiumFeatures.filter(f => f.category === 'analysis').length}`);

  } catch (error) {
    console.error('❌ Error seeding premium features:', error);
    process.exit(1);
  }
}

seedPremiumFeatures();