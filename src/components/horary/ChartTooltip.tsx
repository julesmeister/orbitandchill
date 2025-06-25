/**
 * ChartTooltip component with curved connector for horary charts
 */

import React from 'react';

export interface TooltipData {
  visible: boolean;
  content: React.ReactNode;
  title: string;
  x: number;
  y: number;
  color: string;
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

interface ChartTooltipProps {
  tooltip: TooltipData;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const ChartTooltip: React.FC<ChartTooltipProps> = ({
  tooltip,
  containerRef
}) => {
  if (!tooltip.visible) return null;

  return (
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
                tooltipX = 20 + 140;
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

      {/* Tooltip Box - Synapsas Design */}
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
        <div className="relative bg-white border-2 border-black min-w-[200px] max-w-[320px]">
          {/* Header Section */}
          <div
            className="px-4 py-3 border-b border-black"
            style={{ backgroundColor: tooltip.color || '#f2e356' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-black flex items-center justify-center">
                <div
                  className="w-3 h-3"
                  style={{ backgroundColor: 'white' }}
                />
              </div>
              <div className="font-space-grotesk text-sm font-bold text-black uppercase tracking-wide">
                {tooltip.title}
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="px-4 py-4 bg-white">
            <div className="text-black font-inter text-sm leading-relaxed">
              {tooltip.content}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};