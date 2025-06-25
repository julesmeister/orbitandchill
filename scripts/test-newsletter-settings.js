#!/usr/bin/env node

/**
 * Test script to check newsletter settings in the database
 */

const { db } = require('../src/db/index.ts');
const { AdminSettingsService } = require('../src/db/services/adminSettingsService.ts');

async function testNewsletterSettings() {
  try {
    console.log('🔍 Checking newsletter settings...\n');
    
    // Check if admin settings are initialized
    console.log('1. Initializing admin settings...');
    await AdminSettingsService.initializeDefaults();
    console.log('✅ Admin settings initialized\n');
    
    // Get all newsletter settings
    console.log('2. Fetching newsletter settings...');
    const newsletterSettings = await AdminSettingsService.getSettingsByCategory('newsletter');
    console.log('Newsletter settings found:', newsletterSettings.length);
    
    newsletterSettings.forEach(setting => {
      console.log(`   ${setting.key}: ${setting.value} (${setting.type})`);
    });
    
    // Specifically check newsletter.enabled
    console.log('\n3. Checking newsletter.enabled specifically...');
    const enabledSettings = await AdminSettingsService.getSettings({
      keys: ['newsletter.enabled']
    });
    
    if (enabledSettings.length > 0) {
      const enabledSetting = enabledSettings[0];
      console.log(`   newsletter.enabled: ${enabledSetting.value} (${enabledSetting.type})`);
      console.log(`   Boolean value: ${enabledSetting.value === 'true'}`);
    } else {
      console.log('   ❌ newsletter.enabled setting not found!');
    }
    
    // Test the API endpoint simulation
    console.log('\n4. Simulating API call...');
    const apiResponse = await AdminSettingsService.getSettings({
      keys: ['newsletter.enabled', 'newsletter.title', 'newsletter.description', 'newsletter.placeholder_text', 'newsletter.button_text', 'newsletter.privacy_text', 'newsletter.background_color']
    });
    
    console.log(`   API would return ${apiResponse.length} settings`);
    apiResponse.forEach(setting => {
      console.log(`   ${setting.key}: ${setting.value}`);
    });
    
    console.log('\n🎯 To disable newsletter, run:');
    console.log('   npm run db:studio');
    console.log('   Or use admin dashboard to toggle newsletter.enabled to false');
    
  } catch (error) {
    console.error('❌ Error testing newsletter settings:', error);
  }
}

testNewsletterSettings();