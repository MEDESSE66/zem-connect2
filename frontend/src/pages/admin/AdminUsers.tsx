import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { pb } from "../../lib/pocketbase"
import { Button } from "@/components/ui/button"
import BottomNav from "../../components/BottomNav"
import { motion } from "motion/react"
import { BarChart3, Users, Bike, AlertTriangle, ArrowLeft, Phone, Check, Ban } from "lucide-react"
import type { User } from "../../types"

const NAV_ITEMS = [
  { icon: <BarChart3 className="size-[22px]" />,       label: "Stats",        path: "/admin" },
  { icon: <Users className="size-[22px]" />,            label: "Utilisateurs", path: "/admin/utilisateurs" },
  { icon: <Bike className="size-[22px]" />,             label: "Courses",      path: "/admin/courses" },
  { icon: <AlertTriangle className="size-[22px]" />,    label: "Litiges",      path: "/admin/litiges" },
]

const ROLE_CONFIG: Record<string, { label: string; colorClass: string; bgClass: string }> = {
  client:     { label: "Client",     colorClass: "text-blue-500",      bgClass: "bg-blue-500/10"     },
  conducteur: { label: "Conducteur", colorClass: "text-brand-orange",  bgClass: "bg-brand-orange/10" },
  admin:      { label: "Admin",      colorClass: "text-brand-yellow",  bgClass: "bg-brand-yellow/12" },
}

export default function AdminUsers() {
  const navigate                  = useNavigate()
  const [users, setUsers]         = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter]       = useState<"all" | "client" | "conducteur">("all")
  const [suspendingId, setSuspendingId] = useState<string | null>(null)
  const [validatingId, setValidatingId] = useState<string | null>(null)

  useEffect(() => {
    pb.collection("users").getList(1, 100, {
      sort: "-created",
      requestKey: null,
    }).then(r => {
      setUsers(r.items as unknown as User[])
    }).finally(() => setIsLoading(false))
  }, [])

  const toggleSuspend = async (user: User) => {
    setSuspendingId(user.id)
    try {
      await pb.collection("users").update(user.id, {
        isSuspended: !user.isSuspended,
      }, { requestKey: null })
      setUsers(prev => prev.map(u =>
        u.id === user.id ? { ...u, isSuspended: !u.isSuspended } : u
      ))
    } finally {
      setSuspendingId(null)
    }
  }

  const validateConducteur = async (user: User) => {
    setValidatingId(user.id)
    try {
      await pb.collection("users").update(user.id, {
        conducteur_verifie: true,
      }, { requestKey: null })
      setUsers(prev => prev.map(u =>
        u.id === user.id ? { ...u, conducteur_verifie: true } : u
      ))
    } finally {
      setValidatingId(null)
    }
  }

  const filtered = users.filter(u => filter === "all" || u.role === filter)

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
          <p className="text-[1.05rem] font-extrabold text-white">
            Utilisateurs ({users.length})
          </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="px-6 pt-6"
      >
        {/* Filtres */}
        <div className="mb-5 flex flex-wrap gap-2">
          {[
            { key: "all",        label: "Tous" },
            { key: "client",     label: "Clients" },
            { key: "conducteur", label: "Conducteurs" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key as typeof filter)}
              className={`rounded-full px-[18px] py-2 text-[13px] font-bold transition-all ${
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

        {filtered.map(user => {
          const rc = ROLE_CONFIG[user.role] || { label: user.role, colorClass: "text-gray-500", bgClass: "bg-gray-100" }
          return (
            <div key={user.id} className={`mb-3.5 rounded-[20px] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] ${user.isSuspended ? "opacity-70" : ""}`}>
              {/* Top row */}
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <p className="text-[0.95rem] font-bold text-brand-black">{user.email}</p>
                  {user.phone && (
                    <p className="mt-0.5 flex items-center gap-1 text-[0.82rem] text-gray-400">
                      <Phone className="size-3" /> {user.phone}
                    </p>
                  )}
                </div>
                <div className={`shrink-0 rounded-full px-3 py-1 text-[0.75rem] font-bold ${rc.bgClass} ${rc.colorClass}`}>
                  {rc.label}
                </div>
              </div>

              {/* Infos */}
              <div className="mb-3.5 flex gap-3 rounded-[10px] bg-brand-bg px-3.5 py-2.5">
                <div className="flex-1">
                  <p className="text-[0.72rem] text-gray-400">Wallet</p>
                  <p className="text-[0.9rem] font-extrabold text-brand-black">{user.walletBalance} FCFA</p>
                </div>
                <div className="flex-1">
                  <p className="text-[0.72rem] text-gray-400">Statut</p>
                  <p className={`text-[0.9rem] font-bold ${user.isSuspended ? "text-red-500" : "text-brand-green"}`}>
                    {user.isSuspended ? "Suspendu" : "Actif"}
                  </p>
                </div>
              </div>

              {/* Validation conducteur */}
              {user.role === "conducteur" && (
                <div className="mb-3.5 flex justify-center">
                  {user.conducteur_verifie ? (
                    <div className="inline-flex items-center gap-1 rounded-full bg-brand-green/10 px-3 py-1 text-[13px] font-bold text-brand-green">
                      <Check className="size-3.5" /> Vérifié
                    </div>
                  ) : (
                    <button
                      onClick={() => validateConducteur(user)}
                      disabled={validatingId === user.id}
                      className="rounded-full bg-brand-green px-3.5 py-1.5 text-[13px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {validatingId === user.id ? "..." : "Valider"}
                    </button>
                  )}
                </div>
              )}

              {/* Action */}
              <Button
                onClick={() => toggleSuspend(user)}
                disabled={suspendingId === user.id}
                className={`h-10 w-full rounded-[10px] text-sm font-bold disabled:cursor-not-allowed disabled:opacity-60 ${
                  user.isSuspended
                    ? "bg-brand-green text-white hover:bg-brand-green/90"
                    : "border border-red-500/20 bg-red-500/8 text-red-500 hover:bg-red-500/15"
                }`}
              >
                {suspendingId === user.id ? "..." : (
                  user.isSuspended
                    ? <><Check className="mr-1 size-3.5" /> Réactiver le compte</>
                    : <><Ban className="mr-1 size-3.5" /> Suspendre le compte</>
                )}
              </Button>
            </div>
          )
        })}
      </motion.div>

      <BottomNav items={NAV_ITEMS} />
    </div>
  )
}