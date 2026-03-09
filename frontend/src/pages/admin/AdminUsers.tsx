import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { pb } from "../../lib/pocketbase"
import type { User } from "../../types"

export default function AdminUsers() {
  const navigate = useNavigate()
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    pb.collection("users").getList(1, 100, {
      sort: "-created",
      requestKey: null,
    }).then((r) => {
      setUsers(r.items as unknown as User[])
    }).finally(() => setIsLoading(false))
  }, [])

  const toggleSuspend = async (user: User) => {
    await pb.collection("users").update(user.id, { isSuspended: !user.isSuspended })
    setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, isSuspended: !u.isSuspended } : u))
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "500px", margin: "0 auto" }}>
      <h2>Utilisateurs</h2>
      <button onClick={() => navigate("/admin")} style={{ marginBottom: "1rem", cursor: "pointer" }}>Retour</button>
      {isLoading && <p>Chargement...</p>}
      {users.map((user) => (
        <div key={user.id} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem", borderRadius: "8px" }}>
          <p><strong>{user.email}</strong> — {user.role}</p>
          <p>Téléphone : {user.phone}</p>
          <p>Wallet : {user.walletBalance} FCFA</p>
          <p>Statut : {user.isSuspended ? "Suspendu" : "Actif"}</p>
          <button onClick={() => toggleSuspend(user)} style={{ width: "100%", padding: "0.5rem", cursor: "pointer" }}>
            {user.isSuspended ? "Réactiver" : "Suspendre"}
          </button>
        </div>
      ))}
    </div>
  )
}