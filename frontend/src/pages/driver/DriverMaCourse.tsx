import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { pb } from "../../lib/pocketbase"
import { useAuthStore } from "../../store/authStore"
import { Button } from "@/components/ui/button"
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

export default function DriverMaCourse() {
  const { user }                  = useAuthStore()
  const navigate                  = useNavigate()
  const [trip, setTrip]           = useState<Trip | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return

    const loadTrip = async () => {
      try {
        const records = await pb.collection("trips").getList(1, 1, {
          filter: `conducteur = "${user.id}" && (status = "active" || status = "in_progress")`,
          sort: "-created",
          requestKey: null,
        })
        if (records.items.length > 0) setTrip(records.items[0] as unknown as Trip)
      } catch (err) {
        console.error("Erreur chargement course", err)
      } finally {
        setIsLoading(false)
      }
    }

    loadTrip()

    pb.collection("trips").subscribe("*", e => {
      if (e.record.conducteur !== user.id) return
      if (e.action === "update") {
        if (e.record.status === "active" || e.record.status === "in_progress") {
          setTrip(e.record as unknown as Trip)
        } else {
          setTrip(null)
        }
      }
    })

    return () => { pb.collection("trips").unsubscribe("*") }
  }, [user?.id])

  const demarrer = async () => {
    if (!trip) return
    try {
      await pb.collection("trips").update(trip.id, { status: "in_progress" }, { requestKey: null })
    } catch {
      alert("Erreur lors du démarrage.")
    }
  }

  const terminer = async () => {
    if (!trip) return
    try {
      await pb.collection("trips").update(trip.id, { status: "completed" }, { requestKey: null })
      setTrip(null)
    } catch {
      alert("Erreur lors de la fin de course.")
    }
  }

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
          <p style={{ color: "#fff", fontWeight: 800, fontSize: "1.05rem" }}>Ma course active</p>
        </div>
      </div>

      <div style={{ padding: "24px" }}>

        {isLoading && (
          <div style={{ textAlign: "center", color: "#aaa", padding: "48px 0" }}>
            Chargement...
          </div>
        )}

        {!isLoading && !trip && (
          <div style={{
            textAlign: "center", padding: "48px 24px",
            background: "#fff", borderRadius: "20px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}>
            <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🏍️</div>
            <p style={{ fontWeight: 700, color: C.noir, marginBottom: "8px" }}>
              Aucune course active
            </p>
            <p style={{ color: "#aaa", fontSize: "0.88rem", marginBottom: "20px" }}>
              Acceptez une course depuis l'accueil.
            </p>
            <Button
              onClick={() => navigate("/driver")}
              style={{
                background: C.jaune, color: C.noir,
                fontWeight: 800, borderRadius: "100px",
                padding: "10px 24px", height: "auto",
              }}
            >
              Voir les courses
            </Button>
          </div>
        )}

        {trip && (
          <div>
            {/* Statut */}
            <div style={{
              display: "inline-flex", alignItems: "center",
              background: trip.status === "active" ? `${C.jaune}20` : `${C.vert}20`,
              color: trip.status === "active" ? C.orange : C.vert,
              borderRadius: "100px", padding: "6px 16px",
              fontSize: "0.82rem", fontWeight: 700,
              marginBottom: "20px",
            }}>
              {trip.status === "active" ? "⏳ En attente de démarrage" : "🚀 En cours"}
            </div>

            {/* Carte course */}
            <div style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "24px",
              boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
              marginBottom: "20px",
            }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "20px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                  <div style={{
                    width: "36px", height: "36px", borderRadius: "10px",
                    background: `${C.jaune}20`, display: "flex",
                    alignItems: "center", justifyContent: "center",
                    fontSize: "16px", flexShrink: 0,
                  }}>📍</div>
                  <div>
                    <p style={{ fontSize: "0.75rem", color: "#aaa", marginBottom: "2px" }}>Point de départ</p>
                    <p style={{ fontWeight: 700, color: C.noir }}>{trip.departureAddress}</p>
                  </div>
                </div>

                <div style={{ marginLeft: "18px", borderLeft: `2px dashed ${C.jaune}40`, height: "16px" }} />

                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                  <div style={{
                    width: "36px", height: "36px", borderRadius: "10px",
                    background: `${C.vert}20`, display: "flex",
                    alignItems: "center", justifyContent: "center",
                    fontSize: "16px", flexShrink: 0,
                  }}>🏁</div>
                  <div>
                    <p style={{ fontSize: "0.75rem", color: "#aaa", marginBottom: "2px" }}>Destination</p>
                    <p style={{ fontWeight: 700, color: C.noir }}>{trip.destinationAddress}</p>
                  </div>
                </div>
              </div>

              {/* Prix */}
              <div style={{
                background: C.fond, borderRadius: "12px",
                padding: "14px 16px",
                display: "flex", justifyContent: "space-between",
              }}>
                <div>
                  <p style={{ fontSize: "0.75rem", color: "#aaa" }}>Prix de la course</p>
                  <p style={{ fontWeight: 900, fontSize: "1.2rem", color: C.noir }}>
                    {trip.finalPrice} FCFA
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: "0.75rem", color: "#aaa" }}>Après commission</p>
                  <p style={{ fontWeight: 900, fontSize: "1.2rem", color: C.vert }}>
                    {(trip.finalPrice ?? 0) - 25} FCFA
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            {trip.status === "active" && (
              <Button
                onClick={demarrer}
                style={{
                  width: "100%", background: C.jaune,
                  color: C.noir, fontWeight: 800,
                  fontSize: "16px", height: "52px",
                  borderRadius: "14px",
                  boxShadow: `0 4px 20px ${C.jaune}40`,
                }}
              >
                🚀 Démarrer la course
              </Button>
            )}

            {trip.status === "in_progress" && (
              <Button
                onClick={terminer}
                style={{
                  width: "100%", background: C.vert,
                  color: "#fff", fontWeight: 800,
                  fontSize: "16px", height: "52px",
                  borderRadius: "14px",
                  boxShadow: `0 4px 20px ${C.vert}40`,
                }}
              >
                ✅ Terminer la course
              </Button>
            )}
          </div>
        )}
      </div>

      <BottomNav items={NAV_ITEMS} />
    </div>
  )
}