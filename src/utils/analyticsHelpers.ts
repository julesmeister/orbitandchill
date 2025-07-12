/* eslint-disable @typescript-eslint/no-unused-vars */

interface Analytics {
  totalEvents: number;
  generationStats: {
    generated: number;
    manual: number;
  };
  eventsByType: {
    benefic: number;
    challenging: number;
    neutral: number;
  };
  engagementStats: {
    bookmarked: number;
  };
}

export const calculatePercentage = (value: number, total: number): number => {
  return total > 0 ? Math.round((value / total) * 100) : 0;
};

export const getGeneratedPercentage = (analytics: Analytics | null): number => {
  if (!analytics) return 0;
  return calculatePercentage(analytics.generationStats.generated, analytics.totalEvents);
};

export const getBeneficPercentage = (analytics: Analytics | null): number => {
  if (!analytics) return 0;
  return calculatePercentage(analytics.eventsByType.benefic, analytics.totalEvents);
};

export const getBookmarkPercentage = (analytics: Analytics | null): number => {
  if (!analytics) return 0;
  return calculatePercentage(analytics.engagementStats.bookmarked, analytics.totalEvents);
};

export const getManualPercentage = (analytics: Analytics | null): number => {
  if (!analytics) return 0;
  return calculatePercentage(analytics.generationStats.manual, analytics.totalEvents);
};