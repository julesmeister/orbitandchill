export interface NatalChart {
  id: string;
  userId: string;
  name?: string; // Custom name for the chart
  chartData: string; // SVG or JSON data from natal library
  chartType: "natal" | "transit" | "synastry" | "composite";
  createdAt: string;
  updatedAt: string;
  metadata?: {
    title?: string;
    description?: string;
    theme?: "light" | "dark" | "mono";
    width?: number;
    height?: number;
  };
  birthData: {
    dateOfBirth: string;
    timeOfBirth: string;
    locationOfBirth: string;
    coordinates: {
      lat: string;
      lon: string;
    };
  };
  isPublic: boolean;
  shareUrl?: string;
}

export interface ChartAspect {
  planet1: string;
  planet2: string;
  aspectType: string;
  orb: number;
  isExact: boolean;
}

export interface PlanetPosition {
  planet: string;
  sign: string;
  house: number;
  degree: number;
  isRetrograde: boolean;
}

export interface ChartCalculations {
  planets: PlanetPosition[];
  aspects: ChartAspect[];
  houses: {
    houseNumber: number;
    sign: string;
    degree: number;
  }[];
  ascendant: {
    sign: string;
    degree: number;
  };
  midheaven: {
    sign: string;
    degree: number;
  };
}