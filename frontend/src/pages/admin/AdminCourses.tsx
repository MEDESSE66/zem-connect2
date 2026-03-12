import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { pb } from "../../lib/pocketbase"
import BottomNav from "../../components/BottomNav"
import type { Trip } from "../../types"

const C = {
  jaune:  "#F5C518",
  noir:   "#1A1A2E",
  orange: "#E85D04",
  vert:   "#06D6A0",
  fond:   "#F8F9FA",
}

const NAV_ITEMS = [
  { icon: "📊", label: "Stats",        path: "/admin" },
  { icon: "👥", label: "Utilisateurs", path: "/admin/utilisateurs" },
  { icon: "🏍️", label: "Courses",      path: "/admin/courses" },
  { icon: "⚠️", label: "Litiges",      path: "/admin/litiges" },
]

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending:     { label: "En attente",  color: C.orange,   bg: `${C.orange}15`          },
  active:      { label: "Active",      color: C.vert,     bg: `${C.vert}15`            },
  in_progress: { label: "En cours",    color: "#3b82f6",  bg: "rgba(59,130,246,0.1)"   },
  completed:   { label: "Terminée",    color: "#666",     bg: "#f0f0f0"                },
  cancelled:   { label: "Annulée",     color: "#ef233c",  bg: "rgba(239,35,60,0.1)"    },
  expired:     { label: "Expirée",     color: "#999",     bg: "#f5f5f5"                },
}

export default function AdminCourses() {
  const navigate                  = useNavigate()
  const [trips, setTrips]         = useState<Trip[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter]       = useState<string>("all")

  useEffect(() => {
    pb.collection("trips").getList(1, 100, {
      sort: "-created",
      requestKey: null,
    }).then(r => {
      setTrips(r.items as unknown as Trip[])
    }).finally(() => setIsLoading(false))
  }, [])

  const filtered = trips.filter(t => filter === "all" || t.status === filter)

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
        padding: "20px 24px 24px",
        display: "flex",
        alignItems: "center",
        gap: "14px",
      }}>
        <button
          onClick={() => navigate("/admin")}
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "#fff", borderRadius: "10px",
            width: "38px", height: "38px",
            fontSize: "18px", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}
        >
          ←
        </button>
        <div>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem" }}>Administration</p>
          <p style={{ color: "#fff", fontWeight: 800, fontSize: "1.05rem" }}>
            Courses ({trips.length})
          </p>
        </div>
      </div>

      <div style={{ padding: "24px" }}>

        {/* Filtres statut */}
        <div style={{
          display: "flex", gap: "8px",
          marginBottom: "20px",
          overflowX: "auto", paddingBottom: "4px",
        }}>
          {[
            { key: "all",         label: "Toutes" },
            { key: "pending",     label: "En attente" },
            { key: "active",      label: "Actives" },
            { key: "in_progress", label: "En cours" },
            { key: "completed",   label: "Terminées" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              style={{
                background: filter === key ? C.jaune : "#fff",
                color: filter === key ? C.noir : "#666",
                border: filter === key ? "none" : "1px solid #e5e7eb",
                borderRadius: "100px",
                padding: "8px 16px",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                whiteSpace: "nowrap",
                boxShadow: filter === key ? `0 2px 8px ${C.jaune}40` : "none",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {isLoading && (
          <div style={{ textAlign: "center", color: "#aaa", padding: "48px 0" }}>
            Chargement...
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div style={{
            textAlign: "center", padding: "48px 24px",
            background: "#fff", borderRadius: "20px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}>
            <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🏍️</div>
            <p style={{ fontWeight: 700, color: C.noir }}>Aucune course trouvée</p>
          </div>
        )}

        {filtered.map(trip => {
          const sc = STATUS_CONFIG[trip.status] || { label: trip.status, color: "#666", bg: "#f0f0f0" }
          return (
            <div key={trip.id} style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "20px",
              marginBottom: "14px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}>
              {/* Badge */}
              <div style={{
                display: "inline-flex",
                background: sc.bg, color: sc.color,
                borderRadius: "100px", padding: "4px 12px",
                fontSize: "0.75rem", fontWeight: 700,
                marginBottom: "14px",
              }}>
                {sc.label}
              </div>

              {/* Trajet */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "14px" }}>
                <div style={{ display: "flex", gap: "10px" }}>
                  <span>📍</span>
                  <div>
                    <p style={{ fontSize: "0.72rem", color: "#aaa" }}>Départ</p>
                    <p style={{ fontWeight: 600, fontSize: "0.9rem", color: C.noir }}>{trip.departureAddress}</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <span>🏁</span>
                  <div>
                    <p style={{ fontSize: "0.72rem", color: "#aaa" }}>Destination</p>
                    <p style={{ fontWeight: 600, fontSize: "0.9rem", color: C.noir }}>{trip.destinationAddress}</p>
                  </div>
                </div>
              </div>

              {/* Prix */}
              <div style={{
                display: "flex", gap: "12px",
                background: C.fond, borderRadius: "10px",
                padding: "10px 14px",
              }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "0.72rem", color: "#aaa" }}>Prix client</p>
                  <p style={{ fontWeight: 800, color: C.noir }}>{trip.clientPrice} FCFA</p>
                </div>
                {trip.finalPrice && (
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "0.72rem", color: "#aaa" }}>Prix final</p>
                    <p style={{ fontWeight: 800, color: C.vert }}>{trip.finalPrice} FCFA</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <BottomNav items={NAV_ITEMS} />
    </div>
  )
}