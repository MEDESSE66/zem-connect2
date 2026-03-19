# ZEM CONNECT — CLAUDE.md BACKEND

## Infrastructure
- PocketBase v0.36.5
- Fly.io app : zem-connect2-pb
- URL : https://zem-connect2-pb.fly.dev
- Admin : https://zem-connect2-pb.fly.dev/_/
- Dossier local : C:\Projects\Zem-Connect2\backend

## Déploiement
- Commande UNIQUE : `flyctl deploy --no-cache`
- JAMAIS : `flyctl launch` (écrase fly.toml)
- Logs : `flyctl logs -a zem-connect2-pb`
- Migrations : COPY pb_migrations dans Dockerfile obligatoire

## Fichier hooks
- Chemin : backend/pb_hooks/main.pb.js
- Modification → redéploiement avec --no-cache obligatoire

## Règles PocketBase v0.36.5 — CRITIQUES
- `e.next()` EN PREMIER dans onRecordAfter*
- `e.app` dans handlers (pas `$app`)
- `$app` uniquement dans cronAdd callbacks
- `$app.findRecordsByFilter()` (pas findAllRecords — n'existe pas)
- `$app.findFirstRecordByFilter()` pour trouver un seul enregistrement
- `$app.findRecordById(collection, id)` pour trouver par ID
- `$app.save(record)` pour sauvegarder
- Jamais `throw` dans AfterSuccess → `console.error` uniquement

## Lire avant de modifier
- spec/hooks.md → comportement attendu de chaque hook
- spec/collections.md → schéma exact des collections

## Variables d'environnement Cloudflare Pages
VITE_PB_URL = https://zem-connect2-pb.fly.dev
(À configurer dans Cloudflare Pages → Settings → Environment Variables)

## Changelog
- [2026-03-18] v1.1 — Hook 4 anti-doublon strict, transaction avant wallet
