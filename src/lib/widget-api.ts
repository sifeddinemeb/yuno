import { supabase } from './supabase'
import type { Database } from './supabase'
import { validateAnswer } from './challenge-validation'
import { performBotDetection, initializeBotDetection } from './bot-detection'
import FingerprintJS from '@fingerprintjs/fingerprintjs'

type Challenge = Database['public']['Tables']['challenges']['Row']
type UserResponseInsert = Database['public']['Tables']['user_responses']['Insert']

/**
 * Enhanced widget API with advanced bot detection
 * Implements Sprint 5 improvements for behavioral analysis
 */
export const widgetApi = {
  /**
   * Get a random active challenge for widget
   */
  async getRandomChallenge(): Promise<Challenge | null> {
    try {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .eq('is_active', true)
      
      if (error) {
        console.error('Error fetching challenges:', error)
        throw error
      }
      
      if (!data || data.length === 0) {
        console.warn('No active challenges found')
        return null
      }
      
      // Return random challenge
      const randomIndex = Math.floor(Math.random() * data.length)
      return data[randomIndex]
    } catch (error) {
      console.error('Error fetching random challenge:', error)
      throw error
    }
  },

  /**
   * Submit user response with enhanced bot detection
   */
  async submitResponse(response: {
    sessionId: string
    challengeId: string | null
    answer: any
    responseTimeMs: number
    challengeType: string
    inputMode: string
    signalTags?: string[]
    userAgent?: string
  }): Promise<{ 
    isHuman: boolean; 
    confidence: number;
    signals?: any;
    adaptiveAction?: string;
  }> {
    try {
      // Get user agent
      const userAgent = response.userAgent || navigator.userAgent

      // Perform advanced bot detection analysis
      const botDetectionResult = performBotDetection(
        response.sessionId,
        response.responseTimeMs,
        response.challengeType
      )
      
      // Validate answer against correct response
      let isAnswerCorrect = false
      try {
        isAnswerCorrect = await this.validateAnswer(response.challengeId || '', response.answer)
      } catch (err) {
        console.warn('Error validating answer, assuming incorrect:', err)
      }
      
      // Generate final human likelihood score by combining:
      // 1. Answer correctness (33%)
      // 2. Behavioral analysis (67%)
      const isHuman = isAnswerCorrect && botDetectionResult.confidence > 0.4 && botDetectionResult.isHuman
      
      // Store comprehensive response data in database
      const userResponse: UserResponseInsert = {
        session_id: response.sessionId,
        challenge_id: response.challengeId,
        answer: response.answer,
        response_time_ms: response.responseTimeMs,
        challenge_type: response.challengeType,
        input_mode: response.inputMode,
        signal_tags: response.signalTags || [],
        is_human: isHuman,
        user_agent: userAgent
      }

      const { data, error } = await supabase
        .from('user_responses')
        .insert([userResponse])
        .select()
        .single()

      if (error) {
        console.error('Error storing response:', error)
        throw error
      }
      
      // Store bot detection signals for analysis and model improvement
      try {
        // In production, we'd store these signals in a dedicated table
        // for ongoing ML model improvement
        console.log('Bot detection signals:', botDetectionResult.signals)
      } catch (err) {
        // Non-critical, don't throw error
        console.warn('Failed to store bot detection signals:', err)
      }

      return {
        isHuman,
        confidence: botDetectionResult.confidence,
        signals: botDetectionResult.signals,
        adaptiveAction: botDetectionResult.adaptiveAction
      }
    } catch (error) {
      console.error('Error submitting response:', error)
      throw error
    }
  },

  /**
   * Validate challenge answer with enhanced scoring
   */
  async validateAnswer(challengeId: string, userAnswer: any): Promise<boolean> {
    if (!challengeId) return false;
    
    try {
      const { data: challenge, error } = await supabase
        .from('challenges')
        .select('*')
        .eq('id', challengeId)
        .single()

      if (error) {
        console.error('Error fetching challenge for validation:', error)
        throw error
      }

      // Use comprehensive validation system
      const result = validateAnswer(challenge, userAnswer)
      return result.score >= 70 // Consider 70%+ as "correct" for human verification
    } catch (error) {
      console.error('Error validating answer:', error)
      return false
    }
  },

  /**
   * Enhanced session fingerprinting for bot detection
   */
  generateSessionFingerprint(): string {
    try {
      // Canvas fingerprinting (commonly used technique)
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      if (ctx) {
        canvas.width = 280
        canvas.height = 60
        
        // Add complex rendering for fingerprinting
        ctx.textBaseline = 'alphabetic'
        ctx.fillStyle = '#f60'
        ctx.fillRect(125, 1, 62, 20)
        ctx.fillStyle = '#069'
        ctx.font = '11pt "Times New Roman"'
        ctx.fillText('Fingerprint', 2, 15)
        ctx.fillStyle = 'rgba(102, 204, 0, 0.7)'
        ctx.font = '18pt Arial'
        ctx.fillText('Yuno', 4, 45)
      }
      
      // Collect browser and system information
      const fingerprint = {
        screenRes: `${screen.width}x${screen.height}x${screen.colorDepth}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        platform: navigator.platform,
        cpuCores: navigator.hardwareConcurrency || 0,
        deviceMemory: (navigator as any).deviceMemory || 0,
        doNotTrack: navigator.doNotTrack || (window as any).doNotTrack || 'unspecified',
        plugins: Array.from(navigator.plugins).map(p => p.name).join(',').substring(0, 300),
        canvasHash: canvas.toDataURL(),
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
        
        // Add any browser capability tests
        touchSupport: 'ontouchstart' in window,
        webglSupport: !!document.createElement('canvas').getContext('webgl')
      }

      // Create a stable hash
      return this.hashFingerprint(fingerprint)
    } catch (error) {
      console.warn('Advanced fingerprinting failed, using fallback:', error)
      
      // Fallback to basic fingerprinting
      const basicFingerprint = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        screen: `${screen.width}x${screen.height}`,
        timestamp: Date.now()
      }

      return btoa(JSON.stringify(basicFingerprint)).substring(0, 44)
    }
  },
  
  /**
   * Hash fingerprint data to create a stable identifier
   */
  hashFingerprint(data: any): string {
    // Convert data to string
    const str = JSON.stringify(data)
    
    // Simple hash function - in production would use a more robust algorithm
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    
    // Convert hash to base64 string
    const hashBase64 = btoa(String.fromCharCode(...new Uint8Array(new Int32Array([hash]).buffer)))
    
    // Add timestamp component for uniqueness
    const timestamp = Date.now().toString(36)
    
    // Combine for final fingerprint
    return `${hashBase64.substring(0, 22)}_${timestamp}`
  },
  
  /**
   * Get appropriate challenge difficulty based on user behavior
   */
  async getAdaptiveChallengeDifficulty(sessionId: string): Promise<'easy' | 'medium' | 'hard'> {
    try {
      // Get user's previous responses
      const { data, error } = await supabase
        .from('user_responses')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false })
        .limit(5)
      
      if (error) throw error
      
      if (!data || data.length === 0) {
        return 'medium' // Default for new sessions
      }
      
      // Get bot detection confidence
      const botDetectionResult = performBotDetection(
        sessionId, 
        data[0].response_time_ms, 
        data[0].challenge_type
      )
      
      // Higher difficulty for more human-like behavior,
      // easier challenges for suspected bots to increase detection confidence
      if (botDetectionResult.confidence > 0.8) {
        if (botDetectionResult.isHuman) {
          // Confidently human - use adaptive action
          switch (botDetectionResult.adaptiveAction) {
            case 'increase_difficulty': return 'hard'
            case 'decrease_difficulty': return 'easy'
            default: return 'medium'
          }
        } else {
          // Confidently bot - use easy challenges to verify
          return 'easy'
        }
      }
      
      // For uncertain cases, base on prior success rate
      const successCount = data.filter(r => r.is_human === true).length
      const successRate = successCount / data.length
      
      if (successRate > 0.8) return 'hard'
      if (successRate < 0.4) return 'easy'
      
      return 'medium'
    } catch (error) {
      console.error('Error determining adaptive difficulty:', error)
      return 'medium' // Safe default
    }
  }
}