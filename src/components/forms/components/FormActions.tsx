/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';

interface FormActionsProps {
  isFormValid: boolean;
  isSaving: boolean;
  isEditing: boolean;
  onCancel?: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const FormActions: React.FC<FormActionsProps> = ({
  isFormValid,
  isSaving,
  isEditing,
  onCancel,
  onSubmit
}) => {
  return (
    <div className="grid grid-cols-2 gap-0">
      <button
        type="button"
        onClick={onCancel}
        className="group relative p-4 text-center font-space-grotesk font-semibold text-black border-r border-black hover:bg-black transition-all duration-300 overflow-hidden"
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-200/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
        
        <span className="relative group-hover:text-white transition-colors duration-300">Cancel</span>
      </button>
      <button
        type="submit"
        disabled={!isFormValid || isSaving}
        onClick={onSubmit}
        className={`group relative p-4 text-center font-space-grotesk font-semibold transition-all duration-300 overflow-hidden ${
          !isFormValid || isSaving
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-black text-white hover:bg-gray-800'
        }`}
      >
        {/* Animated background gradient for enabled state */}
        {(isFormValid && !isSaving) && (
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-green-200/20 to-transparent translate-x-[100%] group-hover:translate-x-[-100%] transition-transform duration-700"></div>
        )}
        
        <div className="relative">
          {isSaving ? (
            <div className="flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Saving...
            </div>
          ) : (
            isEditing ? 'Update Person' : 'Add Person'
          )}
        </div>
      </button>
    </div>
  );
};

export default FormActions;