/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from 'react';
import { EmbeddedChart } from '../../types/threads';
import { createEmbeddedChart, ChartShareData } from '../../utils/chartSharing';
import { useUserStore } from '../../store/userStore';
import { useNatalChart } from '../../hooks/useNatalChart';
import ChartSummaryCard from './ChartSummaryCard';

interface ChartSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChartSelect: (chart: EmbeddedChart) => void;
}

export default function ChartSelectionModal({ isOpen, onClose, onChartSelect }: ChartSelectionModalProps) {
  const [selectedChartType, setSelectedChartType] = useState<'natal' | 'horary' | 'event'>('natal');
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useUserStore();
  const { cachedChart, generateChart } = useNatalChart();

  console.log('ChartSelectionModal render - isOpen:', isOpen);

  if (!isOpen) {
    console.log('Modal not open, returning null');
    return null;
  }

  console.log('Modal should be visible now');

  const handleGenerateAndAttach = async (chartType: 'natal' | 'horary' | 'event') => {
    if (!user) return;

    setIsGenerating(true);
    try {
      let shareData: ChartShareData;
      
      switch (chartType) {
        case 'natal':
          if (!user.birthData) {
            alert('Please complete your birth data in your profile to generate a natal chart.');
            return;
          }
          
          // Generate or use cached natal chart
          let natalChart = cachedChart;
          if (!natalChart) {
            natalChart = await generateChart({
              name: user.username || 'User',
              dateOfBirth: user.birthData.dateOfBirth,
              timeOfBirth: user.birthData.timeOfBirth,
              locationOfBirth: user.birthData.locationOfBirth,
              coordinates: user.birthData.coordinates
            });
          }
          
          if (!natalChart) {
            alert('Failed to generate natal chart.');
            return;
          }

          shareData = {
            chartType: 'natal',
            svgContent: natalChart.svg,
            metadata: {
              ...natalChart.metadata,
              birthData: user.birthData
            },
            name: user.username || 'User'
          };
          break;
          
        case 'horary':
          // For now, show message that horary charts need to be created from horary page
          alert('To attach a horary chart, please create one from the Horary page first.');
          return;
          
        case 'event':
          // For now, show message that event charts need to be created from events page  
          alert('To attach an event chart, please create one from the Events page first.');
          return;
          
        default:
          return;
      }

      const embeddedChart = createEmbeddedChart(shareData);
      onChartSelect(embeddedChart);
    } catch (error) {
      console.error('Error generating chart:', error);
      alert('Failed to generate chart. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-black max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-black">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-space-grotesk text-2xl font-bold text-black">
                Select Chart to Attach
              </h2>
              <p className="font-inter text-black/70 mt-1">
                Choose which type of chart you'd like to share in your discussion
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 border border-black transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Chart Type Selection */}
          <div className="mb-6">
            <h3 className="font-space-grotesk font-bold text-black mb-4">Chart Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { 
                  type: 'natal' as const, 
                  title: 'Natal Chart', 
                  description: 'Your birth chart with planetary positions',
                  available: !!user?.birthData,
                  color: '#6bdbff'
                },
                { 
                  type: 'horary' as const, 
                  title: 'Horary Chart', 
                  description: 'Question-based divination chart',
                  available: false,
                  color: '#f2e356'
                },
                { 
                  type: 'event' as const, 
                  title: 'Event Chart', 
                  description: 'Chart for a specific time and event',
                  available: false,
                  color: '#ff91e9'
                }
              ].map((option) => (
                <button
                  key={option.type}
                  onClick={() => setSelectedChartType(option.type)}
                  disabled={!option.available}
                  className={`p-4 border border-black text-left transition-all duration-300 ${
                    selectedChartType === option.type
                      ? 'bg-black text-white'
                      : option.available 
                        ? 'bg-white text-black hover:bg-gray-50'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                  style={{ backgroundColor: selectedChartType === option.type ? '#000' : option.available ? option.color : '#f3f4f6' }}
                >
                  <h4 className="font-space-grotesk font-bold mb-2">{option.title}</h4>
                  <p className="text-sm font-inter opacity-80">{option.description}</p>
                  {!option.available && option.type !== 'natal' && (
                    <p className="text-xs mt-2 font-inter opacity-60">Coming soon</p>
                  )}
                  {!option.available && option.type === 'natal' && (
                    <p className="text-xs mt-2 font-inter opacity-60">Complete birth data required</p>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Current Chart Preview */}
          {selectedChartType === 'natal' && cachedChart && user?.birthData && (
            <div className="mb-6">
              <h3 className="font-space-grotesk font-bold text-black mb-4">Current Chart</h3>
              <ChartSummaryCard
                chartType="natal"
                metadata={{
                  name: user.username || 'User',
                  chartTitle: `${user.username || 'User'}'s Natal Chart`,
                  birthData: user.birthData,
                  planetSummary: [],
                  houseSummary: [],
                  majorAspects: []
                }}
                isSelected={true}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-black bg-white text-black hover:bg-gray-50 transition-colors font-space-grotesk font-bold"
            >
              Cancel
            </button>
            <button
              onClick={() => handleGenerateAndAttach(selectedChartType)}
              disabled={isGenerating || (selectedChartType === 'natal' && !user?.birthData)}
              className="px-6 py-3 bg-black text-white hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-space-grotesk font-bold"
            >
              {isGenerating ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Generating...
                </div>
              ) : (
                'Attach Chart'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}