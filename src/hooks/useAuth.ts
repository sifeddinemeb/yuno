import { useEffect, useState, useRef } from 'react';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { User } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { useStore } from '../store/useStore'

export interface AdminUser {
  id: string
  email: string
  name: string
  role: string
}

// Global state to prevent multiple simultaneous initializations
interface GlobalInitState {
  isInitializing: boolean;
  isInitialized: boolean;
  lastInitTime: number;
  cachedAdmin?: AdminUser | null;
}

let globalInitState: GlobalInitState = {
  isInitializing: false,
  isInitialized: false,
  lastInitTime: 0,
  cachedAdmin: null,
}

// Prevent noisy console spam when many components mount
let lastSkipLog = 0; // timestamp of last "skip" log

export const useAuth = () => {
  // If Supabase env vars are missing, short-circuit and expose an error state
  if (!isSupabaseConfigured) {
    return {
      user: null,
      adminUser: null,
      loading: false,
      envError: true,
      signIn: async () => ({ success: false, error: 'Supabase not configured' }),
      signUp: async () => ({ success: false, error: 'Supabase not configured' }),
      signOut: async () => {},
    } as const;
  }
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  // authReady means auth process finished (either logged out or admin loaded)
  const authReady = !loading && (!user || !!adminUser);
  const { setAuthenticated } = useStore()
  
  const mountedRef = useRef(true)
  const hasInitializedRef = useRef(false)
  const authListenerRef = useRef<any>(null)

  useEffect(() => {
    mountedRef.current = true
    
    // Prevent multiple initializations globally
    const now = Date.now()
    if (globalInitState.isInitializing || (globalInitState.isInitialized && (now - globalInitState.lastInitTime) < 5000)) {
      // Throttle logs to once per second to avoid flooding the console
      if (Date.now() - lastSkipLog > 1000) {
        console.log('Auth initialization skipped - already in progress or recently completed');
        lastSkipLog = Date.now();
      }
      if (loading) {
        // Only update state if necessary to avoid extra rerenders
        setLoading(false);
      }
      return;
    }

    // Prevent multiple initializations per component instance
    if (hasInitializedRef.current) {
      console.log('Auth already initialized for this component instance')
      setLoading(false)
      return
    }

    hasInitializedRef.current = true
    globalInitState.isInitializing = true
    globalInitState.lastInitTime = now

    console.log('Starting auth initialization...')

    const initializeAuth = async () => {
      try {
        // Set maximum timeout to prevent hanging
        const timeoutId = setTimeout(() => {
          console.warn('Auth initialization timeout')
          if (mountedRef.current) {
            setLoading(false)
            globalInitState.isInitializing = false
          }
        }, 8000)

        // Get initial session with timeout
        const sessionPromise = supabase.auth.getSession()
        const sessionResult = await Promise.race([
          sessionPromise,
          new Promise<any>((_, reject) => 
            setTimeout(() => reject(new Error('Session fetch timeout')), 5000)
          )
        ])

        clearTimeout(timeoutId)

        const { data: { session }, error } = sessionResult

        if (error) {
          console.error('Session error:', error)
          if (mountedRef.current) {
            setLoading(false)
            globalInitState.isInitializing = false
          }
          return
        }

        if (session?.user && mountedRef.current) {
          console.log('Found existing session for:', session.user.email)
          setUser(session.user)

          if (globalInitState.cachedAdmin && globalInitState.cachedAdmin.id === session.user.id) {
            console.log('Using cached admin user')
            setAdminUser(globalInitState.cachedAdmin)
            const store = useStore.getState()
            store.setAuthenticated(true, globalInitState.cachedAdmin)
            setLoading(false)
            globalInitState.isInitializing = false
            globalInitState.isInitialized = true
          } else {
            await validateAdminUser(session.user)
          }
        } else if (mountedRef.current) {
          console.log('No existing session found')
          setLoading(false)
          globalInitState.isInitializing = false
          globalInitState.isInitialized = true
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        if (mountedRef.current) {
          setLoading(false)
          globalInitState.isInitializing = false
        }
      }
    }

    // Set up auth state listener (only once)
    if (!authListenerRef.current) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event: AuthChangeEvent, session: Session | null) => {
          if (!mountedRef.current) return

          console.log('Auth state change:', event, session?.user?.email)

          // Ignore silent refresh/update events to avoid triggering the loading spinner loop
          if (event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
            return;
          }
          
          try {
            if (event === 'SIGNED_IN' && session?.user) {
              setUser(session.user)
              await validateAdminUser(session.user)
            } else if (event === 'SIGNED_OUT') {
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

      authListenerRef.current = subscription
    }

    // Start initialization
    initializeAuth()

    // Cleanup function
    return () => {
      console.log('Cleaning up auth hook')
      mountedRef.current = false
      
      if (authListenerRef.current) {
        authListenerRef.current.unsubscribe()
        authListenerRef.current = null
      }
    }
  }, []) // Remove all dependencies to prevent re-initialization

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
          globalInitState.isInitializing = false
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
        // Cache globally to reuse across mounts
        globalInitState.cachedAdmin = admin
        // Use store setter directly to avoid dependency issues
        const store = useStore.getState()
        store.setAuthenticated(true, admin)
      }
      
      if (mountedRef.current) {
        setLoading(false)
        globalInitState.isInitializing = false
        globalInitState.isInitialized = true
      }
    } catch (error) {
      console.error('Error validating admin user:', error)
      if (mountedRef.current) {
        setLoading(false)
        globalInitState.isInitializing = false
      }
    }
  }

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

  const signUp = async (email: string, password: string, _name: string) => {
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
      
      // Use store setter directly
      const store = useStore.getState()
      store.setAuthenticated(false)
      
      // Reset global state
      globalInitState.isInitialized = false
      globalInitState.isInitializing = false
      
      console.log('Sign out successful')
    } catch (error: any) {
      console.error('Error signing out:', error)
    }
  }

  return {
    user,
    adminUser,
    loading,
    authReady,
    signIn,
    signUp,
    signOut
  }
}