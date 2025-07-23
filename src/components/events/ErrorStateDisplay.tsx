/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import Link from 'next/link';

interface ErrorStateDisplayProps {
  errorMessage: string;
}

export default function ErrorStateDisplay({ errorMessage }: ErrorStateDisplayProps) {
  return (
    <div className="bg-white">
      {/* Hero Section with Error State */}
      <section className="px-[5%] py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-space-grotesk text-5xl md:text-6xl font-bold text-black mb-6">
              Event Chart Unavailable
            </h1>
            <p className="font-open-sans text-xl text-black/80 leading-relaxed max-w-2xl mx-auto">
              {errorMessage || "We couldn't generate a chart for this event. Please check your birth data settings."}
            </p>
          </div>

          {/* Visual Indicator Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 bg-white border border-black mb-12">
            {/* Missing Data Indicator */}
            <div
              style={{ backgroundColor: '#ff91e9' }}
              className="p-8 text-center relative"
            >
              <div className="flex justify-center mb-4">
                <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <h3 className="font-space-grotesk text-lg font-bold text-white mb-2">
                Birth Data
              </h3>
              <p className="font-open-sans text-sm text-white/90">
                Required for chart generation
              </p>
            </div>

            {/* Configuration Indicator */}
            <div
              style={{ backgroundColor: '#f2e356' }}
              className="p-8 text-center relative border-l border-r border-black"
            >
              <div className="flex justify-center mb-4">
                <svg className="w-16 h-16 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                </svg>
              </div>
              <h3 className="font-space-grotesk text-lg font-bold text-black mb-2">
                Profile Setup
              </h3>
              <p className="font-open-sans text-sm text-black/80">
                Complete your profile
              </p>
            </div>

            {/* Action Needed Indicator */}
            <div
              style={{ backgroundColor: '#6bdbff' }}
              className="p-8 text-center relative"
            >
              <div className="flex justify-center mb-4">
                <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" />
                </svg>
              </div>
              <h3 className="font-space-grotesk text-lg font-bold text-white mb-2">
                Event Selection
              </h3>
              <p className="font-open-sans text-sm text-white/90">
                Choose from Events calendar
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/settings"
              className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white font-semibold border-2 border-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/25"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              <span className="font-space-grotesk">Complete Profile</span>
            </Link>

            <Link
              href="/events"
              className="inline-flex items-center gap-3 px-8 py-4 bg-transparent text-black font-semibold border-2 border-black transition-all duration-300 hover:bg-black hover:text-white hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
              </svg>
              <span className="font-space-grotesk">Browse Events</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section
        className="px-[5%] py-16"
        style={{ backgroundColor: '#f0e3ff' }}
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="font-space-grotesk text-3xl font-bold text-black text-center mb-12">
            Getting Started with Event Charts
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="p-6 bg-white border border-black">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-4">
                <span className="font-space-grotesk font-bold text-lg">1</span>
              </div>
              <h3 className="font-space-grotesk text-lg font-bold text-black mb-3">
                Add Birth Data
              </h3>
              <p className="font-open-sans text-sm text-black/80 leading-relaxed">
                Go to Settings and enter your birth date, time, and location for accurate chart generation.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 bg-white border border-black">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-4">
                <span className="font-space-grotesk font-bold text-lg">2</span>
              </div>
              <h3 className="font-space-grotesk text-lg font-bold text-black mb-3">
                Find Events
              </h3>
              <p className="font-open-sans text-sm text-black/80 leading-relaxed">
                Visit the Events calendar to discover optimal timing for your activities and important decisions.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 bg-white border border-black">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-4">
                <span className="font-space-grotesk font-bold text-lg">3</span>
              </div>
              <h3 className="font-space-grotesk text-lg font-bold text-black mb-3">
                Generate Charts
              </h3>
              <p className="font-open-sans text-sm text-black/80 leading-relaxed">
                Click on any event to generate a detailed astrological chart for that specific moment.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}