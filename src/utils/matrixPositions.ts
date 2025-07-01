/* eslint-disable @typescript-eslint/no-unused-vars */
import { getElementLabel } from "./matrixElementDefinitions";

export interface Position {
  x: number;
  y: number;
  id: string;
  label: string;
  type: "diagonal" | "straight" | "center";
}

/**
 * Calculate SVG positions for the Matrix of Destiny octagram
 */
export const calculateMatrixPositions = (
  centerX: number,
  centerY: number,
  radius: number
): Record<string, Position> => {
  const cos45 = Math.cos(Math.PI / 4);
  const sin45 = Math.sin(Math.PI / 4);

  return {
    // Diagonal square (rhombus) corners - Personal energies
    A: {
      x: centerX - radius,
      y: centerY,
      id: "A",
      label: getElementLabel("A"),
      type: "diagonal",
    },
    B: {
      x: centerX,
      y: centerY - radius,
      id: "B",
      label: getElementLabel("B"),
      type: "diagonal",
    },
    C: {
      x: centerX + radius,
      y: centerY,
      id: "C",
      label: getElementLabel("C"),
      type: "diagonal",
    },
    D: {
      x: centerX,
      y: centerY + radius,
      id: "D",
      label: getElementLabel("D"),
      type: "diagonal",
    },

    // Straight square corners - Ancestral energies
    F: {
      x: centerX - radius * cos45,
      y: centerY - radius * sin45,
      id: "F",
      label: getElementLabel("F"),
      type: "straight",
    },
    G: {
      x: centerX + radius * cos45,
      y: centerY - radius * sin45,
      id: "G",
      label: getElementLabel("G"),
      type: "straight",
    },
    H: {
      x: centerX + radius * cos45,
      y: centerY + radius * sin45,
      id: "H",
      label: getElementLabel("H"),
      type: "straight",
    },
    I: {
      x: centerX - radius * cos45,
      y: centerY + radius * sin45,
      id: "I",
      label: getElementLabel("I"),
      type: "straight",
    },

    // Centers
    E: {
      x: centerX,
      y: centerY,
      id: "E",
      label: getElementLabel("E"),
      type: "center",
    },
    J: {
      x: centerX,
      y: centerY,
      id: "J",
      label: getElementLabel("J"),
      type: "center",
    },

    // Male/Female Generational Line Inner Circles - positioned along diagonal lines
    F1: {
      x: centerX - 160,
      y: centerY - 160,
      id: "F1",
      label: "Dad's Talents",
      type: "center",
    },
    F2: {
      x: centerX - 106,
      y: centerY - 106,
      id: "F2",
      label: "Dad's Talents",
      type: "center",
    },
    G1: {
      x: centerX + 160,
      y: centerY - 160,
      id: "G1",
      label: "Mom's Talents",
      type: "center",
    },
    G2: {
      x: centerX + 106,
      y: centerY - 106,
      id: "G2",
      label: "Mom's Talents",
      type: "center",
    },
    H1: {
      x: centerX - 160,
      y: centerY + 160,
      id: "H1",
      label: "Mom's Karma",
      type: "center",
    },
    H2: {
      x: centerX - 106,
      y: centerY + 106,
      id: "H2",
      label: "Mom's Karma",
      type: "center",
    },
    I1: {
      x: centerX + 160,
      y: centerY + 160,
      id: "I1",
      label: "Dad's Karma",
      type: "center",
    },
    I2: {
      x: centerX + 106,
      y: centerY + 106,
      id: "I2",
      label: "Dad's Karma",
      type: "center",
    },
  };
};

/**
 * Matrix position configuration for easy reference
 */
export const MATRIX_POSITION_CONFIG = {
  diagonal: {
    A: { label: "Reputation", description: "Natural character and talents" },
    B: {
      label: "Inspiration",
      description: "Emotional nature and inner world",
    },
    C: { label: "Money Block", description: "Life purpose and destiny path" },
    D: {
      label: "Biggest Obstacle in Life",
      description: "Lessons to learn in this lifetime",
    },
  },
  straight: {
    F: {
      label: "Dad's Talents",
      description: "Ancestral influences and gifts",
    },
    G: { label: "Mom's Talents", description: "Natural abilities and skills" },
    H: {
      label: "Mom's Karma",
      description: "Lessons related to material world",
    },
    I: { label: "Dad's Karma", description: "Spiritual growth and evolution" },
  },
  centers: {
    E: { label: "Comfort Zone", description: "Core essence and identity" },
    J: {
      label: "Past Life Mistakes",
      description: "Family dynamics and heritage",
    },
  },
} as const;

/**
 * Get position configuration by key
 */
export const getPositionConfig = (key: string) => {
  const allConfigs = {
    ...MATRIX_POSITION_CONFIG.diagonal,
    ...MATRIX_POSITION_CONFIG.straight,
    ...MATRIX_POSITION_CONFIG.centers,
  };
  return allConfigs[key as keyof typeof allConfigs];
};
