/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import * as React from 'react';
import { AstrologicalEvent } from '../../utils/astrologicalEventDetection';
import { 
  getEventInterpretation, 
  hasEventInterpretation,
  EventInterpretation,
  EventActionableAdvice 
} from '../../utils/astrological/eventInterpretations';
import { EVENT_TYPE_COLORS } from '../../utils/astrological/eventData';

interface EventModalProps {
  event: AstrologicalEvent;
  isOpen: boolean;
  onClose: () => void;
}

export default function EventModal({ event, isOpen, onClose }: EventModalProps) {
  if (!isOpen) return null;

  // Get interpretation for this event
  const interpretation = getEventInterpretation(event.type, event.name, event.description);

  // Close modal when clicking outside
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Close modal on Escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const formatDuration = (duration?: AstrologicalEvent['duration']) => {
    if (!duration) return '';
    
    const parts = [];
    if (duration.years) parts.push(`${duration.years} year${duration.years > 1 ? 's' : ''}`);
    if (duration.months) parts.push(`${duration.months} month${duration.months > 1 ? 's' : ''}`);
    if (duration.weeks) parts.push(`${duration.weeks} week${duration.weeks > 1 ? 's' : ''}`);
    if (duration.days) parts.push(`${duration.days} day${duration.days > 1 ? 's' : ''}`);
    if (duration.hours) parts.push(`${duration.hours} hour${duration.hours > 1 ? 's' : ''}`);
    
    return parts.join(', ');
  };

  return (
    <div 
      className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white border-2 border-black max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div 
          className="p-6 border-b-2 border-black"
          style={{ backgroundColor: EVENT_TYPE_COLORS[event.type] }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-4xl mr-4">{event.emoji}</span>
              <div>
                <h2 className="font-space-grotesk text-2xl font-bold text-white">
                  {event.name}
                </h2>
                <p className="font-open-sans text-white/90 text-lg">
                  {event.description}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-3xl font-bold"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
        </div>

        {/* Basic Event Info */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-bold">Date:</span>
              <div>{event.date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</div>
            </div>
            <div>
              <span className="font-bold">Rarity:</span>
              <div className="capitalize">{event.rarity}</div>
            </div>
            {event.duration && (
              <div>
                <span className="font-bold">Duration:</span>
                <div>{formatDuration(event.duration)}</div>
              </div>
            )}
            {event.endDate && (
              <div>
                <span className="font-bold">Until:</span>
                <div>{event.endDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</div>
              </div>
            )}
          </div>
          
          <div className="mt-4">
            <span className="font-bold">Impact:</span>
            <p className="text-gray-700 mt-1">{event.impact}</p>
          </div>
        </div>

        {/* Detailed Interpretation */}
        {interpretation ? (
          <div className="p-6 space-y-6">
            {/* Title and Subtitle */}
            <div className="text-center">
              <h3 className="font-space-grotesk text-3xl font-bold text-black mb-2">
                {interpretation.title}
              </h3>
              <p className="font-open-sans text-xl text-gray-600">
                {interpretation.subtitle}
              </p>
            </div>

            {/* Main Description */}
            <div className="bg-gray-50 border border-gray-200 p-6">
              <p className="font-open-sans text-lg leading-relaxed text-gray-800">
                {interpretation.description}
              </p>
            </div>

            {/* Advice Sections */}
            <div className="space-y-6">
              {/* Overview & Energy */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 border border-blue-200 p-4">
                  <h4 className="font-space-grotesk font-bold text-lg mb-2">Overview</h4>
                  <p className="text-sm text-gray-700">{interpretation.advice.overview}</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 p-4">
                  <h4 className="font-space-grotesk font-bold text-lg mb-2">Energy</h4>
                  <p className="text-sm text-gray-700">{interpretation.advice.energy}</p>
                </div>
              </div>

              {/* Timing */}
              <div className="bg-yellow-50 border border-yellow-200 p-4">
                <h4 className="font-space-grotesk font-bold text-lg mb-2">Timing</h4>
                <p className="text-sm text-gray-700">{interpretation.advice.timing}</p>
              </div>

              {/* Dos and Don'ts */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 border border-green-200 p-4">
                  <h4 className="font-space-grotesk font-bold text-lg mb-3 text-green-800">
                    ✅ What To Do
                  </h4>
                  <ul className="space-y-2">
                    {interpretation.advice.dos.map((item, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-red-50 border border-red-200 p-4">
                  <h4 className="font-space-grotesk font-bold text-lg mb-3 text-red-800">
                    ❌ What To Avoid
                  </h4>
                  <ul className="space-y-2">
                    {interpretation.advice.donts.map((item, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <span className="text-red-600 mr-2">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Opportunities and Warnings */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-teal-50 border border-teal-200 p-4">
                  <h4 className="font-space-grotesk font-bold text-lg mb-3 text-teal-800">
                    🌟 Opportunities
                  </h4>
                  <ul className="space-y-2">
                    {interpretation.advice.opportunities.map((item, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <span className="text-teal-600 mr-2">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-orange-50 border border-orange-200 p-4">
                  <h4 className="font-space-grotesk font-bold text-lg mb-3 text-orange-800">
                    ⚠️ Warnings
                  </h4>
                  <ul className="space-y-2">
                    {interpretation.advice.warnings.map((item, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <span className="text-orange-600 mr-2">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Rituals and Affirmations */}
              {(interpretation.advice.rituals || interpretation.advice.affirmations) && (
                <div className="grid md:grid-cols-2 gap-6">
                  {interpretation.advice.rituals && (
                    <div className="bg-indigo-50 border border-indigo-200 p-4">
                      <h4 className="font-space-grotesk font-bold text-lg mb-3 text-indigo-800">
                        🕯️ Rituals & Practices
                      </h4>
                      <ul className="space-y-2">
                        {interpretation.advice.rituals.map((item, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-start">
                            <span className="text-indigo-600 mr-2">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {interpretation.advice.affirmations && (
                    <div className="bg-pink-50 border border-pink-200 p-4">
                      <h4 className="font-space-grotesk font-bold text-lg mb-3 text-pink-800">
                        💭 Affirmations
                      </h4>
                      <ul className="space-y-2">
                        {interpretation.advice.affirmations.map((item, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-start">
                            <span className="text-pink-600 mr-2">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-6 text-center">
            <div className="bg-gray-50 border border-gray-200 p-8">
              <h3 className="font-space-grotesk text-xl font-bold mb-2">
                General Guidance
              </h3>
              <p className="text-gray-600 mb-4">
                While we don't have specific interpretations for this event yet, here's what we know:
              </p>
              <div className="text-left max-w-2xl mx-auto">
                <p className="mb-4"><strong>Impact:</strong> {event.impact}</p>
                <p className="text-sm text-gray-600">
                  This {event.rarity} astrological event offers an opportunity to attune to cosmic rhythms 
                  and work with the natural flow of planetary energies. Pay attention to themes related to 
                  this event and how they manifest in your life during this period.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Use this guidance mindfully and trust your own intuition
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-black text-white font-space-grotesk font-bold hover:bg-gray-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}