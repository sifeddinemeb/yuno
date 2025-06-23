import { useEffect, useState, useRef, useCallback } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { useStore } from '../store/useStore'

export interface AdminUser {
  id: string
  email: string
  name: string
  role: string
}

// Singleton pattern for auth state to prevent multiple initializations
const authState = {
  isInitializing: false,
  isInitialized: false,
  lastInitTime: 0,
  authChangeListeners: new Set()
}

export const useAuth = () => {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const { setAuthenticated } = useStore()
  
  const mountedRef = useRef(true)
  const hasInitializedRef = useRef(false)

  // Enhanced initialization function with better error handling
  const initializeAuth = useCallback(async () => {
    // Skip if this instance already initialized or unmounted
    if (hasInitializedRef.current || !mountedRef.current) return
    
    // Skip if global initialization is in progress or was recently completed
    const now = Date.now()
    if (authState.isInitializing || (authState.isInitialized && now - authState.lastInitTime < 3000)) {
      console.log('Auth initialization skipped - already in progress or recently completed')
      setLoading(false)
      return
    }
    
    try {
      console.log('Starting auth initialization...')
      hasInitializedRef.current = true
      authState.isInitializing = true
      
      // Set timeout to prevent hanging
      const timeoutId = setTimeout(() => {
        console.warn('Auth initialization timeout')
        if (mountedRef.current) {
          setLoading(false)
          authState.isInitializing = false
        }
      }, 5000)
      
      // Get initial session
      const { data: { session }, error } = await supabase.auth.getSession()
      
      clearTimeout(timeoutId)
      
      if (error) {
        // Handle refresh token errors as expected scenarios rather than critical errors
        if (error.message && error.message.includes('Invalid Refresh Token')) {
          console.log('Session expired or invalid refresh token - user will need to sign in again')
        } else {
          console.error('Session error:', error)
        }
        
        if (mountedRef.current) {
          setLoading(false)
        }
      } else if (session?.user && mountedRef.current) {
        console.log('Found existing session for:', session.user.email)
        setUser(session.user)
        await validateAdminUser(session.user)
      } else if (mountedRef.current) {
        console.log('No existing session found')
        setLoading(false)
      }
      
      // Setup auth state listener only once globally
      if (!authState.authChangeListeners.size) {
        setupAuthListener()
      }
      
      authState.isInitializing = false
      authState.isInitialized = true
      authState.lastInitTime = Date.now()
      
    } catch (error) {
      console.error('Auth initialization error:', error)
      if (mountedRef.current) {
        setLoading(false)
        authState.isInitializing = false
      }
    }
  }, [setAuthenticated]) // Include setAuthenticated in dependencies

  // Setup auth state listener
  const setupAuthListener = () => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email)
        
        try {
          if (event === 'SIGNED_IN' && session?.user) {
            setUser(session.user)
            await validateAdminUser(session.user)
          } else if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
            setUser(null)
            setAdminUser(null)
            setAuthenticated(false)
            if (mountedRef.current) {
              setLoading(false)
            }
          }
        } catch (error) {
          console.error('Error handling auth state change:', error)
          if (mountedRef.current) {
            setLoading(false)
          }
        }
      }
    )
    
    // Add to global listener set for tracking
    authState.authChangeListeners.add(subscription)
    
    // Return unsubscribe function
    return () => {
      subscription.unsubscribe()
      authState.authChangeListeners.delete(subscription)
    }
  }

  const validateAdminUser = async (user: User) => {
    if (!mountedRef.current) return

    try {
      console.log('Validating admin user:', user.email)
      
      const { data: adminData, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      if (error) {
        console.error('Admin validation error:', error)
        if (mountedRef.current) {
          setLoading(false)
        }
        return
      }

      let finalAdminData = adminData

      // If user doesn't exist, try to create them
      if (!adminData) {
        console.log('Creating admin user record...')
        try {
          const { data: newAdminData, error: createError } = await supabase
            .from('admin_users')
            .insert([{
              id: user.id,
              name: user.email?.split('@')[0] || 'Admin User',
              role: 'admin'
            }])
            .select()
            .maybeSingle()

          if (createError && createError.code === '23505') {
            // User already exists, fetch it
            const { data: existingAdminData } = await supabase
              .from('admin_users')
              .select('*')
              .eq('id', user.id)
              .maybeSingle()
            
            finalAdminData = existingAdminData
          } else if (!createError && newAdminData) {
            finalAdminData = newAdminData
          }
        } catch (createErr) {
          console.error('Error creating admin user:', createErr)
        }
      }

      if (!mountedRef.current) return

      if (finalAdminData) {
        const admin: AdminUser = {
          id: finalAdminData.id,
          email: user.email || '',
          name: finalAdminData.name,
          role: finalAdminData.role
        }

        console.log('Admin user validated:', admin)
        setAdminUser(admin)
        
        // Use store setter directly to avoid dependency issues
        setAuthenticated(true, admin)
      }
      
      if (mountedRef.current) {
        setLoading(false)
      }
    } catch (error) {
      console.error('Error validating admin user:', error)
      if (mountedRef.current) {
        setLoading(false)
      }
    }
  }

  // Setup effect - runs once on component mount
  useEffect(() => {
    // Initialize auth
    initializeAuth()
    
    // Cleanup function
    return () => {
      console.log('Cleaning up auth hook')
      mountedRef.current = false
    }
  }, [initializeAuth]) // Add initializeAuth as a dependency since it's memoized

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in for:', email)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        console.error('Sign in error:', error)
        throw error
      }

      console.log('Sign in successful:', data.user?.email)
      return { success: true, data }
    } catch (error: any) {
      console.error('Sign in failed:', error)
      return { 
        success: false, 
        error: error.message || 'An error occurred during sign in' 
      }
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      console.log('Attempting sign up for:', email)
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })

      if (error) {
        console.error('Sign up error:', error)
        throw error
      }

      console.log('Sign up successful:', data.user?.email)
      return { success: true, data }
    } catch (error: any) {
      console.error('Sign up failed:', error)
      return { 
        success: false, 
        error: error.message || 'An error occurred during sign up' 
      }
    }
  }

  const signOut = async () => {
    try {
      console.log('Signing out...')
      
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      setUser(null)
      setAdminUser(null)
      setAuthenticated(false)
      
      // Reset initialization state for this instance
      hasInitializedRef.current = false
      
      console.log('Sign out successful')
    } catch (error: any) {
      console.error('Error signing out:', error)
    }
  }

  return {
    user,
    adminUser,
    loading,
    signIn,
    signUp,
    signOut
  }
}