/* eslint-disable @typescript-eslint/no-unused-vars */

export interface MatrixPosition {
  key: string;
  label: string;
  description: string;
}

export interface MatrixPositions {
  main: MatrixPosition[];
  ancestral: MatrixPosition[];
  lifeAspects: MatrixPosition[];
  soulPath: MatrixPosition[];
  special: MatrixPosition[];
  generational: MatrixPosition[];
}

export interface MatrixValues {
  [key: string]: number;
}

export interface MockMatrixData {
  positions: Record<string, number>;
  centers: {
    E: number;
    J: number;
  };
  diagonalSquare: {
    A: number;
    B: number;
    C: number;
    D: number;
  };
  straightSquare: {
    F: number;
    G: number;
    H: number;
    I: number;
  };
  karmicTail: {
    d1: number;
    d2: number;
    d: number;
  };
  innerElements: Record<string, number>;
  purposes: Record<string, number>;
}

export interface Position {
  x: number;
  y: number;
}

export interface MockPositions {
  [key: string]: Position;
}

export interface MockResponsive {
  centerX: number;
  centerY: number;
  radius: number;
  circleRadius: {
    outer: number;
    center: number;
  };
  fontSize: {
    outer: number;
    center: number;
  };
  innerElements: {
    heart: { radius: number; offsetX: number; offsetY: number };
    talent: { radius: number; offsetX: number; offsetY: number };
    guard: { radius: number; offsetX: number; offsetY: number };
    earthPurpose: { radius: number; offsetX: number; offsetY: number };
    karmicTail: { 
      leftOffsetX: number; 
      centerOffsetX: number; 
      rightOffsetX: number; 
      offsetY: number; 
      radius: number;
    };
  };
  ageDot: { 
    radius: number; 
    fontSize: number; 
    labelOffset: number;
  };
}

export interface MockDebugPositions {
  [key: string]: Position | { x1: number; y1: number; x2: number; y2: number };
}

export interface MockHandlers {
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
  handleClick: () => void;
  handleDragStart: () => void;
  handleDragMove: () => void;
  handleDragEnd: () => void;
  setSelectedPosition: () => void;
}

export type TemplateType = 'destiny-matrix' | 'natal-chart' | 'custom';