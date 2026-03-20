# ZEM CONNECT — PRODUCT REQUIREMENTS DOCUMENT (PRD)
*Version 1.0 — 2026-03-20*

## Vision produit
Plateforme de mise en relation entre clients et conducteurs de zémidjan
au Bénin. Modèle d'enchères bidirectionnel — le client propose un prix,
le conducteur accepte ou contre-propose.

## Utilisateurs cibles
- **Client** : habitant de Cotonou/Calavi/Porto-Novo, smartphone Android,
  réseau 2G/3G, peu alphabétisé numériquement
- **Conducteur solo** : zémidjan indépendant, Android bas de gamme,
  WhatsApp natif, revenus journaliers 3000-8000 FCFA
- **Admin** : équipe ZEM Connect, gestion plateforme

## Modèle économique
- Commission 25 FCFA par course (configurable via AdminSettings)
- Abonnement premium 500 FCFA/semaine (V3)
- Paiement cash client → conducteur (Mobile Money V2)

## Flux core validé en production
1. Client crée course avec prix proposé
2. Conducteurs voient la course en temps réel
3. Conducteur soumet offre (prix accepté ou contre-offre)
4. Client accepte l'offre de son choix
5. Conducteur démarre → commission déduite du wallet
6. Course terminée → notation mutuelle

## Stack technique
- Frontend : React 19 + TypeScript + Vite + Zustand + shadcn/ui
- Backend : PocketBase v0.36.5 sur Fly.io
- Déploiement : Cloudflare Pages + Fly.io

## État actuel (2026-03-20)
- MVP complet en production
- 15+ pages implémentées
- PWA installable
- Flux core validé

## Fonctionnalités MVP livrées
- Auth numéro téléphone béninois
- Système enchères bidirectionnel
- Wallet conducteur avec commission dynamique
- Notation mutuelle client ↔ conducteur
- Dashboard admin complet avec temps réel
- PWA avec service worker

## Fonctionnalités V2 en cours
- Recharge KKiaPay (en attente clé API)
- Distribution par proximité GPS 1km
- Notifications push PWA

## Fonctionnalités V3 planifiées
- Abonnement premium conducteur
- Statistiques revenus conducteur
- Types conducteurs étendus
- OAuth2 Google + OTP WhatsApp
- Application native Flutter

## Contraintes techniques
- Réseau 2G/3G Bénin → optimisation critique
- Appareils Android bas de gamme → UI légère
- PocketBase v0.36.5 : @request.auth.record.role cause erreur SQL
  → utiliser @request.auth.id != "" pour les API Rules
- Statut trip "accepte" (sans accent) — valeur exacte dans PocketBase

## Décisions architecturales
- Wallet interne PocketBase (pas de gateway externe pour MVP)
- GPS : navigator.geolocation pour coordonnées, adresse textuelle manuelle
- Session : authRefresh au montage + isAuthReady gate
- Commission : dynamique depuis collection settings

## KPIs de succès
- 50 conducteurs actifs à Cotonou dans les 3 premiers mois
- 200 courses complétées par semaine
- Note moyenne conducteurs > 4.0
- Taux d'expiration courses < 20%
