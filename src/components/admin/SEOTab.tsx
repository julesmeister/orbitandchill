/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect } from 'react';
import { BRAND } from '@/config/brand';

interface SEOSettings {
  // Global Meta Settings
  siteName: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultKeywords: string[];
  defaultOGImage: string;
  twitterHandle: string;
  facebookAppId: string;
  
  // Schema.org Settings
  organizationType: string;
  organizationName: string;
  organizationLogo: string;
  organizationAddress: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  organizationPhone: string;
  organizationEmail: string;
  
  // Technical SEO
  canonicalBaseURL: string;
  robotsTxt: string;
  sitemapSettings: {
    enabled: boolean;
    priority: number;
    changefreq: string;
    includePosts: boolean;
    includeGuides: boolean;
    includeUserPages: boolean;
  };
  
  // Analytics
  googleAnalyticsId: string;
  googleTagManagerId: string;
  googleSearchConsoleId: string;
  bingWebmasterToolsId: string;
  
  // Page-specific SEO
  pageSettings: {
    [key: string]: {
      title: string;
      description: string;
      keywords: string[];
      ogImage: string;
      noindex: boolean;
      nofollow: boolean;
    };
  };
}

interface SEOTabProps {
  isLoading: boolean;
}

export default function SEOTab({ isLoading }: SEOTabProps) {
  const [activeSection, setActiveSection] = useState('global');
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [seoSettings, setSeoSettings] = useState<SEOSettings>({
    siteName: BRAND.name,
    defaultTitle: `${BRAND.name} - Professional Astrology Charts & Insights`,
    defaultDescription: 'Generate accurate natal charts, explore astrology insights, and connect with a community of astrology enthusiasts. Professional-grade calculations with modern design.',
    defaultKeywords: ['astrology', 'natal chart', 'horoscope', 'birth chart', 'astrology calculator', 'zodiac'],
    defaultOGImage: '/images/og-default.jpg',
    twitterHandle: BRAND.socialHandles.twitter,
    facebookAppId: '',
    
    organizationType: 'Organization',
    organizationName: BRAND.name,
    organizationLogo: '/images/logo.png',
    organizationAddress: {
      streetAddress: '',
      addressLocality: '',
      addressRegion: '',
      postalCode: '',
      addressCountry: 'US'
    },
    organizationPhone: '',
    organizationEmail: BRAND.email,
    
    canonicalBaseURL: BRAND.domain,
    robotsTxt: `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /_next/

Sitemap: ${BRAND.domain}/sitemap.xml`,
    
    sitemapSettings: {
      enabled: true,
      priority: 0.8,
      changefreq: 'weekly',
      includePosts: true,
      includeGuides: true,
      includeUserPages: false
    },
    
    googleAnalyticsId: '',
    googleTagManagerId: '',
    googleSearchConsoleId: '',
    bingWebmasterToolsId: '',
    
    pageSettings: {
      '/': {
        title: `Professional Astrology Charts & Matrix Destiny | ${BRAND.name}`,
        description: 'Generate accurate natal charts with professional-grade calculations. Discover your Matrix Destiny and life purpose through numerology and astrology.',
        keywords: ['astrology', 'natal chart', 'birth chart', 'horoscope', 'matrix destiny', 'numerology', 'astrocartography', 'planetary alignment'],
        ogImage: '/images/og-home.jpg',
        noindex: false,
        nofollow: false
      },
      '/chart': {
        title: `Free Natal Chart Calculator | ${BRAND.name}`,
        description: 'Create your personalized natal chart with precise astronomical calculations. Discover your astrological profile instantly.',
        keywords: ['natal chart calculator', 'free birth chart', 'astrology chart'],
        ogImage: '/images/og-chart.jpg',
        noindex: false,
        nofollow: false
      },
      '/guides': {
        title: `Astrology Guides & Learning Center | ${BRAND.name}`,
        description: 'Learn astrology with our comprehensive guides. From beginner to advanced, master the art of chart interpretation.',
        keywords: ['astrology guides', 'learn astrology', 'astrology education'],
        ogImage: '/images/og-guides.jpg',
        noindex: false,
        nofollow: false
      },
      '/astrocartography': {
        title: `Astrocartography Map & Location Analysis | ${BRAND.name}`,
        description: 'Find your ideal locations around the world with astrocartography. Discover where your planetary lines create opportunities for love, career, and personal growth.',
        keywords: ['astrocartography', 'relocation astrology', 'planetary lines', 'travel astrology'],
        ogImage: '/images/og-astrocartography.jpg',
        noindex: false,
        nofollow: false
      },
      '/blog': {
        title: `Astrology Blog & Insights | ${BRAND.name}`,
        description: 'Read the latest astrology insights, cosmic events analysis, and spiritual guidance. Expert articles on planetary movements, zodiac trends, and celestial wisdom.',
        keywords: ['astrology blog', 'cosmic insights', 'planetary movements', 'zodiac trends', 'spiritual guidance', 'celestial events'],
        ogImage: '/images/og-blog.jpg',
        noindex: false,
        nofollow: false
      },
      '/discussions': {
        title: `Astrology Community Discussions | ${BRAND.name}`,
        description: 'Join our vibrant astrology community. Share experiences, ask questions, and connect with fellow astrology enthusiasts. Get chart readings and cosmic guidance.',
        keywords: ['astrology community', 'astrology forum', 'chart readings', 'astrology discussions', 'cosmic community', 'zodiac forum'],
        ogImage: '/images/og-discussions.jpg',
        noindex: false,
        nofollow: false
      }
    }
  });

  const [isSaving, setIsSaving] = useState(false);

  // Load existing SEO settings from database
  useEffect(() => {
    const loadSeoSettings = async () => {
      try {
        const response = await fetch('/api/admin/seo-settings');
        const result = await response.json();

        if (result.success && result.settings) {
          setSeoSettings(prev => ({
            ...prev,
            ...result.settings
          }));
        }
      } catch (error) {
        console.warn('Failed to load SEO settings, using defaults:', error);
      } finally {
        setIsLoadingSettings(false);
      }
    };

    loadSeoSettings();
  }, []);

  const sections = [
    { id: 'global', label: 'Global Meta', icon: '🌐' },
    { id: 'schema', label: 'Schema.org', icon: '📋' },
    { id: 'technical', label: 'Technical SEO', icon: '⚙️' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'pages', label: 'Page Settings', icon: '📄' },
    { id: 'tools', label: 'SEO Tools', icon: '🔧' }
  ];

  const updateSettings = (path: string, value: any) => {
    setSeoSettings(prev => {
      const keys = path.split('.');
      const newSettings = { ...prev };
      let current: any = newSettings;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      
      return newSettings;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save SEO settings to Turso database via API
      const response = await fetch('/api/admin/seo-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(seoSettings)
      });

      const result = await response.json();

      if (result.success) {
        // Could show success toast here
      } else {
        console.error('❌ Failed to save SEO settings:', result.error);
        // Could show error toast here
      }
    } catch (error) {
      console.error('Error saving SEO settings:', error);
      // Could show error toast here
    } finally {
      setIsSaving(false);
    }
  };

  const generateSitemap = async () => {
    try {
      const response = await fetch('/api/admin/generate-sitemap', {
        method: 'POST'
      });
      const result = await response.json();
      
      if (result.success) {
        // Could show success toast here
      } else {
        console.error('❌ Failed to generate sitemap:', result.error);
      }
    } catch (error) {
      console.error('Error generating sitemap:', error);
    }
  };

  const generateRobotsTxt = async () => {
    try {
      const response = await fetch('/api/admin/generate-robots', {
        method: 'POST'
      });
      const result = await response.json();
      
      if (result.success) {
        // Could show success toast here
      } else {
        console.error('❌ Failed to generate robots.txt:', result.error);
      }
    } catch (error) {
      console.error('Error generating robots.txt:', error);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Are you sure you want to reset all SEO settings to defaults? This action cannot be undone.')) {
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/seo-settings', {
        method: 'DELETE'
      });

      const result = await response.json();

      if (result.success) {
        // Reload the page to fetch default settings
        window.location.reload();
      } else {
        console.error('❌ Failed to reset SEO settings:', result.error);
      }
    } catch (error) {
      console.error('Error resetting SEO settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const testStructuredData = async () => {
    try {
      // Test structured data with Google's tool
      window.open(`https://search.google.com/test/rich-results?url=${encodeURIComponent(seoSettings.canonicalBaseURL)}`, '_blank');
    } catch (error) {
      console.error('Error opening structured data test:', error);
    }
  };

  if (isLoading || isLoadingSettings) {
    return (
      <div className="bg-white border border-black p-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-300 w-full"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const renderGlobalMetaSection = () => (
    <div className="space-y-6">
      <div>
        <label className="block font-inter text-sm font-medium text-black mb-2">
          Site Name
        </label>
        <input
          type="text"
          value={seoSettings.siteName}
          onChange={(e) => updateSettings('siteName', e.target.value)}
          className="w-full px-4 py-3 border-2 border-black bg-white text-black font-inter focus:outline-none focus:border-black"
          placeholder="Your site name"
        />
      </div>

      <div>
        <label className="block font-inter text-sm font-medium text-black mb-2">
          Default Title Template
        </label>
        <input
          type="text"
          value={seoSettings.defaultTitle}
          onChange={(e) => updateSettings('defaultTitle', e.target.value)}
          className="w-full px-4 py-3 border-2 border-black bg-white text-black font-inter focus:outline-none focus:border-black"
          placeholder="Default page title"
        />
        <p className="mt-1 text-sm text-black/60 font-inter">Use %s as placeholder for page-specific titles</p>
      </div>

      <div>
        <label className="block font-inter text-sm font-medium text-black mb-2">
          Default Meta Description
        </label>
        <textarea
          value={seoSettings.defaultDescription}
          onChange={(e) => updateSettings('defaultDescription', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border-2 border-black bg-white text-black font-inter focus:outline-none focus:border-black"
          placeholder="Default meta description for pages"
        />
        <p className="mt-1 text-sm text-black/60 font-inter">
          {seoSettings.defaultDescription.length}/160 characters
        </p>
      </div>

      <div>
        <label className="block font-inter text-sm font-medium text-black mb-2">
          Default Keywords
        </label>
        <input
          type="text"
          value={seoSettings.defaultKeywords.join(', ')}
          onChange={(e) => updateSettings('defaultKeywords', e.target.value.split(', ').filter(k => k.trim()))}
          className="w-full px-4 py-3 border-2 border-black bg-white text-black font-inter focus:outline-none focus:border-black"
          placeholder="keyword1, keyword2, keyword3"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-inter text-sm font-medium text-black mb-2">
            Twitter Handle
          </label>
          <input
            type="text"
            value={seoSettings.twitterHandle}
            onChange={(e) => updateSettings('twitterHandle', e.target.value)}
            className="w-full px-4 py-3 border-2 border-black bg-white text-black font-inter focus:outline-none focus:border-black"
            placeholder="@yourusername"
          />
        </div>

        <div>
          <label className="block font-inter text-sm font-medium text-black mb-2">
            Facebook App ID
          </label>
          <input
            type="text"
            value={seoSettings.facebookAppId}
            onChange={(e) => updateSettings('facebookAppId', e.target.value)}
            className="w-full px-4 py-3 border-2 border-black bg-white text-black font-inter focus:outline-none focus:border-black"
            placeholder="123456789"
          />
        </div>
      </div>
    </div>
  );

  const renderAnalyticsSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-inter text-sm font-medium text-black mb-2">
            Google Analytics 4 ID
          </label>
          <input
            type="text"
            value={seoSettings.googleAnalyticsId}
            onChange={(e) => updateSettings('googleAnalyticsId', e.target.value)}
            className="w-full px-4 py-3 border-2 border-black bg-white text-black font-inter focus:outline-none focus:border-black"
            placeholder="G-XXXXXXXXXX"
          />
        </div>

        <div>
          <label className="block font-inter text-sm font-medium text-black mb-2">
            Google Tag Manager ID
          </label>
          <input
            type="text"
            value={seoSettings.googleTagManagerId}
            onChange={(e) => updateSettings('googleTagManagerId', e.target.value)}
            className="w-full px-4 py-3 border-2 border-black bg-white text-black font-inter focus:outline-none focus:border-black"
            placeholder="GTM-XXXXXXX"
          />
        </div>

        <div>
          <label className="block font-inter text-sm font-medium text-black mb-2">
            Google Search Console
          </label>
          <input
            type="text"
            value={seoSettings.googleSearchConsoleId}
            onChange={(e) => updateSettings('googleSearchConsoleId', e.target.value)}
            className="w-full px-4 py-3 border-2 border-black bg-white text-black font-inter focus:outline-none focus:border-black"
            placeholder="Verification meta tag content"
          />
        </div>

        <div>
          <label className="block font-inter text-sm font-medium text-black mb-2">
            Bing Webmaster Tools
          </label>
          <input
            type="text"
            value={seoSettings.bingWebmasterToolsId}
            onChange={(e) => updateSettings('bingWebmasterToolsId', e.target.value)}
            className="w-full px-4 py-3 border-2 border-black bg-white text-black font-inter focus:outline-none focus:border-black"
            placeholder="Verification meta tag content"
          />
        </div>
      </div>

      <div className="bg-white border border-black p-6" style={{ backgroundColor: '#f0e3ff' }}>
        <h4 className="font-space-grotesk text-lg font-bold text-black mb-4">Quick Links</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="https://analytics.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-black text-white border border-black font-inter font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/25"
          >
            <span>Google Analytics</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          <a
            href="https://search.google.com/search-console"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-white text-black border border-black font-inter font-medium transition-all duration-300 hover:bg-black hover:text-white hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/15"
          >
            <span>Search Console</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          <a
            href="https://www.bing.com/webmasters"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-white text-black border border-black font-inter font-medium transition-all duration-300 hover:bg-black hover:text-white hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/15"
          >
            <span>Bing Webmaster</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );

  const renderPageSettingsSection = () => (
    <div className="space-y-8">
      {Object.entries(seoSettings.pageSettings).map(([path, settings]) => (
        <div key={path} className="bg-white border border-black p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-space-grotesk text-lg font-bold text-black">
              Page: {path === '/' ? 'Homepage' : path}
            </h4>
            <span className="px-3 py-1 bg-black text-white text-sm font-inter">{path}</span>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block font-inter text-sm font-medium text-black mb-2">
                Page Title
              </label>
              <input
                type="text"
                value={settings.title}
                onChange={(e) => updateSettings(`pageSettings.${path}.title`, e.target.value)}
                className="w-full px-4 py-3 border-2 border-black bg-white text-black font-inter focus:outline-none focus:border-black"
                placeholder="Page title"
              />
              <p className="mt-1 text-sm text-black/60 font-inter">
                {settings.title.length}/60 characters
              </p>
            </div>

            <div>
              <label className="block font-inter text-sm font-medium text-black mb-2">
                Meta Description
              </label>
              <textarea
                value={settings.description}
                onChange={(e) => updateSettings(`pageSettings.${path}.description`, e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border-2 border-black bg-white text-black font-inter focus:outline-none focus:border-black"
                placeholder="Page meta description"
              />
              <p className="mt-1 text-sm text-black/60 font-inter">
                {settings.description.length}/160 characters
              </p>
            </div>

            <div>
              <label className="block font-inter text-sm font-medium text-black mb-2">
                Keywords
              </label>
              <input
                type="text"
                value={settings.keywords.join(', ')}
                onChange={(e) => updateSettings(`pageSettings.${path}.keywords`, e.target.value.split(', ').filter(k => k.trim()))}
                className="w-full px-4 py-3 border-2 border-black bg-white text-black font-inter focus:outline-none focus:border-black"
                placeholder="keyword1, keyword2, keyword3"
              />
              <p className="mt-1 text-sm text-black/60 font-inter">
                {settings.keywords.length} keywords
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-inter text-sm font-medium text-black mb-2">
                  Open Graph Image
                </label>
                <input
                  type="text"
                  value={settings.ogImage}
                  onChange={(e) => updateSettings(`pageSettings.${path}.ogImage`, e.target.value)}
                  className="w-full px-4 py-3 border-2 border-black bg-white text-black font-inter focus:outline-none focus:border-black"
                  placeholder="/images/og-page.jpg"
                />
              </div>

              <div className="flex items-center space-x-4 pt-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.noindex}
                    onChange={(e) => updateSettings(`pageSettings.${path}.noindex`, e.target.checked)}
                    className="w-4 h-4 border-2 border-black"
                  />
                  <span className="font-inter text-sm text-black">No Index</span>
                </label>
              </div>

              <div className="flex items-center space-x-4 pt-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.nofollow}
                    onChange={(e) => updateSettings(`pageSettings.${path}.nofollow`, e.target.checked)}
                    className="w-4 h-4 border-2 border-black"
                  />
                  <span className="font-inter text-sm text-black">No Follow</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Add New Page Button */}
      <div className="bg-white border border-black p-6" style={{ backgroundColor: '#f0e3ff' }}>
        <h4 className="font-space-grotesk text-lg font-bold text-black mb-4">Add New Page SEO</h4>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="/new-page-path"
            className="flex-1 px-4 py-3 border-2 border-black bg-white text-black font-inter focus:outline-none focus:border-black"
          />
          <button className="px-6 py-3 bg-black text-white border border-black font-inter font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/25">
            Add Page
          </button>
        </div>
      </div>
    </div>
  );

  const renderSEOToolsSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-black p-6" style={{ backgroundColor: '#6bdbff' }}>
          <h4 className="font-space-grotesk text-lg font-bold text-black mb-4">Sitemap Management</h4>
          <p className="font-inter text-black/80 mb-4">
            Generate and manage your XML sitemap for better search engine crawling.
          </p>
          <div className="space-y-3">
            <button
              onClick={generateSitemap}
              className="w-full px-4 py-2 bg-black text-white border border-black font-inter font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/25"
            >
              Generate Sitemap
            </button>
            <a
              href="/sitemap.xml"
              target="_blank"
              className="block w-full px-4 py-2 bg-white text-black border border-black font-inter font-medium transition-all duration-300 hover:bg-black hover:text-white text-center"
            >
              View Current Sitemap
            </a>
          </div>
        </div>

        <div className="bg-white border border-black p-6" style={{ backgroundColor: '#f2e356' }}>
          <h4 className="font-space-grotesk text-lg font-bold text-black mb-4">Schema Testing</h4>
          <p className="font-inter text-black/80 mb-4">
            Test your structured data with Google's Rich Results Test.
          </p>
          <div className="space-y-3">
            <button
              onClick={testStructuredData}
              className="w-full px-4 py-2 bg-black text-white border border-black font-inter font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/25"
            >
              Test Structured Data
            </button>
            <a
              href="https://search.google.com/test/rich-results"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full px-4 py-2 bg-white text-black border border-black font-inter font-medium transition-all duration-300 hover:bg-black hover:text-white text-center"
            >
              Open Testing Tool
            </a>
          </div>
        </div>
      </div>

      <div className="bg-white border border-black p-6">
        <h4 className="font-space-grotesk text-lg font-bold text-black mb-4">SEO Analysis</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 border border-black" style={{ backgroundColor: '#51bd94' }}>
            <div className="font-space-grotesk text-2xl font-bold text-black">85</div>
            <div className="font-inter text-sm text-black">SEO Score</div>
          </div>
          <div className="text-center p-4 border border-black" style={{ backgroundColor: '#ff91e9' }}>
            <div className="font-space-grotesk text-2xl font-bold text-black">24</div>
            <div className="font-inter text-sm text-black">Indexed Pages</div>
          </div>
          <div className="text-center p-4 border border-black" style={{ backgroundColor: '#6bdbff' }}>
            <div className="font-space-grotesk text-2xl font-bold text-black">156</div>
            <div className="font-inter text-sm text-black">Backlinks</div>
          </div>
          <div className="text-center p-4 border border-black" style={{ backgroundColor: '#f2e356' }}>
            <div className="font-space-grotesk text-2xl font-bold text-black">3.2s</div>
            <div className="font-inter text-sm text-black">Page Speed</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSchemaSection = () => (
    <div className="space-y-6">
      <div>
        <label className="block font-inter text-sm font-medium text-black mb-2">
          Organization Type
        </label>
        <select
          value={seoSettings.organizationType}
          onChange={(e) => updateSettings('organizationType', e.target.value)}
          className="w-full px-4 py-3 border-2 border-black bg-white text-black font-inter focus:outline-none focus:border-black"
        >
          <option value="Organization">Organization</option>
          <option value="Corporation">Corporation</option>
          <option value="LocalBusiness">Local Business</option>
          <option value="ProfessionalService">Professional Service</option>
          <option value="WebSite">Website</option>
        </select>
      </div>

      <div>
        <label className="block font-inter text-sm font-medium text-black mb-2">
          Organization Name
        </label>
        <input
          type="text"
          value={seoSettings.organizationName}
          onChange={(e) => updateSettings('organizationName', e.target.value)}
          className="w-full px-4 py-3 border-2 border-black bg-white text-black font-inter focus:outline-none focus:border-black"
          placeholder="Your organization name"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-inter text-sm font-medium text-black mb-2">
            Organization Logo URL
          </label>
          <input
            type="text"
            value={seoSettings.organizationLogo}
            onChange={(e) => updateSettings('organizationLogo', e.target.value)}
            className="w-full px-4 py-3 border-2 border-black bg-white text-black font-inter focus:outline-none focus:border-black"
            placeholder="/images/logo.png"
          />
        </div>

        <div>
          <label className="block font-inter text-sm font-medium text-black mb-2">
            Organization Email
          </label>
          <input
            type="email"
            value={seoSettings.organizationEmail}
            onChange={(e) => updateSettings('organizationEmail', e.target.value)}
            className="w-full px-4 py-3 border-2 border-black bg-white text-black font-inter focus:outline-none focus:border-black"
            placeholder="contact@example.com"
          />
        </div>
      </div>

      <div>
        <label className="block font-inter text-sm font-medium text-black mb-2">
          Organization Phone
        </label>
        <input
          type="tel"
          value={seoSettings.organizationPhone}
          onChange={(e) => updateSettings('organizationPhone', e.target.value)}
          className="w-full px-4 py-3 border-2 border-black bg-white text-black font-inter focus:outline-none focus:border-black"
          placeholder="+1-555-123-4567"
        />
      </div>

      <div className="space-y-4">
        <h4 className="font-space-grotesk text-lg font-bold text-black">Organization Address</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-inter text-sm font-medium text-black mb-2">
              Street Address
            </label>
            <input
              type="text"
              value={seoSettings.organizationAddress.streetAddress}
              onChange={(e) => updateSettings('organizationAddress.streetAddress', e.target.value)}
              className="w-full px-4 py-3 border-2 border-black bg-white text-black font-inter focus:outline-none focus:border-black"
              placeholder="123 Main Street"
            />
          </div>

          <div>
            <label className="block font-inter text-sm font-medium text-black mb-2">
              City
            </label>
            <input
              type="text"
              value={seoSettings.organizationAddress.addressLocality}
              onChange={(e) => updateSettings('organizationAddress.addressLocality', e.target.value)}
              className="w-full px-4 py-3 border-2 border-black bg-white text-black font-inter focus:outline-none focus:border-black"
              placeholder="New York"
            />
          </div>

          <div>
            <label className="block font-inter text-sm font-medium text-black mb-2">
              State/Region
            </label>
            <input
              type="text"
              value={seoSettings.organizationAddress.addressRegion}
              onChange={(e) => updateSettings('organizationAddress.addressRegion', e.target.value)}
              className="w-full px-4 py-3 border-2 border-black bg-white text-black font-inter focus:outline-none focus:border-black"
              placeholder="NY"
            />
          </div>

          <div>
            <label className="block font-inter text-sm font-medium text-black mb-2">
              Postal Code
            </label>
            <input
              type="text"
              value={seoSettings.organizationAddress.postalCode}
              onChange={(e) => updateSettings('organizationAddress.postalCode', e.target.value)}
              className="w-full px-4 py-3 border-2 border-black bg-white text-black font-inter focus:outline-none focus:border-black"
              placeholder="10001"
            />
          </div>
        </div>

        <div>
          <label className="block font-inter text-sm font-medium text-black mb-2">
            Country
          </label>
          <select
            value={seoSettings.organizationAddress.addressCountry}
            onChange={(e) => updateSettings('organizationAddress.addressCountry', e.target.value)}
            className="w-full px-4 py-3 border-2 border-black bg-white text-black font-inter focus:outline-none focus:border-black"
          >
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="GB">United Kingdom</option>
            <option value="AU">Australia</option>
            <option value="DE">Germany</option>
            <option value="FR">France</option>
            <option value="ES">Spain</option>
            <option value="IT">Italy</option>
            <option value="JP">Japan</option>
            <option value="CN">China</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-black p-6" style={{ backgroundColor: '#f0e3ff' }}>
        <h4 className="font-space-grotesk text-lg font-bold text-black mb-4">Schema.org Preview</h4>
        <pre className="font-mono text-xs text-black bg-gray-100 p-4 border border-gray-300 overflow-x-auto">
{`{
  "@context": "https://schema.org",
  "@type": "${seoSettings.organizationType}",
  "name": "${seoSettings.organizationName}",
  "email": "${seoSettings.organizationEmail}",
  "telephone": "${seoSettings.organizationPhone}",
  "logo": "${seoSettings.canonicalBaseURL}${seoSettings.organizationLogo}",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "${seoSettings.organizationAddress.streetAddress}",
    "addressLocality": "${seoSettings.organizationAddress.addressLocality}",
    "addressRegion": "${seoSettings.organizationAddress.addressRegion}",
    "postalCode": "${seoSettings.organizationAddress.postalCode}",
    "addressCountry": "${seoSettings.organizationAddress.addressCountry}"
  }
}`}
        </pre>
      </div>
    </div>
  );

  const renderTechnicalSEOSection = () => (
    <div className="space-y-6">
      <div>
        <label className="block font-inter text-sm font-medium text-black mb-2">
          Canonical Base URL
        </label>
        <input
          type="url"
          value={seoSettings.canonicalBaseURL}
          onChange={(e) => updateSettings('canonicalBaseURL', e.target.value)}
          className="w-full px-4 py-3 border-2 border-black bg-white text-black font-inter focus:outline-none focus:border-black"
          placeholder="https://your-domain.com"
        />
        <p className="mt-1 text-sm text-black/60 font-inter">
          Used for canonical URLs and absolute links
        </p>
      </div>

      <div>
        <label className="block font-inter text-sm font-medium text-black mb-2">
          Robots.txt Content
        </label>
        <textarea
          value={seoSettings.robotsTxt}
          onChange={(e) => updateSettings('robotsTxt', e.target.value)}
          rows={8}
          className="w-full px-4 py-3 border-2 border-black bg-white text-black font-inter font-mono text-sm focus:outline-none focus:border-black"
          placeholder="User-agent: *&#10;Allow: /&#10;Disallow: /admin/"
        />
        <div className="flex items-center justify-between mt-2">
          <p className="text-sm text-black/60 font-inter">
            Configure search engine crawler behavior
          </p>
          <a
            href="/robots.txt"
            target="_blank"
            className="text-sm text-blue-600 hover:text-blue-800 font-inter"
          >
            View Current →
          </a>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-space-grotesk text-lg font-bold text-black">Sitemap Configuration</h4>
        
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={seoSettings.sitemapSettings.enabled}
              onChange={(e) => updateSettings('sitemapSettings.enabled', e.target.checked)}
              className="w-4 h-4 border-2 border-black"
            />
            <span className="font-inter text-sm text-black">Enable XML Sitemap</span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-inter text-sm font-medium text-black mb-2">
              Default Priority
            </label>
            <select
              value={seoSettings.sitemapSettings.priority}
              onChange={(e) => updateSettings('sitemapSettings.priority', parseFloat(e.target.value))}
              className="w-full px-4 py-3 border-2 border-black bg-white text-black font-inter focus:outline-none focus:border-black"
            >
              <option value={1.0}>1.0 (Highest)</option>
              <option value={0.9}>0.9</option>
              <option value={0.8}>0.8 (High)</option>
              <option value={0.7}>0.7</option>
              <option value={0.6}>0.6</option>
              <option value={0.5}>0.5 (Medium)</option>
              <option value={0.4}>0.4</option>
              <option value={0.3}>0.3</option>
              <option value={0.2}>0.2</option>
              <option value={0.1}>0.1 (Lowest)</option>
            </select>
          </div>

          <div>
            <label className="block font-inter text-sm font-medium text-black mb-2">
              Change Frequency
            </label>
            <select
              value={seoSettings.sitemapSettings.changefreq}
              onChange={(e) => updateSettings('sitemapSettings.changefreq', e.target.value)}
              className="w-full px-4 py-3 border-2 border-black bg-white text-black font-inter focus:outline-none focus:border-black"
            >
              <option value="always">Always</option>
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="never">Never</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          <h5 className="font-space-grotesk font-semibold text-black">Include in Sitemap:</h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={seoSettings.sitemapSettings.includePosts}
                onChange={(e) => updateSettings('sitemapSettings.includePosts', e.target.checked)}
                className="w-4 h-4 border-2 border-black"
              />
              <span className="font-inter text-sm text-black">Blog Posts</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={seoSettings.sitemapSettings.includeGuides}
                onChange={(e) => updateSettings('sitemapSettings.includeGuides', e.target.checked)}
                className="w-4 h-4 border-2 border-black"
              />
              <span className="font-inter text-sm text-black">Guides</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={seoSettings.sitemapSettings.includeUserPages}
                onChange={(e) => updateSettings('sitemapSettings.includeUserPages', e.target.checked)}
                className="w-4 h-4 border-2 border-black"
              />
              <span className="font-inter text-sm text-black">User Pages</span>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white border border-black p-6" style={{ backgroundColor: '#6bdbff' }}>
        <h4 className="font-space-grotesk text-lg font-bold text-black mb-4">Generate Files</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={generateRobotsTxt}
            className="w-full px-4 py-3 bg-black text-white border border-black font-inter font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/25"
          >
            Generate robots.txt
          </button>
          <button
            onClick={generateSitemap}
            className="w-full px-4 py-3 bg-white text-black border border-black font-inter font-medium transition-all duration-300 hover:bg-black hover:text-white"
          >
            Generate sitemap.xml
          </button>
        </div>
      </div>
    </div>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'global':
        return renderGlobalMetaSection();
      case 'schema':
        return renderSchemaSection();
      case 'technical':
        return renderTechnicalSEOSection();
      case 'analytics':
        return renderAnalyticsSection();
      case 'pages':
        return renderPageSettingsSection();
      case 'tools':
        return renderSEOToolsSection();
      default:
        return (
          <div className="text-center py-12">
            <div className="font-space-grotesk text-lg text-black">
              {sections.find(s => s.id === activeSection)?.label} settings coming soon!
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-black p-8" style={{ backgroundColor: '#6bdbff' }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-space-grotesk text-2xl font-bold text-black">SEO Settings</h2>
            <p className="font-inter text-black/80 mt-1">
              Manage search engine optimization and analytics
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              disabled={isSaving}
              className="px-6 py-3 bg-white text-black border border-black font-inter font-medium transition-all duration-300 hover:bg-red-50 hover:border-red-600 hover:text-red-600 disabled:opacity-50"
            >
              Reset to Defaults
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-3 bg-black text-white border border-black font-inter font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/25 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border border-black">
        <div className="flex gap-0 overflow-x-auto">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center space-x-2 px-6 py-4 font-inter font-semibold text-sm transition-all duration-300 border-r border-black last:border-r-0 whitespace-nowrap ${
                activeSection === section.id
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-black hover:text-white'
              }`}
            >
              <span>{section.icon}</span>
              <span>{section.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white border border-black p-8">
        {renderActiveSection()}
      </div>
    </div>
  );
}