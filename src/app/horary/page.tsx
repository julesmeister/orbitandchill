/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
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
  const { voidStatus, requestLocationPermission } = useVoidMoonStatus();

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
  const [showTimeForm, setShowTimeForm] = useState(false);
  const [customTimeData, setCustomTimeData] = useState<any>(null);
  const timeFormRef = useRef<HTMLDivElement>(null);

  // Filter questions for current user
  const userQuestions = useMemo(() => {
    return questions.filter(q => q.userId === user?.id || !q.userId);
  }, [questions, user?.id]);

  // Load questions from database on mount
  useEffect(() => {
    loadQuestions(user?.id);
  }, [user?.id, loadQuestions]);

  // Force update when questions change
  useEffect(() => {
    console.log('Questions updated:', questions.map(q => ({
      id: q.id,
      answer: q.answer,
      hasChartData: !!q.chartData
    })));
    setForceUpdate(prev => prev + 1);
  }, [questions]);

  // Pagination calculations
  const totalPages = Math.ceil(userQuestions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedQuestions = userQuestions.slice(startIndex, endIndex);



  const handleSubmitQuestion = async () => {
    if (!question.trim()) return;

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
      customLocation: useCustomTime && customTimeData ? {
        name: customTimeData.location,
        coordinates: customTimeData.coordinates
      } : undefined,
    };

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
            moonSign: chartData.metadata?.chartData?.moonSign,
            moonVoidOfCourse: chartData.metadata?.chartData?.moonVoidOfCourse,
            planetaryHour: chartData.metadata?.chartData?.planetaryHour,
            isRadical: chartData.metadata?.chartData?.isRadical,
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
    setShowQuestionForm(false); // Hide the form and show the chart
  };

  const handleAskAnotherQuestion = () => {
    setShowQuestionForm(true);
    setSelectedQuestion(null);
    setCurrentChartData(null);
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
      customLocation: useCustomTime && customTimeData ? {
        name: customTimeData.location,
        coordinates: customTimeData.coordinates
      } : undefined,
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
            moonSign: chartData.metadata?.moonSign,
            moonVoidOfCourse: chartData.metadata?.moonVoidOfCourse,
            planetaryHour: chartData.metadata?.planetaryHour,
            isRadical: chartData.metadata?.isRadical,
            chartWarnings: chartData.metadata?.chartWarnings || [],
            aspectCount: chartData.metadata?.aspectCount,
            retrogradeCount: chartData.metadata?.retrogradeCount,
            significatorPlanet: chartData.metadata?.significatorPlanet
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
        {/* Hero Section */}
        <section className="px-[5%] pt-12">
          <div className="text-center">
            <div className="w-20 h-20 bg-black flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-3xl">🔮</span>
            </div>
            <h1 className="font-space-grotesk text-5xl font-bold text-black mb-6">
              Horary Oracle
            </h1>
            <p className="font-inter text-xl text-black/80 leading-relaxed max-w-2xl mx-auto mb-8">
              Ask a specific question and receive astrological guidance based on the exact moment of inquiry.
              The heavens reflect earthly matters at the precise time you seek answers.
            </p>
          </div>
        </section>

        {/* Current Time Display */}
        <section className="px-[5%]">
          <div className="text-center">
            <h3 className="font-space-grotesk text-lg font-bold text-black mb-4">Chart Cast Time</h3>
            <div className="border-x border-t border-black p-6 bg-gray-50">
              <p className="text-sm text-black mb-4">Your chart will be cast for this exact moment:</p>

              {/* Live Clock with Void Moon Status */}
              <div className="flex items-center justify-center gap-4">
                <LiveClock />
                <div className="h-8 w-px bg-slate-300"></div>

                {/* Void Moon Status - Compact */}
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${voidStatus.isLoading ? 'bg-gray-400 animate-pulse' : voidStatus.isVoid ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                  <span className="text-lg font-space-grotesk font-bold text-black/70">☽</span>
                  <span className={`text-lg font-inter font-bold ${voidStatus.isVoid ? 'text-yellow-700' : 'text-green-700'}`}>
                    {voidStatus.isLoading ? 'Checking' : voidStatus.isVoid ? 'Void' : 'Active'}
                  </span>
                  {voidStatus.moonSign && (
                    <span className="text-lg text-black/60 font-inter capitalize">
                      in {voidStatus.moonSign}
                    </span>
                  )}
                </div>
              </div>

              {voidStatus.isVoid && voidStatus.nextSignChange ? (
                <VoidMoonCountdown
                  nextSignChange={voidStatus.nextSignChange}
                  className="mt-4"
                />
              ) : (
                <div className="mt-4 space-y-3">
                  <p className="text-xs text-black/60">
                    {voidStatus.locationUsed ? (
                      <>
                        Using: <span className="font-medium">{voidStatus.locationUsed.name}</span>
                        {voidStatus.locationUsed.source === 'current' && (
                          <span className="text-green-600 ml-1">📍</span>
                        )}
                        {voidStatus.locationUsed.source === 'birth' && (
                          <span className="text-blue-600 ml-1">🏠</span>
                        )}
                        {voidStatus.locationUsed.source === 'fallback' && (
                          <span className="text-gray-600 ml-1">🏙️</span>
                        )}
                      </>
                    ) : (
                      'Detecting location for calculations...'
                    )}
                  </p>
                  
                  {/* Location Error Message & Retry Button */}
                  {voidStatus.locationError && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                      <div className="flex items-start space-x-2">
                        <span className="text-yellow-600 text-sm">⚠️</span>
                        <div className="flex-1">
                          <p className="text-xs text-yellow-800 mb-2">
                            {voidStatus.locationError.message}
                          </p>
                          {voidStatus.locationError.canRetry && (
                            <button
                              onClick={requestLocationPermission}
                              disabled={voidStatus.isLoading}
                              className="text-xs bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              {voidStatus.isLoading ? 'Requesting...' : 'Enable Location'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Time Selection Toggle */}
              <div className="mt-6 border-t border-black pt-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      setUseCustomTime(false);
                      setShowTimeForm(false);
                      setCustomTimeData(null);
                    }}
                    className={`group relative flex-1 px-4 py-3 text-sm font-semibold border border-black transition-all duration-300 overflow-hidden ${
                      !useCustomTime 
                        ? 'bg-black text-white' 
                        : 'bg-white text-black hover:bg-black hover:text-white'
                    }`}
                  >
                    {useCustomTime && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-200/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    )}
                    <span className="relative flex items-center justify-center">
                      <span className="mr-2">🕐</span>
                      Current Time
                    </span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setUseCustomTime(true);
                      setShowTimeForm(true);
                      // Scroll to form after a brief delay to allow rendering
                      setTimeout(() => {
                        timeFormRef.current?.scrollIntoView({
                          behavior: 'smooth',
                          block: 'start'
                        });
                      }, 100);
                    }}
                    className={`group relative flex-1 px-4 py-3 text-sm font-semibold border border-black transition-all duration-300 overflow-hidden ${
                      useCustomTime 
                        ? 'bg-black text-white' 
                        : 'bg-white text-black hover:bg-black hover:text-white'
                    }`}
                  >
                    {!useCustomTime && (
                      <div className="absolute inset-0 bg-gradient-to-l from-transparent via-purple-200/20 to-transparent translate-x-[100%] group-hover:translate-x-[-100%] transition-transform duration-700"></div>
                    )}
                    <span className="relative flex items-center justify-center">
                      <span className="mr-2">⏰</span>
                      Custom Time
                    </span>
                  </button>
                </div>
                
                {useCustomTime && customTimeData && (
                  <div className="text-sm text-black/70 bg-white p-3 border border-gray-300 mt-3">
                    <p className="font-medium">Selected Time:</p>
                    <p>{new Date(`${customTimeData.date}T${customTimeData.time}`).toLocaleString()}</p>
                    <p className="text-xs text-black/50 mt-1">{customTimeData.location}</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Custom Time Form Modal */}
            {showTimeForm && (
              <div ref={timeFormRef} className="border-t border-black">
                <HoraryTimeForm
                  onSubmit={(data) => {
                    setCustomTimeData(data);
                    setShowTimeForm(false);
                  }}
                  onCancel={() => {
                    setShowTimeForm(false);
                    setUseCustomTime(false);
                  }}
                  initialData={customTimeData}
                />
              </div>
            )}
          </div>
        </section>

        {/* Main Content Section */}
        <section className="px-[5%] pb-12">
          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-0 border border-black mb-12">
            {/* Question Input Card or Chart Display - 2 columns */}
            <div className="lg:col-span-2 border-r border-black">
              {showQuestionForm ? (
                <div className="bg-white p-8">
                  <div className="w-16 h-16 bg-black flex items-center justify-center mx-auto mb-6">
                    <span className="text-white text-2xl">❓</span>
                  </div>

                  <h2 className="font-space-grotesk text-3xl font-bold text-black mb-3 text-center">
                    Ask Your Question
                  </h2>
                  <p className="font-inter text-black/70 text-center mb-8">
                    Frame your question clearly and specifically for the most accurate guidance
                  </p>

                  <div className="space-y-8">
                    {/* Question Categories */}
                    <div className="flex flex-wrap justify-center gap-3">
                      {Object.keys(exampleQuestions).map((category) => (
                        <button
                          key={category}
                          onClick={() => {
                            setSelectedCategory(category);
                            setShowExamples(true);
                          }}
                          className="px-4 py-2 bg-white border border-black text-black hover:bg-black hover:text-white transition-all duration-300 font-medium text-sm capitalize"
                        >
                          {category}
                        </button>
                      ))}
                    </div>

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

                    {/* Example Questions Dropdown */}
                    {showExamples && selectedCategory && (
                      <div className="border border-black bg-gray-50 p-4">
                        <p className="font-space-grotesk font-bold text-black mb-3">
                          Example {selectedCategory} questions:
                        </p>
                        <div className="space-y-2">
                          {exampleQuestions[selectedCategory as keyof typeof exampleQuestions].map((example, index) => (
                            <button
                              key={index}
                              onClick={() => selectExample(example)}
                              className="block w-full text-left px-4 py-3 text-sm text-black hover:bg-white border border-transparent hover:border-black transition-all duration-300 font-inter"
                            >
                              "{example}"
                            </button>
                          ))}
                        </div>
                      </div>
                    )}


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
                      />

                      {/* Traditional Horary Analysis Section */}
                      {(() => {
                        const analysisData = getChartAnalysis(
                          (currentChartData || selectedQuestion!.chartData)?.metadata?.chartData,
                          selectedQuestion
                        );

                        if (!analysisData) return null;

                        return (
                          <div className="border border-black bg-white p-8">

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-0 border border-black">
                              {/* Chart Radicality */}
                              <div className="border-r border-b border-black p-6" style={{ backgroundColor: analysisData.chartValidation.radical && analysisData.chartValidation.moonNotVoid && analysisData.chartValidation.saturnNotInSeventhOrFirst ? '#4ade80' : '#ff91e9' }}>
                                <div className="flex items-center mb-6">
                                  <div className="w-16 h-16 bg-black flex items-center justify-center mr-4">
                                    <span className="text-white text-2xl">{analysisData.chartValidation.radical &&
                                      analysisData.chartValidation.moonNotVoid &&
                                      analysisData.chartValidation.saturnNotInSeventhOrFirst
                                      ? '✓' : '⚠'}</span>
                                  </div>
                                  <div>
                                    <h4 className="font-space-grotesk font-bold text-black text-xl">Chart Radicality</h4>
                                    <div className="w-16 h-0.5 bg-black mt-1"></div>
                                  </div>
                                </div>
                                <div className="space-y-4">
                                  <div className="bg-white border border-black p-4">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-black font-space-grotesk font-bold text-sm">Ascendant</span>
                                      <span className="text-black font-inter font-bold text-sm">
                                        {analysisData.ascendant.degreeInSign.toFixed(1)}°
                                      </span>
                                    </div>
                                    <div className="text-xs text-black font-inter">
                                      {analysisData.ascendant.tooEarly ? 'Too Early (Impulsive)' :
                                        analysisData.ascendant.tooLate ? 'Too Late (Predetermined)' : 'Radical Degree (Valid)'}
                                    </div>
                                  </div>

                                  {analysisData.moon && (
                                    <div className="bg-white border border-black p-4">
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="text-black font-space-grotesk font-bold text-sm">Moon</span>
                                        <span className="text-black font-inter font-bold text-sm">
                                          {analysisData.moon.voidOfCourse ? 'Void' : 'Active'}
                                        </span>
                                      </div>
                                      <div className="text-xs text-black font-inter">
                                        {analysisData.moon.voidOfCourse ? 'No more aspects before sign change' : 'Normal progression'}
                                      </div>
                                    </div>
                                  )}

                                  {analysisData.saturn && (
                                    <div className="bg-white border border-black p-4">
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="text-black font-space-grotesk font-bold text-sm">Saturn</span>
                                        <span className="text-black font-inter font-bold text-sm">
                                          {analysisData.saturn.inSeventhHouse ? '7th House' : 'Clear'}
                                        </span>
                                      </div>
                                      <div className="text-xs text-black font-inter">
                                        {analysisData.saturn.inSeventhHouse ? 'Complications in partnerships' : 'No obstructions'}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Lunar Conditions */}
                              {analysisData.moon && (
                                <div className="border-r border-b border-black p-6" style={{ backgroundColor: '#6bdbff' }}>
                                  <div className="flex items-center mb-6">
                                    <div className="w-16 h-16 bg-black flex items-center justify-center mr-4">
                                      <span className="text-white text-2xl">☽</span>
                                    </div>
                                    <div>
                                      <h4 className="font-space-grotesk font-bold text-black text-xl">Lunar Conditions</h4>
                                      <div className="w-16 h-0.5 bg-black mt-1"></div>
                                    </div>
                                  </div>
                                  <div className="space-y-4">
                                    <div className="bg-white border border-black p-4">
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="text-black font-space-grotesk font-bold text-sm">Phase</span>
                                        <span className="text-black font-inter font-bold text-sm">{analysisData.moon.phase}</span>
                                      </div>
                                      <div className="text-xs text-black font-inter">Current lunar energy</div>
                                    </div>

                                    <div className="bg-white border border-black p-4">
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="text-black font-space-grotesk font-bold text-sm">Sign</span>
                                        <span className="text-black font-inter font-bold text-sm capitalize">{analysisData.moon.sign}</span>
                                      </div>
                                      <div className="text-xs text-black font-inter">Moon's zodiacal position</div>
                                    </div>

                                    <div className="bg-white border border-black p-4">
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="text-black font-space-grotesk font-bold text-sm">House</span>
                                        <span className="text-black font-inter font-bold text-sm">{analysisData.moon.house}</span>
                                      </div>
                                      <div className="text-xs text-black font-inter">Life area of focus</div>
                                    </div>

                                    {(analysisData.moon.viaCombusta || analysisData.moon.voidOfCourse) && (
                                      <div className="bg-black text-white p-4">
                                        {analysisData.moon.viaCombusta && (
                                          <div className="mb-2">
                                            <div className="font-space-grotesk font-bold text-sm mb-1">⚠ Via Combusta</div>
                                            <div className="text-xs">15° Libra - 15° Scorpio: Volatile outcomes</div>
                                          </div>
                                        )}
                                        {analysisData.moon.voidOfCourse && (
                                          <div>
                                            <div className="font-space-grotesk font-bold text-sm mb-1">☽ Void of Course</div>
                                            <div className="text-xs">"Nothing will come of the matter"</div>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Timing Factors */}
                              <div className="border-b border-black p-6" style={{ backgroundColor: '#f2e356' }}>
                                <div className="flex items-center mb-6">
                                  <div className="w-16 h-16 bg-black flex items-center justify-center mr-4">
                                    <span className="text-white text-2xl">⏰</span>
                                  </div>
                                  <div>
                                    <h4 className="font-space-grotesk font-bold text-black text-xl">Timing Factors</h4>
                                    <div className="w-16 h-0.5 bg-black mt-1"></div>
                                  </div>
                                </div>
                                <div className="space-y-4">
                                  {analysisData.planetaryHour && (
                                    <div className="bg-white border border-black p-4">
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="text-black font-space-grotesk font-bold text-sm">Hour Ruler</span>
                                        <span className="text-black font-inter font-bold text-sm capitalize">{analysisData.planetaryHour}</span>
                                      </div>
                                      <div className="text-xs text-black font-inter">Planetary influence</div>
                                    </div>
                                  )}

                                  <div className="bg-white border border-black p-4">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-black font-space-grotesk font-bold text-sm">Chart Time</span>
                                      <span className="text-black font-inter font-bold text-sm">
                                        {selectedQuestion && new Date(selectedQuestion.date).toLocaleTimeString('en-US', {
                                          hour: 'numeric',
                                          minute: '2-digit',
                                          second: '2-digit'
                                        })}
                                      </span>
                                    </div>
                                    <div className="text-xs text-black font-inter">Moment of question</div>
                                  </div>

                                  <div className="bg-black text-white p-4">
                                    <div className="font-space-grotesk font-bold text-sm mb-2">✨ Cosmic Influence</div>
                                    <div className="text-xs">
                                      The planetary hour ruler influences the question's energy and timing of manifestation.
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Planetary Aspects */}
                              <div className="border-r border-black p-6 lg:col-span-3" style={{ backgroundColor: '#ff91e9' }}>
                                <div className="flex items-center mb-6">
                                  <div className="w-16 h-16 bg-black flex items-center justify-center mr-4">
                                    <span className="text-white text-2xl">⚹</span>
                                  </div>
                                  <div>
                                    <h4 className="font-space-grotesk font-bold text-black text-xl">Planetary Aspects</h4>
                                    <div className="w-16 h-0.5 bg-black mt-1"></div>
                                  </div>
                                </div>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  <div className="bg-white border border-black p-4">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-black font-space-grotesk font-bold text-sm">Total Aspects</span>
                                      <span className="text-black font-inter font-bold text-lg">{analysisData.aspects.length}</span>
                                    </div>
                                    <div className="text-xs text-black font-inter">Active planetary connections</div>
                                  </div>

                                  <div className="bg-white border border-black p-4">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-black font-space-grotesk font-bold text-sm">Retrograde</span>
                                      <span className="text-black font-inter font-bold text-lg">{analysisData.retrogradeCount}</span>
                                    </div>
                                    <div className="text-xs text-black font-inter">Planets in reverse motion</div>
                                  </div>

                                  <div className="bg-white border border-black p-4">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-black font-space-grotesk font-bold text-sm">Applying</span>
                                      <span className="text-black font-inter font-bold text-lg">
                                        {analysisData.aspects.filter((aspect: any) => aspect.applying).length}
                                      </span>
                                    </div>
                                    <div className="text-xs text-black font-inter">Future connections forming</div>
                                  </div>
                                </div>

                                {analysisData.aspects.length > 0 && (
                                  <div className="mt-6">
                                    <div className="font-space-grotesk font-bold text-black mb-4">Major Aspects</div>
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                                      {analysisData.aspects.slice(0, 6).map((aspect: { planet1: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; aspect: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; planet2: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; applying: any; }, i: Key | null | undefined) => (
                                        <div key={i} className="bg-black text-white p-3">
                                          <div className="font-space-grotesk font-bold text-sm mb-1 capitalize">
                                            {aspect.planet1} {aspect.aspect} {aspect.planet2}
                                          </div>
                                          <div className="text-xs">
                                            {aspect.applying ? '→ Applying (forming)' : '← Separating (waning)'}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Astrological Interpretation */}
                              <div className="border border-black bg-white p-6 md:col-span-2 lg:col-span-3">
                                <div className="flex items-center mb-6">
                                  <div className="w-12 h-12 bg-black flex items-center justify-center mr-4">
                                    <span className="text-white text-lg">📖</span>
                                  </div>
                                  <div>
                                    <h4 className="font-space-grotesk font-bold text-black text-xl">Astrological Interpretation</h4>
                                    <div className="w-24 h-0.5 bg-black mt-1"></div>
                                  </div>
                                </div>

                                {/* Oracle's Interpretation if available */}
                                {selectedQuestion?.interpretation && (
                                  <div className="mb-6 p-6 border border-black" style={{ backgroundColor: '#6bdbff' }}>
                                    <div className="flex items-start space-x-4">
                                      <div className="w-12 h-12 bg-black flex items-center justify-center flex-shrink-0">
                                        <span className="text-white text-lg">🔮</span>
                                      </div>
                                      <div className="flex-1">
                                        <div className="font-space-grotesk font-bold text-black text-lg mb-3">Oracle's Interpretation</div>
                                        <p className="text-black leading-relaxed text-base font-inter">
                                          {selectedQuestion.interpretation}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                <div className="space-y-4">
                                  {!analysisData.chartValidation.radical && (
                                    <div className="border border-black p-4" style={{ backgroundColor: '#ff91e9' }}>
                                      <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-black flex items-center justify-center flex-shrink-0">
                                          <span className="text-white text-lg">⚠</span>
                                        </div>
                                        <div>
                                          <div className="font-space-grotesk font-bold text-black text-lg mb-2">Non-Radical Chart</div>
                                          <div className="text-black font-inter text-sm">
                                            This chart may not be suitable for judgment. The ascendant degree suggests the question is either too early (impulsive) or too late (outcome already determined).
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {analysisData.moon?.voidOfCourse && (
                                    <div className="border border-black p-4" style={{ backgroundColor: '#f2e356' }}>
                                      <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-black flex items-center justify-center flex-shrink-0">
                                          <span className="text-white text-lg">☽</span>
                                        </div>
                                        <div>
                                          <div className="font-space-grotesk font-bold text-black text-lg mb-2">Void of Course Moon</div>
                                          <div className="text-black font-inter text-sm">
                                            Traditional horary teaches that when the Moon is void of course, "nothing will come of the matter." This suggests the situation may not develop or may fizzle out.
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {analysisData.moon?.viaCombusta && (
                                    <div className="border border-black p-4" style={{ backgroundColor: '#6bdbff' }}>
                                      <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-black flex items-center justify-center flex-shrink-0">
                                          <span className="text-white text-lg">🔥</span>
                                        </div>
                                        <div>
                                          <div className="font-space-grotesk font-bold text-black text-lg mb-2">Via Combusta</div>
                                          <div className="text-black font-inter text-sm">
                                            The Moon in the "Fiery Way" (15° Libra to 15° Scorpio) traditionally indicates unpredictable, volatile, or dangerous outcomes. Proceed with extreme caution.
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {analysisData.saturn?.inSeventhHouse && (
                                    <div className="border border-black p-4" style={{ backgroundColor: '#f0e3ff' }}>
                                      <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-black flex items-center justify-center flex-shrink-0">
                                          <span className="text-white text-lg">♄</span>
                                        </div>
                                        <div>
                                          <div className="font-space-grotesk font-bold text-black text-lg mb-2">Saturn in 7th House</div>
                                          <div className="text-black font-inter text-sm">
                                            Traditional horary warns against judgment when Saturn occupies the 7th house, as it may indicate complications, delays, or obstacles in relationships and partnerships.
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {analysisData.chartValidation.radical &&
                                    !analysisData.moon?.voidOfCourse &&
                                    !analysisData.moon?.viaCombusta && (
                                      <div className="border border-black p-4" style={{ backgroundColor: '#4ade80' }}>
                                        <div className="flex items-start space-x-4">
                                          <div className="w-12 h-12 bg-black flex items-center justify-center flex-shrink-0">
                                            <span className="text-white text-lg">✓</span>
                                          </div>
                                          <div>
                                            <div className="font-space-grotesk font-bold text-black text-lg mb-2">Radical Chart</div>
                                            <div className="text-black font-inter text-sm">
                                              This chart meets traditional criteria for reliable horary judgment. The ascendant degree, Moon condition, and overall chart structure support astrological interpretation.
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}

                                  <div className="border-t border-black pt-6 mt-6">
                                    <div className="flex items-center mb-4">
                                      <div className="w-8 h-8 bg-black flex items-center justify-center mr-3">
                                        <span className="text-white text-sm">⚹</span>
                                      </div>
                                      <div className="font-space-grotesk font-bold text-black text-sm">Aspect Significance</div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      <div className="border border-black bg-white p-3">
                                        <div className="flex items-center space-x-2">
                                          <div className="w-3 h-3 bg-green-500 flex items-center justify-center">
                                            <span className="text-white text-xs">→</span>
                                          </div>
                                          <span className="text-black font-inter text-xs"><span className="font-bold">Applying:</span> Events developing</span>
                                        </div>
                                      </div>
                                      <div className="border border-black bg-white p-3">
                                        <div className="flex items-center space-x-2">
                                          <div className="w-3 h-3 bg-gray-500 flex items-center justify-center">
                                            <span className="text-white text-xs">←</span>
                                          </div>
                                          <span className="text-black font-inter text-xs"><span className="font-bold">Separating:</span> Past influences</span>
                                        </div>
                                      </div>
                                      <div className="border border-black bg-white p-3">
                                        <div className="flex items-center space-x-2">
                                          <div className="w-3 h-3 bg-blue-500 flex items-center justify-center">
                                            <span className="text-white text-xs">●</span>
                                          </div>
                                          <span className="text-black font-inter text-xs"><span className="font-bold">Conjunctions:</span> Strong connections</span>
                                        </div>
                                      </div>
                                      <div className="border border-black bg-white p-3">
                                        <div className="flex items-center space-x-2">
                                          <div className="w-3 h-3 bg-green-500 flex items-center justify-center">
                                            <span className="text-white text-xs">△</span>
                                          </div>
                                          <span className="text-black font-inter text-xs"><span className="font-bold">Trines/Sextiles:</span> Harmonious outcomes</span>
                                        </div>
                                      </div>
                                      <div className="border border-black bg-white p-3 md:col-span-2">
                                        <div className="flex items-center space-x-2">
                                          <div className="w-3 h-3 bg-red-500 flex items-center justify-center">
                                            <span className="text-white text-xs">□</span>
                                          </div>
                                          <span className="text-black font-inter text-xs"><span className="font-bold">Squares/Oppositions:</span> Challenges and obstacles</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                          </div>
                        );
                      })()}
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
                    <div className="bg-black text-white px-3 py-1.5 font-space-grotesk font-bold text-sm">
                      {userQuestions.length}
                    </div>
                  </div>
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
      </div>
    </div>
  );
}