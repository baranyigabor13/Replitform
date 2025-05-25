import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Question, AdContent } from '@shared/schema';

interface FormState {
  formData: Record<string, any>;
  dynamicQuestions: Question[];
  generatedAds: AdContent[];
  currentStep: number;
  isLoading: boolean;
  selectedAdId: string | null;
  updateFormData: (key: string, value: any) => void;
  setDynamicQuestions: (questions: Question[]) => void;
  setGeneratedAds: (ads: AdContent[]) => void;
  setCurrentStep: (step: number) => void;
  setLoading: (loading: boolean) => void;
  setSelectedAd: (id: string | null) => void;
  reset: () => void;
}

export const useFormStore = create<FormState>()(
  persist(
    (set) => ({
      formData: {},
      dynamicQuestions: [],
      generatedAds: [],
      currentStep: 1,
      isLoading: false,
      selectedAdId: null,
      
      updateFormData: (key, value) => set((state) => ({
        formData: { ...state.formData, [key]: value }
      })),
      
      setDynamicQuestions: (questions) => set({
        dynamicQuestions: questions
      }),
      
      setGeneratedAds: (ads) => set({
        generatedAds: ads
      }),
      
      setCurrentStep: (step) => set({
        currentStep: step
      }),
      
      setLoading: (loading) => set({
        isLoading: loading
      }),
      
      setSelectedAd: (id) => set({
        selectedAdId: id
      }),
      
      reset: () => set({
        formData: {},
        dynamicQuestions: [],
        generatedAds: [],
        currentStep: 1,
        isLoading: false,
        selectedAdId: null
      }),
    }),
    {
      name: 'ad-generator-storage',
    }
  )
);
