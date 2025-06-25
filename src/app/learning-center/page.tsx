/* eslint-disable react/no-unescaped-entities */
"use client";

import React from 'react';
import Link from 'next/link';

export default function LearningCenterPage() {
  return (
    <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      <div className="min-h-screen bg-white">
      <div className="px-6 py-12">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white rounded-2xl p-12 mb-12 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-4 w-24 h-24 border border-white/20 rounded-full"></div>
            <div className="absolute top-8 right-8 w-16 h-16 border border-white/20 rounded-full"></div>
            <div className="absolute bottom-4 left-1/3 w-12 h-12 border border-white/20 rounded-full"></div>
            <div className="absolute top-12 left-1/4 w-1 h-1 bg-white rounded-full"></div>
            <div className="absolute top-20 left-1/2 w-1 h-1 bg-white rounded-full"></div>
            <div className="absolute bottom-16 right-1/4 w-1 h-1 bg-white rounded-full"></div>
          </div>

          <div className="relative z-10 text-center">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent mb-6">
              Learning Center
            </h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto leading-relaxed">
              Master the features of Luckstrology and deepen your understanding of astrology with our comprehensive guides.
            </p>
          </div>
        </div>

        {/* Luckstrology Features Guide */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Master Luckstrology's Features</h2>
          
          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Natal Chart Feature */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-8">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Natal Chart Analysis</h3>
                  <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    <span>Available Now</span>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6 leading-relaxed">
                Your natal chart is a cosmic snapshot of the sky at your exact moment of birth. It reveals your personality traits, life purpose, and potential challenges.
              </p>

              <div className="space-y-4 mb-6">
                <h4 className="font-semibold text-gray-900">How to use:</h4>
                <ol className="space-y-3 text-gray-700">
                  <li className="flex">
                    <span className="font-bold text-blue-600 mr-3">1.</span>
                    <span>Enter your birth date, time, and location in the form on the homepage</span>
                  </li>
                  <li className="flex">
                    <span className="font-bold text-blue-600 mr-3">2.</span>
                    <span>Click "Generate Chart" to create your personalized natal chart</span>
                  </li>
                  <li className="flex">
                    <span className="font-bold text-blue-600 mr-3">3.</span>
                    <span>View your Sun sign, Moon sign, Rising sign, and planetary placements</span>
                  </li>
                  <li className="flex">
                    <span className="font-bold text-blue-600 mr-3">4.</span>
                    <span>Explore the 12 houses to understand different life areas</span>
                  </li>
                </ol>
              </div>

              <div className="bg-white/50 rounded-xl p-4 border border-blue-200">
                <p className="text-sm text-gray-600">
                  <strong>💡 Pro tip:</strong> Save your chart data to quickly access it later and track transits affecting your birth placements.
                </p>
              </div>

              <Link
                href="/chart"
                className="inline-flex items-center space-x-2 mt-6 text-blue-600 hover:text-blue-700 font-medium"
              >
                <span>Try Natal Chart</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Horary Astrology Feature */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-8">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-16 h-16 bg-amber-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Horary Astrology</h3>
                  <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium mb-4">
                    <span className="w-2 h-2 bg-amber-600 rounded-full animate-pulse"></span>
                    <span>New Feature!</span>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6 leading-relaxed">
                Horary astrology answers specific questions by creating a chart for the moment the question is asked. It's like consulting the cosmos for guidance.
              </p>

              <div className="space-y-4 mb-6">
                <h4 className="font-semibold text-gray-900">How to use:</h4>
                <ol className="space-y-3 text-gray-700">
                  <li className="flex">
                    <span className="font-bold text-amber-600 mr-3">1.</span>
                    <span>Navigate to the Horary page from the menu</span>
                  </li>
                  <li className="flex">
                    <span className="font-bold text-amber-600 mr-3">2.</span>
                    <span>Type your sincere question (avoid yes/no questions)</span>
                  </li>
                  <li className="flex">
                    <span className="font-bold text-amber-600 mr-3">3.</span>
                    <span>Select a category that best fits your question</span>
                  </li>
                  <li className="flex">
                    <span className="font-bold text-amber-600 mr-3">4.</span>
                    <span>Submit to generate a horary chart and receive cosmic guidance</span>
                  </li>
                </ol>
              </div>

              <div className="bg-white/50 rounded-xl p-4 border border-amber-200">
                <p className="text-sm text-gray-600">
                  <strong>💡 Pro tip:</strong> Ask clear, specific questions about matters that genuinely concern you for the most accurate readings.
                </p>
              </div>

              <Link
                href="/guides/horary-astrology"
                className="inline-flex items-center space-x-2 mt-6 text-amber-600 hover:text-amber-700 font-medium"
              >
                <span>Learn Horary</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Astrocartography Feature */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200 p-8">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Astrocartography</h3>
                  <div className="inline-flex items-center space-x-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-4">
                    <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                    <span>Available Now</span>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6 leading-relaxed">
                Discover how different locations around the world can enhance various aspects of your life based on your birth chart's planetary lines.
              </p>

              <div className="space-y-4 mb-6">
                <h4 className="font-semibold text-gray-900">How to use:</h4>
                <ol className="space-y-3 text-gray-700">
                  <li className="flex">
                    <span className="font-bold text-purple-600 mr-3">1.</span>
                    <span>Generate your natal chart first (required for calculations)</span>
                  </li>
                  <li className="flex">
                    <span className="font-bold text-purple-600 mr-3">2.</span>
                    <span>Go to the Astrocartography page</span>
                  </li>
                  <li className="flex">
                    <span className="font-bold text-purple-600 mr-3">3.</span>
                    <span>View your planetary power lines on the world map</span>
                  </li>
                  <li className="flex">
                    <span className="font-bold text-purple-600 mr-3">4.</span>
                    <span>Click any location to see which planetary energies are strongest there</span>
                  </li>
                </ol>
              </div>

              <div className="bg-white/50 rounded-xl p-4 border border-purple-200">
                <p className="text-sm text-gray-600">
                  <strong>💡 Pro tip:</strong> Look for Jupiter lines for luck and expansion, Venus lines for love and beauty, or Sun lines for success and vitality.
                </p>
              </div>

              <Link
                href="/astrocartography"
                className="inline-flex items-center space-x-2 mt-6 text-purple-600 hover:text-purple-700 font-medium"
              >
                <span>Explore Map</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Event Chart Feature */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-8">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <span className="text-3xl">🗓️</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Event Planning</h3>
                  <div className="inline-flex items-center space-x-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-4">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    <span>Available Now</span>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6 leading-relaxed">
                Use electional astrology to find the most auspicious times for important events like weddings, business launches, or major decisions.
              </p>

              <div className="space-y-4 mb-6">
                <h4 className="font-semibold text-gray-900">How to use:</h4>
                <ol className="space-y-3 text-gray-700">
                  <li className="flex">
                    <span className="font-bold text-green-600 mr-3">1.</span>
                    <span>Navigate to the Events page</span>
                  </li>
                  <li className="flex">
                    <span className="font-bold text-green-600 mr-3">2.</span>
                    <span>Select your event type (wedding, business, travel, etc.)</span>
                  </li>
                  <li className="flex">
                    <span className="font-bold text-green-600 mr-3">3.</span>
                    <span>Choose your preferred date range and location</span>
                  </li>
                  <li className="flex">
                    <span className="font-bold text-green-600 mr-3">4.</span>
                    <span>View optimal timing suggestions based on planetary alignments</span>
                  </li>
                </ol>
              </div>

              <div className="bg-white/50 rounded-xl p-4 border border-green-200">
                <p className="text-sm text-gray-600">
                  <strong>💡 Pro tip:</strong> Avoid Mercury retrograde for contracts and communication, and choose Venus-ruled days for weddings and social events.
                </p>
              </div>

              <Link
                href="/events"
                className="inline-flex items-center space-x-2 mt-6 text-green-600 hover:text-green-700 font-medium"
              >
                <span>Plan Events</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Additional Features */}
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">More Features to Explore</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* Community Forum */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Community Forum</h4>
              <p className="text-sm text-gray-600 mb-4">
                Join discussions, share insights, and learn from fellow astrology enthusiasts.
              </p>
              <Link href="/discussions" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                Join Discussions →
              </Link>
            </div>


            {/* Chart History */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Chart History</h4>
              <p className="text-sm text-gray-600 mb-4">
                Access all your previously generated charts and horary questions.
              </p>
              <Link href="/chart" className="text-gray-600 hover:text-gray-700 text-sm font-medium">
                View History →
              </Link>
            </div>

            {/* Learning Resources */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Astrology Guides</h4>
              <p className="text-sm text-gray-600 mb-4">
                Deep dive into aspects, houses, signs, and advanced astrological concepts.
              </p>
              <Link href="/guides" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Read Guides →
              </Link>
            </div>

          </div>

          {/* Quick Start Guide */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-200 mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Quick Start Guide</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                  <span className="text-2xl font-bold text-indigo-600">1</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Create Your Profile</h4>
                <p className="text-sm text-gray-600">
                  Enter your birth details on the homepage to generate your natal chart
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                  <span className="text-2xl font-bold text-indigo-600">2</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Explore Features</h4>
                <p className="text-sm text-gray-600">
                  Try horary questions, check your astrocartography, or plan events
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                  <span className="text-2xl font-bold text-indigo-600">3</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Join Community</h4>
                <p className="text-sm text-gray-600">
                  Share insights and learn from others in our discussion forums
                </p>
              </div>
            </div>
          </div>

          {/* Start Your Journey CTA */}
          <div className="text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Ready to Begin Your Astrological Journey?</h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Luckstrology combines ancient wisdom with modern technology to help you understand yourself and navigate life's journey.
            </p>
            <Link
              href="/"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-medium text-lg shadow-lg hover:shadow-xl"
            >
              <span>Start Exploring</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}