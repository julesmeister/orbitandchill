/* eslint-disable @typescript-eslint/no-unused-vars */
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="bg-white">
      {/* Main Error Section */}
      <section className="px-[5%] py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Three-dot loading animation pattern (adapted for error state) */}
          <div className="flex items-center justify-center space-x-2 mb-8">
            <div className="w-3 h-3 bg-black [animation-delay:-0.3s] animate-pulse"></div>
            <div className="w-3 h-3 bg-black [animation-delay:-0.15s] animate-pulse"></div>
            <div className="w-3 h-3 bg-black animate-pulse"></div>
          </div>

          {/* Large 404 Display */}
          <h1 className="font-space-grotesk text-8xl md:text-9xl font-bold text-black mb-6">
            404
          </h1>
          
          {/* Error Title */}
          <h2 className="font-space-grotesk text-3xl md:text-4xl font-bold text-black mb-6">
            Discussion Not Found
          </h2>
          
          {/* Error Description */}
          <p className="font-inter text-xl text-black/80 leading-relaxed mb-8 max-w-2xl mx-auto">
            The discussion you're looking for doesn't exist or may have been removed. 
            Let's get you back to exploring our community conversations.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link
              href="/discussions"
              className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white font-semibold border-2 border-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/25"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Discussions
            </Link>
            
            <Link
              href="/"
              className="inline-flex items-center gap-3 px-8 py-4 bg-transparent text-black font-semibold border-2 border-black transition-all duration-300 hover:bg-black hover:text-white hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Go Home
            </Link>
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="px-[5%] py-16" style={{ backgroundColor: '#f0e3ff' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="font-space-grotesk text-2xl font-bold text-black mb-6">
            Looking for Something Specific?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Popular Categories */}
            <div className="p-6 bg-white border border-black">
              <div className="w-10 h-10 bg-black text-white flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h4 className="font-space-grotesk text-lg font-bold text-black mb-3">Browse Categories</h4>
              <p className="text-black/70 text-sm mb-4">Explore discussions by astrology topics</p>
              <Link
                href="/discussions?category=all"
                className="text-black font-semibold hover:text-gray-700 transition-colors"
              >
                View All Categories →
              </Link>
            </div>

            {/* Search */}
            <div className="p-6 bg-white border border-black">
              <div className="w-10 h-10 bg-black text-white flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h4 className="font-space-grotesk text-lg font-bold text-black mb-3">Search Discussions</h4>
              <p className="text-black/70 text-sm mb-4">Find specific topics or keywords</p>
              <Link
                href="/discussions"
                className="text-black font-semibold hover:text-gray-700 transition-colors"
              >
                Start Searching →
              </Link>
            </div>

            {/* New Discussion */}
            <div className="p-6 bg-white border border-black">
              <div className="w-10 h-10 bg-black text-white flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h4 className="font-space-grotesk text-lg font-bold text-black mb-3">Start a Discussion</h4>
              <p className="text-black/70 text-sm mb-4">Create a new topic for the community</p>
              <Link
                href="/discussions/new"
                className="text-black font-semibold hover:text-gray-700 transition-colors"
              >
                Create Discussion →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}