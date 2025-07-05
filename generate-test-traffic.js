#!/usr/bin/env node

const https = require('https');

const pages = [
  '/',
  '/chart',
  '/discussions', 
  '/about',
  '/events',
  '/contact',
  '/horary'
];

const referrers = [
  '', // Direct
  'https://google.com/search?q=astrology',
  'https://twitter.com',
  'https://facebook.com',
  'https://reddit.com/r/astrology',
  'https://instagram.com'
];

const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
];

function makeRequest(page, referrer, userAgent) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'orbitandchill.com',
      port: 443,
      path: page,
      method: 'GET',
      headers: {
        'User-Agent': userAgent,
        'Referer': referrer
      }
    };

    const req = https.request(options, (res) => {
      resolve();
    });

    req.on('error', (e) => {
      resolve();
    });

    req.setTimeout(5000, () => {
      req.destroy();
      resolve();
    });

    req.end();
  });
}

async function generateTraffic() {
  
  const promises = [];
  
  // Generate 50 page views with random combinations
  for (let i = 0; i < 50; i++) {
    const page = pages[Math.floor(Math.random() * pages.length)];
    const referrer = referrers[Math.floor(Math.random() * referrers.length)];
    const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
    
    promises.push(makeRequest(page, referrer, userAgent));
    
    // Add small delay between requests
    if (i % 10 === 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  await Promise.all(promises);
  
}

generateTraffic();