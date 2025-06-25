/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from 'react';
import { EmbeddedChart } from '../../types/threads';
import ChartSummaryCard from './ChartSummaryCard';

interface EmbeddedChartDisplayProps {
  chart: EmbeddedChart;
  isPreview?: boolean;
  showFullDetails?: boolean;
}

export default function EmbeddedChartDisplay({ 
  chart, 
  isPreview = false, 
  showFullDetails = false 
}: EmbeddedChartDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(showFullDetails);
  const [showChartModal, setShowChartModal] = useState(false);

  const handleViewMore = () => {
    if (isPreview) {
      setIsExpanded(true);
    } else {
      setShowChartModal(true);
    }
  };

  return (
    <>
      <div className="my-6 border border-black bg-white">
        {/* Chart Header */}
        <div className="p-4 bg-gray-50 border-b border-black">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-black flex items-center justify-center mr-3">
                <span className="text-white text-lg">
                  {chart.chartType === 'natal' ? '🌟' : chart.chartType === 'horary' ? '🔮' : '📅'}
                </span>
              </div>
              <div>
                <h3 className="font-space-grotesk font-bold text-black">
                  📊 Shared Chart
                </h3>
                <p className="text-sm text-black/70 font-inter">
                  {chart.metadata.chartTitle}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-black text-white px-2 py-1 font-space-grotesk font-bold">
                {chart.chartType.toUpperCase()}
              </span>
              {chart.metadata.chartScore && (
                <span className="text-xs bg-green-600 text-white px-2 py-1 font-space-grotesk font-bold">
                  {chart.metadata.chartScore}%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Chart Content */}
        <div className="p-4">
          {isPreview && !isExpanded ? (
            /* Preview Mode - Compact Summary */
            <div className="space-y-4">
              {/* Quick Info */}
              <div className="flex flex-wrap gap-4 text-sm font-inter">
                {chart.chartType === 'natal' && chart.metadata.birthData && (
                  <>
                    <span>📅 {new Date(chart.metadata.birthData.dateOfBirth).toLocaleDateString()}</span>
                    <span>🕐 {chart.metadata.birthData.timeOfBirth}</span>
                    <span>📍 {chart.metadata.birthData.locationOfBirth}</span>
                  </>
                )}
                {chart.chartType === 'horary' && chart.metadata.horaryData && (
                  <>
                    <span>❓ "{chart.metadata.horaryData.question.substring(0, 50)}..."</span>
                    {chart.metadata.horaryData.answer && (
                      <span className="font-bold">💡 {chart.metadata.horaryData.answer}</span>
                    )}
                  </>
                )}
                {chart.chartType === 'event' && chart.metadata.eventData && (
                  <>
                    <span>📅 {chart.metadata.eventData.eventTitle}</span>
                    <span>🕐 {chart.metadata.eventData.eventDate}</span>
                  </>
                )}
              </div>

              {/* Chart Visual Preview */}
              <div>
                <h4 className="font-space-grotesk font-bold text-black text-sm mb-2">Chart Preview</h4>
                <div className="relative bg-gray-50 border border-gray-300 rounded p-4 h-64 flex items-center justify-center">
                  {chart.chartData ? (
                    <div 
                      className="w-full h-full flex items-center justify-center"
                      dangerouslySetInnerHTML={{ __html: chart.chartData }}
                      style={{ maxWidth: '200px', maxHeight: '200px' }}
                    />
                  ) : (
                    <div className="text-center text-gray-500">
                      <div className="text-4xl mb-2">
                        {chart.chartType === 'natal' ? '🌟' : chart.chartType === 'horary' ? '❓' : '📅'}
                      </div>
                      <p className="text-sm font-inter">
                        {chart.chartType.charAt(0).toUpperCase() + chart.chartType.slice(1)} Chart
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Key Planets Preview */}
              {chart.metadata.planetSummary && chart.metadata.planetSummary.length > 0 && (
                <div>
                  <h4 className="font-space-grotesk font-bold text-black text-sm mb-2">Key Planets</h4>
                  <div className="flex flex-wrap gap-2">
                    {chart.metadata.planetSummary.slice(0, 4).map((planet, index) => (
                      <span 
                        key={index}
                        className="text-xs bg-gray-100 border border-gray-300 px-2 py-1 font-inter"
                      >
                        {planet.planet} in {planet.sign}
                      </span>
                    ))}
                    {chart.metadata.planetSummary.length > 4 && (
                      <span className="text-xs text-black/60 px-2 py-1 font-inter">
                        +{chart.metadata.planetSummary.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* View More Button */}
              <button
                onClick={handleViewMore}
                className="w-full py-3 border border-black bg-white text-black hover:bg-black hover:text-white transition-colors font-space-grotesk font-bold text-sm"
              >
                View Full Chart Details
              </button>
            </div>
          ) : (
            /* Full Display Mode */
            <ChartSummaryCard
              chartType={chart.chartType}
              metadata={chart.metadata}
              isPreview={false}
              onViewMore={() => setShowChartModal(true)}
            />
          )}

          {/* Collapse Button for expanded preview */}
          {isPreview && isExpanded && (
            <button
              onClick={() => setIsExpanded(false)}
              className="w-full mt-4 py-2 border border-black bg-gray-50 text-black hover:bg-gray-100 transition-colors font-space-grotesk font-bold text-sm"
            >
              Show Less
            </button>
          )}
        </div>

        {/* Chart Attribution */}
        <div className="px-4 py-2 bg-gray-50 border-t border-black">
          <div className="flex items-center justify-between text-xs text-black/60 font-inter">
            <span>
              Chart created {new Date(chart.createdAt).toLocaleDateString()}
            </span>
            <span>
              Powered by Luckstrology
            </span>
          </div>
        </div>
      </div>

      {/* Full Chart Modal */}
      {showChartModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-black max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-black">
              <div className="flex items-center justify-between">
                <h2 className="font-space-grotesk text-2xl font-bold text-black">
                  {chart.metadata.chartTitle}
                </h2>
                <button
                  onClick={() => setShowChartModal(false)}
                  className="p-2 hover:bg-gray-100 border border-black transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chart SVG */}
                <div className="border border-black p-4 bg-gray-50">
                  <div 
                    className="w-full h-96 flex items-center justify-center"
                    dangerouslySetInnerHTML={{ __html: chart.chartData }}
                  />
                </div>

                {/* Chart Details */}
                <div>
                  <ChartSummaryCard
                    chartType={chart.chartType}
                    metadata={chart.metadata}
                    isPreview={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}