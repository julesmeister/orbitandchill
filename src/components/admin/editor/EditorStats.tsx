/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

interface TextStats {
  words: number;
  characters: number;
  readingTime: number;
}

interface Validation {
  isValid: boolean;
  errors: string[];
}

interface EditorStatsProps {
  textStats: TextStats;
  validation: Validation;
  showValidation: boolean;
  minWords: number;
  minCharacters: number;
}

const EditorStats: React.FC<EditorStatsProps> = ({
  textStats,
  validation,
  showValidation,
  minWords,
  minCharacters
}) => {
  return (
    <div className="border-t border-black bg-gray-50">
      {/* Main Stats Bar */}
      <div className="px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          {/* Left: Writing Statistics */}
          <div className="flex items-center gap-6 font-open-sans">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-black"></div>
              <span className="text-sm font-medium text-black">
                {textStats.words} {textStats.words === 1 ? 'word' : 'words'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-black"></div>
              <span className="text-sm font-medium text-black">
                {textStats.characters} characters
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-black"></div>
              <span className="text-sm font-medium text-black">
                {textStats.readingTime} min read
              </span>
            </div>
          </div>

          {/* Right: Validation Status */}
          {showValidation && (
            <div className="flex items-center gap-3">
              {/* Word Count Indicator */}
              <div className={`flex items-center gap-2 px-3 py-2 border border-black transition-all duration-200 ${
                textStats.words >= minWords 
                  ? 'bg-black text-white' 
                  : 'bg-white text-black'
              }`}>
                <div className={`w-2 h-2 transition-all duration-200 ${
                  textStats.words >= minWords 
                    ? 'bg-white' 
                    : 'bg-black'
                }`}></div>
                <span className="text-xs font-medium font-open-sans">
                  {textStats.words >= minWords ? 'Words ✓' : `${minWords - textStats.words} more words`}
                </span>
              </div>
              
              {/* Character Count Indicator */}
              <div className={`flex items-center gap-2 px-3 py-2 border border-black transition-all duration-200 ${
                textStats.characters >= minCharacters 
                  ? 'bg-black text-white' 
                  : 'bg-white text-black'
              }`}>
                <div className={`w-2 h-2 transition-all duration-200 ${
                  textStats.characters >= minCharacters 
                    ? 'bg-white' 
                    : 'bg-black'
                }`}></div>
                <span className="text-xs font-medium font-open-sans">
                  {textStats.characters >= minCharacters ? 'Length ✓' : `${minCharacters - textStats.characters} more chars`}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Validation Messages */}
      {showValidation && !validation.isValid && (
        <div className="border-t border-black bg-white px-3 sm:px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-black flex items-center justify-center flex-shrink-0">
              <FontAwesomeIcon icon={faInfoCircle} className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm text-black font-open-sans">
              {validation.errors.join(' • ')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorStats;