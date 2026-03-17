import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { pb } from "../../lib/pocketbase"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import BottomNav from "../../components/BottomNav"
import { motion } from "motion/react"
import { BarChart3, Users, Bike, AlertTriangle, ArrowLeft, Save } from "lucide-react"

const NAV_ITEMS = [
  { icon: <BarChart3 className="size-[22px]" />,       label: "Stats",        path: "/admin" },
  { icon: <Users className="size-[22px]" />,            label: "Utilisateurs", path: "/admin/utilisateurs" },
  { icon: <Bike className="size-[22px]" />,             label: "Courses",      path: "/admin/courses" },
  { icon: <AlertTriangle className="size-[22px]" />,    label: "Litiges",      path: "/admin/litiges" },
]

export default function AdminSettings() {
  const navigate = useNavigate()
  
  const [settingsId, setSettingsId] = useState<string | null>(null)
  const [commission, setCommission] = useState(25)
  const [bonus, setBonus] = useState(200) // Défaut modifié pour correspondre au code (200)
  const [abonnement, setAbonnement] = useState(500)
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // Tente de récupérer le record unique des settings
    const loadSettings = async () => {
      try {
        const records = await pb.collection("settings").getList(1, 1, { requestKey: null })
        if (records.items.length > 0) {
          const s = records.items[0]
          setSettingsId(s.id)
          setCommission(s.commission_amount || 25)
          setBonus(s.welcome_bonus || 200)
          setAbonnement(s.subscription_price || 500)
        }
      } catch (err) {
        console.error("Collection settings introuvable ou vide. Il faudra la créer via l'interface PB.", err)
      } finally {
        setIsLoading(false)
      }
    }
    loadSettings()
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const data = {
        commission_amount: commission,
        welcome_bonus: bonus,
        subscription_price: abonnement
      }

      if (settingsId) {
        await pb.collection("settings").update(settingsId, data, { requestKey: null })
      } else {
        const newRecord = await pb.collection("settings").create(data, { requestKey: null })
        setSettingsId(newRecord.id)
      }
      toast.success("Paramètres enregistrés avec succès.")
    } catch (err) {
      console.error("Erreur sauvegarde settings", err)
      toast.error("Erreur lors de la sauvegarde. Assurez-vous que la collection 'settings' existe dans PocketBase.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-svh bg-brand-bg pb-20 font-sans">
      {/* Header */}
      <div className="flex items-center gap-3.5 bg-brand-black px-6 pt-5 pb-6 text-white text-center sm:text-left">
        <button
          onClick={() => navigate("/admin")}
          className="flex size-[38px] shrink-0 items-center justify-center rounded-[10px] border border-white/12 bg-white/8 text-white"
        >
          <ArrowLeft className="size-[18px]" />
        </button>
        <div>
          <p className="text-[0.8rem] text-white/50">Admin</p>
          <p className="text-[1.05rem] font-extrabold text-white">Paramètres</p>
        </div>
      </div>

      {/* Contenu */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="px-6 pt-6"
      >
        <div className="mb-6 rounded-[20px] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <h2 className="mb-5 text-lg font-black text-brand-black">Configuration Financière</h2>

          {isLoading ? (
            <div className="py-8 text-center text-gray-400">Chargement...</div>
          ) : (
            <div className="flex flex-col gap-5">
              
              <div>
                <label className="mb-2 block text-[0.85rem] font-bold text-gray-600">
                  Commission par course (FCFA)
                </label>
                <input
                  type="number"
                  value={commission}
                  onChange={e => setCommission(parseInt(e.target.value) || 0)}
                  className="w-full rounded-xl border-[1.5px] border-gray-200 bg-gray-50/50 px-4 py-3 text-[0.95rem] font-semibold text-brand-black outline-none focus:border-brand-yellow focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-[0.85rem] font-bold text-gray-600">
                  Bonus de bienvenue conducteur (FCFA)
                </label>
                <input
                  type="number"
                  value={bonus}
                  onChange={e => setBonus(parseInt(e.target.value) || 0)}
                  className="w-full rounded-xl border-[1.5px] border-gray-200 bg-gray-50/50 px-4 py-3 text-[0.95rem] font-semibold text-brand-black outline-none focus:border-brand-yellow focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-[0.85rem] font-bold text-gray-600">
                  Prix abonnement hebdomadaire (FCFA)
                </label>
                <input
                  type="number"
                  value={abonnement}
                  onChange={e => setAbonnement(parseInt(e.target.value) || 0)}
                  className="w-full rounded-xl border-[1.5px] border-gray-200 bg-gray-50/50 px-4 py-3 text-[0.95rem] font-semibold text-brand-black outline-none focus:border-brand-yellow focus:bg-white"
                />
              </div>

              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="mt-2 h-auto flex w-full items-center justify-center gap-2 rounded-[12px] bg-brand-yellow py-3.5 text-[0.95rem] font-extrabold text-brand-black hover:bg-brand-yellow/90 disabled:opacity-50"
              >
                <Save className="size-4" />
                {isSaving ? "Sauvegarde..." : "Enregistrer les paramètres"}
              </Button>
            </div>
          )}
        </div>
      </motion.div>

      <BottomNav items={NAV_ITEMS} />
    </div>
  )
}
