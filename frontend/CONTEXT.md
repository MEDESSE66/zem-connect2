# ZEM CONNECT — CONTEXTE FRONTEND

## Infrastructure
- Backend production : https://zem-connect2-pb.fly.dev
- Frontend production : https://zem-connect-frontend.pages.dev
- Dossier local : C:\Projects\Zem-Connect2\frontend
- Stack : React 18 + TypeScript + Vite + Zustand + react-router-dom
- UI : shadcn/ui (preset Nova + Radix) + Tailwind v4
- Auth : PocketBase authStore via Zustand

## Charte graphique
- Primaire : #F5C518 (jaune moto-taxi)
- Secondaire : #1A1A2E (noir profond)
- Accent : #E85D04 (orange dynamique)
- Succès : #06D6A0
- Danger : #EF233C
- Fond : #F8F9FA
- Police : Inter

## Structure des fichiers
```
src/
  lib/
    pocketbase.ts              ← instance PocketBase + URL fallback local/prod
  store/
    authStore.ts               ← Zustand : login, logout, register, checkAuth
  types/
    index.ts                   ← tous les types TypeScript (User, Trip, Offre...)
  components/
    ui/                        ← composants shadcn (button, input, label, badge...)
    BottomNav.tsx              ← navigation bottom bar mobile-first
  pages/
    LandingPage.tsx            ← Landing page (v0.2)
    Login.tsx                  ← Connexion par numéro de téléphone (v0.3)
    Inscription.tsx            ← Inscription client + stepper conducteur
    client/
      ClientAccueil.tsx        ← Dashboard client accueil (v0.4)
      ClientNouvelleCourse.tsx ← Formulaire nouvelle course
      ClientMesCourses.tsx     ← Liste courses + offres reçues
    driver/
      DriverAccueil.tsx        ← Dashboard conducteur + bannière validation (v0.5)
      DriverMaCourse.tsx       ← Course active en cours
      DriverHistorique.tsx     ← Historique + gains
    admin/
      AdminStats.tsx           ← Stats globales (v0.6)
      AdminUsers.tsx           ← Gestion utilisateurs + suspension
      AdminCourses.tsx         ← Liste toutes courses
      AdminLitiges.tsx         ← Litiges ouverts + résolution
  App.tsx                      ← BrowserRouter + Routes
  main.tsx                     ← Point d'entrée (StrictMode retiré)
```

## Routing
- / → LandingPage
- /login → Login
- /inscription → Inscription
- /client → ClientAccueil
- /client/nouvelle-course → ClientNouvelleCourse
- /client/mes-courses → ClientMesCourses
- /driver → DriverAccueil
- /driver/ma-course → DriverMaCourse
- /driver/historique → DriverHistorique
- /admin → AdminStats
- /admin/utilisateurs → AdminUsers
- /admin/courses → AdminCourses
- /admin/litiges → AdminLitiges

## Navigation bottom nav
- Client : Accueil / Mes Courses
- Conducteur : Accueil / Ma Course / Historique
- Admin : Stats / Utilisateurs / Courses / Litiges

## Authentification
- Identifiant principal : numéro de téléphone (format béninois : 01XXXXXXXX)
- Email généré automatiquement : +229XXXXXXXXXX@zemconnect.app
- Rôle choisi à l'inscription — immuable après création
- Rôles : client | conducteur | admin (admin créé manuellement uniquement)
- Redirection post-login selon rôle : /client | /driver | /admin

## Règles métier frontend
- requestKey: null sur tous les appels pb.collection()
- useEffect avec garde if (!user?.id) return sur tous les subscribes
- Loading state sur tous les boutons d'action
- Pas de double-clic possible pendant requête en cours
- Optimistic UI sur actions critiques
- Rôle affiché et accès contrôlé selon authStore.user.role

## Inscription conducteur
- Étape 1 : numéro de téléphone + nom complet + mot de passe
- Étape 2 : numéro de plaque
- conducteur_verifie = false par défaut
- Bannière "en attente de validation" sur DriverAccueil tant que conducteur_verifie = false
- 200 FCFA crédités automatiquement après validation admin (hook backend)

## Tags Git
- v0.2 : Landing page
- v0.3 : Login page
- v0.4 : Dashboard client complet
- v0.5 : Dashboard conducteur complet
- v0.6 : Dashboard admin complet
- v1.0 : Déployé en production Cloudflare Pages

## Règles de travail avec Cline
- Une modification à la fois
- Confirmation avant chaque écriture de fichier
- Ne suppose rien — pose une question si information manquante
- Toujours vérifier le fichier existant avant de le modifier
- Tester visuellement chaque composant avant de passer au suivant
- Commits par fonctionnalité terminée et validée
- Tu met à jours le CONTEXT.md à chaque fonctionnalité et étape terminé et validé