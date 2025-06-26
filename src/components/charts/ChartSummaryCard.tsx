/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { ChartMetadata } from '../../types/threads';
import { formatPlanetDisplay, formatHouseDisplay } from '../../utils/chartSharing';

interface ChartSummaryCardProps {
  chartType: 'natal' | 'horary' | 'event';
  metadata: ChartMetadata;
  isSelected?: boolean;
  isPreview?: boolean;
  onViewMore?: () => void;
}

export default function ChartSummaryCard({ 
  chartType, 
  metadata, 
  isSelected = false, 
  isPreview = false,
  onViewMore 
}: ChartSummaryCardProps) {
  
  const getChartTypeIcon = () => {
    switch (chartType) {
      case 'natal': return '🌟';
      case 'horary': return '🔮';
      case 'event': return '📅';
      default: return '📊';
    }
  };

  const getChartTypeColor = () => {
    switch (chartType) {
      case 'natal': return '#6bdbff';
      case 'horary': return '#f2e356';
      case 'event': return '#ff91e9';
      default: return '#51bd94';
    }
  };

  return (
    <div className={`border border-black bg-white ${isSelected ? 'ring-2 ring-black' : ''}`}>
      {/* Header */}
      <div 
        className="p-4 border-b border-black"
        style={{ backgroundColor: getChartTypeColor() }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl mr-3">{getChartTypeIcon()}</span>
            <div>
              <h3 className="font-space-grotesk font-bold text-black text-lg">
                {metadata.chartTitle}
              </h3>
              <p className="text-sm text-black/70 font-inter">
                {chartType === 'natal' ? 'Birth Chart Analysis' : 
                 chartType === 'horary' ? 'Divination Chart' : 
                 chartType === 'event' ? 'Event Chart' : 'Astrological Chart'}
              </p>
            </div>
          </div>
          {metadata.chartScore && (
            <div className="bg-black text-white px-2 py-1 font-space-grotesk font-bold text-sm">
              {metadata.chartScore}%
            </div>
          )}
        </div>
      </div>

      {/* Chart Details */}
      <div className="p-4">
        {/* Birth Data (for natal charts) */}
        {chartType === 'natal' && metadata.birthData && (
          <div className="mb-4">
            <h4 className="font-space-grotesk font-bold text-black text-sm mb-2">Birth Information</h4>
            <div className="text-sm text-black/80 font-inter space-y-1">
              <p>📅 {new Date(metadata.birthData.dateOfBirth).toLocaleDateString()}</p>
              <p>🕐 {metadata.birthData.timeOfBirth}</p>
              <p>📍 {metadata.birthData.locationOfBirth}</p>
            </div>
          </div>
        )}

        {/* Event Data (for event charts) */}
        {chartType === 'event' && metadata.eventData && (
          <div className="mb-4">
            <h4 className="font-space-grotesk font-bold text-black text-sm mb-2">Event Information</h4>
            <div className="text-sm text-black/80 font-inter space-y-1">
              <p>📅 {metadata.eventData.eventTitle}</p>
              <p>🕐 {metadata.eventData.eventDate} at {metadata.eventData.eventTime}</p>
              {metadata.eventData.isOptimal && (
                <p className="text-green-600">⭐ Optimal timing ({metadata.eventData.optimalScore}%)</p>
              )}
            </div>
          </div>
        )}

        {/* Horary Data (for horary charts) */}
        {chartType === 'horary' && metadata.horaryData && (
          <div className="mb-4">
            <h4 className="font-space-grotesk font-bold text-black text-sm mb-2">Question</h4>
            <div className="text-sm text-black/80 font-inter space-y-1">
              <p>❓ "{metadata.horaryData.question}"</p>
              <p>📅 {new Date(metadata.horaryData.questionDate).toLocaleDateString()}</p>
              {metadata.horaryData.answer && (
                <p className="font-bold">💡 {metadata.horaryData.answer}</p>
              )}
              {metadata.horaryData.timing && (
                <p>⏰ {metadata.horaryData.timing}</p>
              )}
            </div>
          </div>
        )}

        {/* Planet Summary */}
        {metadata.planetSummary && metadata.planetSummary.length > 0 && (
          <div className="mb-4">
            <h4 className="font-space-grotesk font-bold text-black text-sm mb-2">Key Planetary Positions</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {metadata.planetSummary.slice(0, isPreview ? 4 : 8).map((planet, index) => (
                <div key={index} className="text-xs font-inter bg-gray-50 p-2 border border-gray-200">
                  <span className="font-bold">{planet.planet}</span> in{' '}
                  <span className="font-medium">{planet.sign}</span>{' '}
                  <span className="text-gray-600">{planet.house}</span>
                  {planet.isRetrograde && <span className="text-red-600"> ℞</span>}
                </div>
              ))}
            </div>
            {metadata.planetSummary.length > (isPreview ? 4 : 8) && (
              <p className="text-xs text-black/60 mt-2 font-inter">
                +{metadata.planetSummary.length - (isPreview ? 4 : 8)} more planets
              </p>
            )}
          </div>
        )}

        {/* House Summary */}
        {metadata.houseSummary && metadata.houseSummary.length > 0 && !isPreview && (
          <div className="mb-4">
            <h4 className="font-space-grotesk font-bold text-black text-sm mb-2">House Occupancy</h4>
            <div className="text-xs font-inter space-y-1">
              {metadata.houseSummary
                .filter(house => !house.isEmpty)
                .slice(0, 6)
                .map((house, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{house.house}:</span>
                    <span className="font-medium">{house.planets.join(', ')}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Major Aspects */}
        {metadata.majorAspects && metadata.majorAspects.length > 0 && !isPreview && (
          <div className="mb-4">
            <h4 className="font-space-grotesk font-bold text-black text-sm mb-2">Major Aspects</h4>
            <div className="flex flex-wrap gap-1">
              {metadata.majorAspects.slice(0, 6).map((aspect, index) => (
                <span 
                  key={index} 
                  className="text-xs bg-black text-white px-2 py-1 font-inter"
                >
                  {aspect}
                </span>
              ))}
            </div>
            {metadata.majorAspects.length > 6 && (
              <p className="text-xs text-black/60 mt-2 font-inter">
                +{metadata.majorAspects.length - 6} more aspects
              </p>
            )}
          </div>
        )}

        {/* View More Button */}
        {isPreview && onViewMore && (
          <button
            onClick={onViewMore}
            className="w-full mt-4 py-2 border border-black bg-white text-black hover:bg-black hover:text-white transition-colors font-space-grotesk font-bold text-sm"
          >
            View Full Chart Details
          </button>
        )}
      </div>
    </div>
  );
}