import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../../store/authStore"
import { pb } from "../../lib/pocketbase"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import BottomNav from "../../components/BottomNav"
import { motion } from "motion/react"
import { Home, Bike, ClipboardList, ArrowLeft, Phone, User as UserIcon, Wallet, LogOut, CheckCircle, Clock, Info, Save } from "lucide-react"

const NAV_ITEMS = [
  { icon: <Home className="size-[22px]" />,           label: "Accueil",    path: "/driver" },
  { icon: <Bike className="size-[22px]" />,           label: "Ma course",  path: "/driver/ma-course" },
  { icon: <ClipboardList className="size-[22px]" />,  label: "Historique", path: "/driver/historique" },
]

export default function DriverProfil() {
  const navigate = useNavigate()
  const { user, logout, checkAuth } = useAuthStore()

  const [name, setName] = useState(user?.name || "")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [commission, setCommission] = useState(25)

  useEffect(() => {
    if (user?.name) setName(user.name)

    // Charger la commission depuis PocketBase settings
    pb.collection("settings").getList(1, 1, { requestKey: null })
      .then(r => {
        if (r.items.length > 0) setCommission(r.items[0].commission_amount || 25)
      })
  }, [user?.name])

  const handleSave = async () => {
    if (!name.trim() || !user?.id) return
    if (password && password !== confirmPassword) return
    
    setIsSaving(true)
    const updateData: Record<string, unknown> = {}
    if (name !== user.name) updateData.name = name
    if (password && password.length >= 8) {
      updateData.password = password
      updateData.passwordConfirm = password
    }
    
    if (Object.keys(updateData).length === 0) {
      setIsSaving(false)
      return
    }
    
    try {
      await pb.collection("users").update(user.id, updateData, { requestKey: null })
      toast.success("Profil mis à jour")
      await checkAuth()
      setPassword("")
      setConfirmPassword("")
    } catch (err) {
      console.error(err)
      toast.error("Erreur lors de la mise à jour.")
    } finally {
      setIsSaving(false)
    }
  }

  // Génère les initiales à partir du nom
  const getInitials = (name?: string) => {
    if (!name) return "?"
    return name.charAt(0).toUpperCase()
  }

  // Formate le rôle pour l'affichage
  const formatRole = (role: string) => {
    const roles: Record<string, string> = {
      client: "Client",
      conducteur: "Conducteur",
      admin: "Administrateur",
    }
    return roles[role] || role
  }

  return (
    <div className="min-h-svh bg-brand-bg pb-20 font-sans">

      {/* Header */}
      <div className="relative overflow-hidden bg-brand-black px-6 pt-5 pb-7">
        <div className="pointer-events-none absolute -top-10 -right-10 size-[180px] rounded-full bg-[radial-gradient(circle,_var(--brand-orange)20_0%,_transparent_70%)]" />

        <button
          onClick={() => navigate("/driver")}
          className="mb-5 flex items-center gap-1.5 rounded-[10px] border border-white/12 bg-white/8 px-3 py-2 text-sm font-semibold text-white/80"
        >
          <ArrowLeft className="size-4" /> Retour
        </button>

        <h1 className="mb-1 text-[1.4rem] font-extrabold text-white">Mon profil</h1>
        <p className="text-[0.85rem] text-white/50">Informations de votre compte conducteur</p>
      </div>

      {/* Contenu */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="px-6 pt-6"
      >
        {/* Avatar + Nom + Statut */}
        <div className="mb-4 flex flex-col items-center rounded-[20px] bg-white p-6 text-center shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <div className="mb-4 flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-yellow to-brand-orange text-[2rem] font-extrabold text-white shadow-[0_4px_20px_var(--brand-yellow)40]">
            {getInitials(user?.name)}
          </div>

          <h2 className="mb-2 text-[1.3rem] font-extrabold text-brand-black">
            {user?.name || "Conducteur"}
          </h2>

          {/* Badge statut de vérification */}
          {user?.conducteur_verifie ? (
            <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-green/25 bg-brand-green/12 px-4 py-1.5 text-[0.8rem] font-bold text-brand-green">
              <CheckCircle className="size-3.5" /> Compte vérifié
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-orange/25 bg-brand-orange/12 px-4 py-1.5 text-[0.8rem] font-bold text-brand-orange">
              <Clock className="size-3.5" /> En attente de validation
            </div>
          )}
        </div>

        {/* Informations */}
        <div className="mb-4 rounded-[20px] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <h3 className="mb-4 text-[0.95rem] font-extrabold text-brand-black">
            Informations personnelles
          </h3>

          <div className="mb-4">
            <div className="mb-1.5 flex items-center gap-2.5">
              <Phone className="size-5 text-brand-orange" />
              <span className="text-[0.8rem] font-semibold text-gray-400">Numéro de téléphone</span>
            </div>
            <div className="pl-8 text-[0.95rem] font-semibold text-brand-black">
              {user?.phone || "Non renseigné"}
            </div>
          </div>

          <div className="mb-4">
            <div className="mb-1.5 flex items-center gap-2.5">
              <Bike className="size-5 text-brand-orange" />
              <span className="text-[0.8rem] font-semibold text-gray-400">Numéro de plaque</span>
            </div>
            <div className="pl-8 text-[0.95rem] font-semibold text-brand-black">
              {user?.plaque || "Non renseigné"}
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-center gap-2.5">
              <UserIcon className="size-5 text-brand-orange" />
              <span className="text-[0.8rem] font-semibold text-gray-400">Type de compte</span>
            </div>
            <div className="pl-8 text-[0.95rem] font-semibold text-brand-black">
              {formatRole(user?.role || "conducteur")}
            </div>
          </div>
        </div>

        {/* Edition de profil (inline) */}
        <div className="mb-4 rounded-[20px] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <h3 className="mb-4 text-[0.95rem] font-extrabold text-brand-black">
            Modifier mon profil
          </h3>
          
          <div className="mb-3">
            <label className="mb-1 block text-[0.8rem] font-semibold text-gray-500">Nom complet</label>
            <input 
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full rounded-[10px] border border-gray-200 bg-gray-50 px-3 py-2 text-[0.9rem] font-semibold text-brand-black outline-none focus:border-brand-orange"
            />
          </div>

          <div className="mb-3">
            <label className="mb-1 block text-[0.8rem] font-semibold text-gray-500">Nouveau mot de passe</label>
            <input 
              type="password"
              placeholder="Nouveau mot de passe (8 chiffres min)"
              value={password}
              onChange={e => setPassword(e.target.value)}
              inputMode="numeric"
              className="w-full rounded-[10px] border border-gray-200 bg-gray-50 px-3 py-2 text-[0.9rem] font-semibold text-brand-black outline-none focus:border-brand-orange"
            />
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-[0.8rem] font-semibold text-gray-500">Confirmer le mot de passe</label>
            <input 
              type="password"
              placeholder="Confirmer le mot de passe"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              inputMode="numeric"
              className="w-full rounded-[10px] border border-gray-200 bg-gray-50 px-3 py-2 text-[0.9rem] font-semibold text-brand-black outline-none focus:border-brand-orange"
            />
          </div>

          <Button 
            onClick={handleSave}
            disabled={isSaving || !name.trim() || (password.length > 0 && password !== confirmPassword)}
            className="w-full rounded-[10px] bg-brand-orange font-bold text-white hover:bg-brand-orange/90 disabled:opacity-50"
          >
            <Save className="mr-2 size-4" /> {isSaving ? "Sauvegarde..." : "Sauvegarder"}
          </Button>
        </div>

        {/* Wallet */}
        <div className="mb-6 rounded-[20px] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <h3 className="mb-4 text-[0.95rem] font-extrabold text-brand-black">
            Portefeuille
          </h3>

          <div className="flex items-center justify-between rounded-[14px] border-2 border-brand-yellow/25 bg-gradient-to-br from-brand-yellow/8 to-brand-orange/5 p-[18px]">
            <div>
              <div className="mb-1 text-[0.8rem] font-semibold text-gray-500">Solde actuel</div>
              <div className="text-[1.8rem] font-black text-brand-black">
                {user?.walletBalance ?? 0} <span className="text-base">FCFA</span>
              </div>
            </div>
            <Wallet className="size-10 text-brand-yellow" />
          </div>

          {/* Info commission */}
          <div className="mt-3 flex items-center gap-2.5 rounded-[10px] bg-brand-yellow/8 p-3">
            <Info className="size-5 shrink-0 text-brand-yellow" />
            <p className="text-[0.8rem] leading-snug text-gray-500">
              Commission par course : <strong className="text-brand-black">{commission} FCFA</strong>
            </p>
          </div>
        </div>

        {/* Note moyenne */}
        <div className="mb-6">
          {(user?.totalRating ?? 0) > 0 ? (
            <div className="rounded-[14px] bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
              <p className="mb-1 text-[0.78rem] text-gray-400">Note moyenne</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-brand-yellow">★</span>
                <span className="text-xl font-extrabold text-brand-black">{user?.rating}</span>
                <span className="text-[0.82rem] text-gray-400">({user?.totalRating} avis)</span>
              </div>
            </div>
          ) : (
            <div className="rounded-[14px] bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
              <p className="text-[0.82rem] text-gray-400">Aucun avis pour l'instant</p>
            </div>
          )}
        </div>

        {/* Bouton Déconnexion */}
        <Button
          onClick={() => {
            logout()
            navigate("/login")
          }}
          className="h-[50px] w-full rounded-[14px] border-2 border-brand-orange bg-white font-extrabold text-brand-orange hover:bg-brand-orange/5"
        >
          <LogOut className="mr-2 size-4" /> Déconnexion
        </Button>
      </motion.div>

      <BottomNav items={NAV_ITEMS} />
    </div>
  )
}
