/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState, useRef, useMemo, useEffect } from "react";
import { NatalChartData } from "../../utils/natalChart";
import { HoraryQuestion } from "../../store/horaryStore";
import { useUserStore } from "../../store/userStore";
import { getTooltipPositionFromEvent } from "../../utils/tooltip/tooltipHelpers";
import ZodiacSymbolIcon from "./tooltips/ZodiacSymbolIcon";
import { getSignRulerByIndex } from "../../utils/astrology/signRulers";
import { getHouseMeaning } from "../../utils/astrology/houseMeanings";
import { getElementByIndex } from "../../utils/astrology/elements";
import { useSignificatorDetection } from "../../hooks/useSignificatorDetection";
import { AspectLines } from "./AspectLines";
import { PlanetInfoStack } from "./PlanetInfoStack";
import { ChartTooltip, type TooltipData } from "./ChartTooltip";
import { getChartAnalysis } from "../../utils/horary/chartAnalysis";
import {
  convertToNatalFormat,
  processHousesWithAngles,
  HouseWithAngle,
  calculateSVGAngle,
  calculatePosition,
  getPlanetColor,
  getPlanetSymbol
} from "../../utils/horaryCalculations";
import { CHART_CONFIG, CHART_ROTATION } from "./chartConfig";
import { ZodiacWedge } from "./ZodiacWedge";
import { HouseCusp } from "./HouseCusp";
import { PlanetMarker } from "./PlanetMarker";
import { AngularMarkers } from "./AngularMarkers";
import { ChartBackground } from "./ChartBackground";
import { ZODIAC_SYMBOLS, ZODIAC_NAMES, ZODIAC_COLORS } from "./ZodiacSymbols";
import type { Aspect } from "../../utils/horary/aspectConstants";

interface InteractiveHoraryChartProps {
  svgContent: string;
  chartData?: any;
  question?: HoraryQuestion;
  className?: string;
}

const InteractiveHoraryChart: React.FC<InteractiveHoraryChartProps> = ({
  svgContent,
  chartData,
  question,
  className = ""
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { user } = useUserStore();
  const [tooltip, setTooltip] = useState<TooltipData>({
    visible: false,
    content: null,
    title: "",
    x: 0,
    y: 0,
    color: "#000000",
    position: "bottom-right",
  });

  const [chartDataToUse, setChartDataToUse] = useState<NatalChartData | null>(null);
  const { getSignificatorStatus } = useSignificatorDetection(chartDataToUse, question || null);

  // Load real chart data when component mounts or question changes
  useEffect(() => {
    const loadRealChartData = async () => {
      try {
        // Clear any existing tooltip when loading new chart
        setTooltip(prev => ({ ...prev, visible: false }));

        // Extract location from question with priority logic matching useHoraryChart
        let coordinates: { lat: number; lng: number } | undefined;

        if (question?.customLocation) {
          // Priority 1: Use custom location from question (highest priority)
          coordinates = {
            lat: parseFloat(question.customLocation.coordinates.lat),
            lng: parseFloat(question.customLocation.coordinates.lon)
          };
        } else if (user?.birthData?.coordinates) {
          // Priority 2: Use user's birth data coordinates
          coordinates = {
            lat: parseFloat(user.birthData.coordinates.lat),
            lng: parseFloat(user.birthData.coordinates.lon)
          };
        }
        // Priority 3: convertToNatalFormat will fallback to London if no coordinates provided

        // Debug logging to verify location usage
          questionId: question?.id,
          customLocation: question?.customLocation,
          birthDataCoordinates: user?.birthData?.coordinates,
          finalCoordinates: coordinates,
          fallbackToLondon: !coordinates
        });

        const realData = await convertToNatalFormat(
          question?.date ? new Date(question.date) : new Date(),
          coordinates
        );
        setChartDataToUse(realData);
      } catch (error) {
        console.error('Error loading chart data:', error);
        setChartDataToUse(null);
      }
    };

    loadRealChartData();
  }, [question?.date, question?.customLocation, user?.birthData?.coordinates]);

  // Clear tooltip when component unmounts or chart changes
  useEffect(() => {
    return () => {
      setTooltip(prev => ({ ...prev, visible: false }));
    };
  }, [chartDataToUse]);

  // Force clear all hover states when chart data changes
  useEffect(() => {
    if (containerRef.current) {
      // Remove any stuck hover classes/states from DOM
      const stuckElements = containerRef.current.querySelectorAll('[transform*="scale(1.05)"], [opacity="0.8"]');
      stuckElements.forEach(element => {
        if (element instanceof SVGElement) {
          element.style.transform = 'scale(1)';
          element.style.opacity = '0.5';
        }
      });
    }
  }, [chartDataToUse]);

  // Return loading state if chart data not ready
  if (!chartDataToUse) {
    return (
      <div className="text-center py-16">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-3 h-3 bg-black animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-3 h-3 bg-black animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-3 h-3 bg-black animate-bounce"></div>
        </div>
        <h2 className="font-space-grotesk text-2xl font-bold text-black mb-2">
          Loading astronomical data...
        </h2>
        <p className="text-black/70">
          Calculating planetary positions and chart structure.
        </p>
      </div>
    );
  }

  // Process houses with angle information using utility function
  const processedHouses = processHousesWithAngles(chartDataToUse.houses);

  /**
   * Unified coordinate conversion function - converts astronomical longitude to SVG coordinates
   * with the Ascendant as the fixed reference point at 9 o'clock (180°)
   */
  const getChartCoordinates = (astroLongitude: number, radius: number) => {
    const ascendantLongitude = chartDataToUse.ascendant || 0;

    // Calculate position relative to Ascendant
    let relativeAngle = (astroLongitude - ascendantLongitude + 360) % 360;

    // Place Ascendant at 180° (9 o'clock position)
    const finalAngleDegrees = (relativeAngle + 180) % 360;

    // Convert to radians and calculate coordinates
    const angleRad = (finalAngleDegrees * Math.PI) / 180;

    const x = Math.cos(angleRad) * radius;
    const y = -Math.sin(angleRad) * radius; // Try negative Y as suggested by AI

    // Debug logging for Ascendant position
    if (Math.abs(astroLongitude - ascendantLongitude) < 1) {
        ascendantLongitude,
        astroLongitude,
        relativeAngle,
        finalAngleDegrees,
        coordinates: { x, y },
        radius,
        shouldBeAt180: "Ascendant should appear at 180° (left side)"
      });
    }

    return { x, y };
  };

  // Helper functions for event handlers
  const handleZodiacHover = (event: React.MouseEvent, data: { symbol: string; index: number }) => {
    const tooltipPos = getTooltipPositionFromEvent(event);
    if (!tooltipPos) return;

    const ruler = getSignRulerByIndex(data.index);
    const element = getElementByIndex(data.index);

    setTooltip({
      visible: true,
      title: "Zodiac Sign",
      content: (
        <div>
          <div className="font-bold text-base mb-2 flex items-center gap-3">
            <ZodiacSymbolIcon symbol={data.symbol} size="medium" />
            <span>{ZODIAC_NAMES[data.index]}</span>
          </div>
          <div className="text-sm space-y-1">
            <div>Element: <span className="font-medium">{element}</span></div>
            <div>Ruler: <span className="font-medium capitalize">{ruler}</span></div>
          </div>
        </div>
      ),
      x: tooltipPos.x,
      y: tooltipPos.y,
      color: ZODIAC_COLORS[data.symbol as keyof typeof ZODIAC_COLORS] || "#666666",
      position: tooltipPos.position
    });
  };

  const handleHouseHover = (event: React.MouseEvent, data: any) => {
    const tooltipPos = getTooltipPositionFromEvent(event);
    if (!tooltipPos) return;

    // Get zodiac symbol for the house cusp sign
    const signIndex = Math.floor(data.cusp / 30);
    const zodiacSymbol = ZODIAC_SYMBOLS[signIndex] || data.sign;

    setTooltip({
      visible: true,
      title: "House",
      content: (
        <div>
          <div className="font-bold text-base mb-2">{data.number}th House</div>
          <div className="text-sm space-y-1">
            <div>Cusp: <span className="font-medium">{Math.floor(data.cusp)}°</span></div>
            <div className="flex items-center gap-2">
              <span>Sign:</span>
              <span className="font-medium flex items-center gap-2">
                <ZodiacSymbolIcon symbol={zodiacSymbol} size="small" />
                <span className="capitalize">{data.sign}</span>
              </span>
            </div>
            <div className="mt-2 text-xs text-gray-600">
              <span className="font-medium">Meaning:</span> {getHouseMeaning(data.number)}
            </div>
          </div>
        </div>
      ),
      x: tooltipPos.x,
      y: tooltipPos.y,
      color: "#7c3aed",
      position: tooltipPos.position
    });
  };

  const handlePlanetHover = (event: React.MouseEvent, data: any) => {
    const tooltipPos = getTooltipPositionFromEvent(event);
    if (!tooltipPos) return;

    const degree = Math.floor(data.longitude % 30);
    const minute = Math.floor(((data.longitude % 30) - degree) * 60);

    // Get zodiac symbol for the sign
    const signIndex = Math.floor(data.longitude / 30);
    const zodiacSymbol = ZODIAC_SYMBOLS[signIndex] || data.sign;

    const significatorStatus = getSignificatorStatus(data.name);

    setTooltip({
      visible: true,
      title: "Planet",
      content: (
        <div>
          <div className="font-bold text-base mb-2 flex items-center gap-2 capitalize">
            <span className="text-lg">{getPlanetSymbol(data.name)}</span>
            <span>{data.name}</span>
          </div>
          <div className="text-sm space-y-1">
            <div className="flex items-center gap-2">
              <span>Sign:</span>
              <span className="font-medium flex items-center gap-2">
                <ZodiacSymbolIcon symbol={zodiacSymbol} size="small" />
                <span className="capitalize">{data.sign}</span>
              </span>
            </div>
            <div>House: <span className="font-medium">{data.house}</span></div>
            <div>Position: <span className="font-medium">{degree}°{minute}'</span></div>
            {data.retrograde && <div className="text-red-600 font-medium">Retrograde ℞</div>}
            {significatorStatus && (
              <div>Role: <span className="font-medium">{significatorStatus}</span></div>
            )}
          </div>
        </div>
      ),
      x: tooltipPos.x,
      y: tooltipPos.y,
      color: getPlanetColor(data.name),
      position: tooltipPos.position
    });
  };

  const handleAngularMarkerHover = (event: React.MouseEvent, data: any) => {
    const tooltipPos = getTooltipPositionFromEvent(event);
    if (!tooltipPos) return;

    setTooltip({
      visible: true,
      title: "Angular Marker",
      content: (
        <div>
          <div className="font-bold text-base mb-1">{data.name}</div>
          <div className="text-sm">
            <div>{data.description}</div>
            <div>Angle: {Math.floor(data.angle)}°</div>
          </div>
        </div>
      ),
      x: tooltipPos.x,
      y: tooltipPos.y,
      color: "#dc2626",
      position: tooltipPos.position
    });
  };

  const handleAspectHover = (event: React.MouseEvent, aspect: any) => {
    const tooltipPos = getTooltipPositionFromEvent(event);
    if (!tooltipPos) return;

    setTooltip({
      visible: true,
      title: "Aspect",
      content: (
        <div>
          <div className="font-bold text-base mb-1 capitalize">
            {aspect.planet1} {aspect.aspect} {aspect.planet2}
          </div>
          <div className="text-sm space-y-1">
            <div>Orb: <span className="font-medium">{aspect.orb.toFixed(1)}°</span></div>
            <div>Type: <span className="font-medium capitalize">{aspect.aspect}</span></div>
            <div className={aspect.applying ? "text-green-600" : "text-orange-600"}>
              {aspect.applying ? "Applying" : "Separating"}
            </div>
          </div>
        </div>
      ),
      x: tooltipPos.x,
      y: tooltipPos.y,
      color: aspect.color || '#666666',
      position: tooltipPos.position
    });
  };

  const handleHoverEnd = () => {
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      key={`chart-container-${question?.id || question?.date || 'default'}`}
    >
      <svg
        key={`chart-svg-${question?.id || question?.date || 'default'}`}
        width="100%"
        height="100%"
        viewBox="-600 -600 1200 1200"
        style={{ maxHeight: '90vh', minHeight: '600px' }}
      >
        {/* Chart elements - now using unified coordinate system */}
        <g>

          {/* Chart background and base structure */}
          <ChartBackground />

          {/* Zodiac signs ring */}
          <g className="zodiac-ring">
            {ZODIAC_SYMBOLS.map((_, index) => (
              <ZodiacWedge
                key={`zodiac-${index}`}
                index={index}
                ascendantLongitude={chartDataToUse.ascendant || 0}
                onMouseEnter={handleZodiacHover}
                onMouseLeave={handleHoverEnd}
              />
            ))}
          </g>

          {/* House cusp lines - render BEFORE inner circle so they appear behind it */}
          <g className="house-cusp-lines">
            {processedHouses.map((house, index) => (
              <HouseCusp
                key={`chart-${question?.id || 'default'}-house-${house.number}-${index}`}
                house={house}
                houses={processedHouses}
                ascendantLongitude={chartDataToUse.ascendant || 0}
                onMouseEnter={handleHouseHover}
                onMouseLeave={handleHoverEnd}
              />
            ))}
          </g>

          {/* Angular markers (ASC, DSC, MC, IC) */}
          <AngularMarkers
            houses={processedHouses}
            chartData={chartDataToUse}
            onMouseEnter={handleAngularMarkerHover}
            onMouseLeave={handleHoverEnd}
          />

          {/* Planet information stack - from outer to inner - using unified coordinates */}
          <PlanetInfoStack
            chartData={chartDataToUse}
            getChartCoordinates={getChartCoordinates}
          />

          {/* Planets */}
          <g className="planets-ring">
            {chartDataToUse.planets.map((planet) => (
              <PlanetMarker
                key={`planet-${planet.name}`}
                planet={planet}
                ascendantLongitude={chartDataToUse.ascendant || 0}
                onMouseEnter={handlePlanetHover}
                onMouseLeave={handleHoverEnd}
              />
            ))}
          </g>

          {/* Aspect lines - drawn after center circle but before planets - using unified coordinates */}
          <AspectLines
            chartData={chartDataToUse}
            getChartCoordinates={getChartCoordinates}
            onAspectHover={handleAspectHover}
            onAspectHoverEnd={() => setTooltip(prev => ({ ...prev, visible: false }))}
          />

        </g>{/* End chart elements */}
      </svg>

      {/* Tooltip with Curved Connector */}
      <ChartTooltip
        tooltip={tooltip}
        containerRef={containerRef}
      />
    </div>
  );
};

// Re-export chart analysis utility for backward compatibility
export { getChartAnalysis } from "../../utils/horary/chartAnalysis";

export default InteractiveHoraryChart;
export type { Aspect };