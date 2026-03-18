# ADMIN — SPEC
*Version 2.0 — 2026-03-14*

## Accès
- MVP : dashboard PocketBase natif → https://zem-connect2-pb.fly.dev/_/
- V2 : connexion via app avec email + mot de passe

## AdminStats (src/pages/admin/AdminStats.tsx) ✅ COMPLÉTÉ
- Commissions totales, trips terminés, clients, conducteurs
- Limitation MVP : plafond 1000 transactions (agrégation post-MVP)
- realtime ✅ COMPLÉTÉ

## AdminUsers (src/pages/admin/AdminUsers.tsx)
- Filtre : all / client / conducteur
- Recherche par nom ou numéro de téléphone (champ texte)
  → filtre côté frontend sur données chargées
  → placeholder : "Rechercher par nom ou numéro..."
- toggleSuspend() : suspend ou réactive
- validateConducteur() : conducteur_verifie = true → déclenche hook 250 FCFA
- Recherche par nom (matchName u.name) ✅ et par téléphone (matchPhone u.phone) ✅
- Navigation params settings : navigate("/admin/settings") ✅
- Pagination AdminUsers : non applicable — recherche frontend incompatible, limite 100
- realtime ✅ COMPLÉTÉ

## AdminCourses (src/pages/admin/AdminCourses.tsx) ✅ COMPLÉTÉ
- Pagination AdminCourses ✅ COMPLÉTÉ
- filtre par statut
- realtime ✅ COMPLÉTÉ

## AdminLitiges (src/pages/admin/AdminLitiges.tsx) ✅ COMPLÉTÉ
- resoudre() / rejeter()
- filtre statut ✅ COMPLÉTÉ, affichage resolved/dismissed ✅ COMPLÉTÉ, realtime ✅ COMPLÉTÉ

## AdminSettings (src/pages/admin/AdminSettings.tsx) ✅ COMPLÉTÉ
Page de configuration des paramètres financiers :
- Champ : Commission par course (FCFA) — défaut 25
- Champ : Prix abonnement hebdomadaire (FCFA) — défaut 500
- Champ : Bonus bienvenue conducteur (FCFA) — défaut 250
- Bouton : Sauvegarder → update/create collection `settings` dans PocketBase
- Les hooks lisent dynamiquement ces valeurs (via `$app.findRecordsByFilter`)
- Noms champs corrigés ✅ COMPLÉTÉ
- Route : /admin/settings

## Fonctionnalités post-MVP
- Recharge wallet conducteur manuelle ✅ COMPLÉTÉ
- Export données CSV
- Statistiques avec graphiques
- Simulateur gains conducteur (données réelles)

## Changelog
- [2026-03-14] v1.0 — création initiale
- [2026-03-14] v2.0 — ajout recherche utilisateur, ajout AdminSettings
  pour prix configurables
- [2026-03-14] v2.1 — implémentation de la barre de recherche dans AdminUsers
- [2026-03-17] v3.0 — AdminLitiges : filtre statut et realtime ajoutés. AdminStats, AdminUsers, AdminCourses enrichis en realtime. AdminSettings : noms champs alignés au backend.
- [2026-03-17] v3.1 — Ajout de la recharge manuelle du wallet conducteur dans AdminUsers. ✅ COMPLÉTÉ
- [2026-03-17] v3.2 — Pagination AdminUsers et AdminCourses (20 items par page) ✅ COMPLÉTÉ
- [2026-03-18] v3.3 — Confirmation recherche nom ✅, settings nav ✅, inputMode numeric Login/Inscription ✅
