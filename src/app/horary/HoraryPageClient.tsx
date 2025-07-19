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
import { useHoraryQuestionDeletion } from "../../hooks/useHoraryQuestionDeletion";
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


export default function HoraryPageClient() {
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
  const [currentChartData, setCurrentChartData] = useState<any>(null);
  const [showQuestionForm, setShowQuestionForm] = useState(true);
  const [realChartData, setRealChartData] = useState<any>(null);

  // Use horary question deletion hook
  const {
    questionToDelete,
    showDeleteConfirm,
    handleDeleteQuestion,
    confirmDelete,
    cancelDelete
  } = useHoraryQuestionDeletion({
    userId: user?.id,
    onQuestionDeleted: (deletedQuestion) => {
      // If the deleted question was being viewed, return to the question form
      if (selectedQuestion?.id === deletedQuestion.id) {
        setShowQuestionForm(true);
        setSelectedQuestion(null);
        setCurrentChartData(null);
        setRealChartData(null);
      }
      setForceUpdate(prev => prev + 1);
    },
    showToast: toast.show
  });

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

  // Load questions when user changes
  useEffect(() => {
    if (user?.id) {
      loadQuestions(user.id);
    }
  }, [user?.id, loadQuestions]);

  const handleQuestionSelect = async (question: HoraryQuestion) => {
    setSelectedQuestion(question);
    setShowQuestionForm(false);
    
    // Extract location data from the question
    const location = {
      latitude: question.latitude,
      longitude: question.longitude,
      locationName: question.location
    };

    // Generate chart data
    try {
      const data = await generateHoraryChart(
        question.question,
        new Date(question.date),
        location
      );
      
      if (data) {
        setCurrentChartData(data);
        setRealChartData(data);
      }
    } catch (error) {
      console.error('Failed to generate chart for selected question:', error);
      toast.show('Failed to generate chart for the selected question', 'error');
    }
  };

  const handleBackToForm = () => {
    setShowQuestionForm(true);
    setSelectedQuestion(null);
    setCurrentChartData(null);
    setRealChartData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <FontAwesomeIcon icon={faQuestion} className="text-purple-600 text-4xl mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Horary Astrology</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Ask a specific question and receive guidance from the stars. 
            Horary astrology provides precise answers by casting a chart for the moment your question is asked.
          </p>
        </div>

        {/* Daily limit banner */}
        <HoraryLimitBanner user={user} userQuestions={userQuestions} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Reference Cards */}
          <div className="lg:col-span-1">
            <HoraryReferenceCards voidStatus={voidStatus} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {showQuestionForm ? (
              <>
                {/* Question Form */}
                <HoraryQuestionForm
                  question={question}
                  setQuestion={setQuestion}
                  isAnalyzing={isAnalyzing}
                  useCustomTime={useCustomTime}
                  setUseCustomTime={setUseCustomTime}
                  customTimeData={customTimeData}
                  setCustomTimeData={setCustomTimeData}
                  submitQuestion={submitQuestion}
                  handleLocationSetWithFeedback={handleLocationSetWithFeedback}
                  sharedLocationDisplay={sharedLocationDisplay}
                  userQuestions={userQuestions}
                  user={user}
                />

                {/* Previous Questions */}
                {user && userQuestions.length > 0 && (
                  <div className="mt-8">
                    <HoraryQuestionsList
                      questions={userQuestions}
                      onQuestionSelect={handleQuestionSelect}
                      onDeleteQuestion={handleDeleteQuestion}
                    />
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Chart Display */}
                {selectedQuestion && currentChartData && (
                  <HoraryChartDisplay
                    question={selectedQuestion}
                    chartData={currentChartData}
                    onBackToForm={handleBackToForm}
                  />
                )}

                {/* Interpretation Tabs */}
                {selectedQuestion && realChartData && (
                  <div className="mt-8">
                    <HoraryInterpretationTabs
                      question={selectedQuestion}
                      chartData={realChartData}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Void Moon Warning Modal */}
        <VoidMoonWarningModal
          isOpen={showVoidMoonWarning}
          onProceed={proceedWithVoidMoon}
          onCancel={cancelVoidMoonSubmission}
          voidStatus={voidStatus}
        />

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={showDeleteConfirm}
          title="Delete Question"
          message={`Are you sure you want to delete "${questionToDelete?.question}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          isDestructive={true}
        />

        {/* Status Toast */}
        <StatusToast
          isVisible={toast.isVisible}
          message={toast.message}
          type={toast.type}
          onHide={toast.hide}
        />

        {/* Shared Location Toast */}
        <LocationRequestToast
          isVisible={isSharedLocationToastVisible}
          onAllow={requestSharedLocationPermission}
          onDismiss={hideSharedLocationToast}
        />
      </div>
    </div>
  );
}