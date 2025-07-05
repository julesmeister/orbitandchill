/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { NatalChartData, formatAstrologicalDegree } from '../../../utils/natalChart';

interface HousesSectionProps {
  chartData: NatalChartData;
}

const HousesSection: React.FC<HousesSectionProps> = ({ chartData }) => {
  const houseNames: Record<number, string> = {
    1: 'Self & Identity',
    2: 'Values & Possessions',
    3: 'Communication & Learning',
    4: 'Home & Family',
    5: 'Creativity & Romance',
    6: 'Work & Health',
    7: 'Partnerships & Marriage',
    8: 'Transformation & Shared Resources',
    9: 'Philosophy & Higher Learning',
    10: 'Career & Reputation',
    11: 'Friendships & Hopes',
    12: 'Spirituality & Subconscious'
  };

  // Color scheme for different house types using Synapsas colors
  const getHouseColors = (num: number) => {
    if ([1, 4, 7, 10].includes(num)) {
      // Angular houses - Synapsas purple
      return '#ff91e9';
    } else if ([2, 5, 8, 11].includes(num)) {
      // Succedent houses - Synapsas blue
      return '#6bdbff';
    } else {
      // Cadent houses - Synapsas yellow
      return '#f2e356';
    }
  };

  return (
    <div className="bg-white border border-black">
      <div className="flex items-center p-6 border-b border-black">
        <div className="w-8 h-8 bg-black flex items-center justify-center mr-3">
          <span className="text-white text-lg">🏠</span>
        </div>
        <div>
          <h5 className="font-space-grotesk text-lg font-bold text-black">Houses & Cusps</h5>
          <p className="font-open-sans text-sm text-black/60">The twelve life areas and their ruling signs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border border-black">
        {chartData.houses.map((house, index) => {
          const houseNumber = index + 1;
          const backgroundColor = getHouseColors(houseNumber);
          const isRightEdge = (index % 3 === 2);
          const isBottomEdge = (index >= chartData.houses.length - 3);

          return (
            <div
              key={houseNumber}
              className={`p-4 hover:bg-opacity-80 transition-colors ${!isRightEdge ? 'lg:border-r' : ''
                } ${!isBottomEdge ? 'border-b' : ''
                } border-black`}
              style={{ backgroundColor }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 bg-black text-white flex items-center justify-center text-xs font-bold">
                    {houseNumber}
                  </span>
                  <span className="font-space-grotesk text-sm font-semibold text-black">
                    {houseNames[houseNumber]}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-space-grotesk text-sm font-bold capitalize text-black">
                  {house.sign}
                </div>
                <div className="font-open-sans text-xs text-black/60 font-medium">
                  {formatAstrologicalDegree(house.cusp)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* House Legend */}
      <div className="mt-6 p-4 bg-gray-50 border-t border-black">
        <h6 className="font-space-grotesk text-sm font-semibold text-black mb-3">Understanding the Houses</h6>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4" style={{ backgroundColor: '#ff91e9' }}></div>
            <p className="font-open-sans text-black">
              <span className="font-medium">Angular Houses (1, 4, 7, 10):</span> Action-oriented, initiating energy
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4" style={{ backgroundColor: '#6bdbff' }}></div>
            <p className="font-open-sans text-black">
              <span className="font-medium">Succedent Houses (2, 5, 8, 11):</span> Stabilizing, sustaining energy
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4" style={{ backgroundColor: '#f2e356' }}></div>
            <p className="font-open-sans text-black">
              <span className="font-medium">Cadent Houses (3, 6, 9, 12):</span> Adaptable, learning energy
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-black"></div>
            <p className="font-open-sans text-black">
              <span className="font-medium">Cusp:</span> The exact degree where each house begins
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HousesSection;