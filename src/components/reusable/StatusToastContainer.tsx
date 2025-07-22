/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import StatusToast from './StatusToast';
import { ToastState } from '@/hooks/useToastState';

export interface StatusToastContainerProps {
  toasts: ToastState[];
  onHideToast: (index: number) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  className?: string;
}

const positionClasses = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
};

export default function StatusToastContainer({
  toasts,
  onHideToast,
  position = 'bottom-right',
  className = ''
}: StatusToastContainerProps) {
  const visibleToasts = toasts.filter(toast => toast.isVisible);

  if (visibleToasts.length === 0) {
    return null;
  }

  return (
    <div className={`fixed ${positionClasses[position]} z-50 space-y-2 ${className}`}>
      {visibleToasts.map((toast, index) => (
        <StatusToast
          key={`toast-${index}`}
          title={toast.title}
          message={toast.message}
          status={toast.status}
          isVisible={toast.isVisible}
          onHide={() => onHideToast(index)}
          duration={toast.status === 'loading' ? 0 : 5000}
        />
      ))}
    </div>
  );
}

// Single toast wrapper for backward compatibility
export interface SingleStatusToastProps extends Omit<ToastState, 'isVisible'> {
  isVisible: boolean;
  onHide: () => void;
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  className?: string;
}

export function SingleStatusToast({
  title,
  message,
  status,
  isVisible,
  onHide,
  duration = 5000,
  position = 'bottom-right',
  className = ''
}: SingleStatusToastProps) {
  if (!isVisible) {
    return null;
  }

  return (
    <div className={`fixed ${positionClasses[position]} z-50 ${className}`}>
      <StatusToast
        title={title}
        message={message}
        status={status}
        isVisible={isVisible}
        onHide={onHide}
        duration={duration}
      />
    </div>
  );
}