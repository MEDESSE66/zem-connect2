import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { pb } from "../../lib/pocketbase"
import { Button } from "@/components/ui/button"
import BottomNav from "../../components/BottomNav"
import type { User } from "../../types"

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

const ROLE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  client:     { label: "Client",     color: "#3b82f6",  bg: "rgba(59,130,246,0.1)"  },
  conducteur: { label: "Conducteur", color: C.orange,   bg: `${C.orange}15`          },
  admin:      { label: "Admin",      color: C.jaune,    bg: `${C.jaune}20`           },
}

export default function AdminUsers() {
  const navigate                  = useNavigate()
  const [users, setUsers]         = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter]       = useState<"all" | "client" | "conducteur">("all")
  const [suspendingId, setSuspendingId] = useState<string | null>(null)

  useEffect(() => {
    pb.collection("users").getList(1, 100, {
      sort: "-created",
      requestKey: null,
    }).then(r => {
      setUsers(r.items as unknown as User[])
    }).finally(() => setIsLoading(false))
  }, [])

  const toggleSuspend = async (user: User) => {
    setSuspendingId(user.id)
    try {
      await pb.collection("users").update(user.id, {
        isSuspended: !user.isSuspended,
      }, { requestKey: null })
      setUsers(prev => prev.map(u =>
        u.id === user.id ? { ...u, isSuspended: !u.isSuspended } : u
      ))
    } finally {
      setSuspendingId(null)
    }
  }

  const filtered = users.filter(u => filter === "all" || u.role === filter)

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
            Utilisateurs ({users.length})
          </p>
        </div>
      </div>

      <div style={{ padding: "24px" }}>

        {/* Filtres */}
        <div style={{
          display: "flex", gap: "8px",
          marginBottom: "20px", flexWrap: "wrap",
        }}>
          {[
            { key: "all",        label: "Tous" },
            { key: "client",     label: "Clients" },
            { key: "conducteur", label: "Conducteurs" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key as typeof filter)}
              style={{
                background: filter === key ? C.jaune : "#fff",
                color: filter === key ? C.noir : "#666",
                border: filter === key ? "none" : "1px solid #e5e7eb",
                borderRadius: "100px",
                padding: "8px 18px",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                boxShadow: filter === key ? `0 2px 8px ${C.jaune}40` : "none",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {isLoading && (
          <div style={{ textAlign: "center", color: "#aaa", padding: "48px 0" }}>
            Chargement...
          </div>
        )}

        {filtered.map(user => {
          const rc = ROLE_CONFIG[user.role] || { label: user.role, color: "#666", bg: "#f0f0f0" }
          return (
            <div key={user.id} style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "20px",
              marginBottom: "14px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              opacity: user.isSuspended ? 0.7 : 1,
            }}>
              {/* Top row */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "12px",
              }}>
                <div>
                  <p style={{ fontWeight: 700, fontSize: "0.95rem", color: C.noir }}>
                    {user.email}
                  </p>
                  {user.phone && (
                    <p style={{ color: "#aaa", fontSize: "0.82rem", marginTop: "2px" }}>
                      📞 {user.phone}
                    </p>
                  )}
                </div>
                <div style={{
                  background: rc.bg, color: rc.color,
                  borderRadius: "100px", padding: "4px 12px",
                  fontSize: "0.75rem", fontWeight: 700,
                  flexShrink: 0,
                }}>
                  {rc.label}
                </div>
              </div>

              {/* Infos */}
              <div style={{
                display: "flex", gap: "12px",
                background: C.fond, borderRadius: "10px",
                padding: "10px 14px", marginBottom: "14px",
              }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "0.72rem", color: "#aaa" }}>Wallet</p>
                  <p style={{ fontWeight: 800, color: C.noir, fontSize: "0.9rem" }}>
                    {user.walletBalance} FCFA
                  </p>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "0.72rem", color: "#aaa" }}>Statut</p>
                  <p style={{
                    fontWeight: 700, fontSize: "0.9rem",
                    color: user.isSuspended ? "#ef233c" : C.vert,
                  }}>
                    {user.isSuspended ? "Suspendu" : "Actif"}
                  </p>
                </div>
              </div>

              {/* Action */}
              <Button
                onClick={() => toggleSuspend(user)}
                disabled={suspendingId === user.id}
                style={{
                  width: "100%",
                  background: user.isSuspended ? C.vert : "rgba(239,35,60,0.08)",
                  color: user.isSuspended ? "#fff" : "#ef233c",
                  border: user.isSuspended ? "none" : "1px solid rgba(239,35,60,0.2)",
                  fontWeight: 700,
                  fontSize: "14px",
                  height: "40px",
                  borderRadius: "10px",
                  opacity: suspendingId === user.id ? 0.6 : 1,
                  cursor: suspendingId === user.id ? "not-allowed" : "pointer",
                }}
              >
                {suspendingId === user.id ? "..." : (user.isSuspended ? "✓ Réactiver le compte" : "Suspendre le compte")}
              </Button>
            </div>
          )
        })}
      </div>

      <BottomNav items={NAV_ITEMS} />
    </div>
  )
}