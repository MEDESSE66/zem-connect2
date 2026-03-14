import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { pb } from "../../lib/pocketbase"
import { useAuthStore } from "../../store/authStore"
import { Button } from "@/components/ui/button"
import BottomNav from "../../components/BottomNav"
import { motion } from "motion/react"
import { Home, Bike, ArrowLeft, MapPin, Flag, Hourglass } from "lucide-react"
import type { Trip, Offre } from "../../types"

const NAV_ITEMS = [
  { icon: <Home className="size-[22px]" />, label: "Accueil", path: "/client" },
  { icon: <Bike className="size-[22px]" />, label: "Courses", path: "/client/mes-courses" },
]

const STATUS_CONFIG: Record<string, { label: string; colorClass: string; bgClass: string }> = {
  pending:     { label: "En attente",  colorClass: "text-brand-orange",  bgClass: "bg-brand-orange/10"     },
  active:      { label: "Active",      colorClass: "text-brand-green",   bgClass: "bg-brand-green/10"      },
  in_progress: { label: "En cours",    colorClass: "text-blue-500",      bgClass: "bg-blue-500/10"         },
  completed:   { label: "Terminée",    colorClass: "text-gray-500",      bgClass: "bg-gray-100"            },
  cancelled:   { label: "Annulée",     colorClass: "text-red-500",       bgClass: "bg-red-500/10"          },
  expired:     { label: "Expirée",     colorClass: "text-gray-400",      bgClass: "bg-gray-50"             },
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
    <div className="min-h-svh bg-brand-bg pb-20 font-sans">

      {/* Header */}
      <div className="flex items-center gap-3.5 bg-brand-black px-6 pt-5 pb-6">
        <button
          onClick={() => navigate("/client")}
          className="flex size-[38px] shrink-0 items-center justify-center rounded-[10px] border border-white/12 bg-white/8 text-white"
        >
          <ArrowLeft className="size-[18px]" />
        </button>
        <div>
          <p className="text-[0.8rem] text-white/50">Client</p>
          <p className="text-[1.05rem] font-extrabold text-white">Mes courses</p>
        </div>
      </div>

      {/* Contenu */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="px-6 pt-6"
      >
        {isLoading && (
          <div className="py-12 text-center text-gray-400">Chargement...</div>
        )}

        {!isLoading && trips.length === 0 && (
          <div className="rounded-[20px] bg-white px-6 py-12 text-center shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
            <Bike className="mx-auto mb-4 size-12 text-brand-yellow" />
            <p className="mb-2 font-bold text-brand-black">Aucune course pour l'instant</p>
            <p className="mb-5 text-[0.88rem] text-gray-400">Commandez votre premier zémidjan !</p>
            <Button
              onClick={() => navigate("/client/nouvelle-course")}
              className="h-auto rounded-full bg-brand-yellow px-6 py-2.5 font-extrabold text-brand-black hover:bg-brand-yellow/90"
            >
              Commander une course
            </Button>
          </div>
        )}

        {trips.map(trip => {
          const sc = STATUS_CONFIG[trip.status] || { label: trip.status, colorClass: "text-gray-500", bgClass: "bg-gray-100" }
          return (
            <div key={trip.id} className="mb-4 rounded-[20px] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
              {/* Status badge */}
              <div className={`mb-3.5 inline-flex items-center rounded-full px-3 py-1 text-[0.78rem] font-bold ${sc.bgClass} ${sc.colorClass}`}>
                {sc.label}
              </div>

              {/* Trajet */}
              <div className="mb-3.5 flex flex-col gap-2">
                <div className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-brand-yellow" />
                  <div>
                    <p className="text-[0.75rem] text-gray-400">Départ</p>
                    <p className="text-[0.92rem] font-semibold text-brand-black">{trip.departureAddress}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Flag className="mt-0.5 size-4 shrink-0 text-brand-green" />
                  <div>
                    <p className="text-[0.75rem] text-gray-400">Destination</p>
                    <p className="text-[0.92rem] font-semibold text-brand-black">{trip.destinationAddress}</p>
                  </div>
                </div>
              </div>

              {/* Prix */}
              <div className="mb-3.5 flex gap-3 rounded-[10px] bg-brand-bg p-3">
                <div className="flex-1">
                  <p className="text-[0.75rem] text-gray-400">Prix proposé</p>
                  <p className="font-extrabold text-brand-black">{trip.clientPrice} FCFA</p>
                </div>
                {trip.finalPrice && (
                  <div className="flex-1">
                    <p className="text-[0.75rem] text-gray-400">Prix final</p>
                    <p className="font-extrabold text-brand-green">{trip.finalPrice} FCFA</p>
                  </div>
                )}
              </div>

              {/* Offres */}
              {trip.status === "pending" && offres[trip.id]?.length > 0 && (
                <div>
                  <p className="mb-2.5 text-[0.88rem] font-bold text-brand-black">
                    {offres[trip.id].length} offre{offres[trip.id].length > 1 ? "s" : ""} reçue{offres[trip.id].length > 1 ? "s" : ""}
                  </p>
                  {offres[trip.id].map(offre => (
                    <div key={offre.id} className="mb-2 flex items-center justify-between rounded-xl border border-brand-yellow/20 bg-brand-yellow/5 px-4 py-3">
                      <div>
                        <p className="text-[0.78rem] text-gray-400">Offre conducteur</p>
                        <p className="text-base font-extrabold text-brand-black">{offre.proposedPrice} FCFA</p>
                      </div>
                      <Button
                        onClick={() => acceptOffre(offre)}
                        disabled={isAccepting === offre.id}
                        className="h-auto rounded-full bg-brand-yellow px-4 py-2 text-[13px] font-extrabold text-brand-black hover:bg-brand-yellow/90 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isAccepting === offre.id ? "..." : "Accepter"}
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {trip.status === "pending" && (!offres[trip.id] || offres[trip.id].length === 0) && (
                <p className="flex items-center justify-center gap-1.5 py-2 text-center text-[0.82rem] text-gray-400">
                  <Hourglass className="size-3.5" /> En attente d'offres des conducteurs...
                </p>
              )}
            </div>
          )
        })}
      </motion.div>

      <BottomNav items={NAV_ITEMS} />
    </div>
  )
}