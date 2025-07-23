"use client";

import React from 'react';
import Link from 'next/link';
import { BRAND } from '@/config/brand';
import FullWidthSection from '@/components/about/FullWidthSection';
import PrivacyFeatureCard from '@/components/privacy/PrivacyFeatureCard';
import InfoSection from '@/components/privacy/InfoSection';
import ListItem from '@/components/privacy/ListItem';
import UsageCard from '@/components/privacy/UsageCard';
import RightsCard from '@/components/privacy/RightsCard';

export default function PrivacyPage() {
  return (
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
                title="You Control Your Data"
                description="Delete your information anytime"
                showRightBorder={true}
                icon={
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                }
              />
              <PrivacyFeatureCard
                title="No Selling of Data"
                description="We never sell your personal information"
                icon={
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                  </svg>
                }
              />
            </div>
          </div>
        </FullWidthSection>

        {/* Main Content */}
        <FullWidthSection className="py-12">
          <div className="space-y-12">
            {/* Information We Collect */}
            <InfoSection title="Information We Collect">
              <div className="space-y-6">
                <div>
                  <h3 className="font-open-sans text-lg font-semibold text-black mb-3">Birth Data</h3>
                  <p className="font-open-sans text-black/80 mb-3">
                    To generate your natal chart, we collect:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <ListItem>Date of birth</ListItem>
                    <ListItem>Time of birth</ListItem>
                    <ListItem>Location of birth (city/coordinates)</ListItem>
                  </ul>
                  <p className="font-open-sans text-sm text-black/60 mt-3">
                    This information is stored locally in your browser&apos;s IndexedDB and only transmitted to our servers for chart calculation.
                  </p>
                </div>

                <div>
                  <h3 className="font-open-sans text-lg font-semibold text-black mb-3">Optional Information</h3>
                  <p className="font-open-sans text-black/80 mb-3">
                    If you choose to sign in with Google, we may collect:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <ListItem>Email address</ListItem>
                    <ListItem>Name</ListItem>
                    <ListItem>Profile picture</ListItem>
                  </ul>
                </div>

                <div>
                  <h3 className="font-open-sans text-lg font-semibold text-black mb-3">Technical Information</h3>
                  <p className="font-open-sans text-black/80 mb-3">
                    We automatically collect certain technical information:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <ListItem>Browser type and version</ListItem>
                    <ListItem>Device information</ListItem>
                    <ListItem>IP address (anonymized)</ListItem>
                    <ListItem>Usage patterns (anonymized)</ListItem>
                  </ul>
                </div>
              </div>
            </InfoSection>

            {/* How We Use Information */}
            <InfoSection title="How We Use Your Information">
              <div className="space-y-4">
                <UsageCard
                  title="Chart Generation"
                  description="Your birth data is used solely to calculate and generate your astrological charts using astronomy-engine."
                />
                <UsageCard
                  title="Service Improvement"
                  description="Anonymized usage data helps us improve our platform and add new features."
                />
                <UsageCard
                  title="Communication"
                  description="If you contact us, we use your email to respond to your inquiries."
                />
                <UsageCard
                  title="Legal Compliance"
                  description="We may process data to comply with legal obligations or protect our rights."
                />
              </div>
            </InfoSection>

            {/* Data Storage and Security */}
            <InfoSection title="Data Storage and Security">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-open-sans text-lg font-semibold text-black mb-3">Where Your Data Lives</h3>
                  <ul className="space-y-2">
                    <ListItem variant="check">
                      <strong>Primarily:</strong> Your browser&apos;s local storage
                    </ListItem>
                    <ListItem variant="check">
                      <strong>Temporarily:</strong> Our servers for chart calculation
                    </ListItem>
                    <ListItem variant="check">
                      <strong>Optional:</strong> Our database (if you create an account)
                    </ListItem>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-open-sans text-lg font-semibold text-black mb-3">Security Measures</h3>
                  <ul className="space-y-2">
                    <ListItem variant="check" icon={
                      <svg className="w-5 h-5 text-black mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    }>
                      HTTPS encryption for all communications
                    </ListItem>
                    <ListItem variant="check" icon={
                      <svg className="w-5 h-5 text-black mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    }>
                      Encrypted database storage
                    </ListItem>
                    <ListItem variant="check" icon={
                      <svg className="w-5 h-5 text-black mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    }>
                      Regular security audits
                    </ListItem>
                    <ListItem variant="check" icon={
                      <svg className="w-5 h-5 text-black mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    }>
                      Limited access controls
                    </ListItem>
                  </ul>
                </div>
              </div>
            </InfoSection>

            {/* Your Rights */}
            <InfoSection title="Your Rights and Choices">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                <div className="space-y-0">
                  <RightsCard
                    title="Access Your Data"
                    description="View all information we have about you at any time through your profile page."
                    backgroundColor="#6bdbff"
                    borderClasses="border border-black"
                  />
                  <RightsCard
                    title="Update Information"
                    description="Correct or update your birth data and personal information directly in the app."
                    backgroundColor="#51bd94"
                    borderClasses="border-l border-r border-b border-black"
                  />
                </div>
                
                <div className="space-y-0">
                  <RightsCard
                    title="Delete Your Data"
                    description="Remove all your information from our systems permanently at any time."
                    backgroundColor="#ff91e9"
                    borderClasses="border-t border-r border-b border-black"
                  />
                  <RightsCard
                    title="Data Portability"
                    description="Export your data in a machine-readable format to use elsewhere."
                    backgroundColor="#f2e356"
                    borderClasses="border-r border-b border-black"
                  />
                </div>
              </div>
            </InfoSection>
          </div>
        </FullWidthSection>
        
        <FullWidthSection className="py-16" style={{ backgroundColor: '#f0e3ff' }}>
          <div className="bg-white border border-black p-8">
            <h2 className="font-space-grotesk text-2xl font-bold text-black mb-6">Questions About Privacy?</h2>
            <p className="font-open-sans text-black/80 mb-6">
              If you have any questions about this privacy policy or how we handle your data, 
              please don&apos;t hesitate to reach out.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/contact" 
                className="inline-flex items-center space-x-2 bg-black text-white px-8 py-4 border-2 border-black font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/25"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Contact Us</span>
              </Link>
              <a 
                href={`mailto:${BRAND.email}`} 
                className="inline-flex items-center space-x-2 bg-transparent text-black px-8 py-4 border-2 border-black font-semibold transition-all duration-300 hover:bg-black hover:text-white hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/15"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                <span>{BRAND.email}</span>
              </a>
            </div>
          </div>
        </FullWidthSection>
      </div>
    </div>
  );
}