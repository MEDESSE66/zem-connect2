# SÉCURITÉ — SPEC
*Version 1.0 — 2026-03-14*

## État actuel MVP
- API Rules PocketBase : toutes vides (accès libre authentifié)
- Raison : `@request.auth.record.role` cause erreur SQL en v0.36.5
- Contournement actuel : `@request.auth.id != ""`

## Règles à implémenter post-MVP

### Collection users
- Lecture : `@request.auth.id != ""`
- Modification : `@request.auth.id = id` (un user ne modifie que son propre profil)
- Suppression : admin uniquement

### Collection trips
- Création : `@request.auth.id != ""`
- Lecture : `@request.auth.id = client || @request.auth.id = conducteur`
- Modification statut : règles complexes selon rôle

### Collection offres
- Création : conducteur vérifié uniquement
- Lecture : conducteur de l'offre ou client du trip concerné

### Collection transactions
- Lecture seule : `@request.auth.id = user`
- Création : hooks uniquement (pas via API directe)

### Collection settings
- Lecture : authentifié
- Modification : admin uniquement

## Vulnérabilités connues MVP (acceptées temporairement)
1. N'importe quel utilisateur authentifié peut lire toutes les collections
2. Pas de rate limiting sur les appels API
3. Pas de validation serveur des rôles (uniquement côté frontend via ProtectedRoute)

## Mesures compensatoires MVP
- ProtectedRoute côté frontend bloque l'accès par rôle
- Hooks backend valident les opérations financières
- Pas de données sensibles exposées (pas de CB, pas de localisation stockée)

## Post-MVP priorités sécurité
1. Corriger API Rules PocketBase avec bonne syntaxe v0.36.5
2. Rate limiting sur création trips et offres
3. Validation numéro de téléphone côté backend
4. Audit logs sur transactions financières

## Changelog
- [2026-03-14] v1.0 — création initiale
