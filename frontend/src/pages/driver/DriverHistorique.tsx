import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { pb } from "../../lib/pocketbase"
import { useAuthStore } from "../../store/authStore"
import BottomNav from "../../components/BottomNav"
import { motion } from "motion/react"
import { Home, Bike, ClipboardList, ArrowLeft, MapPin, Flag, Check, X } from "lucide-react"
import type { Trip } from "../../types"

const NAV_ITEMS = [
  { icon: <Home className="size-[22px]" />,           label: "Accueil",    path: "/driver" },
  { icon: <Bike className="size-[22px]" />,           label: "Ma course",  path: "/driver/ma-course" },
  { icon: <ClipboardList className="size-[22px]" />,  label: "Historique", path: "/driver/historique" },
]

export default function DriverHistorique() {
  const { user }                  = useAuthStore()
  const navigate                  = useNavigate()
  const [trips, setTrips]         = useState<Trip[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalGagne, setTotalGagne] = useState(0)

  useEffect(() => {
    if (!user?.id) return
    pb.collection("trips").getList(1, 50, {
      filter: `conducteur = "${user.id}" && (status = "completed" || status = "cancelled")`,
      sort: "-created",
      requestKey: null,
    }).then(records => {
      const tripList = records.items as unknown as Trip[]
      setTrips(tripList)
      const total = tripList
        .filter(t => t.status === "completed")
        .reduce((acc, t) => acc + ((t.finalPrice ?? 0) - 25), 0)
      setTotalGagne(total)
    }).catch(err => {
      console.error(err)
    }).finally(() => {
      setIsLoading(false)
    })
  }, [user?.id])

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
          <p className="text-[1.05rem] font-extrabold text-white">Historique des courses</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="px-6 pt-6"
      >
        {/* Résumé gains */}
        {!isLoading && trips.filter(t => t.status === "completed").length > 0 && (
          <div className="mb-6 flex items-center justify-between rounded-[20px] bg-brand-black px-6 py-5">
            <div>
              <p className="text-[0.82rem] text-white/50">Total gagné</p>
              <p className="text-[1.6rem] font-black text-brand-yellow">{totalGagne} FCFA</p>
            </div>
            <div className="text-right">
              <p className="text-[0.82rem] text-white/50">Courses terminées</p>
              <p className="text-[1.2rem] font-extrabold text-white">
                {trips.filter(t => t.status === "completed").length}
              </p>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="py-12 text-center text-gray-400">Chargement...</div>
        )}

        {!isLoading && trips.length === 0 && (
          <div className="rounded-[20px] bg-white px-6 py-12 text-center shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
            <ClipboardList className="mx-auto mb-4 size-12 text-brand-yellow" />
            <p className="mb-2 font-bold text-brand-black">Aucune course dans l'historique</p>
            <p className="text-[0.88rem] text-gray-400">Vos courses terminées apparaîtront ici.</p>
          </div>
        )}

        {trips.map(trip => (
          <div key={trip.id} className="mb-3.5 rounded-[20px] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
            {/* Badge statut */}
            <div className={`mb-3.5 inline-flex items-center gap-1 rounded-full px-3 py-1 text-[0.78rem] font-bold ${
              trip.status === "completed"
                ? "bg-brand-green/10 text-brand-green"
                : "bg-red-500/8 text-red-500"
            }`}>
              {trip.status === "completed"
                ? <><Check className="size-3" /> Terminée</>
                : <><X className="size-3" /> Annulée</>
              }
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
            {trip.finalPrice && (
              <div className="flex gap-3 rounded-[10px] bg-brand-bg px-3.5 py-3">
                <div className="flex-1">
                  <p className="text-[0.75rem] text-gray-400">Prix course</p>
                  <p className="font-extrabold text-brand-black">{trip.finalPrice} FCFA</p>
                </div>
                <div className="flex-1">
                  <p className="text-[0.75rem] text-gray-400">Commission</p>
                  <p className="font-extrabold text-brand-orange">-25 FCFA</p>
                </div>
                <div className="flex-1">
                  <p className="text-[0.75rem] text-gray-400">Gagné</p>
                  <p className="font-extrabold text-brand-green">{trip.finalPrice - 25} FCFA</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </motion.div>

      <BottomNav items={NAV_ITEMS} />
    </div>
  )
}