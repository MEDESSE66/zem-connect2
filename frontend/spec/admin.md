# ADMIN — SPEC
*Version 2.0 — 2026-03-14*

## Accès
- MVP : dashboard PocketBase natif → https://zem-connect2-pb.fly.dev/_/
- V2 : connexion via app avec email + mot de passe

## AdminStats (src/pages/admin/AdminStats.tsx) ✅ COMPLÉTÉ
- Commissions totales, trips terminés, clients, conducteurs
- Limitation MVP : plafond 1000 transactions (agrégation post-MVP)

## AdminUsers (src/pages/admin/AdminUsers.tsx)
- Filtre : all / client / conducteur
- Recherche par nom ou numéro de téléphone (champ texte)
  → filtre côté frontend sur données chargées
  → placeholder : "Rechercher par nom ou numéro..."
- toggleSuspend() : suspend ou réactive
- validateConducteur() : conducteur_verifie = true → déclenche hook 250 FCFA
- Limitation MVP : max 100 utilisateurs (pagination post-MVP)
⚠️ MANQUANT : champ recherche — à implémenter

## AdminCourses (src/pages/admin/AdminCourses.tsx) ✅ COMPLÉTÉ
- Liste 100 trips, filtre par statut
- Limitation MVP : pas de pagination, pas d'actions admin

## AdminLitiges (src/pages/admin/AdminLitiges.tsx) ✅ COMPLÉTÉ
- resoudre() / rejeter()
⚠️ MANQUANT : filtre par statut, affichage resolved/dismissed

## AdminSettings (à créer)
Page de configuration des paramètres financiers :
- Champ : Commission par course (FCFA) — défaut 25
- Champ : Prix abonnement hebdomadaire (FCFA) — défaut 500
- Champ : Bonus bienvenue conducteur (FCFA) — défaut 250
- Bouton : Sauvegarder → update collection `settings` dans PocketBase
- Les hooks lisent dynamiquement ces valeurs depuis `settings`
- Route : /admin/settings
⚠️ À CRÉER : page + collection settings + mise à jour hooks

## Fonctionnalités post-MVP
- Recharge wallet conducteur manuelle
- Export données CSV
- Statistiques avec graphiques
- Simulateur gains conducteur (données réelles)
- Pagination utilisateurs et courses

## Changelog
- [2026-03-14] v1.0 — création initiale
- [2026-03-14] v2.0 — ajout recherche utilisateur, ajout AdminSettings
  pour prix configurables
