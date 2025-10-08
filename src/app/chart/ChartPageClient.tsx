/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { Suspense } from "react";
import LoadingSpinner from "../../components/reusable/LoadingSpinner";
import ChartContentRenderer from "../../components/charts/ChartContentRenderer";
import { useChartPage } from "../../hooks/useChartPage";
import { getAvatarByIdentifier } from "../../utils/avatarUtils";

function ChartContent() {
  const {
    router,
    user,
    activeTab,
    cachedChart,
    personToShow,
    birthDataToShow,
    isLoading,
    isGenerating,
    loadingTitle,
    loadingDescription,
    hasBirthData,
    handleClearAllCaches,
    handleRegenerateChart,
    handlePersonChange,
    handleAddPersonClick,
    handleShare,
    setActiveTab,
  } = useChartPage();

  // Chart avatar logic - using the same pattern as navbar
  const chartSubjectName = cachedChart?.metadata?.name || personToShow?.name || "Unknown";
  const chartSubjectAvatar = user?.preferredAvatar || user?.profilePictureUrl || getAvatarByIdentifier(chartSubjectName);

  return (
    <>
      <main className="bg-white">
        {/* Chart Section - Full width breakout */}
        <section className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
          <div className="px-6 py-8">
            <ChartContentRenderer
              isLoading={isLoading}
              loadingTitle={loadingTitle}
              loadingDescription={loadingDescription}
              cachedChart={cachedChart}
              personToShow={personToShow}
              birthDataToShow={birthDataToShow || null}
              chartSubjectAvatar={chartSubjectAvatar}
              activeTab={activeTab}
              isGenerating={isGenerating}
              hasBirthData={hasBirthData}
              onRegenerateChart={handleRegenerateChart}
              onPersonChange={handlePersonChange}
              onAddPersonClick={handleAddPersonClick}
              onClearCache={handleClearAllCaches}
              onShare={handleShare}
            />
          </div>
        </section>
      </main>

    </>
  );
}

export default function ChartPageClient() {
  return (
    <Suspense fallback={
      <LoadingSpinner
        variant="dots"
        size="lg"
        title="Loading Chart"
        subtitle="Preparing your cosmic experience..."
        screenCentered={true}
      />
    }>
      <ChartContent />
    </Suspense>
  );
}