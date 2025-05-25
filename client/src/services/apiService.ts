import { supabase } from '@/lib/supabase';
import { GenerateQuestionsResponse, GenerateAdsResponse, Question, AdContent } from '@shared/schema';

// Helper function to mimic server-side generation of questions
// This would ideally be replaced with a call to a Supabase Edge Function
const generateDynamicQuestions = (
  businessType: string,
  businessName: string,
  valueProposition: string
): Question[] => {
  // These are default questions until integrated with Gemini AI
  return [
    {
      id: "targetAudience",
      text: "Who is your target audience?",
      type: "radio",
      color: "blue",
      options: [
        {
          value: "young-adults",
          label: "Young Adults (18-34)",
          description: "Tech-savvy, social media active"
        },
        {
          value: "professionals",
          label: "Professionals (35-54)",
          description: "Career-focused, higher income"
        },
        {
          value: "seniors",
          label: "Seniors (55+)",
          description: "Value-oriented, traditional"
        },
        {
          value: "all-ages",
          label: "All Ages",
          description: "Broad appeal across demographics"
        }
      ],
      required: true
    },
    {
      id: "dailyBudget",
      text: "What's your daily ad budget?",
      type: "slider",
      min: 5,
      max: 100,
      defaultValue: 50,
      color: "purple",
      required: true
    },
    {
      id: "objectives",
      text: "What are your ad objectives? (Choose all that apply)",
      type: "checkbox",
      color: "green",
      options: [
        {
          value: "awareness",
          label: "Brand Awareness",
          description: "Reach people likely to be interested"
        },
        {
          value: "engagement",
          label: "Engagement",
          description: "Get more likes, comments and shares"
        },
        {
          value: "traffic",
          label: "Website Traffic",
          description: "Send people to your site"
        },
        {
          value: "conversions",
          label: "Conversions",
          description: "Drive valuable actions like purchases"
        }
      ],
      required: true
    },
    {
      id: "sellingPoint",
      text: "What's your unique selling point in one sentence?",
      type: "text",
      color: "blue",
      required: true
    }
  ];
};

// Helper function to mimic server-side generation of ads
// This would ideally be replaced with a call to a Supabase Edge Function using Gemini AI
const generateDefaultAds = (businessName: string): AdContent[] => {
  return [
    {
      headline: `Boost Your Business with ${businessName}`,
      content: `Streamline your workflow with ${businessName}'s cutting-edge productivity solution. Save time, reduce costs, and increase efficiency. Limited-time offer: Start your free trial today.`,
      tone: "professional",
      length: "short",
      tags: ["productivity", "business"],
      emojiCount: 0
    },
    {
      headline: `Ready to level up your workflow? 🚀`,
      content: `Hey there! Tired of wasting time on repetitive tasks? ${businessName}'s got your back! Our smart solution cuts your workload in half. No kidding! Join thousands of happy users and see the difference yourself. Grab your free trial – your future self will thank you! 😉`,
      tone: "casual",
      length: "medium",
      tags: ["timesaver", "worksmarter"],
      emojiCount: 3
    },
    {
      headline: `LAST CHANCE: Transform Your Productivity TODAY!`,
      content: `⚠️ ATTENTION: This special offer ends TONIGHT at midnight! ⚠️ Don't miss your chance to revolutionize your workflow with ${businessName}'s award-winning solution. Our users report saving 15+ hours per week! That's time back in YOUR day! Limited slots available - 50% OFF for the first 100 new subscribers. Act NOW before someone else takes your spot! Click to claim your discount before the countdown hits zero!`,
      tone: "urgent",
      length: "long",
      tags: ["limitedoffer", "actfast"],
      emojiCount: 1
    }
  ];
};

// Function to generate dynamic questions based on initial form answers
export const generateQuestions = async (
  businessType: string,
  businessName: string,
  valueProposition: string
): Promise<GenerateQuestionsResponse> => {
  try {
    // Save the initial form data to Supabase
    const { data: formData, error: formError } = await supabase
      .from('form_data')
      .insert([
        { 
          business_type: businessType,
          business_name: businessName,
          value_proposition: valueProposition,
          answers: {},
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (formError) {
      console.error('Error saving form data:', formError);
    }

    // In a real implementation, you would call a Supabase Edge Function that uses Gemini AI
    // For now, return predefined questions
    const questions = generateDynamicQuestions(businessType, businessName, valueProposition);
    
    return { questions };
  } catch (error) {
    console.error('Error generating questions:', error);
    throw new Error('Failed to generate questions. Please try again.');
  }
};

// Function to generate ads based on all form answers
export const generateAds = async (
  allAnswers: Record<string, any>
): Promise<GenerateAdsResponse> => {
  try {
    // Update the form data in Supabase with all answers
    const { data: formData, error: formError } = await supabase
      .from('form_data')
      .update({ 
        answers: allAnswers,
        updated_at: new Date().toISOString()
      })
      .eq('business_name', allAnswers.businessName)
      .select();

    if (formError) {
      console.error('Error updating form data:', formError);
    }

    // In a real implementation, you would call a Supabase Edge Function that uses Gemini AI
    // For now, return predefined ads
    const ads = generateDefaultAds(allAnswers.businessName);
    
    // Save generated ads to Supabase
    const { error: adsError } = await supabase
      .from('generated_ads')
      .insert(
        ads.map(ad => ({
          form_data_id: formData?.[0]?.id || null,
          headline: ad.headline,
          content: ad.content,
          tone: ad.tone,
          length: ad.length,
          tags: ad.tags,
          emoji_count: ad.emojiCount,
          created_at: new Date().toISOString()
        }))
      );

    if (adsError) {
      console.error('Error saving generated ads:', adsError);
    }
    
    return { ads };
  } catch (error) {
    console.error('Error generating ads:', error);
    throw new Error('Failed to generate ads. Please try again.');
  }
};

// Function to save generated ad to favorites
export const saveAdToFavorites = async (
  adContent: string,
  headline: string,
  tone: string
): Promise<{ success: boolean }> => {
  try {
    const { error } = await supabase
      .from('favorite_ads')
      .insert([
        { 
          headline,
          content: adContent,
          tone,
          created_at: new Date().toISOString()
        }
      ]);
    
    if (error) {
      console.error('Error saving favorite:', error);
      return { success: false };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error saving ad:', error);
    throw new Error('Failed to save ad. Please try again.');
  }
};

// Function to regenerate an ad with specific parameters
export const regenerateAd = async (
  adId: string,
  parameters: {
    tone?: string;
    length?: string;
    emphasis?: string;
  }
): Promise<{ adContent: string }> => {
  try {
    // In a real implementation, you would call a Supabase Edge Function that uses Gemini AI
    // For now, return a modified ad content
    const regeneratedContent = `Your regenerated ad with ${parameters.tone || 'standard'} tone, 
                               ${parameters.length || 'medium'} length, and emphasis on 
                               ${parameters.emphasis || 'general benefits'}.`;
    
    return { adContent: regeneratedContent };
  } catch (error) {
    console.error('Error regenerating ad:', error);
    throw new Error('Failed to regenerate ad. Please try again.');
  }
};
