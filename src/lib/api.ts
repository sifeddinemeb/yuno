import { supabase } from './supabase'
import type { Database } from './supabase'

type Challenge = Database['public']['Tables']['challenges']['Row']
type ChallengeInsert = Database['public']['Tables']['challenges']['Insert']
type ChallengeUpdate = Database['public']['Tables']['challenges']['Update']

type ApiKey = Database['public']['Tables']['api_keys']['Row']
type ApiKeyInsert = Database['public']['Tables']['api_keys']['Insert']
type ApiKeyUpdate = Database['public']['Tables']['api_keys']['Update']

type UserResponse = Database['public']['Tables']['user_responses']['Insert']

// Challenge API functions
export const challengeApi = {
  // Get all challenges
  async getAll() {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Get active challenges
  async getActive() {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Get challenge by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Create new challenge
  async create(challenge: ChallengeInsert) {
    const { data, error } = await supabase
      .from('challenges')
      .insert([challenge])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Update challenge
  async update(id: string, updates: ChallengeUpdate) {
    const { data, error } = await supabase
      .from('challenges')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Delete challenge
  async delete(id: string) {
    const { error } = await supabase
      .from('challenges')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Get random active challenge
  async getRandom() {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('is_active', true)
    
    if (error) throw error
    if (!data || data.length === 0) return null
    
    const randomIndex = Math.floor(Math.random() * data.length)
    return data[randomIndex]
  }
}

// API Keys API functions
export const apiKeyApi = {
  // Get all API keys
  async getAll() {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Create new API key
  async create(apiKey: Omit<ApiKeyInsert, 'api_key'>) {
    // Generate API key
    const generatedKey = `yuno_live_sk_${crypto.randomUUID().replace(/-/g, '')}`
    
    const { data, error } = await supabase
      .from('api_keys')
      .insert([{ ...apiKey, api_key: generatedKey }])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Update API key
  async update(id: string, updates: ApiKeyUpdate) {
    const { data, error } = await supabase
      .from('api_keys')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Delete API key
  async delete(id: string) {
    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Update last used timestamp
  async updateLastUsed(apiKey: string) {
    const { error } = await supabase
      .from('api_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('api_key', apiKey)
    
    if (error) throw error
  }
}

// User Responses API functions
export const responseApi = {
  // Submit user response
  async submit(response: UserResponse) {
    const { data, error } = await supabase
      .from('user_responses')
      .insert([response])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Get responses for analytics
  async getForAnalytics(limit = 1000) {
    const { data, error } = await supabase
      .from('user_responses')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data
  },

  // Get responses by session
  async getBySession(sessionId: string) {
    const { data, error } = await supabase
      .from('user_responses')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }
}

// Analytics API functions
export const analyticsApi = {
  // Get challenge performance metrics
  async getChallengePerformance() {
    const { data, error } = await supabase
      .from('challenge_performance_view')
      .select('*')
    
    if (error) throw error
    return data
  },

  // Get daily metrics
  async getDailyMetrics() {
    const { data, error } = await supabase
      .from('daily_metrics_view')
      .select('*')
      .limit(30)
    
    if (error) throw error
    return data
  },

  // Get real-time dashboard metrics
  async getDashboardMetrics() {
    // Get total attempts today
    const today = new Date().toISOString().split('T')[0]
    
    const { data: todayResponses, error: todayError } = await supabase
      .from('user_responses')
      .select('*')
      .gte('created_at', `${today}T00:00:00.000Z`)
    
    if (todayError) throw todayError

    // Get active challenges count
    const { data: activeChallenges, error: challengesError } = await supabase
      .from('challenges')
      .select('id')
      .eq('is_active', true)
    
    if (challengesError) throw challengesError

    // Get active API keys count
    const { data: activeApiKeys, error: apiKeysError } = await supabase
      .from('api_keys')
      .select('id')
      .eq('status', 'active')
    
    if (apiKeysError) throw apiKeysError

    // Calculate metrics
    const totalAttempts = todayResponses?.length || 0
    const humanAttempts = todayResponses?.filter(r => r.is_human === true).length || 0
    const botAttempts = todayResponses?.filter(r => r.is_human === false).length || 0
    const avgResponseTime = todayResponses?.length 
      ? todayResponses.reduce((sum, r) => sum + r.response_time_ms, 0) / todayResponses.length / 1000
      : 0
    const humanPassRate = totalAttempts > 0 ? (humanAttempts / totalAttempts) * 100 : 0
    const botDetectionRate = totalAttempts > 0 ? (botAttempts / totalAttempts) * 100 : 0

    return {
      totalAttempts,
      humanPassRate: Math.round(humanPassRate * 10) / 10,
      botDetectionRate: Math.round(botDetectionRate * 10) / 10,
      avgResponseTime: Math.round(avgResponseTime * 10) / 10,
      activeChallenges: activeChallenges?.length || 0,
      activeIntegrations: activeApiKeys?.length || 0
    }
  },

  // Get session analytics
  async getSessionMetrics(sessionId: string) {
    const { data, error } = await supabase
      .from('user_responses')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
    
    if (error) throw error

    if (!data || data.length === 0) {
      return {
        totalAttempts: 0,
        averageResponseTime: 0,
        humanConfidence: 0,
        challengeTypes: []
      }
    }

    const totalAttempts = data.length
    const averageResponseTime = data.reduce((sum, r) => sum + r.response_time_ms, 0) / totalAttempts
    const humanResponses = data.filter(r => r.is_human === true).length
    const humanConfidence = (humanResponses / totalAttempts) * 100
    const challengeTypes = [...new Set(data.map(r => r.challenge_type))]

    return {
      totalAttempts,
      averageResponseTime: Math.round(averageResponseTime),
      humanConfidence: Math.round(humanConfidence * 10) / 10,
      challengeTypes
    }
  }
}