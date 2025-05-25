import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { GlassCard } from './ui/GlassCard';
import { NeonButton } from './ui/NeonButton';
import { ProgressIndicator } from './ui/ProgressIndicator';
import { LoadingOrb } from './ui/LoadingOrb';
import FormStep from './FormStep';
import GeneratedAds from './GeneratedAds';
import { useFormStore } from '@/store/formStore';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Question, FormStep as FormStepType, AdContent } from '@shared/schema';
import { generateQuestions, generateAds } from '@/services/apiService';

const MultiStepForm = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [initialQuestions] = useState<Question[]>([
    {
      id: 'businessType',
      text: 'What are you advertising?',
      type: 'radio',
      color: 'blue',
      options: [
        { value: 'product', label: 'Product', icon: 'shopping_bag', description: 'Physical or digital items for sale' },
        { value: 'service', label: 'Service', icon: 'handyman', description: 'Professional skills and expertise' },
        { value: 'event', label: 'Event', icon: 'event', description: 'Gatherings, conferences, or shows' },
      ],
      required: true
    },
    {
      id: 'businessName',
      text: "What's the name of your product/service/event?",
      type: 'text',
      color: 'purple',
      required: true
    },
    {
      id: 'valueProposition',
      text: "What's your main value proposition?",
      type: 'text',
      color: 'green',
      required: true,
      multiline: true
    },
  ]);

  const { 
    formData, 
    updateFormData, 
    setDynamicQuestions, 
    setGeneratedAds,
    dynamicQuestions,
    generatedAds
  } = useFormStore();

  // Generate dynamic questions based on initial answers
  const generateQuestionsMutation = useMutation({
    mutationFn: async () => {
      return await generateQuestions(
        formData.businessType,
        formData.businessName,
        formData.valueProposition
      );
    },
    onSuccess: (data) => {
      setDynamicQuestions(data.questions);
      setCurrentStep(2);
    },
    onError: (error: any) => {
      toast({
        title: "Error generating questions",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Generate ads based on all form answers
  const generateAdsMutation = useMutation({
    mutationFn: async () => {
      return await generateAds(formData);
    },
    onSuccess: (data) => {
      setGeneratedAds(data.ads);
      setCurrentStep(3);
    },
    onError: (error: any) => {
      toast({
        title: "Error generating ads",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleNext = () => {
    if (currentStep === 1) {
      // Validate required fields
      const requiredInitialFields = ['businessType', 'businessName', 'valueProposition'];
      const missingFields = requiredInitialFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        toast({
          title: "Missing required fields",
          description: "Please fill out all required fields before continuing.",
          variant: "destructive"
        });
        return;
      }
      
      generateQuestionsMutation.mutate();
    } else if (currentStep === 2) {
      // Validate dynamic questions
      const requiredDynamicFields = dynamicQuestions
        .filter(q => q.required)
        .map(q => q.id);
        
      const missingFields = requiredDynamicFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        toast({
          title: "Missing required fields",
          description: "Please fill out all required fields before continuing.",
          variant: "destructive"
        });
        return;
      }
      
      generateAdsMutation.mutate();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRegenerate = () => {
    generateAdsMutation.mutate();
  };

  // Determine which step to render
  const renderStep = () => {
    if (generateQuestionsMutation.isPending || generateAdsMutation.isPending) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          key="loading"
        >
          <GlassCard className="py-20 flex flex-col items-center justify-center">
            <LoadingOrb />
          </GlassCard>
        </motion.div>
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            key="step1"
          >
            <GlassCard>
              <ProgressIndicator currentStep={1} totalSteps={3} />
              <h2 className="text-2xl md:text-3xl font-bold mb-8 typing-effect">
                Let's start with the basics about your business
              </h2>
              <FormStep 
                questions={initialQuestions} 
                formData={formData} 
                updateFormData={updateFormData} 
              />
              <div className="mt-10 flex justify-end">
                <NeonButton 
                  color="green" 
                  size="lg" 
                  onClick={handleNext}
                  icon={<span className="material-icons">arrow_forward</span>}
                >
                  Next Step
                </NeonButton>
              </div>
            </GlassCard>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            key="step2"
          >
            <GlassCard>
              <ProgressIndicator currentStep={2} totalSteps={3} />
              <h2 className="text-2xl md:text-3xl font-bold mb-8 typing-effect">
                Based on your information, here's what we need to know
              </h2>
              <FormStep 
                questions={dynamicQuestions} 
                formData={formData} 
                updateFormData={updateFormData} 
              />
              <div className="mt-10 flex justify-between">
                <NeonButton 
                  color="gray" 
                  size="lg" 
                  onClick={handleBack}
                  icon={<span className="material-icons">arrow_back</span>}
                  iconPosition="left"
                >
                  Back
                </NeonButton>
                <NeonButton 
                  color="purple" 
                  size="lg" 
                  onClick={handleNext}
                  icon={<span className="material-icons">auto_awesome</span>}
                >
                  Generate Ads
                </NeonButton>
              </div>
            </GlassCard>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            key="step3"
          >
            <GlassCard>
              <ProgressIndicator currentStep={3} totalSteps={3} />
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl md:text-3xl font-bold typing-effect">
                  Your AI-Generated Facebook Ads
                </h2>
                <NeonButton 
                  color="green" 
                  size="sm" 
                  onClick={handleRegenerate}
                  icon={<span className="material-icons text-sm">refresh</span>}
                  iconPosition="left"
                >
                  Regenerate
                </NeonButton>
              </div>
              <GeneratedAds ads={generatedAds} />
              <div className="flex justify-between mt-10">
                <NeonButton 
                  color="gray" 
                  size="lg" 
                  onClick={handleBack}
                  icon={<span className="material-icons">arrow_back</span>}
                  iconPosition="left"
                >
                  Back to Questions
                </NeonButton>
                <NeonButton 
                  color="blue" 
                  size="lg"
                  icon={<span className="material-icons">check_circle</span>}
                >
                  Complete
                </NeonButton>
              </div>
            </GlassCard>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence mode="wait">
      {renderStep()}
    </AnimatePresence>
  );
};

export default MultiStepForm;
