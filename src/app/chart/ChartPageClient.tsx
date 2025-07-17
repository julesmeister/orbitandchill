/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import NatalChartDisplay from "../../components/charts/NatalChartDisplay";
import ChartQuickActions from "../../components/charts/ChartQuickActions";
import BirthDataSummary from "../../components/charts/BirthDataSummary";
import InterpretationSidebar from "../../components/charts/InterpretationSidebar";
import StatusToast from "../../components/reusable/StatusToast";
import { useChartPage } from "../../hooks/useChartPage";
import { getAvatarByIdentifier } from "../../utils/avatarUtils";
import { BRAND } from "../../config/brand";

function ChartContent() {
  const {
    router,
    user,
    activeTab,
    cachedChart,
    personToShow,
    birthDataToShow,
    statusToast,
    isLoading,
    isGenerating,
    loadingTitle,
    loadingDescription,
    handleClearAllCaches,
    handleRegenerateChart,
    handlePersonChange,
    handleAddPersonClick,
    handleShare,
    hideStatus,
    setActiveTab,
  } = useChartPage();

  // Get the chart subject's avatar using the same logic as navbar
  const chartSubjectName = cachedChart?.metadata?.name || personToShow?.name || "Unknown";
  
  // Determine the appropriate avatar to show
  const getChartSubjectAvatar = () => {
    // If this is the current user's own chart, show their actual avatar
    if (user && (chartSubjectName === user.username || (personToShow && 'relationship' in personToShow && personToShow.relationship === 'self'))) {
      return user.preferredAvatar || user.profilePictureUrl || getAvatarByIdentifier(user.username);
    }
    
    // For other people's charts, use deterministic generated avatars
    return getAvatarByIdentifier(chartSubjectName);
  };
  
  const chartSubjectAvatar = getChartSubjectAvatar();

  // Show chart display
  return (
    <>
      <main className="bg-white">
        {/* Chart Section - Full width breakout */}
        <section className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
          <div className="px-6 py-8">
            {(() => {
              if (isLoading) {
                return (
                  <div className="border border-black bg-white min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      {/* Three-Element Bounce Loading */}
                      <div className="flex items-center justify-center space-x-2 mb-8">
                        <div className="w-3 h-3 bg-black animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-3 h-3 bg-black animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-3 h-3 bg-black animate-bounce"></div>
                      </div>

                      {/* Heading */}
                      <h1 className="font-space-grotesk text-4xl md:text-5xl font-bold text-black mb-6">
                        {loadingTitle}
                      </h1>

                      {/* Description */}
                      <p className="font-open-sans text-xl text-black/80 leading-relaxed max-w-3xl mx-auto">
                        {loadingDescription}
                      </p>
                    </div>
                  </div>
                );
              }

              if (cachedChart) {
                return (
                  <div className="grid grid-cols-1 lg:grid-cols-6 gap-0 border border-black bg-white">
                    {/* Main Chart */}
                    <div className="lg:col-span-4 border-black lg:border-r">
                      <NatalChartDisplay
                        svgContent={cachedChart.svg}
                        chartName={
                          cachedChart.metadata?.name ||
                          personToShow?.name ||
                          "Natal Chart"
                        }
                        birthData={
                          birthDataToShow ||
                          {
                            dateOfBirth: "",
                            timeOfBirth: "",
                            locationOfBirth: "",
                            coordinates: { lat: "", lon: "" }
                          }
                        }
                        chartData={cachedChart.metadata?.chartData}
                        personName={cachedChart.metadata?.name || personToShow?.name}
                        personAvatar={chartSubjectAvatar}
                        onShare={handleShare}
                      />
                    </div>

                    {/* Sidebar with Actions */}
                    <div className="lg:col-span-2 bg-white">
                      {/* Quick Actions */}
                      <ChartQuickActions
                        onRegenerateChart={handleRegenerateChart}
                        isGenerating={isGenerating}
                        onPersonChange={handlePersonChange}
                        onAddPersonClick={handleAddPersonClick}
                        onClearCache={handleClearAllCaches}
                        chartId={cachedChart?.id}
                      />

                      {/* Birth Data Summary */}
                      {birthDataToShow && (
                        <BirthDataSummary
                          birthData={birthDataToShow}
                          personName={cachedChart?.metadata?.name || personToShow?.name}
                        />
                      )}

                      {/* Interpretation Sidebar - Show when interpretation tab is active */}
                      {activeTab === 'interpretation' && (
                        <div className="border-t border-black">
                          <InterpretationSidebar
                            onSectionClick={(sectionId) => {
                              // Scroll to section or handle section navigation
                              const element = document.getElementById(`section-${sectionId}`);
                              if (element) {
                                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

              return (
                <div className="border border-black bg-white">
                  <div className="p-12 text-center">
                    {/* Icon */}
                    <div className="w-16 h-16 bg-black flex items-center justify-center mx-auto mb-8">
                      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                      </svg>
                    </div>

                    {/* Heading */}
                    <h2 className="font-space-grotesk text-4xl md:text-5xl font-bold text-black mb-6">
                      Your Cosmic Journey Awaits
                    </h2>

                    {/* Description */}
                    <p className="font-open-sans text-xl text-black/80 leading-relaxed max-w-3xl mx-auto mb-12">
                      Unlock the mysteries of your birth chart and discover the celestial blueprint that makes you uniquely you.
                    </p>

                    {/* Feature Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-black mb-12">
                      <div className="p-8 border-black md:border-r" style={{ backgroundColor: '#f0e3ff' }}>
                        <div className="w-12 h-12 bg-black flex items-center justify-center mb-6 mx-auto">
                          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </div>
                        <h3 className="font-space-grotesk text-lg font-bold text-black mb-3">Planetary Positions</h3>
                        <p className="font-open-sans text-sm text-black/80">Discover where the planets were at your exact moment of birth</p>
                      </div>

                      <div className="p-8 border-black md:border-r" style={{ backgroundColor: '#6bdbff' }}>
                        <div className="w-12 h-12 bg-black flex items-center justify-center mb-6 mx-auto">
                          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                        </div>
                        <h3 className="font-space-grotesk text-lg font-bold text-black mb-3">House System</h3>
                        <p className="font-open-sans text-sm text-black/80">Explore the 12 houses that shape different areas of your life</p>
                      </div>

                      <div className="p-8" style={{ backgroundColor: '#f2e356' }}>
                        <div className="w-12 h-12 bg-black flex items-center justify-center mb-6 mx-auto">
                          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <h3 className="font-space-grotesk text-lg font-bold text-black mb-3">Aspects & Energy</h3>
                        <p className="font-open-sans text-sm text-black/80">Understand the unique energy patterns in your cosmic design</p>
                      </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                      <button
                        onClick={() => router.push('/')}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white font-semibold border-2 border-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/25"
                      >
                        Create Your Chart
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </button>

                      <button
                        onClick={() => router.push('/guides/natal-chart')}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-transparent text-black font-semibold border-2 border-black transition-all duration-300 hover:bg-black hover:text-white hover:-translate-y-0.5"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Learn About Charts
                      </button>
                    </div>

                    {/* Additional Info */}
                    <div className="pt-8 border-t border-black">
                      <p className="font-open-sans text-sm text-black/60 mb-6">Not sure where to start?</p>
                      <div className="flex flex-wrap gap-8 justify-center text-sm">
                        <Link href="/faq" className="text-black font-semibold hover:text-black/70 transition-colors flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          View FAQs
                        </Link>
                        <Link href="/learning-center" className="text-black font-semibold hover:text-black/70 transition-colors flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          Learning Center
                        </Link>
                        <Link href="/contact" className="text-black font-semibold hover:text-black/70 transition-colors flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          Contact Support
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </section>
      </main>

      {/* Status Toast */}
      <StatusToast
        title={statusToast.title}
        message={statusToast.message}
        status={statusToast.status}
        isVisible={statusToast.isVisible}
        onHide={hideStatus}
        duration={statusToast.duration}
      />
    </>
  );
}

export default function ChartPageClient() {
  return (
    <Suspense fallback={
      <div className="border border-black bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <div className="w-3 h-3 bg-black animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-3 h-3 bg-black animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-3 h-3 bg-black animate-bounce"></div>
          </div>
          <h1 className="font-space-grotesk text-4xl md:text-5xl font-bold text-black mb-6">
            Loading Chart
          </h1>
          <p className="font-open-sans text-xl text-black/80 leading-relaxed max-w-3xl mx-auto">
            Preparing your cosmic experience...
          </p>
        </div>
      </div>
    }>
      <ChartContent />
    </Suspense>
  );
}