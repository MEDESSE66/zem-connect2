# ZEM CONNECT — CLAUDE.md FRONTEND
*Version 2.0 — 2026-03-14*

## Stack exact
- React 19 + TypeScript + Vite
- Zustand (authStore uniquement)
- react-router-dom v7
- shadcn/ui (preset Nova) + Tailwind v4
- motion/react v12
- PocketBase JS SDK

## Skill obligatoire — UI
Lire /mnt/skills/public/frontend-design/SKILL.md AVANT toute modification
ou création d'interface utilisateur. Sans exception.

## Fichiers critiques — ne pas modifier sans instruction explicite
- src/store/authStore.ts
- src/lib/pocketbase.ts
- src/App.tsx

## Routing complet (src/App.tsx)
/ → LandingPage (public)
/login → Login (public)
/inscription → Inscription (public)
/client → ClientAccueil (ProtectedRoute: ["client"])
/client/nouvelle-course → ClientNouvelleCourse
/client/mes-courses → ClientMesCourses
/client/profil → ClientProfil
/driver → DriverAccueil (ProtectedRoute: ["conducteur"])
/driver/ma-course → DriverMaCourse
/driver/historique → DriverHistorique
/driver/profil → DriverProfil
/admin → AdminStats (ProtectedRoute: ["admin"])
/admin/utilisateurs → AdminUsers
/admin/courses → AdminCourses
/admin/litiges → AdminLitiges
/admin/settings → AdminSettings (à créer)
/admin/utilisateurs/:id → AdminUserDetail (ProtectedRoute: ["admin"])
* → Navigate /login

## authStore — fonctions disponibles
- login(phone, password)
- register(phone, password, name, role, extraData?)
- logout()
- checkAuth() — appelé au montage App.tsx

## pocketbase.ts
- Instance unique : `pb`
- URL : VITE_PB_URL || "http://127.0.0.1:8090"
- Tous les appels PB : `{ requestKey: null }`

## Règles de code obligatoires
- Pas de StrictMode
- requestKey: null sur tous les appels PB
- useEffect avec garde `if (!user?.id) return` sur les subscribes
- Unsubscribe dans le return du useEffect
- Loading state sur tous les boutons d'action
- Pas de double-clic pendant requête
- Placeholders explicites sur tous les champs (voir CLAUDE.md racine)
- Optimistic UI sur actions critiques

## Règle mise à jour specs
Après chaque modification de fichier → mettre à jour la spec correspondante
avec changelog daté.

## Lire avant de modifier
- spec/bugs_critiques.md → corrections prioritaires
- spec/[domaine].md → comportement attendu
- spec/design_system.md → cohérence visuelle
- spec/encheres.md → logique boutons prix

## Changelog
- [2026-03-14] v1.0 — création initiale
- [2026-03-14] v2.0 — ajout skill frontend-design, route /admin/settings,
  règles placeholders, règle mise à jour specs
- [2026-03-18] v2.1 — route AdminUserDetail ajoutée
