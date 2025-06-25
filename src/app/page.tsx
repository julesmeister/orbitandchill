/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from 'react';
import NatalChartForm, { NatalChartFormData } from '@/components/forms/NatalChartForm';
import ChartPreview from '@/components/charts/ChartPreview';
import ClientWorldMap from '@/components/ClientWorldMap';
import PlanetAlignment from '@/components/PlanetAlignment';
import ElectionalAstrologyShowcase from '@/components/ElectionalAstrologyShowcase';
import NatalChartShowcase from '@/components/NatalChartShowcase';
import ZodiacBackground from '@/components/ZodiacBackground';
import { BRAND } from '@/config/brand';
import { useUserStore } from '@/store/userStore';
import { useNatalChart } from '@/hooks/useNatalChart';
import { useRouter } from 'next/navigation';
import { useStatusToast } from '@/hooks/useStatusToast';
import StatusToast from '@/components/reusable/StatusToast';

export default function Home() {
  const router = useRouter();
  const { user, hasStoredData, loadProfile, isProfileComplete } = useUserStore();
  const { cachedChart, generateChart, isGenerating } = useNatalChart();
  const [showingForm, setShowingForm] = useState(false);
  
  // Use status toast hook
  const { toast: statusToast, showLoading, showSuccess, showError, hideStatus } = useStatusToast();

  // Load profile is handled by Navbar component, no need to duplicate here
  // useEffect(() => {
  //   loadProfile();
  // }, [loadProfile]);

  // Auto-generate chart if user has complete data but no cached chart
  useEffect(() => {
    if (isProfileComplete && !cachedChart && !isGenerating && user?.birthData) {
      generateChart({
        name: user.username || '',
        dateOfBirth: user.birthData.dateOfBirth,
        timeOfBirth: user.birthData.timeOfBirth,
        locationOfBirth: user.birthData.locationOfBirth,
        coordinates: user.birthData.coordinates
      }, true); // Force regenerate on auto-generation to ensure latest timezone handling
    }
  }, [isProfileComplete, cachedChart, isGenerating, user, generateChart]);

  const handleFormSubmit = async (formData: NatalChartFormData) => {
    showLoading('Generating Chart', 'Creating your personalized natal chart...', true);

    if (!user) {
      showError('Profile Error', 'User profile not loaded. Please refresh the page.');
      return;
    }

    try {
      const chartData = await generateChart(formData, true); // Force regenerate to ensure latest timezone handling

      if (chartData) {
        showSuccess('Chart Generated!', '🎉 Your natal chart has been successfully generated!');
        setShowingForm(false);

        // Redirect to chart page after a short delay
        setTimeout(() => {
          router.push('/chart');
        }, 1500);
      } else {
        showError('Generation Failed', 'Failed to generate chart. Please try again.');
      }
    } catch (error) {
      console.error("Error generating chart:", error);
      showError('Chart Error', 'An error occurred while generating your chart.');
    }
  };

  // Show chart preview if user has complete data and a cached chart
  const shouldShowChart = hasStoredData && isProfileComplete && cachedChart && !showingForm;

  const handleCountryClick = (countryId: string, event?: MouseEvent) => {
    console.log('Country clicked:', countryId);
    // Add any future country click functionality here
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Center the section in the viewport
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' // This centers the section vertically
      });
    }
  };

  return (
    <>
      {/* Hero Section with Features - Unified */}
      <section className="hero-section px-[5%] py-16 flex flex-col justify-center">
        <div className="max-w-7xl mx-auto">
          {/* Hero Content */}
          <div className="text-center mb-8 relative overflow-hidden">
            {/* Zodiac Background - only behind text */}
            <ZodiacBackground className="z-0" />
            
            <div className="relative z-10">
              <h1 className="font-space-grotesk text-4xl lg:text-6xl xl:text-7xl font-bold text-black mb-4">
                Welcome to
                <span className="block text-blue-600">{BRAND.name}</span>
              </h1>
              <p className="font-inter text-lg lg:text-xl text-black/80 leading-relaxed max-w-4xl mx-auto mb-8">
                {BRAND.tagline} {BRAND.description}
              </p>

              <h2 className="font-space-grotesk text-2xl lg:text-3xl font-bold text-black mb-4">
                Explore Your Cosmic Journey
              </h2>
              <p className="font-inter text-base lg:text-lg text-black/80 leading-relaxed max-w-3xl mx-auto">
                Dive deeper into astrology with our comprehensive tools and insights
              </p>
            </div>
          </div>

          {/* Grid Partition System */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 bg-white border border-black overflow-hidden">
            {/* Natal Chart Analysis */}
            <button
              onClick={() => scrollToSection('natal-chart-section')}
              className="group relative p-8 transition-all duration-300 border-r border-black lg:border-r border-b md:border-b-0 lg:border-b-0 hover:bg-gray-50"
              style={{ backgroundColor: '#6bdbff' }}
            >
              <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full transition-all duration-300 bg-black"></div>
              <div className="relative text-center">
                <div className="w-12 h-12 bg-black flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <h3 className="font-space-grotesk text-lg font-bold text-black mb-2">Natal Chart</h3>
                <p className="font-inter text-black/80 text-sm leading-relaxed">
                  Discover your cosmic blueprint through planetary positions.
                </p>
              </div>
            </button>

            {/* Astrocartography */}
            <button
              onClick={() => scrollToSection('astrocartography-section')}
              className="group relative p-8 transition-all duration-300 border-r border-black lg:border-r border-b md:border-b-0 lg:border-b-0 hover:bg-gray-50"
              style={{ backgroundColor: '#f2e356' }}
            >
              <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full transition-all duration-300 bg-black"></div>
              <div className="relative text-center">
                <div className="w-12 h-12 bg-black flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-space-grotesk text-lg font-bold text-black mb-2">Astrocartography</h3>
                <p className="font-inter text-black/80 text-sm leading-relaxed">
                  Find your ideal locations based on planetary energies.
                </p>
              </div>
            </button>

            {/* Planetary Alignment */}
            <button
              onClick={() => scrollToSection('planetary-alignment-section')}
              className="group relative p-8 transition-all duration-300 border-r border-black lg:border-r border-b md:border-b-0 lg:border-b-0 hover:bg-gray-50"
              style={{ backgroundColor: '#51bd94' }}
            >
              <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full transition-all duration-300 bg-black"></div>
              <div className="relative text-center">
                <div className="w-12 h-12 bg-black flex items-center justify-center mb-4 mx-auto">
                  <span className="text-2xl">🌌</span>
                </div>
                <h3 className="font-space-grotesk text-lg font-bold text-black mb-2">Planetary Alignment</h3>
                <p className="font-inter text-black/80 text-sm leading-relaxed">
                  View real-time 3D positions of planets in our solar system.
                </p>
              </div>
            </button>

            {/* Electional Astrology */}
            <button
              onClick={() => scrollToSection('electional-astrology-section')}
              className="group relative p-8 transition-all duration-300 hover:bg-gray-50"
              style={{ backgroundColor: '#ff91e9' }}
            >
              <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full transition-all duration-300 bg-black"></div>
              <div className="relative text-center">
                <div className="w-12 h-12 bg-black flex items-center justify-center mb-4 mx-auto">
                  <span className="text-2xl">⏰</span>
                </div>
                <h3 className="font-space-grotesk text-lg font-bold text-black mb-2">Electional Astrology</h3>
                <p className="font-inter text-black/80 text-sm leading-relaxed">
                  Find the perfect cosmic moments for important decisions.
                </p>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Form and Chart Section - Synapsas Style */}
      <section className="px-[5%] py-20 min-h-screen flex items-center" id="natal-chart-section">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white border border-black overflow-hidden">
            {/* Left Side - Form */}
            <div className="p-8 border-r border-black">
              {shouldShowChart ? (
                <div className="space-y-6">
                  <ChartPreview
                    svgContent={cachedChart.svg}
                    userName={user?.username || 'Your'}
                    birthData={cachedChart.metadata.birthData}
                  />

                  {/* Action Buttons - Synapsas Style */}
                  <div className="flex gap-0 border border-black overflow-hidden">
                    <button
                      onClick={() => router.push('/chart')}
                      className="flex-1 bg-black text-white p-4 font-space-grotesk font-semibold hover:bg-gray-800 transition-all duration-300 border-r border-black"
                    >
                      View Full Chart
                    </button>
                    <button
                      onClick={() => setShowingForm(true)}
                      className="flex-1 bg-white text-black p-4 font-space-grotesk font-semibold hover:bg-black hover:text-white transition-all duration-300"
                    >
                      Edit Data
                    </button>
                  </div>

                  {/* Quick Stats */}
                  <div className="p-6 border border-black" style={{ backgroundColor: '#f0e3ff' }}>
                    <h4 className="font-space-grotesk font-bold text-black mb-4">Quick Insights</h4>
                    <div className="font-inter text-black space-y-2">
                      <p>✨ Chart generated and cached</p>
                      <p>🎯 Ready for detailed analysis</p>
                      <p>💫 Join discussions to learn more</p>
                    </div>
                  </div>
                </div>
              ) : (
                <NatalChartForm
                  onSubmit={handleFormSubmit}
                  submitText={
                    isGenerating
                      ? "Generating Chart..."
                      : cachedChart
                        ? "View Your Chart"
                        : "Generate Chart"
                  }
                  showSubmitButton={true}
                />
              )}
            </div>

            {/* Right Side - Natal Chart Information */}
            <div className="p-8 flex flex-col justify" style={{ backgroundColor: 'black' }}>
              <div className="text-left mb-8">
                <h2 className="font-space-grotesk text-3xl lg:text-4xl font-bold text-white mb-4">
                  ⭐ Your Cosmic Blueprint Revealed
                </h2>
                <p className="font-inter text-white/80 text-lg leading-relaxed mb-4">
                  A natal chart is a snapshot of the sky at the exact moment you were born.
                  It reveals your personality traits, strengths, challenges, and life path through the positions of planets and stars.
                </p>
              </div>

              <div className="space-y-6">

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-white flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🏠</span>
                  </div>
                  <div>
                    <h3 className="font-space-grotesk text-lg font-bold text-white mb-2">Houses & Life Areas</h3>
                    <p className="font-inter text-white/80 text-sm leading-relaxed mb-2">
                      Explore 12 life areas including career, relationships, health, and spirituality through astrological houses.
                    </p>
                    <p className="font-inter text-white/60 text-xs leading-relaxed">
                      Each house represents a different sphere of life experience, from personal identity (1st house)
                      to career ambitions (10th house) and spiritual growth (12th house).
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-white flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🔗</span>
                  </div>
                  <div>
                    <h3 className="font-space-grotesk text-lg font-bold text-white mb-2">Planetary Aspects</h3>
                    <p className="font-inter text-white/80 text-sm leading-relaxed mb-2">
                      Understand how planets interact with each other, creating harmony, tension, and unique personality patterns.
                    </p>
                    <p className="font-inter text-white/60 text-xs leading-relaxed">
                      Aspects are the geometric angles between planets. Harmonious aspects (trines, sextiles) bring ease,
                      while challenging aspects (squares, oppositions) create growth opportunities.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-white flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🪐</span>
                  </div>
                  <div>
                    <h3 className="font-space-grotesk text-lg font-bold text-white mb-2">Planetary Positions</h3>
                    <p className="font-inter text-white/80 text-sm leading-relaxed mb-2">
                      Discover where Venus, Mars, Mercury, Jupiter, Saturn, and outer planets were positioned at your birth.
                    </p>
                    <p className="font-inter text-white/60 text-xs leading-relaxed">
                      Each planet governs different aspects of life: Mercury (communication), Venus (love),
                      Mars (action), Jupiter (expansion), Saturn (discipline), and more.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>


      {/* World Map - Full Width */}
      <section id="astrocartography-section" className="mt-32 bg-gradient-to-b from-blue-600 to-blue-500 py-12 scroll-mt-20 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4 font-arvo">
            Astrocartography
          </h2>
          <p className="text-lg text-blue-100 max-w-3xl mx-auto">
            Imagine if different places around the world could change how you feel and act!
            That's what astrocartography is - it shows you where on Earth your stars would make you the happiest, luckiest, or most creative.
          </p>
        </div>

        <div className="relative">
          <ClientWorldMap
            className="w-full"
            onCountryClick={handleCountryClick}
            whiteCountries={true}
          />
        </div>
      </section>

      <section id="planetary-alignment-section" className="scroll-mt-20">
        <PlanetAlignment />
      </section>

      <div id="electional-astrology-section" className="mt-12 scroll-mt-20">
        <ElectionalAstrologyShowcase />
      </div>
      
      {/* Status Toast */}
      <StatusToast
        title={statusToast.title}
        message={statusToast.message}
        status={statusToast.status}
        isVisible={statusToast.isVisible}
        onHide={hideStatus}
        duration={statusToast.duration}
        showProgress={statusToast.showProgress}
        progress={statusToast.progress}
      />
    </>
  );
}
