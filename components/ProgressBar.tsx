
import React from 'react';

interface ProgressBarProps {
  steps: string[];
  currentStep: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ steps, currentStep }) => {
  return (
    <div className="w-full">
      <div className="flex justify-between mb-2">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`h-1.5 rounded-full transition-all duration-500 flex-1 mx-0.5 ${
              index <= currentStep ? 'bg-indigo-600' : 'bg-slate-200'
            }`}
          />
        ))}
      </div>
      <div className="flex justify-between">
        <span className="text-xs font-bold text-indigo-600 tracking-tight">
          STEP {currentStep + 1}: {steps[currentStep]}
        </span>
        <span className="text-xs text-slate-400 font-medium">
          {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;
