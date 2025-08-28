/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import NatalChartForm from '@/components/forms/NatalChartForm';
import { NatalChartFormData } from '@/hooks/useNatalChartForm';
import ChartPreview from '@/components/charts/ChartPreview';
import { NatalChartSectionConfig } from '@/config/sectionConfigs';
import { User } from '@/types/user';

interface NatalChartSectionProps {
  config: NatalChartSectionConfig;
  user: User | null;
  cachedChart: any;
  shouldShowChart: boolean | null;
  isGenerating: boolean;
  onFormSubmit: (formData: NatalChartFormData) => void;
  onEditData: () => void;
  className?: string;
}

const NatalChartSection: React.FC<NatalChartSectionProps> = ({
  config,
  user,
  cachedChart,
  shouldShowChart,
  isGenerating,
  onFormSubmit,
  onEditData,
  className = ''
}) => {
  const router = useRouter();

  return (
    <section className={`px-[5%] py-20 min-h-screen flex items-center ${className}`} id="natal-chart-section">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white border border-black">
          {/* Left Side - Form */}
          <div className="p-8 border-r border-black">
            {shouldShowChart && cachedChart ? (
              <div className="space-y-6">
                <ChartPreview
                  svgContent={cachedChart.svg}
                  userName={user?.username || 'Your'}
                  birthData={cachedChart.metadata.birthData}
                />

                {/* Action Buttons - Synapsas Style */}
                <div className="flex gap-0 border border-black overflow-hidden">
                  <button
                    onClick={() => router.push('/chart')}
                    className="flex-1 bg-black text-white p-4 font-space-grotesk font-semibold hover:bg-gray-800 transition-all duration-300 border-r border-black"
                  >
                    {config.actionButtons.viewChart}
                  </button>
                  <button
                    onClick={onEditData}
                    className="flex-1 bg-white text-black p-4 font-space-grotesk font-semibold hover:bg-black hover:text-white transition-all duration-300"
                  >
                    {config.actionButtons.editData}
                  </button>
                </div>

                {/* Quick Stats */}
                <div className="p-6 border border-black" style={{ backgroundColor: config.quickInsights.backgroundColor }}>
                  <h4 className="font-space-grotesk font-bold text-black mb-4">{config.quickInsights.title}</h4>
                  <div className="font-open-sans text-black space-y-2">
                    {config.quickInsights.items.map((item, index) => (
                      <p key={index}>{item}</p>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <NatalChartForm
                onSubmit={onFormSubmit}
                submitText={
                  isGenerating
                    ? "Generating Chart..."
                    : cachedChart
                      ? "View Your Chart"
                      : "Generate Chart"
                }
                showSubmitButton={true}
              />
            )}
          </div>

          {/* Right Side - Natal Chart Information */}
          <div className="p-8 flex flex-col justify" style={{ backgroundColor: 'black' }}>
            <div className="text-left mb-8">
              <h2 className="font-space-grotesk text-3xl lg:text-4xl font-bold text-white mb-4">
                {config.title}
              </h2>
              <p className="font-open-sans text-white/80 text-lg leading-relaxed mb-4">
                {config.description}
              </p>
            </div>

            <div className="space-y-6">
              {config.features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-white flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">{feature.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-space-grotesk text-lg font-bold text-white mb-2">{feature.title}</h3>
                    <p className="font-open-sans text-white/80 text-sm leading-relaxed mb-2">
                      {feature.description}
                    </p>
                    <p className="font-open-sans text-white/60 text-xs leading-relaxed">
                      {feature.details}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NatalChartSection;