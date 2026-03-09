import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { pb } from "../../lib/pocketbase"
import { useAuthStore } from "../../store/authStore"

export default function ClientNouvelleCourse() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [departureAddress, setDepartureAddress] = useState("")
  const [destinationAddress, setDestinationAddress] = useState("")
  const [clientPrice, setClientPrice] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    setError("")
    if (!departureAddress || !destinationAddress || !clientPrice) {
      setError("Tous les champs sont obligatoires")
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
      })
      navigate("/client/mes-courses")
    } catch {
      setError("Erreur lors de la création de la course")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto" }}>
      <h2>Nouvelle course</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type="text"
        placeholder="Adresse de départ"
        value={departureAddress}
        onChange={(e) => setDepartureAddress(e.target.value)}
        style={{ display: "block", width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
      />
      <input
        type="text"
        placeholder="Adresse de destination"
        value={destinationAddress}
        onChange={(e) => setDestinationAddress(e.target.value)}
        style={{ display: "block", width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
      />
      <input
        type="number"
        placeholder="Votre prix (FCFA)"
        value={clientPrice}
        onChange={(e) => setClientPrice(e.target.value)}
        style={{ display: "block", width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
      />
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        style={{ width: "100%", padding: "0.75rem", cursor: "pointer" }}
      >
        {isLoading ? "Création..." : "Demander une course"}
      </button>
      <button
        onClick={() => navigate("/client")}
        style={{ width: "100%", padding: "0.75rem", marginTop: "0.5rem", cursor: "pointer" }}
      >
        Retour
      </button>
    </div>
  )
}