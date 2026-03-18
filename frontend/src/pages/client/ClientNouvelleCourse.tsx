import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { pb } from "../../lib/pocketbase"
import { useAuthStore } from "../../store/authStore"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import BottomNav from "../../components/BottomNav"
import { motion } from "motion/react"
import { Home, Bike, ArrowLeft, MapPin, Flag, Coins, ArrowDown, Clock } from "lucide-react"

const NAV_ITEMS = [
  { icon: <Home className="size-[22px]" />, label: "Accueil", path: "/client" },
  { icon: <Bike className="size-[22px]" />, label: "Courses", path: "/client/mes-courses" },
]

export default function ClientNouvelleCourse() {
  const { user }                                    = useAuthStore()
  const navigate                                    = useNavigate()
  const [departureAddress, setDepartureAddress]     = useState("")
  const [destinationAddress, setDestinationAddress] = useState("")
  const [clientPrice, setClientPrice]               = useState("")
  const [error, setError]                           = useState("")
  const [isLoading, setIsLoading]                   = useState(false)

  const [departureLat, setDepartureLat]             = useState(0)
  const [departureLng, setDepartureLng]             = useState(0)
  const [isLocating, setIsLocating]                 = useState(false)
  const [locationError, setLocationError]           = useState<string | null>(null)

  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Géolocalisation non supportée sur cet appareil")
      return
    }
    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setDepartureLat(position.coords.latitude)
        setDepartureLng(position.coords.longitude)
        setIsLocating(false)
        toast.success("Position détectée")
      },
      (_error) => {
        setIsLocating(false)
        setLocationError("Position non détectée — saisie manuelle requise")
        toast.warning("Position non détectée — saisie manuelle requise")
      },
      { timeout: 10000, enableHighAccuracy: true }
    )
  }

  useEffect(() => {
    getLocation()
  }, [])

  const handleSubmit = async () => {
    setError("")
    if (!departureAddress || !destinationAddress || !clientPrice) {
      setError("Tous les champs sont obligatoires.")
      return
    }
    if (isNaN(parseFloat(clientPrice)) || parseFloat(clientPrice) <= 0) {
      setError("Le prix doit être un nombre positif.")
      return
    }
    setIsLoading(true)
    try {
      const expiresAt = new Date(Date.now() + 2 * 60 * 1000).toISOString()
      await pb.collection("trips").create({
        client: user?.id,
        status: "pending",
        departureAddress,
        destinationAddress,
        departureLat: departureLat,
        departureLng: departureLng,
        destinationLat: 0,
        destinationLng: 0,
        clientPrice: parseFloat(clientPrice),
        expiresAt,
      }, { requestKey: null })
      navigate("/client/mes-courses")
    } catch {
      setError("Erreur lors de la création de la course. Réessayez.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-svh bg-brand-bg pb-20 font-sans">

      {/* Header */}
      <div className="flex items-center gap-3.5 bg-brand-black px-6 pt-5 pb-6">
        <button
          onClick={() => navigate("/client")}
          className="flex size-[38px] shrink-0 items-center justify-center rounded-[10px] border border-white/12 bg-white/8 text-white"
        >
          <ArrowLeft className="size-[18px]" />
        </button>
        <div>
          <p className="text-[0.8rem] text-white/50">Client</p>
          <p className="text-[1.05rem] font-extrabold text-white">Nouvelle course</p>
        </div>
      </div>

      {/* Formulaire */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="px-6 pt-6"
      >
        {/* Erreur */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-500/25 bg-red-500/8 px-4 py-3 text-[0.88rem] text-red-500">
            {error}
          </div>
        )}

        {/* Carte formulaire */}
        <div className="flex flex-col gap-5 rounded-[20px] bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.07)]">

          {/* Départ */}
          <div>
            <Label className="mb-2 flex items-center gap-1.5 text-[0.88rem] font-bold text-gray-600">
              <MapPin className="size-4 text-brand-yellow" /> Point de départ
            </Label>
            <Input
              type="text"
              placeholder="Ex: Carrefour Cadjehoun"
              value={departureAddress}
              onChange={e => setDepartureAddress(e.target.value)}
              className="h-12 rounded-[10px] border-[1.5px] border-gray-200 text-[0.95rem]"
            />
            {isLocating && (
              <p className="mt-1 text-[0.78rem] text-gray-400">Détection de votre position...</p>
            )}
            {!isLocating && departureLat !== 0 && (
              <p className="mt-1 text-[0.78rem] text-brand-green">
                ✓ Position GPS détectée
              </p>
            )}
            {locationError && (
              <p className="mt-1 text-[0.78rem] text-brand-orange">{locationError}</p>
            )}
            {locationError && (
              <button
                onClick={getLocation}
                className="mt-1 text-[0.78rem] font-bold text-brand-yellow underline"
              >
                Relancer la détection
              </button>
            )}
          </div>

          {/* Séparateur */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-100" />
            <div className="flex size-8 items-center justify-center rounded-full border-2 border-brand-yellow bg-brand-yellow/12">
              <ArrowDown className="size-3.5 text-brand-yellow" />
            </div>
            <div className="h-px flex-1 bg-gray-100" />
          </div>

          {/* Destination */}
          <div>
            <Label className="mb-2 flex items-center gap-1.5 text-[0.88rem] font-bold text-gray-600">
              <Flag className="size-4 text-brand-green" /> Destination
            </Label>
            <Input
              type="text"
              placeholder="Ex: Marché Dantokpa"
              value={destinationAddress}
              onChange={e => setDestinationAddress(e.target.value)}
              className="h-12 rounded-[10px] border-[1.5px] border-gray-200 text-[0.95rem]"
            />
          </div>

          {/* Prix */}
          <div>
            <Label className="mb-2 flex items-center gap-1.5 text-[0.88rem] font-bold text-gray-600">
              <Coins className="size-4 text-brand-orange" /> Votre prix (FCFA)
            </Label>
            <div className="relative">
              <Input
                type="number"
                placeholder="Ex: 500"
                value={clientPrice}
                onChange={e => setClientPrice(e.target.value)}
                className="h-12 rounded-[10px] border-[1.5px] border-gray-200 pr-[70px] text-[0.95rem]"
              />
              <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                <span className="text-[0.85rem] font-bold text-gray-500">FCFA</span>
              </div>
            </div>

            {/* Boutons d'ajustement rapide */}
            <div className="mt-3 flex flex-wrap gap-2">
              {[-100, -50, 50, 100, 200].map(delta => {
                const currentPrice = parseInt(clientPrice) || 0;
                const isDisabled = currentPrice + delta < 50;
                
                return (
                  <button
                    key={delta}
                    type="button"
                    onClick={() => setClientPrice(Math.max(50, currentPrice + delta).toString())}
                    disabled={isDisabled}
                    className="flex-1 rounded-[8px] bg-brand-yellow/10 py-1.5 text-[0.85rem] font-extrabold text-brand-black transition-colors hover:bg-brand-yellow/20 disabled:opacity-40 disabled:hover:bg-brand-yellow/10"
                  >
                    {delta > 0 ? `+${delta}` : delta}
                  </button>
                )
              })}
            </div>
            <p className="mt-1.5 text-[0.78rem] text-gray-400">
              Les conducteurs feront leurs offres autour de ce prix.
            </p>
          </div>
        </div>

        {/* Bouton submit */}
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="mt-5 h-[52px] w-full rounded-[14px] bg-brand-yellow text-base font-extrabold text-brand-black shadow-[0_4px_20px_var(--brand-yellow)40] hover:bg-brand-yellow/90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? "Envoi en cours..." : <><Bike className="mr-2 size-5" /> Demander une course</>}
        </Button>

        {/* Info expiry */}
        <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[0.8rem] text-gray-400">
          <Clock className="size-3.5" /> Votre demande expire après 2 minutes sans réponse.
        </p>
      </motion.div>

      <BottomNav items={NAV_ITEMS} />
    </div>
  )
}