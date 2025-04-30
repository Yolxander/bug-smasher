import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export function StepIndicator({ currentStep, totalSteps, steps }: StepIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              index + 1 === currentStep
                ? 'bg-black text-white'
                : index + 1 < currentStep
                ? 'bg-black text-white'
                : 'bg-gray-200 text-gray-500'
            }`}>
              {index + 1}
            </div>
            <div className="ml-2 text-sm font-medium text-gray-600">{step}</div>
            {index < steps.length - 1 && (
              <div className={`h-[2px] w-16 mx-2 ${
                index + 1 < currentStep ? 'bg-black' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 