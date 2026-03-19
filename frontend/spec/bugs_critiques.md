# BUGS CRITIQUES — SPEC
*Version 2.0 — 2026-03-14*

## BUG 1 — LandingPage boutons inversés ✅ COMPLÉTÉ
Fichier : src/pages/LandingPage.tsx
Problème : bouton "Connexion" navigue vers /inscription au lieu de /login
Solution : inverser navigate() aux lignes L58 et L64
Impact : bloque les utilisateurs existants

## BUG 2 — Hook 4 anti-doublon crédit bienvenue ✅ COMPLÉTÉ
Fichier : backend/pb_hooks/main.pb.js
Problème : hook vérifie conducteur_verifie = true sur tout update
  Si autre champ mis à jour → re-crédit possible
Solution : vérifier transaction reference="bienvenue" inexistante avant crédit
Impact : financier direct — argent crédité en double

## BUG 3 — VITE_PB_URL non configuré Cloudflare Pages ✅ COMPLÉTÉ
Localisation : Cloudflare Pages → Settings → Environment Variables
Problème : app production pointe sur localhost:8090
Solution : ajouter VITE_PB_URL = https://zem-connect2-pb.fly.dev
Impact : app non fonctionnelle en production

## BUG 4 — Hook 3 calcul totalRating incorrect ✅ COMPLÉTÉ
Fichier : backend/pb_hooks/main.pb.js
Problème : calcul basé sur champs stockés potentiellement corrompus
Solution : recalcul depuis toutes les notations en BD (findRecordsByFilter)
Impact : notes conducteurs incorrectes

## BUG 5 — DriverAccueil bouton non désactivé visuellement ✅ COMPLÉTÉ
Fichier : src/pages/driver/DriverAccueil.tsx
Solution : disabled={alreadySent || !user?.conducteur_verifie} + style gris + label "Compte non vérifié"

## BUG 6 — import React en bas de LandingPage ✅ COMPLÉTÉ
Fichier : src/pages/LandingPage.tsx
Solution : import React déplacé ligne 1

## BUG 7 — Police Geist vs Inter ✅ COMPLÉTÉ
Fichier : index.css + package.json
Solution : import Google Fonts Inter, --font-sans mis à jour, package Geist désinstallé

## BUG 8 — Noms champs settings incorrects dans hooks ✅ CORRIGÉ
Problème : Les hooks et le frontend utilisaient `commission`, `bonus_bienvenue`, `prix_abonnement`.
Solution : Remplacé par `commission_amount`, `welcome_bonus`, `subscription_price`.

## BUG 9 — Champ reference vs note dans transactions ✅ CORRIGÉ
Problème : Incohérence dans Hook 4 anti-doublon et création de transaction.
Solution : Utiliser `reference = 'bienvenue'`.

## BUG 10 — Type Litige incorrect ✅ CORRIGÉ
Problème : Le type Litige TypeScript ne correspondait pas au schéma réel.
Solution : Remplacé par le bon schéma avec `auteur` et `resolution`.

## BUG 11 — Wallet bonus boucle infinie ✅ CORRIGÉ [2026-03-18]
Problème : hook 4 se déclenchait sur tout update users → boucle
Solution : transaction créée AVANT wallet, findFirstRecordByFilter strict

## BUG 12 — Clavier numérique absent ✅ CORRIGÉ [2026-03-18]
Solution : inputMode="numeric" sur Login, Inscription, DriverAccueil

## BUG 13 — Session perdue au refresh ✅ CORRIGÉ [2026-03-18]
Solution : isAuthReady gate + authRefresh dans checkAuth async

## BUG 14 — Acceptation offre erreur 400 ✅ CORRIGÉ [2026-03-18]
Solution : "accepte" ajouté dans trips.status PocketBase schema

## BUG 15 — Recharge wallet message erreur faux ✅ CORRIGÉ [2026-03-18]
Solution : Promise.all pour atomicité update + create transaction

## Ordre de correction recommandé
1. BUG 3 (VITE_PB_URL) — 2 minutes, Cloudflare dashboard
2. BUG 1 (LandingPage) — 2 lignes de code
3. BUG 4 (totalRating) — hook backend
4. BUG 2 (anti-doublon) — hook backend
5. BUG 5 (bouton désactivé) — frontend
6. BUG 6 et 7 — quand on passe sur les fichiers concernés

## Changelog
- [2026-03-14] v1.0 — création initiale
- [2026-03-14] v2.0 — ajout BUG 4 totalRating, réorganisation par priorité,
  bonus bienvenue corrigé à 250 FCFA
- [2026-03-14] v3.0 — BUG 1 corrigé (LandingPage navigate)
- [2026-03-14] v3.1 — BUG 4 corrigé (Hook 4 recalcul depuis BD)
- [2026-03-14] v3.3 — BUG 5 corrigé (DriverAccueil bouton désactivé visuellement)
- [2026-03-14] v3.4 — BUG 6 corrigé (import React déplacé en haut LandingPage)
- [2026-03-17] v4.0 — BUG 3 VITE_PB_URL complété. BUG 8 (noms champs settings), BUG 9 (champ reference transactions), BUG 10 (type Litige) corrigés.
- [2026-03-18] v4.1 — bugs session 2026-03-18 ajoutés
