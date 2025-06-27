/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useCallback } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

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
  maintainAspectRatio?: boolean; // Default true
  centerOnPage?: boolean; // Default true
}

interface PDFGenerationResult {
  success: boolean;
  blob?: Blob;
  error?: string;
}

export function usePDFGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  // Alternative capture method that doesn't use html2canvas
  const captureElementDirectly = useCallback(async (
    element: HTMLElement,
    quality: number
  ): Promise<HTMLCanvasElement> => {
    console.log('Attempting direct capture of element:', {
      tagName: element.tagName,
      className: element.className,
      id: element.id,
      width: element.offsetWidth,
      height: element.offsetHeight
    });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not get 2D context');
    }

    const rect = element.getBoundingClientRect();
    
    // For direct capture, we want to preserve the original element's aspect ratio
    console.log('Original element dimensions:', {
      width: rect.width,
      height: rect.height,
      aspectRatio: rect.width / rect.height
    });
    
    // Preserve original aspect ratio - don't force square
    console.log('Preserving original aspect ratio:', {
      originalWidth: rect.width,
      originalHeight: rect.height,
      aspectRatio: rect.width / rect.height
    });
    
    // Create canvas with original proportions
    canvas.width = rect.width * quality;
    canvas.height = rect.height * quality;
    
    // Scale the context to match quality
    ctx.scale(quality, quality);
    
    // Set white background for the entire canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, rect.width, rect.height);
    
    const tagNameUpper = element.tagName.toUpperCase();
    console.log('Element tagName:', element.tagName, 'normalized:', tagNameUpper, 'typeof:', typeof element.tagName);
    
    if (tagNameUpper === 'CANVAS') {
      // Direct canvas copy - preserve original dimensions
      console.log('Copying canvas directly');
      const sourceCanvas = element as HTMLCanvasElement;
      
      console.log('Source canvas dimensions:', {
        width: sourceCanvas.width,
        height: sourceCanvas.height,
        displayWidth: rect.width,
        displayHeight: rect.height,
        aspectRatio: sourceCanvas.width / sourceCanvas.height
      });
      
      // Copy the canvas at original size
      ctx.drawImage(sourceCanvas, 0, 0, rect.width, rect.height);
      return canvas;
    } else if (tagNameUpper === 'SVG') {
      // Convert SVG to image
      console.log('Converting SVG to canvas');
      const svgElement = element as unknown as SVGElement;
      console.log('SVG element details:', {
        tagName: svgElement.tagName,
        nodeName: svgElement.nodeName,
        outerHTML: svgElement.outerHTML.substring(0, 200)
      });
      
      const svgData = new XMLSerializer().serializeToString(svgElement);
      console.log('Serialized SVG data length:', svgData.length);
      
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);
      
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          console.log('SVG loaded successfully as image');
          // Draw the SVG at original size
          ctx.drawImage(img, 0, 0, rect.width, rect.height);
          URL.revokeObjectURL(svgUrl);
          resolve(canvas);
        };
        img.onerror = (error) => {
          console.error('Failed to load SVG as image:', error);
          URL.revokeObjectURL(svgUrl);
          reject(new Error('Failed to load SVG'));
        };
        img.src = svgUrl;
      });
    } else {
      // For container elements, look for canvas/svg children
      console.log('Looking for chart children in container element');
      
      const childCanvas = element.querySelector('canvas');
      const childSvg = element.querySelector('svg');
      
      if (childCanvas) {
        console.log('Found child canvas, copying it');
        const childRect = childCanvas.getBoundingClientRect();
        const parentRect = element.getBoundingClientRect();
        
        // Calculate offset within parent
        const offsetX = childRect.left - parentRect.left;
        const offsetY = childRect.top - parentRect.top;
        
        ctx.drawImage(childCanvas, offsetX, offsetY, childRect.width, childRect.height);
        return canvas;
      } else if (childSvg) {
        console.log('Found child SVG, converting it');
        const svgData = new XMLSerializer().serializeToString(childSvg);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);
        
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            const childRect = childSvg.getBoundingClientRect();
            const parentRect = element.getBoundingClientRect();
            const offsetX = childRect.left - parentRect.left;
            const offsetY = childRect.top - parentRect.top;
            
            ctx.drawImage(img, offsetX, offsetY, childRect.width, childRect.height);
            URL.revokeObjectURL(svgUrl);
            resolve(canvas);
          };
          img.onerror = () => {
            URL.revokeObjectURL(svgUrl);
            reject(new Error('Failed to load child SVG'));
          };
          img.src = svgUrl;
        });
      } else {
        console.log('No suitable child elements found in container');
        throw new Error(`Element type ${element.tagName} not supported for direct capture and no suitable children found`);
      }
    }
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
      console.warn('Direct capture failed, trying html2canvas:', directError);
    }

    // Only use html2canvas as last resort
    try {
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
      console.error('All capture methods failed:', html2canvasError);
      const errorMessage = html2canvasError instanceof Error ? html2canvasError.message : String(html2canvasError || 'Unknown html2canvas error');
      throw new Error(`Unable to capture element. Direct capture failed and html2canvas failed with: ${errorMessage}`);
    }
  }, [captureElementDirectly]);

  const generatePDF = useCallback(async (
    elementId: string,
    options: PDFGenerationOptions = {}
  ): Promise<PDFGenerationResult> => {
    const {
      filename = 'chart.pdf',
      quality = 1.0,
      format = 'a4',
      orientation = 'portrait',
      margins = { top: 20, right: 20, bottom: 20, left: 20 },
      maintainAspectRatio = true,
      centerOnPage = true
    } = options;

    setIsGenerating(true);
    setProgress(0);

    try {
      // Find the element to convert
      let element = document.getElementById(elementId);
      if (!element) {
        // Try to find element by other means if ID fails
        element = document.querySelector(`[id="${elementId}"]`) as HTMLElement;
        if (!element) {
          throw new Error(`Element with id "${elementId}" not found`);
        }
      }

      // Ensure element is visible and has dimensions
      const rect = element.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        throw new Error('Element has no visible dimensions. Make sure it is rendered and visible.');
      }

      setProgress(20);

      // Use the new capture method that tries direct capture first
      let canvas;
      try {
        canvas = await captureWithHtml2Canvas(element, quality);
      } catch (captureError) {
        console.error('All capture methods failed, creating fallback PDF:', captureError);
        
        // Create a simple fallback canvas with error message
        canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          // White background
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Error message
          ctx.fillStyle = '#000000';
          ctx.font = '24px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('Chart Capture Failed', canvas.width / 2, canvas.height / 2 - 50);
          
          ctx.font = '16px Arial';
          ctx.fillText('Unable to capture the chart for PDF export.', canvas.width / 2, canvas.height / 2);
          ctx.fillText('Please try downloading as PNG or SVG instead.', canvas.width / 2, canvas.height / 2 + 30);
          
          // Simple border
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 2;
          ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);
        } else {
          throw captureError; // If we can't even create a simple canvas, give up
        }
      }

      setProgress(60);

      // Calculate PDF dimensions
      // IMPORTANT: Use the actual canvas dimensions, not scaled ones
      const actualWidth = canvas.width / quality;  // Divide by quality to get original size
      const actualHeight = canvas.height / quality;
      
      console.log('Canvas dimensions for PDF:', {
        canvasWidth: canvas.width,
        canvasHeight: canvas.height,
        quality: quality,
        actualWidth: actualWidth,
        actualHeight: actualHeight,
        originalAspectRatio: actualWidth / actualHeight
      });
      
      // Use original dimensions to preserve aspect ratio
      const finalWidth = actualWidth;
      const finalHeight = actualHeight;
      
      console.log('Using original dimensions:', {
        width: finalWidth,
        height: finalHeight,
        aspectRatio: finalWidth / finalHeight
      });
      
      // PDF page dimensions (in mm)
      const pageFormats = {
        a4: { width: 210, height: 297 },
        letter: { width: 216, height: 279 },
        legal: { width: 216, height: 356 }
      };
      
      const pageFormat = pageFormats[format];
      const pageWidth = orientation === 'landscape' ? pageFormat.height : pageFormat.width;
      const pageHeight = orientation === 'landscape' ? pageFormat.width : pageFormat.height;
      
      // Calculate content area (minus margins)
      const contentWidth = pageWidth - margins.left - margins.right;
      const contentHeight = pageHeight - margins.top - margins.bottom;
      
      // Calculate scaling to fit content while maintaining aspect ratio
      const imgWidthMm = finalWidth * 0.264583; // Convert px to mm
      const imgHeightMm = finalHeight * 0.264583;
      
      const widthRatio = contentWidth / imgWidthMm;
      const heightRatio = contentHeight / imgHeightMm;
      const scale = Math.min(widthRatio, heightRatio, 1); // Don't scale up, maintain aspect ratio
      
      const scaledWidth = imgWidthMm * scale;
      const scaledHeight = imgHeightMm * scale;
      
      console.log('PDF scaling details:', {
        originalSize: { width: actualWidth, height: actualHeight },
        finalSize: { width: finalWidth, height: finalHeight },
        originalSizeMm: { width: imgWidthMm, height: imgHeightMm },
        originalAspectRatio: actualWidth / actualHeight,
        finalAspectRatio: finalWidth / finalHeight,
        contentArea: { width: contentWidth, height: contentHeight },
        ratios: { width: widthRatio, height: heightRatio },
        scale: scale,
        scaledSizeMm: { width: scaledWidth, height: scaledHeight },
        scaledAspectRatio: scaledWidth / scaledHeight,
        shouldMatch: (actualWidth / actualHeight) === (scaledWidth / scaledHeight)
      });

      setProgress(80);

      // Create PDF
      const pdf = new jsPDF({
        orientation,
        unit: 'mm',
        format
      });

      // Add the image to PDF
      const imgData = canvas.toDataURL('image/png', 1.0);
      
      // Calculate positioning
      let xOffset, yOffset;
      
      if (centerOnPage) {
        // Center the image on the page
        xOffset = margins.left + (contentWidth - scaledWidth) / 2;
        yOffset = margins.top + (contentHeight - scaledHeight) / 2;
      } else {
        // Top-left positioning within margins
        xOffset = margins.left;
        yOffset = margins.top;
      }
      
      console.log('PDF positioning:', {
        xOffset,
        yOffset,
        scaledWidth,
        scaledHeight,
        centered: centerOnPage
      });
      
      pdf.addImage(imgData, 'PNG', xOffset, yOffset, scaledWidth, scaledHeight);

      setProgress(100);

      // Generate blob
      const pdfBlob = pdf.output('blob');

      // Download the PDF
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return {
        success: true,
        blob: pdfBlob
      };

    } catch (error) {
      console.error('PDF generation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  }, [captureWithHtml2Canvas]);

  // Simple SVG-based PDF generation (like PNG but for PDF)
  const generateSVGBasedPDF = useCallback(async (
    svgContent: string,
    chartName: string
  ): Promise<PDFGenerationResult> => {
    try {
      setIsGenerating(true);
      setProgress(0);

      // Create image from SVG (same as PNG logic)
      const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);
      
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          try {
            // Create canvas with proper aspect ratio
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              resolve({ success: false, error: 'Could not get canvas context' });
              return;
            }

            // Use image's natural dimensions to preserve aspect ratio
            const naturalWidth = img.naturalWidth || img.width;
            const naturalHeight = img.naturalHeight || img.height;
            const aspectRatio = naturalWidth / naturalHeight;
            
            console.log('SVG image dimensions:', {
              naturalWidth,
              naturalHeight,
              aspectRatio,
              displayWidth: img.width,
              displayHeight: img.height
            });

            // Create high-quality canvas maintaining aspect ratio
            const canvasSize = 1200; // High resolution
            if (aspectRatio >= 1) {
              // Wider than tall
              canvas.width = canvasSize;
              canvas.height = canvasSize / aspectRatio;
            } else {
              // Taller than wide  
              canvas.width = canvasSize * aspectRatio;
              canvas.height = canvasSize;
            }

            console.log('Canvas created with dimensions:', {
              width: canvas.width,
              height: canvas.height,
              aspectRatio: canvas.width / canvas.height
            });

            // White background
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw image maintaining aspect ratio
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            setProgress(50);

            // Create PDF
            const pdf = new jsPDF({
              orientation: 'landscape',
              unit: 'mm',
              format: 'a4'
            });

            const imgData = canvas.toDataURL('image/png', 1.0);
            
            // Calculate PDF dimensions maintaining aspect ratio
            const pageWidth = 297; // A4 landscape width
            const pageHeight = 210; // A4 landscape height
            const margins = 20;
            const availableWidth = pageWidth - (margins * 2);
            const availableHeight = pageHeight - (margins * 2);
            
            const canvasAspectRatio = canvas.width / canvas.height;
            
            let pdfWidth, pdfHeight;
            if (canvasAspectRatio >= (availableWidth / availableHeight)) {
              // Fit to width
              pdfWidth = availableWidth;
              pdfHeight = availableWidth / canvasAspectRatio;
            } else {
              // Fit to height
              pdfHeight = availableHeight;
              pdfWidth = availableHeight * canvasAspectRatio;
            }
            
            const xOffset = margins + (availableWidth - pdfWidth) / 2;
            const yOffset = margins + (availableHeight - pdfHeight) / 2;
            
            console.log('PDF layout:', {
              canvasAspectRatio,
              availableSize: { width: availableWidth, height: availableHeight },
              pdfSize: { width: pdfWidth, height: pdfHeight },
              position: { x: xOffset, y: yOffset },
              pdfAspectRatio: pdfWidth / pdfHeight
            });

            pdf.addImage(imgData, 'PNG', xOffset, yOffset, pdfWidth, pdfHeight);
            
            setProgress(90);

            // Download
            const pdfBlob = pdf.output('blob');
            const url = URL.createObjectURL(pdfBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${chartName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_chart.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            URL.revokeObjectURL(svgUrl);

            setProgress(100);
            resolve({ success: true, blob: pdfBlob });
          } catch (error) {
            console.error('PDF generation error:', error);
            URL.revokeObjectURL(svgUrl);
            resolve({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
          } finally {
            setIsGenerating(false);
            setProgress(0);
          }
        };
        
        img.onerror = () => {
          URL.revokeObjectURL(svgUrl);
          resolve({ success: false, error: 'Failed to load SVG image' });
          setIsGenerating(false);
          setProgress(0);
        };
        
        img.src = svgUrl;
      });
    } catch (error) {
      setIsGenerating(false);
      setProgress(0);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }, []);

  const generateChartPDF = useCallback(async (
    chartName: string,
    personName?: string
  ): Promise<PDFGenerationResult> => {
    // First try to find SVG content directly (like PNG does)
    const svgElement = document.querySelector('svg');
    if (svgElement) {
      console.log('Found SVG element, using direct SVG approach');
      const svgData = new XMLSerializer().serializeToString(svgElement);
      return generateSVGBasedPDF(svgData, chartName);
    }

    // Fallback to element-based approach
    console.log('No SVG found, using element detection approach');
    
    // Look for chart elements in a more reliable way
    let chartElement: HTMLElement | null = null;
    
    // Try multiple strategies to find the chart
    const findChartElement = (): HTMLElement | null => {
      // Strategy 1: Look for canvas elements (Three.js charts) - prioritize these
      const canvasElements = document.querySelectorAll('canvas');
      let bestCanvas: HTMLElement | null = null;
      let bestCanvasArea = 0;
      
      for (const canvas of canvasElements) {
        const rect = canvas.getBoundingClientRect();
        const area = rect.width * rect.height;
        
        // Look for visible canvases with reasonable size
        if (rect.width > 100 && rect.height > 100 && area > 10000) {
          if (area > bestCanvasArea) {
            bestCanvasArea = area;
            bestCanvas = canvas as HTMLElement;
          }
        }
      }
      
      if (bestCanvas) {
        console.log('Found canvas element for PDF:', {
          width: bestCanvas.offsetWidth,
          height: bestCanvas.offsetHeight,
          tagName: bestCanvas.tagName
        });
        return bestCanvas;
      }
      
      // Strategy 2: Look for SVG elements
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
        if (rect.width > 100 && rect.height > 100) {
          // Look for canvas or svg inside this container
          const childCanvas = container.querySelector('canvas');
          const childSvg = container.querySelector('svg');
          
          if (childCanvas) {
            const childRect = childCanvas.getBoundingClientRect();
            if (childRect.width > 100 && childRect.height > 100) {
              return childCanvas as HTMLElement;
            }
          }
          
          if (childSvg) {
            const childRect = childSvg.getBoundingClientRect();
            if (childRect.width > 100 && childRect.height > 100) {
              return childSvg as unknown as HTMLElement;
            }
          }
          
          // Fallback to container itself
          return container as HTMLElement;
        }
      }
      
      // Strategy 4: Find any large visible element that might be a chart
      const allElements = document.querySelectorAll('*');
      let bestElement: HTMLElement | null = null;
      let bestScore = 0;
      
      for (const el of allElements) {
        const htmlEl = el as HTMLElement;
        const rect = htmlEl.getBoundingClientRect();
        const area = rect.width * rect.height;
        
        // Score elements based on size and visibility
        if (area > 10000 && rect.width > 200 && rect.height > 200) {
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
    
    console.log('Starting chart element search...');
    chartElement = findChartElement();
    
    if (!chartElement) {
      // Log what elements we found for debugging
      const allCanvases = document.querySelectorAll('canvas');
      const allSvgs = document.querySelectorAll('svg');
      const allContainers = document.querySelectorAll('[data-chart-container], .natal-chart-display, [class*="chart"], [class*="unified-astrological"]');
      
      console.warn('No chart element found. Available elements:', {
        totalCanvases: allCanvases.length,
        totalSvgs: allSvgs.length,
        totalContainers: allContainers.length,
        canvases: Array.from(allCanvases).map(c => ({
          width: c.getBoundingClientRect().width,
          height: c.getBoundingClientRect().height,
          area: c.getBoundingClientRect().width * c.getBoundingClientRect().height,
          visible: c.getBoundingClientRect().width > 0 && c.getBoundingClientRect().height > 0
        })),
        svgs: Array.from(allSvgs).map(s => ({
          width: s.getBoundingClientRect().width,
          height: s.getBoundingClientRect().height,
          area: s.getBoundingClientRect().width * s.getBoundingClientRect().height,
          visible: s.getBoundingClientRect().width > 0 && s.getBoundingClientRect().height > 0
        })),
        containers: Array.from(allContainers).map(c => ({
          tagName: c.tagName,
          className: c.className,
          width: c.getBoundingClientRect().width,
          height: c.getBoundingClientRect().height,
          hasCanvasChild: !!c.querySelector('canvas'),
          hasSvgChild: !!c.querySelector('svg')
        }))
      });
      
      return {
        success: false,
        error: 'No suitable chart element found. Please ensure the chart is fully loaded and visible.'
      };
    }
    
    console.log('Found chart element:', {
      tagName: chartElement.tagName,
      className: chartElement.className,
      id: chartElement.id,
      width: chartElement.offsetWidth,
      height: chartElement.offsetHeight
    });
    
    // Assign temporary ID if none exists
    if (!chartElement.id) {
      chartElement.id = 'chart-for-pdf-' + Date.now();
    }
    
    // Wait a moment for any animations to complete
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return generatePDF(chartElement.id, {
      filename: `${chartName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_chart.pdf`,
      format: 'a4',
      orientation: 'landscape',
      quality: 1.2,
      margins: { top: 20, right: 20, bottom: 20, left: 20 }, // More generous margins
      maintainAspectRatio: true, // Keep chart proportions
      centerOnPage: true // Center the chart nicely
    });
  }, [generatePDF, generateSVGBasedPDF]);

  return {
    generatePDF,
    generateChartPDF,
    isGenerating,
    progress
  };
}