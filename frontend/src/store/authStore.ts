import { create } from "zustand"
import { pb } from "../lib/pocketbase"
import type { User } from "../types"

interface AuthState {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  checkAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => {
  // Synchronise l'état si le token expire
  pb.authStore.onChange(() => {
    if (!pb.authStore.isValid) {
      set({ user: null })
    }
  })

  return {
    user: null,
    isLoading: false,

    checkAuth: () => {
      if (pb.authStore.isValid && pb.authStore.record) {
        set({ user: pb.authStore.record as unknown as User })
      } else {
        set({ user: null })
      }
    },

    login: async (email: string, password: string) => {
      set({ isLoading: true })
      try {
        await pb.collection("users").authWithPassword(email, password)
        set({
          user: pb.authStore.record as unknown as User,
          isLoading: false,
        })
      } catch (error) {
        set({ isLoading: false })
        throw error
      }
    },

    logout: () => {
      pb.authStore.clear()
      set({ user: null })
    },
  }
})