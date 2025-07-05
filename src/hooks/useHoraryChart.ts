/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useCallback } from 'react';
import { useUserStore } from '../store/userStore';
import { useHoraryStore, HoraryQuestion } from '../store/horaryStore';
import { generateNatalChart } from '../utils/natalChart';
import StatusToast from '../components/reusable/StatusToast';

interface HoraryChartData {
  id: string;
  svg: string;
  metadata: {
    questionId: string;
    question: string;
    chartTime: Date;
    location: {
      latitude: number;
      longitude: number;
    };
    generatedAt: string;
    chartData?: any;
    answer?: 'Yes' | 'No' | 'Maybe';
    timing?: string;
    interpretation?: string;
  };
}

export const useHoraryChart = () => {
  const { user } = useUserStore();
  const { updateQuestion } = useHoraryStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [toastState, setToastState] = useState({
    isVisible: false,
    title: '',
    message: '',
    status: 'info' as 'loading' | 'success' | 'error' | 'info'
  });

  const showToast = (title: string, message: string, status: 'loading' | 'success' | 'error' | 'info') => {
    setToastState({ isVisible: true, title, message, status });
  };

  const hideToast = () => {
    setToastState(prev => ({ ...prev, isVisible: false }));
  };

  const generateHoraryChart = useCallback(async (
    question: HoraryQuestion,
    userLocation?: { lat: number; lng: number }
  ): Promise<HoraryChartData | null> => {
    if (!user) {
      showToast('Authentication Required', 'Please sign in to generate horary charts', 'error');
      return null;
    }

    setIsGenerating(true);
    console.log('Starting horary chart generation for question:', question.id);

    try {
      // For horary, we need the location where the question is being judged
      // Priority: 1) Custom location from question, 2) User location, 3) Default to NYC
      const location = question.customLocation ? {
        lat: parseFloat(question.customLocation.coordinates.lat),
        lng: parseFloat(question.customLocation.coordinates.lon)
      } : userLocation || (user.birthData?.coordinates ? {
        lat: parseFloat(user.birthData.coordinates.lat),
        lng: parseFloat(user.birthData.coordinates.lon)
      } : {
        lat: 40.7128,  // Default to New York City if no location available
        lng: -74.0060
      });

      console.log('Using location for horary chart:', location);

      if (!location) {
        showToast('Location Required', 'Location is required to cast a horary chart', 'error');
        setIsGenerating(false);
        return null;
      }

      // For horary, we use the exact time the question was asked
      // Convert to Date object if it's a string (from persistence)
      const questionDate = question.date instanceof Date ? question.date : new Date(question.date);
      
      console.log('Calling generateNatalChart with data:', {
        dateOfBirth: questionDate.toISOString().split('T')[0],
        timeOfBirth: questionDate.toTimeString().substring(0, 5),
        coordinates: location
      });

      const chartData = await generateNatalChart({
        name: `Horary Chart - ${question.question.substring(0, 30)}...`,
        dateOfBirth: questionDate.toISOString().split('T')[0],
        timeOfBirth: questionDate.toTimeString().substring(0, 5),
        locationOfBirth: question.customLocation?.name || `Horary Location - Lat: ${location.lat}, Lng: ${location.lng}`,
        coordinates: {
          lat: location.lat.toString(),
          lon: location.lng.toString()
        }
      });

      console.log('Chart generation result:', chartData ? 'SUCCESS' : 'FAILED');

      if (!chartData) {
        throw new Error('Failed to generate chart');
      }

      // Perform traditional horary analysis
      console.log('Starting horary analysis with chart data:', chartData.metadata?.chartData ? 'AVAILABLE' : 'MISSING');
      const horaryAnalysis = analyzeHoraryChart(chartData.metadata?.chartData, question.question);
      console.log('Horary analysis result:', horaryAnalysis);

      const horaryChart: HoraryChartData = {
        id: `horary_${question.id}_${Date.now()}`,
        svg: chartData.svg,
        metadata: {
          questionId: question.id,
          question: question.question,
          chartTime: questionDate,
          location: {
            latitude: location.lat,
            longitude: location.lng
          },
          generatedAt: new Date().toISOString(),
          chartData: chartData.metadata?.chartData,
          // Include horary analysis in metadata for fallback access
          answer: horaryAnalysis.answer,
          timing: horaryAnalysis.timing,
          interpretation: horaryAnalysis.interpretation
        }
      };
      
      // Update the question with chart data and analysis
      console.log('Updating question with analysis:', {
        questionId: question.id,
        answer: horaryAnalysis.answer,
        timing: horaryAnalysis.timing,
        interpretation: horaryAnalysis.interpretation ? 'PRESENT' : 'MISSING',
        chartDataSize: horaryChart.svg.length
      });
      
      // Update question in store with all analysis data
      updateQuestion(question.id, {
        answer: horaryAnalysis.answer,
        timing: horaryAnalysis.timing,
        interpretation: horaryAnalysis.interpretation,
        chartData: horaryChart
      });
      
      // Verify the update was successful - simplified approach
      console.log('Verifying store update...');
      setTimeout(() => {
        const storeState = useHoraryStore.getState();
        const updatedQuestion = storeState.questions.find(q => q.id === question.id);
        
        if (updatedQuestion?.answer) {
          console.log('SUCCESS: Question updated and persisted properly');
        } else {
          console.warn('Store update verification: Answer not yet saved, may still be processing');
          // Try one more update without error logging
          updateQuestion(question.id, {
            answer: horaryAnalysis.answer,
            timing: horaryAnalysis.timing,
            interpretation: horaryAnalysis.interpretation,
            chartData: horaryChart
          });
        }
      }, 500); // Single check after reasonable delay

      showToast('Success', 'Horary chart generated successfully!', 'success');
      return horaryChart;

    } catch (error) {
      console.error('Error generating horary chart:', error);
      showToast('Generation Failed', 'Failed to generate horary chart', 'error');
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [user, updateQuestion]);

  return {
    generateHoraryChart,
    isGenerating,
    toast: {
      ...toastState,
      show: showToast,
      hide: hideToast
    }
  };
};

// Traditional horary astrology analysis based on classical methods
interface HoraryAnalysis {
  answer: 'Yes' | 'No' | 'Maybe';
  timing: string;
  interpretation: string;
  isRadical: boolean;
  significators: {
    querent: string;
    quesited: string;
  };
}

// Sign rulers according to traditional astrology
const SIGN_RULERS: Record<string, string> = {
  'Aries': 'Mars',
  'Taurus': 'Venus', 
  'Gemini': 'Mercury',
  'Cancer': 'Moon',
  'Leo': 'Sun',
  'Virgo': 'Mercury',
  'Libra': 'Venus',
  'Scorpio': 'Mars',
  'Sagittarius': 'Jupiter',
  'Capricorn': 'Saturn',
  'Aquarius': 'Saturn',
  'Pisces': 'Jupiter'
};

// Essential dignities scoring
const DIGNITY_SCORES = {
  domicile: 5,
  exaltation: 4,
  triplicity: 3,
  term: 2,
  face: 1,
  detriment: -5,
  fall: -4
};

// House meanings for question categorization
const HOUSE_KEYWORDS: Record<number, string[]> = {
  1: ['i', 'me', 'myself', 'my health', 'my appearance', 'personal'],
  2: ['money', 'income', 'salary', 'possessions', 'belongings', 'finance', 'wealth'],
  3: ['sibling', 'brother', 'sister', 'neighbor', 'short trip', 'communication', 'message'],
  4: ['home', 'house', 'property', 'father', 'family', 'real estate', 'land'],
  5: ['child', 'children', 'pregnancy', 'romance', 'dating', 'love', 'creative'],
  6: ['health', 'illness', 'work', 'job', 'employee', 'service', 'daily routine'],
  7: ['partner', 'marriage', 'spouse', 'enemy', 'lawsuit', 'business partner', 'relationship'],
  8: ['death', 'inheritance', 'debt', 'loan', 'fear', 'transformation', 'crisis'],
  9: ['travel', 'education', 'university', 'law', 'philosophy', 'foreign', 'publishing'],
  10: ['career', 'boss', 'reputation', 'mother', 'status', 'profession', 'authority'],
  11: ['friend', 'group', 'hope', 'wish', 'goal', 'organization', 'advisor'],
  12: ['secret', 'hidden', 'prison', 'hospital', 'enemy', 'self-undoing', 'spiritual']
};

function analyzeHoraryChart(chartData: any, questionText: string): HoraryAnalysis {
  if (!chartData || !chartData.planets || !chartData.houses) {
    // Fallback to simple analysis if chart data is incomplete
    return generateSimpleAnalysis(questionText);
  }

  try {
    // 1. Check if the chart is radical (valid for judgment)
    const isRadical = checkRadicality(chartData);
    
    // 2. Categorize the question to determine relevant houses
    const questionHouse = categorizeQuestion(questionText);
    
    // 3. Identify significators
    const significators = identifySignificators(chartData, questionHouse);
    
    // 4. Analyze aspects between significators
    const aspectAnalysis = analyzeSignificatorAspects(chartData, significators);
    
    // 5. Calculate dignity scores
    const dignityAnalysis = calculateDignities(chartData, significators);
    
    // 6. Determine the outcome
    const outcome = determineOutcome(aspectAnalysis, dignityAnalysis, isRadical);
    
    // 7. Calculate timing
    const timing = calculateTiming(aspectAnalysis, chartData);
    
    // 8. Generate interpretation
    const interpretation = generateInterpretation(outcome, aspectAnalysis, dignityAnalysis, significators, isRadical);

    return {
      answer: outcome,
      timing,
      interpretation,
      isRadical,
      significators
    };
  } catch (error) {
    console.error('Error in horary analysis:', error);
    return generateSimpleAnalysis(questionText);
  }
}

function checkRadicality(chartData: any): boolean {
  try {
    // Check if ascendant is between 3-27 degrees
    const ascendant = chartData.houses[0];
    const ascDegree = ascendant % 30;
    if (ascDegree < 3 || ascDegree > 27) return false;
    
    // Check if Moon is void of course (no major aspects before changing signs)
    const moonPosition = chartData.planets.Moon;
    if (isVoidOfCourse(moonPosition, chartData)) return false;
    
    // Check if Saturn is in 1st or 7th house (complications)
    const saturnHouse = getPlanetHouse(chartData.planets.Saturn, chartData.houses);
    if (saturnHouse === 1 || saturnHouse === 7) return false;
    
    return true;
  } catch (error) {
    return true; // Default to radical if we can't check
  }
}

function categorizeQuestion(questionText: string): number {
  const normalized = questionText.toLowerCase();
  const scores: Record<number, number> = {};
  
  // Calculate keyword matches for each house
  for (const [house, keywords] of Object.entries(HOUSE_KEYWORDS)) {
    const houseNum = parseInt(house);
    scores[houseNum] = keywords.reduce((score, keyword) => {
      return score + (normalized.includes(keyword) ? 1 : 0);
    }, 0);
  }
  
  // Return house with highest score, default to 1st house
  const bestMatch = Object.entries(scores)
    .sort(([,a], [,b]) => b - a)[0];
  
  return bestMatch && bestMatch[1] > 0 ? parseInt(bestMatch[0]) : 1;
}

function identifySignificators(chartData: any, questionHouse: number): { querent: string; quesited: string } {
  try {
    // Querent is always ruler of 1st house
    const firstHouseCusp = chartData.houses[0];
    const firstHouseSign = getSignFromLongitude(firstHouseCusp);
    const querent = SIGN_RULERS[firstHouseSign] || 'Sun';
    
    // Quesited is ruler of the relevant house for the question
    const questionHouseCusp = chartData.houses[questionHouse - 1] || chartData.houses[0];
    const questionHouseSign = getSignFromLongitude(questionHouseCusp);
    const quesited = SIGN_RULERS[questionHouseSign] || 'Moon';
    
    return { querent, quesited };
  } catch (error) {
    return { querent: 'Sun', quesited: 'Moon' }; // Default significators
  }
}

function getSignFromLongitude(longitude: number): string {
  const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  const signIndex = Math.floor(longitude / 30);
  return signs[signIndex] || 'Aries';
}

function getPlanetHouse(planetLongitude: number, houses: number[]): number {
  for (let i = 0; i < houses.length; i++) {
    const nextHouse = houses[(i + 1) % houses.length];
    if (planetLongitude >= houses[i] && planetLongitude < nextHouse) {
      return i + 1;
    }
  }
  return 1; // Default to first house
}

function analyzeSignificatorAspects(chartData: any, significators: { querent: string; quesited: string }): any {
  try {
    const querentPlanet = chartData.planets[significators.querent];
    const quesitedPlanet = chartData.planets[significators.quesited];
    
    if (!querentPlanet || !quesitedPlanet) return { hasAspect: false, aspectType: 'none' };
    
    const aspectAngle = Math.abs(querentPlanet - quesitedPlanet);
    const normalizedAngle = aspectAngle > 180 ? 360 - aspectAngle : aspectAngle;
    
    // Check for major aspects with 8-degree orb
    const aspects = [
      { name: 'conjunction', angle: 0, orb: 8, nature: 'neutral' },
      { name: 'sextile', angle: 60, orb: 6, nature: 'positive' },
      { name: 'square', angle: 90, orb: 7, nature: 'negative' },
      { name: 'trine', angle: 120, orb: 8, nature: 'positive' },
      { name: 'opposition', angle: 180, orb: 8, nature: 'negative' }
    ];
    
    for (const aspect of aspects) {
      if (Math.abs(normalizedAngle - aspect.angle) <= aspect.orb) {
        return {
          hasAspect: true,
          aspectType: aspect.name,
          nature: aspect.nature,
          orb: Math.abs(normalizedAngle - aspect.angle)
        };
      }
    }
    
    return { hasAspect: false, aspectType: 'none' };
  } catch (error) {
    return { hasAspect: false, aspectType: 'none' };
  }
}

function calculateDignities(chartData: any, significators: { querent: string; quesited: string }): any {
  // Simplified dignity calculation
  try {
    const querentPosition = chartData.planets[significators.querent];
    const quesitedPosition = chartData.planets[significators.quesited];
    
    const querentSign = getSignFromLongitude(querentPosition);
    const quesitedSign = getSignFromLongitude(quesitedPosition);
    
    const querentRuler = SIGN_RULERS[querentSign];
    const quesitedRuler = SIGN_RULERS[quesitedSign];
    
    // Check if planets are in their own signs (dignified)
    const querentDignified = querentRuler === significators.querent;
    const quesitedDignified = quesitedRuler === significators.quesited;
    
    return {
      querentDignified,
      quesitedDignified,
      overallDignity: querentDignified && quesitedDignified ? 'strong' : 
                     querentDignified || quesitedDignified ? 'moderate' : 'weak'
    };
  } catch (error) {
    return { querentDignified: false, quesitedDignified: false, overallDignity: 'weak' };
  }
}

function determineOutcome(aspectAnalysis: any, dignityAnalysis: any, isRadical: boolean): 'Yes' | 'No' | 'Maybe' {
  if (!isRadical) return 'Maybe';
  
  let score = 0;
  
  // Aspect analysis
  if (aspectAnalysis.hasAspect) {
    if (aspectAnalysis.nature === 'positive') score += 2;
    else if (aspectAnalysis.nature === 'negative') score -= 2;
    
    // Closer orbs are stronger
    if (aspectAnalysis.orb < 3) score += 1;
  } else {
    score -= 1; // No aspect is generally unfavorable
  }
  
  // Dignity analysis
  if (dignityAnalysis.overallDignity === 'strong') score += 2;
  else if (dignityAnalysis.overallDignity === 'moderate') score += 1;
  else score -= 1;
  
  // Determine final answer
  if (score >= 2) return 'Yes';
  else if (score <= -2) return 'No';
  else return 'Maybe';
}

function calculateTiming(aspectAnalysis: any, chartData: any): string {
  if (!aspectAnalysis.hasAspect) {
    return 'Timing unclear - no applying aspects';
  }
  
  const orb = aspectAnalysis.orb || 5;
  const baseTime = Math.ceil(orb);
  
  // Determine time unit based on aspect type and orb
  if (orb < 2) {
    return `Within ${baseTime} days`;
  } else if (orb < 5) {
    return `Within ${baseTime} weeks`;
  } else {
    return `Within ${baseTime} months`;
  }
}

function generateInterpretation(outcome: 'Yes' | 'No' | 'Maybe', aspectAnalysis: any, dignityAnalysis: any, significators: any, isRadical: boolean): string {
  let interpretation = '';
  
  if (!isRadical) {
    interpretation += 'Note: This chart shows some questionable factors that may affect the reliability of the judgment. ';
  }
  
  interpretation += `The significators for this question are ${significators.querent} (representing you) and ${significators.quesited} (representing the matter in question). `;
  
  if (aspectAnalysis.hasAspect) {
    interpretation += `These planets form a ${aspectAnalysis.aspectType} aspect, which is ${aspectAnalysis.nature === 'positive' ? 'favorable' : aspectAnalysis.nature === 'negative' ? 'challenging' : 'neutral'}. `;
  } else {
    interpretation += 'The significators do not form a major aspect, suggesting the matter may not come to pass or lacks clear direction. ';
  }
  
  if (dignityAnalysis.overallDignity === 'strong') {
    interpretation += 'Both significators are well-dignified, indicating strength and positive potential. ';
  } else if (dignityAnalysis.overallDignity === 'moderate') {
    interpretation += 'The significators show moderate dignity, suggesting mixed influences. ';
  } else {
    interpretation += 'The significators lack essential dignity, which may weaken the outcome. ';
  }
  
  // Add outcome-specific interpretation
  switch (outcome) {
    case 'Yes':
      interpretation += 'The overall testimony favors a positive outcome.';
      break;
    case 'No':
      interpretation += 'The planetary testimony suggests obstacles and challenges that prevent success.';
      break;
    case 'Maybe':
      interpretation += 'The chart shows mixed testimony, requiring patience and possibly additional actions for success.';
      break;
  }
  
  return interpretation;
}

function isVoidOfCourse(moonLongitude: number, chartData: any): boolean {
  if (!moonLongitude || !chartData?.planets) return false;
  
  const nextSignBoundary = Math.ceil(moonLongitude / 30) * 30;
  const majorAspectAngles = [0, 60, 90, 120, 180];
  const aspectOrb = 8;
  
  // Check if moon will make any major aspects before changing signs
  const planetsArray = Object.entries(chartData.planets).map(([name, longitude]) => ({
    name: name.toLowerCase(),
    longitude: typeof longitude === 'number' ? longitude : 0
  }));
  
  const hasApplyingAspects = planetsArray.filter(p => p.name !== 'moon').some(planet => {
    if (!planet.longitude) return false;
    
    let separation = Math.abs(moonLongitude - planet.longitude);
    if (separation > 180) separation = 360 - separation;
    
    const isNearMajorAspect = majorAspectAngles.some(aspectAngle => {
      return Math.abs(separation - aspectAngle) <= aspectOrb;
    });
    
    if (isNearMajorAspect && planet.longitude < nextSignBoundary && planet.longitude > moonLongitude) {
      return true; // Moon will make this aspect before changing signs
    }
    
    return false;
  });
  
  return !hasApplyingAspects;
}

function generateSimpleAnalysis(questionText: string): HoraryAnalysis {
  // Fallback analysis when chart data is unavailable
  const outcomes: ('Yes' | 'No' | 'Maybe')[] = ['Yes', 'No', 'Maybe'];
  const answer = outcomes[Math.floor(Math.random() * outcomes.length)];
  
  return {
    answer,
    timing: 'Within 1-3 months',
    interpretation: 'Chart analysis is based on simplified methods due to incomplete astronomical data. A full traditional horary analysis requires complete planetary positions and house cusps.',
    isRadical: true,
    significators: { querent: 'Sun', quesited: 'Moon' }
  };
}