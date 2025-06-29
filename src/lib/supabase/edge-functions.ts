import { supabase } from '../supabase';

/**
 * Calls a Supabase Edge Function with proper error handling
 */
export const callEdgeFunction = async (functionName: string, payload: any): Promise<any> => {
  try {
    const { data, error } = await supabase.functions.invoke(functionName, {
      body: JSON.stringify(payload),
    });

    if (error) {
      // Handle different types of errors appropriately
      if (error.message?.includes('404') || error.message?.includes('not found')) {
        console.warn(`Edge function ${functionName} returned 404:`, error.message);
        return null; // Return null for 404s instead of throwing
      }
      
      if (error.message?.includes('403') || error.message?.includes('Unauthorized')) {
        console.warn(`Edge function ${functionName} returned 403:`, error.message);
        return null; // Return null for unauthorized access
      }

      console.error(`Edge function ${functionName} error:`, error);
      throw new Error(`Edge Function returned a non-2xx status code`);
    }

    return data;
  } catch (error: any) {
    console.error(`Failed to call edge function "${functionName}":`, error);
    
    // Check if it's a network error or specific HTTP status
    if (error.message?.includes('404') || error.message?.includes('not found')) {
      console.warn(`Environment variable not found in edge function ${functionName}`);
      return null; // Return null for missing env vars instead of throwing
    }
    
    throw new Error(`Edge Function returned a non-2xx status code`);
  }
};

/**
 * Gets an environment variable from the edge function
 */
export const getEnvVariable = async (key: string): Promise<{ key: string; value: string } | null> => {
  try {
    const response = await callEdgeFunction('get-env-var', { key });
    
    // If response is null (404/403), return null gracefully
    if (!response) {
      console.warn(`Environment variable ${key} not available`);
      return null;
    }
    
    return response;
  } catch (error) {
    console.warn(`Failed to get environment variable ${key}:`, error);
    return null; // Return null instead of re-throwing
  }
};

/**
 * Gets an API key with proper fallback handling
 */
export const getApiKey = async (keyName: string): Promise<string | null> => {
  try {
    const result = await getEnvVariable(keyName);
    return result?.value || null;
  } catch (error) {
    console.warn(`Error getting API key ${keyName}:`, error);
    return null;
  }
};