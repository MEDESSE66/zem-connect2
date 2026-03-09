import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../../store/authStore"

export default function ClientAccueil() {
  const navigate = useNavigate()
  const { logout } = useAuthStore()

  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto" }}>
      <h2>Accueil Client</h2>
      <button
        onClick={() => navigate("/client/nouvelle-course")}
        style={{ display: "block", width: "100%", padding: "0.75rem", marginBottom: "1rem", cursor: "pointer" }}
      >
        Nouvelle course
      </button>
      <button
        onClick={() => navigate("/client/mes-courses")}
        style={{ display: "block", width: "100%", padding: "0.75rem", marginBottom: "1rem", cursor: "pointer" }}
      >
        Mes courses
      </button>
      <button
        onClick={() => { logout(); navigate("/login") }}
        style={{ display: "block", width: "100%", padding: "0.75rem", cursor: "pointer" }}
      >
        Déconnexion
      </button>
    </div>
  )
}