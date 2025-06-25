import React from 'react';
import Link from 'next/link';

interface ChartPreviewProps {
  svgContent: string;
  userName?: string;
  birthData?: {
    dateOfBirth: string;
    timeOfBirth: string;
    locationOfBirth: string;
  };
}

const ChartPreview: React.FC<ChartPreviewProps> = ({
  svgContent,
  userName = 'Your',
  birthData
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
        <h3 className="text-lg font-bold">{userName} Natal Chart</h3>
        {birthData && (
          <p className="text-blue-100 text-sm">
            {new Date(birthData.dateOfBirth).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })} • {birthData.timeOfBirth}
          </p>
        )}
      </div>

      {/* Chart Preview */}
      <div className="p-4">
        <div className="relative">
          {/* SVG Chart (scaled down) */}
          <div className="flex justify-center">
            <div 
              className="w-64 h-64 border border-gray-200 rounded-lg bg-gray-50"
              style={{ fontSize: '8px' }} // Scale down text
            >
              <div 
                className="w-full h-full"
                dangerouslySetInnerHTML={{ 
                  __html: svgContent.replace(/width="600"/, 'width="256"').replace(/height="600"/, 'height="256"')
                }}
              />
            </div>
          </div>

          {/* Overlay with action */}
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100 rounded-lg">
            <Link
              href="/chart"
              className="bg-white text-gray-900 px-4 py-2 rounded-lg shadow-lg font-medium hover:bg-gray-50 transition-colors"
            >
              View Full Chart
            </Link>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4 text-center">
          <Link
            href="/chart"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View Full Chart
          </Link>
        </div>

        {/* Birth Location */}
        {birthData?.locationOfBirth && (
          <div className="mt-3 text-center">
            <p className="text-xs text-gray-500">
              Born in {birthData.locationOfBirth}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartPreview;