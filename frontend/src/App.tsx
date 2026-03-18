import { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "sonner"
import { useAuthStore } from "./store/authStore"
import { ProtectedRoute } from "./components/ProtectedRoute"

// Pages
import Login from "./pages/Login"
import Inscription from "./pages/Inscription"
import LandingPage from "./pages/LandingPage"
import ClientAccueil from "./pages/client/ClientAccueil"
import ClientNouvelleCourse from "./pages/client/ClientNouvelleCourse"
import ClientMesCourses from "./pages/client/ClientMesCourses"
import ClientProfil from "./pages/client/ClientProfil"
import DriverAccueil from "./pages/driver/DriverAccueil"
import DriverMaCourse from "./pages/driver/DriverMaCourse"
import DriverHistorique from "./pages/driver/DriverHistorique"
import DriverProfil from "./pages/driver/DriverProfil"
import AdminStats from "./pages/admin/AdminStats"
import AdminUsers from "./pages/admin/AdminUsers"
import AdminCourses from "./pages/admin/AdminCourses"
import AdminLitiges from "./pages/admin/AdminLitiges"
import AdminSettings from "./pages/admin/AdminSettings"

export default function App() {
  const { checkAuth } = useAuthStore()
  const [isAuthReady, setIsAuthReady] = useState(false)

  useEffect(() => {
    checkAuth().finally(() => setIsAuthReady(true))
  }, [])

  if (!isAuthReady) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-brand-bg">
        <div className="text-brand-yellow text-2xl font-black">ZEM</div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/inscription" element={<Inscription />} />

        {/* Routes Client */}
        <Route path="/client" element={
          <ProtectedRoute allowedRoles={["client"]}>
            <ClientAccueil />
          </ProtectedRoute>
        } />
        <Route path="/client/nouvelle-course" element={
          <ProtectedRoute allowedRoles={["client"]}>
            <ClientNouvelleCourse />
          </ProtectedRoute>
        } />
        <Route path="/client/mes-courses" element={
          <ProtectedRoute allowedRoles={["client"]}>
            <ClientMesCourses />
          </ProtectedRoute>
        } />
        <Route path="/client/profil" element={
          <ProtectedRoute allowedRoles={["client"]}>
            <ClientProfil />
          </ProtectedRoute>
        } />

        {/* Routes Conducteur */}
        <Route path="/driver" element={
          <ProtectedRoute allowedRoles={["conducteur"]}>
            <DriverAccueil />
          </ProtectedRoute>
        } />
        <Route path="/driver/ma-course" element={
          <ProtectedRoute allowedRoles={["conducteur"]}>
            <DriverMaCourse />
          </ProtectedRoute>
        } />
        <Route path="/driver/historique" element={
          <ProtectedRoute allowedRoles={["conducteur"]}>
            <DriverHistorique />
          </ProtectedRoute>
        } />
        <Route path="/driver/profil" element={
          <ProtectedRoute allowedRoles={["conducteur"]}>
            <DriverProfil />
          </ProtectedRoute>
        } />

        {/* Routes Admin */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminStats />
          </ProtectedRoute>
        } />
        <Route path="/admin/utilisateurs" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminUsers />
          </ProtectedRoute>
        } />
        <Route path="/admin/courses" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminCourses />
          </ProtectedRoute>
        } />
        <Route path="/admin/litiges" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLitiges />
          </ProtectedRoute>
        } />
        <Route path="/admin/settings" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminSettings />
          </ProtectedRoute>
        } />

        {/* Redirection par défaut */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}