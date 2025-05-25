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
    console.log('Saving form data:', {
      business_type: formData.businessType,
      business_name: formData.businessName,
      value_proposition: formData.valueProposition,
    });
    
    // For demo/development purposes, we'll simulate successful storage
    // and return a mock ID since we may not have Supabase set up yet
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      console.log('Using mock storage since Supabase credentials are missing');
      return { id: Math.floor(Math.random() * 10000) + 1 };
    }

    // If we have Supabase credentials, attempt to save to the database
    const { data, error } = await supabase
      .from('form_data')
      .insert([
        {
          business_type: formData.businessType || 'default',
          business_name: formData.businessName || 'Default Business',
          value_proposition: formData.valueProposition || 'Default value proposition',
          answers: formData,
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.error('Error saving form data:', error);
      // Return a mock ID anyway so the application flow isn't interrupted
      return { id: Math.floor(Math.random() * 10000) + 1 };
    }

    return { id: data?.[0]?.id || Math.floor(Math.random() * 10000) + 1 };
  } catch (error) {
    console.error('Error saving form data:', error);
    // Return a mock ID for development/demo purposes
    return { id: Math.floor(Math.random() * 10000) + 1 };
  }
};

// Function to save generated ads to Supabase
export const saveGeneratedAds = async (
  formDataId: number,
  ads: any[]
): Promise<void> => {
  try {
    console.log('Saving generated ads for form data ID:', formDataId);
    
    // For demo/development purposes, if we don't have Supabase credentials,
    // just log the data and return
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      console.log('Using mock storage for ads since Supabase credentials are missing');
      console.log('Would save these ads:', ads);
      return;
    }

    // If we have Supabase credentials, attempt to save to the database
    const { error } = await supabase
      .from('generated_ads')
      .insert(
        ads.map(ad => ({
          form_data_id: formDataId,
          headline: ad.headline || 'Default Headline',
          content: ad.content || 'Default content',
          tone: ['professional', 'casual', 'urgent'].includes(ad.tone) ? ad.tone : 'professional',
          length: ['short', 'medium', 'long'].includes(ad.length) ? ad.length : 'medium',
          tags: Array.isArray(ad.tags) ? ad.tags : ['default'],
          emoji_count: typeof ad.emojiCount === 'number' ? ad.emojiCount : 0,
          created_at: new Date().toISOString()
        }))
      );

    if (error) {
      console.error('Error saving generated ads:', error);
      // Just log the error but don't throw, to prevent interrupting the application flow
    }
  } catch (error) {
    console.error('Error saving generated ads:', error);
    // Just log the error but don't throw, to prevent interrupting the application flow
  }
};