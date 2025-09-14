/* eslint-disable @typescript-eslint/no-unused-vars */
import type { InterpretationSection } from '@/store/chartStore';

export class InterpretationSectionService {
  /**
   * Filters sections based on user access and premium status
   */
  static filterByAccess(
    sections: InterpretationSection[],
    userIsPremium: boolean,
    features: any[],
    shouldShowFeature: (sectionId: string, isPremium: boolean) => boolean
  ): InterpretationSection[] {
    if (features.length === 0) {
      return sections;
    }

    return sections.filter(section => {
      if (!section.isPremium) return true;
      return shouldShowFeature(section.id, userIsPremium);
    });
  }

  /**
   * Reorders sections based on drag and drop operation
   */
  static reorderSections(
    sections: InterpretationSection[],
    draggedId: string,
    targetId: string
  ): InterpretationSection[] {
    const newSections = [...sections];
    const draggedIndex = newSections.findIndex(s => s.id === draggedId);
    const targetIndex = newSections.findIndex(s => s.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) {
      return sections;
    }

    const [draggedSection] = newSections.splice(draggedIndex, 1);
    newSections.splice(targetIndex, 0, draggedSection);

    return newSections;
  }

  /**
   * Calculates visibility statistics for sections
   */
  static calculateVisibilityStats(
    sections: InterpretationSection[],
    userIsPremium: boolean,
    shouldShowFeature: (sectionId: string, isPremium: boolean) => boolean
  ): {
    visibleCount: number;
    totalCount: number;
    premiumLockedCount: number;
  } {
    const visibleCount = sections.filter(s => s.isVisible).length;
    const totalCount = sections.length;
    const premiumLockedCount = sections.filter(
      s => s.isPremium && s.isVisible && !shouldShowFeature(s.id, userIsPremium)
    ).length;

    return {
      visibleCount,
      totalCount,
      premiumLockedCount
    };
  }

  /**
   * Checks if a section should be displayed based on current state
   */
  static shouldDisplaySection(
    section: InterpretationSection,
    isReorderMode: boolean,
    userIsPremium: boolean,
    shouldShowFeature: (sectionId: string, isPremium: boolean) => boolean
  ): boolean {
    if (isReorderMode) return true;
    if (!section.isVisible) return false;
    if (!section.isPremium) return true;
    return shouldShowFeature(section.id, userIsPremium);
  }
}