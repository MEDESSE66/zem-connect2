# OVERVIEW — ZEM CONNECT

## Concept
Mise en relation client ↔ conducteur moto-taxi via système d'enchères.
Le client propose un prix. Le conducteur accepte ou contre-propose une seule fois.
Le client choisit l'offre qui lui convient.

## Modèle économique
- Commission fixe : 25 FCFA par course déductible du wallet conducteur
- Abonnement premium : 500 FCFA/semaine (remplace commission à l'acte)
- Paiement client : cash à la fin de la course
- Wallet conducteur uniquement pour la commission

## Rôles (immuables après inscription)
- `client` : commande des courses
- `conducteur` : accepte et exécute les courses
- `admin` : gère les utilisateurs et litiges via l'app (MVP : dashboard PB natif)

## État du projet au 2026-03-14
- 15 pages complètes et routées en production
- Auth numéro de téléphone fonctionnelle
- Flux core validé : création course → offre → acceptation → commission → terminée
- Déployé : Cloudflare Pages + Fly.io

## Priorités immédiates (bugs critiques)
1. LandingPage : bouton "Connexion" navigue vers /inscription au lieu de /login
2. Hook 5 backend : re-crédit 200 FCFA possible si wallet redescend sous 200

## Fonctionnalités manquantes pour lancement réel
- Géolocalisation GPS (coordonnées actuellement à 0)
- Contre-offre conducteur (UI absente, type prévu)
- Système de notation (backend prêt, UI absente)
- Recharge wallet Mobile Money (MTN/Moov)
- Bouton annulation course côté client
- VITE_PB_URL non configuré sur Cloudflare Pages

## Changelog
- [2026-03-18] État mis à jour — MVP stable en production, V2 en cours
