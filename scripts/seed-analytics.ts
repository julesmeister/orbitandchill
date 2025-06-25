/* eslint-disable @typescript-eslint/no-unused-vars */
import { AnalyticsService } from '../src/db/services/analyticsService';

async function seedAnalytics() {
  try {
    console.log('🌱 Seeding analytics data...');
    await AnalyticsService.generateMockData(30);
    console.log('✅ Analytics data seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to seed analytics data:', error);
    process.exit(1);
  }
}

seedAnalytics();