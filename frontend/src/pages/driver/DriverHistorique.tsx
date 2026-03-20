import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { pb } from "../../lib/pocketbase"
import { useAuthStore } from "../../store/authStore"
import BottomNav from "../../components/BottomNav"
import { motion } from "motion/react"
import { Home, Bike, ClipboardList, ArrowLeft, MapPin, Flag, Check, X, ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react"
import type { Trip } from "../../types"

const NAV_ITEMS = [
  { icon: <Home className="size-[22px]" />,           label: "Accueil",    path: "/driver" },
  { icon: <Bike className="size-[22px]" />,           label: "Ma course",  path: "/driver/ma-course" },
  { icon: <ClipboardList className="size-[22px]" />,  label: "Historique", path: "/driver/historique" },
]

const STATUS_CONFIG = {
  completed:   { label: "Terminée",   colorClass: "text-brand-green",  bgClass: "bg-brand-green/10"  },
  cancelled:   { label: "Annulée",    colorClass: "text-red-500",      bgClass: "bg-red-500/10"      },
  expired:     { label: "Expirée",    colorClass: "text-gray-400",     bgClass: "bg-gray-100"        },
  in_progress: { label: "En cours",   colorClass: "text-blue-500",     bgClass: "bg-blue-500/10"     },
  accepte:     { label: "Acceptée",   colorClass: "text-brand-orange", bgClass: "bg-brand-orange/10" },
}

export default function DriverHistorique() {
  const { user }                  = useAuthStore()
  const navigate                  = useNavigate()
  const [trips, setTrips]         = useState<Trip[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalGagne, setTotalGagne] = useState(0)

  const [activeTab, setActiveTab] = useState<"courses" | "transactions">("courses")
  const [transactions, setTransactions] = useState<any[]>([])
  const [isLoadingTrans, setIsLoadingTrans] = useState(false)

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

  useEffect(() => {
    if (!user?.id) return
    if (activeTab === "transactions" && transactions.length === 0) {
      setIsLoadingTrans(true)
      pb.collection("transactions").getList(1, 50, {
        filter: `user = "${user.id}"`,
        sort: "-created",
        requestKey: null,
      }).then(records => {
        setTransactions(records.items)
      }).catch(err => {
        console.error(err)
      }).finally(() => {
        setIsLoadingTrans(false)
      })
    }
  }, [user?.id, activeTab])

  // Helpers transactions
  const formatType = (type: string) => {
    if (type === "commission") return { label: "Commission", color: "text-red-500", bg: "bg-red-500/10", icon: <ArrowDownLeft className="size-3" /> }
    if (type === "recharge") return { label: "Recharge", color: "text-brand-green", bg: "bg-brand-green/10", icon: <ArrowUpRight className="size-3" /> }
    if (type === "refund") return { label: "Remboursement", color: "text-blue-500", bg: "bg-blue-500/10", icon: <ArrowUpRight className="size-3" /> }
    return { label: type, color: "text-gray-500", bg: "bg-gray-100", icon: null }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
    })
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
          <p className="text-[1.05rem] font-extrabold text-white">Historique des courses</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="px-6 pt-6"
      >
        {/* Onglets */}
        <div className="mb-6 flex overflow-hidden rounded-[14px] border border-gray-200 bg-white p-1">
          <button
            onClick={() => setActiveTab("courses")}
            className={`flex-1 rounded-[10px] py-2 text-[0.85rem] font-bold transition-all ${
              activeTab === "courses" ? "bg-brand-orange text-white" : "text-gray-400 hover:text-brand-black"
            }`}
          >
            Courses
          </button>
          <button
            onClick={() => setActiveTab("transactions")}
            className={`flex-1 rounded-[10px] py-2 text-[0.85rem] font-bold transition-all ${
              activeTab === "transactions" ? "bg-brand-orange text-white" : "text-gray-400 hover:text-brand-black"
            }`}
          >
            Transactions
          </button>
        </div>

        {/* --- ONGLET COURSES --- */}
        {activeTab === "courses" && (
          <>
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

        {trips.map(trip => {
          const sc = STATUS_CONFIG[trip.status as keyof typeof STATUS_CONFIG] || { label: trip.status, colorClass: "text-gray-500", bgClass: "bg-gray-100" }
          return (
            <div key={trip.id} className="mb-3.5 rounded-[20px] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
              {/* Badge statut */}
              <div className={`mb-3.5 inline-flex items-center gap-1 rounded-full px-3 py-1 text-[0.78rem] font-bold ${sc.bgClass} ${sc.colorClass}`}>
                {trip.status === "completed" && <Check className="size-3" />}
                {trip.status === "cancelled" && <X className="size-3" />}
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
          )
        })}
          </>
        )}

        {/* --- ONGLET TRANSACTIONS --- */}
        {activeTab === "transactions" && (
          <>
            {isLoadingTrans && (
              <div className="py-12 text-center text-gray-400">Chargement des transactions...</div>
            )}

            {!isLoadingTrans && transactions.length === 0 && (
              <div className="rounded-[20px] bg-white px-6 py-12 text-center shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
                <Wallet className="mx-auto mb-4 size-12 text-brand-yellow" />
                <p className="mb-2 font-bold text-brand-black">Aucune transaction</p>
                <p className="text-[0.88rem] text-gray-400">Votre historique financier apparaîtra ici.</p>
              </div>
            )}

            {transactions.map(tx => {
              const style = formatType(tx.type)
              const sign = tx.type === "commission" ? "-" : "+"
              
              return (
                <div key={tx.id} className="mb-3.5 rounded-[20px] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
                  <div className="mb-2 flex items-start justify-between">
                    <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.75rem] font-bold ${style.bg} ${style.color}`}>
                      {style.icon} {style.label}
                    </div>
                    <p className={`text-[1.1rem] font-black ${style.color}`}>
                      {sign}{tx.amount} FCFA
                    </p>
                  </div>
                  
                  {tx.reference && (
                    <div className="mb-3 text-[0.82rem] font-semibold text-gray-500">
                      Réf: {tx.reference}
                    </div>
                  )}
                  
                  <div className="mt-2 text-[0.75rem] text-gray-400">
                    {formatDate(tx.created)}
                  </div>
                </div>
              )
            })}
          </>
        )}

      </motion.div>

      <BottomNav items={NAV_ITEMS} />
    </div>
  )
}