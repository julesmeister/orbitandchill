/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from 'react';
import { EmbeddedChart } from '../../types/threads';
import { createEmbeddedChart, ChartShareData } from '../../utils/chartSharing';
import { useUserStore } from '../../store/userStore';
import { useNatalChart } from '../../hooks/useNatalChart';
import { useHoraryChart } from '../../hooks/useHoraryChart';
import { useHoraryStore } from '../../store/horaryStore';
import { useEventsStore } from '../../store/eventsStore';
import { parseEventParams } from '../../utils/urlParams';
import ChartSummaryCard from './ChartSummaryCard';
import StatusToast from '../reusable/StatusToast';
import { logger } from '../../utils/logger';

interface ChartAttachmentToastProps {
  isOpen: boolean;
  onClose: () => void;
  onChartSelect: (chart: EmbeddedChart) => void;
  isLoading: boolean;
}

export default function ChartAttachmentToast({ 
  isOpen, 
  onClose, 
  onChartSelect, 
  isLoading 
}: ChartAttachmentToastProps) {
  const [selectedChartType, setSelectedChartType] = useState<'natal' | 'horary' | 'event'>('natal');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);
  const [showSelectionList, setShowSelectionList] = useState(false);
  const [selectedHoraryQuestion, setSelectedHoraryQuestion] = useState<string | null>(null);
  const [selectedEventType, setSelectedEventType] = useState<'bookmarked' | 'manual' | null>(null);
  const [componentToast, setComponentToast] = useState({
    isVisible: false,
    title: '',
    message: '',
    status: 'info' as 'loading' | 'success' | 'error' | 'info'
  });

  const showComponentToast = (title: string, message: string, status: 'loading' | 'success' | 'error' | 'info') => {
    setComponentToast({ isVisible: true, title, message, status });
  };

  const hideComponentToast = () => {
    setComponentToast(prev => ({ ...prev, isVisible: false }));
  };

  const { user } = useUserStore();
  const { cachedChart, generateChart } = useNatalChart();
  const { generateHoraryChart, toast } = useHoraryChart();
  const { questions } = useHoraryStore();
  const { getAllEvents } = useEventsStore();
  
  // Get bookmarked events
  const bookmarkedEvents = getAllEvents().filter(event => event.isBookmarked);
  
  // Detect current page and available charts
  const [currentPageType, setCurrentPageType] = useState<'natal' | 'horary' | 'event' | null>(null);
  
  // Debug logging
  useEffect(() => {
    if (isOpen) {
      logger.debug('Chart Toast Debug', {
        currentPageType,
        userHasBirthData: !!user?.birthData,
        questionsCount: questions.length,
        bookmarkedEventsCount: bookmarkedEvents.length,
        hasQuestions: questions.length > 0
      });
    }
  }, [isOpen, currentPageType, user?.birthData, questions.length, bookmarkedEvents.length]);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      logger.debug('Page detection', { path, isOpen });
      
      if (path.includes('/horary')) {
        logger.debug('Setting page type to horary');
        setCurrentPageType('horary');
        setSelectedChartType('horary');
      } else if (path.includes('/event-chart')) {
        logger.debug('Setting page type to event');
        setCurrentPageType('event');
        setSelectedChartType('event');
      } else if (path.includes('/chart')) {
        logger.debug('Setting page type to natal');
        setCurrentPageType('natal');
        setSelectedChartType('natal');
      } else {
        logger.debug('No specific page type detected', { path });
      }
    }
  }, [isOpen]);

  // Animate in when opened
  useEffect(() => {
    if (isOpen) {
      setIsAnimatingIn(true);
    } else {
      setIsAnimatingIn(false);
    }
  }, [isOpen]);

  const handleGenerateAndAttach = async (chartType: 'natal' | 'horary' | 'event', specificData?: any) => {
    if (!user) return;

    setIsGenerating(true);
    try {
      let shareData: ChartShareData;
      
      switch (chartType) {
        case 'natal':
          if (!user.birthData) {
            showComponentToast('Birth Data Required', 'Please complete your birth data in your profile to generate a natal chart.', 'error');
            return;
          }
          
          // Generate or use cached natal chart
          let natalChart = cachedChart;
          if (!natalChart) {
            natalChart = await generateChart({
              name: user.username || 'User',
              dateOfBirth: user.birthData.dateOfBirth,
              timeOfBirth: user.birthData.timeOfBirth,
              locationOfBirth: user.birthData.locationOfBirth,
              coordinates: user.birthData.coordinates
            });
          }
          
          if (!natalChart) {
            showComponentToast('Generation Failed', 'Failed to generate natal chart. Please try again.', 'error');
            return;
          }

          shareData = {
            chartType: 'natal',
            svgContent: natalChart.svg,
            metadata: {
              ...natalChart.metadata,
              birthData: user.birthData
            },
            name: user.username || 'User'
          };
          break;
          
        case 'horary':
          const questionToUse = specificData || questions[0];
          if (!questionToUse) {
            showComponentToast('No Question Available', 'Please create a horary question first from the Horary page.', 'info');
            return;
          }

          // Generate horary chart from selected question
          const horaryChart = await generateHoraryChart(questionToUse);
          
          if (!horaryChart) {
            showComponentToast('Generation Failed', 'Failed to generate horary chart. Please try again.', 'error');
            return;
          }

          shareData = {
            chartType: 'horary',
            svgContent: horaryChart.svg,
            metadata: {
              ...horaryChart.metadata,
              horaryData: {
                question: questionToUse.question,
                questionDate: questionToUse.date ? 
                  (questionToUse.date instanceof Date ? questionToUse.date.toISOString() : questionToUse.date) : 
                  new Date().toISOString(),
                answer: questionToUse.answer,
                timing: questionToUse.timing
              }
            },
            name: user.username || 'User'
          };
          break;
          
        case 'event':
          if (!user.birthData) {
            showComponentToast('Birth Data Required', 'Please complete your birth data in your profile to generate event charts.', 'error');
            return;
          }

          let eventData;
          
          // If specificData is provided, it could be a bookmarked event or manual event
          if (specificData) {
            if (specificData.id) {
              // It's a bookmarked event
              eventData = {
                title: specificData.title,
                date: specificData.date,
                time: specificData.time || '12:00',
                isOptimal: specificData.type === 'benefic',
                optimalScore: specificData.score
              };
            } else {
              // It's manual event data
              eventData = specificData;
            }
          } else {
            // Check if we're on event-chart page with current event data
            if (currentPageType !== 'event') {
              showComponentToast('Page Navigation Required', 'Please navigate to the Event Chart page or select a bookmarked event.', 'info');
              return;
            }

            // Get current event data from URL params (if available)
            if (typeof window !== 'undefined') {
              const urlParams = new URLSearchParams(window.location.search);
              eventData = parseEventParams(urlParams);
            }

            if (!eventData || !eventData.date || !eventData.time) {
              showComponentToast('Event Data Required', 'Please select an event date and time first.', 'info');
              return;
            }
          }

          // Generate event chart using event data
          const eventChart = await generateChart({
            name: user.username || 'User',
            dateOfBirth: eventData.date,
            timeOfBirth: eventData.time,
            locationOfBirth: user.birthData.locationOfBirth,
            coordinates: user.birthData.coordinates
          });
          
          if (!eventChart) {
            showComponentToast('Generation Failed', 'Failed to generate event chart. Please try again.', 'error');
            return;
          }

          shareData = {
            chartType: 'event',
            svgContent: eventChart.svg,
            metadata: {
              ...eventChart.metadata,
              eventData: {
                eventTitle: eventData.title || 'Event Chart',
                eventDate: eventData.date,
                eventTime: eventData.time,
                isOptimal: eventData.isOptimal,
                optimalScore: eventData.optimalScore
              }
            },
            name: user.username || 'User'
          };
          break;
          
        default:
          return;
      }

      const embeddedChart = createEmbeddedChart(shareData);
      onChartSelect(embeddedChart);
    } catch (error) {
      logger.error('Error generating chart', error);
      showComponentToast('Unexpected Error', 'Failed to generate chart. Please try again.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClose = () => {
    setSelectedChartType('natal');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop overlay for mobile */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
        onClick={handleClose}
      />

      {/* Toast container */}
      <div 
        className={`
          fixed bottom-4 right-4 z-50 w-full max-w-md
          transform transition-all duration-300 ease-out
          ${isAnimatingIn 
            ? 'translate-y-0 opacity-100 scale-100' 
            : 'translate-y-8 opacity-0 scale-95'
          }
        `}
      >
        <div className="bg-white border-2 border-black shadow-lg">
          {/* Header */}
          <div className="p-4 border-b border-black bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-black flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-3 4h.01M12 12h.01M9 12h.01M6 20h12a2 2 0 002-2V8a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-space-grotesk font-bold text-black text-lg">Add Chart</h3>
                  <p className="text-xs text-black/70 font-open-sans">Attach your astrological chart</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                disabled={isGenerating}
                className="p-1 hover:bg-gray-200 border border-black transition-colors disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Chart Type Selection */}
            <div className="mb-4">
              <h4 className="font-space-grotesk font-bold text-black mb-3 text-sm">Chart Type</h4>
              <div className="space-y-2">
                {[
                  { 
                    type: 'natal' as const, 
                    title: 'Natal Chart', 
                    description: 'Your birth chart',
                    available: !!user?.birthData,
                    icon: '🌟'
                  },
                  { 
                    type: 'horary' as const, 
                    title: 'Horary Chart', 
                    description: 'Question-based chart',
                    available: questions.length > 0 || currentPageType === 'horary',
                    icon: '❓'
                  },
                  { 
                    type: 'event' as const, 
                    title: 'Event Chart', 
                    description: 'Chart for specific event',
                    available: !!user?.birthData,
                    icon: '📅'
                  }
                ].map((option) => (
                  <button
                    key={option.type}
                    onClick={() => setSelectedChartType(option.type)}
                    disabled={!option.available}
                    className={`w-full p-3 border border-black text-left transition-all duration-300 ${
                      selectedChartType === option.type
                        ? 'bg-black text-white'
                        : option.available 
                          ? 'bg-white text-black hover:bg-gray-50'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{option.icon}</span>
                      <div className="flex-1">
                        <div className="font-space-grotesk font-bold text-sm">{option.title}</div>
                        <div className="text-xs font-open-sans opacity-80">{option.description}</div>
                        {!option.available && option.type === 'natal' && (
                          <div className="text-xs mt-1 font-open-sans opacity-60">Complete birth data required</div>
                        )}
                        {!option.available && option.type === 'horary' && (
                          <div className="text-xs mt-1 font-open-sans opacity-60">
                            {questions.length === 0 && currentPageType !== 'horary' 
                              ? 'Create horary questions first' 
                              : 'Create a question first'
                            }
                          </div>
                        )}
                        {!option.available && option.type === 'event' && (
                          <div className="text-xs mt-1 font-open-sans opacity-60">
                            {!user?.birthData 
                              ? 'Birth data required' 
                              : 'Create events or visit Event Chart page'
                            }
                          </div>
                        )}
                      </div>
                      {selectedChartType === option.type && (
                        <div className="w-4 h-4 border-2 border-current rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-current rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Current Chart Preview */}
            {selectedChartType === 'natal' && cachedChart && user?.birthData && (
              <div className="mb-4 p-3 border border-gray-300 bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm">🌟</span>
                  <span className="font-space-grotesk font-bold text-black text-xs">
                    Current Natal Chart
                  </span>
                </div>
                <p className="text-xs text-black/70 font-open-sans">
                  Ready to attach your saved natal chart
                </p>
              </div>
            )}

            {selectedChartType === 'horary' && questions.length > 0 && currentPageType === 'horary' && (
              <div className="mb-4 p-3 border border-gray-300 bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm">❓</span>
                  <span className="font-space-grotesk font-bold text-black text-xs">
                    Current Horary Question
                  </span>
                </div>
                <p className="text-xs text-black/70 font-open-sans truncate">
                  "{questions[0].question}"
                </p>
              </div>
            )}

            {selectedChartType === 'event' && currentPageType === 'event' && user?.birthData && (
              <div className="mb-4 p-3 border border-gray-300 bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm">📅</span>
                  <span className="font-space-grotesk font-bold text-black text-xs">
                    Current Event Chart
                  </span>
                </div>
                <p className="text-xs text-black/70 font-open-sans">
                  Ready to attach chart for current event
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleClose}
                disabled={isGenerating}
                className="flex-1 px-3 py-2 text-xs border border-black bg-white text-black hover:bg-gray-50 transition-colors font-space-grotesk font-bold disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (selectedChartType === 'horary' && questions.length > 1) {
                    setShowSelectionList(true);
                  } else if (selectedChartType === 'event') {
                    setShowSelectionList(true);
                  } else {
                    handleGenerateAndAttach(selectedChartType);
                  }
                }}
                disabled={isGenerating || (selectedChartType === 'natal' && !user?.birthData)}
                className="flex-1 px-3 py-2 text-xs bg-black text-white hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-space-grotesk font-bold"
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center">
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                    Attaching...
                  </div>
                ) : (
                  selectedChartType === 'horary' && questions.length > 1 ? 'Select Question' :
                  selectedChartType === 'event' ? 'Select Event' :
                  'Attach'
                )}
              </button>
            </div>

            {/* Selection Lists */}
            {showSelectionList && selectedChartType === 'horary' && (
              <div className="mt-4 pt-4 border-t border-gray-300">
                <h4 className="font-space-grotesk font-bold text-black mb-3 text-sm">Select Horary Question</h4>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {questions.map((question) => (
                    <button
                      key={question.id}
                      onClick={() => {
                        setSelectedHoraryQuestion(question.id);
                        setShowSelectionList(false);
                        handleGenerateAndAttach('horary', question);
                      }}
                      className="w-full p-3 text-left border border-gray-300 hover:border-black hover:bg-gray-50 transition-colors"
                    >
                      <div className="font-space-grotesk font-bold text-sm text-black truncate">
                        {question.question}
                      </div>
                      <div className="text-xs text-black/60 font-open-sans mt-1">
                        {new Date(question.date).toLocaleDateString()}
                        {question.answer && <span className="ml-2 text-green-600">• {question.answer}</span>}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {showSelectionList && selectedChartType === 'event' && (
              <div className="mt-4 pt-4 border-t border-gray-300">
                <h4 className="font-space-grotesk font-bold text-black mb-3 text-sm">Select Event Type</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setSelectedEventType('bookmarked');
                    }}
                    className="w-full p-3 text-left border border-gray-300 hover:border-black hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-space-grotesk font-bold text-sm text-black">📋 Bookmarked Events</div>
                    <div className="text-xs text-black/60 font-open-sans">
                      {bookmarkedEvents.length > 0 ? `${bookmarkedEvents.length} saved events` : 'No bookmarked events'}
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedEventType('manual');
                      setShowSelectionList(false);
                      // Create a simple event for "right now"
                      const now = new Date();
                      const eventData = {
                        title: 'Current Moment',
                        date: now.toISOString().split('T')[0],
                        time: now.toTimeString().substring(0, 5),
                        isOptimal: false,
                        optimalScore: 50
                      };
                      handleGenerateAndAttach('event', eventData);
                    }}
                    className="w-full p-3 text-left border border-gray-300 hover:border-black hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-space-grotesk font-bold text-sm text-black">⚡ Current Moment</div>
                    <div className="text-xs text-black/60 font-open-sans">Generate chart for right now</div>
                  </button>
                </div>

                {/* Bookmarked Events List */}
                {selectedEventType === 'bookmarked' && (
                  <div className="mt-4 pt-4 border-t border-gray-300">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-space-grotesk font-bold text-black text-sm">Your Bookmarked Events</h5>
                      <button
                        onClick={() => setSelectedEventType(null)}
                        className="text-xs text-black/60 hover:text-black"
                      >
                        ← Back
                      </button>
                    </div>
                    {bookmarkedEvents.length > 0 ? (
                      <div className="max-h-40 overflow-y-auto space-y-2">
                        {bookmarkedEvents.map((event) => (
                          <button
                            key={event.id}
                            onClick={() => {
                              setShowSelectionList(false);
                              handleGenerateAndAttach('event', event);
                            }}
                            className="w-full p-3 text-left border border-gray-300 hover:border-black hover:bg-gray-50 transition-colors"
                          >
                            <div className="font-space-grotesk font-bold text-sm text-black truncate">
                              {event.title}
                            </div>
                            <div className="text-xs text-black/60 font-open-sans mt-1">
                              📅 {event.date} {event.time && `at ${event.time}`}
                              <span className={`ml-2 px-1 rounded text-white ${
                                event.type === 'benefic' ? 'bg-green-500' : 
                                event.type === 'challenging' ? 'bg-red-500' : 'bg-gray-500'
                              }`}>
                                {event.type}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-black/60 text-sm font-open-sans">
                        No bookmarked events found.
                        <br />
                        <span className="text-xs">Visit the Events page to bookmark some events first.</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Toast from useHoraryChart */}
      <StatusToast
        title={toast.title}
        message={toast.message}
        status={toast.status}
        isVisible={toast.isVisible}
        onHide={toast.hide}
        duration={toast.status === 'success' ? 3000 : toast.status === 'error' ? 5000 : 0}
      />

      {/* Component Status Toast */}
      <StatusToast
        title={componentToast.title}
        message={componentToast.message}
        status={componentToast.status}
        isVisible={componentToast.isVisible}
        onHide={hideComponentToast}
        duration={componentToast.status === 'success' ? 3000 : componentToast.status === 'error' ? 5000 : 0}
      />
    </>
  );
}