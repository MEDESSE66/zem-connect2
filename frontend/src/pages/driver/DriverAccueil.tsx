import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { pb } from "../../lib/pocketbase"
import { useAuthStore } from "../../store/authStore"
import { Button } from "@/components/ui/button"
import BottomNav from "../../components/BottomNav"
import { motion } from "motion/react"
import { Home, Bike, ClipboardList, User, MapPin, Flag, LogOut, Hourglass, Clock, AlertTriangle } from "lucide-react"
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
  const [proposedPrices, setProposedPrices] = useState<Record<string, number>>({})

  // Fonction pour mettre à jour le prix proposé localement
  const updateProposedPrice = (tripId: string, basePrice: number, delta: number) => {
    setProposedPrices(prev => {
      const current = prev[tripId] !== undefined ? prev[tripId] : basePrice
      const newPrice = Math.max(50, current + delta) // Minimum 50 FCFA
      return { ...prev, [tripId]: newPrice }
    })
  }

  const setExactPrice = (tripId: string, price: number) => {
    setProposedPrices(prev => ({ ...prev, [tripId]: Math.max(50, price) }))
  }

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
    
    // Utiliser le prix modifié ou le prix initial du client
    const proposedPrice = proposedPrices[trip.id] !== undefined ? proposedPrices[trip.id] : trip.clientPrice
    const isCounterOffer = proposedPrice !== trip.clientPrice

    try {
      await pb.collection("offres").create({
        trip: trip.id,
        conducteur: user?.id,
        proposedPrice: proposedPrice,
        status: "pending",
        isCounterOffer: isCounterOffer,
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
              <p className="text-[1.1rem] font-extrabold text-white flex items-center gap-2">
                <span>{user?.name || "Utilisateur"}</span>
                {(user?.totalRating ?? 0) > 0 && (
                  <span className="text-[0.82rem] font-bold text-brand-yellow">★ {user?.rating}</span>
                )}
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

      {/* Notifications Wallet */}
      {user?.conducteur_verifie && user?.walletBalance !== undefined && user.walletBalance <= 75 && (
        <div className={`mx-4 mt-4 flex items-start gap-3 rounded-2xl border px-5 py-4 ${
          user.walletBalance === 0 
            ? "border-red-500/25 bg-red-500/8" 
            : user.walletBalance <= 25 
              ? "border-brand-orange/25 bg-brand-orange/8" 
              : "border-brand-yellow/25 bg-brand-yellow/8"
        }`}>
          <AlertTriangle className={`mt-0.5 size-6 shrink-0 ${
            user.walletBalance === 0 ? "text-red-500" : user.walletBalance <= 25 ? "text-brand-orange" : "text-brand-yellow"
          }`} />
          <div>
            <p className={`mb-1 text-[0.95rem] font-extrabold ${
              user.walletBalance === 0 ? "text-red-500" : user.walletBalance <= 25 ? "text-brand-orange" : "text-brand-yellow"
            }`}>
              {user.walletBalance === 0 
                ? "Compte bloqué (Solde insuffisant)" 
                : user.walletBalance <= 25 
                  ? "Solde minimum atteint" 
                  : "Solde faible"}
            </p>
            <p className="text-[0.83rem] leading-relaxed text-gray-500">
              {user.walletBalance === 0 
                ? "Rechargez votre wallet pour pouvoir accepter de nouvelles courses." 
                : user.walletBalance <= 25 
                  ? "Il vous reste 1 course. Rechargez pour continuer." 
                  : `Il vous reste ~${Math.floor(user.walletBalance / 25)} courses. Pensez à recharger.`}
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

              {/* Contre-offre (seulement si compte vérifié et offre non envoyée) */}
              {user?.conducteur_verifie && !alreadySent && (
                <div className="mb-3.5 rounded-xl border border-brand-yellow/20 bg-brand-yellow/5 p-3">
                  <p className="mb-2.5 text-[0.78rem] font-bold text-brand-black">Ajuster votre offre :</p>
                  
                  {/* Boutons rapides */}
                  <div className="mb-3 flex flex-wrap gap-2">
                    {[-100, -50, 50, 100, 200].map(delta => {
                      const currentPrice = proposedPrices[trip.id] !== undefined ? proposedPrices[trip.id] : trip.clientPrice
                      const isDisabled = currentPrice + delta < 50
                      
                      return (
                        <button
                          key={delta}
                          onClick={() => updateProposedPrice(trip.id, trip.clientPrice, delta)}
                          disabled={isDisabled}
                          className="flex-1 rounded-lg border border-brand-yellow/30 bg-white py-1.5 text-[0.85rem] font-extrabold text-brand-black shadow-sm transition-colors hover:bg-brand-yellow/10 disabled:opacity-40 disabled:hover:bg-white"
                        >
                          {delta > 0 ? `+${delta}` : delta}
                        </button>
                      )
                    })}
                  </div>

                  {/* Input personnalisé */}
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="50"
                      step="50"
                      placeholder="Montant libre..."
                      value={proposedPrices[trip.id] !== undefined ? proposedPrices[trip.id] : trip.clientPrice}
                      onChange={(e) => setExactPrice(trip.id, parseInt(e.target.value) || 50)}
                      className="w-full rounded-lg border border-brand-yellow/30 bg-white px-3 py-2 text-sm font-bold text-brand-black placeholder-gray-400 outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow"
                    />
                    <span className="text-[0.78rem] font-extrabold text-brand-black">FCFA</span>
                  </div>
                </div>
              )}

              {/* Résumé + bouton valider */}
              <div className="flex items-center justify-between rounded-xl bg-brand-bg px-4 py-3">
                <div>
                  <p className="text-[0.75rem] text-gray-400">
                    {alreadySent ? "Offre envoyée" : "Votre proposition"}
                  </p>
                  <p className="text-[1.1rem] font-black text-brand-black">
                    {proposedPrices[trip.id] !== undefined ? proposedPrices[trip.id] : trip.clientPrice} FCFA
                  </p>
                </div>
                <Button
                  onClick={() => !alreadySent && handleOffre(trip)}
                  disabled={alreadySent || !user?.conducteur_verifie || (user?.walletBalance !== undefined && user.walletBalance < 25)}
                  className={`h-auto rounded-full px-[18px] py-2 text-[13px] font-extrabold ${
                    alreadySent
                      ? "bg-brand-green text-white"
                      : !user?.conducteur_verifie
                        ? "cursor-not-allowed bg-gray-200 text-gray-400"
                        : "bg-brand-yellow text-brand-black hover:bg-brand-yellow/90 shadow-[0_4px_14px_rgba(245,197,24,0.3)]"
                  }`}
                >
                  {alreadySent ? "✓ Offre envoyée" : !user?.conducteur_verifie ? "Compte non vérifié" : (user?.walletBalance !== undefined && user.walletBalance < 25) ? "Solde insuffisant" : "Soumettre offre"}
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