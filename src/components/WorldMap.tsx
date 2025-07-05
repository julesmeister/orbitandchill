/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  AstrocartographySVGLine,
  createPlanetaryGradients,
  PLANET_COLORS,
} from "../utils/astrocartographyLineRenderer";
import {
  getAstrocartographyInterpretation,
  getPlanetInfo,
  getLineTypeInfo,
} from "../utils/astrocartographyInterpretations";
import { geoToSVGWithCorrections, svgToGeoWithCorrections, validateCorrections } from "../utils/mapProjectionCorrections";
import { getCountryName } from "../utils/countryNames";
import { detectCountryFromCoordinates } from "../utils/countryDetection";
import { Paran } from "../utils/paranCalculations";

interface WorldMapProps {
  className?: string;
  onCountryClick?: (countryId: string, event?: MouseEvent) => void;
  onMapClick?: (lat: number, lng: number, countryInfo?: { countryId: string; countryName: string }) => void;
  whiteCountries?: boolean;
  astrocartographyLines?: AstrocartographySVGLine[];
  parans?: Paran[];
  onLineHover?: (planet: string, lineType: string) => void;
  onLineHoverEnd?: () => void;
  lineStyle?: {
    opacity?: number;
    strokeWidth?: number;
  };
  showReferencePoints?: boolean;
  showParans?: boolean;
}

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  countryId: string;
  countryName: string;
  position: "left" | "right";
  type: "country" | "astrocartography";
  planetInfo?: {
    planet: string;
    lineType: string;
    color: string;
    symbol?: string;
    title?: string;
    description?: string;
    keywords?: string[];
    influence?: string;
  };
}

export default function WorldMap({
  className = "",
  onCountryClick,
  onMapClick,
  whiteCountries = false,
  astrocartographyLines = [],
  parans = [],
  onLineHover,
  onLineHoverEnd,
  lineStyle = { opacity: 0.7, strokeWidth: 2 },
  showReferencePoints = false,
  showParans = true,
}: WorldMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    countryId: "",
    countryName: "",
    position: "right",
    type: "country",
  });

  // Helper function to add debug reference lines
  const addDebugReferenceLines = (svgElement: SVGSVGElement) => {

    // Create debug group
    const debugGroup = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g"
    );
    debugGroup.setAttribute("id", "debug-reference-lines");
    debugGroup.setAttribute("class", "debug-lines");

    // Test coordinates - key geographic points
    const testPoints: Array<{ lat: number; lng: number; label: string; color: string }> = [
      // { lat: 0, lng: 0, label: "Equator/Prime Meridian", color: "red" },
      // { lat: 0, lng: -180, label: "Equator/Antimeridian West", color: "blue" },
      // { lat: 0, lng: 180, label: "Equator/Antimeridian East", color: "blue" },
      // { lat: 90, lng: 0, label: "North Pole", color: "green" },
      // { lat: -90, lng: 0, label: "South Pole", color: "green" },
      // { lat: 40.7128, lng: -74.006, label: "New York City", color: "purple" },
      // { lat: 51.5074, lng: -0.1278, label: "London", color: "purple" },
      // { lat: 35.6762, lng: 139.6503, label: "Tokyo, Japan", color: "purple" },
      // {
      //   lat: -41.2924,
      //   lng: 174.7787,
      //   label: "Wellington, New Zealand",
      //   color: "purple",
      // },
      // {
      //   lat: -34.9011,
      //   lng: -56.1645,
      //   label: "Montevideo, Uruguay",
      //   color: "purple",
      // },
      // {
      //   lat: 24.1426,
      //   lng: -110.3128,
      //   label: "La Paz, Baja California Sur",
      //   color: "purple",
      // },
      // { lat: 6.9271, lng: 79.8612, label: "Colombo, Sri Lanka", color: "purple" },
    ];

    testPoints.forEach((point) => {
      // Use the new sophisticated geographic zone-based corrections
      const coords = geoToSVGWithCorrections(point.lat, point.lng);
      const x = coords.x;
      const y = coords.y;
      
      // Log correction details for debugging
      // Reference point correction applied


      // Add circle marker
      const circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      circle.setAttribute("cx", x.toString());
      circle.setAttribute("cy", y.toString());
      circle.setAttribute("r", "3");
      circle.setAttribute("fill", point.color);
      circle.setAttribute("stroke", "white");
      circle.setAttribute("stroke-width", "1");
      debugGroup.appendChild(circle);

      // Add label
      const text = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      text.setAttribute("x", (x + 5).toString());
      text.setAttribute("y", (y - 5).toString());
      text.setAttribute("fill", point.color);
      text.setAttribute("font-size", "8");
      text.setAttribute("font-weight", "bold");
      text.textContent = point.label;
      debugGroup.appendChild(text);
    });

    // Add coordinate grid lines
    // Longitude lines (vertical) - use corrected coordinates
    for (let lng = -180; lng <= 180; lng += 30) {
      if (lng === 0) continue; // Skip prime meridian, already marked
      const coords = geoToSVGWithCorrections(0, lng); // Use equator for longitude lines
      const x = coords.x;
      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      line.setAttribute("x1", x.toString());
      line.setAttribute("y1", "0");
      line.setAttribute("x2", x.toString());
      line.setAttribute("y2", "507.209");
      line.setAttribute("stroke", "rgba(255,0,0,0.3)");
      line.setAttribute("stroke-width", "0.5");
      line.setAttribute("stroke-dasharray", "2,2");
      debugGroup.appendChild(line);
    }

    // Latitude lines (horizontal) - use corrected coordinates  
    for (let lat = -90; lat <= 90; lat += 30) {
      if (lat === 0) continue; // Skip equator, already marked
      const coords = geoToSVGWithCorrections(lat, 0); // Use prime meridian for latitude lines
      const y = coords.y;
      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      line.setAttribute("x1", "0");
      line.setAttribute("y1", y.toString());
      line.setAttribute("x2", "1000");
      line.setAttribute("y2", y.toString());
      line.setAttribute("stroke", "rgba(0,255,0,0.3)");
      line.setAttribute("stroke-width", "0.5");
      line.setAttribute("stroke-dasharray", "2,2");
      debugGroup.appendChild(line);
    }

    // Prime meridian (vertical red line) - adjusted to align with London position
    // const primeMeridian = document.createElementNS(
    //   "http://www.w3.org/2000/svg",
    //   "line"
    // );
    // primeMeridian.setAttribute("x1", "473"); // Aligned with London's actual position (472.6)
    // primeMeridian.setAttribute("y1", "0");
    // primeMeridian.setAttribute("x2", "473");
    // primeMeridian.setAttribute("y2", "507.209");
    // primeMeridian.setAttribute("stroke", "red");
    // primeMeridian.setAttribute("stroke-width", "1");
    // debugGroup.appendChild(primeMeridian);

    // Equator (horizontal red line)
    // const equator = document.createElementNS(
    //   "http://www.w3.org/2000/svg",
    //   "line"
    // );
    // equator.setAttribute("x1", "0");
    // equator.setAttribute("y1", "253.6");
    // equator.setAttribute("x2", "1000");
    // equator.setAttribute("y2", "253.6");
    // equator.setAttribute("stroke", "red");
    // equator.setAttribute("stroke-width", "1");
    // debugGroup.appendChild(equator);

    svgElement.appendChild(debugGroup);
  };

  // Helper function to add parans (intersection points) to the SVG
  const addParansToSVG = (
    svgElement: SVGSVGElement,
    parans: Paran[]
  ) => {
    if (!showParans || parans.length === 0) return;

    // Create parans group
    const paranGroup = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g"
    );
    paranGroup.setAttribute("class", "parans");
    paranGroup.setAttribute("id", "parans");

    parans.forEach((paran, index) => {
      // Convert geographic coordinates to SVG coordinates
      const coords = geoToSVGWithCorrections(paran.latitude, paran.longitude || 0);
      const x = coords.x;
      const y = coords.y;

      // Create paran marker group
      const paranMarker = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "g"
      );
      paranMarker.setAttribute("class", "paran-marker");
      paranMarker.setAttribute("data-paran-index", index.toString());

      // Outer ring (larger circle)
      const outerCircle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      outerCircle.setAttribute("cx", x.toString());
      outerCircle.setAttribute("cy", y.toString());
      outerCircle.setAttribute("r", "8");
      outerCircle.setAttribute("fill", "none");
      outerCircle.setAttribute("stroke", paran.color);
      outerCircle.setAttribute("stroke-width", "2");
      outerCircle.setAttribute("opacity", "0.8");

      // Inner circle (filled)
      const innerCircle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      innerCircle.setAttribute("cx", x.toString());
      innerCircle.setAttribute("cy", y.toString());
      innerCircle.setAttribute("r", "4");
      innerCircle.setAttribute("fill", paran.color);
      innerCircle.setAttribute("opacity", "0.9");

      // Pulsing animation for major parans
      if (paran.strength === 'major') {
        const animate = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "animate"
        );
        animate.setAttribute("attributeName", "r");
        animate.setAttribute("values", "8;12;8");
        animate.setAttribute("dur", "2s");
        animate.setAttribute("repeatCount", "indefinite");
        outerCircle.appendChild(animate);
      }

      // Add hover events for parans
      paranMarker.style.cursor = "pointer";
      paranMarker.addEventListener("mouseenter", (e: Event) => {
        e.stopPropagation();
        
        // Highlight the paran
        outerCircle.setAttribute("stroke-width", "3");
        innerCircle.setAttribute("r", "5");

        // Show paran tooltip
        const rect = svgElement.getBoundingClientRect();
        const mouseEvent = e as MouseEvent;
        const hoverX = mouseEvent.clientX - rect.left;
        const hoverY = mouseEvent.clientY - rect.top;

        const isRightSide = hoverX > rect.width * 0.6;

        setTooltip({
          visible: true,
          x: hoverX,
          y: hoverY,
          countryId: "",
          countryName: "",
          position: isRightSide ? "left" : "right",
          type: "astrocartography",
          planetInfo: {
            planet: `${paran.planet1} × ${paran.planet2}`,
            lineType: paran.crossingType,
            color: paran.color,
            symbol: "⚹",
            title: `${paran.planet1.charAt(0).toUpperCase() + paran.planet1.slice(1)} × ${paran.planet2.charAt(0).toUpperCase() + paran.planet2.slice(1)} Paran`,
            description: paran.combinedEnergy,
            keywords: [paran.crossingType, paran.strength, `${Math.round(paran.latitude)}°N`],
            influence: paran.strength
          },
        });
      });

      paranMarker.addEventListener("mouseleave", (e: Event) => {
        e.stopPropagation();
        
        // Reset paran appearance
        outerCircle.setAttribute("stroke-width", "2");
        innerCircle.setAttribute("r", "4");

        // Hide tooltip
        setTooltip((prev) => ({ ...prev, visible: false }));
      });

      paranMarker.addEventListener("click", (e: Event) => {
        e.stopPropagation();
        // Could trigger a special paran analysis here
      });

      paranMarker.appendChild(outerCircle);
      paranMarker.appendChild(innerCircle);
      paranGroup.appendChild(paranMarker);
    });

    // Insert the parans group after astrocartography lines to render on top
    svgElement.appendChild(paranGroup);
  };

  // Helper function to add astrocartography lines to the SVG
  const addAstrocartographyLinesToSVG = (
    svgElement: SVGSVGElement,
    lines: AstrocartographySVGLine[],
    style: { opacity?: number; strokeWidth?: number },
    onHover?: (planet: string, lineType: string) => void,
    onHoverEnd?: () => void
  ) => {
    // Create defs section for gradients if it doesn't exist
    let defs = svgElement.querySelector("defs");
    if (!defs) {
      defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
      svgElement.appendChild(defs);
    }

    // Add planetary gradients
    defs.innerHTML += createPlanetaryGradients();

    // Create astrocartography lines group
    const astroGroup = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g"
    );
    astroGroup.setAttribute("class", "astrocartography-lines");
    astroGroup.setAttribute("id", "astrocartography-lines");

    // Add each line as a path element
    lines.forEach((lineData) => {
      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      path.setAttribute("d", lineData.path);
      // Use solid colors for IC lines as gradients might not be rendering properly on vertical lines
      if (lineData.lineType === 'IC') {
        path.setAttribute("stroke", lineData.color || PLANET_COLORS[lineData.planet] || '#6B7280');
        path.setAttribute("stroke-width", "2.5"); // Slightly thicker for visibility
      } else {
        path.setAttribute("stroke", `url(#astro-gradient-${lineData.planet})`);
        path.setAttribute("stroke-width", (style.strokeWidth || 2).toString());
      }
      path.setAttribute(
        "stroke-dasharray",
        lineData.style.strokeDasharray || "none"
      );
      path.setAttribute("fill", "none");
      path.setAttribute(
        "opacity",
        ((style.opacity || 0.7) * (lineData.style.opacity || 1)).toString()
      );
      path.setAttribute("class", "astrocartography-line");
      path.style.cursor = "pointer";
      path.style.pointerEvents = "auto";
      path.style.transition =
        "opacity 0.2s ease-in-out, stroke-width 0.2s ease-in-out";

      // Add hover events - only change opacity, no black effects
      if (onHover && onHoverEnd) {
        path.addEventListener("mouseenter", (e: Event) => {
          e.stopPropagation(); // Prevent country hover events
          path.style.opacity = "1";
          path.style.strokeWidth = ((style.strokeWidth || 2) + 1).toString();
          onHover(lineData.planet, lineData.lineType);

          // Show astrocartography tooltip
          const rect = svgElement.getBoundingClientRect();
          const mouseEvent = e as MouseEvent;
          const hoverX = mouseEvent.clientX - rect.left;
          const hoverY = mouseEvent.clientY - rect.top;

          const isRightSide = hoverX > rect.width * 0.6;

          // Get detailed interpretation data
          const interpretation = getAstrocartographyInterpretation(
            lineData.planet,
            lineData.lineType
          );
          const planetInfo = getPlanetInfo(lineData.planet);
          const lineTypeInfo = getLineTypeInfo(lineData.lineType);

          setTooltip({
            visible: true,
            x: hoverX,
            y: hoverY,
            countryId: "",
            countryName: "",
            position: isRightSide ? "left" : "right",
            type: "astrocartography",
            planetInfo: {
              planet: lineData.planet,
              lineType: lineData.lineType,
              color: lineData.color,
              symbol: planetInfo?.symbol,
              title:
                interpretation?.title ||
                `${planetInfo?.name || lineData.planet} ${
                  lineData.lineType
                } Line`,
              description:
                interpretation?.shortDescription ||
                lineTypeInfo?.description ||
                "Astrological influence line",
              keywords: interpretation?.keywords || [],
              influence: interpretation?.influence || "moderate",
            },
          });
        });
        path.addEventListener("mouseleave", (e: Event) => {
          e.stopPropagation(); // Prevent country hover events
          path.style.opacity = (
            (style.opacity || 0.7) * (lineData.style.opacity || 1)
          ).toString();
          path.style.strokeWidth = (style.strokeWidth || 2).toString();
          onHoverEnd();

          // Hide tooltip
          setTooltip((prev) => ({ ...prev, visible: false }));
        });
        // Also prevent click events from bubbling to countries
        path.addEventListener("click", (e: Event) => {
          e.stopPropagation();
        });
      }

      astroGroup.appendChild(path);
    });

    // Insert the astrocartography group after existing groups to render on top of countries
    svgElement.appendChild(astroGroup);
  };

  // Convert SVG coordinates back to geographic coordinates using the proper correction system
  const svgToGeoCoordinates = (svgX: number, svgY: number, svgElement: SVGSVGElement): { lat: number; lng: number } => {
    const result = svgToGeoWithCorrections(svgX, svgY);
    // SVG to Geo conversion applied
    return { lat: result.lat, lng: result.lng };
  };


  useEffect(() => {
    if (!containerRef.current) return;

    // Fetch and embed SVG content
    fetch("/world-states.svg")
      .then((response) => response.text())
      .then((svgText) => {
        if (!containerRef.current) return;

        // Create a temporary container to parse SVG
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = svgText;
        const svgElement = tempDiv.querySelector("svg");

        if (!svgElement) return;

        // Clear container and add SVG
        containerRef.current.innerHTML = "";
        containerRef.current.appendChild(svgElement);

        // Add debug reference lines to verify coordinate system (if enabled)
        if (showReferencePoints) {
          addDebugReferenceLines(svgElement);
        }

        // Add astrocartography lines if provided
        if (astrocartographyLines.length > 0) {
          addAstrocartographyLinesToSVG(
            svgElement,
            astrocartographyLines,
            lineStyle,
            onLineHover,
            onLineHoverEnd
          );
        }

        // Add parans if provided
        if (parans.length > 0) {
          addParansToSVG(svgElement, parans);
        }

        // Apply styles
        const style = document.createElement("style");
        style.textContent = `
          .world-map-container svg {
            width: 100%;
            height: auto;
            display: block;
          }
          .world-map-container rect[fill="#FFFFFF"] {
            fill: transparent !important;
          }
          .world-map-container path[fill="#FFFFFF"] {
            fill: transparent !important;
            stroke: transparent !important;
          }
          .world-map-container path[fill="#B9B9B9"] {
            fill: ${whiteCountries ? "#ffffff" : "#6b7280"} !important;
            stroke: ${whiteCountries ? "#e2e8f0" : "#ffffff"} !important;
            stroke-width: 0.5 !important;
            cursor: pointer !important;
            transition: fill 0.2s ease-in-out !important;
          }
          .world-map-container path[fill="#B9B9B9"]:hover {
            fill: ${whiteCountries ? "#f1f5f9" : "#000000"} !important;
          }
          .world-map-container g[id] {
            cursor: pointer !important;
          }
          .world-map-container g[id]:hover path:not(.astrocartography-line) {
            fill: ${whiteCountries ? "#f1f5f9" : "#000000"} !important;
          }
          .world-map-container g[id] path:not(.astrocartography-line) {
            cursor: pointer !important;
          }
          .world-map-container .astrocartography-line {
            pointer-events: auto !important;
            cursor: pointer !important;
            fill: none !important;
          }
          .world-map-container g:hover .astrocartography-line {
            fill: none !important;
          }
        `;
        document.head.appendChild(style);

        // Add click handler to the SVG element for map coordinates
        if (onMapClick) {
          svgElement.addEventListener("click", (event: Event) => {
            const mouseEvent = event as MouseEvent;
            const rect = svgElement.getBoundingClientRect();
            const svgX = ((mouseEvent.clientX - rect.left) / rect.width) * 1000; // Scale to viewBox
            const svgY = ((mouseEvent.clientY - rect.top) / rect.height) * 507.209; // Scale to viewBox
            
            const geoCoords = svgToGeoCoordinates(svgX, svgY, svgElement);
            
            // Detect which country was clicked using SVG country detection
            const countryInfo = detectCountryFromCoordinates(svgX, svgY, svgElement);
            
            onMapClick(geoCoords.lat, geoCoords.lng, countryInfo || undefined);
          });
        }

        // Add click event listeners to country groups
        const countryGroups = svgElement.querySelectorAll("g[id]");
        countryGroups.forEach((group) => {
          group.addEventListener("click", (event) => {
            event.stopPropagation(); // Prevent SVG click from firing
            
            if (onCountryClick && group.id) {
              const mouseEvent = event as MouseEvent;
              onCountryClick(group.id, mouseEvent);
            }

            // Also trigger map click with approximate country center coordinates
            if (onMapClick) {
              const rect = svgElement.getBoundingClientRect();
              const mouseEvent = event as MouseEvent;
              const svgX = ((mouseEvent.clientX - rect.left) / rect.width) * 1000;
              const svgY = ((mouseEvent.clientY - rect.top) / rect.height) * 507.209;
              
              const geoCoords = svgToGeoCoordinates(svgX, svgY, svgElement);
              
              // For country clicks, we already know the country ID from the group
              const countryInfo = {
                countryId: group.id,
                countryName: getCountryName(group.id)
              };
              
              onMapClick(geoCoords.lat, geoCoords.lng, countryInfo);
            }
          });

          // Add hover effects with tooltip
          group.addEventListener("mouseenter", (event) => {
            const paths = group.querySelectorAll(
              "path:not(.astrocartography-line)"
            );
            paths.forEach((path) => {
              (path as SVGPathElement).style.fill = whiteCountries
                ? "#f1f5f9"
                : "#000000";
            });

            // Show tooltip positioned away from hover point
            const rect = containerRef.current?.getBoundingClientRect();
            if (rect) {
              const mouseEvent = event as MouseEvent;
              const hoverX = mouseEvent.clientX - rect.left;
              const hoverY = mouseEvent.clientY - rect.top;

              // Determine tooltip position based on hover location
              const isRightSide = hoverX > rect.width * 0.6; // If hovering on right 40% of map
              const tooltipPosition = isRightSide ? "left" : "right";

              setTooltip({
                visible: true,
                x: hoverX, // Store hover point for path connection
                y: hoverY,
                countryId: group.id,
                countryName: getCountryName(group.id),
                position: tooltipPosition,
                type: "country",
              });
            }
          });

          group.addEventListener("mouseleave", () => {
            const paths = group.querySelectorAll(
              "path:not(.astrocartography-line)"
            );
            paths.forEach((path) => {
              (path as SVGPathElement).style.fill = whiteCountries
                ? "#ffffff"
                : "#6b7280";
            });

            // Hide tooltip
            setTooltip((prev) => ({ ...prev, visible: false }));
          });
        });

        return () => {
          // Cleanup
          if (document.head.contains(style)) {
            document.head.removeChild(style);
          }
        };
      })
      .catch((error) => {
        console.error("Error loading SVG:", error);
        if (containerRef.current) {
          containerRef.current.innerHTML =
            '<div class="text-gray-500 text-center p-8">Failed to load world map</div>';
        }
      });
  }, [
    onCountryClick,
    onMapClick,
    astrocartographyLines,
    lineStyle,
    onLineHover,
    onLineHoverEnd,
    whiteCountries,
  ]);

  // Update astrocartography lines when they change
  useEffect(() => {
    const svgElement = containerRef.current?.querySelector(
      "svg"
    ) as SVGSVGElement;
    if (!svgElement) return;

    // Remove existing astrocartography lines
    const existingLines = svgElement.querySelector("#astrocartography-lines");
    if (existingLines) {
      existingLines.remove();
    }

    // Remove existing parans
    const existingParans = svgElement.querySelector("#parans");
    if (existingParans) {
      existingParans.remove();
    }

    // Add new lines if provided
    if (astrocartographyLines.length > 0) {
      addAstrocartographyLinesToSVG(
        svgElement,
        astrocartographyLines,
        lineStyle,
        onLineHover,
        onLineHoverEnd
      );
    }

    // Add new parans if provided
    if (parans.length > 0) {
      addParansToSVG(svgElement, parans);
    }
  }, [astrocartographyLines, parans, lineStyle, onLineHover, onLineHoverEnd]);

  return (
    <div className={`w-full relative ${className}`}>
      <div
        ref={containerRef}
        className="world-map-container w-full h-auto"
        style={{ minHeight: "300px", maxHeight: "80vh" }}
      >
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-500">Loading world map...</div>
        </div>
      </div>

      {/* Tooltip Callout */}
      {tooltip.visible && (
        <>
          {/* Connection Path SVG */}
          <svg
            className="absolute top-0 left-0 w-full h-full pointer-events-none z-40"
            style={{ position: "absolute" }}
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
              </marker>
            </defs>
            <path
              d={(() => {
                const containerWidth = containerRef.current?.clientWidth || 800;
                if (tooltip.position === "right") {
                  // Tooltip is on the right side - arrow points to left edge of tooltip
                  const tooltipX = containerWidth - 200 + 10; // Point to left edge of tooltip
                  return `M ${tooltip.x} ${tooltip.y} Q ${tooltip.x + 100} ${
                    tooltip.y - 50
                  } ${tooltipX} ${70}`;
                } else {
                  // Tooltip is on the left side - arrow points to right edge of tooltip
                  const tooltipX = 20 + 180; // Point to right edge of tooltip (20px left + 180px width)
                  return `M ${tooltip.x} ${tooltip.y} Q ${tooltip.x - 100} ${
                    tooltip.y - 50
                  } ${tooltipX} ${70}`;
                }
              })()}
              stroke="#3b82f6"
              strokeWidth="1.5"
              fill="none"
              markerEnd="url(#arrowhead)"
              strokeDasharray="3,3"
            />
            <circle cx={tooltip.x} cy={tooltip.y} r="3" fill="#3b82f6" />
          </svg>

          {/* Tooltip Box - Dynamic Position */}
          <div
            className="absolute pointer-events-none z-50"
            style={
              tooltip.position === "right"
                ? { right: "20px", top: "20px" }
                : { left: "20px", top: "20px" }
            }
          >
            {/* Callout Box - Enhanced Design with Detailed Info */}
            <div className="relative bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg rounded-lg min-w-[280px] max-w-[320px]">
              {/* Content Section */}
              <div className="px-4 py-3">
                {tooltip.type === "country" ? (
                  <>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="text-gray-500 text-xs font-medium uppercase tracking-wide">
                        Location
                      </div>
                    </div>
                    <div className="text-gray-900 font-semibold text-sm leading-tight">
                      {tooltip.countryName}
                    </div>
                  </>
                ) : (
                  <>
                    {/* Header with planet symbol and type */}
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-3 h-3 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{
                          backgroundColor:
                            tooltip.planetInfo?.color || "#6366f1",
                        }}
                      >
                        {tooltip.planetInfo?.symbol || "●"}
                      </div>
                      <div className="text-gray-500 text-xs font-medium uppercase tracking-wide">
                        {tooltip.planetInfo?.influence === "strong"
                          ? "Strong Influence"
                          : tooltip.planetInfo?.influence === "moderate"
                          ? "Moderate Influence"
                          : "Subtle Influence"}
                      </div>
                    </div>

                    {/* Main title */}
                    <div className="text-gray-900 font-bold text-sm leading-tight mb-2">
                      {tooltip.planetInfo?.title ||
                        (tooltip.planetInfo?.planet &&
                        tooltip.planetInfo?.lineType
                          ? `${
                              tooltip.planetInfo.planet
                                .charAt(0)
                                .toUpperCase() +
                              tooltip.planetInfo.planet.slice(1)
                            } ${tooltip.planetInfo.lineType}`
                          : "Astrocartography Line")}
                    </div>

                    {/* Description */}
                    <div className="text-gray-700 text-xs leading-relaxed mb-2">
                      {tooltip.planetInfo?.description ||
                        "Astrological influence line"}
                    </div>

                    {/* Keywords */}
                    {tooltip.planetInfo?.keywords &&
                      tooltip.planetInfo.keywords.length > 0 && (
                        <div className="mb-2">
                          <div className="text-gray-500 text-xs font-medium mb-1">
                            Key themes:
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {tooltip.planetInfo.keywords
                              .slice(0, 4)
                              .map((keyword, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full"
                                >
                                  {keyword}
                                </span>
                              ))}
                          </div>
                        </div>
                      )}

                    {/* Line type info */}
                    <div className="text-gray-500 text-xs border-t border-gray-100 pt-2">
                      <span className="font-medium">
                        {tooltip.planetInfo?.lineType} Line:
                      </span>{" "}
                      {tooltip.planetInfo?.lineType === "MC"
                        ? "Career & public image"
                        : tooltip.planetInfo?.lineType === "IC"
                        ? "Home & emotional foundation"
                        : tooltip.planetInfo?.lineType === "AC"
                        ? "Identity & self-expression"
                        : "Relationships & partnerships"}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
