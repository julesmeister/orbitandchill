/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useRef, useEffect, useState } from "react";
import { NatalChartData } from "../../utils/natalChart";

interface InteractiveNatalChartProps {
  svgContent: string;
  chartData?: NatalChartData;
  className?: string;
}

interface TooltipData {
  visible: boolean;
  content: React.ReactNode;
  title: string;
  x: number;
  y: number;
  color: string;
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

const InteractiveNatalChart: React.FC<InteractiveNatalChartProps> = ({
  svgContent,
  chartData,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipData>({
    visible: false,
    content: "",
    title: "",
    x: 0,
    y: 0,
    color: "#3b82f6",
    position: "bottom-right",
  });

  useEffect(() => {
    if (!containerRef.current || !chartData) return;

    // Set up the SVG content
    containerRef.current.innerHTML = svgContent;
    const container = containerRef.current;
    const svg = container.querySelector("svg");
    if (!svg) return;

    // Track all event listeners for cleanup
    const eventListeners: Array<{
      element: Element;
      event: string;
      handler: EventListener;
    }> = [];

    // Make SVG responsive
    svg.style.width = "100%";
    svg.style.height = "auto";
    svg.style.maxHeight = "85vh";
    svg.style.minHeight = "500px";

    const planetColors: { [key: string]: string } = {
      sun: "#FFD700",
      moon: "#C0C0C0",
      mercury: "#FFA500",
      venus: "#FF69B4",
      mars: "#FF4500",
      jupiter: "#9932CC",
      saturn: "#8B4513",
      uranus: "#4169E1",
      neptune: "#00CED1",
      pluto: "#8B0000",
    };

    const planetSymbols: { [key: string]: string } = {
      sun: "☉",
      moon: "☽",
      mercury: "☿",
      venus: "♀",
      mars: "♂",
      jupiter: "♃",
      saturn: "♄",
      uranus: "♅",
      neptune: "♆",
      pluto: "♇",
    };

    // Planet tooltips - these remain individual since planets aren't part of wedges
    chartData.planets.forEach((planet) => {
      const planetTexts = svg.querySelectorAll("text");
      planetTexts.forEach((text) => {
        if (text.textContent === planetSymbols[planet.name]) {
          (text as unknown as HTMLElement).style.cursor = "pointer";

          const showTooltip = (e: Event) => {
            const mouseEvent = e as MouseEvent;
            const rect = container.getBoundingClientRect();
            const degree = Math.floor(planet.longitude % 30);
            const minute = Math.floor(((planet.longitude % 30) - degree) * 60);

            const hoverX = mouseEvent.clientX - rect.left;
            const hoverY = mouseEvent.clientY - rect.top;

            // Determine tooltip position based on closest corner
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const isRight = hoverX > centerX;
            const isBottom = hoverY > centerY;

            let tooltipPosition:
              | "top-left"
              | "top-right"
              | "bottom-left"
              | "bottom-right";
            if (isRight && isBottom) {
              tooltipPosition = "bottom-right";
            } else if (isRight && !isBottom) {
              tooltipPosition = "top-right";
            } else if (!isRight && isBottom) {
              tooltipPosition = "bottom-left";
            } else {
              tooltipPosition = "top-left";
            }

            setTooltip({
              visible: true,
              title: "Planet",
              content: (
                <div>
                  <div className="font-bold text-base mb-1 capitalize">
                    {planet.name}
                  </div>
                  <div className="text-sm space-y-1">
                    <div>
                      Sign:{" "}
                      <span className="font-medium capitalize">
                        {planet.sign}
                      </span>
                    </div>
                    <div>
                      House: <span className="font-medium">{planet.house}</span>
                    </div>
                    <div>
                      Position:{" "}
                      <span className="font-medium">
                        {degree}°{minute}&apos;
                      </span>
                    </div>
                    {planet.retrograde && (
                      <div className="text-red-600 font-medium">Retrograde</div>
                    )}
                  </div>
                </div>
              ),
              x: hoverX,
              y: hoverY,
              color: planetColors[planet.name] || "#3b82f6",
              position: tooltipPosition,
            });
          };

          const hideTooltip = () =>
            setTooltip((prev) => ({ ...prev, visible: false }));

          // Track listeners for cleanup
          eventListeners.push(
            { element: text, event: "mouseenter", handler: showTooltip },
            { element: text, event: "mouseleave", handler: hideTooltip }
          );
          
          text.addEventListener("mouseenter", showTooltip);
          text.addEventListener("mouseleave", hideTooltip);
        }
      });
    });

    // COMPLETELY NEW APPROACH: Find wedges and text by simple proximity matching
    const wedgeGroups = new Map<Element, Element[]>();

    // Get all colored path elements (potential wedges)
    const allPaths = Array.from(svg.querySelectorAll("path[fill]")).filter(
      (path) => {
        const fill = path.getAttribute("fill") || "";
        return (
          fill.includes("#") &&
          !fill.includes("fff") &&
          !fill.includes("white") &&
          !fill.includes("f8f9fa")
        );
      }
    );

    console.log(`🎯 Found ${allPaths.length} colored paths total`);

    // Let's examine the SVG structure more carefully - log all paths with their colors and positions
    allPaths.forEach((path, index) => {
      const fill = path.getAttribute("fill");
      const pathBBox = (path as SVGGraphicsElement).getBBox();
      const centerX = pathBBox.x + pathBBox.width / 2;
      const centerY = pathBBox.y + pathBBox.height / 2;
      console.log(
        `Path ${index}: fill=${fill}, center=(${centerX.toFixed(
          1
        )}, ${centerY.toFixed(1)}), size=${pathBBox.width.toFixed(
          1
        )}x${pathBBox.height.toFixed(1)}`
      );
    });

    // Get all text elements with their basic info, accounting for transforms
    const allTexts = Array.from(svg.querySelectorAll("text"))
      .map((text) => {
        const content = text.textContent || "";
        const zodiacSymbols = [
          "♈",
          "♉",
          "♊",
          "♋",
          "♌",
          "♍",
          "♎",
          "♏",
          "♐",
          "♑",
          "♒",
          "♓",
        ];

        // Get the actual rendered position, accounting for transforms
        let x = parseFloat(text.getAttribute("x") || "0");
        let y = parseFloat(text.getAttribute("y") || "0");

        // Check if element has transforms that need to be accounted for
        const transform = text.getAttribute("transform");
        const parentTransform = text.parentElement?.getAttribute("transform");

        // If the text is inside a transformed group, use getBBox for actual position
        if (transform || parentTransform) {
          try {
            const bbox = (text as SVGTextElement).getBBox();
            const ctm = (text as SVGTextElement).getCTM();
            if (ctm) {
              x = bbox.x + bbox.width / 2;
              y = bbox.y + bbox.height / 2;
              // Apply transform matrix
              const point = svg.createSVGPoint();
              point.x = x;
              point.y = y;
              const transformedPoint = point.matrixTransform(ctm);
              x = transformedPoint.x;
              y = transformedPoint.y;
            }
          } catch (e) {
            // Fallback to original method if transform calculation fails
          }
        }

        return {
          element: text,
          content,
          x,
          y,
          isZodiac: zodiacSymbols.includes(content),
          isHouse: /^[1-9]$|^1[0-2]$/.test(content),
          hasTransform: !!(transform || parentTransform),
        };
      })
      .filter((t) => t.isZodiac || t.isHouse); // Only keep zodiac symbols and house numbers

    // Debug: Show all house numbers found
    const foundHouses = allTexts.filter((t) => t.isHouse);
    console.log(
      `🏠 Found house numbers:`,
      foundHouses.map(
        (h) => `${h.content} at (${h.x.toFixed(1)}, ${h.y.toFixed(1)})`
      )
    );

    // Specifically check if houses 4 and 8 are found
    const house4 = foundHouses.find((h) => h.content === "4");
    const house8 = foundHouses.find((h) => h.content === "8");
    console.log(
      `🔍 House 4:`,
      house4 ? `Found at (${house4.x}, ${house4.y})` : "NOT FOUND"
    );
    console.log(
      `🔍 House 8:`,
      house8 ? `Found at (${house8.x}, ${house8.y})` : "NOT FOUND"
    );

    // Separate house and zodiac texts for better pairing
    const houseTexts = allTexts.filter((t) => t.isHouse);
    const zodiacTexts = allTexts.filter((t) => t.isZodiac);
    const usedTexts = new Set<Element>();

    // First pair zodiac texts with their wedges (usually outer/larger wedges)
    zodiacTexts.forEach((textData) => {
      if (usedTexts.has(textData.element)) return;

      let closestPath: Element | null = null;
      let closestDistance = Infinity;

      allPaths.forEach((path) => {
        const pathBBox = (path as SVGGraphicsElement).getBBox();
        const pathCenterX = pathBBox.x + pathBBox.width / 2;
        const pathCenterY = pathBBox.y + pathBBox.height / 2;

        const distance = Math.sqrt(
          Math.pow(textData.x - pathCenterX, 2) +
            Math.pow(textData.y - pathCenterY, 2)
        );

        if (distance < closestDistance) {
          closestDistance = distance;
          closestPath = path;
        }
      });

      const zodiacDistanceThreshold = 150; // Slightly larger for zodiac signs

      if (closestPath && closestDistance < zodiacDistanceThreshold) {
        const existingTexts = wedgeGroups.get(closestPath) || [];
        wedgeGroups.set(closestPath, [...existingTexts, textData.element]);
        usedTexts.add(textData.element);
      }
    });

    // Get paths already used by zodiac signs
    const usedPaths = new Set(wedgeGroups.keys());

    // Then pair house texts with remaining wedges (usually inner/smaller wedges)
    houseTexts.forEach((textData) => {
      if (usedTexts.has(textData.element)) return;

      let closestPath: Element | null = null;
      let closestDistance = Infinity;

      allPaths.forEach((path) => {
        // Skip paths already used by zodiac signs
        if (usedPaths.has(path)) return;

        const pathBBox = (path as SVGGraphicsElement).getBBox();
        const pathCenterX = pathBBox.x + pathBBox.width / 2;
        const pathCenterY = pathBBox.y + pathBBox.height / 2;

        const distance = Math.sqrt(
          Math.pow(textData.x - pathCenterX, 2) +
            Math.pow(textData.y - pathCenterY, 2)
        );

        if (distance < closestDistance) {
          closestDistance = distance;
          closestPath = path;
        }
      });

      const houseDistanceThreshold = 100; // Stricter for house numbers

      // Skip houses 4 and 8 - they'll get special treatment
      if (textData.content === "4" || textData.content === "8") {
        return; // Don't pair them with any wedges
      }

      if (closestPath && closestDistance < houseDistanceThreshold) {
        const existingTexts = wedgeGroups.get(closestPath) || [];
        wedgeGroups.set(closestPath, [...existingTexts, textData.element]);
        usedTexts.add(textData.element);

        // Debug houses 4 and 8 specifically
        if (textData.content === "4" || textData.content === "8") {
          console.log(
            `🔍 House ${textData.content} paired with wedge at distance:`,
            closestDistance
          );
          console.log(`   Text position: (${textData.x}, ${textData.y})`);
          const pathBBox = (closestPath as SVGGraphicsElement).getBBox();
          console.log(
            `   Wedge center: (${pathBBox.x + pathBBox.width / 2}, ${
              pathBBox.y + pathBBox.height / 2
            })`
          );
        }
      } else if (textData.content === "4" || textData.content === "8") {
        console.log(
          `❌ House ${textData.content} NOT paired - distance ${closestDistance} > threshold ${houseDistanceThreshold}`
        );
        console.log(`   Text position: (${textData.x}, ${textData.y})`);
        console.log(
          `   Available unused paths:`,
          allPaths.filter((p) => !usedPaths.has(p)).length
        );
      }
    });

    // Collect all elements that are part of wedge groups to avoid duplicate hover effects
    const elementsInWedgeGroups = new Set<Element>();
    wedgeGroups.forEach((textElements, pathElement) => {
      elementsInWedgeGroups.add(pathElement);
      textElements.forEach((textEl) => elementsInWedgeGroups.add(textEl));
    });

    // Get all text elements for hover handling
    const allTextElements = svg.querySelectorAll("text");

    // Create fake wedge groups for houses 4 and 8 since they don't have real wedges
    const house4Element = Array.from(allTextElements).find(
      (el) => el.textContent === "4"
    );
    const house8Element = Array.from(allTextElements).find(
      (el) => el.textContent === "8"
    );

    if (house4Element) {
      // Create a fake wedge group with just the house 4 text
      wedgeGroups.set(house4Element as Element, [house4Element as Element]);
      console.log("🏠 Created fake wedge group for house 4");
    }

    if (house8Element) {
      // Create a fake wedge group with just the house 8 text
      wedgeGroups.set(house8Element as Element, [house8Element as Element]);
      console.log("🏠 Created fake wedge group for house 8");
    }

    // Add individual hover ONLY to elements that are NOT part of wedge groups AND not special houses
    allTextElements.forEach((textElement) => {
      // Skip if this element is already part of a wedge group or is a special house
      if (elementsInWedgeGroups.has(textElement)) {
        return;
      }

      const content = textElement.textContent || "";
      const isHouseNumber = /^[1-9]$|^1[0-2]$/.test(content);
      const zodiacSymbols = [
        "♈",
        "♉",
        "♊",
        "♋",
        "♌",
        "♍",
        "♎",
        "♏",
        "♐",
        "♑",
        "♒",
        "♓",
      ];
      const isZodiacSymbol = zodiacSymbols.includes(content);

      if (isHouseNumber || isZodiacSymbol) {
        (textElement as unknown as HTMLElement).style.cursor = "pointer";
        (textElement as unknown as HTMLElement).style.transition = "transform 0.3s ease";

        const hoverIn = () => {
          console.log(
            `✨ Individual hover fired for unpaired ${
              isHouseNumber ? "house" : "zodiac"
            } ${content}`
          );
          const htmlElement = textElement as unknown as HTMLElement;
          htmlElement.style.transform = "scale(1.2)";
        };

        const hoverOut = () => {
          const htmlElement = textElement as unknown as HTMLElement;
          htmlElement.style.transform = "scale(1)";
        };

        // Track listeners for cleanup
        eventListeners.push(
          { element: textElement, event: "mouseenter", handler: hoverIn },
          { element: textElement, event: "mouseleave", handler: hoverOut }
        );
        
        textElement.addEventListener("mouseenter", hoverIn);
        textElement.addEventListener("mouseleave", hoverOut);
      }
    });

    // Add hover effects to wedge groups (existing system)
    wedgeGroups.forEach((textElements, pathElement) => {
      const group = [pathElement, ...textElements];

      // Check what house numbers are in this group
      const houseNumbers = textElements
        .map((el) => el.textContent)
        .filter((text) => text && /^[1-9]$|^1[0-2]$/.test(text));

      group.forEach((element) => {
        (element as HTMLElement).style.cursor = "pointer";
        (element as HTMLElement).style.transition = "transform 0.3s ease, opacity 0.3s ease";
      });

      const addHoverEffect = (e: Event) => {
        // Only log houses 4 and 8 for debugging
        if (houseNumbers.includes("4") || houseNumbers.includes("8")) {
          console.log(`🔥 Hovering house ${houseNumbers.join(", ")}`);
          console.log(
            "   Before transform:",
            group.map((el) => (el as HTMLElement).style.transform || "none")
          );
        }

        // Calculate expansion direction from chart center
        const svgRect = svg.getBoundingClientRect();
        const chartCenterX = svgRect.width / 2;
        const chartCenterY = svgRect.height / 2;

        const pathBBox = (pathElement as SVGGraphicsElement).getBBox();
        const pathCenterX = pathBBox.x + pathBBox.width / 2;
        const pathCenterY = pathBBox.y + pathBBox.height / 2;

        // Calculate direction vector from chart center to wedge center
        const deltaX = pathCenterX - chartCenterX;
        const deltaY = pathCenterY - chartCenterY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        // Normalize direction and calculate expansion offset
        const expansionDistance = 8; // Increased for more visible effect
        const offsetX = (deltaX / distance) * expansionDistance;
        const offsetY = (deltaY / distance) * expansionDistance;

        // Apply simple hover animations like in rings component
        group.forEach((element) => {
          const htmlElement = element as HTMLElement;
          
          // For paths (wedge backgrounds)
          if (element.tagName === 'path') {
            htmlElement.style.transform = "scale(1.05)";
            htmlElement.style.transformOrigin = "center";
            htmlElement.style.opacity = "0.8";
          }
          
          // For text elements
          if (element.tagName === 'text') {
            htmlElement.style.transform = "scale(1.1)";
            htmlElement.style.transformOrigin = "center";
          }
        });

        // Log after transform for houses 4 and 8
        if (houseNumbers.includes("4") || houseNumbers.includes("8")) {
          console.log(
            "   After transform:",
            group.map((el) => (el as HTMLElement).style.transform)
          );
        }

        // TRIGGER TOOLTIP BASED ON WEDGE TYPE
        const rect = container.getBoundingClientRect();
        const mouseX = e instanceof MouseEvent ? e.clientX - rect.left : 0;
        const mouseY = e instanceof MouseEvent ? e.clientY - rect.top : 0;

        // Determine if this is a house or zodiac wedge based on the group content
        const zodiacSymbols = [
          "♈",
          "♉",
          "♊",
          "♋",
          "♌",
          "♍",
          "♎",
          "♏",
          "♐",
          "♑",
          "♒",
          "♓",
        ];
        const zodiacTexts = textElements
          .map((el) => el.textContent)
          .filter((text) => text && zodiacSymbols.includes(text));

        // Determine tooltip position
        const tooltipCenterX = rect.width / 2;
        const tooltipCenterY = rect.height / 2;
        const isRight = mouseX > tooltipCenterX;
        const isBottom = mouseY > tooltipCenterY;
        let tooltipPosition:
          | "top-left"
          | "top-right"
          | "bottom-left"
          | "bottom-right";
        if (isRight && isBottom) tooltipPosition = "bottom-right";
        else if (isRight && !isBottom) tooltipPosition = "top-right";
        else if (!isRight && isBottom) tooltipPosition = "bottom-left";
        else tooltipPosition = "top-left";

        // Show house tooltip if this wedge contains a house number
        if (houseNumbers.length > 0 && chartData) {
          const houseNumberStr = houseNumbers[0];
          if (houseNumberStr) {
            const houseNumber = parseInt(houseNumberStr);
            const houseData = chartData.houses.find(
              (h) => h.number === houseNumber
            );

            if (houseData) {
              const houseMeanings = [
                "Self, Identity, First Impressions",
                "Money, Values, Possessions",
                "Communication, Siblings, Learning",
                "Home, Family, Roots",
                "Creativity, Children, Romance",
                "Health, Work, Daily Routine",
                "Partnerships, Marriage, Others",
                "Transformation, Shared Resources",
                "Philosophy, Higher Learning, Travel",
                "Career, Reputation, Public Image",
                "Friends, Groups, Hopes",
                "Spirituality, Subconscious, Endings",
              ];

              setTooltip({
                visible: true,
                title: "House",
                content: (
                  <div>
                    <div className="font-bold text-base mb-1">
                      {houseNumber}th House
                    </div>
                    <div className="text-sm space-y-1">
                      <div>
                        Sign:{" "}
                        <span className="font-medium capitalize">
                          {houseData.sign}
                        </span>
                      </div>
                      <div className="text-gray-600">
                        {houseMeanings[houseNumber - 1]}
                      </div>
                    </div>
                  </div>
                ),
                x: mouseX,
                y: mouseY,
                color: "#7c3aed",
                position: tooltipPosition,
              });
            }
          }
        }
        // Show zodiac tooltip if this wedge contains a zodiac symbol
        else if (zodiacTexts.length > 0) {
          const zodiacSymbol = zodiacTexts[0];
          if (zodiacSymbol) {
            const signNames = [
              "Aries",
              "Taurus",
              "Gemini",
              "Cancer",
              "Leo",
              "Virgo",
              "Libra",
              "Scorpio",
              "Sagittarius",
              "Capricorn",
              "Aquarius",
              "Pisces",
            ];
            const signIndex = zodiacSymbols.indexOf(zodiacSymbol);
            const signName = signNames[signIndex];

            const signInfo = {
              Aries: "Fire • Cardinal • Mars",
              Taurus: "Earth • Fixed • Venus",
              Gemini: "Air • Mutable • Mercury",
              Cancer: "Water • Cardinal • Moon",
              Leo: "Fire • Fixed • Sun",
              Virgo: "Earth • Mutable • Mercury",
              Libra: "Air • Cardinal • Venus",
              Scorpio: "Water • Fixed • Mars/Pluto",
              Sagittarius: "Fire • Mutable • Jupiter",
              Capricorn: "Earth • Cardinal • Saturn",
              Aquarius: "Air • Fixed • Saturn/Uranus",
              Pisces: "Water • Mutable • Jupiter/Neptune",
            };

            if (signName) {
              setTooltip({
                visible: true,
                title: "Zodiac Sign",
                content: (
                  <div>
                    <div className="font-bold text-base mb-1">{signName}</div>
                    <div className="text-sm text-gray-600">
                      {signInfo[signName as keyof typeof signInfo]}
                    </div>
                  </div>
                ),
                x: mouseX,
                y: mouseY,
                color: "#059669",
                position: tooltipPosition,
              });
            }
          }
        }
      };

      const removeHoverEffect = () => {
        // Reset all group elements with simple animations like rings component
        group.forEach((element) => {
          const htmlElement = element as HTMLElement;
          htmlElement.style.transform = "scale(1)";
          htmlElement.style.opacity = "1";
        });
        setTooltip((prev) => ({ ...prev, visible: false }));
      };

      // Add listeners to all elements in the group
      group.forEach((element) => {
        // Track listeners for cleanup
        eventListeners.push(
          { element, event: "mouseenter", handler: addHoverEffect },
          { element, event: "mouseleave", handler: removeHoverEffect }
        );
        
        element.addEventListener("mouseenter", addHoverEffect);
        element.addEventListener("mouseleave", removeHoverEffect);
      });
    });

    // Cleanup function to remove all event listeners
    return () => {
      eventListeners.forEach(({ element, event, handler }) => {
        try {
          element.removeEventListener(event, handler);
        } catch (error) {
          // Silently handle cases where element might be removed from DOM
        }
      });
    };
  }, [svgContent, chartData]);

  return (
    <div className={`relative ${className}`}>
      {/* Base SVG Chart */}
      <div
        ref={containerRef}
        className="w-full h-full [&>svg]:w-full [&>svg]:h-auto [&>svg]:max-h-[85vh] [&>svg]:min-h-[500px]"
      />

      {/* Tooltip with Curved Connector */}
      {tooltip.visible && (
        <>
          {/* Connection Path SVG */}
          <svg
            className="absolute top-0 left-0 w-full h-full pointer-events-none z-40"
            style={{ position: "absolute" }}
          >
            <defs>
              <marker
                id="tooltip-arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill={tooltip.color} />
              </marker>
            </defs>
            <path
              d={(() => {
                const containerWidth = containerRef.current?.clientWidth || 800;
                const containerHeight =
                  containerRef.current?.clientHeight || 800;

                let tooltipX, tooltipY, controlX, controlY;

                switch (tooltip.position) {
                  case "top-left":
                    tooltipX = 20 + 140; // Center of tooltip
                    tooltipY = 20 + 30;
                    controlX = tooltip.x - 80;
                    controlY = tooltip.y - 80;
                    break;
                  case "top-right":
                    tooltipX = containerWidth - 20 - 140;
                    tooltipY = 20 + 30;
                    controlX = tooltip.x + 80;
                    controlY = tooltip.y - 80;
                    break;
                  case "bottom-left":
                    tooltipX = 20 + 140;
                    tooltipY = containerHeight - 20 - 30;
                    controlX = tooltip.x - 80;
                    controlY = tooltip.y + 80;
                    break;
                  case "bottom-right":
                  default:
                    tooltipX = containerWidth - 20 - 140;
                    tooltipY = containerHeight - 20 - 30;
                    controlX = tooltip.x + 80;
                    controlY = tooltip.y + 80;
                    break;
                }

                return `M ${tooltip.x} ${tooltip.y} Q ${controlX} ${controlY} ${tooltipX} ${tooltipY}`;
              })()}
              stroke={tooltip.color}
              strokeWidth="1.5"
              fill="none"
              markerEnd="url(#tooltip-arrowhead)"
              strokeDasharray="3,3"
            />
            <circle cx={tooltip.x} cy={tooltip.y} r="3" fill={tooltip.color} />
          </svg>

          {/* Tooltip Box - Dynamic Position */}
          <div
            className="absolute pointer-events-none z-50"
            style={(() => {
              switch (tooltip.position) {
                case "top-left":
                  return { left: "20px", top: "20px" };
                case "top-right":
                  return { right: "20px", top: "20px" };
                case "bottom-left":
                  return { left: "20px", bottom: "20px" };
                case "bottom-right":
                default:
                  return { right: "20px", bottom: "20px" };
              }
            })()}
          >
            {/* Callout Box */}
            <div className="relative bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg rounded-lg min-w-[180px] max-w-[280px]">
              {/* Content Section */}
              <div className="px-4 py-3">
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: tooltip.color }}
                  />
                  <div className="text-gray-500 text-xs font-medium uppercase tracking-wide">
                    {tooltip.title}
                  </div>
                </div>
                <div className="text-gray-900">{tooltip.content}</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default InteractiveNatalChart;
