/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from 'react';
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
        title: `Professional Astrology Charts & Insights | ${BRAND.name}`,
        description: 'Generate accurate natal charts with professional-grade calculations. Explore astrology insights and connect with our community.',
        keywords: ['astrology', 'natal chart', 'birth chart', 'horoscope'],
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
      }
    }
  });

  const [isSaving, setIsSaving] = useState(false);

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
      // Save SEO settings to database/API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      console.log('SEO settings saved:', seoSettings);
    } catch (error) {
      console.error('Error saving SEO settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const generateSitemap = async () => {
    try {
      // Trigger sitemap generation
      console.log('Generating sitemap...');
    } catch (error) {
      console.error('Error generating sitemap:', error);
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

  if (isLoading) {
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

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'global':
        return renderGlobalMetaSection();
      case 'analytics':
        return renderAnalyticsSection();
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
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-3 bg-black text-white border border-black font-inter font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/25 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
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