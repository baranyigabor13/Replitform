import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ProgressIndicatorProps extends HTMLAttributes<HTMLDivElement> {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
}

const ProgressIndicator = forwardRef<HTMLDivElement, ProgressIndicatorProps>(({
  className,
  currentStep,
  totalSteps,
  labels = ["Basic Information", "AI-Generated Questions", "Generated Ads"],
  ...props
}, ref) => {
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <div className={cn("mb-8", className)} ref={ref} {...props}>
      <div className="flex justify-between items-center mb-2">
        <span className={`${currentStep === 1 ? 'text-neon-blue' : currentStep === 2 ? 'text-neon-purple' : 'text-neon-green'}`}>
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-gray-400">{labels[currentStep - 1]}</span>
      </div>
      <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-neon-blue via-neon-purple to-neon-green rounded-full"
          style={{ 
            width: `${progress}%`,
            backgroundSize: '200% 100%',
            animation: 'gradient-shift 3s ease infinite'
          }}
        ></div>
      </div>
    </div>
  );
});

ProgressIndicator.displayName = 'ProgressIndicator';

export { ProgressIndicator };
