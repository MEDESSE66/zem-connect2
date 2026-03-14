import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../../store/authStore"
import { Button } from "@/components/ui/button"
import BottomNav from "../../components/BottomNav"
import { motion } from "motion/react"
import { Home, Bike, Map, ClipboardList, Zap, ShieldCheck, User, LogOut } from "lucide-react"

const NAV_ITEMS = [
  { icon: <Home className="size-[22px]" />,  label: "Accueil",  path: "/client" },
  { icon: <Bike className="size-[22px]" />,  label: "Courses",  path: "/client/mes-courses" },
]

export default function ClientAccueil() {
  const navigate       = useNavigate()
  const { user, logout } = useAuthStore()

  return (
    <div className="min-h-svh bg-brand-bg pb-20 font-sans">

      {/* Header */}
      <div className="relative overflow-hidden bg-brand-black px-6 pt-5 pb-7">
        {/* Déco */}
        <div className="pointer-events-none absolute -top-10 -right-10 size-[180px] rounded-full bg-[radial-gradient(circle,_var(--brand-yellow)20_0%,_transparent_70%)]" />

        {/* Top row */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <p className="mb-0.5 text-[0.82rem] text-white/50">
                Bonjour 👋
              </p>
              <p className="text-[1.1rem] font-extrabold text-white">
                {user?.name || "Utilisateur"}
              </p>
            </div>
            <button
              onClick={() => navigate("/client/profil")}
              className="flex size-9 items-center justify-center rounded-full border border-white/12 bg-white/8 text-white/80 transition-all hover:scale-105 hover:bg-white/15"
            >
              <User className="size-4" />
            </button>
          </div>
          <button
            onClick={() => { logout(); navigate("/login") }}
            className="flex items-center gap-1.5 rounded-[10px] border border-white/12 bg-white/8 px-3.5 py-2 text-[13px] font-semibold text-white/60 transition-colors hover:bg-white/12"
          >
            <LogOut className="size-3.5" /> Déconnexion
          </button>
        </div>

        {/* CTA principal */}
        <Button
          onClick={() => navigate("/client/nouvelle-course")}
          className="h-[52px] w-full rounded-[14px] bg-brand-yellow text-base font-extrabold text-brand-black shadow-[0_4px_20px_var(--brand-yellow)40] hover:bg-brand-yellow/90"
        >
          <Bike className="mr-2 size-5" /> Commander une course
        </Button>
      </div>

      {/* Contenu */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="px-6 pt-6"
      >
        {/* Stats rapides */}
        <div className="mb-7 grid grid-cols-2 gap-3.5">
          {[
            { icon: <Zap className="size-7 text-brand-yellow" />,        label: "Délai moyen",   value: "2 min",    colorClass: "text-brand-yellow" },
            { icon: <ShieldCheck className="size-7 text-brand-green" />, label: "Conducteurs",    value: "Vérifiés", colorClass: "text-brand-green"  },
          ].map(({ icon, label, value, colorClass }) => (
            <div key={label} className="rounded-2xl bg-white p-[18px] shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
              <div className="mb-2">{icon}</div>
              <div className={`text-[1.1rem] font-extrabold ${colorClass}`}>{value}</div>
              <div className="mt-0.5 text-[0.8rem] text-gray-400">{label}</div>
            </div>
          ))}
        </div>

        {/* Raccourcis */}
        <h3 className="mb-3.5 text-base font-extrabold text-brand-black">
          Actions rapides
        </h3>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/client/nouvelle-course")}
            className="flex items-center gap-3.5 rounded-[14px] border-2 border-brand-yellow bg-white p-4 text-left transition-shadow hover:shadow-[0_4px_16px_var(--brand-yellow)30]"
          >
            <Map className="size-8 shrink-0 text-brand-yellow" />
            <div>
              <div className="text-[0.95rem] font-bold text-brand-black">Nouvelle course</div>
              <div className="mt-0.5 text-[0.82rem] text-gray-400">Demandez un zémidjan maintenant</div>
            </div>
          </button>

          <button
            onClick={() => navigate("/client/mes-courses")}
            className="flex items-center gap-3.5 rounded-[14px] border-2 border-black/7 bg-white p-4 text-left transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
          >
            <ClipboardList className="size-8 shrink-0 text-brand-black/60" />
            <div>
              <div className="text-[0.95rem] font-bold text-brand-black">Mes courses</div>
              <div className="mt-0.5 text-[0.82rem] text-gray-400">Voir l'historique et les offres reçues</div>
            </div>
          </button>
        </div>
      </motion.div>

      <BottomNav items={NAV_ITEMS} />
    </div>
  )
}