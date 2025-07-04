/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import TrafficSourcesChart from '../charts/TrafficSourcesChart';

interface TrafficSource {
  name: string;
  value: number;
  color: string;
}

interface TrafficSourcesCardProps {
  isLoading: boolean;
  trafficData: any[];
}

export default function TrafficSourcesCard({ isLoading, trafficData }: TrafficSourcesCardProps) {
  const [trafficSources, setTrafficSources] = useState<TrafficSource[]>([]);

  useEffect(() => {
    const fetchTrafficSources = async () => {
      try {
        const sourcesResponse = await fetch('/api/admin/traffic-sources');
        if (sourcesResponse.ok) {
          const sourcesData = await sourcesResponse.json();
          if (sourcesData.success) {
            // Transform the data to match our chart component interface
            const transformedSources = sourcesData.sources.map((source: any) => ({
              name: source.source,
              value: source.percentage,
              color: source.color.replace('bg-[', '').replace(']', '') // Remove Tailwind bg-[] wrapper
            }));
            setTrafficSources(transformedSources);
          }
        }
      } catch (error) {
        console.warn('Failed to fetch traffic sources:', error);
        // Set empty data instead of fallback
        setTrafficSources([]);
      }
    };

    fetchTrafficSources();
  }, [trafficData]);

  return (
    <TrafficSourcesChart 
      data={trafficSources.length > 0 ? trafficSources : undefined}
      isLoading={isLoading}
    />
  );
}