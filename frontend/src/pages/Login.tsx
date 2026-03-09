import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../store/authStore"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login, isLoading } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async () => {
    setError("")
    try {
      await login(email, password)
      const user = useAuthStore.getState().user
      if (user?.role === "client") navigate("/client")
      else if (user?.role === "conducteur") navigate("/driver")
      else if (user?.role === "admin") navigate("/admin")
    } catch {
      setError("Email ou mot de passe incorrect")
    }
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto" }}>
      <h1>Zem Connect</h1>
      <h2>Connexion</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ display: "block", width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ display: "block", width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
        />
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          style={{ width: "100%", padding: "0.75rem", cursor: "pointer" }}
        >
          {isLoading ? "Connexion..." : "Se connecter"}
        </button>
      </div>
    </div>
  )
}