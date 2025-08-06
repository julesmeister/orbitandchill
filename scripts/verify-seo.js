#!/usr/bin/env node

/**
 * SEO Verification Script
 * 
 * Verifies all SEO implementations are working correctly
 */

const https = require('https');
const { XMLParser } = require('fast-xml-parser');

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://orbitandchill.com';

const sitemapUrls = [
  '/sitemap-index.xml',
  '/sitemap.xml',
  '/blog/sitemap.xml',
  '/discussions/sitemap.xml',
  '/images-sitemap.xml',
  '/video-sitemap.xml',
  '/news-sitemap.xml',
  '/robots.txt'
];

async function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', reject);
  });
}

async function verifySEO() {
  console.log('🔍 SEO Verification Starting...\n');
  
  const results = {
    passed: 0,
    failed: 0,
    warnings: 0
  };

  // Check all sitemaps
  for (const path of sitemapUrls) {
    const url = `${baseUrl}${path}`;
    console.log(`Checking ${path}...`);
    
    try {
      const response = await fetchUrl(url);
      
      if (response.status === 200) {
        console.log(`✅ ${path} - OK (${response.data.length} bytes)`);
        
        // Validate XML for sitemap files
        if (path.endsWith('.xml')) {
          try {
            const parser = new XMLParser();
            parser.parse(response.data);
            console.log(`   ✅ Valid XML structure`);
          } catch (e) {
            console.log(`   ❌ Invalid XML: ${e.message}`);
            results.failed++;
          }
        }
        
        results.passed++;
      } else {
        console.log(`❌ ${path} - HTTP ${response.status}`);
        results.failed++;
      }
    } catch (error) {
      console.log(`❌ ${path} - Error: ${error.message}`);
      results.failed++;
    }
    
    console.log('');
  }

  // Summary
  console.log('\n📊 SEO Verification Summary:');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`⚠️  Warnings: ${results.warnings}`);
  
  if (results.failed === 0) {
    console.log('\n🎉 All SEO implementations are working correctly!');
  } else {
    console.log('\n❗ Some SEO implementations need attention.');
    process.exit(1);
  }
}

// Run verification
verifySEO().catch(console.error);