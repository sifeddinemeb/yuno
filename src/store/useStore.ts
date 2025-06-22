import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Challenge, UserResponse, ApiKey, AnalyticsData } from '../types';

interface AppState {
  // Theme state
  isDarkMode: boolean;
  
  // Auth state
  isAuthenticated: boolean;
  user: any | null;
  
  // Widget state
  currentChallenge: Challenge | null;
  isLoading: boolean;
  sessionId: string | null;
  
  // Admin state
  challenges: Challenge[];
  responses: UserResponse[];
  apiKeys: ApiKey[];
  analytics: AnalyticsData | null;
  
  // Actions
  toggleDarkMode: () => void;
  setAuthenticated: (isAuth: boolean, user?: any) => void;
  setCurrentChallenge: (challenge: Challenge | null) => void;
  setLoading: (loading: boolean) => void;
  setSessionId: (sessionId: string | null) => void;
  setChallenges: (challenges: Challenge[]) => void;
  addChallenge: (challenge: Challenge) => void;
  updateChallenge: (id: string, updates: Partial<Challenge>) => void;
  deleteChallenge: (id: string) => void;
  setAnalytics: (analytics: AnalyticsData) => void;
  setApiKeys: (keys: ApiKey[]) => void;
  addApiKey: (key: ApiKey) => void;
  updateApiKey: (id: string, updates: Partial<ApiKey>) => void;
  deleteApiKey: (id: string) => void;
  addResponse: (response: UserResponse) => void;
  clearSession: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      isDarkMode: true,
      isAuthenticated: false,
      user: null,
      currentChallenge: null,
      isLoading: false,
      sessionId: null,
      challenges: [],
      responses: [],
      apiKeys: [],
      analytics: null,
      
      // Actions
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      setAuthenticated: (isAuth, user) => set({ isAuthenticated: isAuth, user }),
      setCurrentChallenge: (challenge) => set({ currentChallenge: challenge }),
      setLoading: (loading) => set({ isLoading: loading }),
      setSessionId: (sessionId) => set({ sessionId }),
      setChallenges: (challenges) => set({ challenges }),
      addChallenge: (challenge) => set((state) => ({ 
        challenges: [...state.challenges, challenge] 
      })),
      updateChallenge: (id, updates) => set((state) => ({
        challenges: state.challenges.map(c => c.id === id ? { ...c, ...updates } : c)
      })),
      deleteChallenge: (id) => set((state) => ({
        challenges: state.challenges.filter(c => c.id !== id)
      })),
      setAnalytics: (analytics) => set({ analytics }),
      setApiKeys: (apiKeys) => set({ apiKeys }),
      addApiKey: (key) => set((state) => ({ 
        apiKeys: [...state.apiKeys, key] 
      })),
      updateApiKey: (id, updates) => set((state) => ({
        apiKeys: state.apiKeys.map(k => k.id === id ? { ...k, ...updates } : k)
      })),
      deleteApiKey: (id) => set((state) => ({
        apiKeys: state.apiKeys.filter(k => k.id !== id)
      })),
      addResponse: (response) => set((state) => ({
        responses: [...state.responses, response]
      })),
      clearSession: () => set({
        currentChallenge: null,
        sessionId: null,
        isLoading: false
      }),
    }),
    {
      name: 'yuno-store',
      partialize: (state) => ({ 
        isDarkMode: state.isDarkMode, 
        isAuthenticated: state.isAuthenticated, 
        user: state.user 
      }),
    }
  )
);