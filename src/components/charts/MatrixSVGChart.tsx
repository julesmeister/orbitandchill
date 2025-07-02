/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { getArcanaInfo } from '../../utils/arcanaInfo';
import { getAgeConnections, getMainCircleAges } from '../../utils/ageConnections';
import { getAgeLabelProps } from '../../utils/ageLabels';
import { createElementPosition, getElementLabel } from '../../utils/matrixElementDefinitions';
import { MatrixCalculation } from '../../utils/matrixCalculations';
import { calculateAgeDestinyArcana } from '../../utils/ageDestinyCalculations';
import MatrixCircleElement from './MatrixCircleElement';
import { MatrixLine, MATRIX_LINE_STYLES } from '../../utils/matrixLineUtils';
import { ResponsiveValues, DebugPositions } from './MatrixTypes';

interface MatrixSVGChartProps {
  matrixData: MatrixCalculation;
  ageDestinyMap: Record<string, number>;
  responsive: ResponsiveValues;
  positions: Record<string, { x: number; y: number }>;
  updatedDebugPositions: DebugPositions;
  dimensions: { width: number; height: number };
  selectedPosition: string | null;
  hoveredPosition: string | null;
  setSelectedPosition: (position: string | null) => void;
  isDragging: string | null;
  handleMouseEnter: (id: string, position: any, e: React.MouseEvent) => void;
  handleMouseLeave: () => void;
  handleClick: (id: string, positionData?: any) => void;
  handleDragStart: (elementId: string, e: React.MouseEvent) => void;
  handleDragMove: (e: React.MouseEvent) => void;
  handleDragEnd: () => void;
}

const MatrixSVGChart: React.FC<MatrixSVGChartProps> = ({
  matrixData,
  ageDestinyMap,
  responsive,
  positions,
  updatedDebugPositions,
  dimensions,
  selectedPosition,
  hoveredPosition,
  setSelectedPosition,
  isDragging,
  handleMouseEnter,
  handleMouseLeave,
  handleClick,
  handleDragStart,
  handleDragMove,
  handleDragEnd
}) => {

  return (
    <svg
      viewBox="0 -100 700 850"
      width={dimensions.width}
      height={dimensions.height}
      className="octagram-chart w-full max-w-none"
      style={{ minHeight: '900px', minWidth: '900px', maxHeight: '95vh' }}
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
    >
      {/* Background elements */}
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Octagram structure - Diagonal Square (Rhombus) */}
      <polygon
        points={`${positions.A.x},${positions.A.y} ${positions.B.x},${positions.B.y} ${positions.C.x},${positions.C.y} ${positions.D.x},${positions.D.y}`}
        fill="none"
        stroke="#000000"
        strokeWidth="1"
        opacity="0.3"
      />

      {/* Straight Square */}
      <polygon
        points={`${positions.F.x},${positions.F.y} ${positions.G.x},${positions.G.y} ${positions.H.x},${positions.H.y} ${positions.I.x},${positions.I.y}`}
        fill="none"
        stroke="#000000"
        strokeWidth="1"
        opacity="0.3"
      />

      {/* Connection lines to centers */}
      {Object.entries(positions).filter(([key]) => key !== 'E' && key !== 'J').map(([key, pos]) => (
        <line
          key={`center-line-${key}`}
          x1={pos.x}
          y1={pos.y}
          x2={responsive.centerX}
          y2={responsive.centerY}
          stroke="#000000"
          strokeWidth="0.5"
          opacity="0.2"
        />
      ))}

      {/* Sky Line (vertical axis) - emphasized */}
      <MatrixLine
        from={positions.B}
        to={positions.D}
        {...MATRIX_LINE_STYLES.axis}
      />

      {/* Earth Line (horizontal axis) - emphasized */}
      <MatrixLine
        from={positions.A}
        to={positions.C}
        {...MATRIX_LINE_STYLES.axis}
      />

      {/* Love Line (horizontal - A to C) */}
      <MatrixLine
        from={positions.A}
        to={positions.C}
        {...MATRIX_LINE_STYLES.love}
        className="love-line"
      />

      {/* Money Line (vertical - B to D) */}
      <MatrixLine
        from={positions.B}
        to={positions.D}
        {...MATRIX_LINE_STYLES.money}
        className="money-line"
      />

      {/* DEBUG: Draggable diagonal line from J (Past Life Mistakes) to N (Past Life Income) */}
      <line
        x1={responsive.centerX + updatedDebugPositions.diagonal.x1}
        y1={responsive.centerY + updatedDebugPositions.diagonal.y1}
        x2={responsive.centerX + updatedDebugPositions.diagonal.x2}
        y2={responsive.centerY + updatedDebugPositions.diagonal.y2}
        stroke="#888888"
        strokeWidth="2"
        strokeDasharray="5,5"
        opacity="0.4"
        style={{ cursor: isDragging === 'diagonal' ? 'grabbing' : 'grab' }}
        onMouseDown={(e) => handleDragStart('diagonal', e)}
      />

      {/* Diagonal generational lines with labels */}
      {/* Female Generational Line (Bottom-left to Top-right) */}
      <g>
        <line
          x1={positions.I.x}
          y1={positions.I.y}
          x2={positions.G.x}
          y2={positions.G.y}
          stroke="#ff0000"
          strokeWidth="2"
          opacity="0.8"
        />

        {/* Female Generational Line Label */}
        <text
          x={positions.I.x + (positions.G.x - positions.I.x) * 0.68}
          y={positions.I.y + (positions.G.y - positions.I.y) * 0.68 + 12}
          textAnchor="middle"
          dominantBaseline="central"
          className="pointer-events-none select-none font-space-grotesk"
          fontSize="10"
          fontFamily="Space Grotesk, system-ui, -apple-system, sans-serif"
          fill="#000000"
          opacity="0.7"
          transform={`rotate(-45 ${positions.I.x + (positions.G.x - positions.I.x) * 0.68} ${positions.I.y + (positions.G.y - positions.I.y) * 0.68 + 12})`}
        >
          female generational line
        </text>
      </g>

      {/* Male Generational Line (Top-left to Bottom-right) */}
      <g>
        <line
          x1={positions.F.x}
          y1={positions.F.y}
          x2={positions.H.x}
          y2={positions.H.y}
          stroke="#0000ff"
          strokeWidth="2"
          opacity="0.8"
        />

        {/* Male Generational Line Label */}
        <text
          x={positions.F.x + (positions.H.x - positions.F.x) * 0.35}
          y={positions.F.y + (positions.H.y - positions.F.y) * 0.35 - 12}
          textAnchor="middle"
          dominantBaseline="central"
          className="pointer-events-none select-none font-space-grotesk"
          fontSize="10"
          fontFamily="Space Grotesk, system-ui, -apple-system, sans-serif"
          fill="#000000"
          opacity="0.7"
          transform={`rotate(45 ${positions.F.x + (positions.H.x - positions.F.x) * 0.35} ${positions.F.y + (positions.H.y - positions.F.y) * 0.35 - 12})`}
        >
          male generational line
        </text>
      </g>

      {/* Outer circle connections with age dots */}
      {(() => {
        const ageConnections = getAgeConnections();
        const connections = ageConnections.map(conn => ({
          from: positions[conn.from],
          to: positions[conn.to],
          ages: conn.ages,
          ageBrackets: conn.ageBrackets,
          phase: conn.phase
        }));

        return connections.map((connection, index) => (
          <g key={`connection-${index}`}>
            {/* Base line */}
            <line
              x1={connection.from.x}
              y1={connection.from.y}
              x2={connection.to.x}
              y2={connection.to.y}
              stroke="#000000"
              strokeWidth="0.5"
              opacity="0.25"
            />

            {/* Age dots */}
            {connection.ages.map((ageCode, ageIndex) => {
              // Move dots much further from circles by adjusting progress
              const totalSegments = connection.ages.length + 1;
              const segmentLength = 1 / totalSegments;
              const buffer = segmentLength * 1.5; // 150% buffer from circles - maximum space
              const availableLength = 1 - (2 * buffer); // Space available for dots
              const dotSpacing = availableLength / connection.ages.length;
              const adjustedProgress = buffer + (ageIndex * dotSpacing) + (dotSpacing * 0.5);

              const x = connection.from.x + (connection.to.x - connection.from.x) * adjustedProgress;
              const y = connection.from.y + (connection.to.y - connection.from.y) * adjustedProgress;

              // Get destiny arcana for this age code
              const destinyArcana = ageDestinyMap[ageCode];
              const arcanaInfo = destinyArcana ? getArcanaInfo(destinyArcana) : null;

              // Get age bracket display for this age
              const ageBracket = connection.ageBrackets?.[ageIndex];

              // Calculate label position based on dot's position relative to center
              const centerX = responsive.centerX;
              const centerY = responsive.centerY;
              const isLeft = x < centerX;
              const isTop = y < centerY;

              // Offset labels from dot based on position
              const outwardOffsetX = isLeft ? -responsive.ageDot.labelOffset : responsive.ageDot.labelOffset;
              const outwardOffsetY = isTop ? -responsive.ageDot.labelOffset * 0.5 : responsive.ageDot.labelOffset * 0.5;

              // Inward offset (closer to center) for age bracket labels
              const inwardOffsetX = isLeft ? responsive.ageDot.labelOffset * 0.5 : -responsive.ageDot.labelOffset * 0.5;
              const inwardOffsetY = isTop ? responsive.ageDot.labelOffset * 0.3 : -responsive.ageDot.labelOffset * 0.3;

              return (
                <g key={`age-${ageCode}`}>
                  {/* Age dot with destiny arcana color and hover functionality */}
                  <circle
                    cx={x}
                    cy={y}
                    r={responsive.ageDot.radius}
                    fill={arcanaInfo?.color || "#000000"}
                    stroke="#000000"
                    strokeWidth="0.5"
                    opacity="0.7"
                    className="cursor-pointer hover:opacity-90 transition-opacity"
                    onMouseEnter={(e) => destinyArcana && handleMouseEnter(`AGE_${ageCode}`, {
                      x,
                      y,
                      id: `AGE_${ageCode}`,
                      label: `Age ${ageBracket?.display || ageCode} - Destiny`,
                      type: 'age-destiny',
                      number: destinyArcana,
                      ageCode: ageCode,
                      ageBracket: ageBracket
                    }, e)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleClick(`AGE_${ageCode}`, {
                      x,
                      y,
                      id: `AGE_${ageCode}`,
                      label: `Age ${ageBracket?.display || ageCode} - Destiny`,
                      type: 'age-destiny',
                      number: destinyArcana,
                      ageCode: ageCode,
                      ageBracket: ageBracket
                    })}
                  />

                  {/* Destiny arcana number - outward (clear and visible) */}
                  {destinyArcana && (
                    <text
                      x={x + outwardOffsetX}
                      y={y + outwardOffsetY}
                      textAnchor={isLeft ? "end" : "start"}
                      dominantBaseline="central"
                      className="pointer-events-none select-none font-bold"
                      fontSize={responsive.ageDot.fontSize}
                      fontFamily="system-ui, -apple-system, sans-serif"
                      fill="#000000"
                      opacity="0.9"
                    >
                      {destinyArcana}
                    </text>
                  )}

                  {/* Age bracket label - inward (closer to center) */}
                  {ageBracket && (
                    <text
                      x={x + inwardOffsetX}
                      y={y + inwardOffsetY}
                      textAnchor={isLeft ? "start" : "end"}
                      dominantBaseline="central"
                      className="pointer-events-none select-none"
                      fontSize={Math.max(5, responsive.ageDot.fontSize - 2)}
                      fontFamily="system-ui, -apple-system, sans-serif"
                      fill="#666666"
                      opacity="0.8"
                    >
                      {ageBracket.display}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        ));
      })()}

      {/* Heart/Wishes Position - Power of Ancestors - responsive positioning */}
      <MatrixCircleElement
        x={responsive.centerX + updatedDebugPositions.POWER_OF_ANCESTORS!.x}
        y={responsive.centerY + updatedDebugPositions.POWER_OF_ANCESTORS!.y}
        radius={responsive.innerElements.heart.radius}
        fill={getArcanaInfo(matrixData.innerElements.heart).color}
        number={matrixData.innerElements.heart}
        fontSize="18"
        id="POWER_OF_ANCESTORS"
        label={getElementLabel("POWER_OF_ANCESTORS")}
        type="center"
        selectedPosition={selectedPosition}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      />

      {/* Additional Inner Circle Elements */}
      {/* Heart's Desire Position - Above comfort zone */}
      <MatrixCircleElement
        x={responsive.centerX + responsive.innerElements.talent.offsetX}
        y={responsive.centerY + responsive.innerElements.talent.offsetY}
        radius={responsive.innerElements.talent.radius}
        fill={getArcanaInfo(matrixData.innerElements.talent).color}
        number={matrixData.innerElements.talent}
        fontSize="14"
        id="TALENT"
        label={getElementLabel("TALENT")}
        type="center"
        selectedPosition={selectedPosition}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      />

      {/* Guard/Blockage Position - Left on vertical line */}
      <g>
        <circle
          cx={responsive.centerX + updatedDebugPositions.FUTURE_CHILDREN!.x}
          cy={responsive.centerY + updatedDebugPositions.FUTURE_CHILDREN!.y}
          r={responsive.innerElements.guard.radius}
          fill={getArcanaInfo(matrixData.innerElements.guard).color}
          stroke="#000"
          strokeWidth="1"
          className="cursor-pointer transition-all duration-200"
          onMouseEnter={(e) => handleMouseEnter('FUTURE_CHILDREN', createElementPosition(
            'FUTURE_CHILDREN',
            responsive.centerX + updatedDebugPositions.FUTURE_CHILDREN!.x,
            responsive.centerY + updatedDebugPositions.FUTURE_CHILDREN!.y,
            matrixData.innerElements.guard
          ), e)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick('FUTURE_CHILDREN')}
        />
        <text
          x={responsive.centerX + updatedDebugPositions.FUTURE_CHILDREN!.x}
          y={responsive.centerY + updatedDebugPositions.FUTURE_CHILDREN!.y}
          textAnchor="middle"
          dominantBaseline="central"
          className="font-bold text-black pointer-events-none select-none"
          fontSize="12"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          {matrixData.innerElements.guard}
        </text>
      </g>

      {/* Earth Purpose Position - Between Guardian and Comfort Zone */}
      <g>
        <circle
          cx={responsive.centerX + responsive.innerElements.earthPurpose.offsetX}
          cy={responsive.centerY + responsive.innerElements.earthPurpose.offsetY}
          r={responsive.innerElements.earthPurpose.radius}
          fill={getArcanaInfo(matrixData.innerElements.earthPurpose).color}
          stroke="#000"
          strokeWidth="1"
          className="cursor-pointer transition-all duration-200"
          onMouseEnter={(e) => handleMouseEnter('HEART_WISHES', createElementPosition(
            'HEART_WISHES',
            responsive.centerX + responsive.innerElements.earthPurpose.offsetX,
            responsive.centerY + responsive.innerElements.earthPurpose.offsetY,
            matrixData.innerElements.earthPurpose
          ), e)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick('HEART_WISHES')}
        />
        <text
          x={responsive.centerX + responsive.innerElements.earthPurpose.offsetX}
          y={responsive.centerY + responsive.innerElements.earthPurpose.offsetY}
          textAnchor="middle"
          dominantBaseline="central"
          className="font-bold text-black pointer-events-none select-none"
          fontSize="11"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          {matrixData.innerElements.earthPurpose}
        </text>
      </g>

      {/* Matrix Inner Elements - Following Reference Implementation */}

      {/* Medium Circles - Secondary Powers */}
      {/* O Point - Left Inner (As a Parent) - moved closer to reputation */}
      <MatrixCircleElement
        x={responsive.centerX + updatedDebugPositions.O.x}
        y={responsive.centerY + updatedDebugPositions.O.y}
        radius={18}
        fill={getArcanaInfo(matrixData.positions.O).color}
        number={matrixData.positions.O}
        fontSize="16"
        id="O"
        label="As a Parent"
        type="center"
        selectedPosition={selectedPosition}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      />

      {/* P Point - Top Inner (Higher Self) - moved closer to inspiration */}
      <MatrixCircleElement
        x={responsive.centerX + updatedDebugPositions.P.x}
        y={responsive.centerY + updatedDebugPositions.P.y}
        radius={18}
        fill={getArcanaInfo(matrixData.positions.P).color}
        number={matrixData.positions.P}
        fontSize="16"
        id="P"
        label="Higher Self"
        type="center"
        selectedPosition={selectedPosition}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      />

      {/* Q Point - Right Inner (Past Life Money Mindset) - moved closer to money block */}
      <MatrixCircleElement
        x={responsive.centerX + updatedDebugPositions.Q.x}
        y={responsive.centerY + updatedDebugPositions.Q.y}
        radius={18}
        fill={getArcanaInfo(matrixData.positions.Q).color}
        number={matrixData.positions.Q}
        fontSize="16"
        id="Q"
        label="Past Life Money Mindset"
        type="center"
        selectedPosition={selectedPosition}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      />

      {/* R Point - Bottom Inner (Present Life Task) - moved closer to karmic */}
      <MatrixCircleElement
        x={responsive.centerX + updatedDebugPositions.R.x}
        y={responsive.centerY + updatedDebugPositions.R.y}
        radius={18}
        fill={getArcanaInfo(matrixData.positions.R).color}
        number={matrixData.positions.R}
        fontSize="16"
        id="R"
        label="Present Life Task"
        type="center"
        selectedPosition={selectedPosition}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      />

      {/* J Point - Past Life Mistakes (positioned below center) */}
      <MatrixCircleElement
        x={responsive.centerX + updatedDebugPositions.J.x}
        y={responsive.centerY + updatedDebugPositions.J.y}
        radius={16}
        fill={getArcanaInfo(matrixData.centers.J).color}
        number={matrixData.centers.J}
        fontSize="14"
        id="J"
        label="Past Life Mistakes"
        type="center"
        selectedPosition={selectedPosition}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      />

      {/* Small Circles - Detailed Aspects */}

      {/* T Point - Top Middle (Self Expression) - responsive positioning */}
      <MatrixCircleElement
        x={responsive.centerX + updatedDebugPositions.T!.x}
        y={responsive.centerY + updatedDebugPositions.T!.y}
        radius={14}
        fill={getArcanaInfo(matrixData.positions.T).color}
        number={matrixData.positions.T}
        fontSize="12"
        id="T"
        label="Self Expression"
        type="center"
        selectedPosition={selectedPosition}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      />

      {/* DEBUG: N Point - Right Center (Past Life Income) */}
      <g
        style={{ cursor: isDragging === 'N' ? 'grabbing' : 'grab' }}
        onMouseDown={(e) => handleDragStart('N', e)}
      >
        <MatrixCircleElement
          x={responsive.centerX + updatedDebugPositions.N.x}
          y={responsive.centerY + updatedDebugPositions.N.y}
          radius={14}
          fill={getArcanaInfo(matrixData.positions.N).color}
          number={matrixData.positions.N}
          fontSize="12"
          id="N"
          label="Past Life Income"
          type="center"
          selectedPosition={selectedPosition}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
        />
      </g>

      {/* DEBUG: Relationship/Income Lines */}
      {/* K Point - Income Streams */}
      <g
        style={{ cursor: isDragging === 'K' ? 'grabbing' : 'grab' }}
        onMouseDown={(e) => handleDragStart('K', e)}
      >
        <MatrixCircleElement
          x={responsive.centerX + updatedDebugPositions.K.x}
          y={responsive.centerY + updatedDebugPositions.K.y}
          radius={14}
          fill={getArcanaInfo(matrixData.positions.K).color}
          number={matrixData.positions.K}
          fontSize="12"
          id="K"
          label="Income Streams"
          type="center"
          selectedPosition={selectedPosition}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
        />

        {/* Dollar sign icon above Income Streams Position K */}
        <g transform={`translate(${responsive.centerX + updatedDebugPositions.K.x}, ${responsive.centerY + updatedDebugPositions.K.y - 25})`}>
          <text
            x="0"
            y="2"
            fontSize="16"
            fontWeight="bold"
            fill="#22c55e"
            stroke="#16a34a"
            strokeWidth="0.5"
            textAnchor="middle"
            opacity="0.9"
          >
            $
          </text>
        </g>
      </g>

      {/* L Point - Work Life Balance */}
      <g
        style={{ cursor: isDragging === 'L' ? 'grabbing' : 'grab' }}
        onMouseDown={(e) => handleDragStart('L', e)}
      >
        <MatrixCircleElement
          x={responsive.centerX + updatedDebugPositions.L.x}
          y={responsive.centerY + updatedDebugPositions.L.y}
          radius={14}
          fill={getArcanaInfo(matrixData.positions.L).color}
          number={matrixData.positions.L}
          fontSize="12"
          id="L"
          label="Work Life Balance"
          type="center"
          selectedPosition={selectedPosition}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
        />
      </g>

      {/* M Point - Ingredients for Love */}
      <g
        style={{ cursor: isDragging === 'M' ? 'grabbing' : 'grab' }}
        onMouseDown={(e) => handleDragStart('M', e)}
      >
        <MatrixCircleElement
          x={responsive.centerX + updatedDebugPositions.M.x}
          y={responsive.centerY + updatedDebugPositions.M.y}
          radius={14}
          fill={getArcanaInfo(matrixData.positions.M).color}
          number={matrixData.positions.M}
          fontSize="12"
          id="M"
          label="Ingredients for Love"
          type="center"
          selectedPosition={selectedPosition}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
        />

        {/* Heart icon above Ingredients for Love Position M */}
        <g transform={`translate(${responsive.centerX + updatedDebugPositions.M.x}, ${responsive.centerY + updatedDebugPositions.M.y - 30})`}>
          <path
            d="M0,-4 C-3,-7 -8,-7 -8,-2 C-8,2 0,8 0,8 C0,8 8,2 8,-2 C8,-7 3,-7 0,-4 Z"
            fill="#e91e63"
            stroke="#e91e63"
            strokeWidth="0.5"
            opacity="0.8"
          />
        </g>
      </g>

      {/* Position circles */}
      {Object.entries(positions).map(([key, pos]) => {
        if (key === 'J') return null; // Skip past life mistakes as it overlaps with comfort zone
        if (['F1', 'F2', 'G1', 'G2', 'H1', 'H2', 'I1', 'I2'].includes(key)) return null; // Skip inner generational circles - rendered separately

        const number = matrixData.positions[key];
        if (!number || number === undefined) return null; // Skip if number is invalid

        const arcana = getArcanaInfo(number);
        const isSelected = selectedPosition === key;
        const isHovered = hoveredPosition === key;
        const isCenter = key === 'E';

        const circleRadius = isCenter ? responsive.circleRadius.center : responsive.circleRadius.outer;
        const strokeWidth = isSelected ? 3 : isHovered ? 2 : 1;

        return (
          <g key={key}>

            {/* Position circle */}
            <circle
              cx={pos.x}
              cy={pos.y}
              r={circleRadius}
              fill={arcana.color}
              stroke="#000"
              strokeWidth={strokeWidth}
              filter={isHovered ? "url(#glow)" : undefined}
              className="cursor-pointer transition-all duration-200"
              style={{
                transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                transformOrigin: `${pos.x}px ${pos.y}px`
              }}
              onMouseEnter={(e) => handleMouseEnter(key, pos, e)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick(key)}
            />

            {/* Position number */}
            <text
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="central"
              className="font-bold text-black pointer-events-none select-none"
              fontSize={isCenter ? responsive.fontSize.center : responsive.fontSize.outer}
              fontFamily="system-ui, -apple-system, sans-serif"
            >
              {number}
            </text>

            {/* Age labels for outer positions */}
            {!isCenter && (() => {
              const mainCircleAges = getMainCircleAges();
              const ageData = mainCircleAges.find(a => a.position === key);
              if (!ageData) return null;

              const age = ageData.age.toString();
              const labelProps = getAgeLabelProps(key, pos.x, pos.y, age, circleRadius);

              return (
                <text
                  x={labelProps.x}
                  y={labelProps.y}
                  textAnchor={labelProps.textAnchor}
                  dominantBaseline="central"
                  className="pointer-events-none select-none"
                  fontSize="11"
                  fontFamily="system-ui, -apple-system, sans-serif"
                  fill="#000000"
                  opacity="0.8"
                  fontWeight="bold"
                >
                  {labelProps.age}
                </text>
              );
            })()}
          </g>
        );
      })}

      {/* F1, F2 - Male Generational Line Inner Circles */}
      <g
        style={{ cursor: isDragging === 'F1' ? 'grabbing' : 'grab' }}
        onMouseDown={(e) => handleDragStart('F1', e)}
      >
        <MatrixCircleElement
          x={responsive.centerX + updatedDebugPositions.F1.x}
          y={responsive.centerY + updatedDebugPositions.F1.y}
          radius={18}
          fill={getArcanaInfo(matrixData.positions.F1).color}
          number={matrixData.positions.F1}
          fontSize="10"
          id="F1"
          label="Dad's Talents"
          type="center"
          selectedPosition={selectedPosition}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
        />
      </g>

      <g
        style={{ cursor: isDragging === 'F2' ? 'grabbing' : 'grab' }}
        onMouseDown={(e) => handleDragStart('F2', e)}
      >
        <MatrixCircleElement
          x={responsive.centerX + updatedDebugPositions.F2.x}
          y={responsive.centerY + updatedDebugPositions.F2.y}
          radius={14}
          fill={getArcanaInfo(matrixData.positions.F2).color}
          number={matrixData.positions.F2}
          fontSize="10"
          id="F2"
          label="Dad's Talents"
          type="center"
          selectedPosition={selectedPosition}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
        />
      </g>

      {/* G1, G2 - Female Generational Line Inner Circles */}
      <g
        style={{ cursor: isDragging === 'G1' ? 'grabbing' : 'grab' }}
        onMouseDown={(e) => handleDragStart('G1', e)}
      >
        <MatrixCircleElement
          x={responsive.centerX + updatedDebugPositions.G1.x}
          y={responsive.centerY + updatedDebugPositions.G1.y}
          radius={18}
          fill={getArcanaInfo(matrixData.positions.G1).color}
          number={matrixData.positions.G1}
          fontSize="10"
          id="G1"
          label="Mom's Talents"
          type="center"
          selectedPosition={selectedPosition}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
        />
      </g>

      <g
        style={{ cursor: isDragging === 'G2' ? 'grabbing' : 'grab' }}
        onMouseDown={(e) => handleDragStart('G2', e)}
      >
        <MatrixCircleElement
          x={responsive.centerX + updatedDebugPositions.G2.x}
          y={responsive.centerY + updatedDebugPositions.G2.y}
          radius={14}
          fill={getArcanaInfo(matrixData.positions.G2).color}
          number={matrixData.positions.G2}
          fontSize="10"
          id="G2"
          label="Mom's Talents"
          type="center"
          selectedPosition={selectedPosition}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
        />
      </g>

      {/* H1, H2 - Male Generational Line Inner Circles */}
      <g
        style={{ cursor: isDragging === 'H1' ? 'grabbing' : 'grab' }}
        onMouseDown={(e) => handleDragStart('H1', e)}
      >
        <MatrixCircleElement
          x={responsive.centerX + updatedDebugPositions.H1.x}
          y={responsive.centerY + updatedDebugPositions.H1.y}
          radius={18}
          fill={getArcanaInfo(matrixData.positions.H1).color}
          number={matrixData.positions.H1}
          fontSize="10"
          id="H1"
          label="Mom's Karma"
          type="center"
          selectedPosition={selectedPosition}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
        />
      </g>

      <g
        style={{ cursor: isDragging === 'H2' ? 'grabbing' : 'grab' }}
        onMouseDown={(e) => handleDragStart('H2', e)}
      >
        <MatrixCircleElement
          x={responsive.centerX + updatedDebugPositions.H2.x}
          y={responsive.centerY + updatedDebugPositions.H2.y}
          radius={12}
          fill={getArcanaInfo(matrixData.positions.H2).color}
          number={matrixData.positions.H2}
          fontSize="10"
          id="H2"
          label="Mom's Karma"
          type="center"
          selectedPosition={selectedPosition}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
        />
      </g>

      {/* I1, I2 - Female Generational Line Inner Circles */}
      <g
        style={{ cursor: isDragging === 'I1' ? 'grabbing' : 'grab' }}
        onMouseDown={(e) => handleDragStart('I1', e)}
      >
        <MatrixCircleElement
          x={responsive.centerX + updatedDebugPositions.I1.x}
          y={responsive.centerY + updatedDebugPositions.I1.y}
          radius={18}
          fill={getArcanaInfo(matrixData.positions.I1).color}
          number={matrixData.positions.I1}
          fontSize="10"
          id="I1"
          label="Dad's Karma"
          type="center"
          selectedPosition={selectedPosition}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
        />
      </g>

      <g
        style={{ cursor: isDragging === 'I2' ? 'grabbing' : 'grab' }}
        onMouseDown={(e) => handleDragStart('I2', e)}
      >
        <MatrixCircleElement
          x={responsive.centerX + updatedDebugPositions.I2.x}
          y={responsive.centerY + updatedDebugPositions.I2.y}
          radius={14}
          fill={getArcanaInfo(matrixData.positions.I2).color}
          number={matrixData.positions.I2}
          fontSize="10"
          id="I2"
          label="Dad's Karma"
          type="center"
          selectedPosition={selectedPosition}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
        />
      </g>

      {/* V - Sexuality (keeping only this one) */}
      <g
        style={{ cursor: isDragging === 'V' ? 'grabbing' : 'grab' }}
        onMouseDown={(e) => handleDragStart('V', e)}
      >
        <MatrixCircleElement
          x={responsive.centerX + updatedDebugPositions.V.x}
          y={responsive.centerY + updatedDebugPositions.V.y}
          radius={14}
          fill={getArcanaInfo(matrixData.positions.V).color}
          number={matrixData.positions.V}
          fontSize="12"
          id="V"
          label="Sexuality"
          type="center"
          selectedPosition={selectedPosition}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
        />
      </g>


    </svg>
  );
};

export default MatrixSVGChart;