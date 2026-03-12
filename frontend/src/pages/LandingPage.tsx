import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"

const C = {
  jaune:  "#F5C518",
  noir:   "#1A1A2E",
  orange: "#E85D04",
  vert:   "#06D6A0",
  fond:   "#F8F9FA",
}

function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.12 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return { ref, visible }
}

function Navbar() {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", handler)
    return () => window.removeEventListener("scroll", handler)
  }, [])
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      height: "64px", padding: "0 24px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: scrolled ? "rgba(26,26,46,0.95)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "none",
      transition: "all 0.3s ease",
    }}>
      <div
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
      >
        <div style={{
          width: "36px", height: "36px", borderRadius: "10px",
          background: C.jaune, display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: "18px",
        }}>🏍️</div>
        <span style={{ color: "#fff", fontWeight: 900, fontSize: "1.15rem", fontFamily: "Inter, sans-serif" }}>
          Zem<span style={{ color: C.jaune }}>Connect</span>
        </span>
      </div>
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <button
          onClick={() => navigate("/inscription")}
          style={{
            background: "transparent", border: "none",
            color: "rgba(255,255,255,0.8)", fontWeight: 600,
            fontSize: "15px", cursor: "pointer",
            padding: "8px 16px", borderRadius: "8px",
            fontFamily: "Inter, sans-serif", transition: "color 0.15s",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
        >
          Connexion
        </button>
        <Button
          onClick={() => navigate("/login")}
          style={{
            background: C.jaune, color: C.noir,
            fontWeight: 800, fontSize: "14px",
            padding: "8px 20px", height: "auto",
            borderRadius: "100px", fontFamily: "Inter, sans-serif",
          }}
        >
          S'inscrire
        </Button>
      </div>
    </nav>
  )
}

function Hero() {
  const navigate = useNavigate()
  return (
    <section style={{
      background: `linear-gradient(135deg, ${C.noir} 0%, #0d0d1a 55%, #16213e 100%)`,
      minHeight: "100svh", position: "relative", overflow: "hidden",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "100px 24px 80px",
    }}>
      <div style={{
        position: "absolute", top: "-100px", right: "-80px",
        width: "400px", height: "400px", borderRadius: "50%",
        background: `radial-gradient(circle, ${C.jaune}20 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-60px", left: "-60px",
        width: "300px", height: "300px", borderRadius: "50%",
        background: `radial-gradient(circle, ${C.orange}18 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />
      <div style={{
        background: `${C.jaune}18`,
        border: `1px solid ${C.jaune}40`,
        color: C.jaune, borderRadius: "100px",
        padding: "6px 20px", fontSize: "13px",
        fontWeight: 700, letterSpacing: "0.04em",
        marginBottom: "28px", fontFamily: "Inter, sans-serif",
        animation: "fadeDown 0.6s ease both",
      }}>
        🇧🇯 Cotonou · Calavi · Porto-Novo · Parakou
      </div>
      <div style={{
        fontSize: "80px", lineHeight: 1, marginBottom: "24px",
        filter: `drop-shadow(0 8px 28px ${C.jaune}44)`,
        animation: "bounceIn 0.8s cubic-bezier(.36,.07,.19,.97) both 0.2s",
      }}>🏍️</div>
      <h1 style={{
        fontSize: "clamp(2.2rem, 8vw, 4rem)",
        fontWeight: 900, lineHeight: 1.08,
        color: "#fff", textAlign: "center",
        maxWidth: "700px", fontFamily: "Inter, sans-serif",
        animation: "fadeUp 0.7s ease both 0.3s",
      }}>
        Votre zémidjan,{" "}
        <span style={{ color: C.jaune, position: "relative", display: "inline-block" }}>
          en 2 minutes
          <svg
            style={{ position: "absolute", bottom: "-6px", left: 0, width: "100%", height: "8px" }}
            viewBox="0 0 200 8" fill="none"
          >
            <path d="M2 6 Q50 1 100 5 Q150 9 198 3"
              stroke={C.orange} strokeWidth="3" strokeLinecap="round" fill="none" />
          </svg>
        </span>
      </h1>
      <p style={{
        color: "rgba(255,255,255,0.65)",
        fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
        textAlign: "center", maxWidth: "480px",
        marginTop: "20px", lineHeight: 1.65,
        fontFamily: "Inter, sans-serif",
        animation: "fadeUp 0.7s ease both 0.45s",
      }}>
        Commandez votre moto-taxi au meilleur prix.
        Les conducteurs font leurs offres, vous choisissez.
      </p>
      <div style={{
        display: "flex", gap: "14px",
        marginTop: "40px", flexWrap: "wrap",
        justifyContent: "center",
        animation: "fadeUp 0.7s ease both 0.6s",
      }}>
        <Button
          onClick={() => navigate("/inscription")}
          style={{
            background: C.jaune, color: C.noir,
            fontWeight: 800, fontSize: "16px",
            padding: "14px 32px", height: "auto",
            borderRadius: "100px", fontFamily: "Inter, sans-serif",
            boxShadow: `0 4px 24px ${C.jaune}50`,
            transition: "transform 0.15s, box-shadow 0.15s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "translateY(-2px)"
            e.currentTarget.style.boxShadow = `0 8px 32px ${C.jaune}70`
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = ""
            e.currentTarget.style.boxShadow = `0 4px 24px ${C.jaune}50`
          }}
        >
          Commander un trajet
        </Button>
        <Button
          onClick={() => navigate("/inscription")}
          style={{
            background: "transparent",
            border: `2px solid ${C.orange}`,
            color: C.orange, fontWeight: 700,
            fontSize: "16px", padding: "14px 32px",
            height: "auto", borderRadius: "100px",
            fontFamily: "Inter, sans-serif",
            transition: "background 0.15s, color 0.15s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = C.orange
            e.currentTarget.style.color = "#fff"
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "transparent"
            e.currentTarget.style.color = C.orange
          }}
        >
          Devenir conducteur
        </Button>
      </div>
      <div style={{
        display: "flex", gap: "40px",
        marginTop: "64px", flexWrap: "wrap",
        justifyContent: "center",
        animation: "fadeUp 0.7s ease both 0.75s",
      }}>
        {[
          { val: "2 min",   label: "Délai moyen" },
          { val: "25 FCFA", label: "Commission fixe" },
          { val: "100%",    label: "Conducteurs vérifiés" },
        ].map(({ val, label }) => (
          <div key={label} style={{ textAlign: "center" }}>
            <div style={{ color: C.jaune, fontWeight: 900, fontSize: "1.9rem", fontFamily: "Inter, sans-serif" }}>
              {val}
            </div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.82rem", marginTop: "4px", fontFamily: "Inter, sans-serif" }}>
              {label}
            </div>
          </div>
        ))}
      </div>
      <div style={{
        position: "absolute", bottom: "28px",
        left: "50%", transform: "translateX(-50%)",
        color: "rgba(255,255,255,0.35)",
        fontSize: "22px", animation: "bounceBas 2s infinite",
      }}>↓</div>
    </section>
  )
}

const ETAPES = [
  { num: "01", icon: "📍", titre: "Indiquez votre destination",        desc: "Entrez votre point de départ et d'arrivée. Simple et rapide.",                    color: C.jaune  },
  { num: "02", icon: "💬", titre: "Les conducteurs font leurs offres", desc: "Plusieurs conducteurs proches vous proposent leur prix en temps réel.",            color: C.orange },
  { num: "03", icon: "✅", titre: "Choisissez et partez",              desc: "Acceptez l'offre qui vous convient. Le conducteur arrive en moins de 2 minutes.", color: C.vert   },
]

function CommentCaMarche() {
  const { ref, visible } = useReveal()
  return (
    <section style={{ background: C.fond, padding: "80px 24px" }}>
      <div ref={ref} style={{ maxWidth: "920px", margin: "0 auto" }}>
        <div style={{
          textAlign: "center", marginBottom: "56px",
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(24px)",
          transition: "all 0.6s ease",
        }}>
          <span style={{
            background: `${C.jaune}25`, color: C.noir,
            borderRadius: "100px", padding: "4px 18px",
            fontSize: "12px", fontWeight: 800,
            letterSpacing: "0.1em", textTransform: "uppercase" as const,
            fontFamily: "Inter, sans-serif",
          }}>Simple comme bonjour</span>
          <h2 style={{
            fontSize: "clamp(1.7rem, 4vw, 2.5rem)",
            fontWeight: 900, color: C.noir,
            marginTop: "16px", fontFamily: "Inter, sans-serif",
          }}>Comment ça marche ?</h2>
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "24px",
        }}>
          {ETAPES.map(({ num, icon, titre, desc, color }, i) => (
            <div key={num} style={{
              background: "#fff", borderRadius: "20px",
              padding: "32px 28px", position: "relative",
              boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
              borderTop: `4px solid ${color}`,
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateY(32px)",
              transition: `all 0.6s ease ${i * 0.15}s`,
            }}>
              <div style={{
                position: "absolute", top: "18px", right: "22px",
                fontSize: "3.2rem", fontWeight: 900,
                color: `${color}18`, lineHeight: 1,
                fontFamily: "Inter, sans-serif", userSelect: "none" as const,
              }}>{num}</div>
              <div style={{ fontSize: "2.4rem", marginBottom: "16px" }}>{icon}</div>
              <h3 style={{ fontWeight: 800, fontSize: "1.05rem", color: C.noir, marginBottom: "10px", fontFamily: "Inter, sans-serif" }}>{titre}</h3>
              <p style={{ color: "#666", fontSize: "0.92rem", lineHeight: 1.65, fontFamily: "Inter, sans-serif" }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const AVANTAGES = [
  { icon: "⚡", titre: "Prix en temps réel",   desc: "Enchères ouvertes — vous payez le juste prix, jamais plus." },
  { icon: "🔒", titre: "Conducteurs vérifiés", desc: "Chaque conducteur est validé par notre équipe avant activation." },
  { icon: "📱", titre: "100% Mobile Money",     desc: "MTN & Moov acceptés. Zéro carte bancaire." },
  { icon: "🌍", titre: "Fait pour le Bénin",    desc: "Conçu pour les réalités de Cotonou et des villes béninoises." },
]

function Avantages() {
  const { ref, visible } = useReveal()
  return (
    <section style={{ background: C.noir, padding: "80px 24px" }}>
      <div ref={ref} style={{ maxWidth: "920px", margin: "0 auto" }}>
        <div style={{
          textAlign: "center", marginBottom: "56px",
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(24px)",
          transition: "all 0.6s ease",
        }}>
          <h2 style={{ fontSize: "clamp(1.7rem, 4vw, 2.5rem)", fontWeight: 900, color: "#fff", fontFamily: "Inter, sans-serif" }}>
            Pourquoi choisir <span style={{ color: C.jaune }}>Zem Connect</span> ?
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
          {AVANTAGES.map(({ icon, titre, desc }, i) => (
            <div key={titre} style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "16px", padding: "28px 24px",
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateY(28px)",
              transition: `all 0.5s ease ${i * 0.1}s`,
              cursor: "default",
            }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.09)"
                e.currentTarget.style.borderColor = `${C.jaune}40`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)"
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "14px" }}>{icon}</div>
              <h3 style={{ color: "#fff", fontWeight: 700, fontSize: "1rem", marginBottom: "8px", fontFamily: "Inter, sans-serif" }}>{titre}</h3>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.88rem", lineHeight: 1.65, fontFamily: "Inter, sans-serif" }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTAConducteur() {
  const { ref, visible } = useReveal()
  const navigate = useNavigate()
  return (
    <section style={{ background: C.fond, padding: "80px 24px" }}>
      <div ref={ref} style={{
        maxWidth: "820px", margin: "0 auto",
        background: `linear-gradient(135deg, ${C.orange} 0%, #ff7a2f 100%)`,
        borderRadius: "24px", padding: "clamp(40px, 6vw, 64px)",
        textAlign: "center", position: "relative", overflow: "hidden",
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "scale(0.97)",
        transition: "all 0.6s ease",
        boxShadow: `0 20px 60px ${C.orange}40`,
      }}>
        <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(255,255,255,0.08)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-30px", left: "-30px", width: "150px", height: "150px", borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
        <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🏍️💨</div>
        <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.1rem)", fontWeight: 900, color: "#fff", marginBottom: "16px", fontFamily: "Inter, sans-serif" }}>
          Vous êtes conducteur de zémidjan ?
        </h2>
        <p style={{ color: "rgba(255,255,255,0.88)", fontSize: "1.05rem", lineHeight: 1.65, maxWidth: "500px", margin: "0 auto 32px", fontFamily: "Inter, sans-serif" }}>
          Rejoignez la plateforme, recevez des commandes et augmentez vos revenus.
          Seulement <strong>25 FCFA de commission</strong> par trajet complété.
        </p>
        <Button
          onClick={() => navigate("/inscription")}
          style={{
            background: "#fff", color: C.orange,
            fontWeight: 800, fontSize: "16px",
            padding: "14px 36px", height: "auto",
            borderRadius: "100px", fontFamily: "Inter, sans-serif",
            boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
            transition: "transform 0.15s",
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
          onMouseLeave={e => (e.currentTarget.style.transform = "")}
        >
          S'inscrire comme conducteur
        </Button>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer style={{
      background: "#0a0a14", color: "rgba(255,255,255,0.4)",
      padding: "40px 24px", textAlign: "center",
      fontSize: "0.875rem", fontFamily: "Inter, sans-serif",
    }}>
      <div style={{ marginBottom: "8px" }}>
        <span style={{ color: "#fff", fontWeight: 800 }}>Zem<span style={{ color: C.jaune }}>Connect</span></span>
        {" "}— Cotonou, Bénin
      </div>
      <div>© {new Date().getFullYear()} Zem Connect. Tous droits réservés.</div>
    </footer>
  )
}

const globalCss = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeDown {
    from { opacity: 0; transform: translateY(-14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes bounceIn {
    0%   { opacity: 0; transform: scale(0.5); }
    60%  { transform: scale(1.15); }
    100% { opacity: 1; transform: scale(1); }
  }
  @keyframes bounceBas {
    0%, 100% { transform: translateX(-50%) translateY(0); }
    50%       { transform: translateX(-50%) translateY(8px); }
  }
`

export default function LandingPage() {
  return (
    <>
      <style>{globalCss}</style>
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