# ZEM CONNECT — CLAUDE.md RACINE
*Version 2.0 — 2026-03-14*

## Projet
Application VTC moto-taxi (zémidjan) au Bénin.
Marché cible : Cotonou, Calavi, Porto-Novo, Ouidah, Parakou.
Contexte terrain : réseau 2G/3G, utilisateurs peu alphabétisés, WhatsApp universel.

## Stack
- Frontend : React 19 + TypeScript + Vite + Zustand + react-router-dom v7
- UI : shadcn/ui (preset Nova) + Tailwind v4 + motion/react v12
- Backend : PocketBase v0.36.5 sur Fly.io
- Déploiement : Cloudflare Pages (frontend) + Fly.io (backend)

## URLs production
- Frontend : https://zem-connect-frontend.pages.dev
- Backend : https://zem-connect2-pb.fly.dev
- Admin PB : https://zem-connect2-pb.fly.dev/_/

## Dossiers
- Frontend : C:\Projects\Zem-Connect2\frontend
- Backend : C:\Projects\Zem-Connect2\backend

## Règles absolues de travail
- Une modification à la fois — attendre confirmation avant de continuer
- Ne jamais modifier authStore.ts, pocketbase.ts, App.tsx sans instruction explicite
- Ne jamais relancer `flyctl launch` — écrase fly.toml
- Toujours `flyctl deploy --no-cache` pour le backend
- Lire les fichiers spec/ concernés avant toute modification de page
- Source de vérité produit : spec/PRD.md

## Règle mise à jour specs — OBLIGATOIRE
Après chaque modification de fichier de code, mettre à jour la spec correspondante :
- Ajouter une ligne dans le changelog de la spec
- Marquer les fonctionnalités comme ✅ COMPLÉTÉ ou ⚠️ PARTIEL
- Format : `## Changelog\n- [DATE] description de la modification`

## Règle anticipation — OBLIGATOIRE
Avant d'exécuter une instruction, signaler toute décision qui pourrait créer
un problème futur (performance, sécurité, cohérence données, UX).
Ne pas attendre que le problème survienne.

## Règle placeholders — OBLIGATOIRE
Chaque champ de formulaire doit avoir un placeholder explicite en français.
Exemples :
- Téléphone : "01 XX XX XX XX"
- Départ : "Ex: Marché Dantokpa"
- Prix : "Ex: 500"
- Plaque : "Ex: AB 123 CD"
- Nom : "Ex: Koffi Mensah"

## Skills à utiliser
- Frontend UI : lire /mnt/skills/public/frontend-design/SKILL.md avant toute modification d'interface
- Documents : lire /mnt/skills/public/docx/SKILL.md pour documentation Word
- PDF : lire /mnt/skills/public/pdf/SKILL.md pour exports PDF
