/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useCallback } from 'react';

interface UseContentProcessingReturn {
  // State
  pastedContent: string;
  scrapedContent: any[];
  previewContent: any[];
  
  // Actions
  setPastedContent: (content: string) => void;
  setPreviewContent: (content: any[]) => void;
  handleProcessPastedContent: (discussionsToGenerate: number, onResult: (result: any) => void, onProgress: (progress: number) => void) => Promise<void>;
  handleProcessWithAI: (aiConfig: any, generationSettings: any, onResult: (result: any) => void, onProgress: (progress: number) => void) => Promise<void>;
  handleClearContent: () => void;
}

export const useContentProcessing = (): UseContentProcessingReturn => {
  const [pastedContent, setPastedContent] = useState('');
  const [scrapedContent, setScrapedContent] = useState<any[]>([]);
  const [previewContent, setPreviewContent] = useState<any[]>([]);

  const handleProcessPastedContent = useCallback(async (
    discussionsToGenerate: number,
    onResult: (result: any) => void,
    onProgress: (progress: number) => void
  ) => {
    if (!pastedContent.trim()) {
      onResult({
        success: false,
        error: 'Please paste some Reddit content first.'
      });
      return;
    }

    console.log('Frontend: Sending content length:', pastedContent.length);
    console.log('Frontend: First 200 chars:', pastedContent.substring(0, 200));

    onProgress(10);

    try {
      const response = await fetch('/api/admin/process-pasted-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: pastedContent,
          settings: {
            discussionsToGenerate
          }
        }),
      });

      const result = await response.json();
      onProgress(50);

      if (result.success) {
        setScrapedContent(result.data);
        onResult({ 
          success: true, 
          message: result.message,
          scrapedPosts: result.data.length,
          summary: result.summary
        });
      } else {
        onResult({
          success: false,
          error: result.error
        });
      }

    } catch (error) {
      onResult({
        success: false,
        error: 'Failed to parse pasted content: ' + (error as Error).message
      });
    } finally {
      onProgress(0);
    }
  }, [pastedContent]);

  const handleProcessWithAI = useCallback(async (
    aiConfig: any,
    generationSettings: any,
    onResult: (result: any) => void,
    onProgress: (progress: number) => void
  ) => {
    if (scrapedContent.length === 0) {
      onResult({
        success: false,
        error: 'No content available. Please process pasted content first.'
      });
      return;
    }

    if (!aiConfig.apiKey?.trim()) {
      onResult({
        success: false,
        error: 'AI API key is required for transformation.'
      });
      return;
    }

    onProgress(60);

    try {
      onProgress(65);
      const response = await fetch('/api/admin/transform-with-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          parsedContent: scrapedContent,
          aiConfig,
          generationSettings
        }),
      });

      onProgress(80);
      const result = await response.json();
      onProgress(100);

      if (result.success) {
        setPreviewContent(result.data);
        onResult({
          success: true,
          message: result.message,
          processedDiscussions: result.data.length,
          totalReplies: result.summary.totalReplies,
          batchId: result.batchId,
          summary: result.summary
        });
        
        // Auto-scroll to the AI processed content section
        setTimeout(() => {
          const previewSection = document.getElementById('ai-processed-content');
          if (previewSection) {
            previewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      } else {
        onResult({
          success: false,
          error: result.error || 'Failed to transform content with AI'
        });
      }

    } catch (error) {
      onResult({
        success: false,
        error: 'AI processing failed: ' + (error as Error).message
      });
    } finally {
      onProgress(0);
    }
  }, [scrapedContent]);

  const handleClearContent = useCallback(() => {
    setPastedContent('');
    setScrapedContent([]);
    setPreviewContent([]);
  }, []);

  return {
    // State
    pastedContent,
    scrapedContent,
    previewContent,
    
    // Actions
    setPastedContent,
    setPreviewContent,
    handleProcessPastedContent,
    handleProcessWithAI,
    handleClearContent
  };
};