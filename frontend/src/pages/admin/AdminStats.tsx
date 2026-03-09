import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { pb } from "../../lib/pocketbase"
import { useAuthStore } from "../../store/authStore"

export default function AdminStats() {
  const { logout } = useAuthStore()
  const navigate = useNavigate()
  const [totalCommissions, setTotalCommissions] = useState(0)
  const [totalTrips, setTotalTrips] = useState(0)

  useEffect(() => {
    pb.collection("transactions").getList(1, 1000, {
      filter: `type = "commission" && status = "completed"`,
      requestKey: null,
    }).then((r) => {
      const total = r.items.reduce((sum, t) => sum + (t as any).amount, 0)
      setTotalCommissions(total)
    })

    pb.collection("trips").getList(1, 1, {
      filter: `status = "completed"`,
      requestKey: null,
    }).then((r) => setTotalTrips(r.totalItems))
  }, [])

  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto" }}>
      <h2>Tableau de bord Admin</h2>
      <button onClick={() => navigate("/admin/utilisateurs")} style={{ display: "block", width: "100%", padding: "0.75rem", marginBottom: "1rem", cursor: "pointer" }}>Utilisateurs</button>
      <button onClick={() => navigate("/admin/courses")} style={{ display: "block", width: "100%", padding: "0.75rem", marginBottom: "1rem", cursor: "pointer" }}>Courses</button>
      <button onClick={() => navigate("/admin/litiges")} style={{ display: "block", width: "100%", padding: "0.75rem", marginBottom: "1rem", cursor: "pointer" }}>Litiges</button>
      <button onClick={() => { logout(); navigate("/login") }} style={{ display: "block", width: "100%", padding: "0.75rem", marginBottom: "2rem", cursor: "pointer" }}>Déconnexion</button>
      <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px", marginBottom: "1rem" }}>
        <p><strong>Commissions collectées :</strong> {totalCommissions} FCFA</p>
      </div>
      <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
        <p><strong>Courses terminées :</strong> {totalTrips}</p>
      </div>
    </div>
  )
}