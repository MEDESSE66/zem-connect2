import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../store/authStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const C = {
  jaune:  "#F5C518",
  noir:   "#1A1A2E",
  orange: "#E85D04",
}

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
          style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", marginBottom: "32px" }}
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

        <h1 style={{ color: "#fff", fontWeight: 800, fontSize: "1.6rem", marginBottom: "8px" }}>
          Connexion
        </h1>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", marginBottom: "32px" }}>
          Entrez votre numéro de téléphone et mot de passe.
        </p>

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

        {/* Numéro de téléphone */}
        <div style={{ marginBottom: "20px" }}>
          <Label style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.88rem", fontWeight: 600, marginBottom: "8px", display: "block" }}>
            Numéro de téléphone
          </Label>
          <div style={{ position: "relative" }}>
            <div style={{
              position: "absolute", left: "14px", top: "50%",
              transform: "translateY(-50%)",
              color: "rgba(255,255,255,0.4)", fontSize: "0.9rem",
              fontWeight: 600, userSelect: "none",
            }}>
              🇧🇯 +229
            </div>
            <Input
              type="tel"
              placeholder="01 00 00 00 00"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              onKeyDown={handleKeyDown}
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

        {/* Mot de passe */}
        <div style={{ marginBottom: "28px" }}>
          <Label style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.88rem", fontWeight: 600, marginBottom: "8px", display: "block" }}>
            Mot de passe
          </Label>
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#fff", borderRadius: "10px",
              height: "48px", fontSize: "0.95rem",
            }}
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          style={{
            width: "100%", background: C.jaune, color: C.noir,
            fontWeight: 800, fontSize: "16px", height: "48px",
            borderRadius: "100px",
            opacity: isLoading ? 0.7 : 1,
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
          onMouseEnter={e => { if (!isLoading) e.currentTarget.style.transform = "translateY(-1px)" }}
          onMouseLeave={e => { e.currentTarget.style.transform = "" }}
        >
          {isLoading ? "Connexion en cours..." : "Se connecter"}
        </Button>

        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: "0.88rem", marginTop: "24px" }}>
          Pas encore de compte ?{" "}
          <span
            onClick={() => navigate("/inscription")}
            style={{ color: C.jaune, fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}
          >
            S'inscrire
          </span>
        </p>
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