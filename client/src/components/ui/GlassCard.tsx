import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  glowColor?: 'blue' | 'purple' | 'green' | 'none';
  tilt?: boolean;
  borderGlow?: boolean;
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(({
  className,
  children,
  glowColor = 'none',
  tilt = false,
  borderGlow = false,
  ...props
}, ref) => {
  const colorValues = {
    blue: '#00D9FF',
    purple: '#B794F4',
    green: '#00FF88',
    none: 'transparent'
  };

  const glowStyles = {
    blue: 'before:bg-neon-blue',
    purple: 'before:bg-neon-purple',
    green: 'before:bg-neon-green',
    none: ''
  };

  const borderStyles = {
    blue: 'border-neon-blue border-opacity-20',
    purple: 'border-neon-purple border-opacity-20',
    green: 'border-neon-green border-opacity-20',
    none: 'border-white/10'
  };

  return (
    <div
      className={cn(
        'glass rounded-3xl p-8 relative overflow-hidden',
        'border',
        tilt && 'tilt-card',
        borderGlow && 'hover:border-opacity-100 transition-all duration-300',
        borderStyles[glowColor],
        glowStyles[glowColor],
        className
      )}
      ref={ref}
      style={{
        '--color': colorValues[glowColor]
      } as React.CSSProperties}
      {...props}
    >
      {glowColor !== 'none' && (
        <>
          <div className="absolute top-[-50%] left-[-10%] w-[120%] h-[200%] opacity-5 blur-3xl" 
               style={{ backgroundColor: colorValues[glowColor] }} />
          <div className="absolute bottom-[-50%] right-[-10%] w-[120%] h-[200%] opacity-5 blur-3xl"
               style={{ backgroundColor: colorValues[glowColor] }} />
        </>
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
});

GlassCard.displayName = 'GlassCard';

export { GlassCard };
