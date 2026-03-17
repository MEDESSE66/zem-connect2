import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { pb } from "../../lib/pocketbase"
import { useAuthStore } from "../../store/authStore"
import { Button } from "@/components/ui/button"
import BottomNav from "../../components/BottomNav"
import { motion } from "motion/react"
import { Home, Bike, ClipboardList, ArrowLeft, MapPin, Flag, Play, CheckCircle, Clock } from "lucide-react"
import type { Trip } from "../../types"

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
        }
      }
    }, { requestKey: null })

    return () => { pb.collection("trips").unsubscribe("*") }
  }, [user?.id])

  const demarrer = async () => {
    if (!trip) return
    try {
      await pb.collection("trips").update(trip.id, { status: "in_progress" }, { requestKey: null })
    } catch {
      alert("Erreur lors du démarrage.")
    }
  }

  const terminer = async () => {
    if (!trip) return
    if (!window.confirm("Confirmer la fin de cette course ?")) return
    try {
      await pb.collection("trips").update(trip.id, { status: "completed" }, { requestKey: null })
      setTrip(null)
    } catch {
      alert("Erreur lors de la fin de course.")
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
                onClick={terminer}
                className="h-[52px] w-full rounded-[14px] bg-brand-green text-base font-extrabold text-white shadow-[0_4px_20px_var(--brand-green)40] hover:bg-brand-green/90"
              >
                <CheckCircle className="mr-2 size-5" /> Terminer la course
              </Button>
            )}
          </div>
        )}
      </motion.div>

      <BottomNav items={NAV_ITEMS} />
    </div>
  )
}