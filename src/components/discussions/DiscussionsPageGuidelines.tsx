/* eslint-disable @typescript-eslint/no-unused-vars */

import Link from 'next/link';

/**
 * Community Guidelines Section Component for Discussions Page
 */
export default function DiscussionsPageGuidelines() {
  return (
    <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      <section className="px-6 md:px-12 lg:px-20 py-16" style={{ backgroundColor: '#f0e3ff' }}>
        <div className="text-center">
          <h2 className="font-space-grotesk text-3xl font-bold text-black mb-4">
            Community Guidelines
          </h2>
          <p className="font-open-sans text-lg text-black/80 mb-8 max-w-2xl mx-auto">
            Help us maintain a welcoming and respectful community for all astrology enthusiasts
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-white border border-black">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="font-space-grotesk text-lg font-bold text-black mb-2">Be Respectful</h3>
              <p className="text-black/70 text-sm">Treat all members with kindness and respect, regardless of their level of astrological knowledge.</p>
            </div>

            <div className="p-6 bg-white border border-black">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-space-grotesk text-lg font-bold text-black mb-2">Share Knowledge</h3>
              <p className="text-black/70 text-sm">Share your insights and experiences to help others learn and grow in their astrological journey.</p>
            </div>

            <div className="p-6 bg-white border border-black">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-space-grotesk text-lg font-bold text-black mb-2">Stay On Topic</h3>
              <p className="text-black/70 text-sm">Keep discussions focused on astrology and related topics to maintain the quality of our community.</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Link 
              href="/community/guidelines"
              className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white font-semibold border-2 border-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/25"
            >
              Read Full Guidelines
            </Link>
            <Link 
              href="/contact"
              className="inline-flex items-center gap-3 px-8 py-4 bg-transparent text-black font-semibold border-2 border-black transition-all duration-300 hover:bg-black hover:text-white hover:-translate-y-0.5"
            >
              Report an Issue
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}