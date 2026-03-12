import { useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useAuthStore } from "./store/authStore"
import { ProtectedRoute } from "./components/ProtectedRoute"

// Pages
import Login from "./pages/Login"
import Inscription from "./pages/Inscription"
import LandingPage from "./pages/LandingPage"
import ClientAccueil from "./pages/client/ClientAccueil"
import ClientNouvelleCourse from "./pages/client/ClientNouvelleCourse"
import ClientMesCourses from "./pages/client/ClientMesCourses"
import DriverAccueil from "./pages/driver/DriverAccueil"
import DriverMaCourse from "./pages/driver/DriverMaCourse"
import DriverHistorique from "./pages/driver/DriverHistorique"
import AdminStats from "./pages/admin/AdminStats"
import AdminUsers from "./pages/admin/AdminUsers"
import AdminCourses from "./pages/admin/AdminCourses"
import AdminLitiges from "./pages/admin/AdminLitiges"

export default function App() {
  const { checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <BrowserRouter>
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

        {/* Redirection par défaut */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}