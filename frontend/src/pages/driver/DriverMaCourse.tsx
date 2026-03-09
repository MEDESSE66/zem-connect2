import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { pb } from "../../lib/pocketbase"
import { useAuthStore } from "../../store/authStore"
import type { Trip } from "../../types"

export default function DriverMaCourse() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [trip, setTrip] = useState<Trip | null>(null)
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
        if (records.items.length > 0) {
          setTrip(records.items[0] as unknown as Trip)
        }
      } catch (err) {
        console.error("Erreur chargement course", err)
      } finally {
        setIsLoading(false)
      }
    }

    loadTrip()

    pb.collection("trips").subscribe("*", (e) => {
      if (e.record.conducteur !== user.id) return
      if (e.action === "update") {
        if (e.record.status === "active" || e.record.status === "in_progress") {
          setTrip(e.record as unknown as Trip)
        } else {
          setTrip(null)
        }
      }
    })

    return () => {
      pb.collection("trips").unsubscribe("*")
    }
  }, [user?.id])

  const demarrer = async () => {
    if (!trip) return
    try {
      await pb.collection("trips").update(trip.id, { status: "in_progress" })
    } catch {
      alert("Erreur")
    }
  }

  const terminer = async () => {
    if (!trip) return
    try {
      await pb.collection("trips").update(trip.id, { status: "completed" })
      setTrip(null)
    } catch {
      alert("Erreur")
    }
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto" }}>
      <h2>Ma course</h2>
      <button
        onClick={() => navigate("/driver")}
        style={{ marginBottom: "1rem", cursor: "pointer" }}
      >
        Retour
      </button>
      {isLoading && <p>Chargement...</p>}
      {!isLoading && !trip && <p>Aucune course active.</p>}
      {trip && (
        <div
          style={{
            border: "1px solid #ccc",
            padding: "1rem",
            borderRadius: "8px",
          }}
        >
          <p><strong>De :</strong> {trip.departureAddress}</p>
          <p><strong>À :</strong> {trip.destinationAddress}</p>
          <p><strong>Prix :</strong> {trip.finalPrice} FCFA</p>
          <p><strong>Statut :</strong> {trip.status}</p>

          {trip.status === "active" && (
            <button
              onClick={demarrer}
              style={{ width: "100%", padding: "0.75rem", marginTop: "1rem", cursor: "pointer" }}
            >
              Démarrer la course
            </button>
          )}
          {trip.status === "in_progress" && (
            <button
              onClick={terminer}
              style={{ width: "100%", padding: "0.75rem", marginTop: "1rem", cursor: "pointer" }}
            >
              Terminer la course
            </button>
          )}
        </div>
      )}
    </div>
  )
}