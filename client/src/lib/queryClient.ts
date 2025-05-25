import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { supabase } from "./supabase";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// This function remains for compatibility with existing components
// But for new features, we'll directly use Supabase client
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // For serverless deployment, we'll simulate responses
  if (url.startsWith('/api')) {
    // Create a synthetic response using the Response constructor
    const mockResponse = {
      status: 200,
      ok: true,
      json: async () => {
        // Handle different API endpoints
        if (url === '/api/generate-questions' && data) {
          const typedData = data as any;
          const { businessType, businessName, valueProposition } = typedData;
          
          // Call our local service instead
          const { generateQuestions } = await import('../services/apiService');
          const result = await generateQuestions(businessType, businessName, valueProposition);
          return result;
        }
        
        if (url === '/api/generate-ads' && data) {
          const typedData = data as any;
          const { allAnswers } = typedData;
          
          // Call our local service instead
          const { generateAds } = await import('../services/apiService');
          const result = await generateAds(allAnswers);
          return result;
        }
        
        return { message: "Endpoint not found" };
      }
    };
    
    return new Response(null, mockResponse);
  }

  // For actual external API calls
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Handle Supabase queries if the query key starts with 'supabase:'
    if (typeof queryKey[0] === 'string' && queryKey[0].startsWith('supabase:')) {
      const [_, table, method] = queryKey[0].split(':');
      
      if (table && method === 'list') {
        const { data, error } = await supabase.from(table).select('*');
        
        if (error) {
          throw new Error(error.message);
        }
        
        return data;
      }
      
      if (table && method === 'get' && queryKey[1]) {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .eq('id', queryKey[1]);
          
        if (error) {
          throw new Error(error.message);
        }
        
        return data[0] || null;
      }
    }
    
    // Fall back to regular fetch for other queries
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
