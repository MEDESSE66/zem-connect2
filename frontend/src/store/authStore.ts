import { create } from "zustand"
import { pb } from "../lib/pocketbase"
import type { User, UserRole } from "../types"

interface AuthState {
  user: User | null
  isLoading: boolean
  login: (phone: string, password: string) => Promise<void>
  logout: () => void
  checkAuth: () => void
  register: (phone: string, password: string, name: string, role: UserRole, extraData?: Record<string, unknown>) => Promise<void>
}

// Convertit un numéro béninois en faux email PocketBase
function phoneToEmail(phone: string): string {
  const cleaned = phone.replace(/\s/g, "")
  return `+229${cleaned}@zemconnect.app`
}

export const useAuthStore = create<AuthState>((set) => {
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

    login: async (phone: string, password: string) => {
      set({ isLoading: true })
      try {
        const email = phoneToEmail(phone)
        await pb.collection("users").authWithPassword(email, password, { requestKey: null })
        set({ user: pb.authStore.record as unknown as User, isLoading: false })
      } catch (error) {
        set({ isLoading: false })
        throw error
      }
    },

    register: async (phone: string, password: string, name: string, role: UserRole, extraData = {}) => {
      set({ isLoading: true })
      try {
        const email = phoneToEmail(phone)
        await pb.collection("users").create({
          email,
          password,
          passwordConfirm: password,
          phone,
          name,
          role,
          walletBalance: 0,
          isOnline: false,
          isSuspended: false,
          rating: 0,
          totalRating: 0,
          subscriptionType: "none",
          ...extraData,
        }, { requestKey: null })
        await pb.collection("users").authWithPassword(email, password, { requestKey: null })
        set({ user: pb.authStore.record as unknown as User, isLoading: false })
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