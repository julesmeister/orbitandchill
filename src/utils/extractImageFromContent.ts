/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Extract the first image from HTML content to use as thumbnail
 * Supports both base64 and URL images
 * Works on both client and server side
 */
export function extractFirstImageFromContent(htmlContent: string): string | null {
  if (!htmlContent || typeof htmlContent !== 'string') {
    return null;
  }

  // Use regex to find img tags (works on server side too)
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/i;
  const match = htmlContent.match(imgRegex);
  
  if (match && match[1]) {
    // Return the image source (could be base64 or URL)
    return match[1];
  }

  return null;
}

/**
 * Create a simple image object for embedded chart display
 * This mimics the structure of an embedded chart for image display
 */
export function createImageChartObject(imageSrc: string, title?: string) {
  return {
    id: `img_${Date.now()}`,
    chartType: 'image',
    imageUrl: imageSrc,
    metadata: {
      chartTitle: title || 'Uploaded Image',
      description: 'Image from post content',
      createdAt: new Date().toISOString()
    }
  };
}