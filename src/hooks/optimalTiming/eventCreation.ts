/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChartAspect, PlanetPosition } from "../../utils/natalChart";
import { AstrologicalEvent } from "../../store/eventsStore";
import { OptimalTimingResult } from "./types";
import { generateAstrologicalTitle } from "./titleGenerators";
import {
  calculateTimeWindow,
  getMoonPhase,
  checkBeneficsAngular,
  getMaleficAspects,
} from "./astrologicalUtils";
import { getPlanetaryDignity } from "../../utils/astrologicalInterpretations";
import {
  detectMagicFormula,
  getJupiterFavoredSectors,
  isJupiterFavoredTiming,
  calculateIngressWindows,
  calculateEconomicCyclePhase,
  calculateVoidOfCourseMoon,
  isSaturnRestrictedTiming,
} from "./financialAstrologyCalculations";

// Helper function to enhance titles with REAL financial astrology keywords for filter detection
export const enhanceWithFinancialKeywords = (
  title: string,
  chartData: any,
  eventDate: Date
): string => {
  let enhancedTitle = title;

  // Magic Formula detection disabled - Jupiter-Pluto aspects not active in 2025
  // Will reactivate when astronomical conditions return ~2033-2035

  // REAL Jupiter sector analysis based on actual Jupiter sign
  const jupiter = chartData.planets.find((p: any) => p.name === "jupiter");
  if (jupiter?.sign) {
    const favoredSectors = getJupiterFavoredSectors(jupiter.sign);

    // Check if current timing involves Jupiter-favored sectors
    if (isJupiterFavoredTiming(chartData, title, enhancedTitle)) {
      const relevantSector = favoredSectors.find(
        (sector) =>
          enhancedTitle.toLowerCase().includes(sector.toLowerCase()) ||
          (sector === "Communication" &&
            (enhancedTitle.toLowerCase().includes("3rd") ||
              enhancedTitle.toLowerCase().includes("mercury"))) ||
          (sector === "Transportation" &&
            enhancedTitle.toLowerCase().includes("travel"))
      );

      if (relevantSector) {
        enhancedTitle += ` (Jupiter favored sector: ${relevantSector})`;
      }
    }
  }

  // REAL planetary ingress detection using actual planetary positions
  const ingressInfo = calculateIngressWindows(eventDate, chartData);
  if (ingressInfo) {
    enhancedTitle += ` (${ingressInfo.planet} ingress window - ${ingressInfo.daysFromIngress} days)`;
  }

  return enhancedTitle;
};

// Helper function to enhance descriptions with REAL financial astrology data
export const enhanceDescriptionWithFinancialData = (
  description: string,
  chartData: any,
  eventDate: Date,
  score: number
): string => {
  let enhancedDesc = description;

  // REAL economic cycle analysis based on outer planet positions
  const economicPhase = calculateEconomicCyclePhase(chartData, score);
  if (economicPhase === "expansion") {
    enhancedDesc += " Economic expansion phase indicators present.";
  } else {
    enhancedDesc += " Economic consolidation phase - proceed with caution.";
  }

  // REAL void moon calculation using lunar aspects
  const voidMoonData = calculateVoidOfCourseMoon(eventDate, chartData);
  if (voidMoonData.isVoidMoon) {
    enhancedDesc += " ⚠️ Void of Course Moon - avoid major business decisions.";

    if (voidMoonData.hasDeclinationSupport) {
      enhancedDesc += " However, declination aspects provide some support.";
    }
  }

  // REAL Mercury retrograde status from chart data
  const mercury = chartData.planets.find((p: any) => p.name === "mercury");
  if (mercury?.retrograde) {
    enhancedDesc +=
      " ⚠️ Mercury retrograde affects communication and contracts.";
  }

  // REAL Saturn restriction warnings
  if (isSaturnRestrictedTiming(chartData, description, enhancedDesc)) {
    const saturn = chartData.planets.find((p: any) => p.name === "saturn");
    if (saturn?.sign) {
      enhancedDesc += ` ⚠️ Saturn in ${saturn.sign} creates restrictions in this sector.`;
    }
  }

  return enhancedDesc;
};

// Helper function to create a single event from optimal timing result
export const createEventFromResult = (
  optimal: OptimalTimingResult,
  index: number,
  userId: string,
  selectedPriorities: string[]
): AstrologicalEvent => {
  // Generate astrological title with financial astrology enhancements
  const title = generateAstrologicalTitle(
    optimal.chartData,
    selectedPriorities,
    optimal.description,
    index,
    optimal.timingMethod
  );

  // Create event date for financial enhancements
  const eventDate = new Date(optimal.date);

  // Add financial astrology keywords to title and description for filter detection
  const enhancedTitle = enhanceWithFinancialKeywords(
    title,
    optimal.chartData,
    eventDate
  );
  const enhancedDescription = enhanceDescriptionWithFinancialData(
    optimal.description,
    optimal.chartData,
    eventDate,
    optimal.score
  );

  // Determine event type based on score and challenging indicators
  let eventType: "benefic" | "challenging" | "neutral" = "benefic";
  if (optimal.score < 2.5 || title.includes("⚠️")) {
    eventType = "challenging";
  } else if (optimal.score < 4.5) {
    eventType = "neutral";
  }

  // Calculate time window for this optimal timing
  let timeWindow;
  if (optimal.timingMethod === "combined") {
    // For consolidated results, extract the existing window from description or calculate enhanced window
    const durationMatch = optimal.description.match(/\(([^)]+)\)$/);
    if (durationMatch) {
      // Use the duration from consolidation
      const duration = durationMatch[1];
      timeWindow = {
        startTime: optimal.time,
        endTime: optimal.time, // Will be updated below
        duration,
      };

      // Calculate proper end time based on duration
      const [hours, minutes] = optimal.time.split(":").map(Number);
      const startMinutes = hours * 60 + minutes;

      // Parse duration to get window size
      const durationHours = duration.includes("hour")
        ? parseInt(duration.match(/(\d+)\s+hour/)?.[1] || "2")
        : 0;
      const durationMins = duration.includes("minute")
        ? parseInt(duration.match(/(\d+)\s+minute/)?.[1] || "0")
        : 0;
      const totalDurationMinutes = durationHours * 60 + durationMins;

      const endMinutes = startMinutes + totalDurationMinutes;
      const endHours = Math.floor(endMinutes / 60) % 24;
      const endMins = endMinutes % 60;

      timeWindow.endTime = `${endHours.toString().padStart(2, "0")}:${endMins
        .toString()
        .padStart(2, "0")}`;
    } else {
      // Fallback to enhanced window for consolidated results
      timeWindow = calculateTimeWindow(
        optimal.time,
        optimal.score,
        eventType
      );
      // Extend window for consolidated results
      timeWindow.duration = `${Math.ceil(
        parseFloat(timeWindow.duration.split(" ")[0]) * 1.5
      )} hours`;
    }
  } else {
    // Normal time window calculation
    timeWindow = calculateTimeWindow(optimal.time, optimal.score, eventType);
  }

  // Get Mercury retrograde status from the already-calculated chart data
  const mercury = optimal.chartData.planets.find(
    (planet: any) => planet.name === "mercury"
  );
  const mercuryRetrograde = mercury?.retrograde || false;

  // Calculate dignified planets from chart data
  const dignifiedPlanets = optimal.chartData.planets
    .map((planet: any) => {
      const dignity = getPlanetaryDignity(
        planet.name.toLowerCase(),
        planet.sign.toLowerCase()
      );
      if (dignity !== "neutral") {
        return {
          planet: planet.name,
          dignity: dignity as
            | "exaltation"
            | "rulership"
            | "detriment"
            | "fall"
            | "neutral",
        };
      }
      return null;
    })
    .filter(Boolean);

  const electionalData = {
    mercuryStatus: mercuryRetrograde
      ? "retrograde"
      : ("direct" as "direct" | "retrograde"),
    moonPhase: getMoonPhase(eventDate) as
      | "new"
      | "waxing_crescent"
      | "first_quarter"
      | "waxing_gibbous"
      | "full"
      | "waning_gibbous"
      | "last_quarter"
      | "waning_crescent",
    beneficsAngular: checkBeneficsAngular(optimal.chartData),
    maleficAspects: getMaleficAspects(optimal.chartData),
    prohibitions: [], // TODO: Add electional prohibitions
    dignifiedPlanets: dignifiedPlanets,
    electionalReady: optimal.score >= 6 && !mercuryRetrograde,
  };

  // Extract actual aspects from chart data
  const aspectsArray = optimal.chartData.aspects
    ? optimal.chartData.aspects
        .filter((aspect: ChartAspect) => aspect.orb <= 8) // Only include tight aspects
        .map(
          (aspect: ChartAspect) =>
            `${aspect.planet1} ${aspect.aspect} ${
              aspect.planet2
            } (${aspect.orb.toFixed(1)}°)`
        )
    : [optimal.description]; // Fallback to description if no aspects

  return {
    id: `astro_${Date.now()}_${index}_${Math.random()
      .toString(36)
      .substr(2, 9)}`,
    userId,
    title: enhancedTitle,
    date: optimal.date,
    time: optimal.time,
    type: eventType,
    description: `Astrologically calculated optimal timing (Score: ${optimal.score}/10). ${enhancedDescription}`,
    aspects: aspectsArray,
    planetaryPositions: optimal.chartData.planets.map(
      (p: PlanetPosition) => `${p.name} in ${p.sign} (${p.house}H)`
    ),
    score: optimal.score,
    isGenerated: true,
    createdAt: new Date().toISOString(),
    priorities: selectedPriorities,
    chartData: optimal.chartData,
    timeWindow,
    electionalData,
    timingMethod: optimal.timingMethod,
  };
};