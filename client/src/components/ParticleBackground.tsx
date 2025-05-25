import { useEffect, useRef } from 'react';

type Particle = {
  element: HTMLDivElement;
  size: number;
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  color: string;
  opacity: number;
  animationDuration: number;
};

const ParticleBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const createParticles = () => {
      const container = containerRef.current;
      if (!container) return;
      
      // Clear any existing particles
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      
      particlesRef.current = [];
      const particleCount = Math.min(50, Math.floor(window.innerWidth / 20));
      const colors = ['#00D9FF', '#B794F4', '#00FF88'];
      
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        const size = Math.random() * 3 + 1;
        
        particle.style.position = 'absolute';
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.borderRadius = '50%';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.opacity = (Math.random() * 0.5 + 0.2).toString();
        
        const animationDuration = Math.random() * 20 + 10;
        particle.style.animation = `float-particle ${animationDuration}s ease-in-out ${Math.random() * 5}s infinite`;
        
        container.appendChild(particle);
        
        particlesRef.current.push({
          element: particle,
          size,
          x: parseFloat(particle.style.left),
          y: parseFloat(particle.style.top),
          speedX: Math.random() * 0.2 - 0.1,
          speedY: Math.random() * 0.2 - 0.1,
          color: particle.style.background,
          opacity: parseFloat(particle.style.opacity),
          animationDuration
        });
      }
    };
    
    createParticles();
    
    const handleResize = () => {
      createParticles();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-0 opacity-30 pointer-events-none overflow-hidden"
      aria-hidden="true"
    />
  );
};

export default ParticleBackground;
