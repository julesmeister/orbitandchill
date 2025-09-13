/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useCallback } from 'react';

interface PDFGenerationOptions {
  filename?: string;
  quality?: number;
  format?: 'a4' | 'letter' | 'legal';
  orientation?: 'portrait' | 'landscape';
  margins?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  maintainAspectRatio?: boolean;
  centerOnPage?: boolean;
}

interface PDFGenerationResult {
  success: boolean;
  blob?: Blob;
  error?: string;
}

interface PDFDimensions {
  width: number;
  height: number;
}

interface CanvasCreationOptions {
  width: number;
  height: number;
  quality: number;
  backgroundColor?: string;
}

const PAGE_FORMATS: Record<string, PDFDimensions> = {
  a4: { width: 210, height: 297 },
  letter: { width: 216, height: 279 },
  legal: { width: 216, height: 356 }
};

const DEFAULT_OPTIONS: Required<PDFGenerationOptions> = {
  filename: 'chart.pdf',
  quality: 1.0,
  format: 'a4',
  orientation: 'portrait',
  margins: { top: 20, right: 20, bottom: 20, left: 20 },
  maintainAspectRatio: true,
  centerOnPage: true
};

const PX_TO_MM = 0.264583;
const MIN_ELEMENT_SIZE = 100;
const MIN_ELEMENT_AREA = 10000;

const createCanvas = (options: CanvasCreationOptions): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Could not get 2D context');
  }

  canvas.width = options.width * options.quality;
  canvas.height = options.height * options.quality;
  
  ctx.scale(options.quality, options.quality);
  
  if (options.backgroundColor) {
    ctx.fillStyle = options.backgroundColor;
    ctx.fillRect(0, 0, options.width, options.height);
  }
  
  return canvas;
};

const loadImageFromBlob = (blob: Blob): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    
    img.src = url;
  });
};

const calculatePDFDimensions = (
  canvasWidth: number, 
  canvasHeight: number, 
  options: Required<PDFGenerationOptions>
) => {
  const pageFormat = PAGE_FORMATS[options.format];
  const pageWidth = options.orientation === 'landscape' ? pageFormat.height : pageFormat.width;
  const pageHeight = options.orientation === 'landscape' ? pageFormat.width : pageFormat.height;
  
  const contentWidth = pageWidth - options.margins.left - options.margins.right;
  const contentHeight = pageHeight - options.margins.top - options.margins.bottom;
  
  const imgWidthMm = (canvasWidth / options.quality) * PX_TO_MM;
  const imgHeightMm = (canvasHeight / options.quality) * PX_TO_MM;
  
  const widthRatio = contentWidth / imgWidthMm;
  const heightRatio = contentHeight / imgHeightMm;
  const scale = Math.min(widthRatio, heightRatio, 1);
  
  const scaledWidth = imgWidthMm * scale;
  const scaledHeight = imgHeightMm * scale;
  
  let xOffset, yOffset;
  if (options.centerOnPage) {
    xOffset = options.margins.left + (contentWidth - scaledWidth) / 2;
    yOffset = options.margins.top + (contentHeight - scaledHeight) / 2;
  } else {
    xOffset = options.margins.left;
    yOffset = options.margins.top;
  }
  
  return { scaledWidth, scaledHeight, xOffset, yOffset };
};

const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const sanitizeFilename = (name: string): string => {
  return name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
};

const findBestChartElement = (): HTMLElement | null => {
  // Strategy 1: Find the largest canvas element
  const canvasElements = document.querySelectorAll('canvas');
  let bestCanvas: HTMLElement | null = null;
  let bestCanvasArea = 0;
  
  for (const canvas of canvasElements) {
    const rect = canvas.getBoundingClientRect();
    const area = rect.width * rect.height;
    
    if (rect.width > MIN_ELEMENT_SIZE && rect.height > MIN_ELEMENT_SIZE && area > MIN_ELEMENT_AREA) {
      if (area > bestCanvasArea) {
        bestCanvasArea = area;
        bestCanvas = canvas as HTMLElement;
      }
    }
  }
  
  if (bestCanvas) return bestCanvas;
  
  // Strategy 2: Find the largest SVG element
  const svgElements = document.querySelectorAll('svg');
  for (const svg of svgElements) {
    const rect = svg.getBoundingClientRect();
    if (rect.width > 200 && rect.height > 200 && rect.width * rect.height > 50000) {
      return svg as unknown as HTMLElement;
    }
  }
  
  // Strategy 3: Look for chart containers
  const chartContainers = document.querySelectorAll(
    '[data-chart-container], .natal-chart-display, [class*="chart"], [class*="unified-astrological"]'
  );
  
  for (const container of chartContainers) {
    const rect = container.getBoundingClientRect();
    if (rect.width > MIN_ELEMENT_SIZE && rect.height > MIN_ELEMENT_SIZE) {
      const childCanvas = container.querySelector('canvas');
      const childSvg = container.querySelector('svg');
      
      if (childCanvas) {
        const childRect = childCanvas.getBoundingClientRect();
        if (childRect.width > MIN_ELEMENT_SIZE && childRect.height > MIN_ELEMENT_SIZE) {
          return childCanvas as HTMLElement;
        }
      }
      
      if (childSvg) {
        const childRect = childSvg.getBoundingClientRect();
        if (childRect.width > MIN_ELEMENT_SIZE && childRect.height > MIN_ELEMENT_SIZE) {
          return childSvg as unknown as HTMLElement;
        }
      }
      
      return container as HTMLElement;
    }
  }
  
  // Strategy 4: Score-based element finding
  const allElements = document.querySelectorAll('*');
  let bestElement: HTMLElement | null = null;
  let bestScore = 0;
  
  for (const el of allElements) {
    const htmlEl = el as HTMLElement;
    const rect = htmlEl.getBoundingClientRect();
    const area = rect.width * rect.height;
    
    if (area > MIN_ELEMENT_AREA && rect.width > 200 && rect.height > 200) {
      const tagScore = htmlEl.tagName === 'CANVAS' ? 100 : 
                      htmlEl.tagName === 'SVG' ? 90 : 
                      htmlEl.className.includes('chart') ? 80 : 50;
      const score = tagScore + (area / 1000);
      
      if (score > bestScore) {
        bestScore = score;
        bestElement = htmlEl;
      }
    }
  }
  
  return bestElement;
};

export function usePDFGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const captureElementDirectly = useCallback(async (
    element: HTMLElement,
    quality: number
  ): Promise<HTMLCanvasElement> => {
    const rect = element.getBoundingClientRect();
    const canvas = createCanvas({
      width: rect.width,
      height: rect.height,
      quality,
      backgroundColor: '#ffffff'
    });
    
    const ctx = canvas.getContext('2d')!;
    const tagNameUpper = element.tagName.toUpperCase();
    
    if (tagNameUpper === 'CANVAS') {
      const sourceCanvas = element as HTMLCanvasElement;
      ctx.drawImage(sourceCanvas, 0, 0, rect.width, rect.height);
      return canvas;
    }
    
    if (tagNameUpper === 'SVG') {
      const svgElement = element as unknown as SVGElement;
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const img = await loadImageFromBlob(svgBlob);
      
      ctx.drawImage(img, 0, 0, rect.width, rect.height);
      return canvas;
    }
    
    // Handle container elements
    const childCanvas = element.querySelector('canvas');
    const childSvg = element.querySelector('svg');
    
    if (childCanvas) {
      const childRect = childCanvas.getBoundingClientRect();
      const parentRect = element.getBoundingClientRect();
      const offsetX = childRect.left - parentRect.left;
      const offsetY = childRect.top - parentRect.top;
      
      ctx.drawImage(childCanvas, offsetX, offsetY, childRect.width, childRect.height);
      return canvas;
    }
    
    if (childSvg) {
      const svgData = new XMLSerializer().serializeToString(childSvg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const img = await loadImageFromBlob(svgBlob);
      
      const childRect = childSvg.getBoundingClientRect();
      const parentRect = element.getBoundingClientRect();
      const offsetX = childRect.left - parentRect.left;
      const offsetY = childRect.top - parentRect.top;
      
      ctx.drawImage(img, offsetX, offsetY, childRect.width, childRect.height);
      return canvas;
    }
    
    throw new Error(`Element type ${element.tagName} not supported for direct capture and no suitable children found`);
  }, []);

  // Helper method for html2canvas capture (fallback only)
  const captureWithHtml2Canvas = useCallback(async (
    element: HTMLElement, 
    quality: number
  ): Promise<HTMLCanvasElement> => {
    // Try the direct method first
    try {
      return await captureElementDirectly(element, quality);
    } catch (directError) {
    }

    // Only use html2canvas as last resort
    try {
      // Dynamically import html2canvas
      const html2canvas = (await import('html2canvas')).default;
      
      return await html2canvas(element, {
        scale: Math.min(quality, 0.5),
        useCORS: false,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,
        onclone: (clonedDoc) => {
          // Minimal cleanup
          try {
            const elementsToRemove = clonedDoc.querySelectorAll('button, input, select, textarea');
            elementsToRemove.forEach(el => el.remove());
          } catch (error) {
            console.warn('Cleanup error:', error);
          }
        }
      });
    } catch (html2canvasError) {
      const errorMessage = html2canvasError instanceof Error ? html2canvasError.message : String(html2canvasError || 'Unknown html2canvas error');
      throw new Error(`Unable to capture element. Direct capture failed and html2canvas failed with: ${errorMessage}`);
    }
  }, [captureElementDirectly]);

  const generatePDF = useCallback(async (
    elementId: string,
    options: PDFGenerationOptions = {}
  ): Promise<PDFGenerationResult> => {
    const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
    
    setIsGenerating(true);
    setProgress(0);

    try {
      const element = document.getElementById(elementId) || 
        document.querySelector(`[id="${elementId}"]`) as HTMLElement;
      
      if (!element) {
        throw new Error(`Element with id "${elementId}" not found`);
      }

      const rect = element.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        throw new Error('Element has no visible dimensions. Make sure it is rendered and visible.');
      }

      setProgress(20);

      let canvas: HTMLCanvasElement;
      try {
        canvas = await captureWithHtml2Canvas(element, mergedOptions.quality);
      } catch (captureError) {
        canvas = createCanvas({ width: 800, height: 600, quality: 1, backgroundColor: '#ffffff' });
        const ctx = canvas.getContext('2d')!;
        
        ctx.fillStyle = '#000000';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Chart Capture Failed', 400, 250);
        
        ctx.font = '16px Arial';
        ctx.fillText('Unable to capture the chart for PDF export.', 400, 300);
        ctx.fillText('Please try downloading as PNG or SVG instead.', 400, 330);
        
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.strokeRect(50, 50, 700, 500);
      }

      setProgress(60);

      const { scaledWidth, scaledHeight, xOffset, yOffset } = calculatePDFDimensions(
        canvas.width, 
        canvas.height, 
        mergedOptions
      );

      setProgress(80);

      const jsPDF = (await import('jspdf')).default;
      const pdf = new jsPDF({
        orientation: mergedOptions.orientation,
        unit: 'mm',
        format: mergedOptions.format
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      pdf.addImage(imgData, 'PNG', xOffset, yOffset, scaledWidth, scaledHeight);

      setProgress(100);

      const pdfBlob = pdf.output('blob');
      downloadBlob(pdfBlob, mergedOptions.filename);

      return { success: true, blob: pdfBlob };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  }, [captureWithHtml2Canvas]);

  const generateSVGBasedPDF = useCallback(async (
    svgContent: string,
    chartName: string
  ): Promise<PDFGenerationResult> => {
    try {
      setIsGenerating(true);
      setProgress(0);

      const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
      const img = await loadImageFromBlob(svgBlob);
      
      setProgress(25);

      const naturalWidth = img.naturalWidth || img.width;
      const naturalHeight = img.naturalHeight || img.height;
      const aspectRatio = naturalWidth / naturalHeight;

      const canvasSize = 1200;
      const canvasWidth = aspectRatio >= 1 ? canvasSize : canvasSize * aspectRatio;
      const canvasHeight = aspectRatio >= 1 ? canvasSize / aspectRatio : canvasSize;

      const canvas = createCanvas({
        width: canvasWidth,
        height: canvasHeight,
        quality: 1,
        backgroundColor: '#ffffff'
      });

      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
      
      setProgress(50);

      const options: Required<PDFGenerationOptions> = {
        ...DEFAULT_OPTIONS,
        orientation: 'landscape',
        format: 'a4',
        filename: `${sanitizeFilename(chartName)}_chart.pdf`
      };

      const { scaledWidth, scaledHeight, xOffset, yOffset } = calculatePDFDimensions(
        canvas.width,
        canvas.height,
        options
      );

      setProgress(75);

      const jsPDF = (await import('jspdf')).default;
      const pdf = new jsPDF({
        orientation: options.orientation,
        unit: 'mm',
        format: options.format
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      pdf.addImage(imgData, 'PNG', xOffset, yOffset, scaledWidth, scaledHeight);
      
      setProgress(90);

      const pdfBlob = pdf.output('blob');
      downloadBlob(pdfBlob, options.filename);

      setProgress(100);
      return { success: true, blob: pdfBlob };

    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  }, []);

  const generateChartPDF = useCallback(async (
    chartName: string,
    personName?: string
  ): Promise<PDFGenerationResult> => {
    // Try SVG first for best quality
    const svgElement = document.querySelector('svg');
    if (svgElement) {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      return generateSVGBasedPDF(svgData, chartName);
    }

    // Find the best chart element
    const chartElement = findBestChartElement();
    
    if (!chartElement) {
      return {
        success: false,
        error: 'No suitable chart element found. Please ensure the chart is fully loaded and visible.'
      };
    }
    
    // Ensure element has an ID for PDF generation
    if (!chartElement.id) {
      chartElement.id = `chart-for-pdf-${Date.now()}`;
    }
    
    // Allow time for animations to complete
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return generatePDF(chartElement.id, {
      filename: `${sanitizeFilename(chartName)}_chart.pdf`,
      format: 'a4',
      orientation: 'landscape',
      quality: 1.2,
      margins: { top: 20, right: 20, bottom: 20, left: 20 },
      maintainAspectRatio: true,
      centerOnPage: true
    });
  }, [generatePDF, generateSVGBasedPDF]);

  return {
    generatePDF,
    generateChartPDF,
    isGenerating,
    progress
  };
}