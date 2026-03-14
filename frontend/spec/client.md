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
- expiresAt = now + 2 minutes
- Redirection vers /client/mes-courses après création
⚠️ MANQUANT : coordonnées GPS (departureLat/Lng/destinationLat/Lng = 0)
- Post-MVP : intégrer navigator.geolocation ou API autocomplete adresses

## ClientMesCourses (src/pages/client/ClientMesCourses.tsx) ✅ COMPLÉTÉ — annulation manquante
- Liste toutes les courses du client
- Pour chaque course "pending" : charge et affiche les offres reçues
- Realtime subscriptions : trips + offres
- acceptOffre() : update offre (est_choisi=true) + trip (statut=accepte, conducteur=id)
⚠️ MANQUANT : bouton "Annuler la course" pour trips en statut pending
  Solution : pb.collection("trips").update(id, { status: "cancelled" })

## ClientProfil (src/pages/client/ClientProfil.tsx) ✅ COMPLÉTÉ
- Avatar initiales
- Infos : téléphone, rôle, wallet balance
- Déconnexion
⚠️ MANQUANT : modification nom et mot de passe (post-MVP)

## Flux course client complet
1. Crée course → statut "pending"
2. Voit les offres des conducteurs en temps réel
3. Accepte une offre → statut "accepte"
4. Course démarre → statut "in_progress" (déclenché par conducteur)
5. Course terminée → statut "completed" (déclenché par conducteur)
6. Notation conducteur → post-MVP

## Règles
- Un client ne peut pas annuler une course déjà "in_progress"
- Un client peut annuler une course "pending" ou "accepte"
