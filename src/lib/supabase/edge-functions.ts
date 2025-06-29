import { supabase } from '../supabase';

/**
 * Helper library for interacting with Supabase Edge Functions
 * Handles proper error handling and parameter validation
 */

// Call a Supabase Edge Function with parameters
export const callEdgeFunction = async <T = any>(
  functionName: string, 
  params?: any, 
  options?: {
    headers?: Record<string, string>;
    noAuth?: boolean;
  }
): Promise<T> => {
  try {
    // Validate function name
    if (!functionName || typeof functionName !== 'string') {
      throw new Error('Invalid function name');
    }

    // Headers to include
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options?.headers || {})
    };

    // Call the Edge Function
    const { data, error } = await supabase.functions.invoke<T>(
      functionName, 
      {
        body: params || {},
        headers
      }
    );

    if (error) {
      console.error(`Edge function "${functionName}" error:`, error);
      throw new Error(error.message || `Error calling ${functionName}`);
    }

    if (data === null && !options?.noAuth) {
      throw new Error('Authentication required');
    }

    return data as T;
  } catch (err: any) {
    console.error(`Failed to call edge function "${functionName}":`, err);
    throw new Error(`Edge function error: ${err.message}`);
  }
};

// Get environment variables securely through Edge Functions
export const getEnvVariable = async (key: string): Promise<string | null> => {
  try {
    const result = await callEdgeFunction<{value: string | null}>('get-env-var', { key });
    return result?.value || null;
  } catch (err) {
    console.warn(`Could not retrieve environment variable ${key}:`, err);
    return null;
  }
};

// Specific function to get API keys securely
export const getApiKey = async (keyName: string): Promise<string | null> => {
  return await getEnvVariable(keyName);
};