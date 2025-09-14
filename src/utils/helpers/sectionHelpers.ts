/* eslint-disable @typescript-eslint/no-unused-vars */
import type { InterpretationSection } from '@/store/chartStore';

export interface SectionFilterParams {
  sections: InterpretationSection[];
  isReorderMode: boolean;
  userIsPremium: boolean;
  shouldShowFeature: (sectionId: string, isPremium: boolean) => boolean;
  features: any[];
}

export interface SectionStats {
  totalSections: number;
  visibleSections: number;
  premiumSections: number;
  lockedSections: number;
}

/**
 * Filters sections based on visibility, premium status, and user access
 */
export function filterVisibleSections({
  sections,
  isReorderMode,
  userIsPremium,
  shouldShowFeature,
  features
}: SectionFilterParams): InterpretationSection[] {
  return sections.filter(section => {
    // Show all sections in reorder mode
    if (isReorderMode) return true;

    // Must be visible first
    if (!section.isVisible) {
      return false;
    }

    // Always show non-premium sections
    if (!section.isPremium) {
      return true;
    }

    // For premium sections, check user access
    return shouldShowFeature(section.id, userIsPremium);
  });
}

/**
 * Calculates statistics about sections
 */
export function calculateSectionStats(
  sections: InterpretationSection[],
  userIsPremium: boolean,
  shouldShowFeature: (sectionId: string, isPremium: boolean) => boolean
): SectionStats {
  const visibleSections = sections.filter(s => s.isVisible).length;
  const premiumSections = sections.filter(s => s.isPremium).length;
  const lockedSections = sections.filter(
    s => s.isPremium && s.isVisible && !shouldShowFeature(s.id, userIsPremium)
  ).length;

  return {
    totalSections: sections.length,
    visibleSections,
    premiumSections,
    lockedSections
  };
}

/**
 * Checks if a section is accessible to the user
 */
export function isSectionAccessible(
  section: InterpretationSection,
  userIsPremium: boolean,
  shouldShowFeature: (sectionId: string, isPremium: boolean) => boolean,
  features: any[]
): boolean {
  if (features.length === 0) return true;
  return shouldShowFeature(section.id, userIsPremium);
}