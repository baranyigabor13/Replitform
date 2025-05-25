// Supabase Edge Function to generate Facebook ads based on form answers using Gemini AI

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

// Function to call Gemini API and generate ads
async function generateAdsWithGemini(allAnswers: Record<string, any>) {
  // If no API key is available, return default ads
  if (!GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY not found in environment variables");
    return getFallbackAds(allAnswers.businessName);
  }

  const businessName = allAnswers.businessName;
  const businessType = allAnswers.businessType;
  const valueProposition = allAnswers.valueProposition;
  
  try {
    // Convert all form answers to a string for the prompt
    const formAnswersText = Object.entries(allAnswers)
      .map(([key, value]) => {
        // Handle different types of values
        if (typeof value === 'object' && value !== null) {
          return `${key}: ${JSON.stringify(value)}`;
        }
        return `${key}: ${value}`;
      })
      .join('\n');

    // Create a prompt for Gemini to generate personalized Facebook ads
    const prompt = `
      Generate 3 Facebook ads for ${businessName} based on the following information:
      
      FORM DATA:
      ${formAnswersText}
      
      Create three different ads with these specifications:
      1. A professional, concise ad with formal tone
      2. A casual, conversational ad with emojis
      3. An urgent, promotional ad with a time-limited offer
      
      Format the response as a JSON array with the following structure for each ad:
      [
        {
          "headline": "The ad headline",
          "content": "The main ad text content",
          "tone": "professional", // must be one of: "professional", "casual", or "urgent"
          "length": "short", // must be one of: "short", "medium", or "long"
          "tags": ["tag1", "tag2"], // relevant keywords for the ad
          "emojiCount": 0 // number of emojis used in the ad
        },
        // more ads...
      ]
      
      The ads should:
      - Be highly targeted to the business type (${businessType})
      - Clearly communicate the value proposition (${valueProposition})
      - Include appropriate calls to action
      - Have varying lengths and styles
      - Use Facebook-appropriate language and formatting
      - Include relevant hashtags as tags
      
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
      const generatedAds = JSON.parse(cleanedText);
      
      // Validate the ads format
      if (!Array.isArray(generatedAds)) {
        throw new Error("Generated ads is not an array");
      }
      
      // Process and validate each ad
      return generatedAds.map(ad => {
        // Ensure all required fields are present
        if (!ad.headline || !ad.content || !ad.tone || !ad.length) {
          throw new Error("Ad missing required fields");
        }
        
        // Ensure tone is valid
        if (!["professional", "casual", "urgent"].includes(ad.tone)) {
          ad.tone = "professional"; // Default to professional if invalid tone
        }
        
        // Ensure length is valid
        if (!["short", "medium", "long"].includes(ad.length)) {
          ad.length = "medium"; // Default to medium if invalid length
        }
        
        // Ensure tags is an array
        if (!Array.isArray(ad.tags)) {
          ad.tags = ["marketing", "business"]; // Default tags
        }
        
        // Ensure emojiCount is a number
        if (typeof ad.emojiCount !== 'number') {
          // Count actual emojis in the content
          const emojiRegex = /[\p{Emoji}]/gu;
          const matches = ad.content.match(emojiRegex) || [];
          ad.emojiCount = matches.length;
        }
        
        return ad;
      });
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError);
      console.log("Raw response:", generatedText);
      throw new Error("Failed to parse ads from Gemini");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return getFallbackAds(businessName);
  }
}

// Fallback ads if Gemini API fails
function getFallbackAds(businessName: string) {
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
}

// Main function to handle requests
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Parse the request body
    const { allAnswers } = await req.json();
    
    // Input validation
    if (!allAnswers || !allAnswers.businessName) {
      return new Response(
        JSON.stringify({ error: "Missing required information" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Generate ads using Gemini AI
    const ads = await generateAdsWithGemini(allAnswers);

    // Return the generated ads
    return new Response(
      JSON.stringify({ ads }),
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