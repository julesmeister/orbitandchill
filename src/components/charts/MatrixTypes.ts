/* eslint-disable @typescript-eslint/no-unused-vars */

export interface MatrixOfDestinyProps {
  birthData: {
    dateOfBirth: string;
    timeOfBirth: string;
    locationOfBirth: string;
    coordinates?: { lat: string; lon: string };
  };
  personName?: string;
}

export interface Position {
  x: number;
  y: number;
  id: string;
  label: string;
  type: 'diagonal' | 'straight' | 'center';
}

export interface DebugPositions {
  K: { x: number; y: number };
  L: { x: number; y: number };
  M: { x: number; y: number };
  N: { x: number; y: number };
  V: { x: number; y: number };
  F: { x: number; y: number };
  G: { x: number; y: number };
  H: { x: number; y: number };
  I: { x: number; y: number };
  HEART_POWER: { x: number; y: number };
  TALENT: { x: number; y: number };
  GUARD: { x: number; y: number };
  EARTH_PURPOSE: { x: number; y: number };
  F1: { x: number; y: number };
  F2: { x: number; y: number };
  G1: { x: number; y: number };
  G2: { x: number; y: number };
  H1: { x: number; y: number };
  H2: { x: number; y: number };
  I1: { x: number; y: number };
  I2: { x: number; y: number };
  O: { x: number; y: number };
  P: { x: number; y: number };
  Q: { x: number; y: number };
  R: { x: number; y: number };
  J: { x: number; y: number };
  diagonal: { x1: number; y1: number; x2: number; y2: number };
  FUTURE_CHILDREN?: { x: number; y: number };
  POWER_OF_ANCESTORS?: { x: number; y: number };
  T?: { x: number; y: number };
}

export interface ResponsiveValues {
  centerX: number;
  centerY: number;
  radius: number;
  circleRadius: { center: number; outer: number };
  fontSize: { center: number; outer: number };
  ageDot: { radius: number; fontSize: number; labelOffset: number };
  innerElements: {
    talent: { offsetX: number; offsetY: number; radius: number };
    guard: { offsetX: number; offsetY: number; radius: number };
    earthPurpose: { offsetX: number; offsetY: number; radius: number };
    heart: { offsetX: number; offsetY: number; radius: number };
    karmicTail: { leftOffsetX: number; centerOffsetX: number; rightOffsetX: number; offsetY: number; radius: number };
  };
}