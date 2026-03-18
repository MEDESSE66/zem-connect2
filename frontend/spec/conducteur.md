
# CONDUCTEUR — SPEC
*Version 2.0 — 2026-03-14*

## DriverAccueil (src/pages/driver/DriverAccueil.tsx)
- Affiche wallet + rappel commission 25 FCFA
- Banner "Vérification en attente" si conducteur_verifie = false
- Bouton "Voir les courses" DÉSACTIVÉ visuellement si !conducteur_verifie
  → style : opacity-50 cursor-not-allowed, disabled=true
  → pas de alert() au clic — le bouton ne répond pas
- Liste trips "pending" en temps réel si conducteur_verifie = true
- Anti-double offre : sentOffers empêche de soumettre deux fois
- Wallet temps réel ✅ COMPLÉTÉ (subscription PocketBase sur users/{id})

## Notifications solde wallet
Affichées au chargement de DriverAccueil et à chaque mise à jour du wallet :

| Solde | Notification |
|-------|-------------|
| ≤ 75 FCFA | "Il vous reste ~X courses — pensez à recharger" |
| ≤ 25 FCFA | "Solde minimum atteint — rechargez pour continuer" |
| 0 FCFA | "Compte bloqué — rechargez votre wallet" |

Calcul courses restantes : `Math.floor(walletBalance / 25)`
Affichage : toast in-app + badge rouge sur l'icône wallet

## Contre-offre (à implémenter — spec/encheres.md)
- Boutons rapides : -100 / -50 / +50 / +100 / +200 relatifs au clientPrice
- Champ libre pour montant personnalisé
- Prix minimum : 50 FCFA
- isCounterOffer = true si prix ≠ clientPrice

## DriverMaCourse (src/pages/driver/DriverMaCourse.tsx) ✅ COMPLÉTÉ
- Trip actif en temps réel
- demarrer() → statut "in_progress" → déclenche hook commission
- Wallet rafraîchî après démarrage course ✅ (getOne + useAuthStore.setState)
- terminer() → dialog confirmation natif → statut "completed"
- Notation client à la fin du trip ✅ COMPLÉTÉ

## DriverHistorique (src/pages/driver/DriverHistorique.tsx) ✅ COMPLÉTÉ
- Onglet Courses : Liste trips completed + cancelled
- Calcul totalGagne : finalPrice - 25 par course
- Onglet Transactions : Liste des transactions avec formatage des types (commission, recharge, refund)
- Limitation MVP : max 50 items (pagination post-MVP)

## DriverProfil (src/pages/driver/DriverProfil.tsx) ✅ COMPLÉTÉ
- Badge vérifié / en attente
- Wallet + info commission
- Affichage note moyenne conducteur ✅ COMPLÉTÉ
- Formulaire d'édition de profil (nom, mot de passe) inline ✅ COMPLÉTÉ
- Plaque affichée (optionnelle)
- Lien vers recharge wallet

## Règles wallet
- Wallet = 0 à l'inscription
- 250 FCFA crédités à validation admin (hook backend)
- Minimum 25 FCFA pour voir les courses
- Commission 25 FCFA déduite quand trip → "in_progress"
- Remboursement 25 FCFA si trip annulé après acceptation
- Recharge self-service MTN/MOOV (post-MVP — spec/recharge.md)

## Règles statut conducteur
- conducteur_verifie = false → boutons désactivés visuellement
- conducteur_verifie = true → peut voir et accepter les courses
- walletBalance < 25 → notification bloquante, ne peut pas démarrer de course
- Une seule offre par course autorisée

## Changelog
- [2026-03-14] v1.0 — création initiale
- [2026-03-14] v2.0 — notifications solde ajoutées, bouton désactivé visuellement,
  contre-offre avec boutons rapides, wallet 250F à validation
- [2026-03-14] v2.1 — ajout dialog de confirmation dans DriverMaCourse (terminer)
- [2026-03-17] v2.2 — statut "active" remplacé par "accepte" dans DriverMaCourse
- [2026-03-17] v2.3 — ajout du système de notation client dans DriverMaCourse ✅ COMPLÉTÉ
- [2026-03-17] v2.4 — affichage note moyenne dans DriverProfil et DriverAccueil ✅ COMPLÉTÉ
- [2026-03-17] v2.5 — ajout de l'édition du profil inline et historique transactions ✅ COMPLÉTÉ
- [2026-03-18] v2.6 — wallet temps réel dans DriverAccueil (subscription PocketBase sur l'utilisateur connecté) ✅ COMPLÉTÉ
- [2026-03-18] v2.7 — wallet rafraîchî après démarrage de course dans DriverMaCourse ✅ COMPLÉTÉ
