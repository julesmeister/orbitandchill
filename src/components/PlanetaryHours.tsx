/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { calculatePlanetaryHours, PlanetaryHoursData, getTimeUntilNextHour } from '@/utils/planetaryHours';
import { useSharedLocation } from '@/hooks/useSharedLocation';

export default function PlanetaryHours() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { locationDisplay } = useSharedLocation();

  // Stabilize location data to prevent unnecessary recalculations
  // Default to user's location or Manila, Philippines for users in GMT+8 timezone
  const locationData = useMemo(() => ({
    lat: locationDisplay?.coordinates?.lat ? parseFloat(locationDisplay.coordinates.lat) : 14.5995,
    lon: locationDisplay?.coordinates?.lon ? parseFloat(locationDisplay.coordinates.lon) : 120.9842,
    name: locationDisplay?.name || 'Manila, Philippines'
  }), [locationDisplay?.coordinates?.lat, locationDisplay?.coordinates?.lon, locationDisplay?.name]);

  // Calculate planetary hours data
  const planetaryHoursData = useMemo(() => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = calculatePlanetaryHours(locationData.lat, locationData.lon, currentTime, locationData.name);
      setIsLoading(false);
      return data;
    } catch (err) {
      setError('Failed to calculate planetary hours. Please check your location settings.');
      console.error('Planetary hours calculation error:', err);
      setIsLoading(false);
      return null;
    }
  }, [currentTime, locationData.lat, locationData.lon, locationData.name]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-3 h-3 bg-black animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-3 h-3 bg-black animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-3 h-3 bg-black animate-bounce"></div>
        </div>
        <h2 className="font-space-grotesk text-2xl font-bold text-black mb-2">
          Calculating Planetary Hours
        </h2>
        <p className="font-open-sans text-black/70">
          Computing accurate sunrise/sunset times for your location...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="text-red-500 text-xl mb-4">⚠️</div>
        <h2 className="font-space-grotesk text-2xl font-bold text-black mb-2">
          Calculation Error
        </h2>
        <p className="font-open-sans text-black/70">
          {error}
        </p>
      </div>
    );
  }

  if (!planetaryHoursData) {
    return null;
  }

  const { hours, sunrise, sunset, currentHour, nextHour, dayRuler, location } = planetaryHoursData;

  return (
    <div className="space-y-8">
      {/* Location and Day Information */}
      <div className="border border-black bg-white p-6">
        <h3 className="font-space-grotesk text-2xl font-bold text-black mb-4">
          Planetary Hours for {format(currentTime, 'EEEE, MMMM d, yyyy')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h4 className="font-space-grotesk font-bold text-black mb-2">Location</h4>
            <p className="font-open-sans text-black/80 text-sm">
              📍 {location.name || `${location.lat.toFixed(4)}°, ${location.lon.toFixed(4)}°`}
            </p>
          </div>
          <div>
            <h4 className="font-space-grotesk font-bold text-black mb-2">Day Ruler</h4>
            <p className="font-open-sans text-black/80 text-sm">
              {dayRuler} rules {format(currentTime, 'EEEE')}
            </p>
          </div>
          <div>
            <h4 className="font-space-grotesk font-bold text-black mb-2">Sun Times</h4>
            <p className="font-open-sans text-black/80 text-sm">
              🌅 {format(sunrise, 'HH:mm')} - 🌇 {format(sunset, 'HH:mm')}
            </p>
          </div>
        </div>
      </div>

      {/* Current Planetary Hour */}
      {currentHour && (
        <div className="border border-black bg-white p-6">
          <h3 className="font-space-grotesk text-2xl font-bold text-black mb-6">
            Current Planetary Hour
          </h3>
          <div className="flex items-center gap-6">
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white"
              style={{ backgroundColor: currentHour.color }}
            >
              {currentHour.symbol}
            </div>
            <div className="flex-1">
              <h4 className="font-space-grotesk text-xl font-bold text-black mb-2">
                Hour of {currentHour.planet}
              </h4>
              <p className="font-open-sans text-black/80 mb-2">
                {currentHour.timeRange} • {currentHour.isDayHour ? 'Day' : 'Night'} Hour
              </p>
              <p className="font-open-sans text-black/70 text-sm mb-2">
                {currentHour.influence}
              </p>
              <p className="font-open-sans text-black/60 text-xs">
                Time remaining: {getTimeUntilNextHour(currentHour)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Next Planetary Hour */}
      {nextHour && (
        <div className="border border-black bg-gray-50 p-6">
          <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">
            Next: Hour of {nextHour.planet}
          </h3>
          <div className="flex items-center gap-4">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white"
              style={{ backgroundColor: nextHour.color }}
            >
              {nextHour.symbol}
            </div>
            <div>
              <p className="font-open-sans text-black/80">
                {nextHour.timeRange} • {nextHour.isDayHour ? 'Day' : 'Night'} Hour
              </p>
              <p className="font-open-sans text-black/70 text-sm">
                {nextHour.influence}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Today's Full Schedule */}
      <div className="border border-black bg-white p-6">
        <h3 className="font-space-grotesk text-2xl font-bold text-black mb-6">
          Complete 24-Hour Schedule
        </h3>
        
        {/* Day Hours */}
        <div className="mb-8">
          <h4 className="font-space-grotesk font-bold text-black mb-4">
            Day Hours (Sunrise to Sunset)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hours.filter(h => h.isDayHour).map((hour) => (
              <div 
                key={hour.hour}
                className={`border p-4 transition-all duration-300 group cursor-pointer ${
                  hour.isCurrent 
                    ? 'border-black bg-yellow-50 shadow-lg' 
                    : 'border-gray-200 hover:border-black'
                }`}
                style={hour.isCurrent ? {} : {
                  '--hover-bg': hour.color,
                  '--hover-text': '#ffffff'
                } as React.CSSProperties}
                onMouseEnter={(e) => {
                  if (!hour.isCurrent) {
                    e.currentTarget.style.backgroundColor = hour.color;
                    e.currentTarget.style.color = '#ffffff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!hour.isCurrent) {
                    e.currentTarget.style.backgroundColor = '';
                    e.currentTarget.style.color = '';
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      hour.isCurrent 
                        ? 'text-white' 
                        : 'text-white group-hover:text-black group-hover:bg-white'
                    }`}
                    style={{ backgroundColor: hour.color }}
                  >
                    {hour.symbol}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-space-grotesk font-bold text-sm transition-colors duration-300 ${
                        hour.isCurrent 
                          ? 'text-black' 
                          : 'text-black group-hover:text-white'
                      }`}>
                        {hour.planet}
                      </h4>
                      <span className={`font-open-sans text-xs transition-colors duration-300 ${
                        hour.isCurrent 
                          ? 'text-black/60' 
                          : 'text-black/60 group-hover:text-white/80'
                      }`}>
                        Hour {hour.hour}
                      </span>
                    </div>
                    <p className={`font-open-sans text-xs transition-colors duration-300 ${
                      hour.isCurrent 
                        ? 'text-black/80' 
                        : 'text-black/80 group-hover:text-white/90'
                    }`}>
                      {hour.timeRange}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Night Hours */}
        <div>
          <h4 className="font-space-grotesk font-bold text-black mb-4">
            Night Hours (Sunset to Sunrise)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hours.filter(h => !h.isDayHour).map((hour) => (
              <div 
                key={hour.hour}
                className={`border p-4 transition-all duration-300 group cursor-pointer ${
                  hour.isCurrent 
                    ? 'border-black bg-yellow-50 shadow-lg' 
                    : 'border-gray-200 hover:border-black'
                }`}
                style={hour.isCurrent ? {} : {
                  '--hover-bg': hour.color,
                  '--hover-text': '#ffffff'
                } as React.CSSProperties}
                onMouseEnter={(e) => {
                  if (!hour.isCurrent) {
                    e.currentTarget.style.backgroundColor = hour.color;
                    e.currentTarget.style.color = '#ffffff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!hour.isCurrent) {
                    e.currentTarget.style.backgroundColor = '';
                    e.currentTarget.style.color = '';
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      hour.isCurrent 
                        ? 'text-white' 
                        : 'text-white group-hover:text-black group-hover:bg-white'
                    }`}
                    style={{ backgroundColor: hour.color }}
                  >
                    {hour.symbol}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-space-grotesk font-bold text-sm transition-colors duration-300 ${
                        hour.isCurrent 
                          ? 'text-black' 
                          : 'text-black group-hover:text-white'
                      }`}>
                        {hour.planet}
                      </h4>
                      <span className={`font-open-sans text-xs transition-colors duration-300 ${
                        hour.isCurrent 
                          ? 'text-black/60' 
                          : 'text-black/60 group-hover:text-white/80'
                      }`}>
                        Hour {hour.hour}
                      </span>
                    </div>
                    <p className={`font-open-sans text-xs transition-colors duration-300 ${
                      hour.isCurrent 
                        ? 'text-black/80' 
                        : 'text-black/80 group-hover:text-white/90'
                    }`}>
                      {hour.timeRange}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Information Box */}
      <div className="border border-black bg-gradient-to-br from-purple-50 to-blue-50 p-6">
        <h3 className="font-space-grotesk text-xl font-bold text-black mb-4">
          About Planetary Hours
        </h3>
        <div className="space-y-3 font-open-sans text-black/80 text-sm">
          <p>
            Planetary hours are an ancient timing system where each hour of the day and night is ruled by one of the seven classical planets.
          </p>
          <p>
            The hours follow the Chaldean order: Sun, Venus, Mercury, Moon, Saturn, Jupiter, Mars. Each planet brings its own energy and is considered favorable for different activities.
          </p>
          <p>
            The day begins at sunrise with the hour of the planetary ruler of that day. For example, Sunday begins with the Sun's hour, Monday with the Moon's hour, etc.
          </p>
          <p>
            <strong>Important:</strong> These calculations use actual sunrise and sunset times for your location, calculated using astronomy-engine for maximum accuracy.
          </p>
        </div>
      </div>
    </div>
  );
}