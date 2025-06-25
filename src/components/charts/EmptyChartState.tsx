import React from 'react';

interface EmptyChartStateProps {
  onGenerateChart: () => void;
  isGenerating: boolean;
}

export default function EmptyChartState({ onGenerateChart, isGenerating }: EmptyChartStateProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-12 text-center">
      <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 className="text-xl font-medium text-gray-900 mb-2">Generate Your Chart</h3>
      <p className="text-gray-600 mb-6">
        Click the button below to create your personalized natal chart
      </p>
      <button
        onClick={onGenerateChart}
        disabled={isGenerating}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {isGenerating ? 'Generating Chart...' : 'Generate Chart'}
      </button>
    </div>
  );
}