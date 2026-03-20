# ZEM CONNECT — PRD (Product Requirements Document)
*Version 1.0 — 2026-03-20 — Source de vérité unique du projet*

## 1. VISION PRODUIT
Plateforme de mise en relation entre clients et conducteurs de zémidjan
au Bénin. Modèle d'enchères bidirectionnel — le client propose un prix,
le conducteur accepte ou contre-propose. Commission fixe prélevée sur
le wallet du conducteur à chaque course complétée.

## 2. UTILISATEURS CIBLES

### Client
- Habitant de Cotonou/Calavi/Porto-Novo/Parakou
- Smartphone Android, réseau 2G/3G
- Peu alphabétisé numériquement
- Paie en cash à la fin de la course

### Conducteur
- Zémidjan indépendant
- Android bas de gamme
- WhatsApp natif universel
- Revenus journaliers 3000-8000 FCFA sans ZEM Connect

### Types de conducteurs (actuel et futur)
- **Solo** (actuel) : 1 moto, conducteur indépendant
- **Premium** (V3) : abonné, commission fixe remplacée par abonnement
- **Flotte** (V3) : plusieurs motos, gestion équipe
- **Partenaire** (V3) : conducteur affilié indépendant

### Admin
- Équipe ZEM Connect
- Gestion plateforme, validation conducteurs, litiges

## 3. MODÈLE ÉCONOMIQUE
- Commission configurable par course (défaut 25 FCFA) — déduite du wallet conducteur
- Abonnement premium 500 FCFA/semaine (V3) — remplace commission à l'acte
- Paiement client → conducteur : cash pour MVP, Mobile Money V2
- Zéro frais sur le prix de la course — le conducteur reçoit 100% du prix négocié

## 4. FLUX CORE (validé en production)
1. Client crée course avec prix proposé + adresse départ/destination
2. Conducteurs voient la course en temps réel (expiration 10 minutes)
3. Conducteur soumet offre — prix accepté ou contre-offre
4. Client accepte l'offre de son choix
5. Client accepte offre → commission 25 FCFA déduite du wallet conducteur automatiquement (anti-fraude)
6. Conducteur se dirige vers le client et démarre → trips.status = "in_progress"
7. Course terminée → notation mutuelle client ↔ conducteur
8. Historique et transactions mis à jour en temps réel

## 5. STACK TECHNIQUE
- Frontend : React 19 + TypeScript + Vite + Zustand + shadcn/ui + Tailwind v4
- Backend : PocketBase v0.36.5 sur Fly.io
- Déploiement : Cloudflare Pages (frontend) + Fly.io (backend)
- PWA : vite-plugin-pwa + service worker autoUpdate

## 6. ÉTAT ACTUEL (2026-03-20)
MVP complet en production. 15+ pages implémentées. Flux core validé.

### Livré
- Auth numéro téléphone béninois (+229XXXXXXXXXX@zemconnect.app)
- Système enchères bidirectionnel avec boutons rapides
- Wallet conducteur avec commission dynamique temps réel
- Notation mutuelle client ↔ conducteur
- Dashboard admin complet avec temps réel sur toutes les pages
- AdminUserDetail — vue profil complet utilisateur
- PWA installable avec service worker
- GPS départ (navigator.geolocation)
- Historique transactions et courses conducteur
- Modification profil utilisateur

## 7. ROADMAP

### Phase MVP ✅ COMPLÈTE

### Phase V2 — En cours
- [ ] Recharge KKiaPay (compte créé, clé API en attente)
- [ ] GPS Local (Hamid KPETRE — API pas encore disponible)
- [ ] Distribution courses par proximité 1km
- [ ] Notifications push PWA (VAPID keys)
- [x] Notation mutuelle ✅
- [x] Recharge manuelle admin ✅
- [x] PWA complète ✅
- [x] Commission dynamique ✅
- [x] AdminUserDetail ✅

### Phase V3 — Planifiée
- [ ] Abonnement premium conducteur 500 FCFA/semaine
- [ ] Statistiques revenus conducteur (comparaison avant/après ZEM)
- [ ] Types conducteurs : solo, premium, flotte, partenaire
- [ ] OAuth2 Google + OTP WhatsApp (360dialog)
- [ ] Séparer connexion admin (email) / utilisateur (téléphone)
- [ ] ID utilisateur préfixé CL-/ZM- calculé à l'affichage
- [ ] Codes promo automatisés
- [ ] Multi-zem (nombre_zem = 1 ou 2)
- [ ] APK Android via PWABuilder
- [ ] Application native Flutter iOS + Android
- [ ] Expansion Porto-Novo, Parakou, Ouidah
- [ ] API widget intégrable (hôtels, entreprises)

## 8. CONTRAINTES TECHNIQUES
- Réseau 2G/3G Bénin → optimisation critique
- Appareils Android bas de gamme → UI légère, pas d'animations lourdes
- PocketBase v0.36.5 : @request.auth.record.role cause erreur SQL
  → utiliser @request.auth.id != "" pour les API Rules
- Statut trip "accepte" (sans accent, sans 'd') — valeur exacte PocketBase
- Collection settings : UN SEUL enregistrement obligatoire
- Champ transactions : "reference" (pas "note")

## 9. DÉCISIONS ARCHITECTURALES FIGÉES
- Wallet interne PocketBase — pas de gateway externe pour MVP
- GPS : navigator.geolocation pour coordonnées, adresse textuelle manuelle
- Session : authRefresh au montage + isAuthReady gate dans App.tsx
- Commission : dynamique depuis collection settings
- Expiration courses : 10 minutes
- Pagination AdminUsers : 100 items fixe (recherche frontend incompatible BD)
- Hook 4 : transaction créée AVANT modification wallet (anti-boucle)

## 10. KPIs DE SUCCÈS
- 50 conducteurs actifs à Cotonou dans les 3 premiers mois
- 200 courses complétées par semaine
- Note moyenne conducteurs > 4.0
- Taux d'expiration courses < 20%
- Revenu moyen conducteur +30% vs avant ZEM Connect

## 11. RÈGLES DE COLLABORATION (Workflow)
- Source de vérité : ce fichier PRD.md
- Toute modification produit → mettre à jour PRD.md en premier
- Claude génère les prompts IDE à partir du PRD
- IDE exécute → montre le code → validation → commit
- Jamais de commit sans validation explicite

## Changelog
- [2026-03-20] v1.0 — création initiale, fusion overview.md + roadmap.md
- [2026-03-20] v1.1 — flux core mis à jour : commission à l'acceptation (anti-fraude)
