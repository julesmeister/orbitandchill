/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { MatrixCalculation } from '../../utils/matrixCalculations';

interface MatrixOfDestinyCalculationDetailsProps {
  birthData: {
    dateOfBirth: string;
    timeOfBirth: string;
    locationOfBirth: string;
    coordinates?: { lat: string; lon: string };
  };
  matrixData: MatrixCalculation;
}

const MatrixOfDestinyCalculationDetails: React.FC<MatrixOfDestinyCalculationDetailsProps> = ({ 
  birthData, 
  matrixData 
}) => {
  return (
    <div className="mt-6 max-w-2xl mx-auto">
      <div className="bg-black text-white p-4 rounded">
        <h4 className="font-space-grotesk font-bold mb-2">
          Calculation from {new Date(birthData.dateOfBirth).toLocaleDateString()}
        </h4>
        <div className="text-sm space-y-1 font-mono">
          <p>Day: {new Date(birthData.dateOfBirth).getDate()} → A = {matrixData.positions.A}</p>
          <p>Month: {new Date(birthData.dateOfBirth).getMonth() + 1} → B = {matrixData.positions.B}</p>
          <p>Year: {new Date(birthData.dateOfBirth).getFullYear()} → C = {matrixData.positions.C}</p>
          <p>Karma: A+B+C → D = {matrixData.positions.D}</p>
          <p>Personal Center: A+B+C+D → E = {matrixData.positions.E}</p>
          
          <p className="mt-2 border-t border-gray-600 pt-2">Primary Inner Elements:</p>
          <p>Heart/Wishes: E+G → {matrixData.innerElements.heart}</p>
          <p>Talent: B+C → {matrixData.innerElements.talent}</p>
          <p>Guard/Blockage: A+E → {matrixData.innerElements.guard}</p>
          <p>Earth Purpose: A+C → {matrixData.innerElements.earthPurpose}</p>
          
          <p className="mt-2 border-t border-gray-600 pt-2">Secondary Inner Elements:</p>
          <p>Shadow Aspects: D+E → {matrixData.innerElements.shadowAspects}</p>
          <p>Spiritual Gifts: B+E → {matrixData.innerElements.spiritualGifts}</p>
          <p>Karmic Lessons: C+D → {matrixData.innerElements.karmicLessons}</p>
          
          <p className="mt-2 border-t border-gray-600 pt-2">Love Line Elements:</p>
          <p>Past Karma: {matrixData.innerElements.pastKarma}</p>
          <p>Heart Desire: {matrixData.innerElements.heartDesire}</p>
          <p>Partnership: {matrixData.innerElements.partnershipPotential}</p>
          
          <p className="mt-2 border-t border-gray-600 pt-2">Money Line Elements:</p>
          <p>Material Karma: {matrixData.innerElements.materialKarma}</p>
          <p>Financial Talents: {matrixData.innerElements.financialTalents}</p>
          <p>Prosperity Flow: {matrixData.innerElements.prosperityFlow}</p>
          <p>Spiritual Wealth: {matrixData.innerElements.spiritualWealth}</p>
          
          <p className="mt-2 border-t border-gray-600 pt-2">Chakra System:</p>
          <p>Root: {matrixData.innerElements.rootChakra}</p>
          <p>Sacral: {matrixData.innerElements.sacralChakra}</p>
          <p>Solar Plexus: {matrixData.innerElements.solarPlexusChakra}</p>
          <p>Heart: {matrixData.innerElements.heartChakra}</p>
          <p>Throat: {matrixData.innerElements.throatChakra}</p>
          <p>Third Eye: {matrixData.innerElements.thirdEyeChakra}</p>
          <p>Crown: {matrixData.innerElements.crownChakra}</p>
          
          <p className="mt-2 border-t border-gray-600 pt-2">Ancestral Elements:</p>
          <p>Ancestral Wisdom: {matrixData.innerElements.ancestralWisdom}</p>
          <p>Ancestral Healing: {matrixData.innerElements.ancestralHealing}</p>
          <p>Paternal Line: {matrixData.innerElements.paternalLine}</p>
          <p>Maternal Line: {matrixData.innerElements.maternalLine}</p>
          <p>Balance Point: {matrixData.innerElements.balancePoint}</p>
          
          <p className="mt-2 border-t border-gray-600 pt-2">Purpose Calculations:</p>
          <p>Sky Point: {matrixData.purposes.skypoint}</p>
          <p>Earth Point: {matrixData.purposes.earthpoint}</p>
          <p>Personal Purpose: {matrixData.purposes.perspurpose}</p>
          <p>Social Purpose: {matrixData.purposes.socialpurpose}</p>
          <p>General Purpose: {matrixData.purposes.generalpurpose}</p>
          <p>Planetary Purpose: {matrixData.purposes.planetarypurpose}</p>
          
          <p className="mt-2 border-t border-gray-600 pt-2">Karmic Tail:</p>
          <p>[{matrixData.karmicTail.d1}-{matrixData.karmicTail.d2}-{matrixData.karmicTail.d}]</p>
        </div>
      </div>
    </div>
  );
};

export default MatrixOfDestinyCalculationDetails;