/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { AstrologicalEvent } from '../../store/eventsStore';
import { getPlanetaryDignity } from '../../utils/astrologicalInterpretations';

interface ScoreTooltipProps {
  children: React.ReactNode;
  event: AstrologicalEvent;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  simplified?: boolean; // For calendar tooltips without header/score section
  onToggleBookmark?: (eventId: string) => void;
}

export default function ScoreTooltip({ 
  children, 
  event, 
  position = 'top', 
  delay = 300,
  simplified = false,
  onToggleBookmark 
}: ScoreTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const showTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const id = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setTimeoutId(id);
  };

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-2';
      default:
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
    }
  };

  const getCaretClasses = () => {
    switch (position) {
      case 'top':
        return 'top-full left-1/2 transform -translate-x-1/2 -mt-[1px]';
      case 'bottom':
        return 'bottom-full left-1/2 transform -translate-x-1/2 -mb-[1px]';
      case 'left':
        return 'left-full top-1/2 transform -translate-y-1/2 -ml-[1px]';
      case 'right':
        return 'right-full top-1/2 transform -translate-y-1/2 -mr-[1px]';
      default:
        return 'top-full left-1/2 transform -translate-x-1/2 -mt-[1px]';
    }
  };

  const getCaretPath = () => {
    switch (position) {
      case 'top':
        return 'M0 0 L6 8 L12 0 Z'; // Points down from tooltip
      case 'bottom':
        return 'M0 8 L6 0 L12 8 Z'; // Points up from tooltip
      case 'left':
        return 'M0 0 L8 6 L0 12 Z'; // Points left from tooltip (toward trigger)
      case 'right':
        return 'M0 0 L8 6 L0 12 Z'; // Points left from tooltip
      default:
        return 'M0 0 L6 8 L12 0 Z'; // Points down from tooltip
    }
  };

  const getScoreRating = (score: number) => {
    if (score >= 9) return { label: 'Exceptional', color: 'text-emerald-600', bg: 'bg-emerald-50' };
    if (score >= 8) return { label: 'Excellent', color: 'text-emerald-600', bg: 'bg-emerald-50' };
    if (score >= 7) return { label: 'Very Good', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (score >= 6) return { label: 'Good', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (score >= 5) return { label: 'Average', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    if (score >= 4) return { label: 'Fair', color: 'text-orange-600', bg: 'bg-orange-50' };
    if (score >= 3) return { label: 'Poor', color: 'text-red-600', bg: 'bg-red-50' };
    return { label: 'Challenging', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const rating = getScoreRating(event.score);


  return (
    <div
      ref={triggerRef}
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      
      {isVisible && (
        <div className="absolute z-30" style={{ pointerEvents: 'none' }}>
          {/* Tooltip Container with Enhanced Shadow */}
          <div
            className={`absolute ${getPositionClasses()}`}
            style={{
              filter: 'drop-shadow(0 20px 25px rgba(0, 0, 0, 0.15)) drop-shadow(0 10px 10px rgba(0, 0, 0, 0.04))',
              pointerEvents: 'auto'
            }}
          >
            {/* Tooltip Body with Better Design */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 min-w-[280px] max-w-[320px]">
              {/* Header with Score (hidden for simplified calendar tooltips) */}
              {!simplified && (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                        event.title.includes('⚠️') ? 'bg-red-500' :
                        event.score >= 8 ? 'bg-emerald-500' :
                        event.score >= 6 ? 'bg-blue-500' :
                        'bg-slate-500'
                      }`}>
                        {event.score}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{event.score}/10</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">{event.type}</div>
                      </div>
                    </div>
                    {/* Bookmark Button */}
                    {onToggleBookmark && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleBookmark(event.id);
                        }}
                        className={`p-2 rounded-lg transition-all duration-200 cursor-pointer ${
                          event.isBookmarked
                            ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                            : 'bg-gray-100 text-gray-400 hover:text-gray-600 hover:bg-gray-200'
                        }`}
                        title={event.isBookmarked ? 'Remove bookmark' : 'Bookmark this event'}
                      >
                        <svg 
                          className="w-4 h-4" 
                          fill={event.isBookmarked ? 'currentColor' : 'none'} 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" 
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-100 my-3"></div>
                  
                  {/* Title Section */}
                  <div className="mb-3">
                    <div className="text-sm font-semibold text-gray-900 text-left max-w-[250px] break-words">{event.title}</div>
                  </div>
                </>
              )}

              {/* Bookmark button for simplified tooltips */}
              {simplified && onToggleBookmark && (
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-semibold text-gray-900 text-left max-w-[200px] truncate">{event.title}</div>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleBookmark(event.id);
                    }}
                    className={`p-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
                      event.isBookmarked
                        ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                        : 'bg-gray-100 text-gray-400 hover:text-gray-600 hover:bg-gray-200'
                    }`}
                    title={event.isBookmarked ? 'Remove bookmark' : 'Bookmark this event'}
                  >
                    <svg 
                      className="w-3 h-3" 
                      fill={event.isBookmarked ? 'currentColor' : 'none'} 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" 
                      />
                    </svg>
                  </div>
                </div>
              )}

              {/* Details */}
              <div className="space-y-3 text-left">
                {/* Aspects */}
                {event.aspects && event.aspects.length > 0 && (
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Aspects</div>
                    <div className="text-xs text-gray-700 leading-relaxed">
                      {(() => {
                        // Categorize aspects into harmonious, challenging, and neutral
                        const harmonious = ['trine', 'sextile', 'conjunction'].some(aspect => 
                          event.aspects.some(a => a.toLowerCase().includes(aspect))
                        );
                        const challenging = ['square', 'opposition', 'quincunx', 'semi-square', 'sesquiquadrate'].some(aspect => 
                          event.aspects.some(a => a.toLowerCase().includes(aspect))
                        );
                        
                        const harmoniousCount = event.aspects.filter(aspect => 
                          ['trine', 'sextile', 'conjunction'].some(type => aspect.toLowerCase().includes(type))
                        ).length;
                        
                        const challengingCount = event.aspects.filter(aspect => 
                          ['square', 'opposition', 'quincunx', 'semi-square', 'sesquiquadrate'].some(type => aspect.toLowerCase().includes(type))
                        ).length;
                        
                        const neutralCount = event.aspects.length - harmoniousCount - challengingCount;
                        
                        const summary = [];
                        if (harmoniousCount > 0) summary.push(`${harmoniousCount} harmonious`);
                        if (neutralCount > 0) summary.push(`${neutralCount} neutral`);
                        if (challengingCount > 0) summary.push(`${challengingCount} challenging`);
                        
                        return summary.length > 0 ? summary.join(', ') : `${event.aspects.length} aspects`;
                      })()}
                    </div>
                  </div>
                )}

                {/* Planetary Positions with Dignities */}
                {event.planetaryPositions && event.planetaryPositions.length > 0 && (() => {
                  // First, filter to only positions with dignities
                  const positionsWithDignities = event.planetaryPositions.filter(position => {
                    const planetSignMatch = position.match(/^([A-Za-z-]+)\s+in\s+([A-Za-z]+)(?:\s*\([^)]*\))?$/i);
                    if (planetSignMatch) {
                      const [, planetPart] = planetSignMatch;
                      const planets = planetPart.split('-');
                      return planets.some(planet => {
                        const dignity = getPlanetaryDignity(planet.toLowerCase().trim(), planetSignMatch[2].toLowerCase());
                        return dignity !== 'neutral';
                      });
                    }
                    return false;
                  });

                  // Only show the section if there are positions with dignities
                  if (positionsWithDignities.length === 0) {
                    return null;
                  }

                  return (
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Planetary Positions</div>
                      <div className="space-y-1">
                        {event.planetaryPositions.map((position, index) => {
                        // Parse various formats to check for dignity
                        // Formats: "planet in sign (house)", "planet in sign", "sun-moon in sign (house)"
                        let dignityBadge = null;
                        let hasAnyDignity = false;
                        
                        // Match patterns like "sun in leo (3H)" or "jupiter in cancer (2H)" or "sun-moon in capricorn"
                        const planetSignMatch = position.match(/^([A-Za-z-]+)\s+in\s+([A-Za-z]+)(?:\s*\([^)]*\))?$/i);
                        if (planetSignMatch) {
                          const [, planetPart, sign] = planetSignMatch;
                          // Handle compound planets like "Sun-Moon"
                          const planets = planetPart.split('-');
                          
                          // Create dignity badges for each planet
                          const dignityBadges = planets.map(planet => {
                            const dignity = getPlanetaryDignity(planet.toLowerCase().trim(), sign.toLowerCase());
                            if (dignity !== 'neutral') {
                              hasAnyDignity = true;
                              const color = dignity === 'rulership' || dignity === 'exaltation' 
                                ? 'text-emerald-600 bg-emerald-50' 
                                : 'text-orange-600 bg-orange-50';
                              return (
                                <span key={planet} className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${color}`}>
                                  {dignity.charAt(0).toUpperCase() + dignity.slice(1)}
                                </span>
                              );
                            }
                            return null;
                          }).filter(Boolean);
                          
                          if (dignityBadges.length > 0) {
                            dignityBadge = <div className="inline-flex flex-wrap gap-1 ml-2">{dignityBadges}</div>;
                          }
                        }
                        
                        // Only show the planetary position if it has a dignity
                        if (!hasAnyDignity) {
                          return null;
                        }
                        
                        return (
                          <div key={index} className="text-xs text-gray-700 leading-relaxed flex items-center justify-between">
                            <span>{position}</span>
                            {dignityBadge}
                          </div>
                        );
                      }).filter(Boolean)}
                      </div>
                    </div>
                  );
                })()}

                {/* Time Window */}
                {event.timeWindow && (
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Time Window</div>
                    <div className="text-xs text-gray-700 leading-relaxed">
                      <div className="flex items-center space-x-2">
                        <svg className="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>
                          {(() => {
                            const formatTime = (time: string) => {
                              const [hours, minutes] = time.split(':').map(Number);
                              const period = hours >= 12 ? 'PM' : 'AM';
                              const hours12 = hours % 12 || 12;
                              return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
                            };
                            return `${formatTime(event.timeWindow.startTime)} - ${formatTime(event.timeWindow.endTime)}`;
                          })()}
                        </span>
                      </div>
                      <div className="mt-1 text-blue-600 font-medium">
                        Duration: {event.timeWindow.duration}
                      </div>
                    </div>
                  </div>
                )}

                {/* Description */}
                {event.description && (
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Description</div>
                    <div className="text-xs text-gray-700 leading-relaxed">
                      {event.description}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Enhanced Caret */}
            <div className={`absolute ${getCaretClasses()}`}>
              <svg 
                width="12" 
                height="8" 
                viewBox="0 0 12 8" 
                className={`${position === 'left' || position === 'right' ? 'w-2 h-3' : 'w-3 h-2'}`}
              >
                <path
                  d={getCaretPath()}
                  fill="white"
                  stroke="#e5e7eb"
                  strokeWidth="1"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}