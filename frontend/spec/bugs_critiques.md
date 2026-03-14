# BUGS CRITIQUES — SPEC
*Version 2.0 — 2026-03-14*

## BUG 1 — LandingPage boutons inversés ✅ COMPLÉTÉ
Fichier : src/pages/LandingPage.tsx
Problème : bouton "Connexion" navigue vers /inscription au lieu de /login
Solution : inverser navigate() aux lignes L58 et L64
Impact : bloque les utilisateurs existants

## BUG 2 — Hook 4 anti-doublon crédit bienvenue 🔴 CRITIQUE
Fichier : backend/pb_hooks/main.pb.js
Problème : hook vérifie conducteur_verifie = true sur tout update
  Si autre champ mis à jour → re-crédit possible
Solution : vérifier transaction note="bienvenue" inexistante avant crédit
  (voir spec/hooks.md Hook 4 pour le code exact)
Impact : financier direct — argent crédité en double

## BUG 3 — VITE_PB_URL non configuré Cloudflare Pages 🔴 CRITIQUE
Localisation : Cloudflare Pages → Settings → Environment Variables
Problème : app production pointe sur localhost:8090
Solution : ajouter VITE_PB_URL = https://zem-connect2-pb.fly.dev
Impact : app non fonctionnelle en production

## BUG 4 — Hook 3 calcul totalRating incorrect 🔴 CRITIQUE
Fichier : backend/pb_hooks/main.pb.js
Problème : calcul exclut la nouvelle notation du filtre puis la rajoute
  manuellement — logique fragile, totalRating peut être incorrect
Solution : inclure toutes les notations dans le filtre et calculer directement
  (voir spec/hooks.md Hook 3 pour le code exact)
Impact : notes conducteurs incorrectes

## BUG 5 — DriverAccueil bouton non désactivé visuellement 🟡 MOYEN
Fichier : src/pages/driver/DriverAccueil.tsx
Problème : conducteur non-vérifié peut cliquer → alert() au clic
Solution : disabled={!user?.conducteur_verifie} + opacity-50 cursor-not-allowed
Impact : mauvaise UX

## BUG 6 — import React en bas de LandingPage 🟢 MINEUR
Fichier : src/pages/LandingPage.tsx ligne L298
Solution : déplacer import React en haut du fichier
Impact : fonctionne mais non conventionnel

## BUG 7 — Police Geist vs Inter 🟢 MINEUR
Fichier : package.json + index.css
Problème : Geist installée, Inter définie dans specs
Solution : choisir l'une et appliquer partout dans index.css
Impact : incohérence visuelle mineure

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
