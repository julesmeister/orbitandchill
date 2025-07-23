"use client";

import React from 'react';
import Link from 'next/link';
import { BRAND } from '@/config/brand';
import IconBox from '@/components/about/IconBox';
import FeatureItem from '@/components/about/FeatureItem';
import ValueCard from '@/components/about/ValueCard';
import FullWidthSection from '@/components/about/FullWidthSection';

export default function AboutPage() {
  return (
    <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="px-[5%] py-16">
          <div className="text-center">
            <h1 className="font-space-grotesk text-5xl md:text-6xl font-bold text-black mb-6">
              About {BRAND.name}
            </h1>
            <p className="font-open-sans text-xl text-black/80 leading-relaxed max-w-3xl mx-auto">
              {BRAND.description}
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <FullWidthSection className="py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-black">
            <div className="p-10 border-r border-black" style={{ backgroundColor: '#6bdbff' }}>
              <div className="flex items-center space-x-3 mb-6">
                <IconBox>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </IconBox>
                <h2 className="font-space-grotesk text-3xl font-bold text-black">Our Mission</h2>
              </div>
              <p className="font-open-sans text-lg text-black leading-relaxed mb-4">
                At {BRAND.name}, we believe that understanding your astrological profile can provide 
                profound insights into your personality, relationships, and life path. Our mission is 
                to make accurate, professional-grade astrology accessible to everyone.
              </p>
              <p className="font-open-sans text-black leading-relaxed">
                We combine the precision of astronomy-engine calculations with intuitive design and 
                community-driven interpretations to create a platform where both beginners and 
                experienced astrologers can explore the cosmos within themselves.
              </p>
            </div>
            
            <div className="p-10" style={{ backgroundColor: '#f2e356' }}>
              <h3 className="font-space-grotesk text-2xl font-bold text-black mb-6">What Sets Us Apart</h3>
              <div className="space-y-4">
                <FeatureItem 
                  title="Precision Accuracy"
                  description="Astronomy-engine calculations ensure professional-grade precision (±1 arcminute)"
                />
                <FeatureItem 
                  title="Community Driven"
                  description="Learn and share insights with fellow astrology enthusiasts"
                />
                <FeatureItem 
                  title="Always Free"
                  description="Core features remain accessible to everyone, always"
                />
              </div>
            </div>
          </div>
        </FullWidthSection>

        {/* Values Section */}
        <FullWidthSection className="py-16">
          <div className="text-center mb-12">
            <h2 className="font-space-grotesk text-3xl font-bold text-black mb-4">Our Values</h2>
            <p className="font-open-sans text-lg text-black/80">
              The principles that guide our approach to astrology and community building
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-black">
            <ValueCard
              title="Authenticity"
              description="We present astrology as it is - a tool for self-reflection and understanding, not absolute prediction."
              backgroundColor="#51bd94"
              borderRight={true}
              icon={
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              }
            />
            
            <ValueCard
              title="Community"
              description="We foster a welcoming space where people can share experiences and learn from each other's perspectives."
              backgroundColor="#ff91e9"
              borderRight={true}
              icon={
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
            />
            
            <ValueCard
              title="Privacy"
              description="Your birth data and personal information are sacred. We protect your privacy with the highest standards."
              backgroundColor="#6bdbff"
              borderRight={false}
              icon={
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              }
            />
          </div>
        </FullWidthSection>

        {/* Technology Section */}
        <FullWidthSection className="py-16" style={{ backgroundColor: '#f0e3ff' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white border border-black p-8">
              <h2 className="font-space-grotesk text-2xl font-bold text-black mb-6">Powered by Astronomy-Engine</h2>
              <p className="font-open-sans text-black/80 mb-4">
                Our calculations are powered by astronomy-engine, a modern MIT-licensed library 
                that provides professional-grade astronomical accuracy (±1 arcminute). This ensures 
                that your natal chart is as precise as possible.
              </p>
              <p className="font-open-sans text-black/80">
                We believe that accurate data is the foundation of meaningful astrological 
                interpretation, which is why we&apos;ve chosen cutting-edge astronomical 
                calculation tools that are both precise and accessible.
              </p>
            </div>
            
            <div className="space-y-6">
              <h2 className="font-space-grotesk text-2xl font-bold text-black">Join Our Journey</h2>
              <p className="font-open-sans text-black/80">
                Whether you&apos;re just beginning to explore astrology or you&apos;re a seasoned 
                practitioner, {BRAND.name} is designed to grow with you on your cosmic journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/" 
                  className="flex-1 bg-black text-white text-center py-4 px-8 border-2 border-black font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/25"
                >
                  Generate Your Chart
                </Link>
                <Link 
                  href="/discussions" 
                  className="flex-1 bg-transparent text-black text-center py-4 px-8 border-2 border-black font-semibold transition-all duration-300 hover:bg-black hover:text-white hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/15"
                >
                  Join Community
                </Link>
              </div>
            </div>
          </div>
        </FullWidthSection>
      </div>
    </div>
  );
}