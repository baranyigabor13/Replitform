# Facebook Ad Generator - Supabase Serverless Implementation

This application uses Supabase for serverless backend functionality. Below are instructions for setting up the Supabase environment and deploying the edge functions.

## Prerequisites

1. A Supabase account (free tier is sufficient)
2. Supabase CLI installed on your development machine

## Setup Instructions

### 1. Database Setup

Execute the SQL script in `migrations/20230101000000_ad_generator_schema.sql` in your Supabase project SQL Editor to create the necessary tables and policies.

### 2. Edge Functions Deployment

The application uses two Edge Functions:

- `generateQuestions`: Generates dynamic form questions based on initial user input
- `generateAds`: Generates Facebook ad content based on all form answers

To deploy these functions:

```bash
# Login to Supabase CLI
supabase login

# Link your project (replace 'your-project-ref' with your actual project reference)
supabase link --project-ref your-project-ref

# Deploy all functions
supabase functions deploy

# Or deploy individual functions
supabase functions deploy generateQuestions
supabase functions deploy generateAds
```

### 3. Environment Variables

Make sure to set the following environment variables in your deployment environment:

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous API key
- `DATABASE_URL`: Your Supabase connection string

### 4. Integrating with Gemini AI (Future Enhancement)

To enable AI-powered ad generation, you would need to:

1. Create a Google Cloud project and enable the Gemini API
2. Add your Gemini API key to Supabase secrets:
```bash
supabase secrets set GEMINI_API_KEY=your-api-key
```
3. Update the Edge Functions to use the Gemini API for generating questions and ad content

## Local Development

For local development, you can run:

```bash
supabase start
supabase functions serve
```

This will start a local Supabase instance and serve your Edge Functions locally.