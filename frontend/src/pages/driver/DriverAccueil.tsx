import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { pb } from "../../lib/pocketbase"
import { useAuthStore } from "../../store/authStore"
import type { Trip } from "../../types"

export default function DriverAccueil() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [trips, setTrips] = useState<Trip[]>([])
  const [isLoading, setIsLoading] = useState(true)

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

    pb.collection("trips").subscribe("*", (e) => {
      if (e.action === "create" && e.record.status === "pending") {
        setTrips((prev) => [e.record as unknown as Trip, ...prev])
      } else if (e.action === "update") {
        setTrips((prev) => prev.filter((t) => t.id !== e.record.id || e.record.status === "pending"))
      }
    })

    return () => {
      pb.collection("trips").unsubscribe("*")
    }
  }, [user?.id])

  const handleOffre = async (trip: Trip) => {
    try {
      await pb.collection("offres").create({
        trip: trip.id,
        conducteur: user?.id,
        proposedPrice: trip.clientPrice,
        status: "pending",
        isCounterOffer: false,
      })
      alert("Offre envoyée")
    } catch {
      alert("Erreur lors de l'envoi de l'offre")
    }
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto" }}>
      <h2>Courses disponibles</h2>
      <button
        onClick={() => navigate("/driver/ma-course")}
        style={{ display: "block", width: "100%", padding: "0.75rem", marginBottom: "1rem", cursor: "pointer" }}
      >
        Ma course active
      </button>
      <button
        onClick={() => { logout(); navigate("/login") }}
        style={{ marginBottom: "1rem", cursor: "pointer" }}
      >
        Déconnexion
      </button>
      {isLoading && <p>Chargement...</p>}
      {!isLoading && trips.length === 0 && <p>Aucune course disponible.</p>}
      {trips.map((trip) => (
        <div
          key={trip.id}
          style={{
            border: "1px solid #ccc",
            padding: "1rem",
            marginBottom: "1rem",
            borderRadius: "8px",
          }}
        >
          <p><strong>De :</strong> {trip.departureAddress}</p>
          <p><strong>À :</strong> {trip.destinationAddress}</p>
          <p><strong>Prix client :</strong> {trip.clientPrice} FCFA</p>
          <button
            onClick={() => handleOffre(trip)}
            style={{ width: "100%", padding: "0.5rem", cursor: "pointer" }}
          >
            Accepter ce prix
          </button>
        </div>
      ))}
    </div>
  )
}