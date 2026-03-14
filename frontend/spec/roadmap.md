# ROADMAP — SPEC
*Version 1.0 — 2026-03-14*

## Phase MVP (en cours)
Objectif : lancement à Cotonou avec flux core fonctionnel

### Bugs critiques à corriger immédiatement
- [ ] LandingPage : bouton Connexion → /inscription au lieu de /login
- [ ] Hook 4 : anti-doublon crédit bienvenue
- [ ] Hook 3 : calcul totalRating incorrect
- [ ] VITE_PB_URL non configuré sur Cloudflare Pages

### Fonctionnalités manquantes MVP
- [ ] Bouton annulation course côté client
- [ ] Bouton conducteur désactivé visuellement si non vérifié
- [ ] Dialog confirmation avant "Terminer la course"
- [ ] Notifications solde wallet conducteur
- [ ] Contre-offre conducteur avec boutons rapides
- [ ] Boutons ajustement prix client (-100/-50/+50/+100/+200)
- [ ] Recherche utilisateur dans AdminUsers
- [ ] Page AdminSettings (prix configurables)
- [ ] Collection settings + lecture dynamique dans hooks

## Phase V2 (post-lancement)
Objectif : amélioration UX + nouvelles fonctionnalités

- [ ] Géolocalisation GPS (navigator.geolocation)
- [ ] Système de notation (UI — backend déjà prêt)
- [ ] Recharge wallet MTN/MOOV (FedaPay API)
- [ ] OTP WhatsApp (360dialog)
- [ ] OAuth2 Google
- [ ] Pagination AdminUsers et AdminCourses
- [ ] Modification profil (nom, mot de passe)
- [ ] Historique transactions conducteur

## Phase V3 (croissance)
Objectif : expansion et monétisation avancée

- [ ] Multi-zem (nombre_zem = 1 ou 2)
- [ ] Abonnement premium conducteur (500 FCFA/semaine)
- [ ] Simulateur gains conducteur (données réelles)
- [ ] Notifications push PWA
- [ ] Expansion vers Porto-Novo, Parakou
- [ ] Application native Flutter (iOS + Android)
- [ ] API partenaires (hôtels, aéroports)

## Principe
Les specs ne sont jamais "finales".
Chaque déploiement peut générer de nouvelles décisions.
Toute modification de comportement → mise à jour de la spec correspondante.

## Changelog
- [2026-03-14] v1.0 — création initiale
