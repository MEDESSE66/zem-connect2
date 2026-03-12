import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { pb } from "../../lib/pocketbase"
import { useAuthStore } from "../../store/authStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import BottomNav from "../../components/BottomNav"

const C = {
  jaune:  "#F5C518",
  noir:   "#1A1A2E",
  orange: "#E85D04",
  fond:   "#F8F9FA",
}

const NAV_ITEMS = [
  { icon: "🏠", label: "Accueil", path: "/client" },
  { icon: "🏍️", label: "Courses", path: "/client/mes-courses" },
]

export default function ClientNouvelleCourse() {
  const { user }                                    = useAuthStore()
  const navigate                                    = useNavigate()
  const [departureAddress, setDepartureAddress]     = useState("")
  const [destinationAddress, setDestinationAddress] = useState("")
  const [clientPrice, setClientPrice]               = useState("")
  const [error, setError]                           = useState("")
  const [isLoading, setIsLoading]                   = useState(false)

  const handleSubmit = async () => {
    setError("")
    if (!departureAddress || !destinationAddress || !clientPrice) {
      setError("Tous les champs sont obligatoires.")
      return
    }
    if (isNaN(parseFloat(clientPrice)) || parseFloat(clientPrice) <= 0) {
      setError("Le prix doit être un nombre positif.")
      return
    }
    setIsLoading(true)
    try {
      const expiresAt = new Date(Date.now() + 2 * 60 * 1000).toISOString()
      await pb.collection("trips").create({
        client: user?.id,
        status: "pending",
        departureAddress,
        destinationAddress,
        departureLat: 0,
        departureLng: 0,
        destinationLat: 0,
        destinationLng: 0,
        clientPrice: parseFloat(clientPrice),
        expiresAt,
      }, { requestKey: null })
      navigate("/client/mes-courses")
    } catch {
      setError("Erreur lors de la création de la course. Réessayez.")
    } finally {
      setIsLoading(false)
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
          <p style={{ color: "#fff", fontWeight: 800, fontSize: "1.05rem" }}>Nouvelle course</p>
        </div>
      </div>

      {/* Formulaire */}
      <div style={{ padding: "24px" }}>

        {/* Erreur */}
        {error && (
          <div style={{
            background: "rgba(239,35,60,0.08)",
            border: "1px solid rgba(239,35,60,0.25)",
            color: "#e8364a",
            borderRadius: "12px",
            padding: "12px 16px",
            fontSize: "0.88rem",
            marginBottom: "20px",
          }}>
            {error}
          </div>
        )}

        {/* Carte formulaire */}
        <div style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "24px",
          boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}>

          {/* Départ */}
          <div>
            <Label style={{
              color: "#444", fontSize: "0.88rem",
              fontWeight: 700, marginBottom: "8px", display: "block",
            }}>
              📍 Point de départ
            </Label>
            <Input
              type="text"
              placeholder="Ex: Carrefour Cadjehoun"
              value={departureAddress}
              onChange={e => setDepartureAddress(e.target.value)}
              style={{
                height: "48px", borderRadius: "10px",
                fontSize: "0.95rem", border: "1.5px solid #e5e7eb",
              }}
            />
          </div>

          {/* Séparateur */}
          <div style={{
            display: "flex", alignItems: "center", gap: "12px",
          }}>
            <div style={{ flex: 1, height: "1px", background: "#f0f0f0" }} />
            <div style={{
              width: "32px", height: "32px", borderRadius: "50%",
              background: `${C.jaune}20`, border: `2px solid ${C.jaune}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "14px",
            }}>↓</div>
            <div style={{ flex: 1, height: "1px", background: "#f0f0f0" }} />
          </div>

          {/* Destination */}
          <div>
            <Label style={{
              color: "#444", fontSize: "0.88rem",
              fontWeight: 700, marginBottom: "8px", display: "block",
            }}>
              🏁 Destination
            </Label>
            <Input
              type="text"
              placeholder="Ex: Marché Dantokpa"
              value={destinationAddress}
              onChange={e => setDestinationAddress(e.target.value)}
              style={{
                height: "48px", borderRadius: "10px",
                fontSize: "0.95rem", border: "1.5px solid #e5e7eb",
              }}
            />
          </div>

          {/* Prix */}
          <div>
            <Label style={{
              color: "#444", fontSize: "0.88rem",
              fontWeight: 700, marginBottom: "8px", display: "block",
            }}>
              💰 Votre prix (FCFA)
            </Label>
            <div style={{ position: "relative" }}>
              <Input
                type="number"
                placeholder="Ex: 500"
                value={clientPrice}
                onChange={e => setClientPrice(e.target.value)}
                style={{
                  height: "48px", borderRadius: "10px",
                  fontSize: "0.95rem", border: "1.5px solid #e5e7eb",
                  paddingRight: "70px",
                }}
              />
              <span style={{
                position: "absolute", right: "14px",
                top: "50%", transform: "translateY(-50%)",
                color: "#aaa", fontSize: "0.85rem", fontWeight: 600,
              }}>FCFA</span>
            </div>
            <p style={{ color: "#aaa", fontSize: "0.78rem", marginTop: "6px" }}>
              Les conducteurs feront leurs offres autour de ce prix.
            </p>
          </div>
        </div>

        {/* Bouton submit */}
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          style={{
            width: "100%",
            background: C.jaune,
            color: C.noir,
            fontWeight: 800,
            fontSize: "16px",
            height: "52px",
            borderRadius: "14px",
            marginTop: "20px",
            fontFamily: "Inter, sans-serif",
            opacity: isLoading ? 0.7 : 1,
            cursor: isLoading ? "not-allowed" : "pointer",
            boxShadow: `0 4px 20px ${C.jaune}40`,
          }}
        >
          {isLoading ? "Envoi en cours..." : "🏍️ Demander une course"}
        </Button>

        {/* Info expiry */}
        <p style={{
          textAlign: "center", color: "#aaa",
          fontSize: "0.8rem", marginTop: "12px",
        }}>
          ⏱ Votre demande expire après 2 minutes sans réponse.
        </p>
      </div>

      <BottomNav items={NAV_ITEMS} />
    </div>
  )
}