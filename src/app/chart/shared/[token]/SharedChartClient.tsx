/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import NatalChartDisplay from "../../../../components/charts/NatalChartDisplay";
import BirthDataSummary from "../../../../components/charts/BirthDataSummary";
import { useStatusToast } from "../../../../hooks/useStatusToast";
import StatusToast from "../../../../components/reusable/StatusToast";
import { BRAND } from "../../../../config/brand";

interface SharedChartClientProps {
  token: string;
  initialChart?: any;
}

export default function SharedChartClient({ token, initialChart }: SharedChartClientProps) {
  const router = useRouter();
  const [chart, setChart] = useState<any>(initialChart || null);
  const [isLoading, setIsLoading] = useState(!initialChart);
  const [notFound, setNotFound] = useState(false);
  
  // Use status toast hook
  const { toast: statusToast, showSuccess, hideStatus } = useStatusToast();

  useEffect(() => {
    if (initialChart) {
      return; // Use server-side data
    }

    const loadSharedChart = async () => {
      if (!token) return;

      try {
        setIsLoading(true);
        const response = await fetch(`/api/charts/shared?shareToken=${token}`);
        
        if (!response.ok) {
          setNotFound(true);
          return;
        }

        const result = await response.json();
        
        if (result.success && result.chart) {
          setChart(result.chart);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Error loading shared chart:', error);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadSharedChart();
  }, [token, initialChart]);

  const handleShare = async () => {
    if (!chart) return;

    const shareUrl = `${window.location.origin}/chart/shared/${token}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${chart.subjectName || 'Someone'}'s Natal Chart`,
          text: `Check out ${chart.subjectName || 'this'} natal chart from ${BRAND.name}!`,
          url: shareUrl,
        });
      } catch {
        // User cancelled sharing or sharing failed, copy to clipboard
        try {
          await navigator.clipboard.writeText(shareUrl);
          showSuccess('Link Copied', 'Chart share link copied to clipboard.', 3000);
        } catch (clipboardError) {
          // Fallback: try to focus the document and retry
          try {
            window.focus();
            await navigator.clipboard.writeText(shareUrl);
            showSuccess('Link Copied', 'Chart share link copied to clipboard.', 3000);
          } catch (retryError) {
            // Final fallback: show the URL to user
            showSuccess('Share Link Ready', `Copy this link: ${shareUrl}`, 5000);
          }
        }
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        showSuccess('Link Copied', 'Chart share link copied to clipboard.', 3000);
      } catch (clipboardError) {
        // Fallback: try to focus the document and retry
        try {
          window.focus();
          await navigator.clipboard.writeText(shareUrl);
          showSuccess('Link Copied', 'Chart share link copied to clipboard.', 3000);
        } catch (retryError) {
          // Final fallback: show the URL to user
          showSuccess('Share Link Ready', `Copy this link: ${shareUrl}`, 5000);
        }
      }
    }
  };

  // Convert chart data to birth data format
  const birthData = chart ? {
    dateOfBirth: chart.dateOfBirth || '',
    timeOfBirth: chart.timeOfBirth || '',
    locationOfBirth: chart.locationOfBirth || '',
    coordinates: {
      lat: chart.latitude?.toString() || '',
      lon: chart.longitude?.toString() || ''
    }
  } : null;

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
                        Loading Chart
                      </h1>

                      {/* Description */}
                      <p className="font-open-sans text-xl text-black/80 leading-relaxed max-w-3xl mx-auto">
                        We're retrieving this cosmic blueprint. This should only take a moment...
                      </p>
                    </div>
                  </div>
                );
              }

              if (notFound) {
                return (
                  <div className="border border-black bg-white">
                    <div className="p-12 text-center">
                      {/* Icon */}
                      <div className="w-16 h-16 bg-black flex items-center justify-center mx-auto mb-8">
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                      </div>

                      {/* Heading */}
                      <h2 className="font-space-grotesk text-4xl md:text-5xl font-bold text-black mb-6">
                        Chart Not Found
                      </h2>

                      {/* Description */}
                      <p className="font-open-sans text-xl text-black/80 leading-relaxed max-w-3xl mx-auto mb-12">
                        This chart link is invalid or no longer available. The chart may have been deleted or the link may be incorrect.
                      </p>

                      {/* CTA Button */}
                      <div className="flex justify-center">
                        <button
                          onClick={() => router.push('/')}
                          className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white font-semibold border-2 border-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/25"
                        >
                          Create Your Own Chart
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }

              if (chart) {
                return (
                  <div className="grid grid-cols-1 lg:grid-cols-6 gap-0 border border-black bg-white">
                    {/* Main Chart */}
                    <div className="lg:col-span-4 border-black lg:border-r">
                      <NatalChartDisplay
                        svgContent={chart.chartData}
                        chartName={chart.subjectName || "Natal Chart"}
                        birthData={birthData || {
                          dateOfBirth: "",
                          timeOfBirth: "",
                          locationOfBirth: "",
                          coordinates: { lat: "", lon: "" }
                        }}
                        chartData={chart.metadata ? (typeof chart.metadata === 'string' ? JSON.parse(chart.metadata) : chart.metadata) : null}
                        personName={chart.subjectName}
                        personAvatar={undefined}
                        onShare={handleShare}
                      />
                    </div>

                    {/* Sidebar with Birth Data */}
                    <div className="lg:col-span-2 bg-white">
                      {/* Birth Data Summary */}
                      {birthData && (
                        <BirthDataSummary
                          birthData={birthData}
                          personName={chart.subjectName}
                        />
                      )}

                      {/* Create Your Own Chart CTA */}
                      <div className="p-6 border-t border-black">
                        <div className="text-center">
                          <h3 className="font-space-grotesk text-lg font-bold text-black mb-3">
                            Create Your Own Chart
                          </h3>
                          <p className="font-open-sans text-sm text-black/80 mb-6">
                            Discover your cosmic blueprint with our free natal chart generator
                          </p>
                          <button
                            onClick={() => router.push('/')}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-semibold border-2 border-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/25"
                          >
                            Get Started
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </button>
                        </div>
                      </div>
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