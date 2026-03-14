# ENCHÈRES — SPEC
*Version 1.0 — 2026-03-14*

## Concept
Système d'enchères bidirectionnel :
- Client propose un prix initial
- Conducteur accepte le prix ou contre-propose
- Client accepte l'offre de son choix

## Boutons enchère rapide — Conducteur (contre-offre)
Affichés sur chaque course visible dans DriverAccueil.
Boutons relatifs au prix proposé par le client :

| Bouton | Action |
|--------|--------|
| -100 | prix - 100 FCFA |
| -50 | prix - 50 FCFA |
| +50 | prix + 50 FCFA |
| +100 | prix + 100 FCFA |
| +200 | prix + 200 FCFA |
| Champ libre | saisie montant exact |

Contraintes :
- Prix résultant ne peut pas être inférieur à 0 → boutons -50/-100 désactivés si résultat ≤ 0
- Prix résultant ne peut pas être inférieur à 50 FCFA (minimum acceptable)
- isCounterOffer = true si prix différent du clientPrice
- isCounterOffer = false si conducteur accepte le prix exact du client
- Un conducteur ne peut soumettre qu'une seule offre par course

## Boutons enchère rapide — Client (ajustement prix)
Affichés dans ClientNouvelleCourse pour ajuster le prix proposé.
Même logique que conducteur :

| Bouton | Action |
|--------|--------|
| -100 | prix - 100 FCFA |
| -50 | prix - 50 FCFA |
| +50 | prix + 50 FCFA |
| +100 | prix + 100 FCFA |
| +200 | prix + 200 FCFA |
| Champ libre | saisie montant exact |

Contraintes :
- Prix minimum : 50 FCFA
- Prix maximum : aucun (libre marché)
- Boutons -50/-100 désactivés si résultat < 50

## Affichage offres côté client (ClientMesCourses)
Pour chaque offre reçue :
- Nom du conducteur
- Prix proposé
- Badge "Contre-offre" si isCounterOffer = true
- Badge "Prix accepté" si isCounterOffer = false
- Bouton "Choisir" → acceptOffre()

## Flux complet
1. Client crée course avec prix initial
2. Conducteur voit la course → utilise boutons rapides ou champ libre
3. Client voit toutes les offres en temps réel
4. Client choisit une offre → course acceptée
5. Commission 25 FCFA déduite au démarrage

## Post-MVP — Multi-zem
- nombre_zem : 1 ou 2 (champ sur trips)
- Si nombre_zem = 2 : deux conducteurs peuvent accepter la même course
- Commission = 25 FCFA × nombre_zem
- Cas d'usage : client avec bagages lourds

## Changelog
- [2026-03-14] v1.0 — création initiale
