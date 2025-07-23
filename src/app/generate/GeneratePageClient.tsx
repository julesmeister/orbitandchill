/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from 'react';
import HeroSection from '@/components/generate/HeroSection';
import TemplateSelection from '@/components/generate/TemplateSelection';
import DestinyMatrixTemplate from '@/components/generate/DestinyMatrixTemplate';
import NatalChartTemplate from '@/components/generate/NatalChartTemplate';
import CustomTemplate from '@/components/generate/CustomTemplate';
import CTASection from '@/components/generate/CTASection';
import { defaultMatrixValues } from '@/constants/matrixConfig';
import type { TemplateType } from '@/types/generate';

const GeneratePageClient: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('destiny-matrix');
  const [matrixValues, setMatrixValues] = useState<Record<string, number>>(defaultMatrixValues);

  const handleValueChange = (position: string, value: number) => {
    setMatrixValues(prev => ({
      ...prev,
      [position]: value
    }));
  };

  const handleReset = () => {
    setMatrixValues(defaultMatrixValues);
  };

  return (
    <div className="bg-white min-h-screen">
      <HeroSection />
      <TemplateSelection 
        selectedTemplate={selectedTemplate} 
        onTemplateChange={setSelectedTemplate} 
      />
      
      <section className="px-[5%] py-12">
        <div className="max-w-7xl mx-auto">
          {selectedTemplate === 'destiny-matrix' && (
            <DestinyMatrixTemplate
              matrixValues={matrixValues}
              onValueChange={handleValueChange}
              onReset={handleReset}
            />
          )}
          {selectedTemplate === 'natal-chart' && <NatalChartTemplate />}
          {selectedTemplate === 'custom' && <CustomTemplate />}
        </div>
      </section>

      <CTASection />
    </div>
  );
};

export default GeneratePageClient;