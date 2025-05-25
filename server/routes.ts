import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for the ad generator
  app.post("/api/generate-questions", async (req, res) => {
    try {
      const { businessType, businessName, valueProposition } = req.body;
      
      if (!businessType || !businessName || !valueProposition) {
        return res.status(400).json({ 
          message: "Missing required fields" 
        });
      }
      
      // Note: In a real implementation, this would call a Supabase Edge Function
      // that would use Gemini AI to generate questions. For now, we'll return
      // a set of predefined questions based on the business type.
      const questions = getDefaultQuestions(businessType);
      
      res.json({ questions });
    } catch (error) {
      console.error("Error generating questions:", error);
      res.status(500).json({ 
        message: "Failed to generate questions" 
      });
    }
  });
  
  app.post("/api/generate-ads", async (req, res) => {
    try {
      const { allAnswers } = req.body;
      
      if (!allAnswers) {
        return res.status(400).json({ 
          message: "Missing form answers" 
        });
      }
      
      // Note: In a real implementation, this would call a Supabase Edge Function
      // that would use Gemini AI to generate personalized ads. For now, we'll return
      // predefined sample ads.
      const ads = getDefaultAds(allAnswers.businessName || "Your Business");
      
      res.json({ ads });
    } catch (error) {
      console.error("Error generating ads:", error);
      res.status(500).json({ 
        message: "Failed to generate ads" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper functions to provide default responses until Supabase Edge Functions are implemented
function getDefaultQuestions(businessType: string) {
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

function getDefaultAds(businessName: string) {
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
