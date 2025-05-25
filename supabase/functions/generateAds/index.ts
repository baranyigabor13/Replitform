// Supabase Edge Function to generate Facebook ads based on form answers
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

// Generate ads based on form answers
const generateDefaultAds = (businessName: string, allAnswers: Record<string, any>) => {
  // In a real implementation, this would use Gemini AI to generate personalized ads
  // based on all the form answers
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

    // Generate ads based on all answers
    const ads = generateDefaultAds(allAnswers.businessName, allAnswers);

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