import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { pb } from "../../lib/pocketbase"
import { useAuthStore } from "../../store/authStore"
import { Button } from "@/components/ui/button"
import BottomNav from "../../components/BottomNav"
import { motion } from "motion/react"
import { BarChart3, Users, Bike, AlertTriangle, ArrowLeft, Check, X } from "lucide-react"
import type { Litige } from "../../types"

const NAV_ITEMS = [
  { icon: <BarChart3 className="size-[22px]" />,       label: "Stats",        path: "/admin" },
  { icon: <Users className="size-[22px]" />,            label: "Utilisateurs", path: "/admin/utilisateurs" },
  { icon: <Bike className="size-[22px]" />,             label: "Courses",      path: "/admin/courses" },
  { icon: <AlertTriangle className="size-[22px]" />,    label: "Litiges",      path: "/admin/litiges" },
]

const STATUS_CONFIG: Record<string, { label: string; colorClass: string; bgClass: string }> = {
  open:      { label: "Ouvert", colorClass: "text-brand-orange", bgClass: "bg-brand-orange/10" },
  resolved:  { label: "Résolu", colorClass: "text-brand-green",  bgClass: "bg-brand-green/10" },
  dismissed: { label: "Rejeté", colorClass: "text-gray-500",     bgClass: "bg-gray-100" },
}

export default function AdminLitiges() {
  const { user }                    = useAuthStore()
  const navigate                    = useNavigate()
  const [litiges, setLitiges]       = useState<Litige[]>([])
  const [isLoading, setIsLoading]   = useState(true)
  const [filter, setFilter]         = useState<"all" | "open" | "resolved" | "dismissed">("open")
  const [processingId, setProcessingId] = useState<string | null>(null)

  useEffect(() => {
    if (!user?.id) return

    const loadLitiges = () => {
      pb.collection("litiges").getList(1, 100, {
        sort: "-created",
        requestKey: null,
      }).then(r => {
        setLitiges(r.items as unknown as Litige[])
      }).finally(() => setIsLoading(false))
    }

    loadLitiges()

    let unsubscribeLitiges: (() => void) | undefined

    const initSubscriptions = async () => {
      unsubscribeLitiges = await pb.collection("litiges").subscribe("*", () => {
        loadLitiges()
      }, { requestKey: null })
    }

    initSubscriptions()

    return () => {
      if (unsubscribeLitiges) unsubscribeLitiges()
    }
  }, [user?.id])

  const filtered = litiges.filter(l => filter === "all" || l.status === filter)

  const resoudre = async (id: string) => {
    setProcessingId(id)
    try {
      await pb.collection("litiges").update(id, { status: "resolved" }, { requestKey: null })
      setLitiges(prev => prev.map(l => l.id === id ? { ...l, status: "resolved" } : l))
    } finally {
      setProcessingId(null)
    }
  }

  const rejeter = async (id: string) => {
    setProcessingId(id)
    try {
      await pb.collection("litiges").update(id, { status: "dismissed" }, { requestKey: null })
      setLitiges(prev => prev.map(l => l.id === id ? { ...l, status: "dismissed" } : l))
    } finally {
      setProcessingId(null)
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
            Litiges ({litiges.length})
          </p>
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
            { key: "all",       label: "Tous" },
            { key: "open",      label: "Ouverts" },
            { key: "resolved",  label: "Résolus" },
            { key: "dismissed", label: "Rejetés" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key as typeof filter)}
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
            <Check className="mx-auto mb-4 size-12 text-brand-green" />
            <p className="mb-2 font-bold text-brand-black">Aucun litige trouvé</p>
            <p className="text-[0.88rem] text-gray-400">Pour le filtre sélectionné.</p>
          </div>
        )}

        {filtered.map(litige => {
          const sc = STATUS_CONFIG[litige.status] || { label: litige.status, colorClass: "text-gray-500", bgClass: "bg-gray-100" }
          return (
          <div key={litige.id} className={`mb-3.5 rounded-[20px] border-l-4 ${litige.status === "open" ? "border-brand-orange" : litige.status === "resolved" ? "border-brand-green" : "border-gray-400"} bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]`}>

            <div className="mb-3.5 flex items-start justify-between">
              {/* Badge raison */}
              <p className="text-[0.72rem] text-gray-400">#{litige.id.slice(0, 8)}</p>

              {/* Badge statut */}
              <div className={`shrink-0 rounded-full px-3 py-1 text-[0.75rem] font-bold ${sc.bgClass} ${sc.colorClass}`}>
                {sc.label}
              </div>
            </div>

            {/* Description */}
            {litige.description && (
              <div className="mb-4 rounded-[10px] bg-brand-bg px-3.5 py-3">
                <p className="mb-1 text-[0.78rem] text-gray-400">Description</p>
                <p className="text-[0.9rem] leading-relaxed text-brand-black">{litige.description}</p>
              </div>
            )}

            {/* Actions */}
            {litige.status === "open" && (
              <div className="flex gap-2.5">
                <Button
                  onClick={() => resoudre(litige.id)}
                  disabled={processingId === litige.id}
                  className="h-[42px] flex-1 rounded-[10px] bg-brand-green text-sm font-bold text-white hover:bg-brand-green/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {processingId === litige.id ? "..." : <><Check className="mr-1 size-3.5" /> Résoudre</>}
                </Button>
                <Button
                  onClick={() => rejeter(litige.id)}
                  disabled={processingId === litige.id}
                  className="h-[42px] flex-1 rounded-[10px] border border-red-500/20 bg-red-500/8 text-sm font-bold text-red-500 hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {processingId === litige.id ? "..." : <><X className="mr-1 size-3.5" /> Rejeter</>}
                </Button>
              </div>
            )}
          </div>
        )})}
      </motion.div>

      <BottomNav items={NAV_ITEMS} />
    </div>
  )
}