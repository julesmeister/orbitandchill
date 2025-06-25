/**
 * Configuration and theming for natal charts
 * Translated from Python natal library config.py
 */

import { ASPECTS } from './constants';

// Color schemes for different themes
export const THEMES = {
  light: {
    background: '#ffffff',
    foreground: '#000000',
    text: '#333333',
    signColors: {
      Fire: '#ff4444',     // Red
      Earth: '#8b4513',    // Brown
      Air: '#4169e1',      // Royal Blue
      Water: '#006400'     // Dark Green
    },
    aspectColors: {
      Conjunction: '#000000',
      Sextile: '#0066cc',
      Square: '#cc0000',
      Trine: '#00cc00',
      Opposition: '#cc0000',
      Semisextile: '#666666',
      Semisquare: '#ff6666',
      Sesquiquadrate: '#ff6666',
      Quincunx: '#cc6600'
    },
    houseColors: {
      angular: '#ff0000',     // Red for angular houses (1,4,7,10)
      succedent: '#00aa00',   // Green for succedent houses (2,5,8,11)
      cadent: '#0000ff'       // Blue for cadent houses (3,6,9,12)
    },
    planetColors: {
      Sun: '#ffaa00',
      Moon: '#c0c0c0',
      Mercury: '#ffff00',
      Venus: '#00ff00',
      Mars: '#ff0000',
      Jupiter: '#ff8800',
      Saturn: '#444444',
      Uranus: '#00ffff',
      Neptune: '#0066ff',
      Pluto: '#800080'
    }
  },
  dark: {
    background: '#1a1a1a',
    foreground: '#ffffff',
    text: '#e0e0e0',
    signColors: {
      Fire: '#ff6666',
      Earth: '#cd853f',
      Air: '#6495ed',
      Water: '#20b2aa'
    },
    aspectColors: {
      Conjunction: '#ffffff',
      Sextile: '#4da6ff',
      Square: '#ff4d4d',
      Trine: '#4dff4d',
      Opposition: '#ff4d4d',
      Semisextile: '#cccccc',
      Semisquare: '#ff9999',
      Sesquiquadrate: '#ff9999',
      Quincunx: '#ffaa4d'
    },
    houseColors: {
      angular: '#ff4d4d',
      succedent: '#4dff4d',
      cadent: '#4d4dff'
    },
    planetColors: {
      Sun: '#ffcc4d',
      Moon: '#e6e6e6',
      Mercury: '#ffff4d',
      Venus: '#4dff4d',
      Mars: '#ff4d4d',
      Jupiter: '#ffaa4d',
      Saturn: '#999999',
      Uranus: '#4dffff',
      Neptune: '#4d99ff',
      Pluto: '#cc4dcc'
    }
  },
  mono: {
    background: '#ffffff',
    foreground: '#000000',
    text: '#000000',
    signColors: {
      Fire: '#000000',
      Earth: '#000000',
      Air: '#000000',
      Water: '#000000'
    },
    aspectColors: {
      Conjunction: '#000000',
      Sextile: '#666666',
      Square: '#000000',
      Trine: '#333333',
      Opposition: '#000000',
      Semisextile: '#999999',
      Semisquare: '#666666',
      Sesquiquadrate: '#666666',
      Quincunx: '#666666'
    },
    houseColors: {
      angular: '#000000',
      succedent: '#333333',
      cadent: '#666666'
    },
    planetColors: {
      Sun: '#000000',
      Moon: '#000000',
      Mercury: '#000000',
      Venus: '#000000',
      Mars: '#000000',
      Jupiter: '#000000',
      Saturn: '#000000',
      Uranus: '#000000',
      Neptune: '#000000',
      Pluto: '#000000'
    }
  }
} as const;

// Default orb settings for aspects
export const DEFAULT_ORBS: Record<keyof typeof ASPECTS, number> = {
  Conjunction: 10,
  Sextile: 6,
  Square: 10,
  Trine: 10,
  Opposition: 10,
  Semisextile: 3,
  Semisquare: 3,
  Sesquiquadrate: 3,
  Quincunx: 3
};

// Tight orb settings for more precise aspects
export const TIGHT_ORBS: Record<keyof typeof ASPECTS, number> = {
  Conjunction: 8,
  Sextile: 4,
  Square: 8,
  Trine: 8,
  Opposition: 8,
  Semisextile: 2,
  Semisquare: 2,
  Sesquiquadrate: 2,
  Quincunx: 2
};

// Wide orb settings for more inclusive aspects
export const WIDE_ORBS: Record<keyof typeof ASPECTS, number> = {
  Conjunction: 12,
  Sextile: 8,
  Square: 12,
  Trine: 12,
  Opposition: 12,
  Semisextile: 4,
  Semisquare: 4,
  Sesquiquadrate: 4,
  Quincunx: 4
};

// Chart display settings
export interface DisplaySettings {
  showPlanets: {
    Sun: boolean;
    Moon: boolean;
    Mercury: boolean;
    Venus: boolean;
    Mars: boolean;
    Jupiter: boolean;
    Saturn: boolean;
    Uranus: boolean;
    Neptune: boolean;
    Pluto: boolean;
    MeanNode: boolean;
    TrueNode: boolean;
    MeanApog: boolean;
    OscuApog: boolean;
    Earth: boolean;
    Chiron: boolean;
    Pholus: boolean;
    Ceres: boolean;
    Pallas: boolean;
    Juno: boolean;
    Vesta: boolean;
  };
  showAspects: {
    Conjunction: boolean;
    Sextile: boolean;
    Square: boolean;
    Trine: boolean;
    Opposition: boolean;
    Semisextile: boolean;
    Semisquare: boolean;
    Sesquiquadrate: boolean;
    Quincunx: boolean;
  };
  showHouseNumbers: boolean;
  showSignSymbols: boolean;
  showDegreeMarkers: boolean;
  showMinorAspects: boolean;
  showRetrogrades: boolean;
  showAspectGrid: boolean;
}

// Default display settings
export const DEFAULT_DISPLAY: DisplaySettings = {
  showPlanets: {
    Sun: true,
    Moon: true,
    Mercury: true,
    Venus: true,
    Mars: true,
    Jupiter: true,
    Saturn: true,
    Uranus: true,
    Neptune: true,
    Pluto: true,
    MeanNode: true,
    TrueNode: false,
    MeanApog: false,
    OscuApog: false,
    Earth: false,
    Chiron: false,
    Pholus: false,
    Ceres: false,
    Pallas: false,
    Juno: false,
    Vesta: false
  },
  showAspects: {
    Conjunction: true,
    Sextile: true,
    Square: true,
    Trine: true,
    Opposition: true,
    Semisextile: false,
    Semisquare: false,
    Sesquiquadrate: false,
    Quincunx: false
  },
  showHouseNumbers: true,
  showSignSymbols: true,
  showDegreeMarkers: true,
  showMinorAspects: false,
  showRetrogrades: true,
  showAspectGrid: false
};

// Chart configuration class
export class ChartConfig {
  public theme: keyof typeof THEMES;
  public width: number;
  public height: number;
  public orbs: Record<keyof typeof ASPECTS, number>;
  public display: DisplaySettings;
  public houseSystem: string;
  
  constructor(
    theme: keyof typeof THEMES = 'light',
    width: number = 600,
    height: number = 600,
    orbs: Record<keyof typeof ASPECTS, number> = DEFAULT_ORBS,
    display: DisplaySettings = DEFAULT_DISPLAY,
    houseSystem: string = 'Placidus'
  ) {
    this.theme = theme;
    this.width = width;
    this.height = height;
    this.orbs = orbs;
    this.display = display;
    this.houseSystem = houseSystem;
  }

  // Get colors for current theme
  get colors() {
    return THEMES[this.theme];
  }

  // Get enabled planets
  get enabledPlanets(): Array<keyof typeof this.display.showPlanets> {
    return Object.keys(this.display.showPlanets).filter(
      planet => this.display.showPlanets[planet as keyof typeof this.display.showPlanets]
    ) as Array<keyof typeof this.display.showPlanets>;
  }

  // Get enabled aspects
  get enabledAspects(): Array<keyof typeof this.display.showAspects> {
    return Object.keys(this.display.showAspects).filter(
      aspect => this.display.showAspects[aspect as keyof typeof this.display.showAspects]
    ) as Array<keyof typeof this.display.showAspects>;
  }

  // Update orb for specific aspect
  setOrb(aspect: keyof typeof ASPECTS, orb: number): void {
    this.orbs[aspect] = orb;
  }

  // Set orb preset
  setOrbPreset(preset: 'default' | 'tight' | 'wide'): void {
    switch (preset) {
      case 'tight':
        this.orbs = { ...TIGHT_ORBS };
        break;
      case 'wide':
        this.orbs = { ...WIDE_ORBS };
        break;
      default:
        this.orbs = { ...DEFAULT_ORBS };
        break;
    }
  }

  // Toggle planet visibility
  togglePlanet(planet: keyof typeof this.display.showPlanets): void {
    this.display.showPlanets[planet] = !this.display.showPlanets[planet];
  }

  // Toggle aspect visibility
  toggleAspect(aspect: keyof typeof this.display.showAspects): void {
    this.display.showAspects[aspect] = !this.display.showAspects[aspect];
  }

  // Clone configuration
  clone(): ChartConfig {
    return new ChartConfig(
      this.theme,
      this.width,
      this.height,
      { ...this.orbs },
      JSON.parse(JSON.stringify(this.display)),
      this.houseSystem
    );
  }
}

// Preset configurations
export const PRESET_CONFIGS = {
  default: new ChartConfig(),
  minimal: new ChartConfig('light', 400, 400, TIGHT_ORBS, {
    ...DEFAULT_DISPLAY,
    showMinorAspects: false,
    showHouseNumbers: false,
    showDegreeMarkers: false
  }),
  detailed: new ChartConfig('light', 800, 800, WIDE_ORBS, {
    ...DEFAULT_DISPLAY,
    showMinorAspects: true,
    showAspectGrid: true,
    showPlanets: {
      ...DEFAULT_DISPLAY.showPlanets,
      Chiron: true,
      Ceres: true,
      Pallas: true,
      Juno: true,
      Vesta: true
    }
  }),
  darkMode: new ChartConfig('dark'),
  printFriendly: new ChartConfig('mono', 600, 600, DEFAULT_ORBS, {
    ...DEFAULT_DISPLAY,
    showMinorAspects: false
  })
};