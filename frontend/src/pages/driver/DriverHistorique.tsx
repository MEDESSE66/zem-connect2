import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { pb } from "../../lib/pocketbase"
import { useAuthStore } from "../../store/authStore"
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
  { icon: "🏠", label: "Accueil",    path: "/driver" },
  { icon: "🏍️", label: "Ma course",  path: "/driver/ma-course" },
  { icon: "📋", label: "Historique", path: "/driver/historique" },
]

export default function DriverHistorique() {
  const { user }                  = useAuthStore()
  const navigate                  = useNavigate()
  const [trips, setTrips]         = useState<Trip[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalGagne, setTotalGagne] = useState(0)

  useEffect(() => {
    if (!user?.id) return
    pb.collection("trips").getList(1, 50, {
      filter: `conducteur = "${user.id}" && (status = "completed" || status = "cancelled")`,
      sort: "-created",
      requestKey: null,
    }).then(records => {
      const tripList = records.items as unknown as Trip[]
      setTrips(tripList)
      const total = tripList
        .filter(t => t.status === "completed")
        .reduce((acc, t) => acc + ((t.finalPrice ?? 0) - 25), 0)
      setTotalGagne(total)
    }).catch(err => {
      console.error(err)
    }).finally(() => {
      setIsLoading(false)
    })
  }, [user?.id])

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
          onClick={() => navigate("/driver")}
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
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem" }}>Conducteur</p>
          <p style={{ color: "#fff", fontWeight: 800, fontSize: "1.05rem" }}>Historique des courses</p>
        </div>
      </div>

      <div style={{ padding: "24px" }}>

        {/* Résumé gains */}
        {!isLoading && trips.filter(t => t.status === "completed").length > 0 && (
          <div style={{
            background: C.noir,
            borderRadius: "20px",
            padding: "20px 24px",
            marginBottom: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <div>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.82rem" }}>Total gagné</p>
              <p style={{ color: C.jaune, fontWeight: 900, fontSize: "1.6rem" }}>{totalGagne} FCFA</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.82rem" }}>Courses terminées</p>
              <p style={{ color: "#fff", fontWeight: 800, fontSize: "1.2rem" }}>
                {trips.filter(t => t.status === "completed").length}
              </p>
            </div>
          </div>
        )}

        {isLoading && (
          <div style={{ textAlign: "center", color: "#aaa", padding: "48px 0" }}>
            Chargement...
          </div>
        )}

        {!isLoading && trips.length === 0 && (
          <div style={{
            textAlign: "center", padding: "48px 24px",
            background: "#fff", borderRadius: "20px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}>
            <div style={{ fontSize: "3rem", marginBottom: "16px" }}>📋</div>
            <p style={{ fontWeight: 700, color: C.noir, marginBottom: "8px" }}>
              Aucune course dans l'historique
            </p>
            <p style={{ color: "#aaa", fontSize: "0.88rem" }}>
              Vos courses terminées apparaîtront ici.
            </p>
          </div>
        )}

        {trips.map(trip => (
          <div key={trip.id} style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "20px",
            marginBottom: "14px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}>
            {/* Badge statut */}
            <div style={{
              display: "inline-flex",
              background: trip.status === "completed" ? `${C.vert}15` : "rgba(239,35,60,0.08)",
              color: trip.status === "completed" ? C.vert : "#ef233c",
              borderRadius: "100px", padding: "4px 12px",
              fontSize: "0.78rem", fontWeight: 700,
              marginBottom: "14px",
            }}>
              {trip.status === "completed" ? "✓ Terminée" : "✕ Annulée"}
            </div>

            {/* Trajet */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "14px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <span style={{ fontSize: "1rem", marginTop: "1px" }}>📍</span>
                <div>
                  <p style={{ fontSize: "0.75rem", color: "#aaa", marginBottom: "1px" }}>Départ</p>
                  <p style={{ fontWeight: 600, fontSize: "0.92rem", color: C.noir }}>{trip.departureAddress}</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <span style={{ fontSize: "1rem", marginTop: "1px" }}>🏁</span>
                <div>
                  <p style={{ fontSize: "0.75rem", color: "#aaa", marginBottom: "1px" }}>Destination</p>
                  <p style={{ fontWeight: 600, fontSize: "0.92rem", color: C.noir }}>{trip.destinationAddress}</p>
                </div>
              </div>
            </div>

            {/* Prix */}
            {trip.finalPrice && (
              <div style={{
                display: "flex", gap: "12px",
                background: C.fond, borderRadius: "10px",
                padding: "12px 14px",
              }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "0.75rem", color: "#aaa" }}>Prix course</p>
                  <p style={{ fontWeight: 800, color: C.noir }}>{trip.finalPrice} FCFA</p>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "0.75rem", color: "#aaa" }}>Commission</p>
                  <p style={{ fontWeight: 800, color: C.orange }}>-25 FCFA</p>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "0.75rem", color: "#aaa" }}>Gagné</p>
                  <p style={{ fontWeight: 800, color: C.vert }}>{trip.finalPrice - 25} FCFA</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <BottomNav items={NAV_ITEMS} />
    </div>
  )
}