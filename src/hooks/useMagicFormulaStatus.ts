/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import { calculatePlanetaryPositions } from '../utils/natalChart';
import { detectMagicFormula } from '../hooks/optimalTiming/financialAstrologyCalculations';

interface MagicFormulaStatus {
  astronomicalContext: {
    jupiterPlutoSeparation: number;
    isJupiterPlutoInOrb: boolean;
    nextJupiterPlutoConjunction: string;
    individualBonuses: {
      jupiterAspects: number;
      plutoAspects: number;
    };
  };
  hasActiveFormula: boolean;
  totalIndividualBonus: number;
  isLoading: boolean;
  error: string | null;
}

export const useMagicFormulaStatus = (
  latitude?: number, 
  longitude?: number
): MagicFormulaStatus => {
  const [status, setStatus] = useState<MagicFormulaStatus>({
    astronomicalContext: {
      jupiterPlutoSeparation: 0,
      isJupiterPlutoInOrb: false,
      nextJupiterPlutoConjunction: 'Loading...',
      individualBonuses: {
        jupiterAspects: 0,
        plutoAspects: 0
      }
    },
    hasActiveFormula: false,
    totalIndividualBonus: 0,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const calculateCurrentStatus = async () => {
      try {
        setStatus(prev => ({ ...prev, isLoading: true, error: null }));

        // Use provided coordinates or default to NYC
        const lat = latitude || 40.7128;
        const lon = longitude || -74.0060;
        const currentDate = new Date();

        // Calculate current planetary positions
        const chartData = await calculatePlanetaryPositions(currentDate, lat, lon);
        
        // Get Magic Formula analysis
        const magicFormula = detectMagicFormula(chartData);
        
        // Calculate total individual bonuses
        const jupiterBonus = Math.min(magicFormula.astronomicalContext.individualBonuses.jupiterAspects, 3) * 0.8;
        const plutoBonus = Math.min(magicFormula.astronomicalContext.individualBonuses.plutoAspects, 2) * 0.6;
        const totalBonus = jupiterBonus + plutoBonus;

        setStatus({
          astronomicalContext: magicFormula.astronomicalContext,
          hasActiveFormula: magicFormula.hasFullFormula || magicFormula.hasPartialFormula,
          totalIndividualBonus: totalBonus,
          isLoading: false,
          error: null
        });

      } catch (error) {
        console.error('Error calculating Magic Formula status:', error);
        setStatus(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to calculate Magic Formula status'
        }));
      }
    };

    calculateCurrentStatus();
  }, [latitude, longitude]);

  return status;
};