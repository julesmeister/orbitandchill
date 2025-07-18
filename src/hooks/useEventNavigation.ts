/* eslint-disable @typescript-eslint/no-unused-vars */
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { AstrologicalEvent } from '../store/eventsStore';

export function useEventNavigation() {
  const router = useRouter();

  const navigateToEventChart = useCallback((event: AstrologicalEvent) => {
    const params = new URLSearchParams({
      date: event.date,
      time: event.time || '12:00',
      title: event.title,
      isOptimal: event.isGenerated ? 'true' : 'false',
      score: event.score.toString()
    });

    // Add time window information if available
    if (event.timeWindow) {
      params.set('startTime', event.timeWindow.startTime);
      params.set('endTime', event.timeWindow.endTime);
      params.set('duration', event.timeWindow.duration);
    }

    router.push(`/event-chart?${params.toString()}`);
  }, [router]);

  return { navigateToEventChart };
}