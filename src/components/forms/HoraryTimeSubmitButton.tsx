/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

interface HoraryTimeSubmitButtonProps {
  isFormValid: boolean;
  onCancel: () => void;
}

const HoraryTimeSubmitButton = React.memo(({
  isFormValid,
  onCancel
}: HoraryTimeSubmitButtonProps) => (
  <div className="grid grid-cols-2 gap-0">
    <button
      type="button"
      onClick={onCancel}
      className="group relative p-4 text-center font-space-grotesk font-semibold text-black border-r border-black hover:bg-black transition-all duration-300 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-200/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
      <span className="relative group-hover:text-white transition-colors duration-300">Cancel</span>
    </button>
    <button
      type="submit"
      disabled={!isFormValid}
      className={`group relative p-4 text-center font-space-grotesk font-semibold transition-all duration-300 overflow-hidden ${
        !isFormValid
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-black text-white hover:bg-gray-800'
      }`}
    >
      {isFormValid && (
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-green-200/20 to-transparent translate-x-[100%] group-hover:translate-x-[-100%] transition-transform duration-700"></div>
      )}
      <span className="relative">Use This Time</span>
    </button>
  </div>
));

HoraryTimeSubmitButton.displayName = 'HoraryTimeSubmitButton';

export default HoraryTimeSubmitButton;
