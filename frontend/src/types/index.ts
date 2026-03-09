// Rôles utilisateur
export type UserRole = "client" | "conducteur" | "admin"

// Statuts de course
export type TripStatus = "pending" | "active" | "in_progress" | "completed" | "cancelled" | "expired"

// Statuts d'offre
export type OffreStatus = "pending" | "accepted" | "rejected" | "cancelled"

// Types d'abonnement
export type SubscriptionType = "none" | "premium"

// Utilisateur
export interface User {
  id: string
  email: string
  phone: string
  role: UserRole
  isOnline: boolean
  isSuspended: boolean
  walletBalance: number
  rating: number
  totalRating: number
  subscriptionType: SubscriptionType
  subscriptionExpiry?: string
  name?: string
  avatar?: string
  created: string
  updated: string
}

// Course
export interface Trip {
  id: string
  client: string
  conducteur?: string
  status: TripStatus
  departureAddress: string
  destinationAddress: string
  departureLat: number
  departureLng: number
  destinationLat: number
  destinationLng: number
  clientPrice: number
  finalPrice?: number
  distance?: number
  expiresAt?: string
  cancelReason?: string
  created: string
  updated: string
}

// Offre
export interface Offre {
  id: string
  trip: string
  conducteur: string
  proposedPrice: number
  status: OffreStatus
  isCounterOffer: boolean
  created: string
  updated: string
}

// Transaction
export interface Transaction {
  id: string
  user: string
  type: "commission" | "recharge" | "refund"
  amount: number
  trip?: string
  status: "pending" | "completed" | "failed"
  reference?: string
  created: string
  updated: string
}

// Notation
export interface Notation {
  id: string
  trip: string
  author: string
  target: string
  score: number
  comment?: string
  created: string
  updated: string
}

// Litige
export interface Litige {
  id: string
  trip: string
  reportedBy: string
  against: string
  reason: "no_show" | "bad_behavior" | "fraud" | "other"
  status: "open" | "resolved" | "dismissed"
  description?: string
  resolvedBy?: string
  resolvedAt?: string
  created: string
  updated: string
}