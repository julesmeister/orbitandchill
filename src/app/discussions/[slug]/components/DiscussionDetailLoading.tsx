/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

export default function DiscussionDetailLoading() {
  return (
    <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-white">
      {/* Header Skeleton */}
      <section className="px-4 md:px-8 lg:px-12 py-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-32 h-8 bg-gray-200 animate-pulse border border-black"></div>
          </div>
          <div className="text-right">
            <div className="w-20 h-5 bg-gray-200 animate-pulse mb-1 ml-auto"></div>
            <div className="w-80 h-8 bg-gray-200 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Content Skeleton */}
      <section className="px-4 md:px-8 lg:px-12 py-0">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-0">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-3 border border-black bg-white">
            <div className="p-6 space-y-4">
              {/* Author info skeleton */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gray-200 animate-pulse rounded-full"></div>
                <div className="space-y-2">
                  <div className="w-32 h-4 bg-gray-200 animate-pulse"></div>
                  <div className="w-24 h-3 bg-gray-200 animate-pulse"></div>
                </div>
              </div>
              
              {/* Content skeleton */}
              <div className="space-y-3">
                <div className="w-full h-4 bg-gray-200 animate-pulse"></div>
                <div className="w-full h-4 bg-gray-200 animate-pulse"></div>
                <div className="w-3/4 h-4 bg-gray-200 animate-pulse"></div>
                <div className="w-full h-4 bg-gray-200 animate-pulse"></div>
                <div className="w-5/6 h-4 bg-gray-200 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="lg:col-span-1 lg:border-t lg:border-r lg:border-b border-black">
            <div className="p-4 space-y-4">
              <div className="w-full h-8 bg-gray-200 animate-pulse"></div>
              <div className="w-3/4 h-4 bg-gray-200 animate-pulse"></div>
              <div className="w-full h-4 bg-gray-200 animate-pulse"></div>
              <div className="w-2/3 h-4 bg-gray-200 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Loading indicator */}
      <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-white border border-black px-4 py-2 font-open-sans">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
        <span className="text-sm text-black">Loading discussion...</span>
      </div>
    </div>
  );
}