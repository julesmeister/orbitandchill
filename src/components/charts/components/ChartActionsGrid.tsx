/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import ChartActionButton from './ChartActionButton';

interface ChartActionsGridProps {
  onEditData: () => void;
  onShareChart: () => void;
  onAstrocartography: () => void;
  canShare: boolean;
  hasPersonData: boolean;
}

export default function ChartActionsGrid({
  onEditData,
  onShareChart,
  onAstrocartography,
  canShare,
  hasPersonData
}: ChartActionsGridProps) {
  return (
    <div className="grid grid-cols-3 gap-0 border-b border-black">
      {/* Edit Data Button */}
      <ChartActionButton
        onClick={onEditData}
        icon={
          <svg className="w-5 h-5 text-white group-hover:text-black transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        }
        title="Edit Data"
        subtitle="Update info"
        className="border-r border-black"
        gradientDirection="right"
      />

      {/* Share Chart Button */}
      <ChartActionButton
        onClick={onShareChart}
        disabled={!canShare}
        icon={
          <svg className="w-5 h-5 text-white group-hover:text-black transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
        }
        title="Share Chart"
        subtitle="Copy link"
        className="border-r border-black"
        gradientDirection="right"
      />

      {/* Astrocartography Button */}
      <ChartActionButton
        onClick={onAstrocartography}
        disabled={!hasPersonData}
        icon={
          <svg className="w-5 h-5 text-white group-hover:text-black transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
        title="Astrocartography"
        subtitle="Explore locations"
        gradientDirection="left"
      />
    </div>
  );
}