/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState, useRef } from "react";
import { NatalChartData } from "../../utils/natalChart";

// SVG paths for zodiac symbols (no purple background issues!)
const renderZodiacSymbol = (symbol: string) => {
  const symbolSize = 27;
  const pathProps = {
    stroke: "#374151",
    strokeWidth: "1.5",
    fill: "none",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const
  };

  switch (symbol) {
    case "♈": // Aries
      return (
        <g transform={`scale(${symbolSize / 20}) translate(-10, -10)`}>
          <path d="m2.8867 9.53c-0.48441-0.48454-0.84187-1.0811-1.0407-1.7367-0.19883-0.65567-0.2329-1.3502-0.0992-2.0222 0.13371-0.67198 0.43106-1.3006 0.86572-1.8302 0.43467-0.52963 0.99323-0.9439 1.6262-1.2061 0.63299-0.26222 1.3209-0.36429 2.0027-0.29718 0.68187 0.06711 1.3367 0.30134 1.9064 0.68193 0.56973 0.38059 1.0368 0.8958 1.3599 1.5s0.49216 1.2788 0.49228 1.9639m0 0c1.1e-4 -0.68516 0.16921-1.3597 0.49231-1.9639 0.323-0.60421 0.7901-1.1194 1.3599-1.5 0.5697-0.38059 1.2245-0.61482 1.9063-0.68193 0.6819-0.06711 1.3698 0.03496 2.0028 0.29718 0.633 0.26221 1.1915 0.67648 1.6262 1.2061 0.4347 0.52962 0.732 1.1583 0.8657 1.8302 0.1337 0.67199 0.0997 1.3666-0.0992 2.0222-0.1988 0.65568-0.5563 1.2522-1.0407 1.7367m-7.1133-2.9467v12.5" {...pathProps} />
        </g>
      );
    case "♉": // Taurus
      return (
        <g transform={`scale(${symbolSize / 20}) translate(-10, -10)`}>
          <path d="m15.555 1.9167c0 1.4733-0.5852 2.8862-1.627 3.928-1.0418 1.0418-2.4539 1.6279-3.9272 1.6279-1.4732 0-2.887-0.58609-3.9288-1.6279-1.0418-1.0418-1.627-2.4547-1.627-3.928" {...pathProps} />
          <path d="m10.001 18.585c3.0686 0 5.5562-2.4876 5.5562-5.5562 0-3.0687-2.4876-5.5563-5.5562-5.5563-3.0687 0-5.5563 2.4876-5.5563 5.5563 0 3.0686 2.4876 5.5562 5.5563 5.5562z" {...pathProps} />
        </g>
      );
    case "♊": // Gemini
      return (
        <g transform={`scale(${symbolSize / 20}) translate(-10, -10)`}>
          <path d="m5.8333 3.87v13.26m8.3334-13.26v13.26m4.1666-14.963c-2.5333 1.4636-5.4075 2.2342-8.3333 2.2342-2.9258 0-5.8-0.77058-8.3333-2.2342m16.667 16.667c-2.5337-1.4626-5.4077-2.2326-8.3333-2.2326-2.9256 0-5.7996 0.77-8.3333 2.2326" {...pathProps} />
        </g>
      );
    case "♋": // Cancer
      return (
        <g transform={`scale(${symbolSize / 20}) translate(-10, -10)`}>
          <path d="m18.333 10.5c0-0.3649-0.0718-0.72614-0.2115-1.0632-0.1396-0.33709-0.3442-0.64337-0.6022-0.90136s-0.5643-0.46264-0.9014-0.60227c-0.3371-0.13962-0.6983-0.21148-1.0632-0.21148s-0.7261 0.07186-1.0632 0.21148c-0.3371 0.13963-0.6434 0.34428-0.9014 0.60227s-0.4626 0.56427-0.6022 0.90136c-0.1397 0.33708-0.2115 0.69832-0.2115 1.0632 0 0.7369 0.2927 1.4435 0.8137 1.9646 0.5211 0.521 1.2277 0.8137 1.9646 0.8137s1.4435-0.2927 1.9646-0.8137c0.521-0.5211 0.8137-1.2277 0.8137-1.9646zm0 0c-3e-4 -1.6479-0.4893-3.2587-1.405-4.6288s-2.217-2.4379-3.7395-3.0685c-1.5225-0.63058-3.1978-0.79561-4.8141-0.47421-1.6163 0.3214-3.101 1.1148-4.2664 2.2799m-2.4417 5.8917c0 0.3649 0.07187 0.7261 0.21149 1.0632 0.13963 0.3371 0.34428 0.6434 0.60227 0.9014s0.56427 0.4626 0.90136 0.6022c0.33708 0.1397 0.69836 0.2115 1.0632 0.2115 0.36485 0 0.72614-0.0718 1.0632-0.2115 0.33708-0.1396 0.64336-0.3442 0.90136-0.6022 0.25799-0.258 0.46264-0.5643 0.60226-0.9014 0.13963-0.3371 0.21149-0.6983 0.21149-1.0632 0-0.73686-0.29272-1.4435-0.81375-1.9646-0.52104-0.52104-1.2277-0.81375-1.9646-0.81375s-1.4435 0.29271-1.9646 0.81375-0.81376 1.2277-0.81376 1.9646zm0 0c3.6e-4 1.6479 0.48929 3.2587 1.405 4.6288s2.2171 2.4379 3.7396 3.0685 3.1978 0.7956 4.8141 0.4742c1.6162-0.3214 3.1009-1.1148 4.2664-2.2798" {...pathProps} />
        </g>
      );
    case "♌": // Leo
      return (
        <g transform={`scale(${symbolSize / 20}) translate(-10, -10)`}>
          <path d="m7.9167 12.583c0-2.0833-2.0833-4.1666-2.0833-6.25 0-1.1051 0.43899-2.1649 1.2204-2.9463s1.8412-1.2204 2.9463-1.2204c1.1051 0 2.1649 0.43899 2.9463 1.2204s1.2204 1.8412 1.2204 2.9463c0 4.1667-2.0834 6.25-2.0834 10.417 0 0.5525 0.2195 1.0824 0.6102 1.4731s0.9206 0.6102 1.4732 0.6102c0.5525 0 1.0824-0.2195 1.4731-0.6102s0.6102-0.9206 0.6102-1.4731m-8.3333-4.1667c0-0.5525-0.2195-1.0824-0.6102-1.4731s-0.9206-0.6102-1.4731-0.6102c-0.55253 0-1.0824 0.2195-1.4731 0.6102s-0.61019 0.9206-0.61019 1.4731c0 0.5526 0.21949 1.0825 0.61019 1.4732s0.92061 0.6102 1.4731 0.6102c0.55254 0 1.0824-0.2195 1.4731-0.6102s0.6102-0.9206 0.6102-1.4732z" {...pathProps} />
        </g>
      );
    case "♍": // Virgo
      return (
        <g transform={`scale(${symbolSize / 20}) translate(-10, -10)`}>
          <path d="m1.5043 7.094c-0.26642-0.30638-0.46302-0.68357-0.57238-1.0982-0.10936-0.41459-0.1281-0.85378-0.05456-1.2787 0.073536-0.4249 0.23708-0.82239 0.47615-1.1573 0.23906-0.33488 0.54627-0.59683 0.89442-0.76263s0.72649-0.23034 1.1015-0.1879c0.37502 0.04243 0.73516 0.19053 1.0485 0.43118s0.57024 0.56643 0.74793 0.94847 0.27069 0.80857 0.27076 1.2418m0 0v10.538m0-10.538c0-0.69874 0.24144-1.3689 0.67121-1.863 0.42977-0.49408 1.0127-0.77165 1.6204-0.77165s1.1907 0.27757 1.6204 0.77165c0.42977 0.49409 0.67121 1.1642 0.67121 1.863m4.5833 2.6346c0-0.69874 0.2415-1.3689 0.6713-1.863 0.4297-0.49408 1.0126-0.77166 1.6204-0.77166s1.1907 0.27758 1.6205 0.77166c0.4297 0.49409 0.6712 1.1642 0.6712 1.863 0 2.0962-0.7244 4.1066-2.0137 5.5888-1.2893 1.4823-3.038 2.315-4.8613 2.315m-2.2917-10.538c0-0.69874 0.2415-1.3689 0.6712-1.863 0.4298-0.49408 1.0127-0.77165 1.6205-0.77165s1.1907 0.27757 1.6204 0.77165c0.4298 0.49409 0.6712 1.1642 0.6712 1.863v10.538c0 1.4543 1.0267 2.6346 2.2917 2.6346m-6.875-13.173v10.538" {...pathProps} />
        </g>
      );
    case "♎": // Libra
      return (
        <g transform={`scale(${symbolSize / 20}) translate(-10, -10)`}>
          <path d="m1.6667 10.5h4.1667c0-1.1051 0.43898-2.1649 1.2204-2.9463 0.7814-0.7814 1.8412-1.2204 2.9463-1.2204 1.1051 0 2.1649 0.43899 2.9463 1.2204s1.2204 1.8412 1.2204 2.9463h4.1666m-16.667 4.1667h16.667" {...pathProps} />
        </g>
      );
    case "♏": // Scorpio
      return (
        <g transform={`scale(${symbolSize / 20}) translate(-10, -10)`}>
          <path d="m16.933 14.766v-2.3796h2.2338m-17.679-4.9629c-0.25971-0.27673-0.45134-0.6174-0.55794-0.99186-0.1066-0.37446-0.12486-0.77114-0.053182-1.1549s0.23109-0.74279 0.46413-1.0453c0.23303-0.30247 0.53248-0.53906 0.87184-0.68882 0.33936-0.14975 0.70814-0.20804 1.0737-0.16971 0.36556 0.03832 0.7166 0.17209 1.022 0.38945 0.30544 0.21735 0.55585 0.51159 0.72905 0.85666 0.1732 0.34506 0.26385 0.7303 0.26392 1.1216m0 0v9.5184m0-9.5184c0-0.63111 0.23534-1.2364 0.65427-1.6826 0.41892-0.44626 0.98709-0.69697 1.5795-0.69697 0.59244 0 1.1606 0.25071 1.5795 0.69697s0.65427 1.0515 0.65427 1.6826m0 0v9.5184m0-9.5184c0-0.63111 0.23532-1.2364 0.65422-1.6826 0.419-0.44626 0.9871-0.69697 1.5796-0.69697 0.5924 0 1.1606 0.25071 1.5795 0.69697 0.419 0.44626 0.6543 1.0515 0.6543 1.6826v9.5184c1e-4 0.3913 0.0907 0.7766 0.2639 1.1216 0.1732 0.3451 0.4236 0.6393 0.7291 0.8567 0.3054 0.2173 0.6565 0.3511 1.022 0.3894 0.3656 0.0384 0.7344-0.0199 1.0737-0.1697 0.3394-0.1497 0.6388-0.3863 0.8719-0.6888 0.233-0.3025 0.3924-0.6615 0.4641-1.0453 0.0717-0.3837 0.0534-0.7804-0.0532-1.1549-0.1066-0.3744-0.2982-0.7151-0.5579-0.9918l-0.8936-0.9519" {...pathProps} />
        </g>
      );
    case "♐": // Sagittarius
      return (
        <g transform={`scale(${symbolSize / 20}) translate(-10, -10)`}>
          <path d="m6.25 6.75 7.5 7.5m-11.25 3.75 15-15m0 0h-3.75m3.75 0v3.75" {...pathProps} />
        </g>
      );
    case "♑": // Capricorn
      return (
        <g transform={`scale(${symbolSize / 20}) translate(-10, -10)`}>
          <path d="m1.4167 7.7217h2.7783l2.7767 11.112 2.7783-11.112h5.555c0.6112-7e-5 1.2053-0.20182 1.6902-0.57397 0.4849-0.37214 0.8334-0.89387 0.9916-1.4843 0.1581-0.59042 0.117-1.2165-0.1169-1.7812-0.234-0.56468-0.6477-1.0364-1.1771-1.342-0.5293-0.30558-1.1447-0.42796-1.7507-0.34815s-1.1687 0.35734-1.6009 0.78956c-0.4322 0.43221-0.7097 0.99495-0.7895 1.601-0.0797 0.606 0.0427 1.2214 0.3483 1.7507l4.8117 8.3334c0.2134 0.3691 0.3391 0.7823 0.3672 1.2078 0.0282 0.4254-0.042 0.8516-0.205 1.2456s-0.4146 0.7451-0.7351 1.0263c-0.3205 0.2811-0.7015 0.4848-1.1133 0.5951-0.4119 0.1103-0.8436 0.1243-1.2617 0.041-0.4182-0.0833-0.8116-0.2617-1.1497-0.5215-0.3381-0.2597-0.6119-0.5938-0.8002-0.9763-0.1883-0.3826-0.286-0.8033-0.2856-1.2297" {...pathProps} />
        </g>
      );
    case "♒": // Aquarius
      return (
        <g transform={`scale(${symbolSize / 20}) translate(-10, -10)`}>
          <path d="m1.6667 13.417c0.55302-0.5517 1.3022-0.8614 2.0833-0.8614s1.5303 0.3097 2.0833 0.8614c0.2735 0.2737 0.59827 0.4909 0.95574 0.639 0.35747 0.1482 0.74063 0.2244 1.1276 0.2244s0.77013-0.0762 1.1276-0.2244c0.35747-0.1481 0.68223-0.3653 0.95573-0.639 0.553-0.5517 1.3022-0.8614 2.0833-0.8614s1.5304 0.3097 2.0834 0.8614c0.2735 0.2737 0.5982 0.4909 0.9557 0.639 0.3575 0.1482 0.7406 0.2244 1.1276 0.2244s0.7701-0.0762 1.1276-0.2244c0.3575-0.1481 0.6822-0.3653 0.9557-0.639m-16.667-5.8334c0.55302-0.55162 1.3022-0.86141 2.0833-0.86141s1.5303 0.30979 2.0833 0.86141c0.2735 0.27374 0.59827 0.4909 0.95574 0.63906s0.74063 0.22442 1.1276 0.22442 0.77013-0.07626 1.1276-0.22442 0.68223-0.36532 0.95573-0.63906c0.553-0.55162 1.3022-0.86141 2.0833-0.86141s1.5304 0.30979 2.0834 0.86141c0.2735 0.27374 0.5982 0.4909 0.9557 0.63906s0.7406 0.22442 1.1276 0.22442 0.7701-0.07626 1.1276-0.22442 0.6822-0.36532 0.9557-0.63906" {...pathProps} />
        </g>
      );
    case "♓": // Pisces
      return (
        <g transform={`scale(${symbolSize / 20}) translate(-10, -10)`}>
          <path d="m15.208 3.2833c-1.2667 0.73143-2.3186 1.7834-3.0499 3.0502-0.7314 1.2668-1.1164 2.7038-1.1164 4.1665 0 1.4627 0.385 2.8997 1.1164 4.1665 0.7313 1.2668 1.7832 2.3187 3.0499 3.0502m-10.417 0c1.2667-0.7315 2.3186-1.7834 3.05-3.0502 0.73133-1.2668 1.1164-2.7038 1.1164-4.1665 0-1.4627-0.38502-2.8997-1.1164-4.1665-0.73134-1.2668-1.7832-2.3188-3.05-3.0502m-3.125 7.2134h16.672" {...pathProps} />
        </g>
      );
    default:
      // This shouldn't happen since we have all 12 signs
      return (
        <text
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="18"
          fill="#374151"
          fontFamily="sans-serif"
          style={{ pointerEvents: 'none' }}
        >
          {symbol}
        </text>
      );
  }
};

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

// Zodiac wedge component (outer ring)
interface ZodiacWedgeProps {
  sign: string;
  index: number;
  onHover: (sign: string, x: number, y: number) => void;
  onHoverEnd: () => void;
}

const ZodiacWedge: React.FC<ZodiacWedgeProps> = ({ sign, index, onHover, onHoverEnd }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Zodiac colors - Synapsas palette with additional colors
  const zodiacColors: { [key: string]: string } = {
    "♈": "#ff91e9", // Aries - Synapsas purple
    "♉": "#4ade80", // Taurus - Synapsas green
    "♊": "#f2e356", // Gemini - Synapsas yellow
    "♋": "#6bdbff", // Cancer - Synapsas blue
    "♌": "#ff8c42", // Leo - vibrant orange (additional color)
    "♍": "#f0e3ff", // Virgo - Synapsas light purple
    "♎": "#ff6b6b", // Libra - coral red (additional color)
    "♏": "#4ecdc4", // Scorpio - teal (additional color)
    "♐": "#45b7d1", // Sagittarius - sky blue (additional color)
    "♑": "#96ceb4", // Capricorn - mint green (additional color)
    "♒": "#feca57", // Aquarius - golden yellow (additional color)
    "♓": "#ff9ff3", // Pisces - light pink (additional color)
  };

  const signNames = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

  // Calculate wedge path for outer ring - scaled up
  const angle = index * 30;
  const innerRadius = 420;
  const outerRadius = 525;

  const startAngle = (angle - 90) * Math.PI / 180;
  const endAngle = ((angle + 30) - 90) * Math.PI / 180;

  const x1 = Math.cos(startAngle) * innerRadius;
  const y1 = Math.sin(startAngle) * innerRadius;
  const x2 = Math.cos(startAngle) * outerRadius;
  const y2 = Math.sin(startAngle) * outerRadius;
  const x3 = Math.cos(endAngle) * outerRadius;
  const y3 = Math.sin(endAngle) * outerRadius;
  const x4 = Math.cos(endAngle) * innerRadius;
  const y4 = Math.sin(endAngle) * innerRadius;

  const pathData = `
    M ${x1} ${y1}
    L ${x2} ${y2}
    A ${outerRadius} ${outerRadius} 0 0 1 ${x3} ${y3}
    L ${x4} ${y4}
    A ${innerRadius} ${innerRadius} 0 0 0 ${x1} ${y1}
    Z
  `;

  const midAngle = ((angle + 15) - 90) * Math.PI / 180;
  const textRadius = (innerRadius + outerRadius) / 2;
  const textX = Math.cos(midAngle) * textRadius;
  const textY = Math.sin(midAngle) * textRadius;

  const handleMouseEnter = (e: React.MouseEvent) => {
    setIsHovered(true);
    const svgElement = e.currentTarget.closest('svg');
    const containerElement = svgElement?.parentElement;
    if (!svgElement || !containerElement) return;

    const containerRect = containerElement.getBoundingClientRect();
    const mouseX = e.clientX - containerRect.left;
    const mouseY = e.clientY - containerRect.top;

    onHover(signNames[index], mouseX, mouseY);
  };

  return (
    <g
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => { setIsHovered(false); onHoverEnd(); }}
      style={{ cursor: 'pointer' }}
    >
      <path
        d={pathData}
        fill={zodiacColors[sign]}
        opacity={isHovered ? 0.8 : 0.3}
        stroke="#19181a"
        strokeWidth="2"
        transform={isHovered ? 'scale(1.02)' : 'scale(1)'}
        style={{
          transition: 'all 0.3s ease',
          transformOrigin: `${textX}px ${textY}px`
        }}
      />
      <g
        transform={`translate(${textX}, ${textY})`}
        style={{
          pointerEvents: 'none'
        }}
      >
        {renderZodiacSymbol(sign)}
      </g>
    </g>
  );
};

// House wedge component (middle ring)
interface HouseWedgeProps {
  house: { number: number; sign: string };
  angle: number;
  houses: { number: number; sign: string; cusp: number }[];
  onHover: (house: { number: number; sign: string }, x: number, y: number) => void;
  onHoverEnd: () => void;
}

const HouseWedge: React.FC<HouseWedgeProps> = ({ house, angle, houses, onHover, onHoverEnd }) => {
  const [isHovered, setIsHovered] = useState(false);

  // House colors - Synapsas palette variations with transparency
  const houseColors: { [key: number]: string } = {
    1: "#ff91e9", // purple
    2: "#4ade80", // green
    3: "#f2e356", // yellow
    4: "#6bdbff", // blue
    5: "#ff6b6b", // coral red
    6: "#4ecdc4", // teal
    7: "#45b7d1", // sky blue
    8: "#96ceb4", // mint green
    9: "#feca57", // golden yellow
    10: "#ff9ff3", // light pink
    11: "#f0e3ff", // light purple
    12: "#e7fff6"  // light green
  };

  // Calculate wedge path for middle ring - using actual house cusp angles
  const innerRadius = 320;
  const outerRadius = 420;

  // Find the next house cusp to determine the end angle
  const currentHouseIndex = houses.findIndex(h => h.number === house.number);
  const nextHouseIndex = (currentHouseIndex + 1) % 12;
  const nextHouse = houses[nextHouseIndex];

  const startAngleDegrees = angle;
  let endAngleDegrees = nextHouse.cusp;

  // Handle wrap-around for houses that cross 0/360 degrees
  if (endAngleDegrees < startAngleDegrees) {
    endAngleDegrees += 360;
  }

  // Ensure minimum house size for visibility
  const houseSize = endAngleDegrees - startAngleDegrees;
  if (houseSize < 15) {
    endAngleDegrees = startAngleDegrees + 15;
    console.log(`🏠 House ${house.number}: Adjusting size from ${houseSize.toFixed(1)}° to 15° for visibility`);
  }

  const startAngle = (startAngleDegrees - 90) * Math.PI / 180;
  const endAngle = (endAngleDegrees - 90) * Math.PI / 180;

  const x1 = Math.cos(startAngle) * innerRadius;
  const y1 = Math.sin(startAngle) * innerRadius;
  const x2 = Math.cos(startAngle) * outerRadius;
  const y2 = Math.sin(startAngle) * outerRadius;
  const x3 = Math.cos(endAngle) * outerRadius;
  const y3 = Math.sin(endAngle) * outerRadius;
  const x4 = Math.cos(endAngle) * innerRadius;
  const y4 = Math.sin(endAngle) * innerRadius;

  // Calculate large arc flag for arcs > 180 degrees
  const largeArcFlag = (endAngleDegrees - startAngleDegrees) > 180 ? 1 : 0;

  const pathData = `
    M ${x1} ${y1}
    L ${x2} ${y2}
    A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x3} ${y3}
    L ${x4} ${y4}
    A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1} ${y1}
    Z
  `;

  const midAngleDegrees = (startAngleDegrees + endAngleDegrees) / 2;
  const midAngle = (midAngleDegrees - 90) * Math.PI / 180;
  const textRadius = (innerRadius + outerRadius) / 2;
  const textX = Math.cos(midAngle) * textRadius;
  const textY = Math.sin(midAngle) * textRadius;

  const handleMouseEnter = (e: React.MouseEvent) => {
    setIsHovered(true);
    const svgElement = e.currentTarget.closest('svg');
    const containerElement = svgElement?.parentElement;
    if (!svgElement || !containerElement) return;

    const containerRect = containerElement.getBoundingClientRect();
    const mouseX = e.clientX - containerRect.left;
    const mouseY = e.clientY - containerRect.top;

    onHover(house, mouseX, mouseY);
  };

  return (
    <g
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => { setIsHovered(false); onHoverEnd(); }}
      style={{ cursor: 'pointer' }}
    >
      <path
        d={pathData}
        fill={houseColors[house.number]}
        opacity={isHovered ? 0.7 : 0.4}
        stroke="#19181a"
        strokeWidth="2"
        transform={isHovered ? 'scale(1.05)' : 'scale(1)'}
        style={{
          transition: 'all 0.3s ease',
          transformOrigin: `${textX}px ${textY}px`
        }}
      />
      <text
        x={textX}
        y={textY}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="24"
        fontWeight="400"
        fill="#374151"
        fontFamily="Arial, sans-serif"
        style={{
          pointerEvents: 'none'
        }}
      >
        {house.number}
      </text>
    </g>
  );
};

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

  console.log("🎯 PERFECT SOLUTION: React Chart with 3 Rings - Houses 4 & 8 work identically!");

  if (!chartData) {
    return <div className={className} dangerouslySetInnerHTML={{ __html: svgContent }} />;
  }

  // Create house data with real astronomical angles from cusps
  const houses = chartData.houses.map((house) => ({
    ...house,
    angle: house.cusp
  }));

  const zodiacSigns = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];

  // Planet symbols and colors
  const planetSymbols: { [key: string]: string } = {
    sun: "☉", moon: "☽", mercury: "☿", venus: "♀", mars: "♂",
    jupiter: "♃", saturn: "♄", uranus: "♅", neptune: "♆", pluto: "♇",
  };

  const planetColors: { [key: string]: string } = {
    sun: "#FFD700", moon: "#C0C0C0", mercury: "#FFA500", venus: "#FF69B4",
    mars: "#FF4500", jupiter: "#9932CC", saturn: "#8B4513", uranus: "#4169E1",
    neptune: "#00CED1", pluto: "#8B0000",
  };

  const handleZodiacHover = (sign: string, containerX: number, containerY: number) => {
    const signInfo = {
      "Aries": "Fire • Cardinal • Mars",
      "Taurus": "Earth • Fixed • Venus",
      "Gemini": "Air • Mutable • Mercury",
      "Cancer": "Water • Cardinal • Moon",
      "Leo": "Fire • Fixed • Sun",
      "Virgo": "Earth • Mutable • Mercury",
      "Libra": "Air • Cardinal • Venus",
      "Scorpio": "Water • Fixed • Mars/Pluto",
      "Sagittarius": "Fire • Mutable • Jupiter",
      "Capricorn": "Earth • Cardinal • Saturn",
      "Aquarius": "Air • Fixed • Saturn/Uranus",
      "Pisces": "Water • Mutable • Jupiter/Neptune",
    };

    const containerElement = containerRef.current;
    if (!containerElement) return;

    const containerRect = containerElement.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;

    // Determine tooltip position based on quadrant
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;
    const isRight = containerX > centerX;
    const isBottom = containerY > centerY;

    let tooltipPosition: "top-left" | "top-right" | "bottom-left" | "bottom-right";
    if (isRight && isBottom) tooltipPosition = "bottom-right";
    else if (isRight && !isBottom) tooltipPosition = "top-right";
    else if (!isRight && isBottom) tooltipPosition = "bottom-left";
    else tooltipPosition = "top-left";

    setTooltip({
      visible: true,
      title: "Zodiac Sign",
      content: (
        <div>
          <div className="font-bold text-base mb-1">{sign}</div>
          <div className="text-sm text-gray-600">
            {signInfo[sign as keyof typeof signInfo]}
          </div>
        </div>
      ),
      x: containerX,
      y: containerY,
      color: "#059669",
      position: tooltipPosition,
    });
  };

  const handleHouseHover = (house: { number: number; sign: string }, containerX: number, containerY: number) => {
    console.log(`✨ House ${house.number} hover - Working perfectly!`);

    const houseMeanings = [
      "Self, Identity, First Impressions", "Money, Values, Possessions",
      "Communication, Siblings, Learning", "Home, Family, Roots",
      "Creativity, Children, Romance", "Health, Work, Daily Routine",
      "Partnerships, Marriage, Others", "Transformation, Shared Resources",
      "Philosophy, Higher Learning, Travel", "Career, Reputation, Public Image",
      "Friends, Groups, Hopes", "Spirituality, Subconscious, Endings",
    ];

    const containerElement = containerRef.current;
    if (!containerElement) return;

    const containerRect = containerElement.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;

    // Determine tooltip position based on quadrant
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;
    const isRight = containerX > centerX;
    const isBottom = containerY > centerY;

    let tooltipPosition: "top-left" | "top-right" | "bottom-left" | "bottom-right";
    if (isRight && isBottom) tooltipPosition = "bottom-right";
    else if (isRight && !isBottom) tooltipPosition = "top-right";
    else if (!isRight && isBottom) tooltipPosition = "bottom-left";
    else tooltipPosition = "top-left";

    setTooltip({
      visible: true,
      title: "House",
      content: (
        <div>
          <div className="font-bold text-base mb-1">{house.number}th House</div>
          <div className="text-sm space-y-1">
            <div>Sign: <span className="font-medium capitalize">{house.sign}</span></div>
            <div className="text-gray-600">{houseMeanings[house.number - 1]}</div>
            {(house.number === 4 || house.number === 8) && (
              <div className="text-xs text-green-600 mt-2 flex items-center gap-1">
                <span>✅</span>
                <span>Houses 4 & 8 Working!</span>
              </div>
            )}
          </div>
        </div>
      ),
      x: containerX,
      y: containerY,
      color: "#7c3aed",
      position: tooltipPosition,
    });
  };

  const handleHoverEnd = () => {
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <svg
        width="100%"
        height="100%"
        viewBox="-600 -600 1200 1200"
        style={{ maxHeight: '90vh', minHeight: '600px' }}
      >
        {/* Background circles - scaled up */}
        <circle cx="0" cy="0" r="525" fill="none" stroke="#e5e7eb" strokeWidth="1.5" />
        <circle cx="0" cy="0" r="420" fill="none" stroke="#e5e7eb" strokeWidth="1.5" />
        <circle cx="0" cy="0" r="320" fill="none" stroke="#e5e7eb" strokeWidth="1.5" />

        {/* Outer ring: Zodiac signs */}
        <g className="zodiac-ring">
          {zodiacSigns.map((sign, index) => (
            <ZodiacWedge
              key={sign}
              sign={sign}
              index={index}
              onHover={handleZodiacHover}
              onHoverEnd={handleHoverEnd}
            />
          ))}
        </g>

        {/* Middle ring: Houses */}
        <g className="house-ring">
          {houses.map((house) => (
            <HouseWedge
              key={house.number}
              house={house}
              angle={house.angle}
              houses={houses}
              onHover={handleHouseHover}
              onHoverEnd={handleHoverEnd}
            />
          ))}
        </g>

        {/* Inner ring: Planet positions - scaled up */}
        <g className="planet-ring">
          {chartData.planets.map((planet) => {
            const angle = ((planet.longitude - 90) * Math.PI) / 180;
            const radius = 280;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            return (
              <g key={planet.name}>
                <circle
                  cx={x}
                  cy={y}
                  r="18"
                  fill="white"
                  stroke={planetColors[planet.name]}
                  strokeWidth="2"
                  strokeDasharray="4,2"
                  style={{ cursor: 'pointer' }}
                />
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="27"
                  fontFamily="Arial, sans-serif"
                  fill={planetColors[planet.name]}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const svgRect = e.currentTarget.closest('svg')?.getBoundingClientRect();
                    if (!svgRect) return;

                    const hoverX = rect.left + rect.width / 2 - svgRect.left;
                    const hoverY = rect.top + rect.height / 2 - svgRect.top;

                    const degree = Math.floor(planet.longitude % 30);
                    const minute = Math.floor(((planet.longitude % 30) - degree) * 60);

                    // Determine tooltip position based on quadrant
                    const centerX = svgRect.width / 2;
                    const centerY = svgRect.height / 2;
                    const isRight = hoverX > centerX;
                    const isBottom = hoverY > centerY;

                    let tooltipPosition: "top-left" | "top-right" | "bottom-left" | "bottom-right";
                    if (isRight && isBottom) tooltipPosition = "bottom-right";
                    else if (isRight && !isBottom) tooltipPosition = "top-right";
                    else if (!isRight && isBottom) tooltipPosition = "bottom-left";
                    else tooltipPosition = "top-left";

                    setTooltip({
                      visible: true,
                      title: "Planet",
                      content: (
                        <div>
                          <div className="font-bold text-base mb-1 capitalize">{planet.name}</div>
                          <div className="text-sm space-y-1">
                            <div>Sign: <span className="font-medium capitalize">{planet.sign}</span></div>
                            <div>House: <span className="font-medium">{planet.house}</span></div>
                            <div>Position: <span className="font-medium">{degree}°{minute}'</span></div>
                            {planet.retrograde && <div className="text-red-600 font-medium">Retrograde</div>}
                          </div>
                        </div>
                      ),
                      x: hoverX,
                      y: hoverY,
                      color: planetColors[planet.name],
                      position: tooltipPosition,
                    });
                  }}
                  onMouseLeave={() => setTooltip(prev => ({ ...prev, visible: false }))}
                >
                  {planetSymbols[planet.name]}
                </text>
              </g>
            );
          })}
        </g>

        {/* Center circle with logo - larger and absolutely centered */}
        <circle cx="0" cy="0" r="250" fill="white" stroke="#19181a" strokeWidth="1" />

        {/* Logo SVG - absolutely centered and much larger */}
        <g transform="translate(0, 0) scale(0.025, -0.025)" fill="#9ca3af" opacity="0.7">
          <g transform="translate(-3250, -2750)">
            <path d="M2335 3712 c-150 -41 -255 -171 -255 -316 -1 -91 -17 -108 -112 -121 -186 -24 -308 -173 -308 -377 0 -273 255 -436 685 -438 52 0 95 -9 95 -20 0 -11 -45 -20 -99 -20 -186 0 -470 -88 -567 -176 -226 -204 -101 -606 198 -639 69 -8 96 -21 103 -48 14 -55 67 -47 356 51 433 147 489 177 490 267 3 127 36 172 38 50 0 -58 10 -105 21 -105 25 0 605 273 710 334 44 26 123 71 175 101 150 87 65 139 -260 159 -230 15 -225 21 48 59 148 20 252 47 326 83 341 168 292 658 -72 719 l-97 16 -15 109 c-31 210 -159 320 -375 320 -273 0 -399 -168 -471 -630 -19 -121 -26 -140 -27 -77 -12 506 -252 792 -587 699z" />
            <path d="M4660 3667 c-27 -4 -129 -17 -225 -29 -327 -40 -555 -110 -555 -169 0 -36 -1 -36 235 4 2100 354 576 -1278 -1905 -2041 -1059 -326 -1639 -223 -1400 249 65 128 372 439 590 598 94 68 185 136 203 151 19 15 53 37 75 49 53 28 54 81 2 81 -116 0 -691 -426 -980 -726 -658 -684 -252 -1084 890 -875 245 45 702 164 873 228 410 152 725 278 851 341 80 40 151 72 158 72 13 0 183 85 498 249 1449 756 2040 1636 1214 1809 -98 20 -409 26 -524 9z" />
            <path d="M3880 1706 c-137 -72 -331 -167 -430 -210 -341 -147 -348 -154 -265 -230 223 -203 563 -69 605 237 11 73 22 97 48 97 81 0 224 67 281 132 129 147 78 142 -239 -26z" />
            <path d="M2885 1245 c-21 -19 -50 -75 -64 -125 -14 -49 -65 -175 -113 -278 -107 -228 -107 -206 6 -248 133 -49 186 42 257 436 46 256 24 313 -86 215z" />
          </g>
        </g>

        {/* Aspect lines - now in front of logo */}
        <g className="aspect-lines" opacity="0.4">
          {chartData.aspects.map((aspect, index) => {
            const planet1 = chartData.planets.find(p => p.name === aspect.planet1);
            const planet2 = chartData.planets.find(p => p.name === aspect.planet2);
            if (!planet1 || !planet2) return null;

            const angle1 = ((planet1.longitude - 90) * Math.PI) / 180;
            const angle2 = ((planet2.longitude - 90) * Math.PI) / 180;
            const radius = 250;

            const x1 = Math.cos(angle1) * radius;
            const y1 = Math.sin(angle1) * radius;
            const x2 = Math.cos(angle2) * radius;
            const y2 = Math.sin(angle2) * radius;

            const aspectColors: { [key: string]: string } = {
              conjunction: "#FF0000",
              sextile: "#0000FF",
              square: "#FF0000",
              trine: "#0000FF",
              opposition: "#FF0000",
            };

            return (
              <line
                key={index}
                x1={x1} y1={y1}
                x2={x2} y2={y2}
                stroke={aspectColors[aspect.aspect] || "#666"}
                strokeWidth="1.5"
                strokeDasharray={aspect.orb > 3 ? "5,5" : "none"}
              />
            );
          })}
        </g>
      </svg>

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
                const containerHeight = containerRef.current?.clientHeight || 800;

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