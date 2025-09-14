/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useMemo, useCallback } from 'react';
import { useInterpretationSections, useChartSidebar } from '@/store/chartStore';
import { usePremiumFeatures } from '@/hooks/usePremiumFeatures';
import { useUserStore } from '@/store/userStore';
import { useDragAndDrop } from '@/hooks/uiHooks/useDragAndDrop';
import { filterVisibleSections, calculateSectionStats, isSectionAccessible } from '@/utils/helpers/sectionHelpers';
import { InterpretationSectionService } from '@/services/businessServices/interpretationSectionService';
import { SidebarHeader } from './SidebarHeader';
import { SidebarSectionItem } from './SidebarSectionItem';
import { SidebarFooter } from './SidebarFooter';

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

  const [isReorderMode, setIsReorderMode] = useState(false);
  const userIsPremium = user?.subscriptionTier === 'premium' || false;

  // Force reset if needed
  React.useEffect(() => {
    if (orderedSections.length === 0) {
      resetSectionsToDefault();
    }
  }, [orderedSections.length, resetSectionsToDefault]);

  // Use the drag and drop hook
  const {
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    draggedItem,
    dragOverItem
  } = useDragAndDrop({
    items: orderedSections,
    onReorder: reorderSections,
    isEnabled: isReorderMode
  });

  // Get visible sections using the utility
  const visibleSections = useMemo(() => {
    return filterVisibleSections({
      sections: orderedSections,
      isReorderMode,
      userIsPremium,
      shouldShowFeature,
      features
    });
  }, [orderedSections, isReorderMode, userIsPremium, shouldShowFeature, features]);

  // Calculate statistics
  const stats = useMemo(() => {
    return calculateSectionStats(orderedSections, userIsPremium, shouldShowFeature);
  }, [orderedSections, userIsPremium, shouldShowFeature]);

  // Handle section click
  const handleSectionClick = useCallback((section: typeof orderedSections[0]) => {
    if (isReorderMode) return;

    if (section.isPremium && !shouldShowFeature(section.id, userIsPremium)) {
      return;
    }

    onSectionClick?.(section.id);
  }, [isReorderMode, onSectionClick, shouldShowFeature, userIsPremium]);

  // Collapsed view
  if (sidebarCollapsed) {
    return (
      <div className={`w-full bg-white ${className}`}>
        <SidebarHeader
          isReorderMode={isReorderMode}
          onReorderToggle={() => setIsReorderMode(!isReorderMode)}
          onReset={resetSectionsToDefault}
          onToggleSidebar={toggleSidebar}
          isCollapsed={true}
        />
      </div>
    );
  }

  // Expanded view
  return (
    <div className={`w-full bg-white ${className}`}>
      <SidebarHeader
        isReorderMode={isReorderMode}
        onReorderToggle={() => setIsReorderMode(!isReorderMode)}
        onReset={resetSectionsToDefault}
        onToggleSidebar={toggleSidebar}
        isCollapsed={false}
      />

      {/* Sections List */}
      <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
        {visibleSections.map((section, index) => {
          const isAccessible = isSectionAccessible(section, userIsPremium, shouldShowFeature, features);
          const isDragging = draggedItem === section.id;
          const isDragOver = dragOverItem === section.id;

          return (
            <SidebarSectionItem
              key={section.id}
              section={section}
              index={index}
              isReorderMode={isReorderMode}
              isDragging={isDragging}
              isDragOver={isDragOver}
              isAccessible={isAccessible}
              userIsPremium={userIsPremium}
              features={features}
              shouldShowFeature={shouldShowFeature}
              onDragStart={(e) => handleDragStart(e, section.id)}
              onDragOver={(e) => handleDragOver(e, section.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, section.id)}
              onClick={() => handleSectionClick(section)}
              onToggleVisibility={toggleSectionVisibility}
            />
          );
        })}
      </div>

      {/* Footer */}
      {!isReorderMode && (
        <SidebarFooter
          visibleCount={stats.visibleSections}
          totalCount={stats.totalSections}
          lockedCount={stats.lockedSections}
          userIsPremium={userIsPremium}
          features={features}
          onCustomize={() => setIsReorderMode(true)}
        />
      )}
    </div>
  );
};

export default InterpretationSidebar;