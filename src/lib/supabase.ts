import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing')
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'Missing')
  throw new Error('Missing Supabase environment variables')
}

console.log('Initializing Supabase client...')
console.log('URL:', supabaseUrl)

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'yuno-frontend'
    }
  }
})

// Test connection
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('Supabase connection test failed:', error)
  } else {
    console.log('Supabase connection successful')
  }
}).catch(err => {
  console.error('Supabase connection error:', err)
})

// Database types for TypeScript
export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: string
          name: string
          role: string
          preferences: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          role?: string
          preferences?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          role?: string
          preferences?: any
          updated_at?: string
        }
      }
      challenges: {
        Row: {
          id: string
          type: string
          title: string
          description: string
          content: any
          correct_answer: any
          signal_tags: string[]
          input_mode: string
          difficulty: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          type: string
          title: string
          description: string
          content: any
          correct_answer: any
          signal_tags?: string[]
          input_mode: string
          difficulty: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          type?: string
          title?: string
          description?: string
          content?: any
          correct_answer?: any
          signal_tags?: string[]
          input_mode?: string
          difficulty?: string
          is_active?: boolean
          updated_at?: string
        }
      }
      api_keys: {
        Row: {
          id: string
          client_name: string
          api_key: string
          status: string
          permissions: any
          usage_metrics: any
          created_at: string
          last_used_at: string | null
          created_by: string
        }
        Insert: {
          id?: string
          client_name: string
          api_key: string
          status?: string
          permissions?: any
          usage_metrics?: any
          created_at?: string
          last_used_at?: string | null
          created_by: string
        }
        Update: {
          id?: string
          client_name?: string
          api_key?: string
          status?: string
          permissions?: any
          usage_metrics?: any
          last_used_at?: string | null
          created_by?: string
        }
      }
      user_responses: {
        Row: {
          id: string
          session_id: string
          challenge_id: string
          answer: any
          response_time_ms: number
          challenge_type: string
          input_mode: string
          signal_tags: string[]
          is_human: boolean | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          challenge_id: string
          answer: any
          response_time_ms: number
          challenge_type: string
          input_mode: string
          signal_tags?: string[]
          is_human?: boolean | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          challenge_id?: string
          answer?: any
          response_time_ms?: number
          challenge_type?: string
          input_mode?: string
          signal_tags?: string[]
          is_human?: boolean | null
          ip_address?: string | null
          user_agent?: string | null
        }
      }
    }
    Views: {
      challenge_performance_view: {
        Row: {
          id: string
          type: string
          title: string
          difficulty: string
          total_attempts: number
          human_attempts: number
          bot_attempts: number
          avg_response_time: number
          human_pass_rate: number
        }
      }
      daily_metrics_view: {
        Row: {
          date: string
          total_attempts: number
          human_verifications: number
          bot_detections: number
          avg_response_time: number
          human_pass_rate: number
        }
      }
    }
  }
}