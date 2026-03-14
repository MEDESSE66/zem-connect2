# SKILLS — SPEC
*Version 1.0 — 2026-03-14*

## Définition
Les skills sont des fichiers de meilleures pratiques que l'agent
doit lire AVANT d'exécuter certaines tâches.
Chemin racine des skills : /mnt/skills/public/

---

## Skill frontend-design
Chemin : /mnt/skills/public/frontend-design/SKILL.md
Lire AVANT :
- Toute création ou modification de page
- Tout ajout de composant UI
- Tout travail sur les formulaires, boutons, cartes, navigation
- Toute modification de CSS ou Tailwind

## Skill docx
Chemin : /mnt/skills/public/docx/SKILL.md
Lire AVANT :
- Génération de documentation Word
- Création de contrats conducteurs
- Rapports export admin

## Skill pdf
Chemin : /mnt/skills/public/pdf/SKILL.md
Lire AVANT :
- Export de rapports en PDF
- Génération de reçus de transaction
- Documentation technique exportable

## Skill xlsx
Chemin : /mnt/skills/public/xlsx/SKILL.md
Lire AVANT :
- Export données conducteurs en Excel
- Rapports financiers admin
- Tableaux de bord statistiques

---

## Matrice skills par tâche

| Tâche | Skill à lire |
|-------|-------------|
| Modifier LandingPage | frontend-design |
| Modifier Login / Inscription | frontend-design |
| Modifier Dashboard client | frontend-design |
| Modifier Dashboard conducteur | frontend-design |
| Modifier Dashboard admin | frontend-design |
| Ajouter boutons enchère | frontend-design |
| Créer AdminSettings | frontend-design |
| Modifier hooks PocketBase | hooks.md (spec) |
| Modifier collections PB | collections.md (spec) |
| Exporter rapport Word | docx |
| Exporter rapport PDF | pdf |
| Exporter données Excel | xlsx |

---

## Règle d'application
L'agent ne doit JAMAIS modifier un fichier d'interface sans avoir
d'abord lu /mnt/skills/public/frontend-design/SKILL.md dans la session.
Si le skill a déjà été lu dans la session en cours, pas besoin de le relire.

## Changelog
- [2026-03-14] v1.0 — création initiale
