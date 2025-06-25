"use client";

import React, { useState, useRef, useEffect } from 'react';

interface AdvancedTooltipProps {
  children: React.ReactNode;
  title?: string;
  content: string | React.ReactNode;
  position?: 'auto' | 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  showConnector?: boolean;
  connectorColor?: string;
  className?: string;
  containerClassName?: string;
}

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  position: 'left' | 'right' | 'top' | 'bottom';
  triggerRect: DOMRect | null;
}

export default function AdvancedTooltip({ 
  children, 
  title,
  content, 
  position = 'auto',
  delay = 300,
  showConnector = false,
  connectorColor = '#3b82f6',
  className = '',
  containerClassName = ''
}: AdvancedTooltipProps) {
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    position: 'bottom',
    triggerRect: null
  });
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const calculatePosition = (event?: MouseEvent | FocusEvent): TooltipState => {
    const triggerElement = triggerRef.current;
    const container = containerRef.current?.closest('.relative') || document.body;
    
    if (!triggerElement || !container) {
      return {
        visible: true,
        x: 0,
        y: 0,
        position: 'bottom',
        triggerRect: null
      };
    }

    const triggerRect = triggerElement.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    // Calculate relative position within container
    let relativeX, relativeY;
    
    if (event && 'clientX' in event && 'clientY' in event) {
      // MouseEvent
      relativeX = event.clientX - containerRect.left;
      relativeY = event.clientY - containerRect.top;
    } else {
      // FocusEvent or no event - use center of trigger element
      relativeX = triggerRect.left - containerRect.left + triggerRect.width / 2;
      relativeY = triggerRect.top - containerRect.top + triggerRect.height / 2;
    }
    
    let calculatedPosition: 'left' | 'right' | 'top' | 'bottom' = 'bottom';
    
    if (position === 'auto') {
      // Auto-calculate best position based on available space
      const spaceRight = containerRect.width - relativeX;
      const spaceLeft = relativeX;
      const spaceBottom = containerRect.height - relativeY;
      
      if (spaceRight > 200) {
        calculatedPosition = 'right';
      } else if (spaceLeft > 200) {
        calculatedPosition = 'left';
      } else if (spaceBottom > 100) {
        calculatedPosition = 'bottom';
      } else {
        calculatedPosition = 'top';
      }
    } else {
      calculatedPosition = position as 'left' | 'right' | 'top' | 'bottom';
    }

    return {
      visible: true,
      x: relativeX,
      y: relativeY,
      position: calculatedPosition,
      triggerRect: {
        ...triggerRect,
        x: triggerRect.x - containerRect.x,
        y: triggerRect.y - containerRect.y
      } as DOMRect
    };
  };

  const showTooltip = (event?: MouseEvent | FocusEvent) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const id = setTimeout(() => {
      const newTooltipState = calculatePosition(event);
      setTooltip(newTooltipState);
    }, delay);
    setTimeoutId(id);
  };

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  const getTooltipPosition = () => {
    if (!tooltip.triggerRect) return {};

    const offset = 20;
    
    switch (tooltip.position) {
      case 'right':
        return {
          left: tooltip.triggerRect.right + offset,
          top: tooltip.triggerRect.top + tooltip.triggerRect.height / 2,
          transform: 'translateY(-50%)'
        };
      case 'left':
        return {
          right: `calc(100% - ${tooltip.triggerRect.left - offset}px)`,
          top: tooltip.triggerRect.top + tooltip.triggerRect.height / 2,
          transform: 'translateY(-50%)'
        };
      case 'top':
        return {
          left: tooltip.triggerRect.left + tooltip.triggerRect.width / 2,
          bottom: `calc(100% - ${tooltip.triggerRect.top - offset}px)`,
          transform: 'translateX(-50%)'
        };
      case 'bottom':
      default:
        return {
          left: tooltip.triggerRect.left + tooltip.triggerRect.width / 2,
          top: tooltip.triggerRect.bottom + offset,
          transform: 'translateX(-50%)'
        };
    }
  };

  const getConnectorPath = () => {
    if (!tooltip.triggerRect || !showConnector) return '';

    const triggerCenterX = tooltip.triggerRect.left + tooltip.triggerRect.width / 2;
    const triggerCenterY = tooltip.triggerRect.top + tooltip.triggerRect.height / 2;
    
    const offset = 20;
    let tooltipX, tooltipY;

    switch (tooltip.position) {
      case 'right':
        tooltipX = tooltip.triggerRect.right + offset + 10;
        tooltipY = triggerCenterY;
        break;
      case 'left':
        tooltipX = tooltip.triggerRect.left - offset - 10;
        tooltipY = triggerCenterY;
        break;
      case 'top':
        tooltipX = triggerCenterX;
        tooltipY = tooltip.triggerRect.top - offset - 10;
        break;
      case 'bottom':
      default:
        tooltipX = triggerCenterX;
        tooltipY = tooltip.triggerRect.bottom + offset + 10;
    }

    let controlX, controlY;

    if (tooltip.position === 'right' || tooltip.position === 'left') {
      controlX = (triggerCenterX + tooltipX) / 2;
      controlY = triggerCenterY;
    } else {
      controlX = triggerCenterX;
      controlY = (triggerCenterY + tooltipY) / 2;
    }

    return `M ${triggerCenterX} ${triggerCenterY} Q ${controlX} ${controlY} ${tooltipX} ${tooltipY}`;
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-block ${containerClassName}`}
    >
      <div
        ref={triggerRef}
        className="cursor-help"
        onMouseEnter={(e) => showTooltip(e.nativeEvent)}
        onMouseLeave={hideTooltip}
        onFocus={(e) => showTooltip(e.nativeEvent)}
        onBlur={hideTooltip}
      >
        {children}
      </div>
      
      {tooltip.visible && tooltip.triggerRect && (
        <>
          {/* Connection Line (if enabled) */}
          {showConnector && (
            <svg 
              className="absolute top-0 left-0 w-full h-full pointer-events-none z-40"
              style={{ position: 'absolute' }}
            >
              <defs>
                <marker
                  id="tooltip-arrowhead"
                  markerWidth="8"
                  markerHeight="6"
                  refX="7"
                  refY="3"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <polygon
                    points="0 0, 8 3, 0 6"
                    fill={connectorColor}
                  />
                </marker>
              </defs>
              <path
                d={getConnectorPath()}
                stroke={connectorColor}
                strokeWidth="1.5"
                fill="none"
                markerEnd="url(#tooltip-arrowhead)"
                strokeDasharray="3,3"
              />
              <circle
                cx={tooltip.triggerRect.left + tooltip.triggerRect.width / 2}
                cy={tooltip.triggerRect.top + tooltip.triggerRect.height / 2}
                r="2"
                fill={connectorColor}
              />
            </svg>
          )}

          {/* Tooltip Box */}
          <div
            className={`absolute pointer-events-none z-50 ${className}`}
            style={getTooltipPosition()}
          >
            <div className="relative bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg rounded-lg min-w-[140px] max-w-[250px]">
              <div className="px-3 py-2.5">
                {title && (
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="text-gray-500 text-xs font-medium uppercase tracking-wide">
                      {title}
                    </div>
                  </div>
                )}
                <div className="text-gray-900 font-semibold text-sm leading-tight">
                  {content}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}