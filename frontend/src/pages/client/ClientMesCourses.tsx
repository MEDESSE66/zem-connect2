import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { pb } from "../../lib/pocketbase"
import { useAuthStore } from "../../store/authStore"
import type { Trip } from "../../types"

export default function ClientMesCourses() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [trips, setTrips] = useState<Trip[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return

    const loadTrips = async () => {
      try {
        const records = await pb.collection("trips").getList(1, 50, {
          filter: `client = "${user.id}"`,
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
      if (e.record.client !== user.id) return
      if (e.action === "create") {
        setTrips((prev) => [e.record as unknown as Trip, ...prev])
      } else if (e.action === "update") {
        setTrips((prev) =>
          prev.map((t) => (t.id === e.record.id ? (e.record as unknown as Trip) : t))
        )
      }
    })

    return () => {
      pb.collection("trips").unsubscribe("*")
    }
  }, [user?.id])

  const statusLabel: Record<string, string> = {
    pending: "En attente",
    active: "Active",
    in_progress: "En cours",
    completed: "Terminée",
    cancelled: "Annulée",
    expired: "Expirée",
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto" }}>
      <h2>Mes courses</h2>
      <button
        onClick={() => navigate("/client")}
        style={{ marginBottom: "1rem", cursor: "pointer" }}
      >
        Retour
      </button>
      {isLoading && <p>Chargement...</p>}
      {!isLoading && trips.length === 0 && <p>Aucune course.</p>}
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
          <p><strong>Prix proposé :</strong> {trip.clientPrice} FCFA</p>
          <p><strong>Statut :</strong> {statusLabel[trip.status] || trip.status}</p>
        </div>
      ))}
    </div>
  )
}