import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { pb } from "../../lib/pocketbase"
import type { Litige } from "../../types"

export default function AdminLitiges() {
  const navigate = useNavigate()
  const [litiges, setLitiges] = useState<Litige[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    pb.collection("litiges").getList(1, 100, {
      filter: `status = "open"`,
      sort: "-created",
      requestKey: null,
    }).then((r) => {
      setLitiges(r.items as unknown as Litige[])
    }).finally(() => setIsLoading(false))
  }, [])

  const resoudre = async (id: string) => {
    await pb.collection("litiges").update(id, { status: "resolved" })
    setLitiges((prev) => prev.filter((l) => l.id !== id))
  }

  const rejeter = async (id: string) => {
    await pb.collection("litiges").update(id, { status: "dismissed" })
    setLitiges((prev) => prev.filter((l) => l.id !== id))
  }

  const reasonLabel: Record<string, string> = {
    no_show: "Conducteur absent",
    bad_behavior: "Mauvais comportement",
    fraud: "Fraude",
    other: "Autre",
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "500px", margin: "0 auto" }}>
      <h2>Litiges</h2>
      <button onClick={() => navigate("/admin")} style={{ marginBottom: "1rem", cursor: "pointer" }}>Retour</button>
      {isLoading && <p>Chargement...</p>}
      {!isLoading && litiges.length === 0 && <p>Aucun litige ouvert.</p>}
      {litiges.map((litige) => (
        <div key={litige.id} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem", borderRadius: "8px" }}>
          <p><strong>Raison :</strong> {reasonLabel[litige.reason] || litige.reason}</p>
          <p><strong>Description :</strong> {litige.description || "Aucune"}</p>
          <button onClick={() => resoudre(litige.id)} style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem", cursor: "pointer" }}>Résoudre</button>
          <button onClick={() => rejeter(litige.id)} style={{ width: "100%", padding: "0.5rem", cursor: "pointer" }}>Rejeter</button>
        </div>
      ))}
    </div>
  )
}