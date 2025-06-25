/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from 'react';
import { EmbeddedChart } from '../../types/threads';
import { createEmbeddedChart, ChartShareData } from '../../utils/chartSharing';
import { useUserStore } from '../../store/userStore';
import { useNatalChart } from '../../hooks/useNatalChart';
import ChartAttachmentToast from './ChartAttachmentToast';
import ChartSuccessToast from './ChartSuccessToast';

interface ChartAttachmentButtonProps {
  onChartAttach: (chart: EmbeddedChart) => void;
  disabled?: boolean;
}

export default function ChartAttachmentButton({ onChartAttach, disabled = false }: ChartAttachmentButtonProps) {
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [attachedChart, setAttachedChart] = useState<EmbeddedChart | null>(null);
  const { user } = useUserStore();
  const { cachedChart } = useNatalChart();

  const handleAttachChart = async (chart: EmbeddedChart) => {
    setIsLoading(true);
    try {
      onChartAttach(chart);
      setShowToast(false);
      
      // Show success toast
      setAttachedChart(chart);
      setShowSuccessToast(true);
    } catch (error) {
      console.error('Error attaching chart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const hasCurrentChart = !!cachedChart;

  return (
    <>
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowToast(true)}
          disabled={disabled || isLoading}
          className={`group relative px-3 py-2 border border-black transition-all duration-300 overflow-hidden ${
            disabled || isLoading
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-black hover:bg-black hover:text-white'
          }`}
          title="Attach a chart to your discussion"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-200/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          <div className="relative flex items-center">
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                <span className="font-medium text-sm font-inter">Attaching...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-3 4h.01M12 12h.01M9 12h.01M6 20h12a2 2 0 002-2V8a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="font-medium text-sm font-inter">Add Chart</span>
              </>
            )}
          </div>
        </button>

        {/* Quick Attach Indicator */}
        {hasCurrentChart && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border border-white rounded-full" title="Current chart available"></div>
        )}
      </div>

      <ChartAttachmentToast
        isOpen={showToast}
        onClose={() => setShowToast(false)}
        onChartSelect={handleAttachChart}
        isLoading={isLoading}
      />

      {/* Success Toast */}
      {attachedChart && (
        <ChartSuccessToast
          isVisible={showSuccessToast}
          chartTitle={attachedChart.metadata.chartTitle}
          chartType={attachedChart.chartType}
          onHide={() => {
            setShowSuccessToast(false);
            setAttachedChart(null);
          }}
        />
      )}
    </>
  );
}