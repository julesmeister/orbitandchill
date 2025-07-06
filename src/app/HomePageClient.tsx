"use client";

import { useState, useEffect } from 'react';
import NatalChartForm, { NatalChartFormData } from '@/components/forms/NatalChartForm';
import ChartPreview from '@/components/charts/ChartPreview';
import ClientWorldMap from '@/components/ClientWorldMap';
import ElectionalAstrologyShowcase from '@/components/ElectionalAstrologyShowcase';
import AstrologicalEvents from '@/components/AstrologicalEvents';
import { BRAND } from '@/config/brand';
import { useUserStore } from '@/store/userStore';
import { useNatalChart } from '@/hooks/useNatalChart';
import { useRouter } from 'next/navigation';
import { useStatusToast } from '@/hooks/useStatusToast';
import StatusToast from '@/components/reusable/StatusToast';
import { useBlogData } from '@/hooks/useBlogData';
import AstrologicalEventsStructuredData from '@/components/SEO/AstrologicalEventsStructuredData';
import { useAstrologicalEvents } from '@/hooks/useAstrologicalEvents';
import HomePageStructuredData from '@/components/SEO/HomePageStructuredData';

export default function HomePageClient() {
  const router = useRouter();
  const { user, hasStoredData, loadProfile, isProfileComplete } = useUserStore();
  const { cachedChart, generateChart, isGenerating } = useNatalChart();
  const [showingForm, setShowingForm] = useState(false);

  // Use status toast hook
  const { toast: statusToast, showLoading, showSuccess, showError, hideStatus } = useStatusToast();

  // Get featured blog posts
  const { featuredPosts } = useBlogData();

  // Get astrological events for structured data
  const { upcomingEvents } = useAstrologicalEvents();

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
      showError('Chart Error', 'An error occurred while generating your chart.');
    }
  };

  // Show chart preview if user has complete data and a cached chart
  const shouldShowChart = hasStoredData && isProfileComplete && cachedChart && !showingForm;

  const handleCountryClick = (countryId: string, event?: MouseEvent) => {
    // Country selection analytics could be tracked here
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
      <section className="hero-section w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] flex items-center justify-center px-6 py-8 xl:px-8 xl:py-4 2xl:px-20 2xl:py-20" style={{ minHeight: 'calc(100vh - 120px)' }}>
        <div className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-14 2xl:gap-20">
            {/* Left Side - Compact Hero Content */}
            <div className="space-y-8 xl:space-y-6 2xl:space-y-16">
              {/* Hero Content */}
              <div className="text-left relative overflow-hidden">
                <div className="relative z-10">
                  <h1 className="font-space-grotesk text-4xl lg:text-6xl xl:text-6xl 2xl:text-7xl font-bold text-black mb-4 xl:mb-3">
                    Welcome to
                    <span className="block text-blue-600">{BRAND.name}</span>
                  </h1>
                  <p className="font-open-sans text-lg lg:text-xl xl:text-xl 2xl:text-2xl text-black/80 leading-relaxed mb-6 xl:mb-4">
                    {BRAND.tagline} {BRAND.description}
                  </p>

                  <h2 className="font-space-grotesk text-2xl lg:text-3xl xl:text-3xl 2xl:text-4xl font-bold text-black mb-3 xl:mb-2">
                    Explore Your Cosmic Journey
                  </h2>
                  <p className="font-open-sans text-base lg:text-lg xl:text-lg 2xl:text-xl text-black/80 leading-relaxed">
                    Dive deeper into astrology with our comprehensive tools and insights
                  </p>
                </div>
              </div>

              {/* Compact Grid Partition System - Responsive Design */}
              <div className="grid grid-cols-2 gap-0 bg-white border border-black overflow-hidden xl:hidden">
                {/* Natal Chart Analysis */}
                <button
                  onClick={() => scrollToSection('natal-chart-section')}
                  className="group relative p-4 xl:p-3 2xl:p-8 transition-all duration-300 border-r border-black border-b hover:bg-gray-50"
                  style={{ backgroundColor: '#6bdbff' }}
                >
                  <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full transition-all duration-300 bg-black"></div>
                  <div className="relative text-center">
                    <div className="w-8 h-8 xl:w-10 xl:h-10 2xl:w-12 2xl:h-12 bg-black flex items-center justify-center mb-2 mx-auto">
                      <svg className="w-4 h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                    <h3 className="font-space-grotesk text-sm lg:text-base xl:text-base 2xl:text-lg font-bold text-black mb-1">Natal Chart</h3>
                    <p className="font-open-sans text-black/80 text-xs lg:text-sm xl:text-sm 2xl:text-base leading-relaxed">
                      Discover your cosmic blueprint
                    </p>
                  </div>
                </button>

                {/* Astrocartography */}
                <button
                  onClick={() => scrollToSection('astrocartography-section')}
                  className="group relative p-4 xl:p-3 2xl:p-8 transition-all duration-300 border-b hover:bg-gray-50"
                  style={{ backgroundColor: '#f2e356' }}
                >
                  <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full transition-all duration-300 bg-black"></div>
                  <div className="relative text-center">
                    <div className="w-8 h-8 xl:w-10 xl:h-10 2xl:w-12 2xl:h-12 bg-black flex items-center justify-center mb-2 mx-auto">
                      <svg className="w-4 h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="font-space-grotesk text-sm lg:text-base xl:text-base 2xl:text-lg font-bold text-black mb-1">Astrocartography</h3>
                    <p className="font-open-sans text-black/80 text-xs lg:text-sm xl:text-sm 2xl:text-base leading-relaxed">
                      Find your ideal locations
                    </p>
                  </div>
                </button>

                {/* Astrological Events */}
                <button
                  onClick={() => scrollToSection('astrological-events-section')}
                  className="group relative p-4 xl:p-3 2xl:p-8 transition-all duration-300 border-r border-black hover:bg-gray-50"
                  style={{ backgroundColor: '#51bd94' }}
                >
                  <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full transition-all duration-300 bg-black"></div>
                  <div className="relative text-center">
                    <div className="w-8 h-8 xl:w-10 xl:h-10 2xl:w-12 2xl:h-12 bg-black flex items-center justify-center mb-2 mx-auto">
                      <span className="text-lg">✨</span>
                    </div>
                    <h3 className="font-space-grotesk text-sm lg:text-base xl:text-base 2xl:text-lg font-bold text-black mb-1">Astrological Events</h3>
                    <p className="font-open-sans text-black/80 text-xs lg:text-sm xl:text-sm 2xl:text-base leading-relaxed">
                      Track rare celestial events
                    </p>
                  </div>
                </button>

                {/* Electional Astrology */}
                <button
                  onClick={() => scrollToSection('electional-astrology-section')}
                  className="group relative p-4 xl:p-3 2xl:p-8 transition-all duration-300 hover:bg-gray-50"
                  style={{ backgroundColor: '#ff91e9' }}
                >
                  <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full transition-all duration-300 bg-black"></div>
                  <div className="relative text-center">
                    <div className="w-8 h-8 xl:w-10 xl:h-10 2xl:w-12 2xl:h-12 bg-black flex items-center justify-center mb-2 mx-auto">
                      <span className="text-lg">⏰</span>
                    </div>
                    <h3 className="font-space-grotesk text-sm lg:text-base xl:text-base 2xl:text-lg font-bold text-black mb-1">Electional Astrology</h3>
                    <p className="font-open-sans text-black/80 text-xs lg:text-sm xl:text-sm 2xl:text-base leading-relaxed">
                      Perfect cosmic moments
                    </p>
                  </div>
                </button>
              </div>

              {/* Horizontal Button Design for XL+ Screens */}
              <div className="hidden xl:flex flex-col gap-3">
                <div className="flex gap-3">
                  <button
                    onClick={() => scrollToSection('natal-chart-section')}
                    className="flex-1 bg-[#6bdbff] border border-black p-3 hover:bg-[#5bc8ec] transition-all duration-300 flex items-center gap-3"
                  >
                    <div className="w-10 h-10 bg-black flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <h3 className="font-space-grotesk text-base font-bold text-black">Natal Chart</h3>
                      <p className="font-open-sans text-black/80 text-xs">Discover your cosmic blueprint</p>
                    </div>
                  </button>

                  <button
                    onClick={() => scrollToSection('astrocartography-section')}
                    className="flex-1 bg-[#f2e356] border border-black p-3 hover:bg-[#e8d84a] transition-all duration-300 flex items-center gap-3"
                  >
                    <div className="w-10 h-10 bg-black flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <h3 className="font-space-grotesk text-base font-bold text-black">Astrocartography</h3>
                      <p className="font-open-sans text-black/80 text-xs">Find your ideal locations</p>
                    </div>
                  </button>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => scrollToSection('astrological-events-section')}
                    className="flex-1 bg-[#26efa2] border border-black p-3 hover:bg-[#26e59f] transition-all duration-300 flex items-center gap-3"
                  >
                    <div className="w-10 h-10 bg-black flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">✨</span>
                    </div>
                    <div className="text-left">
                      <h3 className="font-space-grotesk text-base font-bold text-black">Astrological Events</h3>
                      <p className="font-open-sans text-black/80 text-xs">Track rare celestial events</p>
                    </div>
                  </button>

                  <button
                    onClick={() => scrollToSection('electional-astrology-section')}
                    className="flex-1 bg-[#ff91e9] border border-black p-3 hover:bg-[#ff7de4] transition-all duration-300 flex items-center gap-3"
                  >
                    <div className="w-10 h-10 bg-black flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">⏰</span>
                    </div>
                    <div className="text-left">
                      <h3 className="font-space-grotesk text-base font-bold text-black">Electional Astrology</h3>
                      <p className="font-open-sans text-black/80 text-xs">Perfect cosmic moments</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side - Featured Articles */}
            <div className="space-y-6 xl:space-y-4 2xl:space-y-10">
              <div className="border-l-4 border-black pl-4 xl:pl-5 2xl:pl-8">
                <h2 className="font-space-grotesk text-2xl lg:text-3xl xl:text-3xl 2xl:text-4xl font-bold text-black mb-2">
                  Featured Articles
                </h2>
                <p className="font-open-sans text-black/80 text-sm lg:text-base xl:text-base 2xl:text-lg">
                  Discover the latest insights and cosmic wisdom from our astrology experts
                </p>
              </div>

              {/* Featured Posts List */}
              <div className="space-y-4">
                {featuredPosts.slice(0, 3).map((post) => (
                  <div 
                    key={post.id} 
                    className="border border-black bg-white hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                    onClick={() => router.push(`/discussions/${post.slug}`)}
                  >
                    <div className="p-4 xl:p-5 2xl:p-8">
                      <div className="flex items-start gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <h3 className="font-space-grotesk font-bold text-black text-sm lg:text-base xl:text-base 2xl:text-lg mb-2 line-clamp-2">
                              {post.title}
                            </h3>
                            <p className="font-open-sans text-black/70 text-xs lg:text-sm xl:text-sm 2xl:text-base leading-relaxed mb-3 line-clamp-2">
                              {post.excerpt}
                            </p>
                            <div className="flex items-center">
                              <span className="font-open-sans text-xs lg:text-sm xl:text-sm 2xl:text-base text-black/60">
                                {post.author} • {post.readTime} min read
                              </span>
                            </div>
                          </div>
                        </div>
                        {post.imageUrl && (
                          <img 
                            src={post.imageUrl} 
                            alt={post.title}
                            className="w-20 h-20 xl:w-24 xl:h-24 2xl:w-28 2xl:h-28 object-cover flex-shrink-0"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* View All Articles Button */}
              <div className="pt-4">
                <button
                  onClick={() => router.push('/blog')}
                  className="w-full bg-black text-white p-3 font-space-grotesk font-semibold hover:bg-gray-800 transition-all duration-300 border border-black"
                >
                  View All Articles
                </button>
              </div>
            </div>
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
                    <div className="font-open-sans text-black space-y-2">
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
                <p className="font-open-sans text-white/80 text-lg leading-relaxed mb-4">
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
                    <p className="font-open-sans text-white/80 text-sm leading-relaxed mb-2">
                      Explore 12 life areas including career, relationships, health, and spirituality through astrological houses.
                    </p>
                    <p className="font-open-sans text-white/60 text-xs leading-relaxed">
                      Each house represents a different sphere of life experience, from personal identity (1st house)
                      to career ambitions (10th house) and spiritual growth (12th house).
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-white flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🔢</span>
                  </div>
                  <div>
                    <h3 className="font-space-grotesk text-lg font-bold text-white mb-2">Matrix Destiny</h3>
                    <p className="font-open-sans text-white/80 text-sm leading-relaxed mb-2">
                      Discover your life purpose and karmic patterns through ancient numerological wisdom combined with modern psychology.
                    </p>
                    <p className="font-open-sans text-white/60 text-xs leading-relaxed">
                      Matrix Destiny uses your birth date to reveal your soul's mission, energy centers, and personal
                      development path through a unique 22-arcana system based on Tarot symbolism.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-white flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🪐</span>
                  </div>
                  <div>
                    <h3 className="font-space-grotesk text-lg font-bold text-white mb-2">Planetary Positions</h3>
                    <p className="font-open-sans text-white/80 text-sm leading-relaxed mb-2">
                      Discover where Venus, Mars, Mercury, Jupiter, Saturn, and outer planets were positioned at your birth.
                    </p>
                    <p className="font-open-sans text-white/60 text-xs leading-relaxed">
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
          <h2 className="text-3xl font-bold text-white mb-4 font-open-sans">
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


      <div id="electional-astrology-section" className="mt-12 scroll-mt-20">
        <ElectionalAstrologyShowcase />
      </div>

      {/* Astrological Events Section */}
      <div id="astrological-events-section" className="scroll-mt-20">
        <AstrologicalEvents />
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

      {/* Structured Data for Astrological Events */}
      <AstrologicalEventsStructuredData 
        events={upcomingEvents}
        siteName={BRAND.name}
        siteUrl={process.env.NEXT_PUBLIC_SITE_URL || 'https://orbitandchill.com'}
      />

      {/* Homepage-specific Structured Data */}
      <HomePageStructuredData />
    </>
  );
}