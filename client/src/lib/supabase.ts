import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.');
}

// Create Supabase client with custom options for edge function support
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
  global: {
    // Increase timeout for edge functions that may take longer to respond due to AI processing
    fetch: (url, options) => {
      const controller = new AbortController();
      const timeout = setTimeout(() => {
        controller.abort();
      }, 60000); // 60 second timeout for AI-powered edge functions
      
      return fetch(url, {
        ...options,
        signal: controller.signal,
      }).finally(() => {
        clearTimeout(timeout);
      });
    },
  },
});