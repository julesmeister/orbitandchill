/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Person } from '../../types/people';

interface SubmitButtonProps {
  isFormValid: boolean;
  isGenerating: boolean;
  isChartGenerating: boolean;
  cachedChart: any;
  hasExistingChart?: boolean;
  isLoadingCache?: boolean;
  mode: 'user' | 'person';
  editingPerson?: Person | null;
  submitText: string;
}

const SubmitButton = React.memo(({
  isFormValid,
  isGenerating,
  isChartGenerating,
  cachedChart,
  hasExistingChart = false,
  isLoadingCache = false,
  mode,
  editingPerson,
  submitText
}: SubmitButtonProps) => (
  <button
    type="submit"
    disabled={!isFormValid || isGenerating || isChartGenerating}
    className={`synapsas-submit-button ${!isFormValid || isGenerating || isChartGenerating
        ? 'disabled'
        : cachedChart
          ? 'success'
          : 'primary'
      } ${isGenerating || isChartGenerating ? 'generating' : ''}`}
  >
    {(isGenerating || isChartGenerating) && (
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 animate-gradient-x"></div>
    )}
    <span className="relative z-10 flex items-center justify-center gap-2">
      {(isGenerating || isChartGenerating) ? (
        <>
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Generating your chart...
        </>
      ) : (cachedChart || hasExistingChart) ? (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 616 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          {isLoadingCache ? 'Loading Chart...' : 'View Your Chart'}
        </>
      ) : mode === 'person' ? (
        editingPerson ? 'Update Person' : 'Add Person'
      ) : (
        submitText
      )}
    </span>
  </button>
));

SubmitButton.displayName = 'SubmitButton';

export default SubmitButton;