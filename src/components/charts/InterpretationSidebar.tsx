/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from 'react';
import { useInterpretationSections, useChartSidebar, InterpretationSection } from '@/store/chartStore';
import { usePremiumFeatures } from '@/hooks/usePremiumFeatures';
import { useUserStore } from '@/store/userStore';

interface InterpretationSidebarProps {
  onSectionClick?: (sectionId: string) => void;
  className?: string;
}

const InterpretationSidebar: React.FC<InterpretationSidebarProps> = ({ 
  onSectionClick,
  className = ""
}) => {
  const { user } = useUserStore();
  const { shouldShowFeature, features } = usePremiumFeatures();
  const { 
    orderedSections, 
    reorderSections, 
    toggleSectionVisibility,
    resetSectionsToDefault 
  } = useInterpretationSections();
  const { sidebarCollapsed, toggleSidebar } = useChartSidebar();
  
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);
  const [isReorderMode, setIsReorderMode] = useState(false);
  
  const userIsPremium = user?.subscriptionTier === 'premium' || false;

  const handleDragStart = (e: React.DragEvent, sectionId: string) => {
    if (!isReorderMode) return;
    setDraggedItem(sectionId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, sectionId: string) => {
    if (!isReorderMode || !draggedItem) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverItem(sectionId);
  };

  const handleDragLeave = () => {
    setDragOverItem(null);
  };

  const handleDrop = (e: React.DragEvent, targetSectionId: string) => {
    e.preventDefault();
    
    if (!draggedItem || !isReorderMode || draggedItem === targetSectionId) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    const newSections = [...orderedSections];
    const draggedIndex = newSections.findIndex(s => s.id === draggedItem);
    const targetIndex = newSections.findIndex(s => s.id === targetSectionId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    // Remove dragged item and insert at target position
    const draggedSection = newSections.splice(draggedIndex, 1)[0];
    newSections.splice(targetIndex, 0, draggedSection);

    reorderSections(newSections);
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleSectionClick = (section: InterpretationSection) => {
    if (isReorderMode) return;
    
    // Check if user has access to this section
    if (section.isPremium && !shouldShowFeature(section.id, userIsPremium)) {
      // Could show premium modal here
      return;
    }
    
    onSectionClick?.(section.id);
  };

  const getVisibleSections = () => {
    return orderedSections.filter(section => {
      // Show all sections in reorder mode, otherwise only show accessible ones
      if (isReorderMode) return true;
      
      // Must be visible first
      if (!section.isVisible) return false;
      
      // If premium features haven't loaded yet (0 features), show all visible sections as fallback
      if (features.length === 0) return true;
      
      // For sections that are visible, check if user has access
      return shouldShowFeature(section.id, userIsPremium);
    });
  };

  if (sidebarCollapsed) {
    return (
      <div className={`w-full bg-white ${className}`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-space-grotesk text-lg font-bold text-black">
              Interpretation Sections
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsReorderMode(!isReorderMode)}
                className={`h-8 px-3 text-xs font-medium border transition-colors ${
                  isReorderMode
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-gray-300 hover:bg-gray-50'
                }`}
              >
                {isReorderMode ? 'Done' : 'Reorder'}
              </button>
              {isReorderMode && (
                <button
                  onClick={resetSectionsToDefault}
                  className="flex items-center gap-1.5 h-8 px-3 text-xs font-medium border border-gray-300 bg-white text-black hover:bg-black hover:text-white transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reset
                </button>
              )}
              <button
                onClick={toggleSidebar}
                className="w-8 h-8 flex items-center justify-center bg-black text-white hover:bg-gray-800 transition-colors border border-black"
                title="Expand sections"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
          </div>
          
          {isReorderMode && (
            <p className="text-xs text-gray-600">
              Drag sections to reorder them according to your preference
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full bg-white ${className}`}>
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-space-grotesk text-lg font-bold text-black">
            Interpretation Sections
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsReorderMode(!isReorderMode)}
              className={`h-8 px-3 text-xs font-medium border transition-colors ${
                isReorderMode
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-black border-gray-300 hover:bg-gray-50'
              }`}
            >
              {isReorderMode ? 'Done' : 'Reorder'}
            </button>
            {isReorderMode && (
              <button
                onClick={resetSectionsToDefault}
                className="flex items-center gap-1.5 h-8 px-3 text-xs font-medium border border-gray-300 bg-white text-black hover:bg-black hover:text-white transition-colors"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset
              </button>
            )}
            <button
              onClick={toggleSidebar}
              className="w-8 h-8 flex items-center justify-center bg-black text-white hover:bg-gray-800 transition-colors border border-black"
              title="Collapse sections"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {isReorderMode && (
          <p className="text-xs text-gray-600 mt-2">
            Drag sections to reorder them according to your preference
          </p>
        )}
      </div>

      {/* Sections List */}
      <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
        {getVisibleSections().map((section, index) => {
          const isAccessible = features.length === 0 ? true : shouldShowFeature(section.id, userIsPremium);
          const isDragging = draggedItem === section.id;
          const isDragOver = dragOverItem === section.id;

          return (
            <div
              key={section.id}
              draggable={isReorderMode}
              onDragStart={(e) => handleDragStart(e, section.id)}
              onDragOver={(e) => handleDragOver(e, section.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, section.id)}
              onClick={() => handleSectionClick(section)}
              className={`
                relative p-3 border border-gray-200 bg-white transition-all duration-200 cursor-pointer
                ${isReorderMode ? 'cursor-move' : 'cursor-pointer'}
                ${isDragging ? 'opacity-50 scale-95' : ''}
                ${isDragOver ? 'border-black bg-gray-50' : ''}
                ${!isAccessible ? 'opacity-60' : ''}
                ${isReorderMode ? 'hover:border-gray-400' : 'hover:border-black hover:bg-gray-50'}
              `}
            >
              <div className="flex items-center">
                {/* Drag Handle */}
                {isReorderMode && (
                  <div className="w-5 h-5 flex items-center justify-center mr-3 text-gray-400">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                    </svg>
                  </div>
                )}

                {/* Section Info */}
                <div className="flex items-center flex-1">
                  <span className="text-lg mr-3">{section.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-space-grotesk text-sm font-semibold text-black">
                        {section.name}
                      </h4>
                      {section.isPremium && features.length > 0 && !shouldShowFeature(section.id, userIsPremium) && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 border border-yellow-300">
                          PRO
                        </span>
                      )}
                      {!isAccessible && features.length > 0 && (
                        <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {section.description}
                    </p>
                  </div>
                </div>

                {/* Order Number */}
                {isReorderMode && (
                  <div className="w-6 h-6 bg-gray-100 border border-gray-300 flex items-center justify-center ml-3">
                    <span className="text-xs font-mono text-gray-600">
                      {index + 1}
                    </span>
                  </div>
                )}

                {/* Visibility Toggle */}
                {!isReorderMode && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSectionVisibility(section.id);
                    }}
                    className="w-6 h-6 flex items-center justify-center ml-3 text-gray-400 hover:text-gray-600"
                    title={section.isVisible ? 'Hide section' : 'Show section'}
                  >
                    {section.isVisible ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    )}
                  </button>
                )}
              </div>

              {/* Drop Indicator */}
              {isDragOver && isReorderMode && (
                <div className="absolute inset-0 border-2 border-black bg-black/5 pointer-events-none" />
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      {!isReorderMode && (
        <div className="p-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-2">
            {getVisibleSections().length} of {orderedSections.length} sections visible
            {!userIsPremium && features.length > 0 && orderedSections.filter(s => s.isPremium && s.isVisible && !shouldShowFeature(s.id, userIsPremium)).length > 0 && (
              <span className="text-yellow-600">
                {' '}({orderedSections.filter(s => s.isPremium && s.isVisible && !shouldShowFeature(s.id, userIsPremium)).length} premium)
              </span>
            )}
          </p>
          <button
            onClick={() => setIsReorderMode(true)}
            className="text-xs text-black hover:text-gray-600 font-medium"
          >
            Customize section order →
          </button>
        </div>
      )}
    </div>
  );
};

export default InterpretationSidebar;