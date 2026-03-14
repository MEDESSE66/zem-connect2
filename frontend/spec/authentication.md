# AUTHENTICATION — SPEC
*Version 2.0 — 2026-03-14*

## Identifiant principal
- Numéro de téléphone format Bénin : préfixe 01 + 8 chiffres = 10 chiffres total
- Placeholder : "01 XX XX XX XX"
- Email généré automatiquement : `+229XXXXXXXXXX@zemconnect.app`
- L'utilisateur ne voit jamais cet email
- Conversion dans authStore.ts : `phoneToEmail(phone)` → `+229${phone}@zemconnect.app`

## Login (src/pages/Login.tsx)
- Champ : numéro de téléphone — placeholder "01 XX XX XX XX"
- Champ : mot de passe (8 chiffres minimum, clavier numérique) — placeholder "••••••••"
- Bouton : Se connecter
- Séparateur "ou"
- Bouton : Continuer avec Google (OAuth2 — post-MVP)
- Redirection après login selon rôle :
  - client → /client
  - conducteur → /driver
  - admin → /admin

## Admin login
- MVP : utilise directement https://zem-connect2-pb.fly.dev/_/
- V2 : email + mot de passe via page login
- Actuellement géré dans authStore.login : `phone.includes("@") ? phone : phoneToEmail(phone)`

## Inscription (src/pages/Inscription.tsx)
- Étape 1 : choix du rôle (client ou conducteur — jamais admin)
- Étape 2 (commune) : nom + téléphone + mot de passe
  - Placeholders : "Ex: Koffi Mensah" / "01 XX XX XX XX" / "8 chiffres minimum"
- Étape 3 (conducteur uniquement) : numéro de plaque
  - Placeholder : "Ex: AB 123 CD"
  - Photo conducteur : SUPPRIMÉE — non requise
- conducteur_verifie = false par défaut à l'inscription
- walletBalance initialisé à 0 à l'inscription
- Wallet bienvenue 250 FCFA : crédité par hook backend à validation admin UNIQUEMENT

## Validation admin conducteur
- Admin voit : nom + numéro + plaque dans AdminUsers
- Admin valide en un clic → conducteur_verifie = true
- Hook déclenche crédit 250 FCFA automatiquement
- Conducteur reçoit notification in-app : "Compte validé — 250 FCFA crédités"
- Conducteur ne peut pas voir les courses avant validation

## Session
- checkAuth() appelé au montage de App.tsx
- pb.authStore.onChange() écoute déconnexion automatique
- Restauration session au rechargement : pb.authStore.isValid + pb.authStore.record

## Mot de passe
- Minimum 8 caractères numériques
- Clavier numérique uniquement côté frontend
- Validation côté frontend avant envoi

## OTP WhatsApp (post-MVP)
- Envoi via 360dialog API
- Code généré dans collection otp_codes via hook PocketBase
- Saisie manuelle uniquement — autofill impossible sur PWA

## Changelog
- [2026-03-14] v1.0 — création initiale
- [2026-03-14] v2.0 — suppression photo étape 3, bonus 250F (pas 200F),
  validation admin maintenue, ajout placeholders
