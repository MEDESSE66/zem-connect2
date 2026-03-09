import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { pb } from "../../lib/pocketbase"
import type { Trip } from "../../types"

export default function AdminCourses() {
  const navigate = useNavigate()
  const [trips, setTrips] = useState<Trip[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    pb.collection("trips").getList(1, 100, {
      sort: "-created",
      requestKey: null,
    }).then((r) => {
      setTrips(r.items as unknown as Trip[])
    }).finally(() => setIsLoading(false))
  }, [])

  const statusLabel: Record<string, string> = {
    pending: "En attente",
    active: "Active",
    in_progress: "En cours",
    completed: "Terminée",
    cancelled: "Annulée",
    expired: "Expirée",
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "500px", margin: "0 auto" }}>
      <h2>Courses</h2>
      <button onClick={() => navigate("/admin")} style={{ marginBottom: "1rem", cursor: "pointer" }}>Retour</button>
      {isLoading && <p>Chargement...</p>}
      {trips.map((trip) => (
        <div key={trip.id} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem", borderRadius: "8px" }}>
          <p><strong>De :</strong> {trip.departureAddress}</p>
          <p><strong>À :</strong> {trip.destinationAddress}</p>
          <p><strong>Prix :</strong> {trip.clientPrice} FCFA</p>
          <p><strong>Statut :</strong> {statusLabel[trip.status] || trip.status}</p>
        </div>
      ))}
    </div>
  )
}