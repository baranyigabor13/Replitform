import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface LoadingOrbProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  text?: string;
  progress?: number;
}

const LoadingOrb = forwardRef<HTMLDivElement, LoadingOrbProps>(({
  className,
  size = 'md',
  showText = true,
  text = 'AI is crafting your ads',
  progress = 65,
  ...props
}, ref) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-40 h-40'
  };

  const innerOrbSize = {
    sm: 'inset-4',
    md: 'inset-8',
    lg: 'inset-10'
  };

  const typingTexts = [
    "Analyzing target audience preferences...",
    "Generating compelling headlines...",
    "Optimizing ad content for engagement...",
    "Crafting call-to-action variations...",
    "Finalizing ad creative elements..."
  ];

  return (
    <div className="flex flex-col items-center justify-center" ref={ref} {...props}>
      <div className={cn("relative mb-8", sizeClasses[size])}>
        <div className="absolute inset-0 rounded-full border-4 border-gray-700 border-opacity-30"></div>
        <div className="absolute inset-0 rounded-full border-4 border-t-neon-blue border-r-neon-purple border-b-neon-green border-l-transparent animate-spin"></div>
        <div className={cn("absolute bg-gradient-to-br from-neon-blue to-neon-purple rounded-full", innerOrbSize[size])}>
          <div className="absolute inset-0 rounded-full bg-neon-blue opacity-70 animate-pulse-glow"></div>
        </div>
      </div>
      
      {showText && (
        <>
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-center">{text}</h2>
          <p className="text-gray-400 text-center max-w-md mb-6">
            Our neural network is analyzing your data and generating compelling ad variations tailored to your business.
          </p>
          
          <div className="flex flex-col items-center">
            <div className="mb-8 flex flex-col items-center">
              <div className="flex space-x-3 mb-3">
                <div className="w-3 h-3 rounded-full bg-neon-blue animate-pulse"></div>
                <div className="w-3 h-3 rounded-full bg-neon-purple animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-3 h-3 rounded-full bg-neon-green animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
              <span className="text-neon-blue text-sm typing-effect">
                {typingTexts[Math.floor(Math.random() * typingTexts.length)]}
              </span>
            </div>
            
            <div className="w-64 h-1 bg-gray-700 rounded-full overflow-hidden">
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
        </>
      )}
    </div>
  );
});

LoadingOrb.displayName = 'LoadingOrb';

export { LoadingOrb };
