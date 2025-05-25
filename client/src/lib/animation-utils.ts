import { MotionValue, useTransform, useSpring } from 'framer-motion';

// Helper function for smooth animation values
export const useSmoothTransform = (
  value: MotionValue<number>,
  output: [number, number],
  config: { stiffness?: number; damping?: number; mass?: number } = {}
) => {
  const smoothValue = useSpring(value, {
    stiffness: config.stiffness || 100,
    damping: config.damping || 20,
    mass: config.mass || 1
  });
  
  return useTransform(smoothValue, [0, 1], output);
};

// Create a staggered animation for children elements
export const getStaggerConfig = (staggerChildren = 0.1, delayChildren = 0) => ({
  staggerChildren,
  delayChildren
});

// Animation variants for common patterns
export const fadeInUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 80 } }
};

export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: (i = 1) => ({
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: i * 0.2 }
  })
};

// Tilt animation on hover (3D effect)
export const useTiltAnimation = (strength = 25) => {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / strength;
    const rotateY = (centerX - x) / strength;
    
    element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };
  
  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
  };
  
  return { handleMouseMove, handleMouseLeave };
};

// Pulse glow animation
export const pulseGlowAnimation = {
  initial: { filter: 'brightness(1) drop-shadow(0 0 5px currentColor)' },
  animate: {
    filter: ['brightness(1) drop-shadow(0 0 5px currentColor)', 'brightness(1.3) drop-shadow(0 0 15px currentColor)', 'brightness(1) drop-shadow(0 0 5px currentColor)'],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
  }
};

// Neon text flicker animation
export const neonFlickerAnimation = {
  initial: { textShadow: '0 0 5px currentColor, 0 0 10px currentColor' },
  animate: {
    textShadow: [
      '0 0 5px currentColor, 0 0 10px currentColor',
      '0 0 2px currentColor, 0 0 5px currentColor',
      '0 0 10px currentColor, 0 0 20px currentColor',
      '0 0 5px currentColor, 0 0 10px currentColor'
    ],
    transition: { duration: 4, repeat: Infinity, repeatType: 'reverse', times: [0, 0.1, 0.2, 1] }
  }
};
