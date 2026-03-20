import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { pb } from "../../lib/pocketbase"
import { toast } from "sonner"
import { useAuthStore } from "../../store/authStore"
import { Button } from "@/components/ui/button"
import BottomNav from "../../components/BottomNav"
import { motion } from "motion/react"
import { Home, Bike, ArrowLeft, MapPin, Flag, Hourglass, XCircle } from "lucide-react"
import type { Trip, Offre } from "../../types"

const NAV_ITEMS = [
  { icon: <Home className="size-[22px]" />, label: "Accueil", path: "/client" },
  { icon: <Bike className="size-[22px]" />, label: "Courses", path: "/client/mes-courses" },
]

const STATUS_CONFIG: Record<string, { label: string; colorClass: string; bgClass: string }> = {
  completed:   { label: "Terminée",   colorClass: "text-brand-green",  bgClass: "bg-brand-green/10"  },
  cancelled:   { label: "Annulée",    colorClass: "text-red-500",      bgClass: "bg-red-500/10"      },
  expired:     { label: "Expirée",    colorClass: "text-gray-400",     bgClass: "bg-gray-100"        },
  in_progress: { label: "En cours",   colorClass: "text-blue-500",     bgClass: "bg-blue-500/10"     },
  accepte:     { label: "Acceptée",   colorClass: "text-brand-orange", bgClass: "bg-brand-orange/10" },
  pending:     { label: "En attente", colorClass: "text-brand-orange", bgClass: "bg-brand-orange/10" },
}

export default function ClientMesCourses() {
  const { user }                          = useAuthStore()
  const navigate                          = useNavigate()
  const [trips, setTrips]                 = useState<Trip[]>([])
  const [offres, setOffres]               = useState<Record<string, Offre[]>>({})
  const [isLoading, setIsLoading]         = useState(true)
  const [isAccepting, setIsAccepting]     = useState<string | null>(null)
  const [isCancelling, setIsCancelling]   = useState<string | null>(null)

  // États pour la notation
  const [showRatingDialog, setShowRatingDialog] = useState(false)
  const [ratingTripId, setRatingTripId]         = useState<string | null>(null)
  const [ratingTargetId, setRatingTargetId]     = useState<string | null>(null)
  const [ratingScore, setRatingScore]           = useState(0)
  const [ratingComment, setRatingComment]       = useState("")
  const [isRating, setIsRating]                 = useState(false)

  useEffect(() => {
    if (!user?.id) return

    const checkAndShowRating = async (t: Trip) => {
      if (!t.conducteur) return
      try {
        const records = await pb.collection("notations").getList(1, 1, {
          filter: `auteur = "${user.id}" && trip = "${t.id}"`,
          requestKey: null,
        })
        if (records.items.length === 0) {
          setRatingTripId(t.id)
          setRatingTargetId(t.conducteur)
          setRatingScore(0)
          setRatingComment("")
          setShowRatingDialog(true)
        }
      } catch (err) {
        console.error("Erreur vérification notation", err)
      }
    }

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
          filter: `client = "${user.id}" && (status != "pending" || expiresAt > "${new Date().toISOString()}")`,
          sort: "-created",
          requestKey: null,
        })
        const tripList = records.items as unknown as Trip[]
        setTrips(tripList)
        for (const trip of tripList) {
          if (trip.status === "pending") loadOffres(trip.id)
          if (trip.status === "completed") checkAndShowRating(trip)
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
      else if (e.action === "update") {
        setTrips(prev => prev.map(t => t.id === e.record.id ? e.record as unknown as Trip : t))
        if (e.record.status === "completed") {
          checkAndShowRating(e.record as unknown as Trip)
        }
      }
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
        status: "accepte",
        conducteur: offre.conducteur,
        finalPrice: offre.proposedPrice,
      }, { requestKey: null })
    } catch (err) {
      console.error("Erreur acceptation offre", err)
      toast.error("Erreur lors de l'acceptation de l'offre.")
    } finally {
      setIsAccepting(null)
    }
  }

  const annulerCourse = async (tripId: string) => {
    if (!window.confirm("Annuler cette course ?")) return
    setIsCancelling(tripId)
    try {
      await pb.collection("trips").update(tripId, { status: "cancelled" }, { requestKey: null })
    } catch (err) {
      console.error("Erreur annulation course", err)
      toast.error("Erreur lors de l'annulation.")
    } finally {
      setIsCancelling(null)
    }
  }

  const submitRating = async () => {
    if (!user?.id || !ratingTargetId || !ratingTripId || ratingScore === 0) return
    setIsRating(true)
    try {
      await pb.collection("notations").create({
        auteur: user.id,
        target: ratingTargetId,
        trip: ratingTripId,
        score: ratingScore,
        commentaire: ratingComment || undefined
      }, { requestKey: null })
      setShowRatingDialog(false)
      toast.success("Merci pour votre avis !")
    } catch (err) {
      console.error("Erreur envoi notation", err)
      toast.error("Erreur lors de l'envoi de la notation.")
    } finally {
      setIsRating(false)
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
              <div className="mb-3.5 flex items-center justify-between">
                <div className={`inline-flex items-center rounded-full px-3 py-1 text-[0.78rem] font-bold ${sc.bgClass} ${sc.colorClass}`}>
                  {sc.label}
                </div>
                <p className="text-[0.72rem] text-gray-400">
                  {new Date(trip.created).toLocaleDateString("fr-FR", {
                    day: "2-digit", month: "short",
                    hour: "2-digit", minute: "2-digit"
                  })}
                </p>
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

              {/* Bouton Annuler — visible uniquement si pending ou accepte */}
              {(trip.status === "pending" || trip.status === "accepte") && (
                <button
                  onClick={() => annulerCourse(trip.id)}
                  disabled={isCancelling === trip.id}
                  className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-[10px] border border-red-500/20 bg-red-500/6 py-2.5 text-[0.85rem] font-bold text-red-500 transition-colors hover:bg-red-500/12 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <XCircle className="size-4" />
                  {isCancelling === trip.id ? "Annulation..." : "Annuler la course"}
                </button>
              )}
            </div>
          )
        })}
      </motion.div>

      <BottomNav items={NAV_ITEMS} />

      {/* Dialog de notation */}
      {showRatingDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-[24px] bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-center text-lg font-extrabold text-brand-black">Notez votre conducteur</h3>
            
            <div className="mb-6 flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => setRatingScore(star)}
                  className={`text-3xl transition-transform hover:scale-110 ${
                    star <= ratingScore ? "text-brand-yellow" : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              value={ratingComment}
              onChange={e => setRatingComment(e.target.value)}
              placeholder="Votre commentaire (optionnel)"
              className="mb-6 w-full rounded-xl border border-gray-200 p-3 text-[0.9rem] outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow"
              rows={3}
            />

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowRatingDialog(false)}
                className="flex-1 rounded-xl font-bold"
              >
                Passer
              </Button>
              <Button
                onClick={submitRating}
                disabled={ratingScore === 0 || isRating}
                className="flex-1 rounded-xl bg-brand-yellow font-extrabold text-brand-black hover:bg-brand-yellow/90"
              >
                {isRating ? "Envoi..." : "Envoyer"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}