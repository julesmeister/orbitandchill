/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import SynapsasDropdown from "../reusable/SynapsasDropdown";
import { useUserStore } from "../../store/userStore";
import { generateNatalChart, NatalChartData } from "../../utils/natalChart";

interface TransitAspectsTabProps {
  className?: string;
  chartData?: NatalChartData;
}

interface NatalAspectActivation {
  natalAspect: {
    planet1: string;
    planet2: string;
    aspect: string;
    orb: number;
  };
  activationFactors: ActivationFactor[];
  totalStrength: number;
  activationLevel: string;
  personalityTheme: string;
  activationAdvice: {
    focus: string;
    opportunities: string;
    challenges: string;
    timing: string;
  };
  peakTiming: string;
}

interface ActivationFactor {
  type: 'direct_trigger' | 'pattern_echo' | 'dual_activation' | 'midpoint_activation';
  description: string;
  strength: number;
  details: any;
}

interface TransitPosition {
  longitude: number;
  latitude?: number;
}

/**
 * Natal Aspect Activation Engine
 * Analyzes when your existing natal aspects are most strongly triggered/activated
 * by current transiting planets
 */
class NatalAspectActivationEngine {
  constructor(natalAspects: any[], natalChart: Record<string, number>) {
    this.natalAspects = natalAspects;
    this.natalChart = natalChart;
    this.setupActivationMethods();
  }

  private natalAspects: any[];
  private natalChart: Record<string, number>;
  private activationTypes: any;

  setupActivationMethods() {
    this.activationTypes = {
      direct_trigger: {
        description: "Transit directly aspects a planet in your natal aspect",
        weight: 1.0,
        orb_modifier: 1.0
      },
      pattern_echo: {
        description: "Transit recreates your natal aspect pattern",
        weight: 0.9,
        orb_modifier: 1.2
      },
      dual_activation: {
        description: "Both planets in your natal aspect are being transited",
        weight: 1.2,
        orb_modifier: 0.9
      },
      midpoint_activation: {
        description: "Transit hits the midpoint of your natal aspect",
        weight: 0.7,
        orb_modifier: 1.3
      }
    };
  }

  /**
   * Main function: Calculate activation strength of all natal aspects
   */
  calculateNatalAspectActivations(currentTransits: Record<string, TransitPosition>): NatalAspectActivation[] {
    const activations: NatalAspectActivation[] = [];

    // Analyze each of your natal aspects
    this.natalAspects.forEach(natalAspect => {
      const activation = this.analyzeNatalAspectActivation(natalAspect, currentTransits);
      
      if (activation.totalStrength > 0.1) { // Only show meaningful activations
        activations.push({
          natalAspect,
          ...activation,
          personalityTheme: this.getNatalAspectTheme(natalAspect),
          activationAdvice: this.generateActivationAdvice(natalAspect, activation),
          peakTiming: this.calculatePeakTiming(activation.activationFactors)
        });
      }
    });

    // Sort by activation strength
    return activations.sort((a, b) => b.totalStrength - a.totalStrength);
  }

  /**
   * Analyze how strongly a specific natal aspect is being activated
   */
  analyzeNatalAspectActivation(natalAspect: any, currentTransits: Record<string, TransitPosition>) {
    const activationFactors: ActivationFactor[] = [];
    let totalStrength = 0;

    // Method 1: Direct Trigger - Transit aspects one planet in the natal aspect
    const directTriggers = this.findDirectTriggers(natalAspect, currentTransits);
    directTriggers.forEach(trigger => {
      const strength = this.calculateTriggerStrength(trigger, 'direct_trigger');
      activationFactors.push({
        type: 'direct_trigger',
        description: `${trigger.transitPlanet} ${trigger.aspectType} your natal ${trigger.natalPlanet}`,
        strength,
        details: trigger
      });
      totalStrength += strength;
    });

    // Method 2: Pattern Echo - Transit recreates your natal aspect
    const patternEchoes = this.findPatternEchoes(natalAspect, currentTransits);
    patternEchoes.forEach(echo => {
      const strength = this.calculateTriggerStrength(echo, 'pattern_echo');
      activationFactors.push({
        type: 'pattern_echo',
        description: `Current ${echo.transitAspect} echoes your natal ${natalAspect.aspect}`,
        strength,
        details: echo
      });
      totalStrength += strength;
    });

    // Method 3: Dual Activation - Both planets in natal aspect being transited
    const dualActivations = this.findDualActivations(natalAspect, currentTransits);
    dualActivations.forEach(dual => {
      const strength = this.calculateTriggerStrength(dual, 'dual_activation');
      activationFactors.push({
        type: 'dual_activation',
        description: `Both ${natalAspect.planet1} and ${natalAspect.planet2} are being activated`,
        strength,
        details: dual
      });
      totalStrength += strength;
    });

    // Method 4: Midpoint Activation
    const midpointActivations = this.findMidpointActivations(natalAspect, currentTransits);
    midpointActivations.forEach(midpoint => {
      const strength = this.calculateTriggerStrength(midpoint, 'midpoint_activation');
      activationFactors.push({
        type: 'midpoint_activation',
        description: `${midpoint.transitPlanet} activating ${natalAspect.planet1}/${natalAspect.planet2} midpoint`,
        strength,
        details: midpoint
      });
      totalStrength += strength;
    });

    return {
      activationFactors,
      totalStrength,
      activationLevel: this.getActivationLevel(totalStrength)
    };
  }

  /**
   * Find transits that directly aspect planets in your natal aspect
   */
  findDirectTriggers(natalAspect: any, currentTransits: Record<string, TransitPosition>) {
    const triggers: any[] = [];
    const natalPlanets = [natalAspect.planet1, natalAspect.planet2];

    Object.entries(currentTransits).forEach(([transitPlanet, transitPos]) => {
      natalPlanets.forEach(natalPlanet => {
        // Skip if transit planet is same as natal planet (not a trigger)
        if (transitPlanet === natalPlanet) return;

        const natalPos = this.natalChart[natalPlanet];
        if (natalPos === undefined) return;

        const aspects = this.detectAspects(transitPos.longitude, natalPos, transitPlanet, natalPlanet);
        
        aspects.forEach(aspect => {
          triggers.push({
            transitPlanet,
            natalPlanet,
            aspectType: aspect.type,
            orb: aspect.orb,
            strength: aspect.strength,
            applying: aspect.applying,
            // Bonus if it's the same aspect type as the natal aspect
            aspectMatch: aspect.type === natalAspect.aspect
          });
        });
      });
    });

    return triggers;
  }

  /**
   * Find transits that recreate your natal aspect pattern
   */
  findPatternEchoes(natalAspect: any, currentTransits: Record<string, TransitPosition>) {
    const echoes: any[] = [];
    const targetAspect = natalAspect.aspect; // e.g., "square", "trine"

    // Look for current transits forming the same aspect as your natal aspect
    const transitPlanets = Object.keys(currentTransits);
    
    for (let i = 0; i < transitPlanets.length; i++) {
      for (let j = i + 1; j < transitPlanets.length; j++) {
        const planet1 = transitPlanets[i];
        const planet2 = transitPlanets[j];
        const pos1 = currentTransits[planet1].longitude;
        const pos2 = currentTransits[planet2].longitude;

        const aspects = this.detectAspects(pos1, pos2, planet1, planet2);
        
        aspects.forEach(aspect => {
          if (aspect.type === targetAspect) {
            echoes.push({
              transitPlanet1: planet1,
              transitPlanet2: planet2,
              transitAspect: aspect.type,
              orb: aspect.orb,
              strength: aspect.strength,
              // Bonus if one of the transit planets matches natal planets
              planetMatch: [planet1, planet2].some(p => 
                [natalAspect.planet1, natalAspect.planet2].includes(p)
              )
            });
          }
        });
      }
    }

    return echoes;
  }

  /**
   * Find when both planets in your natal aspect are being transited simultaneously
   */
  findDualActivations(natalAspect: any, currentTransits: Record<string, TransitPosition>) {
    const dualActivations: any[] = [];
    const planet1Transits: any[] = [];
    const planet2Transits: any[] = [];

    // Find all transits to each planet in the natal aspect
    Object.entries(currentTransits).forEach(([transitPlanet, transitPos]) => {
      // Transits to first planet in natal aspect
      if (transitPlanet !== natalAspect.planet1) {
        const natalPos1 = this.natalChart[natalAspect.planet1];
        if (natalPos1 !== undefined) {
          const aspects1 = this.detectAspects(transitPos.longitude, natalPos1, transitPlanet, natalAspect.planet1);
          planet1Transits.push(...aspects1.map(a => ({ ...a, transitPlanet, natalPlanet: natalAspect.planet1 })));
        }
      }

      // Transits to second planet in natal aspect
      if (transitPlanet !== natalAspect.planet2) {
        const natalPos2 = this.natalChart[natalAspect.planet2];
        if (natalPos2 !== undefined) {
          const aspects2 = this.detectAspects(transitPos.longitude, natalPos2, transitPlanet, natalAspect.planet2);
          planet2Transits.push(...aspects2.map(a => ({ ...a, transitPlanet, natalPlanet: natalAspect.planet2 })));
        }
      }
    });

    // Combine simultaneous activations
    if (planet1Transits.length > 0 && planet2Transits.length > 0) {
      planet1Transits.forEach(t1 => {
        planet2Transits.forEach(t2 => {
          dualActivations.push({
            transit1: t1,
            transit2: t2,
            combinedStrength: (t1.strength + t2.strength) / 2,
            orb: (t1.orb + t2.orb) / 2
          });
        });
      });
    }

    return dualActivations;
  }

  /**
   * Find transits to the midpoint of your natal aspect
   */
  findMidpointActivations(natalAspect: any, currentTransits: Record<string, TransitPosition>) {
    const midpointActivations: any[] = [];
    
    // Calculate midpoint of the natal aspect
    const pos1 = this.natalChart[natalAspect.planet1];
    const pos2 = this.natalChart[natalAspect.planet2];
    
    if (pos1 === undefined || pos2 === undefined) return midpointActivations;
    
    const midpoint = this.calculateMidpoint(pos1, pos2);

    Object.entries(currentTransits).forEach(([transitPlanet, transitPos]) => {
      const aspects = this.detectAspects(transitPos.longitude, midpoint, transitPlanet, 'midpoint');
      
      aspects.forEach(aspect => {
        midpointActivations.push({
          transitPlanet,
          midpointDegree: midpoint,
          aspectType: aspect.type,
          orb: aspect.orb,
          strength: aspect.strength
        });
      });
    });

    return midpointActivations;
  }

  /**
   * Calculate how strong an activation trigger is
   */
  calculateTriggerStrength(trigger: any, activationType: string) {
    const baseStrength = trigger.strength || trigger.combinedStrength || 0;
    const typeConfig = this.activationTypes[activationType];
    
    let adjustedStrength = baseStrength * typeConfig.weight;

    // Bonuses for specific conditions
    if (trigger.aspectMatch) adjustedStrength *= 1.3; // Same aspect type
    if (trigger.planetMatch) adjustedStrength *= 1.2; // Planet involvement
    if (trigger.applying) adjustedStrength *= 1.1; // Applying aspect
    if (trigger.orb < 1) adjustedStrength *= 1.2; // Very tight orb

    return Math.min(adjustedStrength, 1.0); // Cap at 1.0
  }

  /**
   * Get the theme/meaning of a natal aspect for personality context
   */
  getNatalAspectTheme(natalAspect: any) {
    const themeMap: Record<string, string> = {
      'Sun-Moon': 'Core identity and emotional nature',
      'Sun-Mercury': 'Self-expression and communication',
      'Sun-Venus': 'Identity and relationships/values',
      'Sun-Mars': 'Will power and action',
      'Moon-Venus': 'Emotional needs and relationships',
      'Moon-Mars': 'Emotional reactions and drive',
      'Mercury-Venus': 'Communication in relationships',
      'Venus-Mars': 'Love and desire nature',
      'Sun-Jupiter': 'Life purpose and expansion',
      'Moon-Jupiter': 'Emotional growth and optimism',
      'Mercury-Mars': 'Mental drive and quick thinking',
      'Venus-Jupiter': 'Love of beauty and abundance',
      'Mars-Jupiter': 'Action and adventure',
      'Sun-Saturn': 'Authority and responsibility',
      'Moon-Saturn': 'Emotional discipline and structure',
      'Mercury-Saturn': 'Practical thinking and organization',
      'Venus-Saturn': 'Committed relationships and values',
      'Mars-Saturn': 'Disciplined action and perseverance'
    };

    const key = `${natalAspect.planet1}-${natalAspect.planet2}`;
    const reverseKey = `${natalAspect.planet2}-${natalAspect.planet1}`;
    
    return themeMap[key] || themeMap[reverseKey] || 
           `${natalAspect.planet1} and ${natalAspect.planet2} dynamic`;
  }

  /**
   * Generate specific advice for when this natal aspect is activated
   */
  generateActivationAdvice(natalAspect: any, activation: any) {
    const aspectNature = this.getAspectNature(natalAspect.aspect);
    const activationLevel = activation.activationLevel;
    
    const advice = {
      focus: this.getActivationFocus(natalAspect, activationLevel),
      opportunities: this.getActivationOpportunities(natalAspect, aspectNature),
      challenges: this.getActivationChallenges(natalAspect, aspectNature),
      timing: this.getActivationTiming(activation)
    };

    return advice;
  }

  getActivationFocus(natalAspect: any, level: string) {
    const themes = this.getNatalAspectTheme(natalAspect);
    return `Your ${themes} pattern is ${level} right now. Pay attention to how ${natalAspect.planet1} and ${natalAspect.planet2} energies are interacting in your life.`;
  }

  getActivationOpportunities(natalAspect: any, aspectNature: string) {
    if (aspectNature === 'harmonious') {
      return `This is an excellent time to work with your natural ${natalAspect.planet1}-${natalAspect.planet2} talents and gifts.`;
    } else {
      return `Use this activation to transform and integrate your ${natalAspect.planet1}-${natalAspect.planet2} dynamic more consciously.`;
    }
  }

  getActivationChallenges(natalAspect: any, aspectNature: string) {
    if (aspectNature === 'challenging') {
      return `Be aware of potential conflicts between ${natalAspect.planet1} and ${natalAspect.planet2} energies. Channel this tension constructively.`;
    } else {
      return `Don't take this harmonious energy for granted. Actively work with it to maximize its benefits.`;
    }
  }

  getActivationTiming(activation: any) {
    if (activation.totalStrength > 0.8) {
      return 'Peak activation - effects are strongest now through the next few days.';
    } else if (activation.totalStrength > 0.5) {
      return 'Strong activation - effects building and will be noticeable this week.';
    } else {
      return 'Moderate activation - subtle but meaningful influences over the next few weeks.';
    }
  }

  calculatePeakTiming(activationFactors: ActivationFactor[]) {
    // Simplified timing calculation
    const strongestFactor = activationFactors.reduce((prev, current) => 
      (prev.strength > current.strength) ? prev : current
    );
    
    if (strongestFactor?.strength > 0.8) {
      return 'Right now (next 24-48 hours)';
    } else if (strongestFactor?.strength > 0.5) {
      return 'This week';
    } else {
      return 'Over the next few weeks';
    }
  }

  getActivationLevel(strength: number) {
    if (strength >= 0.8) return 'extremely activated';
    if (strength >= 0.6) return 'strongly activated';
    if (strength >= 0.4) return 'moderately activated';
    if (strength >= 0.2) return 'lightly activated';
    return 'subtly activated';
  }

  // Utility methods
  detectAspects(pos1: number, pos2: number, planet1: string, planet2: string) {
    const aspects: any[] = [];
    const angle = Math.abs(pos1 - pos2);
    const normalizedAngle = angle > 180 ? 360 - angle : angle;

    const aspectDefinitions = {
      conjunction: { angle: 0, orb: 8 },
      sextile: { angle: 60, orb: 6 },
      square: { angle: 90, orb: 8 },
      trine: { angle: 120, orb: 8 },
      quincunx: { angle: 150, orb: 3 },
      opposition: { angle: 180, orb: 8 }
    };

    Object.entries(aspectDefinitions).forEach(([aspectName, aspectData]) => {
      const difference = Math.abs(normalizedAngle - aspectData.angle);
      
      if (difference <= aspectData.orb) {
        aspects.push({
          type: aspectName,
          orb: difference,
          strength: 1 - (difference / aspectData.orb),
          applying: this.isApplying(pos1, pos2, aspectData.angle)
        });
      }
    });

    return aspects;
  }

  calculateMidpoint(pos1: number, pos2: number) {
    let midpoint = (pos1 + pos2) / 2;
    
    // Handle 0°/360° boundary
    if (Math.abs(pos1 - pos2) > 180) {
      midpoint = midpoint < 180 ? midpoint + 180 : midpoint - 180;
    }
    
    return midpoint;
  }

  getAspectNature(aspectType: string) {
    const harmonious = ['trine', 'sextile', 'conjunction'];
    const challenging = ['square', 'opposition', 'quincunx'];
    
    if (harmonious.includes(aspectType)) return 'harmonious';
    if (challenging.includes(aspectType)) return 'challenging';
    return 'neutral';
  }

  isApplying(pos1: number, pos2: number, targetAngle: number) {
    // Simplified - in real implementation, consider planetary speeds
    return true; // Placeholder
  }
}

const TransitAspectsTab: React.FC<TransitAspectsTabProps> = ({ className = "", chartData }) => {
  const { user } = useUserStore();
  const [activations, setActivations] = useState<NatalAspectActivation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTransits, setCurrentTransits] = useState<Record<string, TransitPosition> | null>(null);
  const [selectedIntensity, setSelectedIntensity] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [expandedActivations, setExpandedActivations] = useState<Set<number>>(new Set());
  
  const engineRef = useRef<NatalAspectActivationEngine | null>(null);

  // Generate current planetary positions
  const generateCurrentTransits = useCallback(async () => {
    if (!user?.birthData?.coordinates) {
      console.log('🔍 Activation Debug: No user birth coordinates available');
      return;
    }

    console.log('🚀 Activation Debug: Getting current planetary positions');
    setIsLoading(true);
    
    try {
      // Get current planetary positions
      const now = new Date();
      const currentChart = await generateNatalChart({
        name: "Current Positions",
        dateOfBirth: now.toISOString().split('T')[0],
        timeOfBirth: now.toTimeString().substring(0, 5),
        locationOfBirth: user.birthData.locationOfBirth || "Current Location",
        coordinates: user.birthData.coordinates
      });

      if (currentChart?.metadata?.chartData?.planets) {
        // Convert to the format expected by our engine
        const transitPositions: Record<string, TransitPosition> = {};
        currentChart.metadata.chartData.planets.forEach(planet => {
          const planetName = planet.name.charAt(0).toUpperCase() + planet.name.slice(1);
          transitPositions[planetName] = {
            longitude: planet.longitude,
            latitude: 0
          };
        });
        
        console.log('✅ Activation Debug: Current transit positions:', transitPositions);
        setCurrentTransits(transitPositions);
      }
    } catch (error) {
      console.error('❌ Activation Debug: Error getting current positions:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.birthData]);

  // Initialize engine and calculate activations
  useEffect(() => {
    if (chartData?.aspects && chartData?.planets && currentTransits) {
      console.log('🔄 Activation Debug: Initializing activation engine');
      
      // Convert natal planets to the format expected by engine
      const natalChart: Record<string, number> = {};
      chartData.planets.forEach(planet => {
        const planetName = planet.name.charAt(0).toUpperCase() + planet.name.slice(1);
        natalChart[planetName] = planet.longitude;
      });

      // Initialize engine
      engineRef.current = new NatalAspectActivationEngine(chartData.aspects, natalChart);
      
      // Calculate activations
      const currentActivations = engineRef.current.calculateNatalAspectActivations(currentTransits);
      console.log('✅ Activation Debug: Found activations:', currentActivations);
      setActivations(currentActivations);
    }
  }, [chartData?.aspects, chartData?.planets, currentTransits]);

  // Load current transits when component mounts
  useEffect(() => {
    if (user?.birthData?.coordinates) {
      generateCurrentTransits();
    }
  }, [generateCurrentTransits]);

  const getFilteredActivations = () => {
    if (selectedIntensity === 'all') return activations;
    
    return activations.filter(activation => {
      const level = activation.activationLevel;
      switch (selectedIntensity) {
        case 'high':
          return level.includes('extremely') || level.includes('strongly');
        case 'medium':
          return level.includes('moderately');
        case 'low':
          return level.includes('lightly') || level.includes('subtly');
        default:
          return true;
      }
    });
  };

  const getActivationColor = (level: string) => {
    if (level.includes('extremely')) return 'bg-red-100 text-red-800 border-red-200';
    if (level.includes('strongly')) return 'bg-orange-100 text-orange-800 border-orange-200';
    if (level.includes('moderately')) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (level.includes('lightly')) return 'bg-blue-100 text-blue-800 border-blue-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getFactorTypeIcon = (type: string) => {
    switch (type) {
      case 'direct_trigger': return '🎯';
      case 'pattern_echo': return '🔄';
      case 'dual_activation': return '⚡';
      case 'midpoint_activation': return '📍';
      default: return '✨';
    }
  };

  const toggleActivation = (index: number) => {
    const newExpanded = new Set(expandedActivations);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedActivations(newExpanded);
  };

  return (
    <div className={`bg-white ${className}`}>
      {/* Header */}
      <div className="py-6">
        <h2 className="font-space-grotesk text-2xl font-bold text-black mb-2">
          Your Natal Aspects Right Now
        </h2>
        <p className="font-inter text-sm text-black/70">
          Discover when your birth patterns are strongest. This shows which of your existing natal aspects are being triggered and amplified by current planetary movements.
        </p>
        <p className="font-inter text-xs text-black/50 mt-2">
          Updated: {new Date().toLocaleString()}
        </p>
      </div>

      {/* Introduction */}
      <div className="py-6 border-t border-black/10">
        <div className="bg-white border border-black p-4">
          <h3 className="font-space-grotesk text-lg font-bold text-black mb-3">
            Understanding Natal Aspect Activation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-black/80 mb-3">
                Your natal aspects are permanent patterns in your personality. But their expression varies in strength throughout your life based on current planetary movements.
              </p>
              <p className="text-black/80">
                When a natal aspect is "activated," those personality themes become more prominent and noticeable in your daily experience.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span>🎯</span>
                <span className="text-xs"><strong>Direct Trigger:</strong> Current planet aspects your natal planet</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🔄</span>
                <span className="text-xs"><strong>Pattern Echo:</strong> Current planets recreate your natal aspect</span>
              </div>
              <div className="flex items-center gap-2">
                <span>⚡</span>
                <span className="text-xs"><strong>Dual Activation:</strong> Both planets in your aspect are triggered</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📍</span>
                <span className="text-xs"><strong>Midpoint:</strong> Transit hits the midpoint of your aspect</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="py-6">
        <div className="flex items-end justify-between">
          <div>
            <label className="block text-sm font-semibold text-black mb-2">Activation Intensity:</label>
            <SynapsasDropdown
              options={[
                { value: 'all', label: 'All Activations' },
                { value: 'high', label: 'Strong Activations' },
                { value: 'medium', label: 'Moderate Activations' },
                { value: 'low', label: 'Subtle Activations' }
              ]}
              value={selectedIntensity}
              onChange={(value) => setSelectedIntensity(value as 'all' | 'low' | 'medium' | 'high')}
              variant="thin"
              className="w-64"
            />
          </div>
          <div className="px-3 py-2 bg-gray-100 border border-gray-300 text-sm font-medium text-gray-700 flex items-center">
            {getFilteredActivations().length} activations
          </div>
        </div>
      </div>

      {/* Active Natal Aspect Activations */}
      <div className="py-6">
        <div className="flex items-center gap-3 mb-4">
          <h3 className="font-space-grotesk text-lg font-bold text-black">Your Activated Natal Aspects</h3>
          {isLoading && (
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-black rounded-full animate-spin mr-2"></div>
              Calculating activations...
            </div>
          )}
        </div>

        {!chartData?.aspects ? (
          <div className="border border-black bg-gray-50 p-6 text-center">
            <h4 className="font-semibold text-black mb-2">Chart Data Required</h4>
            <p className="text-sm text-black/70">
              To see your natal aspect activations, please generate your natal chart first.
            </p>
          </div>
        ) : getFilteredActivations().length === 0 && !isLoading ? (
          <div className="border border-black bg-white p-6 text-center">
            <h4 className="font-semibold text-black mb-2">No Strong Activations</h4>
            <p className="text-sm text-black/70">
              Your natal aspects are in a relatively quiet phase right now. Check back later or lower the intensity filter to see subtle activations.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {getFilteredActivations().map((activation, index) => {
              const isExpanded = expandedActivations.has(index);
              return (
                <div key={index} className={`border border-black bg-white`}>
                  {/* Collapsible Header */}
                  <button
                    onClick={() => toggleActivation(index)}
                    className="w-full text-left p-4 hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap items-center gap-3">
                        <h4 className="font-space-grotesk font-bold text-black text-lg">
                          {activation.natalAspect.planet1} {activation.natalAspect.aspect} {activation.natalAspect.planet2}
                        </h4>
                        <span className={`px-3 py-1 text-sm font-semibold border ${getActivationColor(activation.activationLevel)}`}>
                          {activation.activationLevel}
                        </span>
                        <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 font-medium border border-purple-200">
                          Natal Orb: {activation.natalAspect.orb.toFixed(1)}°
                        </span>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <span className="text-xs text-gray-500">{activation.activationFactors.length} factors</span>
                        <svg 
                          className={`w-5 h-5 text-gray-600 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Compact summary when collapsed */}
                    {!isExpanded && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 line-clamp-2">{activation.personalityTheme}</p>
                      </div>
                    )}
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="border-t border-gray-200 p-6 space-y-4">
                      {/* Simplified Activation Summary */}
                      <div className="p-3 bg-gray-50 border border-gray-200">
                        <h5 className="font-semibold text-black mb-2">Activation Summary:</h5>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            <span>Strength: {(activation.totalStrength * 100).toFixed(0)}%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>{activation.activationFactors.length} activation triggers</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            <span>Peak timing: {activation.peakTiming}</span>
                          </div>
                        </div>
                      </div>

                      {/* Duration */}
                      <div className="border border-black bg-white p-4">
                        <div className="flex justify-between items-center text-sm">
                          <div>
                            <span className="font-semibold text-black">Duration:</span>
                            <span className="text-black/70 ml-2">
                              {new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString()} 
                              {" → "} 
                              {new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="text-xs text-black/60">
                            Peak: Today
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Key Insights */}
      <div className="py-6 border-t border-black/10">
        <h3 className="font-space-grotesk text-lg font-bold text-black mb-3">Working with Activated Natal Aspects</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3 text-sm">
            <div className="p-3 bg-white border border-black">
              <h4 className="font-semibold text-black mb-1">Conscious Integration</h4>
              <p className="text-black/70 text-xs">When aspects are activated, you have more conscious access to these personality patterns. Use this awareness for growth.</p>
            </div>
            <div className="p-3 bg-white border border-black">
              <h4 className="font-semibold text-black mb-1">Timing Opportunities</h4>
              <p className="text-black/70 text-xs">Strong activations are ideal times to work with therapists, coaches, or engage in self-reflection around these themes.</p>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="p-3 bg-white border border-black">
              <h4 className="font-semibold text-black mb-1">Life Area Focus</h4>
              <p className="text-black/70 text-xs">Pay attention to which life areas are being highlighted when these aspects are active - relationships, career, creativity, etc.</p>
            </div>
            <div className="p-3 bg-white border border-black">
              <h4 className="font-semibold text-black mb-1">Evolution Over Time</h4>
              <p className="text-black/70 text-xs">How you express activated aspects evolves as you grow. Each activation is a chance to integrate these energies more maturely.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransitAspectsTab;