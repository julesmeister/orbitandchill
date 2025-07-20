import { useState } from 'react';
import { calculatePlanetaryPositions } from '../utils/natalChart';
import { AstrologicalEvent } from '../store/eventsStore';
import { useOptimalTiming } from './useOptimalTiming';

export interface ManualEventOptions {
  title: string;
  date: string;
  time: string;
  description: string;
  latitude: number;
  longitude: number;
  locationName?: string;
  timezone?: string;
  userId?: string;
}

export const useManualEventAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { analyzeChartForPriorities } = useOptimalTiming();

  const analyzeManualEvent = async (options: ManualEventOptions): Promise<AstrologicalEvent> => {
    const { title, date, time, description, latitude, longitude, locationName, timezone, userId } = options;
    
    setIsAnalyzing(true);
    
    try {
      // Create date object from date and time
      const eventDateTime = new Date(`${date}T${time || '12:00'}`);
      
      // Calculate planetary positions for the event
      const chartData = await calculatePlanetaryPositions(eventDateTime, latitude, longitude);
      
      if (!chartData || !chartData.planets || chartData.planets.length === 0) {
        throw new Error('Unable to calculate planetary positions for this date/time');
      }
      
      // Analyze the chart for all possible priorities to get a comprehensive score
      const allPriorities = ['career', 'love', 'creativity', 'money', 'health', 'spiritual', 'communication', 'travel', 'home', 'learning'];
      
      // Calculate score for each priority and find the best ones
      const priorityScores = allPriorities.map(priority => {
        const score = analyzeChartForPriorities(chartData, [priority], false);
        return { priority, score };
      });
      
      // Sort by score and take top 3 priorities
      priorityScores.sort((a, b) => b.score - a.score);
      const topPriorities = priorityScores.slice(0, 3).map(p => p.priority);
      
      // Calculate overall score using top priorities
      const overallScore = analyzeChartForPriorities(chartData, topPriorities, false);
      
      // Determine event type based on score
      let eventType: 'benefic' | 'challenging' | 'neutral' = 'benefic';
      if (overallScore < 3) {
        eventType = 'challenging';
      } else if (overallScore < 6) {
        eventType = 'neutral';
      }
      
      // Generate astrological insights
      const significantAspects = chartData.aspects
        .slice(0, 3)
        .map(a => `${a.planet1} ${a.aspect} ${a.planet2}`);
      
      const planetaryPositions = chartData.planets
        .slice(0, 5)
        .map(p => `${p.name} in ${p.sign} (${p.house}H)`);
      
      // Create enriched description
      const enrichedDescription = description 
        ? `${description}. Astrological analysis shows ${eventType} energy with a score of ${Math.round(overallScore)}/10.`
        : `Astrological analysis shows ${eventType} energy with a score of ${Math.round(overallScore)}/10.`;
      
      return {
        id: Date.now().toString(),
        userId: userId || '',
        title,
        date,
        time: time || '12:00',
        type: eventType,
        description: enrichedDescription,
        aspects: significantAspects,
        planetaryPositions,
        score: Math.round(overallScore),
        isGenerated: false,
        createdAt: new Date().toISOString(),
        priorities: topPriorities,
        chartData,
        // Include location data that was used for the analysis
        latitude,
        longitude,
        locationName: locationName || `Analyzed at ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
        timezone
      };
      
    } catch (error) {
      console.error('Error analyzing manual event:', error);
      // Return a basic event if analysis fails
      return {
        id: Date.now().toString(),
        userId: userId || '',
        title,
        date,
        time: time || '12:00',
        type: 'neutral',
        description: description || 'Manual event',
        aspects: [],
        planetaryPositions: [],
        score: 5,
        isGenerated: false,
        createdAt: new Date().toISOString(),
        // Include location data even when analysis fails
        latitude,
        longitude,
        locationName: locationName || `Event at ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
        timezone
      };
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    isAnalyzing,
    analyzeManualEvent
  };
};