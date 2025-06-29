/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
// @ts-nocheck
"use client";

import { useState, useEffect, useMemo, useRef, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faQuestion,
  faClock,
  faCalculator,
  faBook,
  faCompass,
  faStar,
  faChevronLeft,
  faChevronRight,
  faTrash
} from "@fortawesome/free-solid-svg-icons";
import { useHoraryStore, HoraryQuestion } from "../../store/horaryStore";
import { useUserStore } from "../../store/userStore";
import { useHoraryChart } from "../../hooks/useHoraryChart";
import { useVoidMoonStatus } from "../../hooks/useVoidMoonStatus";
import HoraryChartDisplay from "../../components/horary/HoraryChartDisplay";
import { getChartAnalysis } from "../../components/horary/InteractiveHoraryChart";
import ConfirmationModal from "../../components/reusable/ConfirmationModal";
import VoidMoonWarningModal from "../../components/horary/VoidMoonWarningModal";
import VoidMoonCountdown from "../../components/horary/VoidMoonCountdown";
import HoraryTimeForm from "../../components/forms/HoraryTimeForm";
import StatusToast from "../../components/reusable/StatusToast";
import LocationRequestToast from "../../components/reusable/LocationRequestToast";
import { trackHoraryQuestion } from "../../hooks/usePageTracking";
import { useSharedLocation } from "../../hooks/useSharedLocation";
import { useHoraryLimits } from "../../hooks/useHoraryLimits";
import HoraryLimitBanner from "../../components/horary/HoraryLimitBanner";
import HoraryInterpretationTabs from "../../components/horary/HoraryInterpretationTabs";

// Dynamic import with no SSR for the clock component
const LiveClock = dynamic(() => import("../../components/horary/LiveClock"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center gap-4">
      <div className="flex items-center gap-2">
        <FontAwesomeIcon icon={faClock} className="text-indigo-600" />
        <span className="text-2xl font-mono font-bold text-slate-800">
          --:--:--
        </span>
      </div>
      <div className="h-8 w-px bg-slate-300"></div>
      <div className="text-lg text-slate-700">
        Loading...
      </div>
    </div>
  ),
});

// Example questions for different categories
const exampleQuestions = {
  career: [
    "Will I get the job I interviewed for?",
    "Should I accept this job offer?",
    "Will my business venture succeed?"
  ],
  relationships: [
    "Will our relationship improve?",
    "Is this person interested in me?",
    "Should I reach out to reconcile?"
  ],
  property: [
    "Will my house sell this month?",
    "Should I buy this property?",
    "Will I find a suitable home soon?"
  ],
  lost: [
    "Where is my lost item?",
    "Will I recover my stolen property?",
    "Can I find what I'm looking for?"
  ],
  health: [
    "Will my health condition improve?",
    "Is this treatment right for me?",
    "Will the surgery go well?"
  ],
  general: [
    "Will this situation resolve favorably?",
    "Should I proceed with this plan?",
    "Will I receive the expected news?"
  ]
};

const ITEMS_PER_PAGE = 5;

export default function HoraryPage() {
  const router = useRouter();
  const { user } = useUserStore();
  const { questions, loadQuestions, addQuestion, updateQuestion, deleteQuestion, clearAllQuestions } = useHoraryStore();
  const { generateHoraryChart, isGenerating, toast } = useHoraryChart();
  const { voidStatus, requestLocationPermission, showLocationToast: showVoidLocationToast, hideLocationToast: hideVoidLocationToast, handleLocationSet } = useVoidMoonStatus();
  
  // Use shared location for consistency across app
  const {
    locationDisplay: sharedLocationDisplay,
    isLocationToastVisible: isSharedLocationToastVisible,
    showLocationToast: showSharedLocationToast,
    hideLocationToast: hideSharedLocationToast,
    setLocation: setSharedLocation,
    requestLocationPermission: requestSharedLocationPermission
  } = useSharedLocation();

  // Wrapper to show success feedback when location is set
  const handleLocationSetWithFeedback = (locationData: { name: string; coordinates: { lat: string; lon: string } }) => {
    // Update both shared location and void moon status
    setSharedLocation(locationData);
    handleLocationSet(locationData);
    
    // Show success toast
    toast.show(
      'Location Saved',
      `Using ${locationData.name} for horary calculations`,
      'success'
    );
  };

  // Force component re-render when store updates
  const [forceUpdate, setForceUpdate] = useState(0);

  const [question, setQuestion] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedQuestion, setSelectedQuestion] = useState<HoraryQuestion | null>(null);
  const [questionToDelete, setQuestionToDelete] = useState<HoraryQuestion | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentChartData, setCurrentChartData] = useState<any>(null);
  const [showQuestionForm, setShowQuestionForm] = useState(true);
  const [showVoidMoonWarning, setShowVoidMoonWarning] = useState(false);
  const [useCustomTime, setUseCustomTime] = useState(false);
  const [customTimeData, setCustomTimeData] = useState<any>(null);
  const [realChartData, setRealChartData] = useState<any>(null);

  // Filter questions for current user with improved logic
  const userQuestions = useMemo(() => {
    // Add debug logging for filtering
    console.log('🔍 Filtering horary questions:', {
      totalQuestions: questions.length,
      userId: user?.id,
      userIdType: typeof user?.id,
      userExists: !!user,
      userAuthProvider: user?.authProvider
    });

    // If no user or user ID, return empty array to prevent showing wrong questions
    if (!user?.id) {
      console.log('⚠️ No user ID available, showing no questions');
      return [];
    }

    // Filter questions for the current authenticated user only
    const filtered = questions.filter(q => {
      const matches = q.userId === user.id;
      if (!matches && q.userId) {
        console.log('🔍 Question userId mismatch:', {
          questionUserId: q.userId,
          currentUserId: user.id,
          questionId: q.id
        });
      }
      return matches;
    });

    console.log(`✅ Filtered ${filtered.length} questions for user ${user.id}`);
    return filtered;
  }, [questions, user?.id, user?.authProvider]);

  // Load questions from database on mount with improved timing
  useEffect(() => {
    // Add delay for Google auth users to ensure user is fully persisted
    const loadWithDelay = async () => {
      if (user?.id) {
        console.log('🔍 Loading questions for user:', {
          userId: user.id,
          authProvider: user.authProvider
        });

        // If Google user, add small delay to ensure database persistence completed
        if (user.authProvider === 'google') {
          await new Promise(resolve => setTimeout(resolve, 500));
        }

        loadQuestions(user.id);
      } else {
        console.log('⚠️ No user available, skipping question load');
      }
    };

    loadWithDelay();
  }, [user?.id, user?.authProvider]); // Removed loadQuestions to prevent infinite loop

  // Force update when questions change
  useEffect(() => {
    console.log('Questions updated:', questions.map(q => ({
      id: q.id,
      answer: q.answer,
      hasChartData: !!q.chartData
    })));
    setForceUpdate(prev => prev + 1);
  }, [questions]);

  // Apply premium limits to question history
  const userIsPremium = user?.subscriptionTier === 'premium';
  const displayQuestions = useMemo(() => {
    if (userIsPremium) {
      return userQuestions;
    }
    // Free users see only last 10 questions
    return userQuestions.slice(0, 10);
  }, [userQuestions, userIsPremium]);

  // Pagination calculations
  const totalPages = Math.ceil(displayQuestions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedQuestions = displayQuestions.slice(startIndex, endIndex);



  const limits = useHoraryLimits();

  const handleSubmitQuestion = async () => {
    if (!question.trim()) return;

    // Check if user has reached their limit
    if (!limits.canAskQuestion) {
      toast.show(
        'Question Limit Reached',
        limits.limitMessage || 'You have reached your question limit',
        'error'
      );
      return;
    }

    // Check if moon is void and show warning
    if (voidStatus.isVoid && !voidStatus.isLoading) {
      setShowVoidMoonWarning(true);
      return;
    }

    setIsAnalyzing(true);

    // Create new question entry with custom time if specified
    const questionDate = useCustomTime && customTimeData
      ? new Date(`${customTimeData.date}T${customTimeData.time}`)
      : new Date();

    const newQuestionData = {
      question: question.trim(),
      date: questionDate,
      userId: user?.id,
    };

    // Add debug logging for question submission
    console.log('🔍 Submitting horary question:', {
      userId: user?.id,
      userAuthProvider: user?.authProvider,
      userExists: !!user,
      questionLength: question.trim().length,
      useCustomTime,
      customTimeData
    });

    try {
      // Add to store (now saves to database)
      const newlyAddedQuestion = await addQuestion(newQuestionData);

      if (newlyAddedQuestion) {
        console.log('Question saved to database:', newlyAddedQuestion.id);

        // Generate horary chart
        const chartData = await generateHoraryChart(newlyAddedQuestion);

        if (chartData) {
          console.log('Chart generated successfully, updating database...');

          // Update the question with chart analysis results
          await updateQuestion(newlyAddedQuestion.id, {
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

          // Get the updated question from the store
          const updatedQuestion = useHoraryStore.getState().questions.find(q => q.id === newlyAddedQuestion.id);

          if (updatedQuestion) {
            setSelectedQuestion(updatedQuestion);
            setCurrentChartData(chartData);
          } else {
            // Fallback: create temporary question with analysis
            const fallbackQuestion = {
              ...newlyAddedQuestion,
              answer: chartData.metadata?.answer || 'Maybe',
              timing: chartData.metadata?.timing || 'Unknown',
              interpretation: chartData.metadata?.interpretation || 'Analysis in progress...',
              chartData: chartData
            };
            setSelectedQuestion(fallbackQuestion);
            setCurrentChartData(chartData);
          }

          setShowQuestionForm(false);
          setQuestion('');
          setCurrentPage(1);

          // Track horary question submission analytics
          try {
            await trackHoraryQuestion(user?.id);
          } catch (analyticsError) {
            console.debug('Analytics tracking failed (non-critical):', analyticsError);
          }
        } else {
          console.log('Chart generation failed');
        }
      } else {
        console.warn('Failed to save question to database, but it may be in local storage');
        // Try to find the locally created question
        const localQuestions = useHoraryStore.getState().questions;
        const latestQuestion = localQuestions[0];
        if (latestQuestion) {
          console.log('Using locally created question:', latestQuestion.id);
          const chartData = await generateHoraryChart(latestQuestion);
          if (chartData) {
            await updateQuestion(latestQuestion.id, {
              answer: chartData.metadata?.answer || 'Maybe',
              timing: chartData.metadata?.timing || 'Unknown',
              interpretation: chartData.metadata?.interpretation || 'Analysis in progress...',
              chartData: chartData
            });
          }
        }
      }
    } catch (error) {
      console.error('Error in question submission:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const selectExample = (exampleQuestion: string) => {
    setQuestion(exampleQuestion);
    setShowExamples(false);
  };

  const handleQuestionClick = (q: HoraryQuestion) => {
    console.log('Clicked question:', {
      id: q.id,
      hasChartData: !!q.chartData,
      answer: q.answer,
      chartDataKeys: q.chartData ? Object.keys(q.chartData) : 'none'
    });

    // Get the most up-to-date question from store
    const allQuestions = useHoraryStore.getState().questions;
    const currentQuestion = allQuestions.find(question => question.id === q.id);

    if (currentQuestion) {
      console.log('Using current question from store:', {
        id: currentQuestion.id,
        hasChartData: !!currentQuestion.chartData,
        answer: currentQuestion.answer
      });
      setSelectedQuestion(currentQuestion);
    } else {
      setSelectedQuestion(q);
    }

    setCurrentChartData(null); // Clear any temporary chart data
    setRealChartData(null); // Clear real chart data so new one is generated
    setShowQuestionForm(false); // Hide the form and show the chart
  };

  const handleAskAnotherQuestion = () => {
    setShowQuestionForm(true);
    setSelectedQuestion(null);
    setCurrentChartData(null);
    setRealChartData(null);
    setQuestion('');
  };

  const handleDeleteQuestion = (question: HoraryQuestion, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent triggering the question click
    setQuestionToDelete(question);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (questionToDelete) {
      deleteQuestion(questionToDelete.id);

      // If the deleted question was being viewed, return to the question form
      if (selectedQuestion?.id === questionToDelete.id) {
        setShowQuestionForm(true);
        setSelectedQuestion(null);
        setCurrentChartData(null);
        setRealChartData(null);
      }

      // Close confirmation modal
      setShowDeleteConfirm(false);
      setQuestionToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setQuestionToDelete(null);
  };

  const proceedWithVoidMoon = async () => {
    setShowVoidMoonWarning(false);
    setIsAnalyzing(true);

    // Create new question entry with custom time if specified
    const questionDate = useCustomTime && customTimeData
      ? new Date(`${customTimeData.date}T${customTimeData.time}`)
      : new Date();

    const newQuestionData = {
      question: question.trim(),
      date: questionDate,
      userId: user?.id,
    };

    try {
      // Add to store (now saves to database)
      const savedQuestion = await addQuestion(newQuestionData);

      // Wait a brief moment for the store to update
      await new Promise(resolve => setTimeout(resolve, 100));

      // Get the updated questions from store
      const allQuestions = useHoraryStore.getState().questions;
      console.log('All questions after add:', allQuestions.length);

      // Find the newly added question
      const newlyAddedQuestion = savedQuestion || allQuestions.find(q =>
        q.question === newQuestionData.question &&
        q.userId === newQuestionData.userId &&
        Math.abs(q.date.getTime() - newQuestionData.date.getTime()) < 2000
      );

      if (newlyAddedQuestion) {
        console.log('Found newly added question:', newlyAddedQuestion.id);

        // Generate horary chart
        const chartData = await generateHoraryChart(newlyAddedQuestion);

        if (chartData) {
          console.log('Chart generated successfully, updating with analysis results...');

          // Update question with chart analysis results
          await updateQuestion(newlyAddedQuestion.id, {
            answer: chartData.metadata?.answer || 'Maybe',
            timing: chartData.metadata?.timing || 'Unknown',
            interpretation: chartData.metadata?.interpretation || 'Analysis in progress...',
            chartData: chartData,
            chartSvg: chartData.svg,
            ascendantDegree: chartData.metadata?.ascendantDegree,
            moonSign: chartData.metadata?.moonSign ? String(chartData.metadata.moonSign) : undefined,
            moonVoidOfCourse: chartData.metadata?.moonVoidOfCourse ? Boolean(chartData.metadata.moonVoidOfCourse) : undefined,
            planetaryHour: chartData.metadata?.planetaryHour ? String(chartData.metadata.planetaryHour) : undefined,
            isRadical: chartData.metadata?.isRadical ? Boolean(chartData.metadata.isRadical) : undefined,
            chartWarnings: Array.isArray(chartData.metadata?.chartWarnings) ? chartData.metadata.chartWarnings : [],
            aspectCount: chartData.metadata?.aspectCount,
            retrogradeCount: chartData.metadata?.retrogradeCount,
            significatorPlanet: chartData.metadata?.significatorPlanet ? String(chartData.metadata.significatorPlanet) : undefined
          });

          // Get the updated question from store
          const updatedQuestion = useHoraryStore.getState().questions.find(q => q.id === newlyAddedQuestion.id);

          if (updatedQuestion?.answer) {
            console.log('Successfully updated question with answer:', updatedQuestion.answer);
            setSelectedQuestion(updatedQuestion);
            setCurrentChartData(chartData);
          } else {
            console.log('Using fallback question data');
            // Create a merged question with the analysis
            const fallbackQuestion = {
              ...newlyAddedQuestion,
              answer: chartData.metadata?.answer || 'Maybe',
              timing: chartData.metadata?.timing || 'Unknown',
              interpretation: chartData.metadata?.interpretation || 'Analysis in progress...',
              chartData: chartData
            };
            setSelectedQuestion(fallbackQuestion);
            setCurrentChartData(chartData);
          }

          setShowQuestionForm(false);
          setQuestion('');
          setCurrentPage(1);

          // Force component re-render to show updated questions in list
          setForceUpdate(prev => prev + 1);
        } else {
          console.log('Chart generation failed');
        }
      } else {
        console.log('Could not find newly added question');
        // Force refresh questions from store
        const latestQuestion = allQuestions[0];
        if (latestQuestion) {
          console.log('Using latest question as fallback:', latestQuestion.id);
          await generateHoraryChart(latestQuestion);
        }
      }
    } catch (error) {
      console.error('Error in question submission:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const cancelVoidMoonSubmission = () => {
    setShowVoidMoonWarning(false);
  };

  return (
    <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      <div className="min-h-screen bg-white">



        {/* Main Content Section */}
        <section className="px-[5%] py-12">
          {/* Horary Limit Banner for Free Users */}
          <HoraryLimitBanner />
          
          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-0 border border-black mb-12">
            {/* Question Input Card or Chart Display - 2 columns */}
            <div className="lg:col-span-2 border-r border-black">
              {showQuestionForm ? (
                <div className="bg-white p-8">
                  {/* Compact Oracle & Time Info */}
                  <div className="mb-6 border border-black">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                      {/* Oracle Header & Time Selection */}
                      <div className="lg:border-r border-black flex flex-col" style={{ backgroundColor: '#f0e3ff' }}>
                        <div className="p-4 flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-black flex items-center justify-center">
                              <span className="text-white text-lg">🔮</span>
                            </div>
                            <div>
                              <h2 className="font-space-grotesk text-lg font-bold text-black">Horary Oracle</h2>
                              <p className="font-inter text-xs text-black/70">Astrological guidance at inquiry moment</p>
                            </div>
                          </div>
                          
                          {/* Information about time & location when custom time is selected */}
                          {useCustomTime && (
                            <div className="mt-3 p-3 border border-black/30 bg-white/90">
                              <div className="text-xs text-black/80 space-y-1.5 font-inter">
                                <div className="font-bold text-black mb-1">Why Time & Location Matter</div>
                                <p>Horary requires the exact moment and place to calculate planetary positions. The cosmic snapshot at your question's birth reveals the answer.</p>
                                <div className="space-y-0.5 text-black/60">
                                  <p>• <strong>Time:</strong> Determines planetary houses and aspects</p>
                                  <p>• <strong>Location:</strong> Sets the ascendant and house cusps</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Time Selection - Anchored to bottom */}
                        <div className="p-4 border-t border-black/20">
                          <h4 className="font-space-grotesk text-xs font-bold text-black/80 mb-2">Time Selection</h4>

                          <div className="grid grid-cols-2 gap-1">
                            <button
                              onClick={() => {
                                setUseCustomTime(false);
                                setCustomTimeData(null);
                              }}
                              className={`px-3 py-2 text-xs font-semibold font-space-grotesk border border-black transition-all duration-300 ${!useCustomTime
                                ? 'bg-black text-white'
                                : 'bg-white text-black hover:bg-black hover:text-white'
                                }`}
                            >
                              🕐 Current
                            </button>

                            <button
                              onClick={() => {
                                setUseCustomTime(true);
                              }}
                              className={`px-3 py-2 text-xs font-semibold font-space-grotesk border border-black transition-all duration-300 ${useCustomTime
                                ? 'bg-black text-white'
                                : 'bg-white text-black hover:bg-black hover:text-white'
                                }`}
                            >
                              ⏰ Custom
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Time Display or Custom Time Form */}
                      {!useCustomTime ? (
                        <div className="p-4 bg-white">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-space-grotesk text-sm font-bold text-black">Chart Cast Time</h3>
                              <div className="flex-1 h-px bg-gray-300"></div>
                            </div>

                            <LiveClock />

                            <div className="flex items-center justify-between text-xs border-t border-gray-200 pt-2">
                              <div className="flex items-center space-x-1">
                                <div className={`w-1.5 h-1.5 rounded-full ${voidStatus.isLoading ? 'bg-gray-400 animate-pulse' : voidStatus.isVoid ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                                <span className="font-space-grotesk font-bold text-black/70">☽</span>
                                <span className={`font-inter font-bold ${voidStatus.isVoid ? 'text-yellow-700' : 'text-green-700'}`}>
                                  {voidStatus.isLoading ? 'Checking' : voidStatus.isVoid ? 'Void' : 'Active'}
                                </span>
                              </div>
                              {voidStatus.moonSign && (
                                <span className="text-black/60 font-inter capitalize text-xs">
                                  {voidStatus.moonSign}
                                </span>
                              )}
                            </div>

                            <div className="text-xs text-black/60">
                              <div className="flex items-center justify-between">
                                <span className="truncate">Using: <span className="font-medium">{sharedLocationDisplay.shortName}</span></span>
                                <div className="flex items-center gap-1 ml-2">
                                  <span>
                                    {sharedLocationDisplay.source === 'current' && '📍'}
                                    {sharedLocationDisplay.source === 'birth' && '🏠'}
                                    {sharedLocationDisplay.source === 'fallback' && '🏙️'}
                                  </span>
                                  <button
                                    onClick={showSharedLocationToast}
                                    className="ml-1 px-1 py-0.5 text-xs text-black/40 hover:text-black hover:bg-black/5 rounded transition-all duration-200"
                                    title="Change location"
                                  >
                                    ⚙️
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Void Moon Countdown */}
                            {voidStatus.isVoid && voidStatus.nextSignChange && (
                              <VoidMoonCountdown
                                nextSignChange={voidStatus.nextSignChange}
                                className="text-xs border-t border-gray-200 pt-2"
                              />
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="p-4" style={{ backgroundColor: '#f2e356' }}>
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 mb-3">
                              <h3 className="font-space-grotesk text-sm font-bold text-black">Custom Chart Time</h3>
                              <div className="flex-1 h-px bg-black"></div>
                            </div>
                            
                            <HoraryTimeForm
                              onSubmit={(data) => {
                                setCustomTimeData(data);
                              }}
                              onCancel={() => {
                                setUseCustomTime(false);
                              }}
                              initialData={customTimeData}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-6">

                    {/* Question Input */}
                    <div className="relative">
                      <textarea
                        id="question"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Type your specific question here..."
                        className="w-full h-40 px-4 py-3 border border-black bg-white focus:outline-none focus:ring-2 focus:ring-black/20 resize-none font-inter"
                      />
                      {question.length > 0 && (
                        <div className="absolute bottom-3 right-3 text-xs text-black/50">
                          {question.length} characters
                        </div>
                      )}
                    </div>

                    <button
                      onClick={handleSubmitQuestion}
                      disabled={!question.trim() || isAnalyzing || (useCustomTime && !customTimeData)}
                      className="w-full bg-black text-white py-4 px-6 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-space-grotesk font-bold text-lg"
                    >
                      {isAnalyzing ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          Casting Horary Chart...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <span className="mr-3">✨</span>
                          Cast Horary Chart
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                /* Chart Display Section */
                <div className="space-y-8">
                  {/* Ask Another Question Button */}
                  <div className="flex justify-center">
                    <button
                      onClick={handleAskAnotherQuestion}
                      className="inline-flex items-center px-8 py-4 bg-black text-white hover:bg-gray-800 transition-all duration-300 font-space-grotesk font-bold"
                    >
                      <span className="mr-3">❓</span>
                      Ask Another Question
                    </button>
                  </div>

                  {/* Chart Display */}
                  {(currentChartData || (selectedQuestion && selectedQuestion.chartData)) ? (
                    <div className="space-y-6">
                      <HoraryChartDisplay
                        svgContent={(currentChartData || selectedQuestion!.chartData).svg}
                        question={selectedQuestion!}
                        onShare={() => {
                          navigator.share?.({
                            title: `Horary Chart`,
                            text: `Check out my horary chart for: ${selectedQuestion!.question}`,
                            url: window.location.href,
                          });
                        }}
                        onRealChartDataReady={(realData) => {
                          setRealChartData(realData);
                        }}
                      />

                      {/* Horary Interpretation Tabs */}
                      <HoraryInterpretationTabs 
                        chartData={realChartData || currentChartData || selectedQuestion!.chartData}
                        question={selectedQuestion!}
                      />
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white/60 backdrop-blur-sm border border-slate-200 rounded-2xl">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FontAwesomeIcon icon={faQuestion} className="text-slate-500 text-xl" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">Chart Not Available</h3>
                      <p className="text-slate-600 mb-4">
                        This question doesn't have a generated chart yet.
                      </p>
                      <button
                        onClick={async () => {
                          if (selectedQuestion) {
                            setIsAnalyzing(true);
                            try {
                              const chartData = await generateHoraryChart(selectedQuestion);
                              if (chartData) {
                                setCurrentChartData(chartData);
                              }
                            } finally {
                              setIsAnalyzing(false);
                            }
                          }
                        }}
                        disabled={isAnalyzing || !selectedQuestion}
                        className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                      >
                        {isAnalyzing ? 'Generating...' : 'Generate Chart'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Past Questions Table - 1 column */}
            <div className="lg:col-span-1">
              <div className="bg-white">
                {/* Header */}
                <div className="p-6 border-b border-black" style={{ backgroundColor: '#f2e356' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-black flex items-center justify-center">
                        <span className="text-white text-lg">📜</span>
                      </div>
                      <div>
                        <h3 className="font-space-grotesk text-xl font-bold text-black">Past Questions</h3>
                        <div className="w-16 h-0.5 bg-black mt-1"></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-black text-white px-3 py-1.5 font-space-grotesk font-bold text-sm">
                        {displayQuestions.length}
                      </div>
                      {!userIsPremium && userQuestions.length > 10 && (
                        <div className="text-xs text-black/60 font-inter">
                          (+{userQuestions.length - 10} more)
                        </div>
                      )}
                    </div>
                  </div>
                  {!userIsPremium && userQuestions.length > 10 && (
                    <div className="mt-3 p-2 bg-yellow-100 border border-yellow-300">
                      <p className="text-xs text-yellow-800 font-inter">
                        Free users see last 10 questions. <span className="font-semibold">Upgrade for full history.</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Questions List */}
                <div className="min-h-[400px]">
                  {userQuestions.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-16 h-16 bg-black flex items-center justify-center mx-auto mb-4">
                        <span className="text-white text-xl">🔮</span>
                      </div>
                      <h4 className="font-space-grotesk font-bold text-black text-lg mb-2">No Questions Yet</h4>
                      <p className="text-black/60 font-inter">Ask your first horary question to begin</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-black">
                      {paginatedQuestions.map((q, index) => (
                        <div
                          key={q.id}
                          onClick={() => handleQuestionClick(q)}
                          className="group p-4 hover:bg-gray-50 transition-all duration-300 cursor-pointer relative"
                        >
                          {/* Hover accent bar */}
                          <div className="absolute left-0 top-0 w-1 h-0 group-hover:h-full transition-all duration-300 bg-black"></div>

                          {/* Content with proper spacing */}
                          <div className="ml-2">
                            {/* Header with number and delete button */}
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-3">
                                <div className="w-6 h-6 bg-black flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">
                                    {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2 text-xs text-black/60">
                                  <span className="font-inter">
                                    {new Date(q.date).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric'
                                    })}
                                  </span>
                                  <span>•</span>
                                  <span className="font-inter">
                                    {new Date(q.date).toLocaleTimeString('en-US', {
                                      hour: 'numeric',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </div>
                              </div>

                              <button
                                onClick={(e) => handleDeleteQuestion(q, e)}
                                className="opacity-0 group-hover:opacity-100 p-1 text-xs text-black/40 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                                title="Delete question"
                              >
                                🗑️
                              </button>
                            </div>

                            {/* Question text */}
                            <p className="font-inter text-sm text-black mb-3 line-clamp-2 leading-relaxed">
                              "{q.question}"
                            </p>

                            {/* Answer and status - Mobile optimized layout */}
                            <div className="space-y-2">
                              {/* Answer badge row */}
                              <div className="flex items-center flex-wrap gap-2">
                                {q.answer ? (
                                  <span className={`px-2 py-1 text-xs font-space-grotesk font-bold border border-black ${q.answer === 'Yes'
                                    ? 'text-black border-black'
                                    : q.answer === 'No'
                                      ? 'text-black border-black'
                                      : 'text-black border-black'
                                    }`} style={{
                                      backgroundColor: q.answer === 'Yes' ? '#4ade80' : q.answer === 'No' ? '#ff91e9' : '#f2e356'
                                    }}>
                                    {q.answer}
                                  </span>
                                ) : (
                                  <span className="px-2 py-1 text-xs text-black bg-white border border-black font-inter">
                                    ⏳ Analyzing...
                                  </span>
                                )}

                                {/* Status indicator inline */}
                                <div className="flex items-center space-x-1">
                                  <div className={`w-2 h-2 rounded-full ${q.answer ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                  <span className="text-xs text-black/50 font-inter">
                                    {q.answer ? 'Done' : 'Pending'}
                                  </span>
                                </div>
                              </div>

                              {/* Timing row - full width for better readability */}
                              {q.timing && (
                                <div className="w-full">
                                  <span className="inline-block px-2 py-1 text-xs text-black border border-black font-inter w-full truncate" style={{ backgroundColor: '#6bdbff' }}>
                                    ⏰ {q.timing}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="border-t border-black p-4" style={{ backgroundColor: '#6bdbff' }}>
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-space-grotesk font-bold text-black hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 border border-black bg-white"
                      >
                        ← Previous
                      </button>

                      <div className="flex items-center gap-2">
                        {[...Array(totalPages)].map((_, index) => {
                          const pageNumber = index + 1;
                          return (
                            <button
                              key={pageNumber}
                              onClick={() => setCurrentPage(pageNumber)}
                              className={`w-10 h-10 text-sm font-space-grotesk font-bold transition-all border border-black ${currentPage === pageNumber
                                ? 'bg-black text-white'
                                : 'bg-white text-black hover:bg-black hover:text-white'
                                }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-space-grotesk font-bold text-black hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 border border-black bg-white"
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Reference Cards */}
          <div className="border-x border-t border-black bg-white p-8">
            <h3 className="font-space-grotesk text-2xl font-bold text-black mb-8 text-center">Quick Horary Reference</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-0">

              {/* Chart Validity */}
              <div className="border-r border border-black p-6" style={{ backgroundColor: '#4ade80' }}>
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-black flex items-center justify-center mx-auto mb-3">
                    <span className="text-white text-xl">✓</span>
                  </div>
                  <h4 className="font-space-grotesk font-bold text-black">Radical Chart</h4>
                </div>
                <div className="space-y-2 text-sm text-black font-inter">
                  <div className="flex justify-between items-center">
                    <span>Ascendant</span>
                    <span className="font-medium">3°-27° in sign</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Moon</span>
                    <span className="font-medium">Not void of course</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Saturn</span>
                    <span className="font-medium">Not in 1st/7th</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Question</span>
                    <span className="font-medium">Sincere</span>
                  </div>
                </div>
              </div>

              {/* Moon Conditions */}
              <div className="border-r border border-black p-6" style={{ backgroundColor: '#6bdbff' }}>
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-black flex items-center justify-center mx-auto mb-3">
                    <span className="text-white text-xl">☽</span>
                  </div>
                  <h4 className="font-space-grotesk font-bold text-black">Moon States</h4>
                </div>
                <div className="space-y-2 text-sm text-black font-inter">
                  <div className="flex justify-between items-center">
                    <span><strong>Void</strong></span>
                    <span>Nothing comes of matter</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span><strong>Via Combusta</strong></span>
                    <span>Dangerous/unpredictable</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span><strong>Active</strong></span>
                    <span>Normal progression</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span><strong>Phase</strong></span>
                    <span>Waxing = growth</span>
                  </div>
                </div>
              </div>

              {/* Aspects */}
              <div className="border-r border border-black p-6" style={{ backgroundColor: '#f2e356' }}>
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-black flex items-center justify-center mx-auto mb-3">
                    <span className="text-white text-xl">⚹</span>
                  </div>
                  <h4 className="font-space-grotesk font-bold text-black">Aspects</h4>
                </div>
                <div className="space-y-2 text-sm text-black font-inter">
                  <div className="flex justify-between items-center">
                    <span><strong>Applying</strong></span>
                    <span>Coming together</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span><strong>Separating</strong></span>
                    <span>Moving apart</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span><strong>Conjunction</strong></span>
                    <span>Strong union</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span><strong>Trine</strong></span>
                    <span>Harmonious flow</span>
                  </div>
                </div>
              </div>

              {/* Timing */}
              <div className="border-b border black p-6" style={{ backgroundColor: '#ff91e9' }}>
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-black flex items-center justify-center mx-auto mb-3">
                    <span className="text-white text-xl">⏰</span>
                  </div>
                  <h4 className="font-space-grotesk font-bold text-black">Timing</h4>
                </div>
                <div className="space-y-2 text-sm text-black font-inter">
                  <div className="flex justify-between items-center">
                    <span><strong>Angular</strong></span>
                    <span>Months/years</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span><strong>Succedent</strong></span>
                    <span>Weeks/months</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span><strong>Cadent</strong></span>
                    <span>Days/weeks</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span><strong>Fast planets</strong></span>
                    <span>Sooner</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Information Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-x border-t border-black">
            {/* Traditional Method Card */}
            <div className="border-r border-black bg-white p-6">
              <div className="w-16 h-16 bg-black flex items-center justify-center mb-4">
                <span className="text-white text-xl">📚</span>
              </div>
              <h3 className="font-space-grotesk text-lg font-bold text-black mb-3">Traditional Method</h3>
              <p className="font-inter text-black/70 text-sm">
                Based on centuries-old techniques from William Lilly and other masters of horary astrology.
              </p>
            </div>

            {/* Precise Timing Card */}
            <div className="border-r border-black bg-white p-6">
              <div className="w-16 h-16 bg-black flex items-center justify-center mb-4">
                <span className="text-white text-xl">⏰</span>
              </div>
              <h3 className="font-space-grotesk text-lg font-bold text-black mb-3">Precise Timing</h3>
              <p className="font-inter text-black/70 text-sm">
                Charts are cast for the exact moment you submit your question, capturing celestial positions with precision.
              </p>
            </div>

            {/* Seven Planets Card */}
            <div className="border-r border-black bg-white p-6">
              <div className="w-16 h-16 bg-black flex items-center justify-center mb-4">
                <span className="text-white text-xl">⭐</span>
              </div>
              <h3 className="font-space-grotesk text-lg font-bold text-black mb-3">Seven Planets</h3>
              <p className="font-inter text-black/70 text-sm">
                Uses only the traditional seven planets visible to the naked eye, following classical horary rules.
              </p>
            </div>

            {/* Clear Answers Card */}
            <div className=" border-black bg-white p-6">
              <div className="w-16 h-16 bg-black flex items-center justify-center mb-4">
                <span className="text-white text-xl">🧭</span>
              </div>
              <h3 className="font-space-grotesk text-lg font-bold text-black mb-3">Clear Answers</h3>
              <p className="font-inter text-black/70 text-sm">
                Receive yes/no answers with timing predictions and detailed astrological reasoning.
              </p>
            </div>
          </div>

          {/* Information Notice */}
          <div className="text-center">
            <div className="border border-black bg-white p-6">
              <div className="flex items-center justify-center">
                <div className="w-3 h-3 bg-black rounded-full mr-3"></div>
                <span className="font-space-grotesk font-bold text-black">
                  Powered by traditional horary astrology methods following William Lilly's principles
                </span>
              </div>
            </div>
          </div>
        </section>


        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={showDeleteConfirm}
          title="Delete Question"
          message={
            questionToDelete
              ? `Are you sure you want to delete this question: "${questionToDelete.question.length > 80
                ? questionToDelete.question.substring(0, 80) + '...'
                : questionToDelete.question}"?`
              : 'Are you sure you want to delete this question?'
          }
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          autoClose={10} // Auto-cancel after 10 seconds
        />

        {/* Void Moon Warning Modal */}
        <VoidMoonWarningModal
          isOpen={showVoidMoonWarning}
          moonSign={voidStatus.moonSign}
          onProceed={proceedWithVoidMoon}
          onCancel={cancelVoidMoonSubmission}
        />

        {/* Status Toast */}
        <StatusToast
          title={toast.title}
          message={toast.message}
          status={toast.status}
          isVisible={toast.isVisible}
          onHide={toast.hide}
          duration={toast.status === 'success' ? 3000 : toast.status === 'error' ? 5000 : 0}
        />

        {/* Location Request Toast */}
        <LocationRequestToast
          isVisible={isSharedLocationToastVisible}
          onHide={hideSharedLocationToast}
          onLocationSet={handleLocationSetWithFeedback}
          onRequestPermission={async () => {
            try {
              await requestSharedLocationPermission();
              toast.show(
                'Location Detected',
                `Using your current location for horary calculations`,
                'success'
              );
            } catch (error) {
              toast.show(
                'Location Error',
                'Unable to get your current location. Please search for your city instead.',
                'error'
              );
            }
          }}
        />
      </div>
    </div>
  );
}