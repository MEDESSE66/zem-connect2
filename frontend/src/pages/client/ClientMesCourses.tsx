import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { pb } from "../../lib/pocketbase"
import { useAuthStore } from "../../store/authStore"
import { Button } from "@/components/ui/button"
import BottomNav from "../../components/BottomNav"
import type { Trip, Offre } from "../../types"

const C = {
  jaune:  "#F5C518",
  noir:   "#1A1A2E",
  orange: "#E85D04",
  vert:   "#06D6A0",
  fond:   "#F8F9FA",
}

const NAV_ITEMS = [
  { icon: "🏠", label: "Accueil", path: "/client" },
  { icon: "🏍️", label: "Courses", path: "/client/mes-courses" },
]

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending:     { label: "En attente",  color: C.orange,          bg: `${C.orange}15`     },
  active:      { label: "Active",      color: C.vert,            bg: `${C.vert}15`       },
  in_progress: { label: "En cours",   color: "#3b82f6",          bg: "rgba(59,130,246,0.1)" },
  completed:   { label: "Terminée",   color: "#666",             bg: "#f0f0f0"           },
  cancelled:   { label: "Annulée",    color: "#ef233c",          bg: "rgba(239,35,60,0.1)" },
  expired:     { label: "Expirée",    color: "#999",             bg: "#f5f5f5"           },
}

export default function ClientMesCourses() {
  const { user }                          = useAuthStore()
  const navigate                          = useNavigate()
  const [trips, setTrips]                 = useState<Trip[]>([])
  const [offres, setOffres]               = useState<Record<string, Offre[]>>({})
  const [isLoading, setIsLoading]         = useState(true)
  const [isAccepting, setIsAccepting]     = useState<string | null>(null)

  useEffect(() => {
    if (!user?.id) return

    const loadOffres = async (tripId: string) => {
      try {
        const records = await pb.collection("offres").getList(1, 50, {
          filter: `trip = "${tripId}" && status = "pending"`,
          sort: "-created",
          requestKey: null,
        })
        setOffres(prev => ({ ...prev, [tripId]: records.items as unknown as Offre[] }))
      } catch (err) {
        console.error("Erreur chargement offres", err)
      }
    }

    const loadTrips = async () => {
      try {
        const records = await pb.collection("trips").getList(1, 50, {
          filter: `client = "${user.id}"`,
          sort: "-created",
          requestKey: null,
        })
        const tripList = records.items as unknown as Trip[]
        setTrips(tripList)
        for (const trip of tripList) {
          if (trip.status === "pending") loadOffres(trip.id)
        }
      } catch (err) {
        console.error("Erreur chargement courses", err)
      } finally {
        setIsLoading(false)
      }
    }

    loadTrips()

    pb.collection("trips").subscribe("*", e => {
      if (e.record.client !== user.id) return
      if (e.action === "create") setTrips(prev => [e.record as unknown as Trip, ...prev])
      else if (e.action === "update") setTrips(prev => prev.map(t => t.id === e.record.id ? e.record as unknown as Trip : t))
    })

    pb.collection("offres").subscribe("*", e => {
      if (e.action === "create") {
        setOffres(prev => ({
          ...prev,
          [e.record.trip]: [e.record as unknown as Offre, ...(prev[e.record.trip] || [])],
        }))
      }
    })

    return () => {
      pb.collection("trips").unsubscribe("*")
      pb.collection("offres").unsubscribe("*")
    }
  }, [user?.id])

  const acceptOffre = async (offre: Offre) => {
    setIsAccepting(offre.id)
    try {
      await pb.collection("offres").update(offre.id, { status: "accepted" }, { requestKey: null })
      await pb.collection("trips").update(offre.trip, {
        status: "active",
        conducteur: offre.conducteur,
        finalPrice: offre.proposedPrice,
      }, { requestKey: null })
    } catch (err) {
      console.error("Erreur acceptation offre", err)
      alert("Erreur lors de l'acceptation de l'offre.")
    } finally {
      setIsAccepting(null)
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
          onClick={() => navigate("/client")}
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
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem" }}>Client</p>
          <p style={{ color: "#fff", fontWeight: 800, fontSize: "1.05rem" }}>Mes courses</p>
        </div>
      </div>

      {/* Contenu */}
      <div style={{ padding: "24px" }}>

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
            <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🏍️</div>
            <p style={{ fontWeight: 700, color: C.noir, marginBottom: "8px" }}>
              Aucune course pour l'instant
            </p>
            <p style={{ color: "#aaa", fontSize: "0.88rem", marginBottom: "20px" }}>
              Commandez votre premier zémidjan !
            </p>
            <Button
              onClick={() => navigate("/client/nouvelle-course")}
              style={{
                background: C.jaune, color: C.noir,
                fontWeight: 800, borderRadius: "100px",
                padding: "10px 24px", height: "auto",
              }}
            >
              Commander une course
            </Button>
          </div>
        )}

        {trips.map(trip => {
          const sc = STATUS_CONFIG[trip.status] || { label: trip.status, color: "#666", bg: "#f0f0f0" }
          return (
            <div key={trip.id} style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "20px",
              marginBottom: "16px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}>
              {/* Status badge */}
              <div style={{
                display: "inline-flex", alignItems: "center",
                background: sc.bg, color: sc.color,
                borderRadius: "100px", padding: "4px 12px",
                fontSize: "0.78rem", fontWeight: 700,
                marginBottom: "14px",
              }}>
                {sc.label}
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
              <div style={{
                display: "flex", gap: "12px",
                padding: "12px", background: C.fond,
                borderRadius: "10px", marginBottom: "14px",
              }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "0.75rem", color: "#aaa" }}>Prix proposé</p>
                  <p style={{ fontWeight: 800, color: C.noir }}>{trip.clientPrice} FCFA</p>
                </div>
                {trip.finalPrice && (
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "0.75rem", color: "#aaa" }}>Prix final</p>
                    <p style={{ fontWeight: 800, color: C.vert }}>{trip.finalPrice} FCFA</p>
                  </div>
                )}
              </div>

              {/* Offres */}
              {trip.status === "pending" && offres[trip.id]?.length > 0 && (
                <div>
                  <p style={{
                    fontWeight: 700, fontSize: "0.88rem",
                    color: C.noir, marginBottom: "10px",
                  }}>
                    {offres[trip.id].length} offre{offres[trip.id].length > 1 ? "s" : ""} reçue{offres[trip.id].length > 1 ? "s" : ""}
                  </p>
                  {offres[trip.id].map(offre => (
                    <div key={offre.id} style={{
                      display: "flex", alignItems: "center",
                      justifyContent: "space-between",
                      background: `${C.jaune}10`,
                      border: `1px solid ${C.jaune}30`,
                      borderRadius: "12px",
                      padding: "12px 16px",
                      marginBottom: "8px",
                    }}>
                      <div>
                        <p style={{ fontSize: "0.78rem", color: "#aaa" }}>Offre conducteur</p>
                        <p style={{ fontWeight: 800, color: C.noir, fontSize: "1rem" }}>
                          {offre.proposedPrice} FCFA
                        </p>
                      </div>
                      <Button
                        onClick={() => acceptOffre(offre)}
                        disabled={isAccepting === offre.id}
                        style={{
                          background: C.jaune, color: C.noir,
                          fontWeight: 800, fontSize: "13px",
                          padding: "8px 16px", height: "auto",
                          borderRadius: "100px",
                          opacity: isAccepting === offre.id ? 0.6 : 1,
                          cursor: isAccepting === offre.id ? "not-allowed" : "pointer",
                        }}
                      >
                        {isAccepting === offre.id ? "..." : "Accepter"}
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {trip.status === "pending" && (!offres[trip.id] || offres[trip.id].length === 0) && (
                <p style={{ color: "#aaa", fontSize: "0.82rem", textAlign: "center", padding: "8px 0" }}>
                  ⏳ En attente d'offres des conducteurs...
                </p>
              )}
            </div>
          )
        })}
      </div>

      <BottomNav items={NAV_ITEMS} />
    </div>
  )
}