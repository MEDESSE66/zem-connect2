import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../../store/authStore"
import { Button } from "@/components/ui/button"
import BottomNav from "../../components/BottomNav"

const C = {
  jaune:  "#F5C518",
  noir:   "#1A1A2E",
  orange: "#E85D04",
  vert:   "#06D6A0",
  fond:   "#F8F9FA",
}

const NAV_ITEMS = [
  { icon: "🏠", label: "Accueil",    path: "/driver" },
  { icon: "🏍️", label: "Ma course",  path: "/driver/ma-course" },
  { icon: "📋", label: "Historique", path: "/driver/historique" },
]

export default function DriverProfil() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  // Génère les initiales à partir du nom
  const getInitials = (name?: string) => {
    if (!name) return "?"
    return name.charAt(0).toUpperCase()
  }

  // Formate le rôle pour l'affichage
  const formatRole = (role: string) => {
    const roles: Record<string, string> = {
      client: "Client",
      conducteur: "Conducteur",
      admin: "Administrateur",
    }
    return roles[role] || role
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
        padding: "20px 24px 28px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Déco */}
        <div style={{
          position: "absolute", top: "-40px", right: "-40px",
          width: "180px", height: "180px", borderRadius: "50%",
          background: `radial-gradient(circle, ${C.orange}20 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />

        {/* Bouton retour */}
        <button
          onClick={() => navigate("/driver")}
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "rgba(255,255,255,0.8)",
            borderRadius: "10px",
            padding: "8px 12px",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span>←</span> Retour
        </button>

        {/* Titre */}
        <h1 style={{
          color: "#fff",
          fontWeight: 800,
          fontSize: "1.4rem",
          marginBottom: "4px",
        }}>
          Mon profil
        </h1>
        <p style={{
          color: "rgba(255,255,255,0.5)",
          fontSize: "0.85rem",
        }}>
          Informations de votre compte conducteur
        </p>
      </div>

      {/* Contenu */}
      <div style={{ padding: "24px" }}>

        {/* Avatar + Nom + Statut */}
        <div style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "24px",
          marginBottom: "16px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}>
          {/* Avatar avec initiales */}
          <div style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${C.jaune} 0%, ${C.orange} 100%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2rem",
            fontWeight: 800,
            color: "#fff",
            marginBottom: "16px",
            boxShadow: `0 4px 20px ${C.jaune}40`,
          }}>
            {getInitials(user?.name)}
          </div>

          {/* Nom complet */}
          <h2 style={{
            fontWeight: 800,
            fontSize: "1.3rem",
            color: C.noir,
            marginBottom: "8px",
          }}>
            {user?.name || "Conducteur"}
          </h2>

          {/* Badge statut de vérification */}
          {user?.conducteur_verifie ? (
            <div style={{
              background: `${C.vert}20`,
              border: `1px solid ${C.vert}40`,
              borderRadius: "100px",
              padding: "6px 16px",
              fontSize: "0.8rem",
              fontWeight: 700,
              color: C.vert,
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}>
              <span>✓</span> Compte vérifié
            </div>
          ) : (
            <div style={{
              background: `${C.orange}20`,
              border: `1px solid ${C.orange}40`,
              borderRadius: "100px",
              padding: "6px 16px",
              fontSize: "0.8rem",
              fontWeight: 700,
              color: C.orange,
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}>
              <span>⏳</span> En attente de validation
            </div>
          )}
        </div>

        {/* Informations */}
        <div style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "20px",
          marginBottom: "16px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}>
          <h3 style={{
            fontWeight: 800,
            fontSize: "0.95rem",
            color: C.noir,
            marginBottom: "16px",
          }}>
            Informations personnelles
          </h3>

          {/* Téléphone */}
          <div style={{ marginBottom: "16px" }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "6px",
            }}>
              <span style={{ fontSize: "1.2rem" }}>📱</span>
              <span style={{
                fontSize: "0.8rem",
                color: "#999",
                fontWeight: 600,
              }}>
                Numéro de téléphone
              </span>
            </div>
            <div style={{
              fontSize: "0.95rem",
              fontWeight: 600,
              color: C.noir,
              paddingLeft: "32px",
            }}>
              {user?.phone || "Non renseigné"}
            </div>
          </div>

          {/* Numéro de plaque */}
          <div style={{ marginBottom: "16px" }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "6px",
            }}>
              <span style={{ fontSize: "1.2rem" }}>🏍️</span>
              <span style={{
                fontSize: "0.8rem",
                color: "#999",
                fontWeight: 600,
              }}>
                Numéro de plaque
              </span>
            </div>
            <div style={{
              fontSize: "0.95rem",
              fontWeight: 600,
              color: C.noir,
              paddingLeft: "32px",
            }}>
              {user?.plaque || "Non renseigné"}
            </div>
          </div>

          {/* Rôle détaillé */}
          <div>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "6px",
            }}>
              <span style={{ fontSize: "1.2rem" }}>👤</span>
              <span style={{
                fontSize: "0.8rem",
                color: "#999",
                fontWeight: 600,
              }}>
                Type de compte
              </span>
            </div>
            <div style={{
              fontSize: "0.95rem",
              fontWeight: 600,
              color: C.noir,
              paddingLeft: "32px",
            }}>
              {formatRole(user?.role || "conducteur")}
            </div>
          </div>
        </div>

        {/* Wallet */}
        <div style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "20px",
          marginBottom: "24px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}>
          <h3 style={{
            fontWeight: 800,
            fontSize: "0.95rem",
            color: C.noir,
            marginBottom: "16px",
          }}>
            Portefeuille
          </h3>

          <div style={{
            background: `linear-gradient(135deg, ${C.jaune}15 0%, ${C.orange}10 100%)`,
            border: `2px solid ${C.jaune}40`,
            borderRadius: "14px",
            padding: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <div>
              <div style={{
                fontSize: "0.8rem",
                color: "#666",
                marginBottom: "4px",
                fontWeight: 600,
              }}>
                Solde actuel
              </div>
              <div style={{
                fontSize: "1.8rem",
                fontWeight: 900,
                color: C.noir,
              }}>
                {user?.walletBalance ?? 0} <span style={{ fontSize: "1rem" }}>FCFA</span>
              </div>
            </div>
            <div style={{
              fontSize: "2.5rem",
            }}>
              💰
            </div>
          </div>

          {/* Info commission */}
          <div style={{
            marginTop: "12px",
            padding: "12px",
            background: `${C.jaune}10`,
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}>
            <span style={{ fontSize: "1.2rem" }}>ℹ️</span>
            <p style={{
              fontSize: "0.8rem",
              color: "#666",
              lineHeight: 1.4,
            }}>
              Commission par course : <strong style={{ color: C.noir }}>25 FCFA</strong>
            </p>
          </div>
        </div>

        {/* Bouton Déconnexion */}
        <Button
          onClick={() => {
            logout()
            navigate("/login")
          }}
          style={{
            width: "100%",
            background: "#fff",
            color: C.orange,
            border: `2px solid ${C.orange}`,
            fontWeight: 800,
            fontSize: "15px",
            height: "50px",
            borderRadius: "14px",
            fontFamily: "Inter, sans-serif",
            cursor: "pointer",
          }}
        >
          🚪 Déconnexion
        </Button>
      </div>

      <BottomNav items={NAV_ITEMS} />
    </div>
  )
}
