"use client";

import { useState, useEffect } from 'react';
import { NatalChartFormData } from '@/components/forms/NatalChartForm';
import ClientWorldMap from '@/components/ClientWorldMap';
import ElectionalAstrologyShowcase from '@/components/ElectionalAstrologyShowcase';
import AstrologicalEvents from '@/components/AstrologicalEvents';
import SectionButton from '@/components/reusable/SectionButton';
import FeaturedArticlesList from '@/components/reusable/FeaturedArticlesList';
import NatalChartSection from '@/components/reusable/NatalChartSection';
import StickyNavigationButtons from '@/components/reusable/StickyNavigationButtons';
import { homepageSections, featuredArticlesConfig, natalChartSectionConfig } from '@/config/sectionConfigs';
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
      // Scroll to the top of the section
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start' // This scrolls to the top of the section
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
                {homepageSections.map((section) => (
                  <SectionButton
                    key={section.id}
                    id={section.id}
                    title={section.title}
                    description={section.description}
                    backgroundColor={section.backgroundColor}
                    icon={section.icon}
                    onClick={() => scrollToSection(section.sectionId)}
                    variant="compact"
                    borderClasses={section.borderClasses}
                  />
                ))}
              </div>

              {/* Horizontal Button Design for XL+ Screens */}
              <div className="hidden xl:flex flex-col gap-3">
                <div className="flex gap-3">
                  {homepageSections.slice(0, 2).map((section) => (
                    <SectionButton
                      key={section.id}
                      id={section.id}
                      title={section.title}
                      description={section.description}
                      backgroundColor={section.backgroundColor}
                      hoverColor={section.hoverColor}
                      icon={section.icon}
                      onClick={() => scrollToSection(section.sectionId)}
                      variant="horizontal"
                    />
                  ))}
                </div>

                <div className="flex gap-3">
                  {homepageSections.slice(2, 4).map((section) => (
                    <SectionButton
                      key={section.id}
                      id={section.id}
                      title={section.title}
                      description={section.description}
                      backgroundColor={section.backgroundColor}
                      hoverColor={section.hoverColor}
                      icon={section.icon}
                      onClick={() => scrollToSection(section.sectionId)}
                      variant="horizontal"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side - Featured Articles */}
            <FeaturedArticlesList 
              posts={featuredPosts}
              config={featuredArticlesConfig}
            />
          </div>
        </div>
      </section>

      {/* Form and Chart Section - Synapsas Style */}
      <NatalChartSection
        config={natalChartSectionConfig}
        user={user}
        cachedChart={cachedChart}
        shouldShowChart={shouldShowChart}
        isGenerating={isGenerating}
        onFormSubmit={handleFormSubmit}
        onEditData={() => setShowingForm(true)}
      />


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

      {/* Sticky Navigation Buttons */}
      <StickyNavigationButtons />
    </>
  );
}