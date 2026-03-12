import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../../store/authStore"
import { Button } from "@/components/ui/button"
import BottomNav from "../../components/BottomNav"

const C = {
  jaune:  "#F5C518",
  noir:   "#1A1A2E",
  orange: "#E85D04",
  vert:   "#06D6A0",
  fond:   "#F8F9FA",
}

const NAV_ITEMS = [
  { icon: "🏠", label: "Accueil",  path: "/client" },
  { icon: "🏍️", label: "Courses",  path: "/client/mes-courses" },
]

export default function ClientAccueil() {
  const navigate       = useNavigate()
  const { user, logout } = useAuthStore()

  return (
    <div style={{
      minHeight: "100svh",
      background: C.fond,
      fontFamily: "Inter, sans-serif",
      paddingBottom: "80px",
    }}>

      {/* Header */}
      <div style={{
        background: C.noir,
        padding: "20px 24px 28px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Déco */}
        <div style={{
          position: "absolute", top: "-40px", right: "-40px",
          width: "180px", height: "180px", borderRadius: "50%",
          background: `radial-gradient(circle, ${C.jaune}20 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />

        {/* Top row */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}>
          <div>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.82rem", marginBottom: "2px" }}>
              Bonjour 👋
            </p>
            <p style={{ color: "#fff", fontWeight: 800, fontSize: "1.1rem" }}>
              {user?.name || user?.email?.split("@")[0] || "Client"}
            </p>
          </div>
          <button
            onClick={() => { logout(); navigate("/login") }}
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.6)",
              borderRadius: "10px",
              padding: "8px 14px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Déconnexion
          </button>
        </div>

        {/* CTA principal */}
        <Button
          onClick={() => navigate("/client/nouvelle-course")}
          style={{
            width: "100%",
            background: C.jaune,
            color: C.noir,
            fontWeight: 800,
            fontSize: "16px",
            height: "52px",
            borderRadius: "14px",
            fontFamily: "Inter, sans-serif",
            boxShadow: `0 4px 20px ${C.jaune}40`,
          }}
        >
          🏍️ Commander une course
        </Button>
      </div>

      {/* Contenu */}
      <div style={{ padding: "24px" }}>

        {/* Stats rapides */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "14px",
          marginBottom: "28px",
        }}>
          {[
            { icon: "⚡", label: "Délai moyen",   value: "2 min",    color: C.jaune  },
            { icon: "🔒", label: "Conducteurs",    value: "Vérifiés", color: C.vert   },
          ].map(({ icon, label, value, color }) => (
            <div key={label} style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "18px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}>
              <div style={{ fontSize: "1.6rem", marginBottom: "8px" }}>{icon}</div>
              <div style={{ color, fontWeight: 800, fontSize: "1.1rem" }}>{value}</div>
              <div style={{ color: "#999", fontSize: "0.8rem", marginTop: "2px" }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Raccourcis */}
        <h3 style={{
          fontWeight: 800, fontSize: "1rem",
          color: C.noir, marginBottom: "14px",
        }}>
          Actions rapides
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <button
            onClick={() => navigate("/client/nouvelle-course")}
            style={{
              background: "#fff",
              border: `2px solid ${C.jaune}`,
              borderRadius: "14px",
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              cursor: "pointer",
              textAlign: "left",
              transition: "box-shadow 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 4px 16px ${C.jaune}30`)}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
          >
            <span style={{ fontSize: "1.8rem" }}>🗺️</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.95rem", color: C.noir }}>
                Nouvelle course
              </div>
              <div style={{ fontSize: "0.82rem", color: "#999", marginTop: "2px" }}>
                Demandez un zémidjan maintenant
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate("/client/mes-courses")}
            style={{
              background: "#fff",
              border: "2px solid rgba(0,0,0,0.07)",
              borderRadius: "14px",
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              cursor: "pointer",
              textAlign: "left",
              transition: "box-shadow 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)")}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
          >
            <span style={{ fontSize: "1.8rem" }}>📋</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.95rem", color: C.noir }}>
                Mes courses
              </div>
              <div style={{ fontSize: "0.82rem", color: "#999", marginTop: "2px" }}>
                Voir l'historique et les offres reçues
              </div>
            </div>
          </button>
        </div>
      </div>

      <BottomNav items={NAV_ITEMS} />
    </div>
  )
}