import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { pb } from "../../lib/pocketbase"
import { useAuthStore } from "../../store/authStore"
import type { Trip } from "../../types"

export default function DriverHistorique() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [trips, setTrips] = useState<Trip[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return
    pb.collection("trips").getList(1, 50, {
      filter: `conducteur = "${user.id}" && (status = "completed" || status = "cancelled")`,
      sort: "-created",
      requestKey: null,
    }).then((records) => {
      setTrips(records.items as unknown as Trip[])
    }).catch((err) => {
      console.error(err)
    }).finally(() => {
      setIsLoading(false)
    })
  }, [user?.id])

  const statusLabel: Record<string, string> = {
    completed: "Terminée",
    cancelled: "Annulée",
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto" }}>
      <h2>Historique</h2>
      <button onClick={() => navigate("/driver")} style={{ marginBottom: "1rem", cursor: "pointer" }}>
        Retour
      </button>
      {isLoading && <p>Chargement...</p>}
      {!isLoading && trips.length === 0 && <p>Aucune course.</p>}
      {trips.map((trip) => (
        <div key={trip.id} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem", borderRadius: "8px" }}>
          <p><strong>De :</strong> {trip.departureAddress}</p>
          <p><strong>À :</strong> {trip.destinationAddress}</p>
          <p><strong>Prix :</strong> {trip.finalPrice} FCFA</p>
          <p><strong>Statut :</strong> {statusLabel[trip.status] || trip.status}</p>
        </div>
      ))}
    </div>
  )
}