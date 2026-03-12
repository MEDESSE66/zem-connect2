import { useNavigate, useLocation } from "react-router-dom"

const C = {
  jaune:  "#F5C518",
  noir:   "#1A1A2E",
  orange: "#E85D04",
}

interface NavItem {
  icon: string
  label: string
  path: string
}

interface BottomNavProps {
  items: NavItem[]
}

export default function BottomNav({ items }: BottomNavProps) {
  const navigate  = useNavigate()
  const location  = useLocation()

  return (
    <nav style={{
      position: "fixed",
      bottom: 0, left: 0, right: 0,
      height: "68px",
      background: "rgba(26,26,46,0.97)",
      backdropFilter: "blur(16px)",
      borderTop: "1px solid rgba(255,255,255,0.08)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-around",
      zIndex: 100,
      fontFamily: "Inter, sans-serif",
    }}>
      {items.map(({ icon, label, path }) => {
        const active = location.pathname === path
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
              padding: "8px 20px",
              borderRadius: "12px",
              transition: "background 0.15s",
              position: "relative",
            }}
            onMouseEnter={e  => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
            onMouseLeave={e  => (e.currentTarget.style.background = "transparent")}
          >
            {/* Indicateur actif */}
            {active && (
              <div style={{
                position: "absolute",
                top: "6px",
                width: "32px",
                height: "3px",
                borderRadius: "100px",
                background: C.jaune,
              }} />
            )}
            <span style={{ fontSize: "22px", lineHeight: 1, marginTop: "6px" }}>{icon}</span>
            <span style={{
              fontSize: "11px",
              fontWeight: active ? 700 : 500,
              color: active ? C.jaune : "rgba(255,255,255,0.45)",
              transition: "color 0.15s",
            }}>
              {label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}