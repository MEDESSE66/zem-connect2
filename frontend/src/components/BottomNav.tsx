import { useNavigate, useLocation } from "react-router-dom"
import { motion } from "motion/react"
import type { ReactNode } from "react"

interface NavItem {
  icon: ReactNode
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
    <motion.nav
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="fixed bottom-0 left-0 right-0 z-50 flex h-[68px] items-center justify-around border-t border-white/8 bg-brand-black/97 backdrop-blur-xl font-sans"
    >
      {items.map(({ icon, label, path }) => {
        const active = location.pathname === path
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="relative flex min-h-[44px] min-w-[44px] cursor-pointer flex-col items-center gap-1 rounded-xl border-none bg-transparent px-5 py-2 transition-colors hover:bg-white/6"
          >
            {active && (
              <div className="absolute top-1.5 h-[3px] w-8 rounded-full bg-brand-yellow" />
            )}
            <span className={`mt-1.5 transition-colors [&_svg]:size-[22px] ${active ? "text-brand-yellow" : "text-white/45"}`}>
              {icon}
            </span>
            <span
              className={`text-[11px] transition-colors ${
                active ? "font-bold text-brand-yellow" : "font-medium text-white/45"
              }`}
            >
              {label}
            </span>
          </button>
        )
      })}
    </motion.nav>
  )
}