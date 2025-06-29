/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
// @ts-nocheck
"use client";

import { useState, useEffect, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import { useHoraryStore, HoraryQuestion } from "../../store/horaryStore";
import { useUserStore } from "../../store/userStore";
import { useHoraryChart } from "../../hooks/useHoraryChart";
import { useVoidMoonStatus } from "../../hooks/useVoidMoonStatus";
import { useSharedLocation } from "../../hooks/useSharedLocation";
import { useHoraryQuestionForm } from "../../hooks/useHoraryQuestionForm";
import HoraryChartDisplay from "../../components/horary/HoraryChartDisplay";
import HoraryQuestionForm from "../../components/horary/HoraryQuestionForm";
import HoraryQuestionsList from "../../components/horary/HoraryQuestionsList";
import HoraryReferenceCards from "../../components/horary/HoraryReferenceCards";
import ConfirmationModal from "../../components/reusable/ConfirmationModal";
import VoidMoonWarningModal from "../../components/horary/VoidMoonWarningModal";
import StatusToast from "../../components/reusable/StatusToast";
import LocationRequestToast from "../../components/reusable/LocationRequestToast";
import HoraryLimitBanner from "../../components/horary/HoraryLimitBanner";
import HoraryInterpretationTabs from "../../components/horary/HoraryInterpretationTabs";


export default function HoraryPage() {
  const { user } = useUserStore();
  const { questions, loadQuestions, deleteQuestion } = useHoraryStore();
  const { generateHoraryChart } = useHoraryChart();
  const { voidStatus } = useVoidMoonStatus();
  
  const {
    isLocationToastVisible: isSharedLocationToastVisible,
    showLocationToast: showSharedLocationToast,
    hideLocationToast: hideSharedLocationToast,
    requestLocationPermission: requestSharedLocationPermission
  } = useSharedLocation();

  const {
    question,
    setQuestion,
    isAnalyzing,
    useCustomTime,
    setUseCustomTime,
    customTimeData,
    setCustomTimeData,
    showVoidMoonWarning,
    submitQuestion,
    proceedWithVoidMoon,
    cancelVoidMoonSubmission,
    handleLocationSetWithFeedback,
    toast,
    sharedLocationDisplay
  } = useHoraryQuestionForm();

  // Force component re-render when store updates
  const [forceUpdate, setForceUpdate] = useState(0);
  const [selectedQuestion, setSelectedQuestion] = useState<HoraryQuestion | null>(null);
  const [questionToDelete, setQuestionToDelete] = useState<HoraryQuestion | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentChartData, setCurrentChartData] = useState<any>(null);
  const [showQuestionForm, setShowQuestionForm] = useState(true);
  const [realChartData, setRealChartData] = useState<any>(null);

  // Filter questions for current user with improved logic
  const userQuestions = useMemo(() => {
    // If no user or user ID, return empty array to prevent showing wrong questions
    if (!user?.id) {
      return [];
    }

    // Filter questions for the current authenticated user only
    const filtered = questions.filter(q => q.userId === user.id);
    
    // Ensure questions are sorted by date (newest first)
    const sortedFiltered = filtered.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime(); // Descending order (newest first)
    });
    
    return sortedFiltered;
  }, [questions, user?.id, user?.authProvider]);

  // Load questions from database on mount with improved timing
  useEffect(() => {
    // Add delay for Google auth users to ensure user is fully persisted
    const loadWithDelay = async () => {
      if (user?.id) {
        // If Google user, add small delay to ensure database persistence completed
        if (user.authProvider === 'google') {
          await new Promise(resolve => setTimeout(resolve, 500));
        }

        loadQuestions(user.id);
      }
    };

    loadWithDelay();
  }, [user?.id, user?.authProvider]); // Removed loadQuestions to prevent infinite loop

  // Force update when questions change
  useEffect(() => {
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




  const handleSubmitQuestion = async () => {
    const result = await submitQuestion(voidStatus);
    if (result) {
      setSelectedQuestion(result.question);
      setCurrentChartData(result.chartData);
      setShowQuestionForm(false);
      
      // Force refresh questions list
      if (user?.id) {
        await loadQuestions(user.id);
      }
      setForceUpdate(prev => prev + 1);
    }
  };


  const handleQuestionClick = (q: HoraryQuestion) => {
    // Get the most up-to-date question from store
    const allQuestions = useHoraryStore.getState().questions;
    const currentQuestion = allQuestions.find(question => question.id === q.id);

    if (currentQuestion) {
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

  const handleProceedWithVoidMoon = async () => {
    const result = await proceedWithVoidMoon();
    if (result) {
      setSelectedQuestion(result.question);
      setCurrentChartData(result.chartData);
      setShowQuestionForm(false);
      
      // Force refresh questions list
      if (user?.id) {
        await loadQuestions(user.id);
      }
      setForceUpdate(prev => prev + 1);
    }
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
                <HoraryQuestionForm
                  question={question}
                  setQuestion={setQuestion}
                  isAnalyzing={isAnalyzing}
                  onSubmit={handleSubmitQuestion}
                  voidStatus={voidStatus}
                  locationDisplay={sharedLocationDisplay}
                  onShowLocationToast={showSharedLocationToast}
                  useCustomTime={useCustomTime}
                  setUseCustomTime={setUseCustomTime}
                  customTimeData={customTimeData}
                  setCustomTimeData={setCustomTimeData}
                />
              ) : (
                /* Chart Display Section */
                <div>
                  {/* Ask Another Question Button */}
                  <div className="w-full">
                    <button
                      onClick={handleAskAnotherQuestion}
                      className="w-full flex items-center justify-center px-8 py-8 bg-black text-white hover:bg-gray-800 transition-all duration-300 font-space-grotesk font-bold text-lg"
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

            {/* Past Questions List - 1 column */}
            <HoraryQuestionsList
              userQuestions={userQuestions}
              displayQuestions={displayQuestions}
              userIsPremium={userIsPremium}
              onQuestionClick={handleQuestionClick}
              onDeleteQuestion={handleDeleteQuestion}
            />
          </div>

          {/* Reference Cards */}
          <HoraryReferenceCards />
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
          onProceed={handleProceedWithVoidMoon}
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