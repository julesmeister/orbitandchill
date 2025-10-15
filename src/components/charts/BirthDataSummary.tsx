import React from 'react';
import { BirthData } from '../../types/user';
import ThreadingLines from '../threading/ThreadingLines';

interface BirthDataSummaryProps {
  birthData: BirthData;
  personName?: string;
  timeZone?: string;
  utcOffset?: number;
}

// Helper function to convert 24-hour time to 12-hour format with AM/PM
function formatTimeWithAmPm(time24: string): string {
  if (!time24) return 'Unknown';

  const [hours, minutes] = time24.split(':').map(Number);

  if (isNaN(hours) || isNaN(minutes)) return time24;

  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12; // Convert 0 to 12 for midnight

  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
}

// Helper function to format timezone display
function formatTimeZoneDisplay(timeZone?: string, utcOffset?: number): string {
  if (!timeZone) return 'Unknown';

  // Format UTC offset (e.g., +8.0 → UTC+8, -5.0 → UTC-5)
  const offsetStr = utcOffset !== undefined
    ? ` (UTC${utcOffset >= 0 ? '+' : ''}${Math.floor(utcOffset)})`
    : '';

  // Make timezone more readable
  const readableZone = timeZone.replace(/_/g, ' ').replace('/', ', ');

  return `${readableZone}${offsetStr}`;
}

export default function BirthDataSummary({ birthData, personName, timeZone, utcOffset }: BirthDataSummaryProps) {
  // Debug logging for timezone data
  console.log('🗺️ BirthDataSummary received:', {
    hasTimeZone: !!timeZone,
    timeZone,
    hasUtcOffset: utcOffset !== undefined,
    utcOffset,
    personName
  });

  // Format coordinates for display
  const formatCoordinate = (value: string, type: 'lat' | 'lon'): string => {
    const num = parseFloat(value);
    if (isNaN(num)) return 'Unknown';

    const direction = type === 'lat'
      ? (num >= 0 ? 'N' : 'S')
      : (num >= 0 ? 'E' : 'W');

    return `${Math.abs(num).toFixed(4)}° ${direction}`;
  };

  return (
    <div className="bg-white">
      <div className="p-6 border-b border-black">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-black flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h3 className="font-space-grotesk text-lg font-bold text-black">Birth Details</h3>
            {personName && (
              <p className="font-open-sans text-sm text-black/60">for {personName}</p>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-5 ml-12">
          <div className="relative">
            <ThreadingLines 
              isNested={true} 
              isLastChild={false} 
              hasMoreSiblings={true} 
            />
            <div className="pl-4 py-2 ml-3">
              <div className="flex items-center mb-1">
                <svg className="w-4 h-4 text-black mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="font-open-sans text-xs font-medium text-black/60 uppercase tracking-wide">Birth Date</p>
              </div>
              <p className="font-open-sans text-sm font-semibold text-black">
                {birthData?.dateOfBirth ? new Date(birthData.dateOfBirth).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'Unknown'}
              </p>
            </div>
          </div>
          
          <div className="relative">
            <ThreadingLines
              isNested={true}
              isLastChild={false}
              hasMoreSiblings={true}
            />
            <div className="pl-4 py-2 ml-3">
              <div className="flex items-center mb-1">
                <svg className="w-4 h-4 text-black mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="font-open-sans text-xs font-medium text-black/60 uppercase tracking-wide">Birth Time</p>
              </div>
              <p className="font-open-sans text-sm font-semibold text-black">
                {birthData?.timeOfBirth ? formatTimeWithAmPm(birthData.timeOfBirth) : 'Unknown'}
              </p>
            </div>
          </div>

          <div className="relative">
            <ThreadingLines
              isNested={true}
              isLastChild={false}
              hasMoreSiblings={true}
            />
            <div className="pl-4 py-2 ml-3">
              <div className="flex items-center mb-1">
                <svg className="w-4 h-4 text-black mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="font-open-sans text-xs font-medium text-black/60 uppercase tracking-wide">Timezone</p>
              </div>
              <p className="font-open-sans text-sm font-semibold text-black break-words">
                {timeZone ? formatTimeZoneDisplay(timeZone, utcOffset) : 'Not available'}
              </p>
              <p className="font-open-sans text-xs text-black/50 mt-1">
                Used for UTC conversion in calculations
              </p>
            </div>
          </div>

          <div className="relative">
            <ThreadingLines
              isNested={true}
              isLastChild={false}
              hasMoreSiblings={true}
            />
            <div className="pl-4 py-2 ml-3">
              <div className="flex items-center mb-1">
                <svg className="w-4 h-4 text-black mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <p className="font-open-sans text-xs font-medium text-black/60 uppercase tracking-wide">Birth Location</p>
              </div>
              <p className="font-open-sans text-sm font-semibold text-black break-words">{birthData?.locationOfBirth || 'Unknown'}</p>
            </div>
          </div>

          <div className="relative">
            <ThreadingLines
              isNested={true}
              isLastChild={true}
              hasMoreSiblings={false}
            />
            <div className="pl-4 py-2 ml-3">
              <div className="flex items-center mb-1">
                <svg className="w-4 h-4 text-black mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <p className="font-open-sans text-xs font-medium text-black/60 uppercase tracking-wide">Coordinates</p>
              </div>
              <p className="font-open-sans text-sm font-semibold text-black">
                {birthData?.coordinates?.lat && birthData?.coordinates?.lon ? (
                  <>
                    <span className="block">{formatCoordinate(birthData.coordinates.lat, 'lat')}</span>
                    <span className="block">{formatCoordinate(birthData.coordinates.lon, 'lon')}</span>
                  </>
                ) : (
                  'Unknown'
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}