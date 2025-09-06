/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { lazy, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import ChartSkeleton from "@/components/charts/components/ChartSkeleton";

// Lazy load chart modules for better performance
const ChartCore = lazy(() => import("./modules/ChartCore"));
const ChartActions = lazy(() => import("./modules/ChartActions"));

interface ChartShellProps {
  initialData?: any;
}

/**
 * Micro-frontend chart shell that progressively loads chart modules
 * Uses React Server Components pattern for optimal performance
 */
export default function ChartShell({ initialData }: ChartShellProps) {
  return (
    <main className="bg-white min-h-screen">
      {/* Chart Section - Testing without full width breakout */}
      <section className="w-full">
        <div className="px-6 py-8 max-w-7xl mx-auto">
          <ErrorBoundary
            fallbackRender={({ error, resetErrorBoundary }) => (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 m-4">
                <h2 className="text-red-800 font-semibold mb-2">Chart Loading Error</h2>
                <p className="text-red-600 mb-4">{error?.message || 'Something went wrong loading the chart'}</p>
                <button
                  onClick={resetErrorBoundary}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Try Again
                </button>
              </div>
            )}
            onError={(error, errorInfo) => {
              console.error('Chart Shell Error:', error, errorInfo);
            }}
          >
            {/* Core Chart - Loads first (critical above-fold content) */}
            <Suspense fallback={<ChartSkeleton variant="chart" />}>
              <ChartCore initialData={initialData} />
            </Suspense>

            {/* Chart Interpretation moved to sidebar - no longer needed as separate module */}

            {/* Chart Actions - Deferred loading */}
            <Suspense fallback={<div className="h-16" />}>
              <ChartActions />
            </Suspense>
          </ErrorBoundary>
        </div>
      </section>
    </main>
  );
}