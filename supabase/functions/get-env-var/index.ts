// Supabase Edge Function to securely access environment variables
// This function allows the frontend to access server-side environment variables

import { serve } from "https://deno.land/std@0.170.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { key } = await req.json()
    
    // List of environment variables that can be exposed to the client
    const allowedKeys = [ 
      'GEMINI_API_KEY',
      'OPENAI_API_KEY' // Add other allowed keys as needed
    ]
    
    if (!allowedKeys.includes(key)) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized environment variable access' }),
        { 
          status: 403, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            // Add security headers
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block'
          } 
        }
      )
    }

    // Get the environment variable
    const value = Deno.env.get(key)
    
    if (!value) {
      return new Response(
        JSON.stringify({ error: `Environment variable ${key} not found` }),
        { 
          status: 404, 
          headers: { 
            ...corsHeaders,
            // Add security headers 
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block',
            'Content-Type': 'application/json' 
          } 
        }
      )
    }

    return new Response(
      JSON.stringify({ key, value }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
          // Add security headers
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block'
        } 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: 'Invalid request format',
        details: error.message 
      }),
      { 
        status: 400, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block'
        } 
      }
    )
  }
})