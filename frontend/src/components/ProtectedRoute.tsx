import { Navigate } from "react-router-dom"
import { useAuthStore } from "../store/authStore"
import type { UserRole } from "../types"

interface Props {
  children: React.ReactNode
  allowedRoles: UserRole[]
}

export const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const { user } = useAuthStore()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}