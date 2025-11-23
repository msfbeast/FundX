import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface ProgressIndicatorProps {
  steps: string[];
  currentStep: number;
  isComplete?: boolean;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ 
  steps, 
  currentStep, 
  isComplete = false 
}) => {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="space-y-3">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isDone = index < currentStep || isComplete;
          
          return (
            <div 
              key={index}
              className={`
                flex items-center gap-3 p-3 rounded-xl transition-all duration-300
                ${isActive ? 'bg-blue-50 border border-blue-200' : ''}
                ${isDone ? 'opacity-60' : ''}
              `}
            >
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all
                ${isDone ? 'bg-emerald-500 text-white' : ''}
                ${isActive ? 'bg-blue-500 text-white' : ''}
                ${!isActive && !isDone ? 'bg-slate-200 text-slate-400' : ''}
              `}>
                {isDone ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : isActive ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span className="text-xs font-bold">{index + 1}</span>
                )}
              </div>
              
              <span className={`
                text-sm font-medium transition-colors
                ${isActive ? 'text-blue-900' : ''}
                ${isDone ? 'text-slate-500' : ''}
                ${!isActive && !isDone ? 'text-slate-400' : ''}
              `}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Animated progress bar for indeterminate loading
export const IndeterminateProgress: React.FC<{ message?: string }> = ({ message }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return 90; // Cap at 90% for indeterminate
        return prev + Math.random() * 10;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto space-y-3">
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      {message && (
        <p className="text-sm text-slate-500 text-center font-medium animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};
