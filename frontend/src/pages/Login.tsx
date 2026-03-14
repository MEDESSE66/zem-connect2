import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../store/authStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion } from "motion/react"
import { Bike, Phone } from "lucide-react"

export default function Login() {
  const [phone, setPhone]       = useState("")
  const [password, setPassword] = useState("")
  const [error, setError]       = useState("")
  const { login, isLoading }    = useAuthStore()
  const navigate                = useNavigate()

  const handleSubmit = async () => {
    if (!phone || !password) {
      setError("Veuillez remplir tous les champs.")
      return
    }
    setError("")
    try {
      await login(phone, password)
      const user = useAuthStore.getState().user
      if (user?.role === "client")          navigate("/client")
      else if (user?.role === "conducteur") navigate("/driver")
      else if (user?.role === "admin")      navigate("/admin")
    } catch {
      setError("Numéro de téléphone ou mot de passe incorrect.")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit()
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
          className="mb-8 flex cursor-pointer items-center gap-2.5"
        >
          <div className="flex size-9 items-center justify-center rounded-[10px] bg-brand-yellow">
            <Bike className="size-5 text-brand-black" />
          </div>
          <span className="text-lg font-black text-white">
            Zem<span className="text-brand-yellow">Connect</span>
          </span>
        </div>

        <h1 className="mb-2 text-[1.6rem] font-extrabold text-white">
          Connexion
        </h1>
        <p className="mb-8 text-[0.9rem] text-white/50">
          Entrez votre numéro de téléphone et mot de passe.
        </p>

        {error && (
          <div className="mb-5 rounded-[10px] border border-red-500/30 bg-red-500/12 px-4 py-3 text-[0.88rem] text-[#ff6b7a]">
            {error}
          </div>
        )}

        {/* Numéro de téléphone */}
        <div className="mb-5">
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
              onKeyDown={handleKeyDown}
              className="dark-input h-12 rounded-[10px] border-white/12 bg-white/7 pl-[90px] text-[0.95rem] text-white"
            />
          </div>
        </div>

        {/* Mot de passe */}
        <div className="mb-7">
          <Label className="mb-2 block text-[0.88rem] font-semibold text-white/70">
            Mot de passe
          </Label>
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            className="dark-input h-12 rounded-[10px] border-white/12 bg-white/7 text-[0.95rem] text-white"
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="h-12 w-full rounded-full bg-brand-yellow text-base font-extrabold text-brand-black transition-transform hover:-translate-y-px hover:bg-brand-yellow/90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? "Connexion en cours..." : "Se connecter"}
        </Button>

        <p className="mt-6 text-center text-[0.88rem] text-white/40">
          Pas encore de compte ?{" "}
          <span
            onClick={() => navigate("/inscription")}
            className="cursor-pointer font-bold text-brand-yellow underline"
          >
            S'inscrire
          </span>
        </p>
      </motion.div>
    </div>
  )
}