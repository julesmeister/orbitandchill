/* eslint-disable react/no-unescaped-entities */
"use client";

import React from 'react';
import Link from 'next/link';
import { BRAND } from '@/config/brand';
import FeatureCard from '@/components/learning-center/FeatureCard';
import AdditionalFeatureCard from '@/components/learning-center/AdditionalFeatureCard';
import QuickStartStep from '@/components/learning-center/QuickStartStep';
import CTAButton from '@/components/learning-center/CTAButton';
import AstrologyResources from '@/components/reusable/AstrologyResources';

export default function LearningCenterClient() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="px-[5%] py-16">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-space-grotesk text-5xl md:text-6xl font-bold text-black mb-6">
            Learning Center
          </h1>
          <p className="font-open-sans text-xl text-black/80 leading-relaxed max-w-3xl mx-auto">
            Master the features of {BRAND.name} and deepen your understanding of astrology with our comprehensive guides.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-[5%] py-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-space-grotesk text-3xl font-bold text-black mb-8 text-center">Master {BRAND.name}'s Features</h2>
          
          {/* Featured Guides Grid - 2x2 Connected */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white border border-black mb-12">
            <FeatureCard
              title="Natal Chart Analysis"
              description="Your natal chart is a cosmic snapshot of the sky at your exact moment of birth. It reveals your personality traits, life purpose, and potential challenges."
              icon={
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              }
              backgroundColor="#6bdbff"
              badge={{ text: "Available Now" }}
              instructions={[
                "Enter your birth date, time, and location in the form on the homepage",
                "Click 'Generate Chart' to create your personalized natal chart",
                "View your Sun sign, Moon sign, Rising sign, and planetary placements",
                "Explore the 12 houses to understand different life areas"
              ]}
              proTip="Save your chart data to quickly access it later and track transits affecting your birth placements."
              ctaText="Try Natal Chart"
              ctaLink="/chart"
              className="border-r border-b border-black"
            />

            <FeatureCard
              title="Horary Astrology"
              description="Horary astrology answers specific questions by creating a chart for the moment the question is asked. It's like consulting the cosmos for guidance."
              icon={
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              backgroundColor="#f2e356"
              badge={{ text: "New Feature!", animated: true }}
              instructions={[
                "Navigate to the Horary page from the menu",
                "Type your sincere question (avoid yes/no questions)",
                "Select a category that best fits your question",
                "Submit to generate a horary chart and receive cosmic guidance"
              ]}
              proTip="Ask clear, specific questions about matters that genuinely concern you for the most accurate readings."
              ctaText="Learn Horary"
              ctaLink="/guides/horary-astrology"
              className="border-b border-black"
            />

            <FeatureCard
              title="Astrocartography"
              description="Discover how different locations around the world can enhance various aspects of your life based on your birth chart's planetary lines."
              icon={
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              backgroundColor="#51bd94"
              badge={{ text: "Available Now" }}
              instructions={[
                "Generate your natal chart first (required for calculations)",
                "Go to the Astrocartography page",
                "View your planetary power lines on the world map",
                "Click any location to see which planetary energies are strongest there"
              ]}
              proTip="Look for Jupiter lines for luck and expansion, Venus lines for love and beauty, or Sun lines for success and vitality."
              ctaText="Explore Map"
              ctaLink="/astrocartography"
              className="border-r border-black"
            />

            <FeatureCard
              title="Event Planning"
              description="Use electional astrology to find the most auspicious times for important events like weddings, business launches, or major decisions."
              icon={<span className="text-3xl">🗓️</span>}
              backgroundColor="#ff91e9"
              badge={{ text: "Available Now" }}
              instructions={[
                "Navigate to the Events page",
                "Select your event type (wedding, business, travel, etc.)",
                "Choose your preferred date range and location",
                "View optimal timing suggestions based on planetary alignments"
              ]}
              proTip="Avoid Mercury retrograde for contracts and communication, and choose Venus-ruled days for weddings and social events."
              ctaText="Plan Events"
              ctaLink="/events"
            />
          </div>
        </div>
      </section>

      {/* Additional Features Section */}
      <section className="px-[5%] py-12">
        <div className="max-w-7xl mx-auto">
          <h3 className="font-space-grotesk text-2xl font-bold text-black mb-8 text-center">More Features to Explore</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border border-black">
            <AdditionalFeatureCard
              title="Community Forum"
              description="Join discussions, share insights, and learn from fellow astrology enthusiasts."
              icon={
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              }
              ctaText="Join Discussions"
              ctaLink="/discussions"
              className="border-r border-b border-black"
            />

            <AdditionalFeatureCard
              title="Chart History"
              description="Access all your previously generated charts and horary questions."
              icon={
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
              ctaText="View History"
              ctaLink="/chart"
              className="border-r border-b border-black lg:border-r-0"
            />

            <AdditionalFeatureCard
              title="Astrology Guides"
              description="Deep dive into aspects, houses, signs, and advanced astrological concepts."
              icon={
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              }
              ctaText="Read Guides"
              ctaLink="/guides"
              className="border-b border-black"
            />
          </div>
        </div>
      </section>

      {/* Quick Start Guide Section */}
      <section className="px-[5%] py-12" style={{ backgroundColor: '#f0e3ff' }}>
        <div className="max-w-7xl mx-auto">
          <div className="bg-white border border-black p-8">
            <h3 className="font-space-grotesk text-2xl font-bold text-black mb-8 text-center">Quick Start Guide</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
              <QuickStartStep
                stepNumber={1}
                title="Create Your Profile"
                description="Enter your birth details on the homepage to generate your natal chart"
                className="border-r border-black"
              />
              
              <QuickStartStep
                stepNumber={2}
                title="Explore Features"
                description="Try horary questions, check your astrocartography, or plan events"
                className="border-r border-black"
              />
              
              <QuickStartStep
                stepNumber={3}
                title="Join Community"
                description="Share insights and learn from others in our discussion forums"
              />
            </div>
          </div>
        </div>
      </section>

      {/* External Resources Section */}
      <section className="px-[5%] py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <AstrologyResources />
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-[5%] py-16">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="font-space-grotesk text-3xl md:text-4xl font-bold text-black mb-4">Ready to Begin Your Astrological Journey?</h3>
          <p className="font-open-sans text-lg text-black/80 mb-8 max-w-2xl mx-auto">
            {BRAND.name} combines ancient wisdom with modern technology to help you understand yourself and navigate life's journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CTAButton
              href="/"
              text="Start Exploring"
              variant="primary"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              }
            />
            <CTAButton
              href="/discussions"
              text="Join Community"
              variant="secondary"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              }
            />
          </div>
        </div>
      </section>
    </div>
  );
}