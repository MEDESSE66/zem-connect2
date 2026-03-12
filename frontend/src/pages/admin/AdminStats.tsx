import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { pb } from "../../lib/pocketbase"
import { useAuthStore } from "../../store/authStore"
import BottomNav from "../../components/BottomNav"

const C = {
  jaune:  "#F5C518",
  noir:   "#1A1A2E",
  orange: "#E85D04",
  vert:   "#06D6A0",
  fond:   "#F8F9FA",
}

const NAV_ITEMS = [
  { icon: "📊", label: "Stats",         path: "/admin" },
  { icon: "👥", label: "Utilisateurs",  path: "/admin/utilisateurs" },
  { icon: "🏍️", label: "Courses",       path: "/admin/courses" },
  { icon: "⚠️", label: "Litiges",       path: "/admin/litiges" },
]

export default function AdminStats() {
  const { logout }                              = useAuthStore()
  const navigate                                = useNavigate()
  const [totalCommissions, setTotalCommissions] = useState(0)
  const [totalTrips, setTotalTrips]             = useState(0)
  const [totalUsers, setTotalUsers]             = useState(0)
  const [totalConducteurs, setTotalConducteurs] = useState(0)
  const [isLoading, setIsLoading]               = useState(true)

  useEffect(() => {
    Promise.all([
      pb.collection("transactions").getList(1, 1000, {
        filter: `type = "commission" && status = "completed"`,
        requestKey: null,
      }),
      pb.collection("trips").getList(1, 1, {
        filter: `status = "completed"`,
        requestKey: null,
      }),
      pb.collection("users").getList(1, 1, {
        filter: `role = "client"`,
        requestKey: null,
      }),
      pb.collection("users").getList(1, 1, {
        filter: `role = "conducteur"`,
        requestKey: null,
      }),
    ]).then(([transactions, trips, clients, conducteurs]) => {
      const total = transactions.items.reduce((sum, t) => sum + (t as any).amount, 0)
      setTotalCommissions(Math.abs(total))
      setTotalTrips(trips.totalItems)
      setTotalUsers(clients.totalItems)
      setTotalConducteurs(conducteurs.totalItems)
    }).finally(() => setIsLoading(false))
  }, [])

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
        <div style={{
          position: "absolute", top: "-40px", right: "-40px",
          width: "180px", height: "180px", borderRadius: "50%",
          background: `radial-gradient(circle, ${C.jaune}20 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <div>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.82rem", marginBottom: "2px" }}>
              Administration
            </p>
            <p style={{ color: "#fff", fontWeight: 800, fontSize: "1.1rem" }}>
              Tableau de bord
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
      </div>

      <div style={{ padding: "24px" }}>

        {isLoading && (
          <div style={{ textAlign: "center", color: "#aaa", padding: "48px 0" }}>
            Chargement...
          </div>
        )}

        {!isLoading && (
          <>
            {/* Stat principale */}
            <div style={{
              background: C.noir,
              borderRadius: "20px",
              padding: "24px",
              marginBottom: "16px",
              position: "relative",
              overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", bottom: "-20px", right: "-20px",
                width: "120px", height: "120px", borderRadius: "50%",
                background: `${C.jaune}15`, pointerEvents: "none",
              }} />
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.82rem", marginBottom: "4px" }}>
                Commissions collectées
              </p>
              <p style={{ color: C.jaune, fontWeight: 900, fontSize: "2rem" }}>
                {totalCommissions} FCFA
              </p>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.78rem", marginTop: "4px" }}>
                25 FCFA par course terminée
              </p>
            </div>

            {/* Grid stats */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "14px",
              marginBottom: "24px",
            }}>
              {[
                { icon: "🏍️", label: "Courses terminées", value: totalTrips,      color: C.vert   },
                { icon: "👥", label: "Clients",            value: totalUsers,      color: "#3b82f6" },
                { icon: "🚗", label: "Conducteurs",        value: totalConducteurs, color: C.orange },
              ].map(({ icon, label, value, color }) => (
                <div key={label} style={{
                  background: "#fff",
                  borderRadius: "16px",
                  padding: "18px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                }}>
                  <div style={{ fontSize: "1.6rem", marginBottom: "8px" }}>{icon}</div>
                  <div style={{ color, fontWeight: 900, fontSize: "1.4rem" }}>{value}</div>
                  <div style={{ color: "#999", fontSize: "0.8rem", marginTop: "2px" }}>{label}</div>
                </div>
              ))}

              {/* Raccourci litiges */}
              <div
                onClick={() => navigate("/admin/litiges")}
                style={{
                  background: `${C.orange}10`,
                  border: `1px solid ${C.orange}25`,
                  borderRadius: "16px",
                  padding: "18px",
                  cursor: "pointer",
                }}
              >
                <div style={{ fontSize: "1.6rem", marginBottom: "8px" }}>⚠️</div>
                <div style={{ color: C.orange, fontWeight: 700, fontSize: "0.9rem" }}>
                  Voir litiges
                </div>
                <div style={{ color: "#999", fontSize: "0.8rem", marginTop: "2px" }}>Ouverts</div>
              </div>
            </div>

            {/* Raccourcis */}
            <h3 style={{ fontWeight: 800, fontSize: "1rem", color: C.noir, marginBottom: "14px" }}>
              Actions rapides
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { icon: "👥", label: "Gérer les utilisateurs",  sub: "Suspendre, réactiver les comptes", path: "/admin/utilisateurs", border: C.jaune },
                { icon: "🏍️", label: "Voir toutes les courses", sub: "Historique complet des trajets",    path: "/admin/courses",      border: C.vert  },
              ].map(({ icon, label, sub, path, border }) => (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  style={{
                    background: "#fff",
                    border: `2px solid ${border}`,
                    borderRadius: "14px",
                    padding: "16px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "box-shadow 0.15s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 4px 16px ${border}30`)}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
                >
                  <span style={{ fontSize: "1.8rem" }}>{icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.95rem", color: C.noir }}>{label}</div>
                    <div style={{ fontSize: "0.82rem", color: "#999", marginTop: "2px" }}>{sub}</div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <BottomNav items={NAV_ITEMS} />
    </div>
  )
}