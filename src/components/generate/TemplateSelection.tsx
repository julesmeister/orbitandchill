/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';
import { synapsasColors } from '@/constants/matrixConfig';
import type { TemplateType } from '@/types/generate';

interface TemplateSelectionProps {
  selectedTemplate: TemplateType;
  onTemplateChange: (template: TemplateType) => void;
}

export default function TemplateSelection({ selectedTemplate, onTemplateChange }: TemplateSelectionProps) {
  return (
    <section className="px-[5%] py-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-space-grotesk text-3xl font-bold text-black mb-8 text-center">
          Choose Template
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 bg-white rounded-2xl overflow-hidden border border-black max-w-4xl mx-auto mb-12">
          {/* Destiny Matrix */}
          <div 
            className={`p-8 cursor-pointer transition-all duration-300 border-r border-black md:border-r lg:border-r ${
              selectedTemplate === 'destiny-matrix' 
                ? 'bg-black text-white' 
                : 'bg-white text-black hover:bg-gray-50'
            }`}
            onClick={() => onTemplateChange('destiny-matrix')}
            style={{
              backgroundColor: selectedTemplate === 'destiny-matrix' ? synapsasColors.black : undefined
            }}
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 border-2 border-current rounded-full flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="font-space-grotesk text-lg font-bold mb-2">Destiny Matrix</h3>
              <p className="text-sm opacity-80">22 arcana chart template</p>
            </div>
          </div>

          {/* Natal Chart */}
          <div 
            className={`p-8 cursor-pointer transition-all duration-300 border-r border-black md:border-r-0 lg:border-r ${
              selectedTemplate === 'natal-chart' 
                ? 'bg-black text-white' 
                : 'bg-white text-black hover:bg-gray-50'
            }`}
            onClick={() => onTemplateChange('natal-chart')}
            style={{
              backgroundColor: selectedTemplate === 'natal-chart' ? synapsasColors.black : undefined
            }}
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 border-2 border-current rounded-full flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="font-space-grotesk text-lg font-bold mb-2">Natal Chart</h3>
              <p className="text-sm opacity-80">Traditional birth chart</p>
            </div>
          </div>

          {/* Custom */}
          <div 
            className={`p-8 cursor-pointer transition-all duration-300 ${
              selectedTemplate === 'custom' 
                ? 'bg-black text-white' 
                : 'bg-white text-black hover:bg-gray-50'
            }`}
            onClick={() => onTemplateChange('custom')}
            style={{
              backgroundColor: selectedTemplate === 'custom' ? synapsasColors.black : undefined
            }}
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 border-2 border-current rounded-full flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="font-space-grotesk text-lg font-bold mb-2">Custom</h3>
              <p className="text-sm opacity-80">Build your own template</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}