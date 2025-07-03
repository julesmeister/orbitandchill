/* eslint-disable @typescript-eslint/no-explicit-any */
import { OptimalTimingResult } from "./types";
import { generateAstrologicalTitle } from "./titleGenerators";

// Helper function to check if two results have similar planetary patterns
export const isSimilarPlanetaryPattern = (
  result1: OptimalTimingResult,
  result2: OptimalTimingResult
): boolean => {
  // Check if the main planets involved are the same by comparing significant placements
  const getSignificantPlanets = (result: OptimalTimingResult) => {
    const planets = new Set<string>();

    // Extract planets from description
    const planetNames = [
      "sun",
      "moon",
      "mercury",
      "venus",
      "mars",
      "jupiter",
      "saturn",
      "uranus",
      "neptune",
      "pluto",
    ];
    const description = result.description.toLowerCase();

    planetNames.forEach((planet) => {
      if (description.includes(planet)) {
        planets.add(planet);
      }
    });

    // If no planets found in description, check chart data
    if (planets.size === 0 && result.chartData?.planets) {
      // Look for planets in the same houses as mentioned in description
      const houseMatch = description.match(/(\d+)(?:st|nd|rd|th)\s+house/i);
      if (houseMatch) {
        const targetHouse = parseInt(houseMatch[1]);
        result.chartData.planets.forEach((planet: any) => {
          if (planet.house === targetHouse) {
            planets.add(planet.name.toLowerCase());
          }
        });
      }
    }

    return planets;
  };

  const planets1 = getSignificantPlanets(result1);
  const planets2 = getSignificantPlanets(result2);

  // Consider patterns similar if they share at least 50% of significant planets
  const intersection = new Set(
    Array.from(planets1).filter((planet) => planets2.has(planet))
  );
  const union = new Set([...Array.from(planets1), ...Array.from(planets2)]);

  const similarity = intersection.size / Math.max(union.size, 1);
  return similarity >= 0.5; // At least 50% overlap
};

// Unified time window consolidation: Merge overlapping patterns into single windows
export const consolidateTimeWindows = (
  optimalDates: OptimalTimingResult[],
  selectedPriorities: string[]
): OptimalTimingResult[] => {
  // Group by date and title first
  const groupedByPattern = new Map<string, OptimalTimingResult[]>();

  optimalDates.forEach((result) => {
    const title = generateAstrologicalTitle(
      result.chartData,
      selectedPriorities,
      result.description,
      0,
      "houses"
    );
    const key = `${result.date}-${title}`;

    if (!groupedByPattern.has(key)) {
      groupedByPattern.set(key, []);
    }
    groupedByPattern.get(key)!.push(result);
  });

  // Process each group to create unified time windows
  const consolidatedResults: OptimalTimingResult[] = [];

  groupedByPattern.forEach((results, patternKey) => {
    if (results.length === 1) {
      // Single result - keep as is
      consolidatedResults.push(results[0]);
      return;
    }

    // Sort by time
    results.sort((a, b) => {
      const timeA = parseInt(a.time.split(":")[0]);
      const timeB = parseInt(b.time.split(":")[0]);
      return timeA - timeB;
    });

    // Find the overall time span for this pattern
    const firstTime = results[0].time;
    const lastTime = results[results.length - 1].time;
    const lastHour = parseInt(lastTime.split(":")[0]) + 1; // Add 1 hour to get end time
    const endTime = `${lastHour.toString().padStart(2, "0")}:00`;

    // Get the best score from all results in this pattern
    const bestScore = Math.max(...results.map((r) => r.score));
    const bestResult =
      results.find((r) => r.score === bestScore) || results[0];

    // Calculate duration
    const firstHour = parseInt(firstTime.split(":")[0]);
    const duration = lastHour - firstHour;
    const durationText =
      duration === 1
        ? "1 hour"
        : duration === 2
        ? "2 hours"
        : duration === 3
        ? "3 hours"
        : `${duration} hours`;

    // Create single consolidated window for this pattern
    consolidatedResults.push({
      ...bestResult,
      time: firstTime,
      timeWindow: {
        startTime: firstTime,
        endTime,
        duration: durationText,
      },
      description: `${bestResult.description} (${durationText} window)`,
      score: bestScore,
    });
  });

  // Sort by score
  return consolidatedResults.sort((a, b) => b.score - a.score);
};