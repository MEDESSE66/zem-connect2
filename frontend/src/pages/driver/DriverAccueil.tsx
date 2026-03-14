import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { pb } from "../../lib/pocketbase"
import { useAuthStore } from "../../store/authStore"
import { Button } from "@/components/ui/button"
import BottomNav from "../../components/BottomNav"
import { motion } from "motion/react"
import { Home, Bike, ClipboardList, User, MapPin, Flag, LogOut, Hourglass, Clock } from "lucide-react"
import type { Trip } from "../../types"

const NAV_ITEMS = [
  { icon: <Home className="size-[22px]" />,           label: "Accueil",    path: "/driver" },
  { icon: <Bike className="size-[22px]" />,           label: "Ma course",  path: "/driver/ma-course" },
  { icon: <ClipboardList className="size-[22px]" />,  label: "Historique", path: "/driver/historique" },
]

export default function DriverAccueil() {
  const { user, logout }          = useAuthStore()
  const navigate                  = useNavigate()
  const [trips, setTrips]         = useState<Trip[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sentOffers, setSentOffers] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!user?.id) return

    const loadTrips = async () => {
      try {
        const records = await pb.collection("trips").getList(1, 50, {
          filter: `status = "pending"`,
          sort: "-created",
          requestKey: null,
        })
        setTrips(records.items as unknown as Trip[])
      } catch (err) {
        console.error("Erreur chargement courses", err)
      } finally {
        setIsLoading(false)
      }
    }

    loadTrips()

    pb.collection("trips").subscribe("*", e => {
      if (e.action === "create" && e.record.status === "pending") {
        setTrips(prev => [e.record as unknown as Trip, ...prev])
      } else if (e.action === "update") {
        setTrips(prev => prev.filter(t => t.id !== e.record.id || e.record.status === "pending"))
      }
    })

    return () => { pb.collection("trips").unsubscribe("*") }
  }, [user?.id])

  const handleOffre = async (trip: Trip) => {
    if (!user?.conducteur_verifie) {
      alert("Votre compte n'est pas encore validé par l'admin.")
      return
    }
    try {
      await pb.collection("offres").create({
        trip: trip.id,
        conducteur: user?.id,
        proposedPrice: trip.clientPrice,
        status: "pending",
        isCounterOffer: false,
      }, { requestKey: null })
      setSentOffers(prev => new Set(prev).add(trip.id))
    } catch {
      alert("Erreur lors de l'envoi de l'offre.")
    }
  }

  return (
    <div className="min-h-svh bg-brand-bg pb-20 font-sans">

      {/* Header */}
      <div className="relative overflow-hidden bg-brand-black px-6 pt-5 pb-7">
        <div className="pointer-events-none absolute -top-10 -right-10 size-[180px] rounded-full bg-[radial-gradient(circle,_var(--brand-orange)20_0%,_transparent_70%)]" />

        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <p className="mb-0.5 text-[0.82rem] text-white/50">
                Conducteur <Bike className="mb-0.5 inline size-3.5" />
              </p>
              <p className="text-[1.1rem] font-extrabold text-white">
                {user?.name || "Utilisateur"}
              </p>
            </div>
            <button
              onClick={() => navigate("/driver/profil")}
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

        {/* Wallet */}
        <div className="flex items-center justify-between rounded-[14px] border border-white/10 bg-white/7 px-[18px] py-3.5">
          <div>
            <p className="text-[0.78rem] text-white/50">Solde wallet</p>
            <p className="text-[1.4rem] font-black text-brand-yellow">
              {user?.walletBalance ?? 0} FCFA
            </p>
          </div>
          <div className="rounded-[10px] border border-brand-yellow/25 bg-brand-yellow/12 px-3.5 py-2 text-[0.78rem] font-bold text-brand-yellow">
            Commission : 25 FCFA
          </div>
        </div>
      </div>

      {!user?.conducteur_verifie && (
        <div className="mx-4 mt-4 flex items-start gap-3 rounded-2xl border border-brand-orange/25 bg-brand-orange/8 px-5 py-4">
          <Clock className="mt-0.5 size-6 shrink-0 text-brand-orange" />
          <div>
            <p className="mb-1 text-[0.95rem] font-extrabold text-brand-orange">
              Compte en attente de validation
            </p>
            <p className="text-[0.83rem] leading-relaxed text-gray-500">
              Votre dossier est en cours de vérification. Vous recevrez 200 FCFA de bienvenue dès l'activation.
            </p>
          </div>
        </div>
      )}

      {/* Contenu */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="px-6 pt-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-extrabold text-brand-black">Courses disponibles</h3>
          {!isLoading && (
            <span className="rounded-full bg-brand-orange/10 px-3 py-1 text-[0.78rem] font-bold text-brand-orange">
              {trips.length} disponible{trips.length > 1 ? "s" : ""}
            </span>
          )}
        </div>

        {isLoading && (
          <div className="py-12 text-center text-gray-400">Chargement...</div>
        )}

        {!isLoading && trips.length === 0 && (
          <div className="rounded-[20px] bg-white px-6 py-12 text-center shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
            <Hourglass className="mx-auto mb-4 size-12 text-brand-yellow" />
            <p className="mb-2 font-bold text-brand-black">Aucune course disponible</p>
            <p className="text-[0.88rem] text-gray-400">
              Les nouvelles demandes apparaîtront ici en temps réel.
            </p>
          </div>
        )}

        {trips.map(trip => {
          const alreadySent = sentOffers.has(trip.id)
          return (
            <div key={trip.id} className={`mb-3.5 rounded-[20px] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] ${alreadySent ? "border border-brand-green/25" : "border border-transparent"}`}>
              {/* Trajet */}
              <div className="mb-3.5 flex flex-col gap-2">
                <div className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-brand-yellow" />
                  <div>
                    <p className="text-[0.75rem] text-gray-400">Départ</p>
                    <p className="text-[0.92rem] font-semibold text-brand-black">{trip.departureAddress}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Flag className="mt-0.5 size-4 shrink-0 text-brand-green" />
                  <div>
                    <p className="text-[0.75rem] text-gray-400">Destination</p>
                    <p className="text-[0.92rem] font-semibold text-brand-black">{trip.destinationAddress}</p>
                  </div>
                </div>
              </div>

              {/* Prix + bouton */}
              <div className="flex items-center justify-between rounded-xl bg-brand-bg px-4 py-3">
                <div>
                  <p className="text-[0.75rem] text-gray-400">Prix client</p>
                  <p className="text-[1.1rem] font-black text-brand-black">{trip.clientPrice} FCFA</p>
                </div>
                <Button
                  onClick={() => !alreadySent && handleOffre(trip)}
                  disabled={alreadySent}
                  className={`h-auto rounded-full px-[18px] py-2 text-[13px] font-extrabold ${
                    alreadySent
                      ? "bg-brand-green text-white"
                      : "bg-brand-yellow text-brand-black hover:bg-brand-yellow/90"
                  }`}
                >
                  {alreadySent ? "✓ Offre envoyée" : "Accepter ce prix"}
                </Button>
              </div>
            </div>
          )
        })}
      </motion.div>

      <BottomNav items={NAV_ITEMS} />
    </div>
  )
}