/* eslint-disable @typescript-eslint/no-unused-vars */

export interface AgeConnection {
  from: string; // Position key (A, B, C, etc.)
  to: string;   // Position key (A, B, C, etc.)
  ages: number[];
  phase: string;
  description: string;
}

/**
 * Age progression system for Matrix of Destiny
 * Maps 80-year lifecycle across 8 connection lines with 10-year intervals
 */
export interface AgeBracket {
  code: number; // Internal calculation code (1, 2, 3, 4, 5, 6, 7)
  display: string; // Display bracket (e.g., "1-2.5", "2.5-3.5")
}

export const getAgeConnections = (): (AgeConnection & { ageBrackets: AgeBracket[] })[] => {
  return [
    {
      from: 'A',
      to: 'F', 
      ages: [1, 2, 3, 4, 5, 6, 7], // Internal calculation codes
      ageBrackets: [
        { code: 1, display: "1-2.5" },
        { code: 2, display: "2.5-3.5" },
        { code: 3, display: "3.5-4" },
        { code: 4, display: "4-5" },
        { code: 5, display: "6-7.5" },
        { code: 6, display: "7.5-8.5" },
        { code: 7, display: "8.5-9" }
      ],
      phase: 'Foundation (0-9)',
      description: 'Early childhood development and foundational personality formation'
    },
    {
      from: 'F',
      to: 'B',
      ages: [11, 12, 13, 14, 15, 16, 17],
      ageBrackets: [
        { code: 11, display: "11-12.5" },
        { code: 12, display: "12.5-13.5" },
        { code: 13, display: "13.5-14" },
        { code: 14, display: "14-15" },
        { code: 15, display: "16-17.5" },
        { code: 16, display: "17.5-18.5" },
        { code: 17, display: "18.5-19" }
      ],
      phase: 'Development (10-19)',
      description: 'Childhood to teens, educational growth and identity exploration'
    },
    {
      from: 'B',
      to: 'G',
      ages: [21, 22, 23, 24, 25, 26, 27],
      ageBrackets: [
        { code: 21, display: "21-22.5" },
        { code: 22, display: "22.5-23.5" },
        { code: 23, display: "23.5-24" },
        { code: 24, display: "24-25" },
        { code: 25, display: "26-27.5" },
        { code: 26, display: "27.5-28.5" },
        { code: 27, display: "28.5-29" }
      ],
      phase: 'Emergence (20-29)',
      description: 'Young adult emergence, career beginnings and relationship formation'
    },
    {
      from: 'G',
      to: 'C',
      ages: [31, 32, 33, 34, 35, 36, 37],
      ageBrackets: [
        { code: 31, display: "31-32.5" },
        { code: 32, display: "32.5-33.5" },
        { code: 33, display: "33.5-34" },
        { code: 34, display: "34-35" },
        { code: 35, display: "36-37.5" },
        { code: 36, display: "37.5-38.5" },
        { code: 37, display: "38.5-39" }
      ],
      phase: 'Establishment (30-39)',
      description: 'Adult establishment, family building and professional advancement'
    },
    {
      from: 'C',
      to: 'H',
      ages: [41, 42, 43, 44, 45, 46, 47],
      ageBrackets: [
        { code: 41, display: "41-42.5" },
        { code: 42, display: "42.5-43.5" },
        { code: 43, display: "43.5-44" },
        { code: 44, display: "44-45" },
        { code: 45, display: "46-47.5" },
        { code: 46, display: "47.5-48.5" },
        { code: 47, display: "48.5-49" }
      ],
      phase: 'Transition (40-49)',
      description: 'Mid-life transition, reassessment and spiritual awakening'
    },
    {
      from: 'H',
      to: 'D',
      ages: [51, 52, 53, 54, 55, 56, 57],
      ageBrackets: [
        { code: 51, display: "51-52.5" },
        { code: 52, display: "52.5-53.5" },
        { code: 53, display: "53.5-54" },
        { code: 54, display: "54-55" },
        { code: 55, display: "56-57.5" },
        { code: 56, display: "57.5-58.5" },
        { code: 57, display: "58.5-59" }
      ],
      phase: 'Wisdom (50-59)',
      description: 'Mature wisdom, mentoring others and deepening understanding'
    },
    {
      from: 'D',
      to: 'I',
      ages: [61, 62, 63, 64, 65, 66, 67],
      ageBrackets: [
        { code: 61, display: "61-62.5" },
        { code: 62, display: "62.5-63.5" },
        { code: 63, display: "63.5-64" },
        { code: 64, display: "64-65" },
        { code: 65, display: "66-67.5" },
        { code: 66, display: "67.5-68.5" },
        { code: 67, display: "68.5-69" }
      ],
      phase: 'Elder (60-69)',
      description: 'Elder phase, legacy creation and spiritual mastery'
    },
    {
      from: 'I',
      to: 'A',
      ages: [71, 72, 73, 74, 75, 76, 77],
      ageBrackets: [
        { code: 71, display: "71-72.5" },
        { code: 72, display: "72.5-73.5" },
        { code: 73, display: "73.5-74" },
        { code: 74, display: "74-75" },
        { code: 75, display: "76-77.5" },
        { code: 76, display: "77.5-78.5" },
        { code: 77, display: "78.5-79" }
      ],
      phase: 'Completion (70-79)',
      description: 'Life completion, wisdom transmission and cycle preparation'
    }
  ];
};

/**
 * Main circle age markers (10-year interval points)
 */
export interface MainCircleAge {
  position: string;
  age: number;
  phase: string;
  description: string;
  direction: string;
}

export const getMainCircleAges = (): MainCircleAge[] => {
  return [
    {
      position: 'A',
      age: 0,
      phase: 'Birth',
      description: 'Birth and early foundation',
      direction: 'West'
    },
    {
      position: 'F',
      age: 10,
      phase: 'Childhood',
      description: 'Childhood development',
      direction: 'Northwest'
    },
    {
      position: 'B',
      age: 20,
      phase: 'Youth',
      description: 'Young adult emergence',
      direction: 'North'
    },
    {
      position: 'G',
      age: 30,
      phase: 'Adult',
      description: 'Adult establishment',
      direction: 'Northeast'
    },
    {
      position: 'C',
      age: 40,
      phase: 'Midlife',
      description: 'Mid-life transition',
      direction: 'East'
    },
    {
      position: 'H',
      age: 50,
      phase: 'Maturity',
      description: 'Mature wisdom',
      direction: 'Southeast'
    },
    {
      position: 'D',
      age: 60,
      phase: 'Elder',
      description: 'Elder phase',
      direction: 'South'
    },
    {
      position: 'I',
      age: 70,
      phase: 'Completion',
      description: 'Life completion',
      direction: 'Southwest'
    }
  ];
};

/**
 * Get age connection by positions
 */
export const getAgeConnectionByPositions = (from: string, to: string): AgeConnection | null => {
  const connections = getAgeConnections();
  return connections.find(conn => conn.from === from && conn.to === to) || null;
};

/**
 * Get main circle age by position
 */
export const getMainCircleAgeByPosition = (position: string): MainCircleAge | null => {
  const ages = getMainCircleAges();
  return ages.find(age => age.position === position) || null;
};

/**
 * Get current life phase based on age
 */
export const getCurrentLifePhase = (currentAge: number): {
  phase: string;
  description: string;
  connection?: AgeConnection;
} => {
  const connections = getAgeConnections();
  
  // Find which connection contains this age
  for (const connection of connections) {
    const minAge = Math.min(...connection.ages);
    const maxAge = Math.max(...connection.ages);
    
    if (currentAge >= minAge && currentAge <= maxAge) {
      return {
        phase: connection.phase,
        description: connection.description,
        connection
      };
    }
  }
  
  // Handle edge cases
  if (currentAge < 1) {
    return {
      phase: 'Birth (0)',
      description: 'Birth and early foundation'
    };
  }
  
  if (currentAge >= 80) {
    return {
      phase: 'Beyond (80+)',
      description: 'Transcendence and cycle renewal'
    };
  }
  
  return {
    phase: 'Unknown',
    description: 'Age phase not defined'
  };
};