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
export const getAgeConnections = (): AgeConnection[] => {
  return [
    {
      from: 'A',
      to: 'F', 
      ages: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      phase: 'Foundation (0-10)',
      description: 'Early childhood development and foundational personality formation'
    },
    {
      from: 'F',
      to: 'B',
      ages: [11, 12, 13, 14, 15, 16, 17, 18, 19],
      phase: 'Development (10-20)',
      description: 'Childhood to teens, educational growth and identity exploration'
    },
    {
      from: 'B',
      to: 'G',
      ages: [21, 22, 23, 24, 25, 26, 27, 28, 29],
      phase: 'Emergence (20-30)',
      description: 'Young adult emergence, career beginnings and relationship formation'
    },
    {
      from: 'G',
      to: 'C',
      ages: [31, 32, 33, 34, 35, 36, 37, 38, 39],
      phase: 'Establishment (30-40)',
      description: 'Adult establishment, family building and professional advancement'
    },
    {
      from: 'C',
      to: 'H',
      ages: [41, 42, 43, 44, 45, 46, 47, 48, 49],
      phase: 'Transition (40-50)',
      description: 'Mid-life transition, reassessment and spiritual awakening'
    },
    {
      from: 'H',
      to: 'D',
      ages: [51, 52, 53, 54, 55, 56, 57, 58, 59],
      phase: 'Wisdom (50-60)',
      description: 'Mature wisdom, mentoring others and deepening understanding'
    },
    {
      from: 'D',
      to: 'I',
      ages: [61, 62, 63, 64, 65, 66, 67, 68, 69],
      phase: 'Elder (60-70)',
      description: 'Elder phase, legacy creation and spiritual mastery'
    },
    {
      from: 'I',
      to: 'A',
      ages: [71, 72, 73, 74, 75, 76, 77, 78, 79],
      phase: 'Completion (70-80)',
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