/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { SharedChartClientProps } from "@/types/sharedChart";
import { useSharedChart } from "@/hooks/useSharedChart";
import LoadingSpinner from "@/components/reusable/LoadingSpinner";
import StatusToast from "@/components/reusable/StatusToast";
import ChartNotFound from "@/components/charts/ChartNotFound";
import ChartWelcome from "@/components/charts/ChartWelcome";
import SharedChartDisplay from "@/components/charts/SharedChartDisplay";

export default function SharedChartClient({ token, initialChart }: SharedChartClientProps) {
  const {
    chart,
    isLoading,
    isNotFound,
    shareChart,
    toast,
    hideStatus
  } = useSharedChart({ token, initialChart });

  const renderContent = () => {
    if (isLoading) {
      return (
        <LoadingSpinner
          variant="dots"
          size="lg"
          title="Loading Chart"
          subtitle="We're retrieving this cosmic blueprint. This should only take a moment..."
          screenCentered={true}
        />
      );
    }

    if (isNotFound) {
      return <ChartNotFound />;
    }

    if (chart) {
      return (
        <SharedChartDisplay
          chart={chart}
          onShare={shareChart}
        />
      );
    }

    return <ChartWelcome />;
  };

  return (
    <>
      <main className="bg-white">
        {/* Chart Section - Full width breakout */}
        <section className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
          <div className="px-6 py-8">
            {renderContent()}
          </div>
        </section>
      </main>

      {/* Status Toast */}
      <StatusToast
        title={toast.title}
        message={toast.message}
        status={toast.status}
        isVisible={toast.isVisible}
        onHide={hideStatus}
        duration={toast.duration}
      />
    </>
  );
}