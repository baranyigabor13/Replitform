import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: 'blue' | 'purple' | 'green' | 'gray';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'outline';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const NeonButton = forwardRef<HTMLButtonElement, NeonButtonProps>(({
  className,
  children,
  color = 'blue',
  size = 'md',
  variant = 'outline',
  icon,
  iconPosition = 'right',
  disabled,
  ...props
}, ref) => {
  const colorClasses = {
    blue: 'border-neon-blue hover:border-neon-blue group-hover:bg-neon-blue text-neon-blue hover:text-white',
    purple: 'border-neon-purple hover:border-neon-purple group-hover:bg-neon-purple text-neon-purple hover:text-white',
    green: 'border-neon-green hover:border-neon-green group-hover:bg-neon-green text-neon-green hover:text-white',
    gray: 'border-gray-600 hover:border-gray-400 group-hover:bg-gray-700 text-gray-400 hover:text-white',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg font-bold',
  };

  const glowColor = {
    blue: '#00D9FF',
    purple: '#B794F4',
    green: '#00FF88',
    gray: '#4B5563',
  };

  const variantClasses = {
    solid: `bg-${color === 'blue' ? 'neon-blue' : color === 'purple' ? 'neon-purple' : color === 'green' ? 'neon-green' : 'gray-600'} text-white`,
    outline: 'bg-cyber-dark',
  };

  return (
    <button
      className={cn(
        'relative rounded-xl overflow-hidden group transition-all duration-300',
        'border font-medium focus:outline-none focus:ring-2 focus:ring-opacity-50',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        colorClasses[color],
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      disabled={disabled}
      ref={ref}
      {...props}
    >
      <span className="absolute inset-0 w-full h-full transition-all duration-300 scale-0 group-hover:scale-100 opacity-20" 
            style={{ backgroundColor: glowColor[color] }} />
      <span className="absolute -inset-10 w-[calc(100%+80px)] h-[calc(100%+80px)] transition-all duration-300 opacity-0 group-hover:opacity-100">
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-neon-blue via-neon-purple to-neon-green opacity-30 animate-spin-slow" />
      </span>
      <span className="relative z-10 flex items-center justify-center">
        {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
        {children}
        {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
      </span>
    </button>
  );
});

NeonButton.displayName = 'NeonButton';

export { NeonButton };
