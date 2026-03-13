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

export default function DriverAccueil() {
  const { user, logout }          = useAuthStore()
  const navigate                  = useNavigate()
  const [trips, setTrips]         = useState<Trip[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sentOffers, setSentOffers] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!user?.id) return

    const loadTrips = async () => {
      try {
        const records = await pb.collection("trips").getList(1, 50, {
          filter: `status = "pending"`,
          sort: "-created",
          requestKey: null,
        })
        setTrips(records.items as unknown as Trip[])
      } catch (err) {
        console.error("Erreur chargement courses", err)
      } finally {
        setIsLoading(false)
      }
    }

    loadTrips()

    pb.collection("trips").subscribe("*", e => {
      if (e.action === "create" && e.record.status === "pending") {
        setTrips(prev => [e.record as unknown as Trip, ...prev])
      } else if (e.action === "update") {
        setTrips(prev => prev.filter(t => t.id !== e.record.id || e.record.status === "pending"))
      }
    })

    return () => { pb.collection("trips").unsubscribe("*") }
  }, [user?.id])

  const handleOffre = async (trip: Trip) => {
    if (!user?.conducteur_verifie) {
      alert("Votre compte n'est pas encore validé par l'admin.")
      return
    }
    try {
      await pb.collection("offres").create({
        trip: trip.id,
        conducteur: user?.id,
        proposedPrice: trip.clientPrice,
        status: "pending",
        isCounterOffer: false,
      }, { requestKey: null })
      setSentOffers(prev => new Set(prev).add(trip.id))
    } catch {
      alert("Erreur lors de l'envoi de l'offre.")
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
        padding: "20px 24px 28px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "-40px", right: "-40px",
          width: "180px", height: "180px", borderRadius: "50%",
          background: `radial-gradient(circle, ${C.orange}20 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.82rem", marginBottom: "2px" }}>
                Conducteur 🏍️
              </p>
              <p style={{ color: "#fff", fontWeight: 800, fontSize: "1.1rem" }}>
                {user?.name || user?.email?.split("@")[0] || "Conducteur"}
              </p>
            </div>
            <button
              onClick={() => navigate("/driver/profil")}
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.8)",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: "16px",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.15)"
                e.currentTarget.style.transform = "scale(1.05)"
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.08)"
                e.currentTarget.style.transform = "scale(1)"
              }}
            >
              👤
            </button>
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

        {/* Wallet */}
        <div style={{
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "14px",
          padding: "14px 18px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <div>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.78rem" }}>Solde wallet</p>
            <p style={{ color: C.jaune, fontWeight: 900, fontSize: "1.4rem" }}>
              {user?.walletBalance ?? 0} FCFA
            </p>
          </div>
          <div style={{
            background: `${C.jaune}20`,
            border: `1px solid ${C.jaune}40`,
            borderRadius: "10px",
            padding: "8px 14px",
            color: C.jaune,
            fontSize: "0.78rem",
            fontWeight: 700,
          }}>
            Commission : 25 FCFA
          </div>
        </div>
      </div>
      
      {!user?.conducteur_verifie && (
        <div style={{
          background: "#E85D0415",
          border: "1px solid #E85D0440",
          borderRadius: "16px",
          margin: "16px",
          padding: "16px 20px",
          display: "flex",
          alignItems: "flex-start",
          gap: "12px",
        }}>
          <span style={{ fontSize: "1.4rem", flexShrink: 0 }}>⏳</span>
          <div>
            <p style={{ fontWeight: 800, color: "#E85D04", fontSize: "0.95rem", marginBottom: "4px" }}>
              Compte en attente de validation
            </p>
            <p style={{ color: "#666", fontSize: "0.83rem", lineHeight: 1.5 }}>
              Votre dossier est en cours de vérification. Vous recevrez 200 FCFA de bienvenue dès l'activation.
            </p>
          </div>
        </div>
      )}

      {/* Contenu */}
      <div style={{ padding: "24px" }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}>
          <h3 style={{ fontWeight: 800, fontSize: "1rem", color: C.noir }}>
            Courses disponibles
          </h3>
          {!isLoading && (
            <span style={{
              background: `${C.orange}15`,
              color: C.orange,
              borderRadius: "100px",
              padding: "4px 12px",
              fontSize: "0.78rem",
              fontWeight: 700,
            }}>
              {trips.length} disponible{trips.length > 1 ? "s" : ""}
            </span>
          )}
        </div>

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
            <div style={{ fontSize: "3rem", marginBottom: "16px" }}>⏳</div>
            <p style={{ fontWeight: 700, color: C.noir, marginBottom: "8px" }}>
              Aucune course disponible
            </p>
            <p style={{ color: "#aaa", fontSize: "0.88rem" }}>
              Les nouvelles demandes apparaîtront ici en temps réel.
            </p>
          </div>
        )}

        {trips.map(trip => {
          const alreadySent = sentOffers.has(trip.id)
          return (
            <div key={trip.id} style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "20px",
              marginBottom: "14px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              border: alreadySent ? `1px solid ${C.vert}40` : "1px solid transparent",
            }}>
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

              {/* Prix + bouton */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: C.fond,
                borderRadius: "12px",
                padding: "12px 16px",
              }}>
                <div>
                  <p style={{ fontSize: "0.75rem", color: "#aaa" }}>Prix client</p>
                  <p style={{ fontWeight: 900, fontSize: "1.1rem", color: C.noir }}>
                    {trip.clientPrice} FCFA
                  </p>
                </div>
                <Button
                  onClick={() => !alreadySent && handleOffre(trip)}
                  disabled={alreadySent}
                  style={{
                    background: alreadySent ? C.vert : C.jaune,
                    color: alreadySent ? "#fff" : C.noir,
                    fontWeight: 800,
                    fontSize: "13px",
                    padding: "8px 18px",
                    height: "auto",
                    borderRadius: "100px",
                    cursor: alreadySent ? "default" : "pointer",
                    opacity: 1,
                  }}
                >
                  {alreadySent ? "✓ Offre envoyée" : "Accepter ce prix"}
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      <BottomNav items={NAV_ITEMS} />
    </div>
  )
}