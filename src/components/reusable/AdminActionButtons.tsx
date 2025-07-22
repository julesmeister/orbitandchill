/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { ReactNode } from 'react';

export interface AdminActionButton {
  id: string;
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  hidden?: boolean;
}

export interface AdminActionButtonsProps {
  buttons: AdminActionButton[];
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'tight' | 'normal' | 'loose';
}

const variantClasses = {
  primary: 'bg-black text-white border-black hover:bg-gray-800',
  secondary: 'bg-white text-black border-black hover:bg-gray-50',
  danger: 'bg-red-600 text-white border-red-600 hover:bg-red-700',
  success: 'bg-green-600 text-white border-green-600 hover:bg-green-700',
  warning: 'bg-yellow-600 text-white border-yellow-600 hover:bg-yellow-700'
};

const sizeClasses = {
  sm: 'px-3 py-2 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base'
};

const spacingClasses = {
  horizontal: {
    tight: 'space-x-1',
    normal: 'space-x-3',
    loose: 'space-x-6'
  },
  vertical: {
    tight: 'space-y-1',
    normal: 'space-y-3',
    loose: 'space-y-6'
  }
};

export default function AdminActionButtons({
  buttons,
  className = '',
  orientation = 'horizontal',
  spacing = 'normal'
}: AdminActionButtonsProps) {
  const visibleButtons = buttons.filter(button => !button.hidden);

  if (visibleButtons.length === 0) {
    return null;
  }

  const containerClasses = `
    flex ${orientation === 'horizontal' ? 'flex-row' : 'flex-col'}
    ${spacingClasses[orientation][spacing]}
    ${className}
  `.trim();

  return (
    <div className={containerClasses}>
      {visibleButtons.map((button) => (
        <button
          key={button.id}
          onClick={button.onClick}
          disabled={button.disabled || button.loading}
          className={`
            font-space-grotesk font-semibold border-2 transition-all duration-300
            ${variantClasses[button.variant || 'primary']}
            ${sizeClasses[button.size || 'md']}
            ${button.disabled || button.loading ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/25'}
          `.trim()}
        >
          <div className="flex items-center justify-center gap-2">
            {button.loading ? (
              <div className="flex items-center space-x-1">
                <div className="w-1 h-1 bg-current animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1 h-1 bg-current animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1 h-1 bg-current animate-bounce"></div>
              </div>
            ) : (
              button.icon && button.icon
            )}
            {button.label}
          </div>
        </button>
      ))}
    </div>
  );
}

// Convenience component for save/cancel patterns
export interface SaveCancelButtonsProps {
  onSave: () => void;
  onCancel: () => void;
  saveLabel?: string;
  cancelLabel?: string;
  saveDisabled?: boolean;
  saveLoading?: boolean;
  className?: string;
}

export function SaveCancelButtons({
  onSave,
  onCancel,
  saveLabel = 'Save Changes',
  cancelLabel = 'Cancel',
  saveDisabled = false,
  saveLoading = false,
  className = ''
}: SaveCancelButtonsProps) {
  const buttons: AdminActionButton[] = [
    {
      id: 'cancel',
      label: cancelLabel,
      onClick: onCancel,
      variant: 'secondary'
    },
    {
      id: 'save',
      label: saveLabel,
      onClick: onSave,
      variant: 'primary',
      disabled: saveDisabled,
      loading: saveLoading
    }
  ];

  return (
    <AdminActionButtons
      buttons={buttons}
      className={className}
      orientation="horizontal"
      spacing="normal"
    />
  );
}