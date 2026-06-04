"use client";

import React from "react";

export const ChartBackground: React.FC<{ ascendantLongitude?: number }> = ({ ascendantLongitude = 0 }) => {
  const getChartCoordinates = (astroLongitude: number, radius: number) => {
    const relativeAngle = (astroLongitude - ascendantLongitude + 360) % 360;
    const finalAngleDegrees = (relativeAngle + 180) % 360;
    const angleRad = (finalAngleDegrees * Math.PI) / 180;
    const x = Math.cos(angleRad) * radius;
    const y = -Math.sin(angleRad) * radius;
    return { x, y };
  };

  const outerTicks = Array.from({ length: 360 }, (_, i) => {
    const eclipticLongitude = i;
    const tickColor = "#1F2937";

    let lineLength: number;
    let strokeWidth: number;
    if (i % 30 === 0) {
      lineLength = 20;
      strokeWidth = 3;
    } else if (i % 10 === 0) {
      lineLength = 12;
      strokeWidth = 2;
    } else if (i % 5 === 0) {
      lineLength = 7;
      strokeWidth = 1.5;
    } else {
      lineLength = 4;
      strokeWidth = 1;
    }

    const outerPos = getChartCoordinates(eclipticLongitude, 525);
    const innerPos = getChartCoordinates(eclipticLongitude, 525 - lineLength);

    return (
      <line
        key={`outer-tick-${i}`}
        x1={outerPos.x}
        y1={outerPos.y}
        x2={innerPos.x}
        y2={innerPos.y}
        stroke={tickColor}
        strokeWidth={strokeWidth}
        opacity={i % 30 === 0 ? 0.9 : i % 10 === 0 ? 0.7 : 0.5}
      />
    );
  });

  const innerTicks = Array.from({ length: 360 }, (_, i) => {
    const eclipticLongitude = i;
    const tickColor = "#1F2937";

    let lineLength: number;
    let strokeWidth: number;
    if (i % 30 === 0) {
      lineLength = 20;
      strokeWidth = 3;
    } else if (i % 10 === 0) {
      lineLength = 12;
      strokeWidth = 2;
    } else if (i % 5 === 0) {
      lineLength = 7;
      strokeWidth = 1.5;
    } else {
      lineLength = 4;
      strokeWidth = 1;
    }

    const outerPos = getChartCoordinates(eclipticLongitude, 420);
    const innerPos = getChartCoordinates(eclipticLongitude, 420 + lineLength);

    return (
      <line
        key={`inner-tick-${i}`}
        x1={outerPos.x}
        y1={outerPos.y}
        x2={innerPos.x}
        y2={innerPos.y}
        stroke={tickColor}
        strokeWidth={strokeWidth}
        opacity={i % 30 === 0 ? 0.9 : i % 10 === 0 ? 0.7 : 0.5}
      />
    );
  });

  return (
    <g>
      <circle cx="0" cy="0" r="525" fill="none" stroke="#333333" strokeWidth="2" />
      <circle cx="0" cy="0" r="420" fill="none" stroke="#333333" strokeWidth="2" />
      <circle cx="0" cy="0" r="255" fill="none" stroke="#374151" strokeWidth="1.5" />
      <circle cx="0" cy="0" r="210" fill="none" stroke="#374151" strokeWidth="1.5" />

      <g className="degree-markers-outer">
        {outerTicks}
      </g>
      <g className="degree-markers-inner">
        {innerTicks}
      </g>
    </g>
  );
};
