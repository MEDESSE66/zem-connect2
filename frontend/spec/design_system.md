# DESIGN SYSTEM — SPEC

## Couleurs
- Primaire : #F5C518 (jaune moto-taxi)
- Secondaire : #1A1A2E (noir profond)
- Accent : #E85D04 (orange dynamique)
- Succès : #06D6A0
- Danger : #EF233C
- Fond : #F8F9FA
- Texte : #212529

## Police
- Décidée : Inter
- Actuellement installée : Geist (@fontsource-variable/geist)
- À harmoniser : choisir l'une des deux et appliquer partout dans index.css

## Navigation
- Bottom nav sur tous les dashboards (client, conducteur)
- Admin : navigation standard (pas de bottom nav)
- Touch target minimum : 44px (déjà implémenté dans BottomNav.tsx)
- Animations : motion/react (slide-up sur BottomNav)

## Bottom nav — Client (3 onglets)
- Accueil → /client
- Nouvelle Course → /client/nouvelle-course
- Mes Courses → /client/mes-courses
- Profil accessible via lien dans la page Accueil

## Bottom nav — Conducteur (3 onglets)
- Accueil → /driver
- Ma Course → /driver/ma-course
- Historique → /driver/historique
- Profil accessible via lien dans la page Accueil

## Composants clés
- BottomNav.tsx : icons ReactNode (lucide-react), active state, animation
- ProtectedRoute.tsx : contrôle allowedRoles[], redirection /login si non auth
- shadcn/ui : button, card, badge, separator, input, dialog, toast (sonner)

## Mobile-first
- Max width conteneur : max-w-2xl centré
- Padding bottom : pb-24 pour laisser place au bottom nav
- Design optimisé pour écrans 360-430px (smartphones Android Bénin)

## Charte UX
- Langue : français
- Texte boutons : direct et court ("Se connecter", "Accepter", "Terminer")
- États de chargement sur tous les boutons d'action
- Pas de double-clic possible pendant requête en cours
- Optimistic UI sur actions critiques (acceptation offre, changement statut)
