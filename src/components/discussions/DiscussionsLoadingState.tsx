/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

export default function DiscussionsLoadingState() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="px-[5%] py-16">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-space-grotesk text-5xl md:text-6xl font-bold text-black mb-6">
            Astrology Discussions
          </h1>
          <p className="font-open-sans text-xl text-black/80 leading-relaxed max-w-3xl mx-auto">
            Connect with fellow star enthusiasts, share insights, and explore the mysteries of the cosmos together
          </p>
        </div>
      </section>

      {/* Search Section Skeleton */}
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <section className="px-6 md:px-12 lg:px-20 py-8">
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            <div className="relative flex-1">
              <div className="w-full h-14 border-b-2 border-black bg-gray-100 animate-pulse"></div>
            </div>
            <div className="flex items-end gap-4">
              <div className="w-64 h-14 border border-black bg-gray-100 animate-pulse"></div>
              <div className="flex items-center gap-3">
                <div className="w-24 h-14 border-2 border-black bg-gray-100 animate-pulse"></div>
                <div className="w-36 h-14 border-2 border-black bg-gray-100 animate-pulse"></div>
                <div className="w-32 h-14 border-2 border-black bg-gray-100 animate-pulse"></div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Main Content Skeleton */}
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <section className="px-6 md:px-12 lg:px-20 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-0">
            {/* Sidebar Skeleton */}
            <div className="lg:col-span-1 border border-black bg-white">
              <div className="p-6 border-b border-black">
                <div className="h-6 bg-gray-200 w-24 animate-pulse"></div>
              </div>
              <div className="divide-y divide-black">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="px-6 py-4 flex items-center justify-between">
                    <div className="h-4 bg-gray-200 w-32 animate-pulse"></div>
                    <div className="h-6 w-8 border border-black bg-gray-100 animate-pulse"></div>
                  </div>
                ))}
              </div>
              
              {/* Community Stats Skeleton */}
              <div className="p-6 border-t border-black">
                <div className="h-5 bg-gray-200 w-28 mb-4 animate-pulse"></div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 w-20 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 w-8 animate-pulse"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 w-24 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 w-6 animate-pulse"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 w-16 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 w-10 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Skeleton */}
            <div className="lg:col-span-3 lg:border-t lg:border-r lg:border-b border-black">
              <div className="divide-y divide-black">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="relative p-6 animate-pulse">
                    {/* Category color indicator */}
                    <div className="absolute left-0 top-6 w-1 h-8 bg-gray-300"></div>
                    
                    <div className="pl-6">
                      {/* Header with badges */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {/* Title */}
                            <div className="h-6 bg-gray-200 w-3/4 animate-pulse"></div>
                          </div>

                          {/* Meta Info */}
                          <div className="flex items-center gap-3 mb-3">
                            <div className="h-4 bg-gray-200 w-20 animate-pulse"></div>
                            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                            <div className="h-5 bg-gray-200 w-24 animate-pulse"></div>
                            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                            <div className="h-4 bg-gray-200 w-16 animate-pulse"></div>
                          </div>

                          {/* Excerpt */}
                          <div className="space-y-2 mb-4">
                            <div className="h-4 bg-gray-200 w-full animate-pulse"></div>
                            <div className="h-4 bg-gray-200 w-5/6 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 w-2/3 animate-pulse"></div>
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            <div className="h-6 bg-gray-200 w-16 animate-pulse"></div>
                            <div className="h-6 bg-gray-200 w-20 animate-pulse"></div>
                            <div className="h-6 bg-gray-200 w-12 animate-pulse"></div>
                          </div>

                          {/* Stats */}
                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-1">
                              <div className="w-4 h-4 bg-gray-200 animate-pulse"></div>
                              <div className="h-4 bg-gray-200 w-16 animate-pulse"></div>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-4 h-4 bg-gray-200 animate-pulse"></div>
                              <div className="h-4 bg-gray-200 w-14 animate-pulse"></div>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-4 h-4 bg-gray-200 animate-pulse"></div>
                              <div className="h-4 bg-gray-200 w-12 animate-pulse"></div>
                            </div>
                          </div>
                        </div>

                        {/* Quick Actions Skeleton */}
                        <div className="flex flex-col gap-2 ml-4">
                          <div className="w-10 h-10 border border-black bg-gray-100 animate-pulse"></div>
                          <div className="w-10 h-10 border border-black bg-gray-100 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

    </div>
  );
}