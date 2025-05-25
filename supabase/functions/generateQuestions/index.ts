// Supabase Edge Function to generate questions based on initial form data using Gemini AI

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

// Access Gemini API key from environment variables
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

// Function to call Gemini API and generate dynamic questions
async function generateQuestionsWithGemini(
  businessType: string,
  businessName: string,
  valueProposition: string
) {
  // If no API key is available, return default questions
  if (!GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY not found in environment variables");
    return getFallbackQuestions();
  }

  try {
    // Create a prompt for Gemini to generate personalized form questions
    const prompt = `
      Create an array of 4-6 personalized questions for a Facebook ad campaign generator based on the following information:
      
      Business Type: ${businessType}
      Business Name: ${businessName}
      Value Proposition: ${valueProposition}
      
      The questions should help gather specific information to create targeted Facebook ads.
      Format the response as a JSON array with the following structure for each question:
      [
        {
          "id": "uniqueId", // a unique string ID for the question (e.g., "targetAudience", "messageTone")
          "text": "The question text", // clear, conversational question text
          "type": "questionType", // must be one of: "radio", "checkbox", "slider", or "text"
          "color": "colorName", // must be one of: "blue", "purple", or "green"
          "required": true, // boolean indicating if the question is required
          // For radio or checkbox questions, include these options:
          "options": [
            {
              "value": "option1", // unique value for this option
              "label": "Option 1", // display label
              "description": "Description of option 1" // short explanation
            },
            // more options...
          ],
          // For slider questions, include these properties:
          "min": 1, // minimum value
          "max": 100, // maximum value
          "defaultValue": 50 // starting value
        }
      ]
      
      Make sure to include different question types and ask about:
      - Target audience specifics relevant to ${businessType}
      - Ad budget considerations
      - Marketing objectives
      - Messaging tone preferences
      - Specific features/benefits to highlight for ${businessName}
      - Any industry-specific questions relevant to ${businessType}
      
      Only return the JSON array with no additional text.
    `;

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to call Gemini API: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Extract the text response from Gemini
    const generatedText = data.candidates[0].content.parts[0].text;
    
    // Parse the JSON response - clean it up first to handle potential formatting issues
    const cleanedText = generatedText.replace(/```json|```/g, '').trim();
    
    try {
      const generatedQuestions = JSON.parse(cleanedText);
      
      // Validate the questions format
      if (!Array.isArray(generatedQuestions)) {
        throw new Error("Generated questions is not an array");
      }
      
      // Process and validate each question
      return generatedQuestions.map(question => {
        // Ensure all required fields are present
        if (!question.id || !question.text || !question.type) {
          throw new Error("Question missing required fields");
        }
        
        // Ensure question type is valid
        if (!["radio", "checkbox", "slider", "text"].includes(question.type)) {
          question.type = "text"; // Default to text if invalid type
        }
        
        // Ensure color is valid
        if (!["blue", "purple", "green"].includes(question.color)) {
          question.color = "blue"; // Default to blue if invalid color
        }
        
        return question;
      });
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError);
      console.log("Raw response:", generatedText);
      throw new Error("Failed to parse questions from Gemini");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return getFallbackQuestions();
  }
}

// Fallback questions if Gemini API fails
function getFallbackQuestions() {
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
}

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

    // Generate questions using Gemini AI
    const questions = await generateQuestionsWithGemini(businessType, businessName, valueProposition);

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