import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { pb } from "../../lib/pocketbase"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "motion/react"
import { 
  ArrowLeft, User as UserIcon, Phone, Shield, 
  Check, Clock, ArrowUpRight, ArrowDownLeft, 
  Star, History, LayoutDashboard, AlertCircle
} from "lucide-react"
import type { User, Trip } from "../../types"

interface Transaction {
  id: string
  type: "commission" | "recharge" | "refund" | "bonus"
  amount: number
  reference: string
  status: string
  created: string
}

const ROLE_CONFIG: Record<string, { label: string; prefix: string; colorClass: string; bgClass: string }> = {
  client:     { label: "Client",     prefix: "CL", colorClass: "text-blue-500",      bgClass: "bg-blue-500/10"     },
  conducteur: { label: "Conducteur", prefix: "ZM", colorClass: "text-brand-orange",  bgClass: "bg-brand-orange/10" },
  admin:      { label: "Admin",      prefix: "AD", colorClass: "text-brand-yellow",  bgClass: "bg-brand-yellow/12" },
}

export default function AdminUserDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [targetUser, setTargetUser] = useState<User | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [trips, setTrips] = useState<Trip[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"transactions" | "courses">("transactions")

  // Actions states
  const [isSuspending, setIsSuspending] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [showRechargeDialog, setShowRechargeDialog] = useState(false)
  const [rechargeAmount, setRechargeAmount] = useState<number | "">("")
  const [isRecharging, setIsRecharging] = useState(false)

  const loadAllData = async () => {
    if (!id) return
    setIsLoading(true)
    try {
      const [userData, transData, tripsData] = await Promise.all([
        pb.collection("users").getOne(id, { requestKey: null }),
        pb.collection("transactions").getList(1, 50, {
          filter: `user = "${id}"`,
          sort: "-created",
          requestKey: null,
        }),
        pb.collection("trips").getList(1, 20, {
          filter: `client = "${id}" || conducteur = "${id}"`,
          sort: "-created",
          requestKey: null,
        })
      ])

      setTargetUser(userData as unknown as User)
      setTransactions(transData.items as unknown as Transaction[])
      setTrips(tripsData.items as unknown as Trip[])
    } catch (err) {
      console.error("Erreur chargement détail utilisateur", err)
      toast.error("Impossible de charger les données de l'utilisateur.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadAllData()
  }, [id])

  const handleToggleSuspend = async () => {
    if (!targetUser) return
    setIsSuspending(true)
    try {
      const updated = await pb.collection("users").update(targetUser.id, {
        isSuspended: !targetUser.isSuspended
      }, { requestKey: null })
      setTargetUser(updated as unknown as User)
      toast.success(targetUser.isSuspended ? "Compte réactivé" : "Compte suspendu")
    } catch {
      toast.error("Erreur lors de l'action de suspension.")
    } finally {
      setIsSuspending(false)
    }
  }

  const handleValidate = async () => {
    if (!targetUser) return
    setIsValidating(true)
    try {
      const updated = await pb.collection("users").update(targetUser.id, {
        conducteur_verifie: true
      }, { requestKey: null })
      setTargetUser(updated as unknown as User)
      toast.success("Conducteur validé avec succès")
    } catch {
      toast.error("Erreur lors de la validation.")
    } finally {
      setIsValidating(false)
    }
  }

  const handleRecharge = async () => {
    if (!id || !rechargeAmount || Number(rechargeAmount) < 100 || !targetUser) return
    setIsRecharging(true)
    const amountNum = Number(rechargeAmount)
    try {
      const newBalance = (targetUser.walletBalance ?? 0) + amountNum
      await Promise.all([
        pb.collection("users").update(id, { walletBalance: newBalance }, { requestKey: null }),
        pb.collection("transactions").create({
          user: id,
          type: "recharge",
          amount: amountNum,
          reference: "recharge_admin",
          status: "completed"
        }, { requestKey: null })
      ])

      toast.success(`Wallet rechargé — ${amountNum} FCFA crédités`)
      setShowRechargeDialog(false)
      setRechargeAmount(0)
      loadAllData() // Recharger pour voir la transaction et le solde
    } catch {
      toast.error("Erreur lors de la recharge.")
    } finally {
      setIsRecharging(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-brand-bg">
        <div className="text-gray-400 animate-pulse font-bold">Chargement du profil...</div>
      </div>
    )
  }

  if (!targetUser) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center bg-brand-bg px-6 text-center">
        <AlertCircle className="mb-4 size-16 text-red-500/20" />
        <h2 className="mb-2 text-xl font-black text-brand-black">Utilisateur introuvable</h2>
        <Button onClick={() => navigate("/admin/utilisateurs")} className="mt-4 rounded-xl bg-brand-yellow text-brand-black font-bold">
          Retour à la liste
        </Button>
      </div>
    )
  }

  const roleConfig = ROLE_CONFIG[targetUser.role] || { label: targetUser.role, prefix: "??", colorClass: "text-gray-500", bgClass: "bg-gray-100" }
  const shortId = `${roleConfig.prefix}-${targetUser.id.slice(0, 6).toUpperCase()}`

  return (
    <div className="min-h-svh bg-brand-bg pb-20 font-sans">
      
      {/* Header Section */}
      <div className="relative overflow-hidden bg-brand-black px-6 pt-5 pb-8 text-white">
        <div className="pointer-events-none absolute -top-10 -right-10 size-[200px] rounded-full bg-[radial-gradient(circle,_var(--brand-orange)10_0%,_transparent_60%)] opacity-30" />
        
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate("/admin/utilisateurs")}
            className="flex size-10 items-center justify-center rounded-xl border border-white/12 bg-white/8 transition-all active:scale-95"
          >
            <ArrowLeft className="size-5" />
          </button>
          <div className={`rounded-full px-4 py-1.5 text-[0.75rem] font-black tracking-wider uppercase ${roleConfig.bgClass} ${roleConfig.colorClass} border border-current opacity-90`}>
            {shortId}
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="flex size-20 shrink-0 items-center justify-center rounded-[24px] bg-gradient-to-br from-white/15 to-white/5 border border-white/10 shadow-xl">
             <UserIcon className="size-10 text-white/40" />
          </div>
          <div className="flex-1">
            <h1 className="text-[1.3rem] font-black leading-tight">{targetUser.name || targetUser.email}</h1>
            <p className="mt-1 flex items-center gap-1.5 text-[0.88rem] text-white/40 font-medium">
              <Phone className="size-3.5" /> {targetUser.phone || "Pas de numéro"}
            </p>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="px-6 -mt-4"
      >
        {/* Main Info Card */}
        <div className="mb-6 rounded-[28px] bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-brand-bg p-4">
              <p className="mb-1 text-[0.7rem] font-bold uppercase tracking-wider text-gray-400">Portefeuille</p>
              <p className="text-[1.2rem] font-black text-brand-black">{targetUser.walletBalance ?? 0} <span className="text-[0.8rem]">FCFA</span></p>
            </div>
            <div className="rounded-2xl bg-brand-bg p-4">
              <p className="mb-1 text-[0.7rem] font-bold uppercase tracking-wider text-gray-400">Note</p>
              <div className="flex items-center gap-1.5">
                <Star className="size-4 fill-brand-yellow text-brand-yellow" />
                <p className="text-[1.2rem] font-black text-brand-black">{targetUser.rating || "-"}</p>
                <span className="text-[0.7rem] text-gray-400">({targetUser.totalRating || 0})</span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <div className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3">
              <div className="flex items-center gap-2.5">
                <Shield className={`size-4 ${targetUser.isSuspended ? "text-red-500" : "text-brand-green"}`} />
                <span className="text-[0.9rem] font-bold text-gray-600">Statut compte</span>
              </div>
              <span className={`text-[0.8rem] font-black uppercase ${targetUser.isSuspended ? "text-red-500" : "text-brand-green"}`}>
                {targetUser.isSuspended ? "Suspendu" : "Actif"}
              </span>
            </div>

            {targetUser.role === "conducteur" && (
              <div className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <Check className={`size-4 ${targetUser.conducteur_verifie ? "text-brand-green" : "text-brand-orange"}`} />
                  <span className="text-[0.9rem] font-bold text-gray-600">Vérification</span>
                </div>
                <span className={`text-[0.8rem] font-black uppercase ${targetUser.conducteur_verifie ? "text-brand-green" : "text-brand-orange"}`}>
                  {targetUser.conducteur_verifie ? "Vérifié" : "En attente"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mb-8 flex flex-col gap-3">
          <div className="flex gap-3">
            {targetUser.role === "conducteur" && !targetUser.conducteur_verifie && (
              <Button 
                onClick={handleValidate}
                disabled={isValidating}
                className="flex-1 h-12 rounded-2xl bg-brand-green text-white font-black shadow-lg shadow-brand-green/20"
              >
                {isValidating ? "..." : "Valider le dossier"}
              </Button>
            )}
            {targetUser.role === "conducteur" && (
              <Button 
                onClick={() => setShowRechargeDialog(true)}
                className="flex-1 h-12 rounded-2xl bg-brand-yellow text-brand-black font-black shadow-lg shadow-brand-yellow/20"
              >
                Recharger Wallet
              </Button>
            )}
          </div>
          
          <Button 
            variant="outline"
            onClick={handleToggleSuspend}
            disabled={isSuspending}
            className={`h-12 rounded-2xl font-black transition-all ${
              targetUser.isSuspended 
                ? "border-brand-green/30 text-brand-green hover:bg-brand-green/5" 
                : "border-red-100 text-red-500 hover:bg-red-50"
            }`}
          >
            {isSuspending ? "..." : targetUser.isSuspended ? "Réactiver le compte" : "Suspendre le compte"}
          </Button>
        </div>

        {/* Tabs Section */}
        <div className="mb-4 flex gap-1 rounded-[18px] bg-gray-100 p-1.5">
          <button
            onClick={() => setActiveTab("transactions")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-[14px] py-2.5 text-[0.85rem] font-bold transition-all ${
              activeTab === "transactions" ? "bg-white text-brand-black shadow-sm" : "text-gray-400"
            }`}
          >
            <History className="size-4" /> Transactions
          </button>
          <button
            onClick={() => setActiveTab("courses")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-[14px] py-2.5 text-[0.85rem] font-bold transition-all ${
              activeTab === "courses" ? "bg-white text-brand-black shadow-sm" : "text-gray-400"
            }`}
          >
            <LayoutDashboard className="size-4" /> Courses
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "transactions" && (
              <div className="space-y-3">
                {transactions.length === 0 ? (
                  <div className="py-12 text-center text-gray-400 text-sm font-medium">Aucune transaction trouvée</div>
                ) : (
                  transactions.map(t => {
                    const isPositive = ["recharge", "refund", "bonus"].includes(t.type)
                    return (
                      <div key={t.id} className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm border border-gray-100/50">
                        <div className="flex items-center gap-3.5">
                          <div className={`flex size-10 items-center justify-center rounded-xl ${
                            t.type === "recharge" ? "bg-green-50 text-green-600" :
                            t.type === "commission" ? "bg-red-50 text-red-600" :
                            t.type === "refund" ? "bg-blue-50 text-blue-600" :
                            "bg-amber-50 text-amber-600"
                          }`}>
                            {isPositive ? <ArrowDownLeft className="size-5" /> : <ArrowUpRight className="size-5" />}
                          </div>
                          <div>
                            <p className="text-[0.88rem] font-bold text-brand-black capitalize">{t.type}</p>
                            <p className="text-[0.72rem] text-gray-400 font-medium">{new Date(t.created).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", hour: "2-digit", minute: "2-digit" })}</p>
                          </div>
                        </div>
                        <div className={`text-[0.95rem] font-black ${isPositive ? "text-green-600" : "text-red-500"}`}>
                          {isPositive ? "+" : "-"}{t.amount}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            )}

            {activeTab === "courses" && (
              <div className="space-y-3">
                {trips.length === 0 ? (
                  <div className="py-12 text-center text-gray-400 text-sm font-medium">Aucune course trouvée</div>
                ) : (
                  trips.map(trip => (
                    <div key={trip.id} className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100/50">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-[0.7rem] font-bold text-gray-300">ID: {trip.id.slice(0, 8)}</span>
                        <div className={`rounded-full px-2.5 py-1 text-[0.65rem] font-black uppercase ${
                          trip.status === "completed" ? "bg-green-50 text-green-600" :
                          trip.status === "cancelled" ? "bg-red-50 text-red-500" :
                          "bg-amber-50 text-amber-600"
                        }`}>
                          {trip.status}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2 text-[0.85rem]">
                          <div className="mt-1 size-1.5 rounded-full bg-brand-yellow shrink-0" />
                          <p className="font-semibold text-brand-black line-clamp-1">{trip.departureAddress}</p>
                        </div>
                        <div className="flex items-start gap-2 text-[0.85rem]">
                          <div className="mt-1 size-1.5 rounded-full bg-brand-green shrink-0" />
                          <p className="font-semibold text-brand-black line-clamp-1">{trip.destinationAddress}</p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
                         <div className="flex items-center gap-1.5 text-gray-400 text-[0.75rem] font-medium">
                            <Clock className="size-3" />
                            {new Date(trip.created).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                         </div>
                         <p className="text-[0.9rem] font-black text-brand-black">{trip.finalPrice || trip.clientPrice} FCFA</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Recharge Dialog */}
      {showRechargeDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-black/60 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm rounded-[32px] bg-white p-7 shadow-2xl"
          >
            <h3 className="mb-2 text-center text-xl font-black text-brand-black">Recharger le wallet</h3>
            <p className="mb-6 text-center text-[0.85rem] font-medium text-gray-400">
              Conducteur : <span className="font-bold text-brand-black">{targetUser.name || targetUser.email}</span>
            </p>
            
            <label className="mb-2 block text-[0.8rem] font-black uppercase tracking-wider text-gray-400">
              Montant à créditer (FCFA)
            </label>
            <input
              type="number"
              min="100"
              placeholder="Ex: 500"
              value={rechargeAmount}
              onChange={(e) => setRechargeAmount(e.target.value === "" ? "" : Number(e.target.value))}
              className="mb-8 h-14 w-full rounded-2xl border-2 border-gray-100 bg-gray-50 px-5 text-[1.1rem] font-black text-brand-black outline-none transition-all focus:border-brand-yellow focus:bg-white"
            />

            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={() => setShowRechargeDialog(false)}
                className="flex-1 h-12 rounded-2xl font-bold text-gray-400 transition-colors hover:text-red-500"
                disabled={isRecharging}
              >
                Annuler
              </Button>
              <Button
                onClick={handleRecharge}
                disabled={isRecharging || !rechargeAmount || Number(rechargeAmount) < 100}
                className="flex-[1.5] h-12 rounded-2xl bg-brand-yellow font-black text-brand-black hover:bg-brand-yellow/90 shadow-lg shadow-brand-yellow/20"
              >
                {isRecharging ? "..." : "Confirmer"}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
