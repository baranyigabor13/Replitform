import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface RadioCardOption {
  value: string;
  label: string;
  icon?: string;
  description?: string;
}

export interface RadioCardProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  options: RadioCardOption[];
  color?: 'blue' | 'purple' | 'green';
  onChange?: (value: string) => void;
  value?: string;
  layout?: 'horizontal' | 'vertical';
}

const colorStyles = {
  blue: {
    border: 'peer-checked:border-neon-blue hover:border-neon-blue',
    bg: 'peer-checked:bg-neon-blue peer-checked:bg-opacity-10',
    text: 'text-neon-blue',
    gradient: 'from-neon-blue'
  },
  purple: {
    border: 'peer-checked:border-neon-purple hover:border-neon-purple',
    bg: 'peer-checked:bg-neon-purple peer-checked:bg-opacity-10',
    text: 'text-neon-purple',
    gradient: 'from-neon-purple'
  },
  green: {
    border: 'peer-checked:border-neon-green hover:border-neon-green',
    bg: 'peer-checked:bg-neon-green peer-checked:bg-opacity-10',
    text: 'text-neon-green',
    gradient: 'from-neon-green'
  }
};

const RadioCard = forwardRef<HTMLInputElement, RadioCardProps>(({
  className,
  options,
  color = 'blue',
  onChange,
  value,
  layout = 'horizontal',
  ...props
}, ref) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className={cn(
      'grid gap-4',
      layout === 'horizontal' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1',
      className
    )}>
      {options.map((option) => (
        <div key={option.value} className="card-3d relative">
          <input
            type="radio"
            id={`option-${option.value}`}
            name={props.name}
            value={option.value}
            checked={value === option.value}
            onChange={handleChange}
            className="peer sr-only"
            ref={ref}
            {...props}
          />
          <label
            htmlFor={`option-${option.value}`}
            className={cn(
              'block h-full glass rounded-lg p-6 border-2 border-transparent cursor-pointer',
              'transition-all duration-300',
              colorStyles[color].border,
              colorStyles[color].bg,
              'overflow-hidden'
            )}
          >
            <div className={cn(
              'absolute inset-0 bg-gradient-to-br to-transparent opacity-0 peer-checked:opacity-10 transition-opacity duration-300',
              colorStyles[color].gradient
            )}></div>
            <div className="relative flex flex-col items-center text-center">
              {option.icon && (
                <span className={cn(
                  "material-icons text-4xl mb-3 transition-colors duration-300",
                  value === option.value ? "text-white" : colorStyles[color].text
                )}>
                  {option.icon}
                </span>
              )}
              <span className={cn(
                "font-bold transition-colors duration-300",
                value === option.value ? "text-white" : "text-black"
              )}>{option.label}</span>
              {option.description && (
                <p className={cn(
                  "text-sm mt-2 transition-colors duration-300",
                  value === option.value ? "text-gray-200" : "text-gray-400"
                )}>{option.description}</p>
              )}
            </div>
          </label>
        </div>
      ))}
    </div>
  );
});

RadioCard.displayName = 'RadioCard';

export { RadioCard };