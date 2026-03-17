import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { pb } from "../../lib/pocketbase"
import { useAuthStore } from "../../store/authStore"
import BottomNav from "../../components/BottomNav"
import { motion } from "motion/react"
import { BarChart3, Users, Bike, Car, AlertTriangle, LogOut, Settings } from "lucide-react"

const NAV_ITEMS = [
  { icon: <BarChart3 className="size-[22px]" />,       label: "Stats",         path: "/admin" },
  { icon: <Users className="size-[22px]" />,            label: "Utilisateurs",  path: "/admin/utilisateurs" },
  { icon: <Bike className="size-[22px]" />,             label: "Courses",       path: "/admin/courses" },
  { icon: <AlertTriangle className="size-[22px]" />,    label: "Litiges",       path: "/admin/litiges" },
]

export default function AdminStats() {
  const { user, logout }                        = useAuthStore()
  const navigate                                = useNavigate()
  const [totalCommissions, setTotalCommissions] = useState(0)
  const [totalTrips, setTotalTrips]             = useState(0)
  const [totalUsers, setTotalUsers]             = useState(0)
  const [totalConducteurs, setTotalConducteurs] = useState(0)
  const [isLoading, setIsLoading]               = useState(true)

  useEffect(() => {
    if (!user?.id) return

    const loadStats = () => {
      Promise.all([
        pb.collection("transactions").getList(1, 1000, {
          filter: `type = "commission" && status = "completed"`,
          requestKey: null,
        }),
        pb.collection("trips").getList(1, 1, {
          filter: `status = "completed"`,
          requestKey: null,
        }),
        pb.collection("users").getList(1, 1, {
          filter: `role = "client"`,
          requestKey: null,
        }),
        pb.collection("users").getList(1, 1, {
          filter: `role = "conducteur"`,
          requestKey: null,
        }),
      ]).then(([transactions, trips, clients, conducteurs]) => {
        const total = transactions.items.reduce((sum, t) => sum + (t as any).amount, 0)
        setTotalCommissions(Math.abs(total))
        setTotalTrips(trips.totalItems)
        setTotalUsers(clients.totalItems)
        setTotalConducteurs(conducteurs.totalItems)
      }).finally(() => setIsLoading(false))
    }

    loadStats()

    let unsubscribeTrips: (() => void) | undefined
    let unsubscribeTransactions: (() => void) | undefined

    const initSubscriptions = async () => {
      unsubscribeTrips = await pb.collection("trips").subscribe("*", () => {
        loadStats()
      }, { requestKey: null })
      unsubscribeTransactions = await pb.collection("transactions").subscribe("*", () => {
        loadStats()
      }, { requestKey: null })
    }

    initSubscriptions()

    return () => {
      if (unsubscribeTrips) unsubscribeTrips()
      if (unsubscribeTransactions) unsubscribeTransactions()
    }
  }, [user?.id])

  return (
    <div className="min-h-svh bg-brand-bg pb-20 font-sans">

      {/* Header */}
      <div className="relative overflow-hidden bg-brand-black px-6 pt-5 pb-7">
        <div className="pointer-events-none absolute -top-10 -right-10 size-[180px] rounded-full bg-[radial-gradient(circle,_var(--brand-yellow)20_0%,_transparent_70%)]" />
        <div className="flex items-center justify-between">
          <div>
            <p className="mb-0.5 text-[0.82rem] text-white/50">Administration</p>
            <p className="text-[1.1rem] font-extrabold text-white">Tableau de bord</p>
          </div>
          <button
            onClick={() => { logout(); navigate("/login") }}
            className="flex items-center gap-1.5 rounded-[10px] border border-white/12 bg-white/8 px-3.5 py-2 text-[13px] font-semibold text-white/60 transition-colors hover:bg-white/12"
          >
            <LogOut className="size-3.5" /> Déconnexion
          </button>
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

        {!isLoading && (
          <>
            {/* Stat principale */}
            <div className="relative mb-4 overflow-hidden rounded-[20px] bg-brand-black p-6">
              <div className="pointer-events-none absolute -bottom-5 -right-5 size-[120px] rounded-full bg-brand-yellow/8" />
              <p className="mb-1 text-[0.82rem] text-white/50">Commissions collectées</p>
              <p className="text-[2rem] font-black text-brand-yellow">{totalCommissions} FCFA</p>
              <p className="mt-1 text-[0.78rem] text-white/40">25 FCFA par course terminée</p>
            </div>

            {/* Grid stats */}
            <div className="mb-6 grid grid-cols-2 gap-3.5">
              {[
                { icon: <Bike className="size-7 text-brand-green" />,   label: "Courses terminées", value: totalTrips,       colorClass: "text-brand-green" },
                { icon: <Users className="size-7 text-blue-500" />,     label: "Clients",            value: totalUsers,       colorClass: "text-blue-500" },
                { icon: <Car className="size-7 text-brand-orange" />,   label: "Conducteurs",        value: totalConducteurs, colorClass: "text-brand-orange" },
              ].map(({ icon, label, value, colorClass }) => (
                <div key={label} className="rounded-2xl bg-white p-[18px] shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
                  <div className="mb-2">{icon}</div>
                  <div className={`text-[1.4rem] font-black ${colorClass}`}>{value}</div>
                  <div className="mt-0.5 text-[0.8rem] text-gray-400">{label}</div>
                </div>
              ))}

              {/* Raccourci litiges */}
              <div
                onClick={() => navigate("/admin/litiges")}
                className="cursor-pointer rounded-2xl border border-brand-orange/15 bg-brand-orange/5 p-[18px] transition-colors hover:bg-brand-orange/10"
              >
                <AlertTriangle className="mb-2 size-7 text-brand-orange" />
                <div className="text-[0.9rem] font-bold text-brand-orange">Voir litiges</div>
                <div className="mt-0.5 text-[0.8rem] text-gray-400">Ouverts</div>
              </div>
            </div>

            {/* Raccourcis */}
            <h3 className="mb-3.5 text-base font-extrabold text-brand-black">Actions rapides</h3>
            <div className="flex flex-col gap-3">
              {[
                { icon: <Settings className="size-8 text-brand-black" />, label: "Paramètres financiers", sub: "Commission, abonnement, bonus", path: "/admin/settings", borderColor: "border-gray-200" },
                { icon: <Users className="size-8 text-brand-yellow" />,  label: "Gérer les utilisateurs",  sub: "Suspendre, réactiver les comptes", path: "/admin/utilisateurs", borderColor: "border-brand-yellow" },
                { icon: <Bike className="size-8 text-brand-green" />,   label: "Voir toutes les courses", sub: "Historique complet des trajets",    path: "/admin/courses",      borderColor: "border-brand-green"  },
              ].map(({ icon, label, sub, path, borderColor }) => (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className={`flex items-center gap-3.5 rounded-[14px] border-2 ${borderColor} bg-white p-4 text-left transition-shadow hover:shadow-lg`}
                >
                  {icon}
                  <div>
                    <div className="text-[0.95rem] font-bold text-brand-black">{label}</div>
                    <div className="mt-0.5 text-[0.82rem] text-gray-400">{sub}</div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </motion.div>

      <BottomNav items={NAV_ITEMS} />
    </div>
  )
}