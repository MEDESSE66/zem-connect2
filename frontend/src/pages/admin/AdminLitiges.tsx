import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { pb } from "../../lib/pocketbase"
import { Button } from "@/components/ui/button"
import BottomNav from "../../components/BottomNav"
import type { Litige } from "../../types"

const C = {
  jaune:  "#F5C518",
  noir:   "#1A1A2E",
  orange: "#E85D04",
  vert:   "#06D6A0",
  fond:   "#F8F9FA",
}

const NAV_ITEMS = [
  { icon: "📊", label: "Stats",        path: "/admin" },
  { icon: "👥", label: "Utilisateurs", path: "/admin/utilisateurs" },
  { icon: "🏍️", label: "Courses",      path: "/admin/courses" },
  { icon: "⚠️", label: "Litiges",      path: "/admin/litiges" },
]

const REASON_LABEL: Record<string, string> = {
  no_show:      "Conducteur absent",
  bad_behavior: "Mauvais comportement",
  fraud:        "Fraude",
  other:        "Autre",
}

export default function AdminLitiges() {
  const navigate                    = useNavigate()
  const [litiges, setLitiges]       = useState<Litige[]>([])
  const [isLoading, setIsLoading]   = useState(true)

  useEffect(() => {
    pb.collection("litiges").getList(1, 100, {
      filter: `status = "open"`,
      sort: "-created",
      requestKey: null,
    }).then(r => {
      setLitiges(r.items as unknown as Litige[])
    }).finally(() => setIsLoading(false))
  }, [])

  const resoudre = async (id: string) => {
    await pb.collection("litiges").update(id, { status: "resolved" }, { requestKey: null })
    setLitiges(prev => prev.filter(l => l.id !== id))
  }

  const rejeter = async (id: string) => {
    await pb.collection("litiges").update(id, { status: "dismissed" }, { requestKey: null })
    setLitiges(prev => prev.filter(l => l.id !== id))
  }

  return (
    <div style={{
      minHeight: "100svh",
      background: C.fond,
      fontFamily: "Inter, sans-serif",
      paddingBottom: "80px",
    }}>

      {/* Header */}
      <div style={{
        background: C.noir,
        padding: "20px 24px 24px",
        display: "flex",
        alignItems: "center",
        gap: "14px",
      }}>
        <button
          onClick={() => navigate("/admin")}
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "#fff", borderRadius: "10px",
            width: "38px", height: "38px",
            fontSize: "18px", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}
        >
          ←
        </button>
        <div>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem" }}>Administration</p>
          <p style={{ color: "#fff", fontWeight: 800, fontSize: "1.05rem" }}>
            Litiges ouverts ({litiges.length})
          </p>
        </div>
      </div>

      <div style={{ padding: "24px" }}>

        {isLoading && (
          <div style={{ textAlign: "center", color: "#aaa", padding: "48px 0" }}>
            Chargement...
          </div>
        )}

        {!isLoading && litiges.length === 0 && (
          <div style={{
            textAlign: "center", padding: "48px 24px",
            background: "#fff", borderRadius: "20px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}>
            <div style={{ fontSize: "3rem", marginBottom: "16px" }}>✅</div>
            <p style={{ fontWeight: 700, color: C.noir, marginBottom: "8px" }}>
              Aucun litige ouvert
            </p>
            <p style={{ color: "#aaa", fontSize: "0.88rem" }}>
              Tous les litiges ont été traités.
            </p>
          </div>
        )}

        {litiges.map(litige => (
          <div key={litige.id} style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "20px",
            marginBottom: "14px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            borderLeft: `4px solid ${C.orange}`,
          }}>

            {/* Badge raison */}
            <div style={{
              display: "inline-flex",
              background: `${C.orange}12`,
              color: C.orange,
              borderRadius: "100px", padding: "4px 12px",
              fontSize: "0.75rem", fontWeight: 700,
              marginBottom: "14px",
            }}>
              ⚠️ {REASON_LABEL[litige.reason] || litige.reason}
            </div>

            {/* Description */}
            {litige.description && (
              <div style={{
                background: C.fond,
                borderRadius: "10px",
                padding: "12px 14px",
                marginBottom: "16px",
              }}>
                <p style={{ fontSize: "0.78rem", color: "#aaa", marginBottom: "4px" }}>
                  Description
                </p>
                <p style={{ fontSize: "0.9rem", color: C.noir, lineHeight: 1.5 }}>
                  {litige.description}
                </p>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: "flex", gap: "10px" }}>
              <Button
                onClick={() => resoudre(litige.id)}
                style={{
                  flex: 1,
                  background: C.vert,
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "14px",
                  height: "42px",
                  borderRadius: "10px",
                }}
              >
                ✓ Résoudre
              </Button>
              <Button
                onClick={() => rejeter(litige.id)}
                style={{
                  flex: 1,
                  background: "rgba(239,35,60,0.08)",
                  color: "#ef233c",
                  border: "1px solid rgba(239,35,60,0.2)",
                  fontWeight: 700,
                  fontSize: "14px",
                  height: "42px",
                  borderRadius: "10px",
                }}
              >
                ✕ Rejeter
              </Button>
            </div>
          </div>
        ))}
      </div>

      <BottomNav items={NAV_ITEMS} />
    </div>
  )
}