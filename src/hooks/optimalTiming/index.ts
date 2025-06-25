/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { calculatePlanetaryPositions, ChartAspect, PlanetPosition } from '../../utils/natalChart';
import { AstrologicalEvent } from '../../store/eventsStore';

// Import modular components
import { 
  UseOptimalTimingOptions, 
  OptimalTimingResult,
  TimingPriority
} from './types';
import { timingPriorities, priorityCriteria } from './priorities';
import { analyzeChartForPriorities } from './chartAnalyzers';
import { generateAstrologicalTitle } from './titleGenerators';
import { calculateTimeWindow, calculateTimeRange, getMoonPhase, checkBeneficsAngular, getMaleficAspects } from './astrologicalUtils';
import { getPlanetaryDignity } from '../../utils/astrologicalInterpretations';

// Real financial astrology calculations (no more simulations!)
import { 
  detectMagicFormula, 
  getJupiterFavoredSectors, 
  isJupiterFavoredTiming,
  calculateIngressWindows,
  calculateEconomicCyclePhase, 
  calculateVoidOfCourseMoon,
  isSaturnRestrictedTiming
} from './financialAstrologyCalculations';

// Helper function to enhance titles with REAL financial astrology keywords for filter detection
const enhanceWithFinancialKeywords = (title: string, chartData: any, eventDate: Date): string => {
  let enhancedTitle = title;
  
  // Magic Formula detection disabled - Jupiter-Pluto aspects not active in 2025
  // Will reactivate when astronomical conditions return ~2033-2035
  
  // REAL Jupiter sector analysis based on actual Jupiter sign
  const jupiter = chartData.planets.find((p: any) => p.name === 'jupiter');
  if (jupiter?.sign) {
    const favoredSectors = getJupiterFavoredSectors(jupiter.sign);
    
    // Check if current timing involves Jupiter-favored sectors
    if (isJupiterFavoredTiming(chartData, title, enhancedTitle)) {
      const relevantSector = favoredSectors.find(sector => 
        enhancedTitle.toLowerCase().includes(sector.toLowerCase()) ||
        (sector === 'Communication' && (enhancedTitle.toLowerCase().includes('3rd') || enhancedTitle.toLowerCase().includes('mercury'))) ||
        (sector === 'Transportation' && enhancedTitle.toLowerCase().includes('travel'))
      );
      
      if (relevantSector) {
        enhancedTitle += ` (Jupiter favored sector: ${relevantSector})`;
      }
    }
  }
  
  // REAL planetary ingress detection using actual planetary positions
  const ingressInfo = calculateIngressWindows(eventDate, chartData);
  if (ingressInfo) {
    enhancedTitle += ` (${ingressInfo.planet} ingress window - ${ingressInfo.daysFromIngress} days)`;
  }
  
  return enhancedTitle;
};


// Helper function to enhance descriptions with REAL financial astrology data
const enhanceDescriptionWithFinancialData = (description: string, chartData: any, eventDate: Date, score: number): string => {
  let enhancedDesc = description;
  
  // REAL economic cycle analysis based on outer planet positions
  const economicPhase = calculateEconomicCyclePhase(chartData, score);
  if (economicPhase === 'expansion') {
    enhancedDesc += ' Economic expansion phase indicators present.';
  } else {
    enhancedDesc += ' Economic consolidation phase - proceed with caution.';
  }
  
  // REAL void moon calculation using lunar aspects
  const voidMoonData = calculateVoidOfCourseMoon(eventDate, chartData);
  if (voidMoonData.isVoidMoon) {
    enhancedDesc += ' ⚠️ Void of Course Moon - avoid major business decisions.';
    
    if (voidMoonData.hasDeclinationSupport) {
      enhancedDesc += ' However, declination aspects provide some support.';
    }
  }
  
  // REAL Mercury retrograde status from chart data
  const mercury = chartData.planets.find((p: any) => p.name === 'mercury');
  if (mercury?.retrograde) {
    enhancedDesc += ' ⚠️ Mercury retrograde affects communication and contracts.';
  }
  
  // REAL Saturn restriction warnings
  if (isSaturnRestrictedTiming(chartData, description, enhancedDesc)) {
    const saturn = chartData.planets.find((p: any) => p.name === 'saturn');
    if (saturn?.sign) {
      enhancedDesc += ` ⚠️ Saturn in ${saturn.sign} creates restrictions in this sector.`;
    }
  }
  
  return enhancedDesc;
};

// Helper function to check if two results have similar planetary patterns
const isSimilarPlanetaryPattern = (result1: OptimalTimingResult, result2: OptimalTimingResult): boolean => {
  // Check if the main planets involved are the same by comparing significant placements
  const getSignificantPlanets = (result: OptimalTimingResult) => {
    const planets = new Set<string>();
    
    // Extract planets from description
    const planetNames = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
    const description = result.description.toLowerCase();
    
    planetNames.forEach(planet => {
      if (description.includes(planet)) {
        planets.add(planet);
      }
    });
    
    // If no planets found in description, check chart data
    if (planets.size === 0 && result.chartData?.planets) {
      // Look for planets in the same houses as mentioned in description
      const houseMatch = description.match(/(\d+)(?:st|nd|rd|th)\s+house/i);
      if (houseMatch) {
        const targetHouse = parseInt(houseMatch[1]);
        result.chartData.planets.forEach((planet: PlanetPosition) => {
          if (planet.house === targetHouse) {
            planets.add(planet.name.toLowerCase());
          }
        });
      }
    }
    
    return planets;
  };
  
  const planets1 = getSignificantPlanets(result1);
  const planets2 = getSignificantPlanets(result2);
  
  // Consider patterns similar if they share at least 50% of significant planets
  const intersection = new Set(Array.from(planets1).filter(planet => planets2.has(planet)));
  const union = new Set([...Array.from(planets1), ...Array.from(planets2)]);
  
  const similarity = intersection.size / Math.max(union.size, 1);
  return similarity >= 0.5; // At least 50% overlap
};

export const useOptimalTiming = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateOptimalTiming = async (options: UseOptimalTimingOptions): Promise<void> => {
    const { latitude, longitude, currentDate, selectedPriorities, userId, onEventsGenerated } = options;

    if (selectedPriorities.length === 0) {
      throw new Error("Please select at least one priority to generate optimal timing.");
    }

    setIsGenerating(true);
    
    try {
      let optimalDates: OptimalTimingResult[] = [];
      const targetMonth = currentDate.getMonth();
      const targetYear = currentDate.getFullYear();
      
      // Get all days in the current month
      const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
      
      // Score thresholds for different analysis methods - LOWERED for more events
      const scoreThresholds = {
        houses: 0.3,   // Lowered from 0.8 - include more house placements
        aspects: 0.2,  // Lowered from 0.5 - include more aspect combinations  
        electional: 0.3 // Lowered from 0.6 - include more electional opportunities
      };
      
      // Magic Formula events get priority regardless of base thresholds
      const MAGIC_FORMULA_PRIORITY_THRESHOLD = 2.0; // Any event with Magic Formula bonus >= 2.0 gets included
      
      // Scanning month for astrological criteria
      
      let totalCalculations = 0;
      let successfulCalculations = 0;
      let errorCount = 0;
      
      // Scan each day of the month with better error handling
      for (let day = 1; day <= daysInMonth; day++) {
        // Scanning day for optimal timing
        
        // Test every hour of the day for comprehensive coverage
        const timesToTest = [
          '00:00', '01:00', '02:00', '03:00', '04:00', '05:00',
          '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
          '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
          '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
        ];
        
        for (const timeStr of timesToTest) {
          totalCalculations++;
          
          try {
            const testDate = new Date(targetYear, targetMonth, day);
            const [hours, minutes] = timeStr.split(':').map(Number);
            testDate.setHours(hours, minutes, 0, 0);
            
            // Validate date construction
            if (testDate.getMonth() !== targetMonth || testDate.getDate() !== day) {
              // Date construction error, skip
              continue;
            }
            
            // Calculate actual planetary positions for this date/time
            const chartData = await calculatePlanetaryPositions(testDate, latitude, longitude);
            
            if (!chartData || !chartData.planets || chartData.planets.length === 0) {
              // No chart data available
              errorCount++;
              continue;
            }
            
            successfulCalculations++;
            
            // Analyze chart using ALL three timing methods
            const timingMethods: Array<'houses' | 'aspects' | 'electional'> = ['houses', 'aspects', 'electional'];
            
            for (const method of timingMethods) {
              const score = analyzeChartForPriorities(chartData, selectedPriorities, false, method, testDate);
              const threshold = scoreThresholds[method];
              
              // Check if this is a Magic Formula event (gets priority)
              const magicFormula = detectMagicFormula(chartData);
              const isMagicFormulaEvent = magicFormula.hasFullFormula || magicFormula.hasPartialFormula;
              
              // Include results that meet the score threshold OR are Magic Formula events
              if (score >= threshold || (isMagicFormulaEvent && score >= MAGIC_FORMULA_PRIORITY_THRESHOLD)) {
                // Check for combo matches first for description
                let description = '';
                const comboDescriptions: string[] = [];
                
                selectedPriorities.forEach(priority => {
                  const criteria = priorityCriteria[priority];
                  if (!criteria || !criteria.comboCriteria) return;
                  
                  criteria.comboCriteria.forEach(combo => {
                    const planetsInHouse = combo.planets.filter(planetName => {
                      const planet = chartData.planets.find((p: PlanetPosition) => p.name === planetName);
                      return planet && planet.house === combo.house;
                    });
                    
                    if (planetsInHouse.length === combo.planets.length) {
                      comboDescriptions.push(combo.description);
                    }
                  });
                });
                
                if (comboDescriptions.length > 0) {
                  description = comboDescriptions[0]; // Use the first combo description
                } else {
                  // Find the most significant aspects for description
                  const significantAspects = chartData.aspects
                    .filter((aspect: ChartAspect) => {
                      const criteria = selectedPriorities.flatMap(p => 
                        priorityCriteria[p]?.favorablePlanets || []
                      );
                      return criteria.includes(aspect.planet1) && criteria.includes(aspect.planet2);
                    })
                    .slice(0, 2);
                  
                  description = significantAspects.length > 0 
                    ? significantAspects.map((a: ChartAspect) => `${a.planet1} ${a.aspect} ${a.planet2}`).join(', ')
                    : method === 'houses' ? `Favorable house placements` : 
                      method === 'aspects' ? `Favorable planetary aspects` : 
                      `Electional timing considerations`;
                }
                
                optimalDates.push({
                  date: testDate.toISOString().split('T')[0],
                  time: timeStr,
                  score: Math.round(score),
                  description,
                  priorities: selectedPriorities,
                  chartData,
                  timingMethod: method
                });
                
                // Found optimal timing result
              }
            }
            
            // Planetary house positions tracked for validation
          } catch (error) {
            // Error during calculation, continue
            errorCount++;
            continue;
          }
          
          // Add small delay to prevent overwhelming the calculation engine
          await new Promise(resolve => setTimeout(resolve, 10));
        }
        
        // Add delay between days to prevent memory issues
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      // Sort by score and take top results
      optimalDates.sort((a, b) => b.score - a.score);
      
      // Score distribution analysis completed

      // UNIFIED TIME WINDOW CONSOLIDATION: Merge overlapping patterns into single windows
      // Consolidating time windows
      
      // Group by date and title first
      const groupedByPattern = new Map<string, OptimalTimingResult[]>();
      
      optimalDates.forEach(result => {
        const title = generateAstrologicalTitle(result.chartData, selectedPriorities, result.description, 0, 'houses');
        const key = `${result.date}-${title}`;
        
        if (!groupedByPattern.has(key)) {
          groupedByPattern.set(key, []);
        }
        groupedByPattern.get(key)!.push(result);
      });
      
      // Process each group to create unified time windows
      const consolidatedResults: OptimalTimingResult[] = [];
      
      groupedByPattern.forEach((results, patternKey) => {
        if (results.length === 1) {
          // Single result - keep as is
          consolidatedResults.push(results[0]);
          return;
        }
        
        // Sort by time
        results.sort((a, b) => {
          const timeA = parseInt(a.time.split(':')[0]);
          const timeB = parseInt(b.time.split(':')[0]);
          return timeA - timeB;
        });
        
        // Find the overall time span for this pattern
        const firstTime = results[0].time;
        const lastTime = results[results.length - 1].time;
        const lastHour = parseInt(lastTime.split(':')[0]) + 1; // Add 1 hour to get end time
        const endTime = `${lastHour.toString().padStart(2, '0')}:00`;
        
        // Get the best score from all results in this pattern
        const bestScore = Math.max(...results.map(r => r.score));
        const bestResult = results.find(r => r.score === bestScore) || results[0];
        
        // Calculate duration
        const firstHour = parseInt(firstTime.split(':')[0]);
        const duration = lastHour - firstHour;
        const durationText = duration === 1 ? '1 hour' : 
                           duration === 2 ? '2 hours' : 
                           duration === 3 ? '3 hours' : 
                           `${duration} hours`;
        
        // Create single consolidated window for this pattern
        consolidatedResults.push({
          ...bestResult,
          time: firstTime,
          timeWindow: {
            startTime: firstTime,
            endTime,
            duration: durationText
          },
          description: `${bestResult.description} (${durationText} window)`,
          score: bestScore
        });
        
        // Unified time window created
      });
      
      // Sort by score
      const optimizedResults = consolidatedResults.sort((a, b) => b.score - a.score);
      
      // Time window consolidation completed
      
      // Use optimized results instead of original
      optimalDates = optimizedResults;
      
      // IMPROVED DISTRIBUTION STRATEGY WITH MAGIC FORMULA PRIORITY
      // Now that we scan every hour, we can be more generous with results while maintaining variety
      const enhancedDistribution: OptimalTimingResult[] = [];
      
      // FIRST PRIORITY: Magic Formula events regardless of score (ultra-permissive threshold)
      const magicFormulaResults = optimalDates.filter(result => {
        const magicFormula = detectMagicFormula(result.chartData);
        return (magicFormula.hasFullFormula || magicFormula.hasPartialFormula) && result.score >= 0.5;
      });
      enhancedDistribution.push(...magicFormulaResults);
      // Magic Formula results processed
      
      // Remove Magic Formula results from further processing to avoid duplicates
      const remainingResults = optimalDates.filter(result => {
        const magicFormula = detectMagicFormula(result.chartData);
        return !(magicFormula.hasFullFormula || magicFormula.hasPartialFormula);
      });
      
      // Second, take all remaining results with scores >= 3 (excellent timing) - LOWERED
      const excellentResults = remainingResults.filter(result => result.score >= 3);
      enhancedDistribution.push(...excellentResults);
      // Excellent results identified
      
      // Then, add good results (score 1.5-3) with day variety to prevent clustering - LOWERED
      const goodResults = remainingResults.filter(result => result.score >= 1.5 && result.score < 3);
      const resultsByDay = goodResults.reduce((acc, result) => {
        const day = new Date(result.date).getDate();
        if (!acc[day]) acc[day] = [];
        acc[day].push(result);
        return acc;
      }, {} as Record<number, OptimalTimingResult[]>);
      
      // Add up to 3 good results per day to maintain variety but allow more entries
      Object.keys(resultsByDay).sort((a, b) => parseInt(a) - parseInt(b)).forEach(day => {
        const dayResults = resultsByDay[parseInt(day)].sort((a, b) => b.score - a.score);
        const usedDays = new Set(enhancedDistribution.map(r => new Date(r.date).getDate()));
        
        if (usedDays.has(parseInt(day))) {
          // Day already has excellent results, add up to 2 more good ones
          enhancedDistribution.push(...dayResults.slice(0, 2));
        } else {
          // Day has no excellent results, add up to 3 good ones
          enhancedDistribution.push(...dayResults.slice(0, 3));
        }
      });
      
      // Add decent results (score 1.0-1.5) more selectively - LOWERED
      const decentResults = remainingResults.filter(result => result.score >= 1.0 && result.score < 1.5);
      for (let day = 1; day <= daysInMonth; day++) {
        const dayHasResults = enhancedDistribution.some(r => new Date(r.date).getDate() === day);
        if (!dayHasResults) {
          const dayDecentResults = decentResults.filter(r => new Date(r.date).getDate() === day);
          if (dayDecentResults.length > 0) {
            // Add best decent result for days with no good/excellent results
            dayDecentResults.sort((a, b) => b.score - a.score);
            enhancedDistribution.push(dayDecentResults[0]);
          }
        }
      }
      
      // Finally, add some challenging results (score 0.5-1.0) to show users what to avoid - LOWERED
      const challengingResults = remainingResults.filter(result => result.score >= 0.5 && result.score < 1.0);
      const challengingByDay = challengingResults.reduce((acc, result) => {
        const day = new Date(result.date).getDate();
        if (!acc[day]) acc[day] = [];
        acc[day].push(result);
        return acc;
      }, {} as Record<number, OptimalTimingResult[]>);
      
      // Add up to 1 challenging result per day (to show what to avoid)
      Object.keys(challengingByDay).forEach(day => {
        const dayResults = challengingByDay[parseInt(day)].sort((a, b) => a.score - b.score); // Sort by worst first
        const dayNum = parseInt(day);
        const existingResults = enhancedDistribution.filter(r => new Date(r.date).getDate() === dayNum);
        
        // Only add challenging if day has less than 3 results total
        if (existingResults.length < 3 && dayResults.length > 0) {
          enhancedDistribution.push(dayResults[0]); // Add worst challenging result
        }
      });
      
      // Sort final results by date and time for better calendar display
      enhancedDistribution.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA.getTime() - dateB.getTime();
      });
      
      // Enhanced distribution summary completed
      
      // Scanning summary completed
      
      // If no results found, try with an even lower threshold as fallback
      if (enhancedDistribution.length === 0) {
        // Trying lower threshold for fallback results
        
        const fallbackResults = optimalDates.filter(result => result.score > 0);
        if (fallbackResults.length > 0) {
          fallbackResults.sort((a, b) => b.score - a.score);
          const fallbackCount = Math.min(10, fallbackResults.length);
          const selectedFallback = fallbackResults.slice(0, fallbackCount);
          
          enhancedDistribution.push(...selectedFallback);
        }
      }
      
      // Final check - if still no results, provide a helpful error
      if (enhancedDistribution.length === 0) {
        // Final debug analysis completed
        throw new Error(`No astrological alignments found in ${new Date(targetYear, targetMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} for the selected priorities. This may happen in months with challenging planetary configurations. Try different priorities, switch timing modes, or navigate to another month.`);
      }
      
      const topResults = enhancedDistribution; // Use enhanced results
      
      // Create events from results with astrological naming
      const newEvents: AstrologicalEvent[] = topResults.map((optimal, index) => {
        // Generate astrological title with financial astrology enhancements
        const title = generateAstrologicalTitle(optimal.chartData, selectedPriorities, optimal.description, index, optimal.timingMethod);
        
        // Create event date for financial enhancements
        const eventDate = new Date(optimal.date);
        
        // Add financial astrology keywords to title and description for filter detection
        const enhancedTitle = enhanceWithFinancialKeywords(title, optimal.chartData, eventDate);
        const enhancedDescription = enhanceDescriptionWithFinancialData(optimal.description, optimal.chartData, eventDate, optimal.score);
        
        // Determine event type based on score and challenging indicators
        let eventType: 'benefic' | 'challenging' | 'neutral' = 'benefic';
        if (optimal.score < 2.5 || title.includes('⚠️')) {
          eventType = 'challenging';
        } else if (optimal.score < 4.5) {
          eventType = 'neutral';
        }

        // Calculate time window for this optimal timing
        // If this is a consolidated result, use enhanced time window
        let timeWindow;
        if (optimal.timingMethod === 'combined') {
          // For consolidated results, extract the existing window from description or calculate enhanced window
          const durationMatch = optimal.description.match(/\(([^)]+)\)$/);
          if (durationMatch) {
            // Use the duration from consolidation
            const duration = durationMatch[1];
            timeWindow = {
              startTime: optimal.time,
              endTime: optimal.time, // Will be updated below
              duration
            };
            
            // Calculate proper end time based on duration
            const [hours, minutes] = optimal.time.split(':').map(Number);
            const startMinutes = hours * 60 + minutes;
            
            // Parse duration to get window size
            const durationHours = duration.includes('hour') ? parseInt(duration.match(/(\d+)\s+hour/)?.[1] || '2') : 0;
            const durationMins = duration.includes('minute') ? parseInt(duration.match(/(\d+)\s+minute/)?.[1] || '0') : 0;
            const totalDurationMinutes = durationHours * 60 + durationMins;
            
            const endMinutes = startMinutes + totalDurationMinutes;
            const endHours = Math.floor(endMinutes / 60) % 24;
            const endMins = endMinutes % 60;
            
            timeWindow.endTime = `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
          } else {
            // Fallback to enhanced window for consolidated results
            timeWindow = calculateTimeWindow(optimal.time, optimal.score, eventType);
            // Extend window for consolidated results
            timeWindow.duration = `${Math.ceil(parseFloat(timeWindow.duration.split(' ')[0]) * 1.5)} hours`;
          }
        } else {
          // Normal time window calculation
          timeWindow = calculateTimeWindow(optimal.time, optimal.score, eventType);
        }

        // Use the already created eventDate for electional data
        
        // Get Mercury retrograde status from the already-calculated chart data
        const mercury = optimal.chartData.planets.find((planet: any) => planet.name === 'mercury');
        const mercuryRetrograde = mercury?.retrograde || false;
        
        // Calculate dignified planets from chart data
        const dignifiedPlanets = optimal.chartData.planets
          .map((planet: any) => {
            const dignity = getPlanetaryDignity(planet.name.toLowerCase(), planet.sign.toLowerCase());
            if (dignity !== 'neutral') {
              return {
                planet: planet.name,
                dignity: dignity as 'exaltation' | 'rulership' | 'detriment' | 'fall' | 'neutral'
              };
            }
            return null;
          })
          .filter(Boolean);

        const electionalData = {
          mercuryStatus: mercuryRetrograde ? 'retrograde' : 'direct' as 'direct' | 'retrograde',
          moonPhase: getMoonPhase(eventDate) as 'new' | 'waxing_crescent' | 'first_quarter' | 'waxing_gibbous' | 'full' | 'waning_gibbous' | 'last_quarter' | 'waning_crescent',
          beneficsAngular: checkBeneficsAngular(optimal.chartData),
          maleficAspects: getMaleficAspects(optimal.chartData),
          prohibitions: [], // TODO: Add electional prohibitions
          dignifiedPlanets: dignifiedPlanets,
          electionalReady: optimal.score >= 6 && !mercuryRetrograde
        };

        // Extract actual aspects from chart data
        const aspectsArray = optimal.chartData.aspects
          ? optimal.chartData.aspects
              .filter((aspect: ChartAspect) => aspect.orb <= 8) // Only include tight aspects
              .map((aspect: ChartAspect) => `${aspect.planet1} ${aspect.aspect} ${aspect.planet2} (${aspect.orb.toFixed(1)}°)`)
          : [optimal.description]; // Fallback to description if no aspects

        return {
          id: `astro_${Date.now()}_${index}`,
          userId, // Add userId for database saving
          title: enhancedTitle,
          date: optimal.date,
          time: optimal.time,
          type: eventType,
          description: `Astrologically calculated optimal timing (Score: ${optimal.score}/10). ${enhancedDescription}`,
          aspects: aspectsArray,
          planetaryPositions: optimal.chartData.planets.map((p: PlanetPosition) => `${p.name} in ${p.sign} (${p.house}H)`),
          score: optimal.score,
          isGenerated: true,
          createdAt: new Date().toISOString(),
          priorities: selectedPriorities,
          chartData: optimal.chartData,
          timeWindow,
          electionalData,
          timingMethod: optimal.timingMethod
        };
      });
      
      // Generated events summary completed
      
      onEventsGenerated(newEvents);
      
    } catch (error) {
      console.error('Error generating optimal timing:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    timingPriorities,
    generateOptimalTiming,
    analyzeChartForPriorities,
    generateAstrologicalTitle
  };
};

// Re-export types and constants for backward compatibility
export type { TimingPriority } from './types';
export { timingPriorities } from './priorities';
export { calculateTimeRange } from './astrologicalUtils';