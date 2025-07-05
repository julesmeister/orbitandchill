/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { NatalChartData } from '../../../utils/natalChart';

interface PlanetaryPositionsSectionProps {
  chartData: NatalChartData;
}

const PlanetaryPositionsSection: React.FC<PlanetaryPositionsSectionProps> = ({ chartData }) => {
  return (
    <div className="bg-white border border-black border-b-0">
      <div className="flex items-center p-6 border-b border-black">
        <div className="w-8 h-8 bg-black flex items-center justify-center mr-3">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
        <h5 className="font-space-grotesk text-lg font-bold text-black">Planetary Positions</h5>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-black">
          {chartData.planets.map((planet, index) => (
            <div key={planet.name} className={`flex items-center justify-between p-3 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'md:border-r' : ''} ${index < chartData.planets.length - 2 ? 'border-b' : ''} border-black`}>
              <div className="flex items-center">
                <span className="text-lg mr-2">
                  {planet.name === 'sun' ? '☉' :
                    planet.name === 'moon' ? '☽' :
                      planet.name === 'mercury' ? '☿' :
                        planet.name === 'venus' ? '♀' :
                          planet.name === 'mars' ? '♂' :
                            planet.name === 'jupiter' ? '♃' :
                              planet.name === 'saturn' ? '♄' :
                                planet.name === 'uranus' ? '♅' :
                                  planet.name === 'neptune' ? '♆' :
                                    planet.name === 'pluto' ? '♇' : '●'}
                </span>
                <div>
                  <span className="font-space-grotesk font-medium capitalize text-black">{planet.name}</span>
                  {planet.retrograde && <span className="text-red-500 ml-1 text-xs">R</span>}
                </div>
              </div>
              <div className="text-right text-sm">
                <div className="font-space-grotesk font-medium capitalize text-black">{planet.sign}</div>
                <div className="font-open-sans text-black/60">House {planet.house}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlanetaryPositionsSection;