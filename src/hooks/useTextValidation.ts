/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMemo } from 'react';
import { getTextStats, validateTextLength } from '@/utils/textUtils';

export const useTextValidation = (
  content: string, 
  showValidation: boolean,
  minWords: number = 10,
  minCharacters: number = 50
) => {
  // Text statistics
  const textStats = useMemo(() => {
    const plainText = content.replace(/<[^>]*>/g, '') || '';
    return getTextStats(plainText);
  }, [content]);

  // Validation status
  const validation = useMemo(() => {
    if (!showValidation) return { isValid: true, errors: [] };
    const plainText = content.replace(/<[^>]*>/g, '') || '';
    return validateTextLength(plainText, minWords, minCharacters);
  }, [content, showValidation, minWords, minCharacters]);

  return {
    textStats,
    validation
  };
};