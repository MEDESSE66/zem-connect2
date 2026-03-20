# CLIENT — SPEC

## ClientAccueil (src/pages/client/ClientAccueil.tsx) ✅ COMPLÉTÉ
- Affiche nom utilisateur
- Raccourcis : Nouvelle Course, Mes Courses
- Stats affichées : "Délai moyen 2 min", "Conducteurs Vérifiés"
  ⚠️ Stats statiques — non calculées depuis BD (acceptable MVP)
- Déconnexion disponible
- Lien vers /client/profil

## ClientNouvelleCourse (src/pages/client/ClientNouvelleCourse.tsx) ✅ COMPLÉTÉ — GPS manquant
- Champs : adresse départ, adresse destination, prix proposé (FCFA)
- Crée un trip en BD avec statut "pending"
- expiresAt = now + 10 minutes
- Redirection vers /client/mes-courses après création
- GPS departureLat/Lng ✅ COMPLÉTÉ (partiel — départ uniquement, destination post-MVP)
- Post-MVP : intégrer API autocomplete adresses

## ClientMesCourses (src/pages/client/ClientMesCourses.tsx) ✅ COMPLÉTÉ
- Liste toutes les courses du client
- Pour chaque course "pending" : charge et affiche les offres reçues
- Realtime subscriptions : trips + offres
- acceptOffre() : update offre (est_choisi=true) + trip (statut="accepte", conducteur=id)
- annulerCourse() : update trip (statut="cancelled") disponible si pending ou accepte

## ClientProfil (src/pages/client/ClientProfil.tsx) ✅ COMPLÉTÉ
- Avatar initiales
- Infos : téléphone, rôle, wallet balance
- Affichage note moyenne client ✅ COMPLÉTÉ
- Formulaire d'édition de profil (nom, mot de passe) inline ✅ COMPLÉTÉ
- Déconnexion

## Flux course client complet
1. Crée course → statut "pending"
2. Voit les offres des conducteurs en temps réel
3. Accepte une offre → statut exact : "accepte"
4. Course démarre → statut "in_progress" (déclenché par conducteur)
5. Course terminée → statut "completed" (déclenché par conducteur)
6. Notation conducteur ✅ COMPLÉTÉ

## Règles
- Un client ne peut pas annuler une course déjà "in_progress"
- Un client peut annuler une course "pending" ou "accepte" (avant démarrage)

## Changelog
- [2026-03-14] v1.0 — création initiale
- [2026-03-14] v1.1 — ajout bouton annulerCourse dans ClientMesCourses
- [2026-03-17] v2.0 — alignement statut des courses acceptées sur la valeur exacte "accepte" (au lieu de "active").
- [2026-03-17] v2.1 — implémentation complet du système de notation conducteur ✅ COMPLÉTÉ
- [2026-03-17] v2.2 — affichage note moyenne dans ClientProfil ✅ COMPLÉTÉ
- [2026-03-17] v2.3 — ajout de l'édition du profil inline (nom, mot de passe) ✅ COMPLÉTÉ
- [2026-03-17] v2.4 — implémentation de la géolocalisation pour l'adresse de départ dans ClientNouvelleCourse ✅ COMPLÉTÉ
- [2026-03-18] v2.5 — expiration des courses augmentée à 10 minutes ✅
- [2026-03-20] v2.6 — ajout du filtre expiresAt > @now pour les courses pending ✅
- [2026-03-20] v2.7 — ajout des badges statut colorés et dates de création ✅
- [2026-03-20] v2.8 — checkAndShowRating déplacée au scope composant dans ClientMesCourses ✅
- [2026-03-20] v2.9 — Intégration carte Leaflet avec marqueur draggable départ ✅
- [2026-03-20] v3.0 — Fix filtre loadTrips — suppression condition expiresAt incompatible avec PocketBase ✅
