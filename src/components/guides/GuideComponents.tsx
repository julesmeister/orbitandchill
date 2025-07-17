/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

// Hero Card Component
interface HeroCardProps {
  icon: string;
  title: string;
  description: string;
  backgroundColor?: string;
}

export function HeroCard({ icon, title, description, backgroundColor = '#6bdbff' }: HeroCardProps) {
  return (
    <div className="border border-black p-8" style={{ backgroundColor }}>
      <div className="flex items-center mb-6">
        <div className="w-16 h-16 bg-black flex items-center justify-center mr-6">
          <span className="text-white text-3xl">{icon}</span>
        </div>
        <div>
          <h3 className="font-space-grotesk text-2xl font-bold text-black mb-2">{title}</h3>
          <div className="w-24 h-0.5 bg-black"></div>
        </div>
      </div>
      <p className="text-black leading-relaxed text-lg">{description}</p>
    </div>
  );
}

// Info Grid Component
interface InfoGridItem {
  icon: string;
  title: string;
  description: string;
}

interface InfoGridProps {
  title: string;
  items: InfoGridItem[];
  backgroundColor?: string;
}

export function InfoGrid({ title, items, backgroundColor = '#f2e356' }: InfoGridProps) {
  return (
    <div className="border border-black p-8" style={{ backgroundColor }}>
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-black flex items-center justify-center mr-4">
          <span className="text-white text-xl">✨</span>
        </div>
        <div>
          <h3 className="font-space-grotesk text-xl font-bold text-black mb-1">{title}</h3>
          <div className="w-20 h-px bg-black"></div>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {items.map((item, index) => (
          <div key={index} className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-black mt-2 flex-shrink-0"></div>
              <div>
                <div className="font-medium text-black">{item.title}</div>
                <div className="text-black text-sm opacity-80">{item.description}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Section Card Component (for Big Three style layouts)
interface SectionCardProps {
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  keyQuestions: string[];
  backgroundColor: string;
  className?: string;
}

export function SectionCard({ icon, title, subtitle, description, keyQuestions, backgroundColor, className = "" }: SectionCardProps) {
  // Check if custom text color is provided in className
  const hasCustomTextColor = className.includes('text-white') || className.includes('text-black');
  const textColor = hasCustomTextColor ? '' : 'text-black';
  const textOpacity = hasCustomTextColor && className.includes('text-white') ? 'opacity-80' : 'opacity-80';
  
  return (
    <div className={`p-6 ${className}`} style={{ backgroundColor }}>
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-black flex items-center justify-center mr-4">
          <span className="text-white text-2xl">{icon}</span>
        </div>
        <div>
          <h4 className={`font-space-grotesk font-bold ${textColor} text-lg`}>{title}</h4>
          <span className={`${textColor} text-xs font-medium`}>{subtitle}</span>
        </div>
      </div>
      <div className="space-y-4">
        <p className={`${textColor} text-sm leading-relaxed`}>{description}</p>
        <div className="space-y-2">
          <div className={`${textColor} font-medium text-sm`}>Key Questions:</div>
          <div className={`space-y-1 text-xs ${textColor} ${textOpacity}`}>
            {keyQuestions.map((question, index) => (
              <div key={index}>• {question}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Integration Card Component
interface IntegrationCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  exampleText?: string;
}

export function IntegrationCard({ title, description, children, exampleText }: IntegrationCardProps) {
  return (
    <div className="border border-black p-8 bg-white">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-black flex items-center justify-center mr-4">
          <span className="text-white text-xl">🔄</span>
        </div>
        <div>
          <h3 className="font-space-grotesk text-2xl font-bold text-black mb-1">{title}</h3>
          <p className="text-black text-sm opacity-80">{description}</p>
          <div className="w-24 h-0.5 bg-black mt-3"></div>
        </div>
      </div>
      
      {children}
      
      {exampleText && (
        <div className="border border-black p-6" style={{ backgroundColor: '#6bdbff' }}>
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-black flex items-center justify-center mr-3">
              <span className="text-white text-sm">📝</span>
            </div>
            <div className="font-space-grotesk font-bold text-black">Example Integration:</div>
          </div>
          <div className="text-black text-sm leading-relaxed italic border-l-4 border-black pl-4">
            {exampleText}
          </div>
        </div>
      )}
    </div>
  );
}

// Assessment Exercise Component
interface AssessmentItem {
  number: number;
  title: string;
  description: string;
}

interface AssessmentExerciseProps {
  title: string;
  description: string;
  items: AssessmentItem[];
  backgroundColor?: string;
}

export function AssessmentExercise({ title, description, items, backgroundColor = '#f2e356' }: AssessmentExerciseProps) {
  return (
    <div className="border border-black p-8" style={{ backgroundColor }}>
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-black flex items-center justify-center mr-4">
          <span className="text-white text-xl">🔍</span>
        </div>
        <div>
          <h4 className="font-space-grotesk text-2xl font-bold text-black mb-1">{title}</h4>
          <p className="text-black text-sm opacity-80">{description}</p>
          <div className="w-20 h-px bg-black mt-2"></div>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-0 border border-black">
        {items.map((item, index) => (
          <div 
            key={item.number}
            className={`p-6 bg-white ${index < items.length - 1 ? 'border-r border-black' : ''}`}
          >
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-black flex items-center justify-center mt-1">
                <span className="text-white text-xs">{item.number}</span>
              </div>
              <div className="text-black text-sm leading-relaxed">
                <div className="font-space-grotesk font-bold mb-1">{item.title}</div>
                {item.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Visual Chart Component (reusable for different chart types)
interface ChartPoint {
  position: string;
  label: string;
  description: string;
}

interface VisualChartProps {
  title: string;
  description: string;
  points: ChartPoint[];
  centerContent?: React.ReactNode;
}

export function VisualChart({ title, description, points, centerContent }: VisualChartProps) {
  return (
    <div className="mt-6 p-6 border border-black" style={{ backgroundColor: '#6bdbff' }}>
      <div className="text-center">
        <div className="text-black font-medium text-sm mb-6">{title}</div>
        <div className="py-8 px-10">
          <div className="relative w-32 h-32 mx-auto">
            {/* Main circle */}
            <div className="w-full h-full bg-white border-2 border-black"></div>
            
            {/* Chart points */}
            {points.map((point, index) => (
              <div key={index}>
                <div className={`absolute text-xs font-bold text-black ${point.position}`}>
                  {point.label}
                </div>
                <div className={`absolute w-2 h-2 bg-black ${point.position.replace('-6', '1').replace('-bottom-6', 'bottom-1').replace('-top-6', 'top-1').replace('-left-6', 'left-1').replace('-right-6', 'right-1')}`}></div>
              </div>
            ))}
            
            {/* Center content */}
            {centerContent && (
              <div className="absolute inset-0 flex items-center justify-center">
                {centerContent}
              </div>
            )}
            
            {/* Cross lines */}
            <div className="absolute top-1/2 left-0 w-full h-px bg-black opacity-30"></div>
            <div className="absolute left-1/2 top-0 w-px h-full bg-black opacity-30"></div>
          </div>
        </div>
        <div className="text-black text-xs mt-2 italic opacity-80">{description}</div>
      </div>
    </div>
  );
}

// Symbol Grid Component (for planetary symbols, zodiac signs, etc.)
interface SymbolItem {
  symbol: string;
  name: string;
  description: string;
}

interface SymbolGridProps {
  title: string;
  subtitle: string;
  items: SymbolItem[];
  backgroundColor?: string;
}

export function SymbolGrid({ title, subtitle, items, backgroundColor = '#ff91e9' }: SymbolGridProps) {
  return (
    <div className="p-6" style={{ backgroundColor }}>
      <h4 className="font-space-grotesk text-lg font-bold text-black mb-4 flex items-center">
        <span className="w-8 h-8 bg-black flex items-center justify-center mr-3">
          <span className="text-white text-sm">⭐</span>
        </span>
        {title}
      </h4>
      
      <div className="mb-6">
        <div className="text-black font-semibold text-sm mb-3 flex items-center">
          <div className="w-2 h-2 bg-black mr-2"></div>
          {subtitle}
        </div>
        <div className="grid grid-cols-1 gap-2">
          {items.map((item, index) => (
            <div key={index} className="border border-black p-3 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-black flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{item.symbol}</span>
                  </div>
                  <div>
                    <span className="text-black text-sm font-bold">{item.name}</span>
                    <div className="text-black text-xs opacity-80">{item.description}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Next Steps Component
interface NextStep {
  number: number;
  title: string;
  description: string;
}

interface NextStepsProps {
  title: string;
  description: string;
  steps: NextStep[];
  backgroundColor?: string;
}

export function NextSteps({ title, description, steps, backgroundColor = '#51bd94' }: NextStepsProps) {
  return (
    <div className="border border-black p-8" style={{ backgroundColor }}>
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-black flex items-center justify-center mr-4">
          <span className="text-white text-xl">🚀</span>
        </div>
        <div>
          <h3 className="font-space-grotesk text-2xl font-bold text-black mb-1">{title}</h3>
          <p className="text-black text-sm opacity-80">{description}</p>
          <div className="w-24 h-0.5 bg-black mt-3"></div>
        </div>
      </div>
      
      <div className="space-y-4">
        {steps.map((step) => (
          <div key={step.number} className="flex items-start space-x-4 p-4 bg-white border border-black">
            <div className="w-8 h-8 bg-black flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-bold">{step.number}</span>
            </div>
            <div>
              <div className="font-space-grotesk font-bold text-black mb-1">{step.title}</div>
              <div className="text-black text-sm leading-relaxed">{step.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}