import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { pb } from "../../lib/pocketbase"
import { useAuthStore } from "../../store/authStore"
import { Button } from "@/components/ui/button"
import BottomNav from "../../components/BottomNav"
import { motion } from "motion/react"
import { Home, Bike, ClipboardList, ArrowLeft, MapPin, Flag, Play, CheckCircle, Clock } from "lucide-react"
import type { Trip, User } from "../../types"

const NAV_ITEMS = [
  { icon: <Home className="size-[22px]" />,           label: "Accueil",    path: "/driver" },
  { icon: <Bike className="size-[22px]" />,           label: "Ma course",  path: "/driver/ma-course" },
  { icon: <ClipboardList className="size-[22px]" />,  label: "Historique", path: "/driver/historique" },
]

export default function DriverMaCourse() {
  const { user }                  = useAuthStore()
  const navigate                  = useNavigate()
  const [trip, setTrip]           = useState<Trip | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // États pour la notation
  const [showRatingDialog, setShowRatingDialog] = useState(false)
  const [ratingTripId, setRatingTripId]         = useState<string | null>(null)
  const [ratingTargetId, setRatingTargetId]     = useState<string | null>(null)
  const [ratingScore, setRatingScore]           = useState(0)
  const [ratingComment, setRatingComment]       = useState("")
  const [isRating, setIsRating]                 = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const checkAndShowRating = async (t: Trip) => {
    if (!t.client) return
    try {
      const records = await pb.collection("notations").getList(1, 1, {
        filter: `auteur = "${user?.id}" && trip = "${t.id}"`,
        requestKey: null,
      })
      if (records.items.length === 0) {
        setRatingTripId(t.id)
        setRatingTargetId(t.client)
        setRatingScore(0)
        setRatingComment("")
        setShowRatingDialog(true)
      }
    } catch (err) {
      console.error("Erreur vérification notation", err)
    }
  }

  useEffect(() => {
    if (!user?.id) return

    const loadTrip = async () => {
      try {
        const records = await pb.collection("trips").getList(1, 1, {
          filter: `conducteur = "${user.id}" && (status = "accepte" || status = "in_progress")`,
          sort: "-created",
          requestKey: null,
        })
        if (records.items.length > 0) setTrip(records.items[0] as unknown as Trip)
      } catch (err) {
        console.error("Erreur chargement course", err)
      } finally {
        setIsLoading(false)
      }
    }

    loadTrip()

    pb.collection("trips").subscribe("*", e => {
      if (e.record.conducteur !== user.id) return
      if (e.action === "update") {
        if (e.record.status === "accepte" || e.record.status === "in_progress") {
          setTrip(e.record as unknown as Trip)
        } else {
          setTrip(null)
          if (e.record.status === "completed") {
            checkAndShowRating(e.record as unknown as Trip)
          }
        }
      }
    }, { requestKey: null })

    return () => { pb.collection("trips").unsubscribe("*") }
  }, [user?.id])

  const demarrer = async () => {
    if (!trip || !user?.id) return
    try {
      await pb.collection("trips").update(trip.id, { status: "in_progress" }, { requestKey: null })
      // Rafraîchit le wallet depuis PocketBase
      const freshUser = await pb.collection("users").getOne(
        user.id,
        { requestKey: null }
      )
      useAuthStore.setState({ user: freshUser as unknown as User })
    } catch {
      toast.error("Erreur lors du démarrage.")
    }
  }

  const handleTerminerClick = () => {
    setShowConfirmDialog(true)
  }

  const terminer = async () => {
    setShowConfirmDialog(false)
    if (!trip) return
    try {
      await pb.collection("trips").update(
        trip.id, 
        { status: "completed" }, 
        { requestKey: null }
      )
      const freshUser = await pb.collection("users").getOne(
        user!.id, 
        { requestKey: null }
      )
      useAuthStore.setState({ user: freshUser as unknown as User })
      await checkAndShowRating(trip)
      setTrip(null)
    } catch {
      toast.error("Erreur lors de la fin de course.")
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
          onClick={() => navigate("/driver")}
          className="flex size-[38px] shrink-0 items-center justify-center rounded-[10px] border border-white/12 bg-white/8 text-white"
        >
          <ArrowLeft className="size-[18px]" />
        </button>
        <div>
          <p className="text-[0.8rem] text-white/50">Conducteur</p>
          <p className="text-[1.05rem] font-extrabold text-white">Ma course active</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="px-6 pt-6"
      >
        {isLoading && (
          <div className="py-12 text-center text-gray-400">Chargement...</div>
        )}

        {!isLoading && !trip && (
          <div className="rounded-[20px] bg-white px-6 py-12 text-center shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
            <Bike className="mx-auto mb-4 size-12 text-brand-yellow" />
            <p className="mb-2 font-bold text-brand-black">Aucune course active</p>
            <p className="mb-5 text-[0.88rem] text-gray-400">Acceptez une course depuis l'accueil.</p>
            <Button
              onClick={() => navigate("/driver")}
              className="h-auto rounded-full bg-brand-yellow px-6 py-2.5 font-extrabold text-brand-black hover:bg-brand-yellow/90"
            >
              Voir les courses
            </Button>
          </div>
        )}

        {trip && (
          <div>
            {/* Statut */}
            <div className={`mb-5 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[0.82rem] font-bold ${
              trip.status === "accepte"
                ? "bg-brand-yellow/12 text-brand-orange"
                : "bg-brand-green/12 text-brand-green"
            }`}>
              {trip.status === "accepte"
                ? <><Clock className="size-3.5" /> En attente de démarrage</>
                : <><Play className="size-3.5" /> En cours</>
              }
            </div>

            {/* Carte course */}
            <div className="mb-5 rounded-[20px] bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.07)]">
              <div className="mb-5 flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-brand-yellow/12">
                    <MapPin className="size-4 text-brand-yellow" />
                  </div>
                  <div>
                    <p className="mb-0.5 text-[0.75rem] text-gray-400">Point de départ</p>
                    <p className="font-bold text-brand-black">{trip.departureAddress}</p>
                  </div>
                </div>

                <div className="ml-[18px] h-4 border-l-2 border-dashed border-brand-yellow/25" />

                <div className="flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-brand-green/12">
                    <Flag className="size-4 text-brand-green" />
                  </div>
                  <div>
                    <p className="mb-0.5 text-[0.75rem] text-gray-400">Destination</p>
                    <p className="font-bold text-brand-black">{trip.destinationAddress}</p>
                  </div>
                </div>
              </div>

              {/* Prix */}
              <div className="flex justify-between rounded-xl bg-brand-bg px-4 py-3.5">
                <div>
                  <p className="text-[0.75rem] text-gray-400">Prix de la course</p>
                  <p className="text-[1.2rem] font-black text-brand-black">{trip.finalPrice} FCFA</p>
                </div>
                <div>
                  <p className="text-[0.75rem] text-gray-400">Après commission</p>
                  <p className="text-[1.2rem] font-black text-brand-green">{(trip.finalPrice ?? 0) - 25} FCFA</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            {trip.status === "accepte" && (
              <Button
                onClick={demarrer}
                className="h-[52px] w-full rounded-[14px] bg-brand-yellow text-base font-extrabold text-brand-black shadow-[0_4px_20px_var(--brand-yellow)40] hover:bg-brand-yellow/90"
              >
                <Play className="mr-2 size-5" /> Démarrer la course
              </Button>
            )}

            {trip.status === "in_progress" && (
              <Button
                onClick={handleTerminerClick}
                className="h-[52px] w-full rounded-[14px] bg-brand-green text-base font-extrabold text-white shadow-[0_4px_20px_var(--brand-green)40] hover:bg-brand-green/90"
              >
                <CheckCircle className="mr-2 size-5" /> Terminer la course
              </Button>
            )}
          </div>
        )}
      </motion.div>

      <BottomNav items={NAV_ITEMS} />

      {/* Dialog de confirmation de fin de course */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-[24px] bg-white p-6 shadow-xl">
            <h3 className="mb-2 text-center text-lg font-extrabold text-brand-black">
              Terminer la course ?
            </h3>
            <p className="mb-6 text-center text-[0.88rem] text-gray-500">
              Confirmez la fin de cette course.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 rounded-xl font-bold"
              >
                Annuler
              </Button>
              <Button
                onClick={terminer}
                className="flex-1 rounded-xl bg-brand-green font-extrabold text-white"
              >
                Confirmer
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog de notation */}
      {showRatingDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-[24px] bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-center text-lg font-extrabold text-brand-black">Notez votre client</h3>
            
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