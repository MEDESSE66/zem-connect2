# COLLECTIONS POCKETBASE — SPEC
*Version 2.0 — 2026-03-14*

## users
- id, email (auto-généré +229...@zemconnect.app), phone
- name, role (client|conducteur|admin — IMMUABLE)
- walletBalance (number, default 0)
- isOnline (bool, default false)
- isSuspended (bool, default false)
- conducteur_verifie (bool, default false)
- plaque (text, optionnel — conducteur uniquement)
- rating (number, default 0)
- totalRating (number, default 0)
- subscriptionType (text, default "none")

## trips
- id, client (relation users), conducteur (relation users, optionnel)
- departureAddress, destinationAddress (text)
- departureLat, departureLng, destinationLat, destinationLng (number, default 0)
- clientPrice (number) — prix proposé par client
- finalPrice (number) — prix accepté final
- status : pending | accepte | in_progress | completed | cancelled | expired
- expiresAt (datetime) — now + 10 minutes à la création
- nombre_zem (number, default 1) — post-MVP : 1 ou 2

## offres
- id, trip (relation trips), conducteur (relation users)
- proposedPrice (number)
- isCounterOffer (bool, default false)
- est_choisi (bool, default false)
- status : pending | accepted | rejected

## transactions
- id, user (relation users)
- type : commission | refund | recharge
- amount (number)
- trip (relation trips, optionnel)
- status : completed | pending | failed
- reference (text, optionnel)
  → valeur "bienvenue" pour le crédit de bienvenue (anti-doublon hook)
  → valeur "recharge_admin" pour les recharges manuelles admin
  → valeur "remboursement" pour les remboursements après annulation

## notations
- id, auteur (relation users), target (relation users)
- trip (relation trips)
- score (number 1-5)
- commentaire (text, optionnel)

## litiges
- id, trip (relation trips)
- auteur (relation users)
- description (text)
- status : open | resolved | dismissed
- resolution (text, optionnel)

## settings (NOUVEAU — prix configurables par admin)
- id (un seul enregistrement dans la collection)
- commission_amount (number, default 25)
- subscription_price (number, default 500)
- welcome_bonus (number, default 250)
- Les hooks lisent ces valeurs dynamiquement
- Modifiable via page AdminSettings

## Noms de champs critiques — NE PAS RENOMMER
- walletBalance (pas wallet, pas balance)
- conducteur_verifie (pas isVerified, pas verified)
- totalRating (pas totalRatings)
- est_choisi (pas isChosen)
- clientPrice (pas prix_propose)
- finalPrice (pas prix_final)

## API Rules actuelles
- users : List/View/Update = auth != "" | Create = vide | Delete = admin
- trips : tout = auth != "" | Delete = admin
- offres : tout = auth != "" | Delete = admin
- transactions : List/View = admin||user | Create/Update/Delete = admin
- notations : List/View/Create = auth != "" | Update/Delete = admin
- litiges : List/View/Update/Delete = admin | Create = auth != ""
- settings : List/View/Create/Update = auth != "" | Delete = superuser

## Changelog
- [2026-03-14] v1.0 — création initiale
- [2026-03-14] v2.0 — ajout collection settings, ajout nombre_zem sur trips,
  ajout champ note sur transactions
- [2026-03-17] v2.1 — renommage critique : transactions champ note devient reference
- [2026-03-18] v2.2 — API Rules documentées
- [2026-03-20] v2.3 — expiresAt corrigé à 10 minutes, ajout reference "remboursement"
