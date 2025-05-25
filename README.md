# Futuristic Facebook Ad Generator

A serverless application for generating Facebook ads using React, Tailwind CSS, and Supabase.

## Features

- Interactive multi-step form with dynamic questions
- AI-assisted ad generation (using Supabase Edge Functions with Gemini AI)
- Futuristic UI with glassmorphism, neon effects, and particle animations
- Complete serverless architecture using Supabase

## Deployment Instructions

### 1. Prerequisites

- Supabase account
- Vercel account for deployment

### 2. Setup Supabase

1. Create a new Supabase project
2. Run the SQL migrations in `supabase/migrations` to set up the database schema
3. Deploy the Edge Functions from `supabase/functions`

### 3. Setup Environment Variables

In your Vercel project, set the following environment variables:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous API key

### 4. Deploy to Vercel

Connect your repository to Vercel and deploy.

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Technologies Used

- React + TypeScript
- Tailwind CSS + shadcn/ui
- Framer Motion for animations
- Supabase for database and serverless functions
- React Query for data fetching
- Zustand for state management