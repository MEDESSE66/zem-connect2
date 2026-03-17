import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { pb } from "../../lib/pocketbase"
import { toast } from "sonner"
import { useAuthStore } from "../../store/authStore"
import { Button } from "@/components/ui/button"
import BottomNav from "../../components/BottomNav"
import { motion } from "motion/react"
import { BarChart3, Users, Bike, AlertTriangle, ArrowLeft, Phone, Check, Ban, Search } from "lucide-react"
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
  const { user }                  = useAuthStore()
  const navigate                  = useNavigate()
  const [users, setUsers]         = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter]       = useState<"all" | "client" | "conducteur">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [suspendingId, setSuspendingId] = useState<string | null>(null)
  const [validatingId, setValidatingId] = useState<string | null>(null)

  const [showRechargeDialog, setShowRechargeDialog] = useState(false)
  const [rechargeTargetId, setRechargeTargetId] = useState<string | null>(null)
  const [rechargeTargetName, setRechargeTargetName] = useState("")
  const [rechargeAmount, setRechargeAmount] = useState<number | "">("")
  const [isRecharging, setIsRecharging] = useState(false)

  useEffect(() => {
    if (!user?.id) return

    const loadUsers = () => {
      pb.collection("users").getList(1, 100, {
        sort: "-created",
        requestKey: null,
      }).then(r => {
        setUsers(r.items as unknown as User[])
      }).finally(() => setIsLoading(false))
    }

    loadUsers()

    let unsubscribeUsers: (() => void) | undefined

    const initSubscriptions = async () => {
      unsubscribeUsers = await pb.collection("users").subscribe("*", () => {
        loadUsers()
      }, { requestKey: null })
    }

    initSubscriptions()

    return () => {
      if (unsubscribeUsers) unsubscribeUsers()
    }
  }, [user?.id])

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

  // Filtrage combiné (rôle + recherche)
  const filtered = users.filter(u => {
    // 1. Filtre par rôle
    if (filter !== "all" && u.role !== filter) return false
    
    // 2. Filtre par recherche (nom ou téléphone)
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      const matchName = u.name?.toLowerCase().includes(query) || false
      const matchPhone = u.phone?.toLowerCase().includes(query) || false
      if (!matchName && !matchPhone) return false
    }
    
    return true
  })

  const openRechargeDialog = (user: User) => {
    setRechargeTargetId(user.id)
    setRechargeTargetName(user.name || "Conducteur")
    setRechargeAmount("")
    setShowRechargeDialog(true)
  }

  const handleRecharge = async () => {
    if (!rechargeTargetId || !rechargeAmount || Number(rechargeAmount) < 100) return
    setIsRecharging(true)
    
    const amountNum = Number(rechargeAmount)

    try {
      const userToUpdate = users.find(u => u.id === rechargeTargetId)
      if (!userToUpdate) return
      
      const newBalance = (userToUpdate.walletBalance ?? 0) + amountNum
      await pb.collection("users").update(rechargeTargetId, { walletBalance: newBalance }, { requestKey: null })

      await pb.collection("transactions").create({
        user: rechargeTargetId,
        type: "recharge",
        amount: amountNum,
        reference: "recharge_admin",
        status: "completed"
      }, { requestKey: null })

      toast.success(`Wallet rechargé — ${amountNum} FCFA crédités`)
      setShowRechargeDialog(false)
    } catch (err) {
      console.error("Erreur recharge wallet", err)
      toast.error("Erreur lors de la recharge manuelle.")
    } finally {
      setIsRecharging(false)
    }
  }

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

        {/* Barre de recherche */}
        <div className="mb-6 relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <Search className="size-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher par nom ou numéro..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11 w-full rounded-[10px] border-[1.5px] border-gray-200 bg-white pl-10 pr-4 text-[0.92rem] font-medium text-brand-black placeholder-gray-400 outline-none transition-colors focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow"
          />
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

              {/* Recharge manuelle conducteur */}
              {user.role === "conducteur" && (
                <Button
                  onClick={() => openRechargeDialog(user)}
                  variant="outline"
                  className="mb-3.5 h-[38px] w-full rounded-[10px] border-brand-yellow/30 bg-brand-yellow/10 text-sm font-bold text-brand-black hover:bg-brand-yellow/20"
                >
                  Recharger le wallet
                </Button>
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

      {/* Dialog de recharge manuelle */}
      {showRechargeDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-[24px] bg-white p-6 shadow-xl">
            <h3 className="mb-2 text-center text-lg font-extrabold text-brand-black">Recharger le wallet</h3>
            <p className="mb-5 text-center text-sm font-medium text-gray-500">
              Conducteur : <span className="font-bold text-brand-black">{rechargeTargetName}</span>
            </p>
            
            <label className="mb-2 block text-[0.85rem] font-bold text-gray-600">
              Montant à créditer (FCFA)
            </label>
            <input
              type="number"
              min="100"
              placeholder="Ex: 500"
              value={rechargeAmount}
              onChange={(e) => setRechargeAmount(e.target.value === "" ? "" : Number(e.target.value))}
              className="mb-6 w-full rounded-xl border-[1.5px] border-gray-200 bg-gray-50/50 px-4 py-3 text-[0.95rem] font-semibold text-brand-black outline-none focus:border-brand-yellow focus:bg-white"
            />

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowRechargeDialog(false)}
                className="flex-1 rounded-xl font-bold"
                disabled={isRecharging}
              >
                Annuler
              </Button>
              <Button
                onClick={handleRecharge}
                disabled={isRecharging || !rechargeAmount || Number(rechargeAmount) < 100}
                className="flex-1 rounded-xl bg-brand-yellow font-extrabold text-brand-black hover:bg-brand-yellow/90"
              >
                {isRecharging ? "Envoi..." : "Confirmer"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}