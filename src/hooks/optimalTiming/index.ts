/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { AstrologicalEvent } from "../../store/eventsStore";

// Import modular components
import {
  UseOptimalTimingOptions,
  OptimalTimingResult,
  TimingPriority,
} from "./types";
import { timingPriorities } from "./priorities";
import { analyzeChartForPriorities } from "./chartAnalyzers";
import { generateAstrologicalTitle } from "./titleGenerators";
import { calculateTimeRange } from "./astrologicalUtils";

// Import refactored modules
import { consolidateTimeWindows } from "./consolidation";
import { applyDistributionStrategy, applyFallbackStrategy } from "./distribution";
import { scanOptimalTiming } from "./scanning";
import { createEventFromResult, enhanceWithFinancialKeywords, enhanceDescriptionWithFinancialData } from "./eventCreation";

export const useOptimalTiming = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateOptimalTiming = async (
    options: UseOptimalTimingOptions
  ): Promise<void> => {
    const {
      latitude,
      longitude,
      currentDate,
      selectedPriorities,
      userId,
      onEventGenerated,
      onEventsGenerated,
      onProgress,
    } = options;

    if (selectedPriorities.length === 0) {
      throw new Error(
        "Please select at least one priority to generate optimal timing."
      );
    }

    setIsGenerating(true);

    try {
      const targetMonth = currentDate.getMonth();
      const targetYear = currentDate.getFullYear();
      const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate();

      onProgress?.(
        25,
        `Analyzing ${daysInMonth} days in ${new Date(
          targetYear,
          targetMonth
        ).toLocaleDateString("en-US", { month: "long" })}...`
      );

      // Phase 1: Scan for optimal timing
      const { optimalDates: rawResults, realTimeEvents } = await scanOptimalTiming(
        targetMonth,
        targetYear,
        daysInMonth,
        {
          latitude,
          longitude,
          selectedPriorities,
          userId,
          onEventGenerated,
          onProgress,
        }
      );

      // Sort by score and take top results
      let optimalDates = rawResults.sort((a, b) => b.score - a.score);

      onProgress?.(
        65,
        `Consolidating ${optimalDates.length} potential timing windows...`
      );

      // Phase 2: Consolidate time windows
      optimalDates = consolidateTimeWindows(optimalDates, selectedPriorities);

      onProgress?.(
        75,
        `Applying distribution strategy to ${optimalDates.length} results...`
      );

      // Phase 3: Apply distribution strategy
      let enhancedDistribution = applyDistributionStrategy(optimalDates, daysInMonth);

      // Phase 4: Apply fallback strategy if needed
      if (enhancedDistribution.length === 0) {
        enhancedDistribution = applyFallbackStrategy(optimalDates);
      }

      // Final check - if still no results, provide a helpful error
      if (enhancedDistribution.length === 0) {
        throw new Error(
          `No astrological alignments found in ${new Date(
            targetYear,
            targetMonth
          ).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })} for the selected priorities. This may happen in months with challenging planetary configurations. Try different priorities, switch timing modes, or navigate to another month.`
        );
      }

      const topResults = enhancedDistribution;

      onProgress?.(85, `Creating ${topResults.length} astrological events...`);

      // Create events from results using modular event creation
      const newEvents: AstrologicalEvent[] = topResults.map((optimal, index) =>
        createEventFromResult(optimal, index, userId, selectedPriorities)
      );

      onProgress?.(95, `Finalizing ${newEvents.length} events...`);

      // If real-time events were emitted, use those for final callback
      // Otherwise, use the batch-processed events (backward compatibility)
      const finalEvents =
        realTimeEvents.length > 0 ? realTimeEvents : newEvents;

      onProgress?.(
        100,
        `Complete! Generated ${finalEvents.length} optimal timing events.`
      );

      onEventsGenerated(finalEvents);
    } catch (error) {
      console.error("Error generating optimal timing:", error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    timingPriorities,
    generateOptimalTiming,
    analyzeChartForPriorities,
    generateAstrologicalTitle,
  };
};

// Re-export types and constants for backward compatibility
export type { TimingPriority } from "./types";
export { timingPriorities } from "./priorities";
export { calculateTimeRange } from "./astrologicalUtils";
