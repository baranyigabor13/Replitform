import { supabase } from '@/lib/supabase';
import { GenerateQuestionsResponse, GenerateAdsResponse } from '@shared/schema';

// Base URL for Supabase Edge Functions
// When deployed, this will point to your actual Supabase project
const EDGE_FUNCTION_URL = import.meta.env.VITE_SUPABASE_URL 
  ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`
  : 'http://localhost:54321/functions/v1'; // Default for local development

// Function to generate dynamic questions based on initial form answers
export const generateQuestions = async (
  businessType: string,
  businessName: string,
  valueProposition: string
): Promise<GenerateQuestionsResponse> => {
  try {
    // Use Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('generateQuestions', {
      body: { businessType, businessName, valueProposition },
    });

    if (error) {
      console.error('Error calling generateQuestions function:', error);
      throw new Error(error.message || 'Failed to generate questions');
    }

    return data as GenerateQuestionsResponse;
  } catch (error) {
    console.error('Error generating questions:', error);
    
    // Fallback to direct API call if Supabase Edge Function invoke fails
    try {
      const response = await fetch(`${EDGE_FUNCTION_URL}/generateQuestions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ businessType, businessName, valueProposition }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (fallbackError) {
      console.error('Fallback error:', fallbackError);
      throw new Error('Failed to generate questions. Please try again.');
    }
  }
};

// Function to generate ads based on all form answers
export const generateAds = async (
  allAnswers: Record<string, any>
): Promise<GenerateAdsResponse> => {
  try {
    // Use Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('generateAds', {
      body: { allAnswers },
    });

    if (error) {
      console.error('Error calling generateAds function:', error);
      throw new Error(error.message || 'Failed to generate ads');
    }

    return data as GenerateAdsResponse;
  } catch (error) {
    console.error('Error generating ads:', error);
    
    // Fallback to direct API call if Supabase Edge Function invoke fails
    try {
      const response = await fetch(`${EDGE_FUNCTION_URL}/generateAds`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ allAnswers }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (fallbackError) {
      console.error('Fallback error:', fallbackError);
      throw new Error('Failed to generate ads. Please try again.');
    }
  }
};

// Function to save form data to Supabase
export const saveFormData = async (
  formData: Record<string, any>
): Promise<{ id: number }> => {
  try {
    const { data, error } = await supabase
      .from('form_data')
      .insert([
        {
          business_type: formData.businessType,
          business_name: formData.businessName,
          value_proposition: formData.valueProposition,
          answers: formData,
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.error('Error saving form data:', error);
      throw new Error(error.message || 'Failed to save form data');
    }

    return { id: data[0].id };
  } catch (error) {
    console.error('Error saving form data:', error);
    throw new Error('Failed to save form data. Please try again.');
  }
};

// Function to save generated ads to Supabase
export const saveGeneratedAds = async (
  formDataId: number,
  ads: any[]
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('generated_ads')
      .insert(
        ads.map(ad => ({
          form_data_id: formDataId,
          headline: ad.headline,
          content: ad.content,
          tone: ad.tone,
          length: ad.length,
          tags: ad.tags,
          emoji_count: ad.emojiCount,
          created_at: new Date().toISOString()
        }))
      );

    if (error) {
      console.error('Error saving generated ads:', error);
      throw new Error(error.message || 'Failed to save generated ads');
    }
  } catch (error) {
    console.error('Error saving generated ads:', error);
    throw new Error('Failed to save generated ads. Please try again.');
  }
};