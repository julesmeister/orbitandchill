/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

interface MagicFormulaStatusProps {
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
}

const MagicFormulaStatus: React.FC<MagicFormulaStatusProps> = ({
  astronomicalContext,
  hasActiveFormula,
  totalIndividualBonus
}) => {
  const { jupiterPlutoSeparation, isJupiterPlutoInOrb, nextJupiterPlutoConjunction, individualBonuses } = astronomicalContext;

  return (
    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-4 mb-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-purple-900 mb-2 flex items-center">
            🎭 Grace Morris Magic Formula
            <span className="ml-2 text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
              {hasActiveFormula ? 'Active' : 'Inactive'}
            </span>
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-purple-800 mb-1">Current Status</h4>
              <div className="space-y-1 text-purple-700">
                <div>Jupiter-Pluto separation: <span className="font-mono">{jupiterPlutoSeparation}°</span></div>
                <div>In aspect orb: <span className={isJupiterPlutoInOrb ? 'text-green-600 font-medium' : 'text-red-600'}>{isJupiterPlutoInOrb ? 'Yes' : 'No'}</span></div>
                <div className="text-xs text-purple-600 mt-2">{nextJupiterPlutoConjunction}</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-purple-800 mb-1">Individual Planet Bonuses</h4>
              <div className="space-y-1 text-purple-700">
                <div>Jupiter aspects: <span className="font-medium">{individualBonuses.jupiterAspects}</span> (+{(individualBonuses.jupiterAspects * 0.8).toFixed(1)} pts)</div>
                <div>Pluto aspects: <span className="font-medium">{individualBonuses.plutoAspects}</span> (+{(individualBonuses.plutoAspects * 0.6).toFixed(1)} pts)</div>
                <div className="font-medium text-purple-800 pt-1 border-t border-purple-200">
                  Total bonus: +{totalIndividualBonus.toFixed(1)} points
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="ml-4">
          <button 
            className="text-purple-600 hover:text-purple-800 transition-colors"
            title="Learn about Grace Morris Magic Formula"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      {!hasActiveFormula && (
        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-md">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-amber-800">Magic Formula Currently Inactive</h4>
              <p className="text-sm text-amber-700 mt-1">
                Jupiter and Pluto are not in aspect during this period. The core Magic Formula requires 
                Sun-Jupiter-Pluto combinations, but individual Jupiter and Pluto aspects still provide 
                scoring bonuses. Next Jupiter-Pluto conjunction cycle: ~2033-2035.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Moon Reading Feature Promotion */}
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <div className="flex items-start justify-between">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h4 className="text-sm font-medium text-blue-800">🌙 Moon Matters Most in Electional Astrology</h4>
              <p className="text-sm text-blue-700 mt-1">
                The Moon is central to electional timing, governing the flow of events. Get your personalized Moon analysis to understand your lunar patterns and optimal timing for personal activities.
              </p>
              <div className="mt-3">
                <a 
                  href="https://www.starsignsaga.com/moon-reading-info" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-2 border border-blue-300 shadow-sm text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  🌙 Get Your Moon Reading
                  <svg className="ml-2 -mr-0.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2M7 7l10 10M21 7l-4 4" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MagicFormulaStatus;