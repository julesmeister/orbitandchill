/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadSharedChart();
  }, [token, initialChart]);

  if (isLoading) {
    return (
      <main className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent animate-spin mx-auto mb-4"></div>
          <p className="font-open-sans text-black/60">Loading shared chart...</p>
        </div>
      </main>
    );
  }

  if (notFound || !chart) {
    return (
      <main className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-black/10 flex items-center justify-center mx-auto mb-6 rounded-full">
            <svg className="w-8 h-8 text-black/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="font-space-grotesk text-2xl font-bold text-black mb-4">
            Chart Not Found
          </h1>
          <p className="font-open-sans text-black/70 mb-8">
            This chart link is invalid, expired, or the chart is no longer shared publicly.
          </p>
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-semibold border-2 border-black transition-all duration-300 hover:-translate-y-0.5"
          >
            Go to Homepage
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </main>
    );
  }

  const handleShareChart = async () => {
    const shareUrl = `${window.location.origin}/chart/shared/${token}`;
    const chartName = chart.subjectName || "Someone";
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${chartName}'s Natal Chart | ${BRAND.name}`,
          text: `Check out ${chartName}'s natal chart from ${BRAND.name}! 🌟`,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        showSuccess('Link Copied', 'Chart share link copied to clipboard.', 3000);
      }
    } catch (error) {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        showSuccess('Link Copied', 'Chart share link copied to clipboard.', 3000);
      } catch (clipboardError) {
        console.error('Failed to copy to clipboard:', clipboardError);
      }
    }
  };

  return (
    <>
      <main className="bg-white">
        {/* Shared Chart Section - Full width breakout */}
        <section className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
          <div className="px-6 py-8">
            {/* Header */}
            <div className="max-w-6xl mx-auto mb-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-space-grotesk text-3xl md:text-4xl font-bold text-black mb-2">
                    {chart.subjectName || "Someone"}'s Natal Chart
                  </h1>
                  <p className="font-open-sans text-black/70">
                    Shared from {BRAND.name} • {new Date(chart.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleShareChart}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white font-semibold border-2 border-black transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    Share
                  </button>
                  <button
                    onClick={() => router.push('/chart')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black border-2 border-black font-semibold transition-all duration-300 hover:-translate-y-0.5"
                  >
                    Create Your Own
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Chart Display */}
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Chart */}
                <div className="xl:col-span-3">
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <NatalChartDisplay
                      svgContent={chart.svg}
                      chartName={chart.title}
                      chartData={chart.chartData}
                      birthData={chart.birthData}
                    />
                  </div>
                </div>

                {/* Birth Data & Info */}
                <div className="xl:col-span-1">
                  <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                    <h3 className="font-space-grotesk text-lg font-bold text-black mb-4">
                      Birth Information
                    </h3>
                    <BirthDataSummary
                      birthData={chart.birthData}
                      personName={chart.title}
                    />
                  </div>

                  {/* Call to Action */}
                  <div className="bg-black text-white rounded-lg p-6 text-center">
                    <div className="mb-4">
                      <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </div>
                      <h4 className="font-space-grotesk text-lg font-bold mb-2">
                        Create Your Own Chart
                      </h4>
                      <p className="text-white/80 text-sm">
                        Discover your cosmic blueprint with our free natal chart generator
                      </p>
                    </div>
                    <button
                      onClick={() => router.push('/chart')}
                      className="w-full bg-white text-black font-semibold py-3 px-4 transition-all duration-300 hover:bg-gray-100"
                    >
                      Get Started Free
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Status Toast */}
      <StatusToast
        status={statusToast.status}
        title={statusToast.title}
        message={statusToast.message}
        isVisible={statusToast.isVisible}
        onHide={hideStatus}
      />
    </>
  );
}