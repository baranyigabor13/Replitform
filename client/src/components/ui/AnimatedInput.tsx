import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface BaseAnimatedInputProps {
  label?: string;
  error?: string;
  color?: 'blue' | 'purple' | 'green';
}

interface AnimatedInputProps extends InputHTMLAttributes<HTMLInputElement>, BaseAnimatedInputProps {}
interface AnimatedTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, BaseAnimatedInputProps {
  rows?: number;
}

const colorStyles = {
  blue: 'border-neon-blue border-opacity-30 focus:border-opacity-100 focus:ring-neon-blue text-neon-blue',
  purple: 'border-neon-purple border-opacity-30 focus:border-opacity-100 focus:ring-neon-purple text-neon-purple',
  green: 'border-neon-green border-opacity-30 focus:border-opacity-100 focus:ring-neon-green text-neon-green',
};

const AnimatedInput = forwardRef<HTMLInputElement, AnimatedInputProps>(({
  className,
  label,
  color = 'blue',
  error,
  ...props
}, ref) => {
  return (
    <div className="relative">
      {label && (
        <label className={`block text-lg font-medium mb-3 ${colorStyles[color].split(' ').pop()}`}>
          {label}
        </label>
      )}
      <div className="relative">
        <input
          className={cn(
            'w-full bg-cyber-dark-alt glass px-5 py-4 rounded-lg',
            'border focus:outline-none focus:ring-2 focus:ring-opacity-30',
            'transition-all duration-300',
            colorStyles[color],
            error && 'border-red-500',
            className
          )}
          ref={ref}
          {...props}
        />
        <div className={`absolute inset-0 rounded-lg pointer-events-none opacity-0 hover:opacity-20 bg-gradient-to-r from-transparent via-${color === 'blue' ? 'neon-blue' : color === 'purple' ? 'neon-purple' : 'neon-green'} to-transparent bg-size-200 animate-gradient-x`} />
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
});

AnimatedInput.displayName = 'AnimatedInput';

const AnimatedTextarea = forwardRef<HTMLTextAreaElement, AnimatedTextareaProps>(({
  className,
  label,
  color = 'blue',
  error,
  rows = 3,
  ...props
}, ref) => {
  return (
    <div className="relative">
      {label && (
        <label className={`block text-lg font-medium mb-3 ${colorStyles[color].split(' ').pop()}`}>
          {label}
        </label>
      )}
      <div className="relative">
        <textarea
          rows={rows}
          className={cn(
            'w-full bg-cyber-dark-alt glass px-5 py-4 rounded-lg',
            'border focus:outline-none focus:ring-2 focus:ring-opacity-30',
            'transition-all duration-300',
            colorStyles[color],
            error && 'border-red-500',
            className
          )}
          ref={ref}
          {...props}
        />
        <div className={`absolute inset-0 rounded-lg pointer-events-none opacity-0 hover:opacity-20 bg-gradient-to-r from-transparent via-${color === 'blue' ? 'neon-blue' : color === 'purple' ? 'neon-purple' : 'neon-green'} to-transparent bg-size-200 animate-gradient-x`} />
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
});

AnimatedTextarea.displayName = 'AnimatedTextarea';

export { AnimatedInput, AnimatedTextarea };
