import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../store/authStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from "motion/react"
import { Bike, User, Phone, IdCard } from "lucide-react"
import type { UserRole } from "../types"

export default function Inscription() {
  const navigate                = useNavigate()
  const { register, isLoading } = useAuthStore()

  const [role, setRole]         = useState<UserRole>("client")
  const [phone, setPhone]       = useState("")
  const [name, setName]         = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm]   = useState("")
  const [plaque, setPlaque]     = useState("")
  const [step, setStep]         = useState(1)
  const [error, setError]       = useState("")

  const validerEtape1 = () => {
    setError("")
    if (!phone || !name || !password || !confirm) {
      setError("Tous les champs sont obligatoires.")
      return
    }
    if (phone.length < 10) {
      setError("Numéro de téléphone invalide.")
      return
    }
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.")
      return
    }
    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.")
      return
    }
    if (role === "conducteur") {
      setStep(2)
    } else {
      handleSubmit()
    }
  }

  const handleSubmit = async (plaqueFinal?: string) => {
    setError("")
    try {
      const extra = plaqueFinal ? { plaque: plaqueFinal, conducteur_verifie: false } : {}
      await register(phone, password, name, role, extra)
      if (role === "client")          navigate("/client")
      else if (role === "conducteur") navigate("/driver")
    } catch (e: any) {
      const msg = e?.response?.data
      if (msg?.phone) setError("Ce numéro de téléphone est déjà utilisé.")
      else setError("Erreur lors de l'inscription. Réessayez.")
    }
  }

  const handleEtape2 = () => {
    setError("")
    if (!plaque) {
      setError("Le numéro de plaque est obligatoire.")
      return
    }
    handleSubmit(plaque)
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-gradient-to-br from-brand-black via-brand-dark to-brand-navy p-6 font-sans">
      {/* Decorative blobs */}
      <div className="pointer-events-none fixed -top-[100px] -right-20 size-[400px] rounded-full bg-[radial-gradient(circle,_var(--brand-yellow)20_0%,_transparent_70%)]" />
      <div className="pointer-events-none fixed -bottom-[60px] -left-[60px] size-[300px] rounded-full bg-[radial-gradient(circle,_var(--brand-orange)18_0%,_transparent_70%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-dark w-full max-w-[420px] rounded-3xl p-[clamp(32px,5vw,48px)]"
      >
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="mb-7 flex cursor-pointer items-center gap-2.5"
        >
          <div className="flex size-9 items-center justify-center rounded-[10px] bg-brand-yellow">
            <Bike className="size-5 text-brand-black" />
          </div>
          <span className="text-lg font-black text-white">
            Zem<span className="text-brand-yellow">Connect</span>
          </span>
        </div>

        {/* Titre + stepper conducteur */}
        <div className="mb-6">
          <h1 className="mb-1.5 text-2xl font-extrabold text-white">
            {step === 1 ? "Créer un compte" : "Infos conducteur"}
          </h1>
          {role === "conducteur" && (
            <div className="mt-2.5 flex items-center gap-2">
              {[1, 2].map(s => (
                <div
                  key={s}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    step >= s ? "bg-brand-yellow" : "bg-white/15"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Erreur */}
        {error && (
          <div className="mb-5 rounded-[10px] border border-red-500/30 bg-red-500/12 px-4 py-3 text-[0.88rem] text-[#ff6b7a]">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* ÉTAPE 1 */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
            >
              {/* Sélection rôle */}
              <div className="mb-6">
                <Label className="mb-2.5 block text-[0.88rem] font-semibold text-white/70">
                  Je suis
                </Label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { key: "client",     icon: <User className="size-7" />,   label: "Client" },
                    { key: "conducteur", icon: <Bike className="size-7" />,   label: "Conducteur" },
                  ].map(({ key, icon, label }) => (
                    <button
                      key={key}
                      onClick={() => setRole(key as UserRole)}
                      className={`flex min-h-[60px] cursor-pointer flex-col items-center gap-1.5 rounded-xl p-3.5 transition-all ${
                        role === key
                          ? "border-none bg-brand-yellow text-brand-black"
                          : "border border-white/12 bg-white/7 text-white/70"
                      }`}
                    >
                      {icon}
                      <span className="text-[0.88rem] font-bold">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Champs étape 1 */}
              <div className="mb-6 flex flex-col gap-[18px]">
                <div>
                  <Label className="mb-2 block text-[0.88rem] font-semibold text-white/70">
                    Numéro de téléphone
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 flex -translate-y-1/2 items-center gap-1 text-[0.9rem] font-semibold text-white/40 select-none">
                      <Phone className="size-3.5" /> +229
                    </div>
                    <Input
                      type="tel"
                      placeholder="01 00 00 00 00"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      inputMode="numeric"
                      className="dark-input h-12 rounded-[10px] border-white/12 bg-white/7 pl-[90px] text-[0.95rem] text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block text-[0.88rem] font-semibold text-white/70">
                    Nom complet
                  </Label>
                  <Input
                    type="text"
                    placeholder="Ex: KOUCHAMI Mèdessè"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="dark-input h-12 rounded-[10px] border-white/12 bg-white/7 text-[0.95rem] text-white"
                  />
                </div>

                <div>
                  <Label className="mb-2 block text-[0.88rem] font-semibold text-white/70">
                    Mot de passe
                  </Label>
                  <Input
                    type="password"
                    placeholder="8 caractères minimum"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    inputMode="numeric"
                    className="dark-input h-12 rounded-[10px] border-white/12 bg-white/7 text-[0.95rem] text-white"
                  />
                </div>

                <div>
                  <Label className="mb-2 block text-[0.88rem] font-semibold text-white/70">
                    Confirmer le mot de passe
                  </Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    inputMode="numeric"
                    className="dark-input h-12 rounded-[10px] border-white/12 bg-white/7 text-[0.95rem] text-white"
                  />
                </div>
              </div>

              <Button
                onClick={validerEtape1}
                disabled={isLoading}
                className="h-12 w-full rounded-full bg-brand-yellow text-base font-extrabold text-brand-black hover:bg-brand-yellow/90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {role === "conducteur" ? "Continuer →" : isLoading ? "Création..." : "Créer mon compte"}
              </Button>

              <p className="mt-5 text-center text-[0.88rem] text-white/40">
                Déjà un compte ?{" "}
                <span
                  onClick={() => navigate("/login")}
                  className="cursor-pointer font-bold text-brand-yellow underline"
                >
                  Se connecter
                </span>
              </p>
            </motion.div>
          )}

          {/* ÉTAPE 2 — Conducteur uniquement */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <p className="mb-6 text-[0.88rem] text-white/50">
                Ces informations seront vérifiées par notre équipe avant activation de votre compte.
              </p>

              <div className="mb-7 flex flex-col gap-5">
                <div>
                  <Label className="mb-2 block text-[0.88rem] font-semibold text-white/70">
                    <span className="inline-flex items-center gap-1.5">
                      <IdCard className="size-4" /> Numéro de plaque
                    </span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="Ex: BJ 1234 AB"
                    value={plaque}
                    onChange={e => setPlaque(e.target.value)}
                    className="dark-input h-12 rounded-[10px] border-white/12 bg-white/7 text-[0.95rem] text-white"
                  />
                </div>
              </div>

              <div className="flex gap-2.5">
                <Button
                  onClick={() => { setStep(1); setError("") }}
                  className="h-12 flex-1 rounded-full border border-white/12 bg-white/8 font-bold text-white/70 hover:bg-white/12"
                >
                  ← Retour
                </Button>
                <Button
                  onClick={handleEtape2}
                  disabled={isLoading}
                  className="h-12 flex-[2] rounded-full bg-brand-yellow text-[15px] font-extrabold text-brand-black hover:bg-brand-yellow/90 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoading ? "Création..." : "Finaliser l'inscription"}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}