/**
 * Newsletter Configuration Template
 * 
 * Copy this file to newsletter.config.js and modify as needed
 * 
 * Usage:
 * 1. cp newsletter.config.template.js newsletter.config.js
 * 2. Edit newsletter.config.js
 * 3. Configure the enabled setting (see options below)
 */
module.exports = {
  /**
   * Master newsletter control:
   * 
   * 'auto'  = Use admin database settings (normal operation)
   *           Newsletter is fully controlled by admin panel
   * 
   * true    = Force newsletter ON (override admin settings)
   *           Newsletter shows regardless of admin panel setting
   * 
   * false   = Force newsletter OFF (override admin settings)
   *           Newsletter hidden regardless of admin panel setting
   */
  enabled: 'auto',
  
  /**
   * Fallback settings used when database is unavailable
   * or when forcing newsletter ON/OFF
   */
  fallback: {
    title: 'Stay Connected to the Cosmos',
    description: 'Get weekly astrology insights, new feature updates, and cosmic wisdom delivered to your inbox.',
    placeholderText: 'Enter your email',
    buttonText: 'Subscribe',
    privacyText: 'No spam, unsubscribe anytime. We respect your cosmic privacy.',
    backgroundColor: '#f0e3ff'
  }
};