# ZEM CONNECT — CONTEXTE BACKEND

## Infrastructure
- PocketBase version : v0.36.5
- URL production : https://zem-connect2-pb.fly.dev
- URL locale : http://127.0.0.1:8090
- Dossier local : C:\Projects\Zem-Connect2\backend
- Déploiement : Fly.io
- Hooks : C:\Projects\Zem-Connect2\backend\pb_hooks\main.pb.js

## Collections
| Collection   | Type | Description |
|-------------|------|-------------|
| users        | Auth | Clients, conducteurs, admins |
| trips        | Base | Courses |
| offres       | Base | Offres conducteurs sur courses |
| transactions | Base | Mouvements wallet |
| notations    | Base | Notes clients/conducteurs |
| litiges      | Base | Litiges signalés |

## Champs clés — users
- role : "client" | "conducteur" | "admin"
- phone : numéro béninois (format : 01XXXXXXXX)
- email : généré automatiquement (+229XXXXXXXXXX@zemconnect.app)
- walletBalance : number (défaut 0)
- isOnline : boolean
- isSuspended : boolean
- conducteur_verifie : boolean (défaut false)
- plaque : string (conducteurs uniquement)
- rating : number
- totalRating : number
- subscriptionType : "none" | "premium"

## Champs clés — trips
- client : relation users
- conducteur : relation users
- status : "pending" | "active" | "in_progress" | "completed" | "cancelled" | "expired"
- clientPrice : number
- finalPrice : number
- departureAddress : string
- destinationAddress : string
- expiresAt : datetime (2 minutes après création)

## Champs clés — offres
- trip : relation trips
- conducteur : relation users
- proposedPrice : number
- status : "pending" | "accepted" | "rejected" | "cancelled"
- isCounterOffer : boolean

## Champs clés — transactions
- user : relation users
- type : "commission" | "recharge" | "refund"
- amount : number
- trip : relation trips (optionnel)
- status : "completed" | "pending" | "failed"

## Hooks actifs (pb_hooks/main.pb.js)
- Hook 1 : Déduction 25 FCFA commission quand trip → in_progress
- Hook 2 : Remboursement 25 FCFA quand trip → cancelled (si conducteur assigné)
- Hook 3 : Expiration automatique trip pending via cron par trip
- Hook 4 : Calcul note moyenne conducteur après création notation
- Hook 5 : Crédit 200 FCFA wallet bienvenue après conducteur_verifie → true
- Cron global : expiration trips pending toutes les minutes

## Règles PocketBase v0.36.5
- e.next() en première ligne de chaque hook
- $app.findRecordById() (pas $app.dao().findRecordById)
- $app.save() (pas $app.dao().saveRecord)
- onRecordAfterUpdateSuccess (pas onRecordAfterUpdateRequest)
- onRecordAfterCreateSuccess (pas onRecordAfterCreateRequest)

## Règles métier immuables
- Commission : 25 FCFA par course (déduite du wallet conducteur)
- Remboursement : 25 FCFA si client annule une course active
- Expiration course : 2 minutes après création
- Wallet minimum conducteur : 25 FCFA pour aller en ligne
- Wallet bienvenue : 200 FCFA après validation admin
- Paiement : cash entre les parties
- Subscription premium : 500 FCFA/semaine

## Déploiement Fly.io
- Redémarrage : fly deploy depuis C:\Projects\Zem-Connect2\backend
- Logs : fly logs
- Les hooks sont inclus dans le déploiement via pb_hooks/

## Règles de travail avec Cline
- Toujours relire main.pb.js avant toute modification
- Redémarrer PocketBase local après chaque modification de hook
- Tester chaque hook en local avant de déployer en production
- Ne jamais modifier les collections en production sans test local validé
- Tu met à jours le CONTEXT.md à chaque fonctionnalité et étape terminé et validé