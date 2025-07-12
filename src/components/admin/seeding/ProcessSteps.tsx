/* eslint-disable @typescript-eslint/no-unused-vars */

interface ProcessStep {
  number: number;
  title: string;
  description: string;
  color: string;
}

interface ProcessStepsProps {
  steps: ProcessStep[];
  className?: string;
}

export default function ProcessSteps({ steps, className = "" }: ProcessStepsProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}>
      {steps.map((step) => (
        <div key={step.number} className="bg-white border border-black p-4">
          <div className="flex items-center mb-2">
            <div 
              className={`w-8 h-8 text-white rounded-full flex items-center justify-center font-bold mr-3`}
              style={{ backgroundColor: step.color }}
            >
              {step.number}
            </div>
            <h3 className="font-space-grotesk font-semibold">{step.title}</h3>
          </div>
          <p className="text-sm text-gray-600 font-open-sans">{step.description}</p>
        </div>
      ))}
    </div>
  );
}