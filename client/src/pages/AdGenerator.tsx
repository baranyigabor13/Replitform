import { useState, useEffect } from 'react';
import ParticleBackground from '@/components/ParticleBackground';
import MultiStepForm from '@/components/MultiStepForm';
import WelcomeScreen from '@/components/WelcomeScreen';
import { useFormStore } from '@/store/formStore';

export default function AdGenerator() {
  const [started, setStarted] = useState(false);
  const resetForm = useFormStore(state => state.reset);

  // Reset the form when the component mounts
  useEffect(() => {
    resetForm();
  }, [resetForm]);

  const handleStart = () => {
    setStarted(true);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-8">
      <ParticleBackground />
      
      <div className="w-full max-w-6xl mx-auto relative z-10">
        {!started ? (
          <WelcomeScreen onStart={handleStart} />
        ) : (
          <MultiStepForm />
        )}
      </div>
    </div>
  );
}
