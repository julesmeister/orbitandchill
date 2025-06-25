#!/usr/bin/env tsx

/**
 * Script to manually toggle newsletter visibility
 * Usage: tsx scripts/toggle-newsletter.ts [enable|disable]
 */

import { AdminSettingsService } from '../src/db/services/adminSettingsService';

async function toggleNewsletter() {
  const action = process.argv[2] || 'status';
  
  try {
    console.log('🔧 Newsletter Toggle Script\n');
    
    // Initialize defaults first
    await AdminSettingsService.initializeDefaults();
    
    // Get current setting
    const currentSettings = await AdminSettingsService.getSettings({
      keys: ['newsletter.enabled']
    });
    
    const currentValue = currentSettings.length > 0 ? currentSettings[0].value : 'true';
    const isCurrentlyEnabled = currentValue === 'true';
    
    console.log(`Current status: Newsletter is ${isCurrentlyEnabled ? 'ENABLED' : 'DISABLED'}`);
    
    if (action === 'status') {
      console.log('\nUsage:');
      console.log('  tsx scripts/toggle-newsletter.ts enable');
      console.log('  tsx scripts/toggle-newsletter.ts disable');
      return;
    }
    
    let newValue: boolean;
    if (action === 'enable') {
      newValue = true;
    } else if (action === 'disable') {
      newValue = false;
    } else {
      console.log('❌ Invalid action. Use "enable" or "disable"');
      return;
    }
    
    console.log(`\n🔄 ${newValue ? 'Enabling' : 'Disabling'} newsletter...`);
    
    // Update the setting
    await AdminSettingsService.updateSettings({
      'newsletter.enabled': newValue
    }, {
      updatedBy: 'script',
      adminUsername: 'Script User',
      auditContext: {
        ipAddress: 'localhost',
        userAgent: 'toggle-newsletter-script',
        requestUrl: 'local-script',
        requestMethod: 'SCRIPT'
      }
    });
    
    console.log(`✅ Newsletter ${newValue ? 'enabled' : 'disabled'} successfully!`);
    
    // Verify the change
    const updatedSettings = await AdminSettingsService.getSettings({
      keys: ['newsletter.enabled']
    });
    
    if (updatedSettings.length > 0) {
      const updatedValue = updatedSettings[0].value === 'true';
      console.log(`📋 Verified: Newsletter is now ${updatedValue ? 'ENABLED' : 'DISABLED'}`);
    }
    
    console.log('\n💡 You may need to refresh your browser to see the changes.');
    
  } catch (error) {
    console.error('❌ Error toggling newsletter:', error);
    process.exit(1);
  }
}

toggleNewsletter();