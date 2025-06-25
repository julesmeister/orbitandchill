/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface ChartGenerationRequest {
  userId: string;
  subjectName: string;
  dateOfBirth: string;
  timeOfBirth: string;
  locationOfBirth: string;
  coordinates: {
    lat: string;
    lon: string;
  };
  chartType?: 'natal' | 'transit' | 'synastry' | 'composite';
  title?: string;
  description?: string;
  theme?: string;
  isPublic?: boolean;
  forceRegenerate?: boolean;
}

interface ChartData {
  id: string;
  userId: string;
  subjectName: string;
  dateOfBirth: string;
  timeOfBirth: string;
  locationOfBirth: string;
  latitude: number;
  longitude: number;
  chartType: string;
  title?: string;
  description?: string;
  theme?: string;
  isPublic?: boolean;
  shareToken?: string;
  chartData: string; // SVG content
  metadata: any;
  createdAt: string;
  updatedAt: string;
}

interface ChartAPIResponse {
  success: boolean;
  chart: ChartData;
  cached?: boolean;
}

interface UserChartsResponse {
  success: boolean;
  charts: ChartData[];
  count: number;
}

export function useChartAPI() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentChart, setCurrentChart] = useState<ChartData | null>(null);

  /**
   * Generate a new chart or retrieve existing one
   */
  const generateChart = useCallback(async (request: ChartGenerationRequest): Promise<ChartData | null> => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/charts/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate chart');
      }

      const data: ChartAPIResponse = await response.json();
      
      if (data.success) {
        setCurrentChart(data.chart);
        
        if (data.cached) {
          toast.success('Chart loaded from cache');
        } else {
          toast.success('Chart generated successfully');
        }
        
        return data.chart;
      } else {
        throw new Error('Chart generation failed');
      }
    } catch (error) {
      console.error('Chart generation error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate chart');
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  /**
   * Get a chart by ID
   */
  const getChart = useCallback(async (id: string, userId?: string, shareToken?: string): Promise<ChartData | null> => {
    setIsLoading(true);
    
    try {
      const params = new URLSearchParams();
      if (userId) params.set('userId', userId);
      if (shareToken) params.set('shareToken', shareToken);
      
      const url = `/api/charts/${id}${params.toString() ? '?' + params.toString() : ''}`;
      
      const response = await fetch(url);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to retrieve chart');
      }

      const data: ChartAPIResponse = await response.json();
      
      if (data.success) {
        setCurrentChart(data.chart);
        return data.chart;
      } else {
        throw new Error('Chart retrieval failed');
      }
    } catch (error) {
      console.error('Chart retrieval error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to retrieve chart');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Get all charts for a user
   */
  const getUserCharts = useCallback(async (userId: string): Promise<ChartData[]> => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/users/charts?userId=${encodeURIComponent(userId)}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to retrieve user charts');
      }

      const data: UserChartsResponse = await response.json();
      
      if (data.success) {
        return data.charts;
      } else {
        throw new Error('User charts retrieval failed');
      }
    } catch (error) {
      console.error('User charts retrieval error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to retrieve charts');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Update a chart
   */
  const updateChart = useCallback(async (id: string, userId: string, updates: Partial<ChartGenerationRequest>): Promise<ChartData | null> => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/charts/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, ...updates }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update chart');
      }

      const data: ChartAPIResponse = await response.json();
      
      if (data.success) {
        setCurrentChart(data.chart);
        toast.success('Chart updated successfully');
        return data.chart;
      } else {
        throw new Error('Chart update failed');
      }
    } catch (error) {
      console.error('Chart update error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update chart');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Delete a chart
   */
  const deleteChart = useCallback(async (id: string, userId: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/charts/${id}?userId=${encodeURIComponent(userId)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete chart');
      }

      const data = await response.json();
      
      if (data.success) {
        toast.success('Chart deleted successfully');
        
        // Clear current chart if it was the deleted one
        if (currentChart?.id === id) {
          setCurrentChart(null);
        }
        
        return true;
      } else {
        throw new Error('Chart deletion failed');
      }
    } catch (error) {
      console.error('Chart deletion error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete chart');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [currentChart]);

  /**
   * Generate a share token for a chart
   */
  const shareChart = useCallback(async (id: string, userId: string): Promise<{ shareToken: string; shareUrl: string } | null> => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/charts/${id}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate share link');
      }

      const data = await response.json();
      
      if (data.success) {
        toast.success('Share link generated successfully');
        return {
          shareToken: data.shareToken,
          shareUrl: data.shareUrl,
        };
      } else {
        throw new Error('Share link generation failed');
      }
    } catch (error) {
      console.error('Share link generation error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate share link');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    // State
    isGenerating,
    isLoading,
    currentChart,
    
    // Actions
    generateChart,
    getChart,
    getUserCharts,
    updateChart,
    deleteChart,
    shareChart,
    
    // Utilities
    setCurrentChart,
  };
}