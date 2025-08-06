import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { BRAND } from '@/config/brand';
import FullWidthSection from '@/components/about/FullWidthSection';
import PrivacyFeatureCard from '@/components/privacy/PrivacyFeatureCard';
import InfoSection from '@/components/privacy/InfoSection';
import ListItem from '@/components/privacy/ListItem';
import UsageCard from '@/components/privacy/UsageCard';
import RightsCard from '@/components/privacy/RightsCard';
import PrivacyStructuredData from '@/components/SEO/PrivacyStructuredData';
import FAQStructuredData, { privacyFAQs } from '@/components/SEO/FAQStructuredData';

export const metadata: Metadata = {
  title: `Privacy Policy | ${BRAND.name}`,
  description: 'Your privacy is important to us. Learn how Orbit and Chill collects, uses, and protects your information. No account required, local storage first.',
  keywords: 'privacy policy, data protection, astrology privacy, secure astrology, data collection, user privacy',
  openGraph: {
    title: `Privacy Policy | ${BRAND.name}`,
    description: 'Your privacy is important to us. Learn how we collect, use, and protect your information.',
    type: 'website',
    url: `${BRAND.domain}/privacy`,
    siteName: BRAND.name,
    images: [{
      url: `${BRAND.domain}/images/logo.png`,
      width: 1200,
      height: 630,
      alt: `${BRAND.name} Privacy Policy`
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: `Privacy Policy | ${BRAND.name}`,
    description: 'Your privacy is important to us. Learn how we collect, use, and protect your information.',
    site: BRAND.socialHandles.twitter,
    creator: BRAND.socialHandles.twitter,
    images: [`${BRAND.domain}/images/logo.png`]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function PrivacyPage() {
  return (
    <>
      <PrivacyStructuredData />
      <FAQStructuredData faqs={privacyFAQs} pageTitle="Privacy Policy FAQ" />
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <div className="min-h-screen bg-white">
        {/* Header */}
        <section className="px-6 md:px-12 lg:px-20 py-16">
          <div className="text-center">
            <h1 className="font-space-grotesk text-5xl md:text-6xl font-bold text-black mb-6">Privacy Policy</h1>
            <p className="font-open-sans text-xl text-black/80">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
            <p className="font-open-sans text-sm text-black/60 mt-4">Last updated: December 6, 2024</p>
          </div>
        </section>

        {/* Quick Overview */}
        <FullWidthSection className="py-12" style={{ backgroundColor: '#f0e3ff' }}>
          <div>
            <h2 className="font-space-grotesk text-3xl font-bold text-black mb-8 text-center">Privacy at a Glance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-black">
              <PrivacyFeatureCard
                title="No Account Required"
                description="Use our service without creating an account"
                showRightBorder={true}
                showBottomBorder={true}
                icon={
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                }
              />
              <PrivacyFeatureCard
                title="Local Storage First"
                description="Your data stays in your browser when possible"
                showBottomBorder={true}
                icon={
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                }
              />
              <PrivacyFeatureCard
                title="Minimal Data Collection"
                description="We only collect what's necessary for the service"
                showRightBorder={true}
                icon={
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                }
              />
              <PrivacyFeatureCard
                title="Your Data, Your Control"
                description="Delete your data anytime from your browser"
                icon={
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                }
              />
            </div>
          </div>
        </FullWidthSection>

        {/* Information We Collect */}
        <InfoSection 
          title="Information We Collect"
          className="bg-[#f7f0ff]"
        >
          <div className="space-y-8">
            <div>
              <h3 className="font-space-grotesk text-2xl font-bold text-black mb-4">1. Anonymous Users</h3>
              <p className="font-open-sans text-lg text-black/80 mb-4">
                You can use {BRAND.name} without creating an account. For anonymous users:
              </p>
              <ul className="space-y-3">
                <ListItem>Birth date, time, and location for chart calculations (stored locally in your browser)</ListItem>
                <ListItem>Anonymous identifier for tracking your own data (no personal information)</ListItem>
                <ListItem>Usage analytics (page views, feature usage) without personal identification</ListItem>
              </ul>
            </div>

            <div>
              <h3 className="font-space-grotesk text-2xl font-bold text-black mb-4">2. Registered Users</h3>
              <p className="font-open-sans text-lg text-black/80 mb-4">
                If you choose to create an account:
              </p>
              <ul className="space-y-3">
                <ListItem>Email address (for account recovery and optional notifications)</ListItem>
                <ListItem>Display name (can be a pseudonym)</ListItem>
                <ListItem>Google account information (if you sign in with Google)</ListItem>
                <ListItem>Birth information for saved charts</ListItem>
                <ListItem>Forum posts and community interactions</ListItem>
              </ul>
            </div>
          </div>
        </InfoSection>

        {/* How We Use Your Information */}
        <InfoSection 
          title="How We Use Your Information"
          className="bg-[#ffecdb]"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UsageCard
              title="Chart Calculations"
              description="Process birth data to generate astrological charts"
            />
            <UsageCard
              title="Save Your Preferences"
              description="Remember your settings and saved charts"
            />
            <UsageCard
              title="Community Features"
              description="Enable forum participation and discussions"
            />
            <UsageCard
              title="Service Improvements"
              description="Analyze usage patterns to enhance features"
            />
          </div>
        </InfoSection>

        {/* Data Storage */}
        <InfoSection 
          title="Data Storage & Security"
          className="bg-[#e6f7ff]"
        >
          <div className="space-y-6">
            <div>
              <h3 className="font-space-grotesk text-2xl font-bold text-black mb-4">Where Your Data Lives</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-black/10">
                  <h4 className="font-space-grotesk text-xl font-semibold text-black mb-3">Local Storage (Your Browser)</h4>
                  <ul className="space-y-2">
                    <ListItem>Birth data for anonymous users</ListItem>
                    <ListItem>UI preferences and settings</ListItem>
                    <ListItem>Temporary chart calculations</ListItem>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-black/10">
                  <h4 className="font-space-grotesk text-xl font-semibold text-black mb-3">Our Secure Servers</h4>
                  <ul className="space-y-2">
                    <ListItem>Account information for registered users</ListItem>
                    <ListItem>Saved charts and bookmarks</ListItem>
                    <ListItem>Forum posts and community content</ListItem>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-space-grotesk text-2xl font-bold text-black mb-4">Security Measures</h3>
              <ul className="space-y-3">
                <ListItem>Encrypted connections (HTTPS) for all data transfers</ListItem>
                <ListItem>Secure database with encryption at rest</ListItem>
                <ListItem>Regular security audits and updates</ListItem>
                <ListItem>No storage of sensitive payment information</ListItem>
              </ul>
            </div>
          </div>
        </InfoSection>

        {/* Your Rights */}
        <InfoSection 
          title="Your Rights & Choices"
          className="bg-[#fff5eb]"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <RightsCard
              title="Access Your Data"
              description="Request a copy of all data we have about you"
              backgroundColor="#f9f9f9"
            />
            <RightsCard
              title="Update Information"
              description="Correct or update your personal information"
              backgroundColor="#f9f9f9"
            />
            <RightsCard
              title="Delete Your Data"
              description="Request deletion of your account and data"
              backgroundColor="#f9f9f9"
            />
            <RightsCard
              title="Control Privacy"
              description="Manage what information is public or private"
              backgroundColor="#f9f9f9"
            />
            <RightsCard
              title="Opt Out"
              description="Disable analytics and marketing communications"
              backgroundColor="#f9f9f9"
            />
            <RightsCard
              title="Data Portability"
              description="Export your data in a machine-readable format"
              backgroundColor="#f9f9f9"
            />
          </div>
        </InfoSection>

        {/* Third Party Services */}
        <InfoSection 
          title="Third Party Services"
          className="bg-[#f0f9ff]"
        >
          <p className="font-open-sans text-lg text-black/80 mb-6">
            We use select third-party services to enhance your experience:
          </p>
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-black/10">
              <h4 className="font-space-grotesk text-xl font-semibold text-black mb-2">Google Analytics</h4>
              <p className="font-open-sans text-black/70">
                For understanding usage patterns and improving our service. You can opt out using browser extensions.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-black/10">
              <h4 className="font-space-grotesk text-xl font-semibold text-black mb-2">Google OAuth</h4>
              <p className="font-open-sans text-black/70">
                Optional sign-in method. We only access basic profile information (name, email, profile picture).
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-black/10">
              <h4 className="font-space-grotesk text-xl font-semibold text-black mb-2">Vercel</h4>
              <p className="font-open-sans text-black/70">
                Our hosting provider. They process data according to their privacy policy and security standards.
              </p>
            </div>
          </div>
        </InfoSection>

        {/* Updates & Contact */}
        <InfoSection 
          title="Updates & Contact"
          className="bg-[#faf5ff]"
        >
          <div className="space-y-6">
            <div>
              <h3 className="font-space-grotesk text-2xl font-bold text-black mb-4">Policy Updates</h3>
              <p className="font-open-sans text-lg text-black/80">
                We may update this privacy policy from time to time. We will notify you of any significant changes 
                by posting a notice on our website or sending you an email (for registered users).
              </p>
            </div>

            <div>
              <h3 className="font-space-grotesk text-2xl font-bold text-black mb-4">Contact Us</h3>
              <p className="font-open-sans text-lg text-black/80 mb-4">
                If you have questions about this privacy policy or your data:
              </p>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-black/10">
                <p className="font-open-sans text-black/80">
                  Email: <a href={`mailto:${BRAND.email}`} className="text-indigo-600 hover:text-indigo-700 underline">
                    {BRAND.email}
                  </a>
                </p>
                <p className="font-open-sans text-black/80 mt-2">
                  Or use our <Link href="/contact" className="text-indigo-600 hover:text-indigo-700 underline">
                    contact form
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </InfoSection>

        {/* Footer */}
        <section className="px-6 md:px-12 lg:px-20 py-12 bg-black text-white">
          <div className="text-center">
            <p className="font-open-sans text-lg">
              By using {BRAND.name}, you agree to this Privacy Policy.
            </p>
            <div className="mt-6 space-x-6">
              <Link href="/terms-of-service" className="text-white/80 hover:text-white underline">
                Terms of Service
              </Link>
              <Link href="/" className="text-white/80 hover:text-white underline">
                Back to Home
              </Link>
            </div>
          </div>
        </section>
        </div>
      </div>
    </>
  );
}