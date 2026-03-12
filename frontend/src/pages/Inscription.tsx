import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../store/authStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { UserRole } from "../types"

const C = {
  jaune:  "#F5C518",
  noir:   "#1A1A2E",
  orange: "#E85D04",
  vert:   "#06D6A0",
}

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
    <div style={{
      minHeight: "100svh",
      background: `linear-gradient(135deg, ${C.noir} 0%, #0d0d1a 55%, #16213e 100%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px", fontFamily: "Inter, sans-serif",
    }}>
      <div style={{
        position: "fixed", top: "-100px", right: "-80px",
        width: "400px", height: "400px", borderRadius: "50%",
        background: `radial-gradient(circle, ${C.jaune}20 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />
      <div style={{
        position: "fixed", bottom: "-60px", left: "-60px",
        width: "300px", height: "300px", borderRadius: "50%",
        background: `radial-gradient(circle, ${C.orange}18 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      <div style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "24px",
        padding: "clamp(32px, 5vw, 48px)",
        width: "100%", maxWidth: "420px",
        backdropFilter: "blur(20px)",
        animation: "fadeUp 0.5s ease both",
      }}>

        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", marginBottom: "28px" }}
        >
          <div style={{
            width: "36px", height: "36px", borderRadius: "10px",
            background: C.jaune, display: "flex",
            alignItems: "center", justifyContent: "center", fontSize: "18px",
          }}>🏍️</div>
          <span style={{ color: "#fff", fontWeight: 900, fontSize: "1.15rem" }}>
            Zem<span style={{ color: C.jaune }}>Connect</span>
          </span>
        </div>

        {/* Titre + stepper conducteur */}
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ color: "#fff", fontWeight: 800, fontSize: "1.5rem", marginBottom: "6px" }}>
            {step === 1 ? "Créer un compte" : "Infos conducteur"}
          </h1>
          {role === "conducteur" && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "10px" }}>
              {[1, 2].map(s => (
                <div key={s} style={{
                  height: "4px", flex: 1, borderRadius: "100px",
                  background: step >= s ? C.jaune : "rgba(255,255,255,0.15)",
                  transition: "background 0.3s",
                }} />
              ))}
            </div>
          )}
        </div>

        {/* Erreur */}
        {error && (
          <div style={{
            background: "rgba(239,35,60,0.12)",
            border: "1px solid rgba(239,35,60,0.3)",
            color: "#ff6b7a", borderRadius: "10px",
            padding: "12px 16px", fontSize: "0.88rem",
            marginBottom: "20px",
          }}>
            {error}
          </div>
        )}

        {/* ÉTAPE 1 */}
        {step === 1 && (
          <>
            {/* Sélection rôle */}
            <div style={{ marginBottom: "24px" }}>
              <Label style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.88rem", fontWeight: 600, marginBottom: "10px", display: "block" }}>
                Je suis
              </Label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {[
                  { key: "client",     icon: "👤", label: "Client" },
                  { key: "conducteur", icon: "🏍️", label: "Conducteur" },
                ].map(({ key, icon, label }) => (
                  <button
                    key={key}
                    onClick={() => setRole(key as UserRole)}
                    style={{
                      background: role === key ? C.jaune : "rgba(255,255,255,0.07)",
                      border: role === key ? "none" : "1px solid rgba(255,255,255,0.12)",
                      borderRadius: "12px", padding: "14px",
                      cursor: "pointer", display: "flex",
                      flexDirection: "column", alignItems: "center", gap: "6px",
                      transition: "all 0.15s",
                    }}
                  >
                    <span style={{ fontSize: "1.6rem" }}>{icon}</span>
                    <span style={{
                      fontWeight: 700, fontSize: "0.88rem",
                      color: role === key ? C.noir : "rgba(255,255,255,0.7)",
                      fontFamily: "Inter, sans-serif",
                    }}>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Champs étape 1 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "18px", marginBottom: "24px" }}>

              <div>
                <Label style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.88rem", fontWeight: 600, marginBottom: "8px", display: "block" }}>
                  Numéro de téléphone
                </Label>
                <div style={{ position: "relative" }}>
                  <div style={{
                    position: "absolute", left: "14px", top: "50%",
                    transform: "translateY(-50%)",
                    color: "rgba(255,255,255,0.4)", fontSize: "0.9rem",
                    fontWeight: 600, userSelect: "none" as const,
                  }}>
                    🇧🇯 +229
                  </div>
                  <Input
                    type="tel"
                    placeholder="01 00 00 00 00"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    style={{
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: "#fff", borderRadius: "10px",
                      height: "48px", fontSize: "0.95rem",
                      paddingLeft: "90px",
                    }}
                  />
                </div>
              </div>

              <div>
                <Label style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.88rem", fontWeight: 600, marginBottom: "8px", display: "block" }}>
                  Nom complet
                </Label>
                <Input
                  type="text"
                  placeholder="Ex: Koffi Mensah"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "#fff", borderRadius: "10px",
                    height: "48px", fontSize: "0.95rem",
                  }}
                />
              </div>

              <div>
                <Label style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.88rem", fontWeight: 600, marginBottom: "8px", display: "block" }}>
                  Mot de passe
                </Label>
                <Input
                  type="password"
                  placeholder="8 caractères minimum"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "#fff", borderRadius: "10px",
                    height: "48px", fontSize: "0.95rem",
                  }}
                />
              </div>

              <div>
                <Label style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.88rem", fontWeight: 600, marginBottom: "8px", display: "block" }}>
                  Confirmer le mot de passe
                </Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "#fff", borderRadius: "10px",
                    height: "48px", fontSize: "0.95rem",
                  }}
                />
              </div>
            </div>

            <Button
              onClick={validerEtape1}
              disabled={isLoading}
              style={{
                width: "100%", background: C.jaune, color: C.noir,
                fontWeight: 800, fontSize: "16px", height: "48px",
                borderRadius: "100px",
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? "not-allowed" : "pointer",
              }}
            >
              {role === "conducteur" ? "Continuer →" : isLoading ? "Création..." : "Créer mon compte"}
            </Button>
          </>
        )}

        {/* ÉTAPE 2 — Conducteur uniquement */}
        {step === 2 && (
          <>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.88rem", marginBottom: "24px" }}>
              Ces informations seront vérifiées par notre équipe avant activation de votre compte.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "28px" }}>
              <div>
                <Label style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.88rem", fontWeight: 600, marginBottom: "8px", display: "block" }}>
                  Numéro de plaque
                </Label>
                <Input
                  type="text"
                  placeholder="Ex: BJ 1234 AB"
                  value={plaque}
                  onChange={e => setPlaque(e.target.value)}
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "#fff", borderRadius: "10px",
                    height: "48px", fontSize: "0.95rem",
                  }}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <Button
                onClick={() => { setStep(1); setError("") }}
                style={{
                  flex: 1, background: "rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.7)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  fontWeight: 700, height: "48px", borderRadius: "100px",
                }}
              >
                ← Retour
              </Button>
              <Button
                onClick={handleEtape2}
                disabled={isLoading}
                style={{
                  flex: 2, background: C.jaune, color: C.noir,
                  fontWeight: 800, fontSize: "15px", height: "48px",
                  borderRadius: "100px",
                  opacity: isLoading ? 0.7 : 1,
                  cursor: isLoading ? "not-allowed" : "pointer",
                }}
              >
                {isLoading ? "Création..." : "Finaliser l'inscription"}
              </Button>
            </div>
          </>
        )}

        {step === 1 && (
          <p style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: "0.88rem", marginTop: "20px" }}>
            Déjà un compte ?{" "}
            <span
              onClick={() => navigate("/login")}
              style={{ color: C.jaune, fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}
            >
              Se connecter
            </span>
          </p>
        )}
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        input::placeholder { color: rgba(255,255,255,0.25) !important; }
        input:focus {
          border-color: ${C.jaune}80 !important;
          outline: none !important;
          box-shadow: 0 0 0 3px ${C.jaune}20 !important;
        }
      `}</style>
    </div>
  )
}