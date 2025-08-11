/* eslint-disable @typescript-eslint/no-unused-vars */
import { SharedChart, ShareOptions, ShareResult } from '@/types/sharedChart';
import { SharedChartService } from './sharedChartService';
import { BRAND } from '@/config/brand';

export class SharingService {
  /**
   * Handle chart sharing with multiple fallback methods
   */
  static async shareChart(chart: SharedChart, token: string): Promise<ShareResult> {
    const shareUrl = SharedChartService.getChartUrl(token);
    const shareOptions = this.createShareOptions(chart, shareUrl);

    // Try native sharing first
    if (this.isNativeSharingSupported()) {
      try {
        await navigator.share(shareOptions);
        return {
          success: true,
          method: 'native'
        };
      } catch (error) {
        // User cancelled sharing or sharing failed, continue to clipboard
      }
    }

    // Try clipboard sharing
    const clipboardResult = await this.copyToClipboard(shareUrl);
    if (clipboardResult.success) {
      return {
        success: true,
        method: 'clipboard',
        message: clipboardResult.message
      };
    }

    // Final fallback: manual sharing
    return {
      success: true,
      method: 'manual',
      message: `Copy this link: ${shareUrl}`
    };
  }

  /**
   * Create share options for the chart
   */
  private static createShareOptions(chart: SharedChart, url: string): ShareOptions {
    const title = SharedChartService.getChartShareTitle(chart);
    const name = chart.subjectName || 'this';
    
    return {
      title,
      text: `Check out ${name} natal chart from ${BRAND.name}!`,
      url
    };
  }

  /**
   * Check if native sharing is supported
   */
  private static isNativeSharingSupported(): boolean {
    return typeof navigator !== 'undefined' && 'share' in navigator;
  }

  /**
   * Copy URL to clipboard with multiple fallback strategies
   */
  private static async copyToClipboard(url: string): Promise<{
    success: boolean;
    message?: string;
  }> {
    if (!this.isClipboardSupported()) {
      return { success: false };
    }

    // First attempt: direct clipboard write
    try {
      await navigator.clipboard.writeText(url);
      return {
        success: true,
        message: 'Chart share link copied to clipboard.'
      };
    } catch (error) {
      // First fallback: focus window and retry
      try {
        window.focus();
        await navigator.clipboard.writeText(url);
        return {
          success: true,
          message: 'Chart share link copied to clipboard.'
        };
      } catch (retryError) {
        // Second fallback: use legacy method
        return this.legacyCopyToClipboard(url);
      }
    }
  }

  /**
   * Legacy clipboard copy method
   */
  private static legacyCopyToClipboard(url: string): {
    success: boolean;
    message?: string;
  } {
    try {
      // Create temporary input element
      const tempInput = document.createElement('input');
      tempInput.style.position = 'fixed';
      tempInput.style.opacity = '0';
      tempInput.value = url;
      document.body.appendChild(tempInput);
      
      tempInput.select();
      tempInput.setSelectionRange(0, 99999); // For mobile devices
      
      const successful = document.execCommand('copy');
      document.body.removeChild(tempInput);
      
      if (successful) {
        return {
          success: true,
          message: 'Chart share link copied to clipboard.'
        };
      }
      
      return { success: false };
    } catch (error) {
      return { success: false };
    }
  }

  /**
   * Check if clipboard is supported
   */
  private static isClipboardSupported(): boolean {
    return typeof navigator !== 'undefined' && 
           (('clipboard' in navigator) || document.queryCommandSupported?.('copy'));
  }

  /**
   * Generate share message for social media
   */
  static generateSocialShareMessage(chart: SharedChart): string {
    const name = chart.subjectName || 'someone';
    return `Just discovered ${name}'s natal chart on ${BRAND.name}! 🌟✨ The cosmic insights are fascinating!`;
  }

  /**
   * Get share URL for specific platform
   */
  static getPlatformShareUrl(chart: SharedChart, token: string, platform: 'twitter' | 'facebook' | 'linkedin'): string {
    const shareUrl = SharedChartService.getChartUrl(token);
    const message = this.generateSocialShareMessage(chart);
    const title = SharedChartService.getChartShareTitle(chart);

    switch (platform) {
      case 'twitter':
        return `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(shareUrl)}`;
      
      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
      
      case 'linkedin':
        return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
      
      default:
        return shareUrl;
    }
  }

  /**
   * Validate share URL
   */
  static validateShareUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  }

  /**
   * Track sharing event (for analytics)
   */
  static trackSharingEvent(method: string, platform?: string): void {
    console.log(`Chart shared via ${method}${platform ? ` (${platform})` : ''}`);
  }

  /**
   * Get sharing capabilities
   */
  static getSharingCapabilities(): {
    nativeSharing: boolean;
    clipboardApi: boolean;
    legacyClipboard: boolean;
  } {
    return {
      nativeSharing: this.isNativeSharingSupported(),
      clipboardApi: typeof navigator !== 'undefined' && 'clipboard' in navigator,
      legacyClipboard: typeof document !== 'undefined' && 
                      document.queryCommandSupported?.('copy') === true
    };
  }

  /**
   * Format share message based on available methods
   */
  static formatShareSuccessMessage(result: ShareResult): {
    title: string;
    message: string;
    duration: number;
  } {
    switch (result.method) {
      case 'native':
        return {
          title: 'Shared Successfully',
          message: 'Chart shared using your device\'s sharing feature.',
          duration: 3000
        };
      
      case 'clipboard':
        return {
          title: 'Link Copied',
          message: result.message || 'Chart share link copied to clipboard.',
          duration: 3000
        };
      
      case 'manual':
        return {
          title: 'Share Link Ready',
          message: result.message || 'Copy the link manually to share this chart.',
          duration: 5000
        };
      
      default:
        return {
          title: 'Share Ready',
          message: 'Chart is ready to share.',
          duration: 3000
        };
    }
  }
}