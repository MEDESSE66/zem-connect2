import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { pb } from "../../lib/pocketbase"
import { useAuthStore } from "../../store/authStore"
import BottomNav from "../../components/BottomNav"
import { motion } from "motion/react"
import { BarChart3, Users, Bike, AlertTriangle, ArrowLeft, MapPin, Flag } from "lucide-react"
import type { Trip } from "../../types"

const NAV_ITEMS = [
  { icon: <BarChart3 className="size-[22px]" />,       label: "Stats",        path: "/admin" },
  { icon: <Users className="size-[22px]" />,            label: "Utilisateurs", path: "/admin/utilisateurs" },
  { icon: <Bike className="size-[22px]" />,             label: "Courses",      path: "/admin/courses" },
  { icon: <AlertTriangle className="size-[22px]" />,    label: "Litiges",      path: "/admin/litiges" },
]

const STATUS_CONFIG: Record<string, { label: string; colorClass: string; bgClass: string }> = {
  pending:     { label: "En attente",  colorClass: "text-brand-orange",  bgClass: "bg-brand-orange/10"  },
  accepte:     { label: "Acceptée",    colorClass: "text-brand-green",   bgClass: "bg-brand-green/10"   },
  in_progress: { label: "En cours",    colorClass: "text-blue-500",      bgClass: "bg-blue-500/10"      },
  completed:   { label: "Terminée",    colorClass: "text-gray-500",      bgClass: "bg-gray-100"         },
  cancelled:   { label: "Annulée",     colorClass: "text-red-500",       bgClass: "bg-red-500/10"       },
  expired:     { label: "Expirée",     colorClass: "text-gray-400",      bgClass: "bg-gray-50"          },
}

export default function AdminCourses() {
  const { user }                  = useAuthStore()
  const navigate                  = useNavigate()
  const [trips, setTrips]         = useState<Trip[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter]       = useState<string>("all")

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const PAGE_SIZE = 20

  useEffect(() => {
    if (!user?.id) return

    const loadTrips = () => {
      pb.collection("trips").getList(currentPage, PAGE_SIZE, {
        sort: "-created",
        requestKey: null,
      }).then(r => {
        setTrips(r.items as unknown as Trip[])
        setTotalPages(Math.ceil(r.totalItems / PAGE_SIZE))
      }).finally(() => setIsLoading(false))
    }

    loadTrips()

    let unsubscribeTrips: (() => void) | undefined

    const initSubscriptions = async () => {
      unsubscribeTrips = await pb.collection("trips").subscribe("*", () => {
        loadTrips()
      }, { requestKey: null })
    }

    initSubscriptions()

    return () => {
      if (unsubscribeTrips) unsubscribeTrips()
    }
  }, [user?.id, currentPage])

  const filtered = trips.filter(t => filter === "all" || t.status === filter)

  return (
    <div className="min-h-svh bg-brand-bg pb-20 font-sans">

      {/* Header */}
      <div className="flex items-center gap-3.5 bg-brand-black px-6 pt-5 pb-6">
        <button
          onClick={() => navigate("/admin")}
          className="flex size-[38px] shrink-0 items-center justify-center rounded-[10px] border border-white/12 bg-white/8 text-white"
        >
          <ArrowLeft className="size-[18px]" />
        </button>
        <div>
          <p className="text-[0.8rem] text-white/50">Administration</p>
          <p className="text-[1.05rem] font-extrabold text-white">Courses ({trips.length})</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="px-6 pt-6"
      >
        {/* Filtres statut */}
        <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
          {[
            { key: "all",         label: "Toutes" },
            { key: "pending",     label: "En attente" },
            { key: "accepte",     label: "Acceptées" },
            { key: "in_progress", label: "En cours" },
            { key: "completed",   label: "Terminées" },
            { key: "cancelled",   label: "Annulées" },
            { key: "expired",     label: "Expirées" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition-all ${
                filter === key
                  ? "bg-brand-yellow text-brand-black shadow-[0_2px_8px_var(--brand-yellow)40]"
                  : "border border-gray-200 bg-white text-gray-500"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {isLoading && (
          <div className="py-12 text-center text-gray-400">Chargement...</div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="rounded-[20px] bg-white px-6 py-12 text-center shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
            <Bike className="mx-auto mb-4 size-12 text-brand-yellow" />
            <p className="font-bold text-brand-black">Aucune course trouvée</p>
          </div>
        )}

        {filtered.map(trip => {
          const sc = STATUS_CONFIG[trip.status] || { label: trip.status, colorClass: "text-gray-500", bgClass: "bg-gray-100" }
          return (
            <div key={trip.id} className="mb-3.5 rounded-[20px] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
              {/* Badge */}
              <div className={`mb-3.5 inline-flex rounded-full px-3 py-1 text-[0.75rem] font-bold ${sc.bgClass} ${sc.colorClass}`}>
                {sc.label}
              </div>

              {/* Trajet */}
              <div className="mb-3.5 flex flex-col gap-2">
                <div className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-brand-yellow" />
                  <div>
                    <p className="text-[0.72rem] text-gray-400">Départ</p>
                    <p className="text-[0.9rem] font-semibold text-brand-black">{trip.departureAddress}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Flag className="mt-0.5 size-4 shrink-0 text-brand-green" />
                  <div>
                    <p className="text-[0.72rem] text-gray-400">Destination</p>
                    <p className="text-[0.9rem] font-semibold text-brand-black">{trip.destinationAddress}</p>
                  </div>
                </div>
              </div>

              {/* Prix */}
              <div className="flex gap-3 rounded-[10px] bg-brand-bg px-3.5 py-2.5">
                <div className="flex-1">
                  <p className="text-[0.72rem] text-gray-400">Prix client</p>
                  <p className="font-extrabold text-brand-black">{trip.clientPrice} FCFA</p>
                </div>
                {trip.finalPrice && (
                  <div className="flex-1">
                    <p className="text-[0.72rem] text-gray-400">Prix final</p>
                    <p className="font-extrabold text-brand-green">{trip.finalPrice} FCFA</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {/* Pagination AdminCourses */}
        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-bold disabled:opacity-40"
            >
              ← Précédent
            </button>
            <span className="text-sm font-bold text-gray-500">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-bold disabled:opacity-40"
            >
              Suivant →
            </button>
          </div>
        )}
      </motion.div>

      <BottomNav items={NAV_ITEMS} />
    </div>
  )
}