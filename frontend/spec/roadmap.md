# ROADMAP — SPEC
*Version 1.0 — 2026-03-14*

## Phase MVP (en cours)
Objectif : lancement à Cotonou avec flux core fonctionnel

### Bugs critiques à corriger immédiatement
- [ ] LandingPage : bouton Connexion → /inscription au lieu de /login
- [ ] Hook 4 : anti-doublon crédit bienvenue
- [ ] Hook 3 : calcul totalRating incorrect
- [x] VITE_PB_URL non configuré sur Cloudflare Pages

### Fonctionnalités manquantes MVP
- [x] Bouton annulation course côté client
- [x] Bouton conducteur désactivé visuellement si non vérifié
- [x] Dialog confirmation avant "Terminer la course"
- [x] Notifications solde wallet conducteur
- [x] Contre-offre conducteur avec boutons rapides
- [x] Boutons ajustement prix client (-100/-50/+50/+100/+200)
- [x] Recherche utilisateur dans AdminUsers
- [x] AdminSettings (prix configurables)
- [x] Collection settings + lecture dynamique dans hooks

### Corrections session 2026-03-17
- [x] Statut "active" → "accepte" aligné sur tout le frontend
- [x] Realtime ajouté sur les 4 pages admin
- [x] AdminLitiges filtre statut + optimistic update
- [x] Type Litige aligné schéma PocketBase
- [x] Noms champs settings corrigés (hooks + AdminSettings)
- [x] Hook 4 anti-doublon fonctionnel (champ reference)
- [x] Crash backend tripId supprimé
- [x] Collection settings déployée en production
- [x] Notation mutuelle client ↔ conducteur au statut "completed"

## Phase V2 (post-lancement)
Objectif : amélioration UX + nouvelles fonctionnalités

- [x] PWA complète (manifest, service worker, icônes, bouton installation)
- [x] AdminUserDetail — vue profil complet admin
- [x] Commission dynamique depuis settings
- [x] Expiration courses 10 minutes
- [x] Modification profil (nom, mot de passe)
- [ ] Historique transactions conducteur

## Phase V3 (croissance)
Objectif : expansion et monétisation avancée

- [ ] Multi-zem (nombre_zem = 1 ou 2)
- [ ] Abonnement premium conducteur (500 FCFA/semaine)
- [ ] Simulateur gains conducteur (données réelles)

### Statistiques conducteur
- [ ] Tableau de bord revenus : total gagné par jour/semaine/mois
- [ ] Comparaison revenus avant/après ZEM Connect
- [ ] Nombre de courses par période
- [ ] Revenu moyen par course
- [ ] Disponible en version premium (abonnement 500 FCFA/semaine)

### Types de conducteurs étendus
- [ ] Conducteur solo (actuel — 1 moto)
- [ ] Conducteur avec flotte (plusieurs motos, gestion équipe)
- [ ] Taxi-moto partenaire (conducteur indépendant affilié)
- [ ] Conducteur premium (abonné — commission fixe remplacée par abonnement)
- [ ] Champ supplémentaire sur users : conducteur_type (solo|flotte|partenaire)
- [ ] Notifications push PWA
- [ ] Expansion vers Porto-Novo, Parakou
- [ ] Application native Flutter (iOS + Android)
- [ ] API partenaires (hôtels, aéroports)

### Authentification avancée
- [ ] Séparer connexion admin (email) de connexion utilisateur (téléphone)
- [ ] OAuth2 Google avec validation numéro de téléphone obligatoire post-inscription
- [ ] OTP WhatsApp pour validation compte conducteur

## Principe
Les specs ne sont jamais "finales".
Chaque déploiement peut générer de nouvelles décisions.
Toute modification de comportement → mise à jour de la spec correspondante.

## Changelog
- [2026-03-14] v1.0 — création initiale
- [2026-03-17] v2.0 — corrections MVP finalisées (session)
- [2026-03-17] v2.1 — ajout système de notation mutuelle (conducteur <-> client)
- [2026-03-18] v2.2 — ajout objectifs Authentification avancée (V3)
- [2026-03-18] v2.3
- [2026-03-20] v2.4 — ajout PRD, mise à jour roadmap (stats et types conducteurs) ✅
