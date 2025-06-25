"use client";

import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle, faTimes } from "@fortawesome/free-solid-svg-icons";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
  onConfirm: () => void;
  onCancel: () => void;
  autoClose?: number; // Auto close after x seconds if no action
}

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  confirmButtonClass = "bg-red-600 hover:bg-red-700 text-white",
  onConfirm,
  onCancel,
  autoClose
}: ConfirmationModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      if (autoClose) {
        setTimeLeft(autoClose);
      }
    } else {
      setIsVisible(false);
      setTimeLeft(null);
    }
  }, [isOpen, autoClose]);

  useEffect(() => {
    if (timeLeft === null) return;

    if (timeLeft <= 0) {
      onCancel();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, onCancel]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 pointer-events-auto"
        onClick={onCancel}
      />
      
      {/* Modal positioned at bottom right */}
      <div className="absolute bottom-6 right-6 pointer-events-auto">
        <div className={`
          bg-white border border-slate-200 rounded-xl shadow-2xl p-6 max-w-sm
          transform transition-all duration-300 ease-out
          ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'}
        `}>
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
                {timeLeft !== null && (
                  <p className="text-xs text-slate-500">
                    Auto-cancel in {timeLeft}s
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onCancel}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <FontAwesomeIcon icon={faTimes} className="text-sm" />
            </button>
          </div>

          {/* Message */}
          <p className="text-slate-600 mb-6 leading-relaxed">
            {message}
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors font-medium"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-2 rounded-lg transition-colors font-medium ${confirmButtonClass}`}
            >
              {confirmText}
            </button>
          </div>

          {/* Progress bar for auto-close */}
          {timeLeft !== null && autoClose && (
            <div className="mt-4 bg-slate-200 rounded-full h-1 overflow-hidden">
              <div 
                className="bg-red-500 h-full transition-all duration-1000 ease-linear"
                style={{ width: `${((autoClose - timeLeft) / autoClose) * 100}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}