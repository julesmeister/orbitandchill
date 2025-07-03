/* eslint-disable @typescript-eslint/no-explicit-any */
import { OptimalTimingResult } from "./types";
import { detectMagicFormula } from "./financialAstrologyCalculations";

// Improved distribution strategy with Magic Formula priority
export const applyDistributionStrategy = (
  optimalDates: OptimalTimingResult[],
  daysInMonth: number
): OptimalTimingResult[] => {
  const enhancedDistribution: OptimalTimingResult[] = [];

  // FIRST PRIORITY: Magic Formula events regardless of score (ultra-permissive threshold)
  const magicFormulaResults = optimalDates.filter((result) => {
    const magicFormula = detectMagicFormula(result.chartData);
    return (
      (magicFormula.hasFullFormula || magicFormula.hasPartialFormula) &&
      result.score >= 0.5
    );
  });
  enhancedDistribution.push(...magicFormulaResults);

  // Remove Magic Formula results from further processing to avoid duplicates
  const remainingResults = optimalDates.filter((result) => {
    const magicFormula = detectMagicFormula(result.chartData);
    return !(magicFormula.hasFullFormula || magicFormula.hasPartialFormula);
  });

  // Second, take all remaining results with scores >= 3 (excellent timing) - LOWERED
  const excellentResults = remainingResults.filter(
    (result) => result.score >= 3
  );
  enhancedDistribution.push(...excellentResults);

  // Then, add good results (score 1.5-3) with day variety to prevent clustering - LOWERED
  const goodResults = remainingResults.filter(
    (result) => result.score >= 1.5 && result.score < 3
  );
  const resultsByDay = goodResults.reduce((acc, result) => {
    const day = new Date(result.date).getDate();
    if (!acc[day]) acc[day] = [];
    acc[day].push(result);
    return acc;
  }, {} as Record<number, OptimalTimingResult[]>);

  // Add up to 3 good results per day to maintain variety but allow more entries
  Object.keys(resultsByDay)
    .sort((a, b) => parseInt(a) - parseInt(b))
    .forEach((day) => {
      const dayResults = resultsByDay[parseInt(day)].sort(
        (a, b) => b.score - a.score
      );
      const usedDays = new Set(
        enhancedDistribution.map((r) => new Date(r.date).getDate())
      );

      if (usedDays.has(parseInt(day))) {
        // Day already has excellent results, add up to 2 more good ones
        enhancedDistribution.push(...dayResults.slice(0, 2));
      } else {
        // Day has no excellent results, add up to 3 good ones
        enhancedDistribution.push(...dayResults.slice(0, 3));
      }
    });

  // Add decent results (score 1.0-1.5) more selectively - LOWERED
  const decentResults = remainingResults.filter(
    (result) => result.score >= 1.0 && result.score < 1.5
  );
  for (let day = 1; day <= daysInMonth; day++) {
    const dayHasResults = enhancedDistribution.some(
      (r) => new Date(r.date).getDate() === day
    );
    if (!dayHasResults) {
      const dayDecentResults = decentResults.filter(
        (r) => new Date(r.date).getDate() === day
      );
      if (dayDecentResults.length > 0) {
        // Add best decent result for days with no good/excellent results
        dayDecentResults.sort((a, b) => b.score - a.score);
        enhancedDistribution.push(dayDecentResults[0]);
      }
    }
  }

  // Finally, add some challenging results (score 0.5-1.0) to show users what to avoid - LOWERED
  const challengingResults = remainingResults.filter(
    (result) => result.score >= 0.5 && result.score < 1.0
  );
  const challengingByDay = challengingResults.reduce((acc, result) => {
    const day = new Date(result.date).getDate();
    if (!acc[day]) acc[day] = [];
    acc[day].push(result);
    return acc;
  }, {} as Record<number, OptimalTimingResult[]>);

  // Add up to 1 challenging result per day (to show what to avoid)
  Object.keys(challengingByDay).forEach((day) => {
    const dayResults = challengingByDay[parseInt(day)].sort(
      (a, b) => a.score - b.score
    ); // Sort by worst first
    const dayNum = parseInt(day);
    const existingResults = enhancedDistribution.filter(
      (r) => new Date(r.date).getDate() === dayNum
    );

    // Only add challenging if day has less than 3 results total
    if (existingResults.length < 3 && dayResults.length > 0) {
      enhancedDistribution.push(dayResults[0]); // Add worst challenging result
    }
  });

  // Sort final results by date and time for better calendar display
  enhancedDistribution.sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });

  return enhancedDistribution;
};

// Fallback strategy when no results are found
export const applyFallbackStrategy = (
  optimalDates: OptimalTimingResult[]
): OptimalTimingResult[] => {
  const fallbackResults = optimalDates.filter((result) => result.score > 0);
  
  if (fallbackResults.length > 0) {
    fallbackResults.sort((a, b) => b.score - a.score);
    const fallbackCount = Math.min(10, fallbackResults.length);
    return fallbackResults.slice(0, fallbackCount);
  }
  
  return [];
};