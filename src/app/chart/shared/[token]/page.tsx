/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import NatalChartDisplay from "../../../../components/charts/NatalChartDisplay";
import BirthDataSummary from "../../../../components/charts/BirthDataSummary";
import { useStatusToast } from "../../../../hooks/useStatusToast";
import StatusToast from "../../../../components/reusable/StatusToast";
import { BRAND } from "../../../../config/brand";

export default function SharedChartPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;
  const [chart, setChart] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  
  // Use status toast hook
  const { toast: statusToast, showSuccess, hideStatus } = useStatusToast();

  useEffect(() => {
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
  }, [token]);

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

  return (
    <>
    <main className="bg-white">
      {/* Shared Chart Section - Full width breakout */}
      <section className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <div className="px-6 py-8">
          {/* Header */}
          <div className="max-w-4xl mx-auto mb-8 text-center">
            <h1 className="font-space-grotesk text-3xl md:text-4xl font-bold text-black mb-4">
              {chart.title || `${chart.subjectName}'s Natal Chart`}
            </h1>
            <p className="font-open-sans text-black/70">
              Shared from {BRAND.name}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-6 gap-0 border border-black bg-white max-w-7xl mx-auto">
            {/* Main Chart */}
            <div className="lg:col-span-4 border-black lg:border-r">
              <NatalChartDisplay
                svgContent={chart.chartData}
                chartName={chart.title || chart.subjectName || "Natal Chart"}
                birthData={{
                  dateOfBirth: chart.dateOfBirth,
                  timeOfBirth: chart.timeOfBirth,
                  locationOfBirth: chart.locationOfBirth,
                  coordinates: {
                    lat: chart.latitude.toString(),
                    lon: chart.longitude.toString()
                  }
                }}
                chartData={chart.metadata.chartData}
                personName={chart.subjectName}
                onShare={() => {
                  // Copy current URL to clipboard
                  navigator.clipboard?.writeText(window.location.href);
                  showSuccess('Link Copied', 'Chart link copied to clipboard!', 3000);
                }}
                isSharedView={true}
              />
            </div>

            {/* Sidebar with Info */}
            <div className="lg:col-span-2 bg-white">
              {/* Chart Info */}
              <div className="p-6 border-b border-black/20">
                <h3 className="font-space-grotesk text-lg font-bold text-black mb-4">
                  Chart Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-open-sans text-sm text-black/60">Subject:</span>
                    <div className="font-open-sans text-sm font-medium text-black">
                      {chart.subjectName}
                    </div>
                  </div>
                  <div>
                    <span className="font-open-sans text-sm text-black/60">Generated:</span>
                    <div className="font-open-sans text-sm font-medium text-black">
                      {new Date(chart.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  {chart.description && (
                    <div>
                      <span className="font-open-sans text-sm text-black/60">Description:</span>
                      <div className="font-open-sans text-sm font-medium text-black">
                        {chart.description}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Birth Data Summary */}
              <BirthDataSummary
                birthData={{
                  dateOfBirth: chart.dateOfBirth,
                  timeOfBirth: chart.timeOfBirth,
                  locationOfBirth: chart.locationOfBirth,
                  coordinates: {
                    lat: chart.latitude.toString(),
                    lon: chart.longitude.toString()
                  }
                }}
                personName={chart.subjectName}
              />

              {/* Call to Action */}
              <div className="p-6">
                <div className="bg-gray-50 border border-black/20 p-4">
                  <h4 className="font-space-grotesk text-sm font-bold text-black mb-2">
                    Create Your Own Chart
                  </h4>
                  <p className="font-open-sans text-xs text-black/70 mb-4">
                    Discover your own cosmic blueprint with a personalized natal chart.
                  </p>
                  <button
                    onClick={() => router.push('/')}
                    className="w-full px-4 py-2 bg-black text-white font-semibold text-sm border-2 border-black transition-all duration-300 hover:-translate-y-0.5"
                  >
                    Get Started
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