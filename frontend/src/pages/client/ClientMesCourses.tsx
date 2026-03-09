import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { pb } from "../../lib/pocketbase"
import { useAuthStore } from "../../store/authStore"
import type { Trip, Offre } from "../../types"

export default function ClientMesCourses() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [trips, setTrips] = useState<Trip[]>([])
  const [offres, setOffres] = useState<Record<string, Offre[]>>({})
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
        const tripList = records.items as unknown as Trip[]
        setTrips(tripList)

        // Charger les offres pour chaque trip pending
        for (const trip of tripList) {
          if (trip.status === "pending") {
            loadOffres(trip.id)
          }
        }
      } catch (err) {
        console.error("Erreur chargement courses", err)
      } finally {
        setIsLoading(false)
      }
    }

    const loadOffres = async (tripId: string) => {
      try {
        const records = await pb.collection("offres").getList(1, 50, {
          filter: `trip = "${tripId}" && status = "pending"`,
          sort: "-created",
          requestKey: null,
        })
        setOffres((prev) => ({
          ...prev,
          [tripId]: records.items as unknown as Offre[],
        }))
      } catch (err) {
        console.error("Erreur chargement offres", err)
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

    pb.collection("offres").subscribe("*", (e) => {
      if (e.action === "create") {
        setOffres((prev) => ({
          ...prev,
          [e.record.trip]: [
            e.record as unknown as Offre,
            ...(prev[e.record.trip] || []),
          ],
        }))
      }
    })

    return () => {
      pb.collection("trips").unsubscribe("*")
      pb.collection("offres").unsubscribe("*")
    }
  }, [user?.id])

  const acceptOffre = async (offre: Offre) => {
    try {
      // Accepter l'offre
      await pb.collection("offres").update(offre.id, { status: "accepted" })
      // Mettre à jour le trip
      await pb.collection("trips").update(offre.trip, {
        status: "active",
        conducteur: offre.conducteur,
        finalPrice: offre.proposedPrice,
      })
    } catch (err) {
      console.error("Erreur acceptation offre", err)
      alert("Erreur lors de l'acceptation de l'offre")
    }
  }

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

          {trip.status === "pending" && offres[trip.id]?.length > 0 && (
            <div style={{ marginTop: "1rem" }}>
              <strong>Offres reçues :</strong>
              {offres[trip.id].map((offre) => (
                <div
                  key={offre.id}
                  style={{
                    border: "1px solid #aaa",
                    padding: "0.5rem",
                    marginTop: "0.5rem",
                    borderRadius: "4px",
                  }}
                >
                  <p>Prix proposé : {offre.proposedPrice} FCFA</p>
                  <button
                    onClick={() => acceptOffre(offre)}
                    style={{ width: "100%", padding: "0.5rem", cursor: "pointer" }}
                  >
                    Accepter cette offre
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}