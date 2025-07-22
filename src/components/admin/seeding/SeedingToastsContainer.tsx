/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import StatusToast from '@/components/reusable/StatusToast';

export interface SeedingToastsContainerProps {
  // Reply management toast
  replyToastTitle: string;
  replyToastMessage: string;
  replyToastStatus: 'loading' | 'success' | 'error' | 'info';
  replyToastVisible: boolean;
  onHideReplyToast: () => void;
  
  // Main seeding operations toast
  seedingToastTitle: string;
  seedingToastMessage: string;
  seedingToastStatus: 'loading' | 'success' | 'error' | 'info';
  seedingToastVisible: boolean;
  onHideSeedingToast: () => void;
  
  // Main toast notifications (with custom styling)
  mainToastTitle: string;
  mainToastMessage: string;
  mainToastStatus: 'loading' | 'success' | 'error' | 'info';
  mainToastVisible: boolean;
  onHideMainToast: () => void;
}

export default function SeedingToastsContainer({
  replyToastTitle,
  replyToastMessage,
  replyToastStatus,
  replyToastVisible,
  onHideReplyToast,
  seedingToastTitle,
  seedingToastMessage,
  seedingToastStatus,
  seedingToastVisible,
  onHideSeedingToast,
  mainToastTitle,
  mainToastMessage,
  mainToastStatus,
  mainToastVisible,
  onHideMainToast
}: SeedingToastsContainerProps) {
  return (
    <>
      {/* Status Toast for Reply Management */}
      <StatusToast
        title={replyToastTitle}
        message={replyToastMessage}
        status={replyToastStatus}
        isVisible={replyToastVisible}
        onHide={onHideReplyToast}
        duration={replyToastStatus === 'success' ? 3000 : 0}
      />

      {/* Status Toast for Main Seeding Operations (Generate Forum, etc.) */}
      <StatusToast
        title={seedingToastTitle}
        message={seedingToastMessage}
        status={seedingToastStatus}
        isVisible={seedingToastVisible}
        onHide={onHideSeedingToast}
        duration={seedingToastStatus === 'success' ? 5000 : 0}
      />

      {/* Custom styled main toast for special operations */}
      {mainToastVisible && (
        <div className="fixed bottom-6 right-6 z-[9999] pointer-events-none">
          <div 
            className={`
              px-6 py-4 border-2 border-black shadow-lg max-w-sm pointer-events-auto
              transform transition-all duration-300 ease-out
              ${mainToastVisible 
                ? 'translate-y-0 opacity-100 scale-100' 
                : 'translate-y-4 opacity-0 scale-95'
              }
            `}
            style={{ backgroundColor: mainToastStatus === 'error' ? '#000000' : '#ffffff' }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
              {/* Status icon */}
              <div className="flex-shrink-0" style={{ color: mainToastStatus === 'error' ? '#ffffff' : '#000000' }}>
                {mainToastStatus === 'loading' ? (
                  <div className="flex items-center space-x-1">
                    <div className="w-1 h-1 bg-current animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-1 h-1 bg-current animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1 h-1 bg-current animate-bounce"></div>
                  </div>
                ) : mainToastStatus === 'error' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              
              {/* Title */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold font-space-grotesk" style={{ color: mainToastStatus === 'error' ? '#ffffff' : '#000000' }}>
                  {mainToastTitle}
                </h4>
              </div>

              {/* Close button (only for non-loading states) */}
              {mainToastStatus !== 'loading' && (
                <button
                  onClick={onHideMainToast}
                  className="flex-shrink-0 hover:opacity-70 transition-opacity"
                  style={{ color: mainToastStatus === 'error' ? '#ffffff' : '#000000' }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Message */}
            <div className="mb-3">
              <p className="text-sm font-open-sans" style={{ color: mainToastStatus === 'error' ? '#ffffff' : '#000000' }}>
                {mainToastMessage}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}