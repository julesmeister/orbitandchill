/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

const MatrixOfDestinyLegend: React.FC = () => {
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gray-50 p-6 border border-gray-200 rounded">
        <h3 className="font-space-grotesk font-bold text-black mb-4">Octagram Structure</h3>
        <ul className="text-sm text-gray-700 space-y-2">
          <li><strong>Diagonal Square (Rhombus):</strong> Personal energies from birth date components</li>
          <li><strong>Straight Square:</strong> Ancestral and social energies from combined calculations</li>
          <li><strong>Personal Center (E):</strong> Sum of all diagonal corners - your core essence</li>
          <li><strong>Sky Line:</strong> Vertical axis representing spiritual development</li>
          <li><strong>Earth Line:</strong> Horizontal axis representing material world connections</li>
          <li><strong>Love Line (Pink):</strong> Horizontal axis showing relationship dynamics</li>
          <li><strong>Money Line (Brown):</strong> Vertical axis indicating financial energy</li>
        </ul>
      </div>

      <div className="bg-gray-50 p-6 border border-gray-200 rounded">
        <h3 className="font-space-grotesk font-bold text-black mb-4">Position Meanings</h3>
        <ul className="text-sm text-gray-700 space-y-2">
          <li><strong>A - Day Energy:</strong> Your natural character and talents</li>
          <li><strong>B - Month Energy:</strong> Your emotional nature and inner world</li>
          <li><strong>C - Year Energy:</strong> Your life purpose and destiny path</li>
          <li><strong>D - Karmic Number:</strong> Lessons to learn in this lifetime</li>
          <li><strong>F, G, H, I:</strong> Ancestral influences and social connections</li>
          <li><strong>Heart Position:</strong> Deepest soul desires and motivations</li>
          <li><strong>Karmic Tail:</strong> Three-part inherited karmic pattern</li>
        </ul>
      </div>
    </div>
  );
};

export default MatrixOfDestinyLegend;