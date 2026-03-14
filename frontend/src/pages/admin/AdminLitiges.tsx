import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { pb } from "../../lib/pocketbase"
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

const REASON_LABEL: Record<string, string> = {
  no_show:      "Conducteur absent",
  bad_behavior: "Mauvais comportement",
  fraud:        "Fraude",
  other:        "Autre",
}

export default function AdminLitiges() {
  const navigate                    = useNavigate()
  const [litiges, setLitiges]       = useState<Litige[]>([])
  const [isLoading, setIsLoading]   = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)

  useEffect(() => {
    pb.collection("litiges").getList(1, 100, {
      filter: `status = "open"`,
      sort: "-created",
      requestKey: null,
    }).then(r => {
      setLitiges(r.items as unknown as Litige[])
    }).finally(() => setIsLoading(false))
  }, [])

  const resoudre = async (id: string) => {
    setProcessingId(id)
    try {
      await pb.collection("litiges").update(id, { status: "resolved" }, { requestKey: null })
      setLitiges(prev => prev.filter(l => l.id !== id))
    } finally {
      setProcessingId(null)
    }
  }

  const rejeter = async (id: string) => {
    setProcessingId(id)
    try {
      await pb.collection("litiges").update(id, { status: "dismissed" }, { requestKey: null })
      setLitiges(prev => prev.filter(l => l.id !== id))
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
            Litiges ouverts ({litiges.length})
          </p>
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

        {!isLoading && litiges.length === 0 && (
          <div className="rounded-[20px] bg-white px-6 py-12 text-center shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
            <Check className="mx-auto mb-4 size-12 text-brand-green" />
            <p className="mb-2 font-bold text-brand-black">Aucun litige ouvert</p>
            <p className="text-[0.88rem] text-gray-400">Tous les litiges ont été traités.</p>
          </div>
        )}

        {litiges.map(litige => (
          <div key={litige.id} className="mb-3.5 rounded-[20px] border-l-4 border-brand-orange bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">

            {/* Badge raison */}
            <div className="mb-3.5 inline-flex items-center gap-1 rounded-full bg-brand-orange/8 px-3 py-1 text-[0.75rem] font-bold text-brand-orange">
              <AlertTriangle className="size-3" /> {REASON_LABEL[litige.reason] || litige.reason}
            </div>

            {/* Description */}
            {litige.description && (
              <div className="mb-4 rounded-[10px] bg-brand-bg px-3.5 py-3">
                <p className="mb-1 text-[0.78rem] text-gray-400">Description</p>
                <p className="text-[0.9rem] leading-relaxed text-brand-black">{litige.description}</p>
              </div>
            )}

            {/* Actions */}
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
          </div>
        ))}
      </motion.div>

      <BottomNav items={NAV_ITEMS} />
    </div>
  )
}