/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Hook for detecting horary significators (querent and quesited)
 */

import { useMemo } from 'react';
import { TRADITIONAL_SIGN_RULERS, getSignNameByIndex, type PlanetName } from '../utils/astrology/signRulers';
import type { NatalChartData } from '../utils/natalChart';
import type { HoraryQuestion } from '../store/horaryStore';

export interface SignificatorResult {
  querentRuler: PlanetName | null;
  quesitedRuler: PlanetName | null;
  getSignificatorStatus: (planetName: string) => string | null;
}

/**
 * Hook to detect significators based on chart data and question
 */
export const useSignificatorDetection = (
  chartData: NatalChartData | null,
  question: HoraryQuestion | null
): SignificatorResult => {
  
  return useMemo(() => {
    if (!chartData?.houses) {
      return {
        querentRuler: null,
        quesitedRuler: null,
        getSignificatorStatus: () => null
      };
    }

    // Simple significator logic - same as PlanetMarker component
    const mockSignificators = { querent: 1, quesited: 7 };

    // Create house rulers array from actual chart data
    const houseRulers = chartData.houses.map(house => {
      const signIndex = Math.floor(house.cusp / 30);
      const signName = getSignNameByIndex(signIndex);
      return {
        house: house.number,
        ruler: TRADITIONAL_SIGN_RULERS[signName]
      };
    });

    const querentRuler = houseRulers.find(h => h.house === mockSignificators.querent)?.ruler || null;
    const quesitedRuler = houseRulers.find(h => h.house === mockSignificators.quesited)?.ruler || null;

    const getSignificatorStatus = (planetName: string): string | null => {
      const normalizedPlanetName = planetName.toLowerCase();
      
      if (normalizedPlanetName === querentRuler?.toLowerCase()) {
        return 'Querent (1st House ruler)';
      }
      
      if (normalizedPlanetName === quesitedRuler?.toLowerCase()) {
        return 'Quesited (7th House ruler)';
      }
      
      return null;
    };

    return {
      querentRuler,
      quesitedRuler,
      getSignificatorStatus
    };
  }, [chartData, question]);
};