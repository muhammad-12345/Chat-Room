import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { PublicUser } from '@chat-room/shared'

interface AuthState {
  user: PublicUser | null
  token: string | null
  isAuthenticated: boolean
  
  // Actions
  setAuth: (user: PublicUser, token: string) => void
  clearAuth: () => void
  updateUser: (user: Partial<PublicUser>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      setAuth: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: true,
        })
      },
      
      clearAuth: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        })
      },
      
      updateUser: (userData) => {
        const { user } = get()
        if (user) {
          set({
            user: { ...user, ...userData },
          })
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
