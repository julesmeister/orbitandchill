/* eslint-disable @typescript-eslint/no-explicit-any */
import { calculatePlanetaryPositions, ChartAspect, PlanetPosition } from "../../utils/natalChart";
import { OptimalTimingResult } from "./types";
import { priorityCriteria } from "./priorities";
import { analyzeChartForPriorities } from "./chartAnalyzers";
import { generateAstrologicalTitle } from "./titleGenerators";
import { createEventFromResult } from "./eventCreation";
import { detectMagicFormula } from "./financialAstrologyCalculations";

// Score thresholds for different analysis methods - LOWERED for more events
export const scoreThresholds = {
  houses: 0.3, // Lowered from 0.8 - include more house placements
  aspects: 0.2, // Lowered from 0.5 - include more aspect combinations
  electional: 0.3, // Lowered from 0.6 - include more electional opportunities
};

// Magic Formula events get priority regardless of base thresholds
export const MAGIC_FORMULA_PRIORITY_THRESHOLD = 2.0; // Any event with Magic Formula bonus >= 2.0 gets included

// Time slots to test for each day (every hour for comprehensive coverage)
export const timesToTest = [
  "00:00", "01:00", "02:00", "03:00", "04:00", "05:00",
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
  "18:00", "19:00", "20:00", "21:00", "22:00", "23:00",
];

interface ScanningOptions {
  latitude: number;
  longitude: number;
  selectedPriorities: string[];
  userId: string;
  onEventGenerated?: (event: any) => Promise<void>;
  onProgress?: (progress: number, message: string) => void;
}

interface ScanningStats {
  totalCalculations: number;
  successfulCalculations: number;
  errorCount: number;
}

// Main scanning function that checks every day and hour for optimal timing
export const scanOptimalTiming = async (
  targetMonth: number,
  targetYear: number,
  daysInMonth: number,
  options: ScanningOptions
): Promise<{ optimalDates: OptimalTimingResult[], realTimeEvents: any[], stats: ScanningStats }> => {
  const { latitude, longitude, selectedPriorities, userId, onEventGenerated, onProgress } = options;
  
  let optimalDates: OptimalTimingResult[] = [];
  const realTimeEvents: any[] = []; // Track events emitted in real-time
  let eventIndex = 0; // Counter for unique event IDs
  
  let totalCalculations = 0;
  let successfulCalculations = 0;
  let errorCount = 0;

  // Scan each day of the month with better error handling
  for (let day = 1; day <= daysInMonth; day++) {
    // Update progress based on day
    const dayProgress = 25 + Math.floor((day / daysInMonth) * 40); // 25% to 65%
    onProgress?.(
      dayProgress,
      `Scanning day ${day}/${daysInMonth} for optimal timing...`
    );

    for (const timeStr of timesToTest) {
      totalCalculations++;

      try {
        const testDate = new Date(targetYear, targetMonth, day);
        const [hours, minutes] = timeStr.split(":").map(Number);
        testDate.setHours(hours, minutes, 0, 0);

        // Validate date construction
        if (
          testDate.getMonth() !== targetMonth ||
          testDate.getDate() !== day
        ) {
          // Date construction error, skip
          continue;
        }

        // Calculate actual planetary positions for this date/time
        const chartData = await calculatePlanetaryPositions(
          testDate,
          latitude,
          longitude
        );

        if (
          !chartData ||
          !chartData.planets ||
          chartData.planets.length === 0
        ) {
          // No chart data available
          errorCount++;
          continue;
        }

        successfulCalculations++;

        // Analyze chart using ALL three timing methods
        const timingMethods: Array<"houses" | "aspects" | "electional"> = [
          "houses",
          "aspects",
          "electional",
        ];

        for (const method of timingMethods) {
          const score = analyzeChartForPriorities(
            chartData,
            selectedPriorities,
            false,
            method,
            testDate
          );
          const threshold = scoreThresholds[method];

          // Check if this is a Magic Formula event (gets priority)
          const magicFormula = detectMagicFormula(chartData);
          const isMagicFormulaEvent =
            magicFormula.hasFullFormula || magicFormula.hasPartialFormula;

          // Include results that meet the score threshold OR are Magic Formula events
          if (
            score >= threshold ||
            (isMagicFormulaEvent &&
              score >= MAGIC_FORMULA_PRIORITY_THRESHOLD)
          ) {
            // Check for combo matches first for description
            let description = "";
            const comboDescriptions: string[] = [];

            selectedPriorities.forEach((priority) => {
              const criteria = priorityCriteria[priority];
              if (!criteria || !criteria.comboCriteria) return;

              criteria.comboCriteria.forEach((combo) => {
                const planetsInHouse = combo.planets.filter(
                  (planetName) => {
                    const planet = chartData.planets.find(
                      (p: PlanetPosition) => p.name === planetName
                    );
                    return planet && planet.house === combo.house;
                  }
                );

                if (planetsInHouse.length === combo.planets.length) {
                  comboDescriptions.push(combo.description);
                }
              });
            });

            if (comboDescriptions.length > 0) {
              description = comboDescriptions[0]; // Use the first combo description
            } else {
              // Find the most significant aspects for description
              const significantAspects = chartData.aspects
                .filter((aspect: ChartAspect) => {
                  const criteria = selectedPriorities.flatMap(
                    (p) => priorityCriteria[p]?.favorablePlanets || []
                  );
                  return (
                    criteria.includes(aspect.planet1) &&
                    criteria.includes(aspect.planet2)
                  );
                })
                .slice(0, 2);

              description =
                significantAspects.length > 0
                  ? significantAspects
                      .map(
                        (a: ChartAspect) =>
                          `${a.planet1} ${a.aspect} ${a.planet2}`
                      )
                      .join(", ")
                  : method === "houses"
                  ? `Favorable house placements`
                  : method === "aspects"
                  ? `Favorable planetary aspects`
                  : `Electional timing considerations`;
            }

            const optimalResult: OptimalTimingResult = {
              date: testDate.toISOString().split("T")[0],
              time: timeStr,
              score: Math.round(score),
              description,
              priorities: selectedPriorities,
              chartData,
              timingMethod: method,
            };

            optimalDates.push(optimalResult);

            // Real-time event emission: Create and emit event immediately if callback provided
            if (onEventGenerated) {
              try {
                const realTimeEvent = createEventFromResult(
                  optimalResult,
                  eventIndex++,
                  userId,
                  selectedPriorities
                );
                realTimeEvents.push(realTimeEvent);
                await onEventGenerated(realTimeEvent);
              } catch (emitError) {
                console.warn("Real-time event emission failed:", emitError);
                // Continue generation even if individual emission fails
              }
            }
          }
        }
      } catch (error) {
        // Error during calculation, continue
        errorCount++;
        continue;
      }

      // Add small delay to prevent overwhelming the calculation engine
      await new Promise((resolve) => setTimeout(resolve, 10));
    }

    // Add delay between days to prevent memory issues
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  return {
    optimalDates,
    realTimeEvents,
    stats: {
      totalCalculations,
      successfulCalculations,
      errorCount
    }
  };
};