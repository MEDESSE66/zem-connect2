# ARCHITECTURE — SPEC
*Version 1.0 — 2026-03-14*

## Structure dossiers frontend
```
frontend/
├── CLAUDE.md
├── spec/
│   ├── overview.md
│   ├── architecture.md (ce fichier)
│   ├── authentication.md
│   ├── design_system.md
│   ├── encheres.md
│   ├── client.md
│   ├── conducteur.md
│   ├── admin.md
│   ├── bugs_critiques.md
│   ├── recharge.md (post-MVP)
│   ├── securite.md
│   └── roadmap.md
├── src/
│   ├── App.tsx              ← routing uniquement
│   ├── main.tsx             ← point d'entrée
│   ├── index.css            ← variables CSS globales
│   ├── lib/
│   │   └── pocketbase.ts    ← instance PB unique
│   ├── store/
│   │   └── authStore.ts     ← Zustand auth uniquement
│   ├── types/
│   │   └── index.ts         ← tous les types TypeScript
│   ├── components/
│   │   ├── ui/              ← composants shadcn
│   │   ├── BottomNav.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── ErrorBoundary.tsx
│   └── pages/
│       ├── LandingPage.tsx
│       ├── Login.tsx
│       ├── Inscription.tsx
│       ├── client/
│       ├── driver/
│       └── admin/
```

## Structure dossiers backend
```
backend/
├── CLAUDE.md
├── spec/
│   ├── collections.md
│   ├── hooks.md
│   ├── api_rules.md
│   └── securite.md
├── pb_hooks/
│   └── main.pb.js       ← tous les hooks en un seul fichier
├── pb_migrations/       ← migrations de schéma
├── pb_data/             ← données (ne pas versionner)
├── Dockerfile
└── fly.toml             ← NE PAS MODIFIER MANUELLEMENT
```

## Flux de données principal
```
Client crée course
    ↓
PocketBase (trips collection)
    ↓ realtime subscribe
Conducteur voit la course (DriverAccueil)
    ↓
Conducteur soumet offre (offres collection)
    ↓ realtime subscribe
Client voit l'offre (ClientMesCourses)
    ↓
Client accepte → trips.status = "accepte"
    ↓
Conducteur démarre → trips.status = "in_progress"
    ↓ Hook 1
Commission 25 FCFA déduite du wallet
    ↓
Conducteur termine → trips.status = "completed"
```

## Interactions entre collections
- users ← trips (client, conducteur)
- trips ← offres (trip)
- trips ← transactions (trip)
- users ← transactions (user)
- users ← notations (auteur, target)
- trips ← litiges (trip)
- settings ← hooks (lecture prix)

## Stratégie realtime
- Subscriptions PocketBase sur : trips, offres
- Toujours unsubscribe dans le return du useEffect
- requestKey: null sur tous les appels pour éviter l'autocancellation
- Optimistic UI sur : acceptation offre, changement statut course

## Variables d'environnement
Frontend (.env local + Cloudflare Pages) :
- VITE_PB_URL=https://zem-connect2-pb.fly.dev

Backend (Fly.io secrets) :
- Aucun secret requis au MVP (PocketBase gère l'auth nativement)

## Déploiement
Frontend : git push → GitHub → Cloudflare Pages (automatique)
Backend : flyctl deploy --no-cache (manuel depuis backend/)

## Changelog
- [2026-03-14] v1.0 — création initiale
