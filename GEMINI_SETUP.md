# Setting Up Gemini AI Integration

This guide will help you set up the Gemini AI integration for your Facebook Ad Generator application.

## Prerequisites

1. Google Cloud Platform (GCP) account
2. Supabase account with your project set up

## Getting a Gemini API Key

1. Go to the [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key - you'll need it for the next step

## Setting Up Supabase with Gemini

### 1. Add the Gemini API Key to Supabase

```bash
# Install Supabase CLI if you haven't already
npm install -g supabase

# Login to Supabase
supabase login

# Link your project (replace with your project reference)
supabase link --project-ref your-project-ref

# Add the Gemini API key as a secret
supabase secrets set GEMINI_API_KEY=your-gemini-api-key
```

### 2. Deploy the Edge Functions

```bash
# Deploy all functions
supabase functions deploy

# Or deploy individual functions
supabase functions deploy generateQuestions
supabase functions deploy generateAds
```

### 3. Test the Edge Functions

You can test the Edge Functions directly using the Supabase dashboard or with curl:

```bash
curl -X POST 'https://your-project-ref.supabase.co/functions/v1/generateQuestions' \
  -H 'Authorization: Bearer your-anon-key' \
  -H 'Content-Type: application/json' \
  -d '{"businessType": "service", "businessName": "TechSolutions", "valueProposition": "We provide fast and reliable IT support"}'
```

## How It Works

1. When users fill out the initial form, their data is sent to the `generateQuestions` Edge Function
2. Gemini AI analyzes the business type, name, and value proposition to generate personalized questions
3. These questions are displayed in step 2 of the form
4. After users answer all questions, their responses are sent to the `generateAds` Edge Function
5. Gemini AI creates three different Facebook ads tailored to the business and form responses
6. The generated ads are displayed in step 3 of the form

## Customizing the AI Prompts

You can customize how Gemini generates questions and ads by modifying the prompts in:

- `supabase/functions/generateQuestions/index.ts`
- `supabase/functions/generateAds/index.ts`

The prompts are written to instruct Gemini on the format and content needed for your application.

## Troubleshooting

- If you're getting errors about missing the Gemini API key, make sure you've properly set it as a Supabase secret
- If the generated content doesn't match the expected format, check the console logs in your Supabase Edge Functions for details
- Make sure your Supabase project has the right permissions and policies set up to allow function invocations