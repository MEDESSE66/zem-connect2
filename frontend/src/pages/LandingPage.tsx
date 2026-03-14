import React from "react"
import { useNavigate } from "react-router-dom"
import { motion, useInView } from "motion/react"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { MapPin, MessageCircle, CheckCircle, Zap, Shield, Smartphone, Globe, Bike, ChevronDown } from "lucide-react"

/* ─── animation helpers ─────────────────────────────── */
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }
const stagger = { visible: { transition: { staggerChildren: 0.12 } } }

function RevealSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-12% 0px" })
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={stagger}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─── Navbar ────────────────────────────────────────── */
function Navbar() {
  const navigate = useNavigate()
  // We keep the scroll listener as-is (logic preserved)
  const [scrolled, setScrolled] = React.useState(false)
  React.useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", handler)
    return () => window.removeEventListener("scroll", handler)
  }, [])
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between px-6 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/8 bg-brand-black/95 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="flex cursor-pointer items-center gap-2.5"
      >
        <div className="flex size-9 items-center justify-center rounded-[10px] bg-brand-yellow text-lg">
          <Bike className="size-5 text-brand-black" />
        </div>
        <span className="text-lg font-black text-white">
          Zem<span className="text-brand-yellow">Connect</span>
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate("/login")}
          className="cursor-pointer rounded-lg border-none bg-transparent px-4 py-2 text-[15px] font-semibold text-white/80 transition-colors hover:text-white"
        >
          Connexion
        </button>
        <Button
          onClick={() => navigate("/inscription")}
          className="h-auto rounded-full bg-brand-yellow px-5 py-2 text-sm font-extrabold text-brand-black hover:bg-brand-yellow/90"
        >
          S'inscrire
        </Button>
      </div>
    </nav>
  )
}

/* ─── Hero ──────────────────────────────────────────── */
function Hero() {
  const navigate = useNavigate()
  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-brand-black via-brand-dark to-brand-navy px-6 pt-[100px] pb-20">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-[100px] -right-20 size-[400px] rounded-full bg-[radial-gradient(circle,_var(--brand-yellow)20_0%,_transparent_70%)]" />
      <div className="pointer-events-none absolute -bottom-[60px] -left-[60px] size-[300px] rounded-full bg-[radial-gradient(circle,_var(--brand-orange)18_0%,_transparent_70%)]" />

      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-7 rounded-full border border-brand-yellow/25 bg-brand-yellow/10 px-5 py-1.5 text-[13px] font-bold tracking-wide text-brand-yellow"
      >
        🇧🇯 Cotonou · Calavi · Porto-Novo · Parakou
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.4, delay: 0.2 }}
        className="mb-6 text-[80px] leading-none drop-shadow-[0_8px_28px_var(--brand-yellow)44]"
      >
        <Bike className="mx-auto size-20 text-brand-yellow" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="max-w-[700px] text-center text-[clamp(2.2rem,8vw,4rem)] font-black leading-[1.08] text-white"
      >
        Votre zémidjan,{" "}
        <span className="relative inline-block text-brand-yellow">
          en 2 minutes
          <svg className="absolute -bottom-1.5 left-0 h-2 w-full" viewBox="0 0 200 8" fill="none">
            <path d="M2 6 Q50 1 100 5 Q150 9 198 3" stroke="var(--brand-orange)" strokeWidth="3" strokeLinecap="round" fill="none" />
          </svg>
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.45 }}
        className="mt-5 max-w-[480px] text-center text-[clamp(1rem,2.5vw,1.2rem)] leading-relaxed text-white/65"
      >
        Commandez votre moto-taxi au meilleur prix.
        Les conducteurs font leurs offres, vous choisissez.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        className="mt-10 flex flex-wrap justify-center gap-3.5"
      >
        <Button
          onClick={() => navigate("/inscription")}
          className="h-auto rounded-full bg-brand-yellow px-8 py-3.5 text-base font-extrabold text-brand-black shadow-[0_4px_24px_var(--brand-yellow)50] transition-transform hover:-translate-y-0.5 hover:bg-brand-yellow/90 hover:shadow-[0_8px_32px_var(--brand-yellow)70]"
        >
          Commander un trajet
        </Button>
        <Button
          onClick={() => navigate("/inscription")}
          className="h-auto rounded-full border-2 border-brand-orange bg-transparent px-8 py-3.5 text-base font-bold text-brand-orange transition-colors hover:bg-brand-orange hover:text-white"
        >
          Devenir conducteur
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.75 }}
        className="mt-16 flex flex-wrap justify-center gap-10"
      >
        {[
          { val: "2 min",   label: "Délai moyen" },
          { val: "25 FCFA", label: "Commission fixe" },
          { val: "100%",    label: "Conducteurs vérifiés" },
        ].map(({ val, label }) => (
          <div key={label} className="text-center">
            <div className="text-[1.9rem] font-black text-brand-yellow">{val}</div>
            <div className="mt-1 text-[0.82rem] text-white/50">{label}</div>
          </div>
        ))}
      </motion.div>

      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 animate-[bounceBas_2s_infinite] text-[22px] text-white/35">
        <ChevronDown className="size-6" />
      </div>
    </section>
  )
}

/* ─── Comment ça marche ─────────────────────────────── */
const ETAPES = [
  { num: "01", icon: <MapPin className="size-10 text-brand-yellow" />,        titre: "Indiquez votre destination",        desc: "Entrez votre point de départ et d'arrivée. Simple et rapide.",                    color: "brand-yellow"  },
  { num: "02", icon: <MessageCircle className="size-10 text-brand-orange" />, titre: "Les conducteurs font leurs offres", desc: "Plusieurs conducteurs proches vous proposent leur prix en temps réel.",            color: "brand-orange" },
  { num: "03", icon: <CheckCircle className="size-10 text-brand-green" />,    titre: "Choisissez et partez",              desc: "Acceptez l'offre qui vous convient. Le conducteur arrive en moins de 2 minutes.", color: "brand-green"   },
]

function CommentCaMarche() {
  return (
    <section className="bg-brand-bg px-6 py-20">
      <RevealSection className="mx-auto max-w-[920px]">
        <motion.div variants={fadeUp} className="mb-14 text-center">
          <span className="rounded-full bg-brand-yellow/15 px-[18px] py-1 text-xs font-extrabold uppercase tracking-widest text-brand-black">
            Simple comme bonjour
          </span>
          <h2 className="mt-4 text-[clamp(1.7rem,4vw,2.5rem)] font-black text-brand-black">
            Comment ça marche ?
          </h2>
        </motion.div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6">
          {ETAPES.map(({ num, icon, titre, desc, color }, i) => (
            <motion.div
              key={num}
              variants={fadeUp}
              transition={{ delay: i * 0.15 }}
              className={`relative rounded-[20px] border-t-4 border-${color} bg-white p-7 shadow-[0_2px_20px_rgba(0,0,0,0.06)]`}
            >
              <div className={`absolute top-[18px] right-[22px] select-none text-[3.2rem] font-black leading-none text-${color}/10`}>
                {num}
              </div>
              <div className="mb-4">{icon}</div>
              <h3 className="mb-2.5 text-[1.05rem] font-extrabold text-brand-black">{titre}</h3>
              <p className="text-[0.92rem] leading-relaxed text-gray-500">{desc}</p>
            </motion.div>
          ))}
        </div>
      </RevealSection>
    </section>
  )
}

/* ─── Avantages ─────────────────────────────────────── */
const AVANTAGES = [
  { icon: <Zap className="size-8" />,        titre: "Prix en temps réel",   desc: "Enchères ouvertes — vous payez le juste prix, jamais plus." },
  { icon: <Shield className="size-8" />,     titre: "Conducteurs vérifiés", desc: "Chaque conducteur est validé par notre équipe avant activation." },
  { icon: <Smartphone className="size-8" />, titre: "100% Mobile Money",     desc: "MTN & Moov acceptés. Zéro carte bancaire." },
  { icon: <Globe className="size-8" />,      titre: "Fait pour le Bénin",    desc: "Conçu pour les réalités de Cotonou et des villes béninoises." },
]

function Avantages() {
  return (
    <section className="bg-brand-black px-6 py-20">
      <RevealSection className="mx-auto max-w-[920px]">
        <motion.div variants={fadeUp} className="mb-14 text-center">
          <h2 className="text-[clamp(1.7rem,4vw,2.5rem)] font-black text-white">
            Pourquoi choisir <span className="text-brand-yellow">Zem Connect</span> ?
          </h2>
        </motion.div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5">
          {AVANTAGES.map(({ icon, titre, desc }, i) => (
            <motion.div
              key={titre}
              variants={fadeUp}
              transition={{ delay: i * 0.1 }}
              className="cursor-default rounded-2xl border border-white/10 bg-white/5 p-7 transition-colors hover:border-brand-yellow/25 hover:bg-white/[0.09]"
            >
              <div className="mb-3.5 text-brand-yellow">{icon}</div>
              <h3 className="mb-2 text-base font-bold text-white">{titre}</h3>
              <p className="text-[0.88rem] leading-relaxed text-white/55">{desc}</p>
            </motion.div>
          ))}
        </div>
      </RevealSection>
    </section>
  )
}

/* ─── CTA Conducteur ────────────────────────────────── */
function CTAConducteur() {
  const navigate = useNavigate()
  return (
    <section className="bg-brand-bg px-6 py-20">
      <RevealSection className="mx-auto max-w-[820px]">
        <motion.div
          variants={fadeUp}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-orange to-[#ff7a2f] p-[clamp(40px,6vw,64px)] text-center shadow-[0_20px_60px_var(--brand-orange)40]"
        >
          <div className="pointer-events-none absolute -top-10 -right-10 size-[200px] rounded-full bg-white/8" />
          <div className="pointer-events-none absolute -bottom-[30px] -left-[30px] size-[150px] rounded-full bg-white/6" />
          <div className="mb-4">
            <Bike className="mx-auto size-12 text-white" />
          </div>
          <h2 className="mb-4 text-[clamp(1.5rem,4vw,2.1rem)] font-black text-white">
            Vous êtes conducteur de zémidjan ?
          </h2>
          <p className="mx-auto mb-8 max-w-[500px] text-[1.05rem] leading-relaxed text-white/88">
            Rejoignez la plateforme, recevez des commandes et augmentez vos revenus.
            Seulement <strong>25 FCFA de commission</strong> par trajet complété.
          </p>
          <Button
            onClick={() => navigate("/inscription")}
            className="h-auto rounded-full bg-white px-9 py-3.5 text-base font-extrabold text-brand-orange shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-transform hover:-translate-y-0.5 hover:bg-white/95"
          >
            S'inscrire comme conducteur
          </Button>
        </motion.div>
      </RevealSection>
    </section>
  )
}

/* ─── Footer ────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="bg-[#0a0a14] px-6 py-10 text-center text-sm text-white/40">
      <div className="mb-2">
        <span className="font-extrabold text-white">Zem<span className="text-brand-yellow">Connect</span></span>
        {" "}— Cotonou, Bénin
      </div>
      <div>© {new Date().getFullYear()} Zem Connect. Tous droits réservés.</div>
    </footer>
  )
}

/* ─── Page ──────────────────────────────────────────── */

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <CommentCaMarche />
        <Avantages />
        <CTAConducteur />
      </main>
      <Footer />
    </>
  )
}