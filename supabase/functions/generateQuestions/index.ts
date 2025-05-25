// Supabase Edge Function to generate questions based on initial form data
// In a real implementation, this would use the Gemini API

// Define allowed origins for CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Handle CORS preflight requests
const handleCors = (request: Request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
};

// Generate dynamic questions based on business type
const generateDynamicQuestions = (
  businessType: string,
  businessName: string,
  valueProposition: string
) => {
  // These questions would be generated dynamically using Gemini AI in a real implementation
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

// Main function to handle requests
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Parse the request body
    const { businessType, businessName, valueProposition } = await req.json();
    
    // Input validation
    if (!businessType || !businessName || !valueProposition) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Generate questions based on business info
    const questions = generateDynamicQuestions(businessType, businessName, valueProposition);

    // Return the generated questions
    return new Response(
      JSON.stringify({ questions }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    // Handle errors
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});