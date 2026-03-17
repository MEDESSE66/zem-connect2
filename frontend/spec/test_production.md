# TEST END-TO-END PRODUCTION — ZEM CONNECT
*Version 1.0 — 2026-03-17*

## URL Production
- Frontend : https://zem-connect-frontend.pages.dev
- Backend : https://zem-connect2-pb.fly.dev/_/

## Comptes de test requis
- 1 compte client (déjà créé : deploiclient@gmail.com)
- 1 compte conducteur vérifié avec wallet > 25 FCFA
- 1 compte admin (deploiadmin@gmail.com)

## CHECKLIST — À cocher dans l'ordre

### BLOC 1 — Authentification
- [ ] Login client → redirige vers /client
- [ ] Login conducteur → redirige vers /driver
- [ ] Login admin → redirige vers /admin
- [ ] Déconnexion fonctionne sur les 3 rôles
- [ ] Inscription nouveau client → auto-login → redirige /client
- [ ] Inscription nouveau conducteur → conducteur_verifie = false → bouton désactivé

### BLOC 2 — Validation conducteur
- [ ] Admin → AdminUsers → bouton "Valider" sur conducteur non vérifié
- [ ] Après validation : conducteur_verifie = true dans PocketBase
- [ ] Wallet conducteur crédité 250 FCFA automatiquement
- [ ] Transaction "bienvenue" créée dans PocketBase
- [ ] Pas de double crédit si on re-valide

### BLOC 3 — Création course
- [ ] Client → Nouvelle Course → GPS détecté (ou message erreur propre)
- [ ] Remplir départ, destination, prix
- [ ] Boutons +50/-50/+100/-100 fonctionnent avec plancher 50 FCFA
- [ ] Créer course → statut "pending" dans PocketBase
- [ ] Redirection vers /client/mes-courses

### BLOC 4 — Offre conducteur
- [ ] Conducteur voit la course en temps réel dans DriverAccueil
- [ ] Boutons contre-offre fonctionnent
- [ ] Soumettre offre → offre créée dans PocketBase
- [ ] Anti-double offre : bouton désactivé après envoi
- [ ] Client voit l'offre en temps réel dans ClientMesCourses

### BLOC 5 — Acceptation et démarrage
- [ ] Client accepte offre → statut trip "accepte"
- [ ] Conducteur voit la course dans DriverMaCourse
- [ ] Bouton "Démarrer" visible si statut "accepte"
- [ ] Démarrer → statut "in_progress"
- [ ] Commission 25 FCFA déduite du wallet conducteur
- [ ] Transaction "commission" créée dans PocketBase

### BLOC 6 — Fin de course
- [ ] Conducteur → bouton "Terminer" → dialog confirmation
- [ ] Confirmer → statut "completed"
- [ ] Dialog notation apparaît côté conducteur (noter le client)
- [ ] Dialog notation apparaît côté client (noter le conducteur)
- [ ] Notation enregistrée dans PocketBase
- [ ] rating et totalRating mis à jour sur le profil noté
- [ ] Pas de double notation si on revient sur la page

### BLOC 7 — Annulation
- [ ] Client peut annuler une course "pending"
- [ ] Client peut annuler une course "accepte"
- [ ] Client NE PEUT PAS annuler une course "in_progress"
- [ ] Si annulation après acceptation : remboursement 25 FCFA conducteur
- [ ] Transaction "refund" créée dans PocketBase

### BLOC 8 — Admin
- [ ] AdminStats affiche données correctes sans F5
- [ ] AdminUsers liste les utilisateurs en temps réel
- [ ] Recharge manuelle wallet conducteur fonctionne
- [ ] AdminCourses filtre par statut fonctionne
- [ ] AdminLitiges filtre par statut fonctionne
- [ ] AdminSettings sauvegarde les valeurs correctement
- [ ] Après sauvegarde : hooks utilisent les nouvelles valeurs

### BLOC 9 — Profils
- [ ] DriverProfil affiche wallet, note, plaque
- [ ] ClientProfil affiche wallet, note
- [ ] Modification nom fonctionne
- [ ] Modification mot de passe fonctionne
- [ ] DriverHistorique affiche courses et transactions

### BLOC 10 — Edge cases
- [ ] Conducteur avec wallet = 0 : ne peut pas démarrer de course
- [ ] Conducteur non vérifié : boutons désactivés visuellement
- [ ] Course expirée après 2 minutes si aucune offre
- [ ] Utilisateur suspendu : ne peut plus se connecter

## Résultats
| Bloc | Items | Passés | Échoués |
|------|-------|--------|---------|
| Auth | 6 | | |
| Validation | 5 | | |
| Création course | 6 | | |
| Offre | 5 | | |
| Acceptation | 6 | | |
| Fin de course | 7 | | |
| Annulation | 5 | | |
| Admin | 8 | | |
| Profils | 5 | | |
| Edge cases | 4 | | |
| **TOTAL** | **57** | | |

## Bugs découverts
<!-- Documenter ici chaque bug trouvé pendant les tests -->

## Changelog
- [2026-03-17] v1.0 — création initiale
