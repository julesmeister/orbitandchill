/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
/**
 * Horary chart analysis utilities
 */

// Export chart analysis data for use in interpretation
export const getChartAnalysis = (chartData: any, question: any) => {
  if (!chartData?.planets || !chartData?.houses) return null;
  
  const planets = chartData.planets;
  const houses = chartData.houses;
  const aspects = chartData.aspects || [];
  
  // Convert planets object to array if needed, or access directly by key
  const getPlanetData = (name: string) => {
    if (Array.isArray(planets)) {
      return planets.find((p: any) => p.name?.toLowerCase() === name.toLowerCase());
    } else if (typeof planets === 'object') {
      // If planets is an object with planet names as keys
      let planetData = planets[name] || planets[name.toLowerCase()] || planets[name.charAt(0).toUpperCase() + name.slice(1)];
      
      // If planet data is just a number (longitude), convert to object
      if (typeof planetData === 'number') {
        planetData = {
          longitude: planetData,
          sign: getSignFromLongitude(planetData),
          house: getHouseFromLongitude(planetData, houses)
        };
      }
      
      return planetData;
    }
    return null;
  };
  
  // Helper functions for converting longitude to sign and house
  const getSignFromLongitude = (longitude: number): string => {
    const signs = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 
                   'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
    const signIndex = Math.floor(longitude / 30);
    return signs[signIndex] || 'unknown';
  };
  
  const getHouseFromLongitude = (longitude: number, houses: any[]): number => {
    if (!houses || houses.length === 0) return 1;
    
    for (let i = 0; i < houses.length; i++) {
      const currentHouse = houses[i]?.cusp || (i * 30);
      const nextHouse = houses[(i + 1) % 12]?.cusp || ((i + 1) * 30);
      
      if (currentHouse <= nextHouse) {
        if (longitude >= currentHouse && longitude < nextHouse) {
          return i + 1;
        }
      } else {
        // Handle wraparound at 360°
        if (longitude >= currentHouse || longitude < nextHouse) {
          return i + 1;
        }
      }
    }
    return 1; // Default to first house
  };
  
  // Moon analysis
  const moon = getPlanetData('moon');
  const sun = getPlanetData('sun');
  const saturn = getPlanetData('saturn');
  
  // Traditional indicators
  const isVoidOfCourse = (moon: any, planetsData: any): boolean => {
    if (!moon?.longitude) {
      return false;
    }
    
    const moonLongitude = moon.longitude;
    const majorAspectAngles = [0, 60, 90, 120, 180];
    const aspectOrb = 8;
    
    // Convert planets to array format for processing
    let planetsArray = [];
    if (Array.isArray(planetsData)) {
      planetsArray = planetsData;
    } else if (typeof planetsData === 'object') {
      planetsArray = Object.entries(planetsData).map(([name, data]) => ({
        name: name.toLowerCase(),
        longitude: typeof data === 'number' ? data : (data as any)?.longitude || 0
      }));
    }
    
    const hasApplyingAspects = planetsArray.filter(p => p.name !== 'moon').some(planet => {
      if (!planet.longitude) return false;
      
      let separation = Math.abs(moonLongitude - planet.longitude);
      if (separation > 180) separation = 360 - separation;
      
      const nearAspects = majorAspectAngles.filter(aspectAngle => {
        const orbDistance = Math.abs(separation - aspectAngle);
        return orbDistance <= aspectOrb;
      });
      
      if (nearAspects.length > 0) {
        const tightAspects = nearAspects.filter(aspectAngle => {
          const orbDistance = Math.abs(separation - aspectAngle);
          return orbDistance <= 3;
        });
        
        return tightAspects.length > 0;
      }
      
      return false;
    });
    
    return !hasApplyingAspects;
  };
  
  const isViaCombusta = (moonLongitude: number): boolean => {
    const libra15 = 195;
    const scorpio15 = 225;
    return moonLongitude >= libra15 && moonLongitude <= scorpio15;
  };
  
  const calculatePlanetaryHour = (date: Date): string => {
    const hourOrder = ['saturn', 'jupiter', 'mars', 'sun', 'venus', 'mercury', 'moon'];
    const dayOrder = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn'];
    const dayOfWeek = date.getDay();
    const dayRuler = dayOrder[dayOfWeek];
    const hour = date.getHours();
    const startIndex = hourOrder.indexOf(dayRuler);
    const hourRulerIndex = (startIndex + hour) % 7;
    return hourOrder[hourRulerIndex];
  };
  
  const getMoonPhase = (moonLongitude: number, sunLongitude: number): string => {
    const phase = (moonLongitude - sunLongitude + 360) % 360;
    if (phase < 90) return 'Waxing Crescent';
    if (phase < 180) return 'Waxing Gibbous';
    if (phase < 270) return 'Waning Gibbous';
    return 'Waning Crescent';
  };
  
  return {
    moon: moon ? {
      voidOfCourse: isVoidOfCourse(moon, planets),
      viaCombusta: moon.longitude ? isViaCombusta(moon.longitude) : false,
      phase: sun && moon.longitude && sun.longitude ? getMoonPhase(moon.longitude, sun.longitude) : null,
      sign: moon.sign || 'unknown',
      house: moon.house || 1,
      longitude: moon.longitude || 0
    } : null,
    
    sun: sun ? {
      sign: sun.sign || 'unknown',
      house: sun.house || 1,
      longitude: sun.longitude || 0
    } : null,
    
    ascendant: {
      degree: houses[0]?.cusp || 0,
      degreeInSign: (houses[0]?.cusp || 0) % 30,
      tooEarly: ((houses[0]?.cusp || 0) % 30) < 3,
      tooLate: ((houses[0]?.cusp || 0) % 30) > 27
    },
    
    saturn: saturn ? {
      inSeventhHouse: saturn.house === 7,
      sign: saturn.sign || 'unknown',
      house: saturn.house || 1
    } : null,
    
    planetaryHour: question?.date ? calculatePlanetaryHour(new Date(question.date)) : null,
    
    aspects: Array.isArray(aspects) ? aspects.map((a: any) => ({
      planet1: a.planet1 || '',
      planet2: a.planet2 || '',
      aspect: a.aspect || '',
      orb: a.orb || 0,
      applying: a.applying || false,
      color: a.color || ''
    })) : [],
    
    retrogradeCount: (() => {
      if (Array.isArray(planets)) {
        return planets.filter((p: any) => p.retrograde && !['northNode', 'southNode', 'partOfFortune'].includes(p.name)).length;
      } else if (typeof planets === 'object') {
        return Object.entries(planets).filter(([name, data]) => {
          const isRetrograde = typeof data === 'object' && (data as any)?.retrograde;
          return isRetrograde && !['northNode', 'southNode', 'partOfFortune'].includes(name);
        }).length;
      }
      return 0;
    })(),
    
    chartValidation: {
      radical: ((houses[0]?.cusp || 0) % 30) >= 3 && ((houses[0]?.cusp || 0) % 30) <= 27,
      moonNotVoid: moon ? !isVoidOfCourse(moon, planets) : true,
      saturnNotInSeventhOrFirst: saturn ? saturn.house !== 7 && saturn.house !== 1 : true
    }
  };
};