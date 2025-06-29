/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "../store/userStore";
import { useHoraryStore, HoraryQuestion } from "../store/horaryStore";
import { useHoraryChart } from "./useHoraryChart";
import { trackHoraryQuestion } from "./usePageTracking";
import { useSharedLocation } from "./useSharedLocation";
import { useHoraryLimits } from "./useHoraryLimits";

export function useHoraryQuestionForm() {
  const router = useRouter();
  const { user } = useUserStore();
  const { addQuestion, updateQuestion, loadQuestions } = useHoraryStore();
  const { generateHoraryChart, toast } = useHoraryChart();
  const limits = useHoraryLimits();
  
  const {
    locationDisplay: sharedLocationDisplay,
    setLocation: setSharedLocation,
  } = useSharedLocation();

  // Form state
  const [question, setQuestion] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [useCustomTime, setUseCustomTime] = useState(false);
  const [customTimeData, setCustomTimeData] = useState<any>(null);
  const [showVoidMoonWarning, setShowVoidMoonWarning] = useState(false);

  const handleLocationSetWithFeedback = useCallback((locationData: { name: string; coordinates: { lat: string; lon: string } }) => {
    setSharedLocation(locationData);
    
    toast.show(
      'Location Saved',
      `Using ${locationData.name} for horary calculations`,
      'success'
    );
  }, [setSharedLocation, toast]);

  const createQuestionData = useCallback(() => {
    const questionDate = useCustomTime && customTimeData
      ? new Date(`${customTimeData.date}T${customTimeData.time}`)
      : new Date();

    return {
      question: question.trim(),
      date: questionDate,
      userId: user?.id,
      customLocation: {
        name: sharedLocationDisplay.name,
        coordinates: sharedLocationDisplay.coordinates
      }
    };
  }, [question, useCustomTime, customTimeData, user?.id, sharedLocationDisplay]);

  const updateQuestionWithChartData = useCallback(async (questionId: string, chartData: any) => {
    await updateQuestion(questionId, {
      answer: chartData.metadata?.answer || 'Maybe',
      timing: chartData.metadata?.timing || 'Unknown',
      interpretation: chartData.metadata?.interpretation || 'Analysis in progress...',
      chartData: chartData,
      chartSvg: chartData.svg,
      ascendantDegree: chartData.metadata?.chartData?.ascendantDegree,
      moonSign: chartData.metadata?.chartData?.moonSign ? String(chartData.metadata.chartData.moonSign) : undefined,
      moonVoidOfCourse: chartData.metadata?.chartData?.moonVoidOfCourse ? Boolean(chartData.metadata.chartData.moonVoidOfCourse) : undefined,
      planetaryHour: chartData.metadata?.chartData?.planetaryHour ? String(chartData.metadata.chartData.planetaryHour) : undefined,
      isRadical: chartData.metadata?.chartData?.isRadical ? Boolean(chartData.metadata.chartData.isRadical) : undefined,
      aspectCount: chartData.metadata?.chartData?.aspects?.length,
      retrogradeCount: chartData.metadata?.chartData?.retrogradeCount,
    });
  }, [updateQuestion]);

  const submitQuestion = useCallback(async (voidStatus: any) => {
    if (!question.trim()) return null;

    // Check if user has reached their limit
    if (!limits.canAskQuestion) {
      toast.show(
        'Question Limit Reached',
        limits.limitMessage || 'You have reached your question limit',
        'error'
      );
      return null;
    }

    // Check if moon is void and show warning
    if (voidStatus.isVoid && !voidStatus.isLoading) {
      setShowVoidMoonWarning(true);
      return null;
    }

    return await processQuestionSubmission();
  }, [question, limits, toast]);

  const processQuestionSubmission = useCallback(async () => {
    setIsAnalyzing(true);

    const newQuestionData = createQuestionData();

    try {
      // Add to store (saves to database)
      const newlyAddedQuestion = await addQuestion(newQuestionData);

      if (newlyAddedQuestion) {
        // Generate horary chart
        const chartData = await generateHoraryChart(newlyAddedQuestion);

        if (chartData) {
          // Update the question with chart analysis results
          await updateQuestionWithChartData(newlyAddedQuestion.id, chartData);

          // Get the updated question from the store
          const updatedQuestion = useHoraryStore.getState().questions.find(q => q.id === newlyAddedQuestion.id);

          const finalQuestion = updatedQuestion || {
            ...newlyAddedQuestion,
            answer: chartData.metadata?.answer || 'Maybe',
            timing: chartData.metadata?.timing || 'Unknown',
            interpretation: chartData.metadata?.interpretation || 'Analysis in progress...',
            chartData: chartData
          };

          // Reset form
          setQuestion('');

          // Force refresh questions list
          if (user?.id) {
            await loadQuestions(user.id);
          }

          // Track analytics
          try {
            await trackHoraryQuestion(user?.id);
          } catch (analyticsError) {
            console.debug('Analytics tracking failed (non-critical):', analyticsError);
          }

          return {
            question: finalQuestion,
            chartData
          };
        }
      }

      return null;
    } catch (error) {
      console.error('Error in question submission:', error);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [createQuestionData, addQuestion, generateHoraryChart, updateQuestionWithChartData, user?.id, loadQuestions]);

  const proceedWithVoidMoon = useCallback(async () => {
    setShowVoidMoonWarning(false);
    return await processQuestionSubmission();
  }, [processQuestionSubmission]);

  const cancelVoidMoonSubmission = useCallback(() => {
    setShowVoidMoonWarning(false);
  }, []);

  return {
    // Form state
    question,
    setQuestion,
    isAnalyzing,
    useCustomTime,
    setUseCustomTime,
    customTimeData,
    setCustomTimeData,
    showVoidMoonWarning,
    
    // Actions
    submitQuestion,
    proceedWithVoidMoon,
    cancelVoidMoonSubmission,
    handleLocationSetWithFeedback,
    
    // Dependencies
    toast,
    limits,
    sharedLocationDisplay
  };
}