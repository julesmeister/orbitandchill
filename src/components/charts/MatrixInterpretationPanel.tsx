/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { getArcanaInfo } from '../../utils/arcanaInfo';
import { getMatrixInterpretation } from '../../utils/matrixInterpretations';
import { getElementLabel } from '../../utils/matrixElementDefinitions';
import { MatrixCalculation } from '../../utils/matrixCalculations';

interface MatrixInterpretationPanelProps {
  selectedPosition: string;
  matrixData: MatrixCalculation;
  hoveredPosition?: any; // Add this to access the hovered position data
}

const MatrixInterpretationPanel: React.FC<MatrixInterpretationPanelProps> = ({
  selectedPosition,
  matrixData,
  hoveredPosition
}) => {
  // Helper function to map position IDs to Matrix aspect types
  const getPositionAspectType = (positionId: string): 'incomeStreams' | 'moneyBlocks' | 'workLifeBalance' | 'ingredientsForLove' | 'pastLifeIncome' | 'sexuality' | 'powerOfAncestors' | 'momsTalents' | 'dadsTalents' | 'comfortZone' | 'pastLifeMoneyMindset' | 'selfExpression' | 'inspiration' | 'higherSelf' | 'heartsWishes' | 'dadsKarma' | 'momsKarma' | 'presentLifeTask' | 'pastLifeMistakes' | 'futureChildren' | 'asAParent' | 'destiny' | 'biggestObstacle' | 'reputation' | null => {
    const aspectMap: Record<string, 'incomeStreams' | 'moneyBlocks' | 'workLifeBalance' | 'ingredientsForLove' | 'pastLifeIncome' | 'sexuality' | 'powerOfAncestors' | 'momsTalents' | 'dadsTalents' | 'comfortZone' | 'pastLifeMoneyMindset' | 'selfExpression' | 'inspiration' | 'higherSelf' | 'heartsWishes' | 'dadsKarma' | 'momsKarma' | 'presentLifeTask' | 'pastLifeMistakes' | 'futureChildren' | 'asAParent' | 'destiny' | 'biggestObstacle' | 'reputation'> = {
      // INCOME & MONEY RELATED POSITIONS
      'K': 'incomeStreams',        // Income Streams (original mapping)
      'C': 'moneyBlocks',          // Money Block - financial obstacles and patterns
      'Q': 'pastLifeMoneyMindset', // Past Life Money Mindset - more specific interpretation
      'N': 'pastLifeIncome',       // Past Life Income (original mapping)

      // INDIVIDUAL LIFE PURPOSE POSITIONS
      'L': 'workLifeBalance',      // Work Life Balance (original mapping)
      'R': 'presentLifeTask',      // Present Life Task - specific interpretation
      'D': 'biggestObstacle',      // Biggest Obstacle in Life - specific interpretation  
      'A': 'reputation',           // Reputation - specific interpretation
      'E': 'comfortZone',          // Comfort Zone - specific interpretation
      'P': 'higherSelf',           // Higher Self - specific interpretation
      'T': 'selfExpression',       // Self Expression - specific interpretation
      'O': 'asAParent',            // As a Parent - specific interpretation

      // LOVE & RELATIONSHIPS POSITIONS
      'M': 'ingredientsForLove',   // Ingredients for Love (original mapping) 
      'B': 'inspiration',          // Inspiration - specific interpretation
      'FUTURE_CHILDREN': 'futureChildren', // Future Children - specific interpretation
      'TALENT': 'heartsWishes',    // Heart's Desire/Wishes - specific interpretation

      // SEXUALITY & INTIMATE ENERGY
      'V': 'sexuality',            // Sexuality (original mapping)
      'S': 'sexuality',            // Relationship sexuality and passion
      'U': 'sexuality',            // Intimate connection and sexual expression
      'W': 'sexuality',            // Physical attraction and magnetism
      'X': 'sexuality',            // Sexual healing and transformation

      // ANCESTRAL & FAMILY LINEAGE
      'POWER_OF_ANCESTORS': 'powerOfAncestors', // Power of Ancestors (original mapping)
      'J': 'pastLifeMistakes',     // Past Life Mistakes - specific interpretation

      // DAD'S TALENTS - PATERNAL LINEAGE GIFTS
      'F': 'dadsTalents',          // Dad's Talents - paternal lineage
      'F1': 'dadsTalents',         // Dad's Talents (outer)
      'F2': 'dadsTalents',         // Dad's Talents (inner)

      // MOM'S TALENTS - MATERNAL LINEAGE GIFTS  
      'G': 'momsTalents',          // Mom's Talents - maternal lineage
      'G1': 'momsTalents',         // Mom's Talents (outer)
      'G2': 'momsTalents',         // Mom's Talents (inner)

      // DAD'S KARMA - PATERNAL PATTERNS
      'H': 'dadsKarma',            // Dad's Karma - specific interpretation
      'H1': 'dadsKarma',           // Dad's Karma (outer)
      'H2': 'dadsKarma',           // Dad's Karma (inner)
      
      // MOM'S KARMA - MATERNAL PATTERNS
      'I': 'momsKarma',            // Mom's Karma - specific interpretation
      'I1': 'momsKarma',           // Mom's Karma (outer)
      'I2': 'momsKarma',           // Mom's Karma (inner)

      // HEART & SPIRITUAL PURPOSE
      'HEART_WISHES': 'heartsWishes', // Heart/Wishes - specific interpretation

      // AGE DESTINY POSITIONS - All age dots use destiny interpretations
      // These will be dynamically matched by any position starting with 'AGE_'
    };

    // Handle age destiny positions (AGE_*)
    if (positionId.startsWith('AGE_')) {
      return 'destiny';
    }

    return aspectMap[positionId] || null;
  };

  // Get the arcana number for this position
  let arcanaNumber: number | null = null;

  // Handle age destiny positions first
  if (selectedPosition.startsWith('AGE_') && hoveredPosition?.number) {
    arcanaNumber = hoveredPosition.number;
  } else if (matrixData.positions && selectedPosition in matrixData.positions) {
    arcanaNumber = matrixData.positions[selectedPosition as keyof typeof matrixData.positions];
  } else if (matrixData.centers && selectedPosition in matrixData.centers) {
    arcanaNumber = matrixData.centers[selectedPosition as keyof typeof matrixData.centers];
  } else if (matrixData.innerElements) {
    // Map inner element keys to their properties
    const innerElementMap: Record<string, keyof typeof matrixData.innerElements> = {
      'POWER_OF_ANCESTORS': 'heart',
      'TALENT': 'talent',
      'FUTURE_CHILDREN': 'guard',
      'HEART_WISHES': 'earthPurpose'
    };

    const innerElementKey = innerElementMap[selectedPosition];
    if (innerElementKey && matrixData.innerElements[innerElementKey]) {
      arcanaNumber = matrixData.innerElements[innerElementKey];
    }
  }

  if (!arcanaNumber) return null;

  const arcana = getArcanaInfo(arcanaNumber);
  const positionName = selectedPosition.startsWith('AGE_') && hoveredPosition?.label 
    ? hoveredPosition.label 
    : getElementLabel(selectedPosition); // Use the same function as tooltips
  const aspectType = getPositionAspectType(selectedPosition);
  const matrixInterpretation = aspectType ? getMatrixInterpretation(aspectType, arcanaNumber) : null;

  return (
    <div className="margin-large padding-global">
      <div className="container-large">
        {/* Synapsas-style Card Design */}
        <div className="bg-white border-2 border-black">
          {/* Header Section with Synapsas Colors */}
          <div
            className="px-8 py-6 border-b-2 border-black"
            style={{ backgroundColor: '#f0e3ff' }} // Synapsas light purple
          >
            <div className="flex items-center space-x-6">
              <div
                className="w-20 h-20 border-2 border-black flex items-center justify-center text-white font-black"
                style={{
                  backgroundColor: arcana.color
                }}
              >
                <span className="text-2xl font-space-grotesk">{arcanaNumber}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-space-grotesk text-3xl font-black text-black mb-1">
                  {positionName}
                </h3>
                <p className="font-open-sans text-xl text-black/70 mb-2">Arcana {arcanaNumber}: {arcana.name}</p>
                {aspectType && (
                  <div
                    className="inline-flex items-center px-3 py-1 text-sm font-semibold text-black border-2 border-black"
                    style={{
                      backgroundColor: '#fffbed' // Synapsas light yellow
                    }}
                  >
                    {aspectType.replace(/([A-Z])/g, ' $1').trim().replace(/^./, match => match.toUpperCase())}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Basic Arcana Description */}
            <div className="margin-medium">
              <h4 className="font-space-grotesk text-xl font-bold text-black margin-small">
                General Meaning
              </h4>
              <p className="font-open-sans text-black leading-relaxed text-lg">
                {arcana.description}
              </p>
            </div>

            {/* Matrix-Specific Interpretation */}
            {matrixInterpretation && (
              <div className="space-y-6">
                <h4 className="font-space-grotesk text-xl font-bold text-black margin-medium">
                  Matrix of Destiny Interpretation
                </h4>

                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Overview & Strengths */}
                  <div className="space-y-6">
                    <div
                      className="p-6 border-2 border-black"
                      style={{
                        backgroundColor: '#91e4ff' // Synapsas blue
                      }}
                    >
                      <h5 className="font-space-grotesk font-bold text-black margin-small">Overview</h5>
                      <p className="font-open-sans text-black leading-relaxed">
                        {matrixInterpretation.general}
                      </p>
                    </div>

                    <div
                      className="p-6 border-2 border-black"
                      style={{
                        backgroundColor: '#1bff6f' // Synapsas green
                      }}
                    >
                      <h5 className="font-space-grotesk font-bold text-black margin-small">Strengths</h5>
                      <p className="font-open-sans text-black leading-relaxed">
                        {matrixInterpretation.positive}
                      </p>
                    </div>
                  </div>

                  {/* Challenges & Guidance */}
                  <div className="space-y-6">
                    <div
                      className="p-6 border-2 border-black"
                      style={{
                        backgroundColor: '#f2e356' // Synapsas yellow
                      }}
                    >
                      <h5 className="font-space-grotesk font-bold text-black margin-small">Challenges</h5>
                      <p className="font-open-sans text-black leading-relaxed">
                        {matrixInterpretation.challenge}
                      </p>
                    </div>

                    <div
                      className="p-6 border-2 border-black"
                      style={{
                        backgroundColor: '#fccbf2' // Synapsas purple
                      }}
                    >
                      <h5 className="font-space-grotesk font-bold text-black margin-small">Guidance</h5>
                      <p className="font-open-sans text-black leading-relaxed">
                        {matrixInterpretation.advice}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* No Matrix Interpretation Available */}
            {!matrixInterpretation && aspectType === null && (
              <div
                className="p-6 border-2 border-black"
                style={{
                  backgroundColor: '#e7fff6' // Synapsas light green
                }}
              >
                <div className="flex items-start space-x-3">
                  <div
                    className="w-6 h-6 border-2 border-black flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{
                      backgroundColor: '#19181a' // Synapsas black
                    }}
                  >
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-space-grotesk font-bold text-black margin-small">Foundational Element</h5>
                    <p className="font-open-sans text-black leading-relaxed">
                      This position represents a foundational element in your Matrix of Destiny.
                      While specific interpretations for this aspect are still being developed,
                      the general arcana meaning above provides valuable insight into this energy in your life.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatrixInterpretationPanel;