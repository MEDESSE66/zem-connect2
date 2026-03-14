# HOOKS POCKETBASE — SPEC
*Version 2.0 — 2026-03-14*

## Règles critiques PocketBase v0.36.5
- `e.next()` EN PREMIER dans tous les handlers onRecordAfter*
- `e.app` dans les handlers (jamais `$app` dans les handlers)
- `$app` uniquement dans les callbacks cronAdd
- Jamais throw dans AfterSuccess → console.error uniquement
- `$app.findRecordsByFilter()` (findAllRecords n'existe pas)
- `$app.findFirstRecordByFilter()` pour trouver un seul enregistrement
- `$app.findRecordById(collection, id)` pour trouver par ID
- `$app.save(record)` pour sauvegarder

## Lecture prix depuis settings — OBLIGATOIRE
Tous les hooks utilisant des montants financiers doivent lire
depuis la collection `settings` au lieu de valeurs codées en dur :

```javascript
const settings = $app.findFirstRecordByFilter("settings", "id != ''")
const COMMISSION = settings ? settings.get("commission_amount") : 25
const WELCOME_BONUS = settings ? settings.get("welcome_bonus") : 250
```

## Hook 1 — Commission
Déclencheur : onRecordAfterUpdateSuccess sur trips
Condition : status passe à "in_progress"
Montant : lu depuis settings.commission_amount (défaut 25)
Action : walletBalance conducteur - COMMISSION + transaction type="commission"

## Hook 2 — Remboursement
Déclencheur : onRecordAfterUpdateSuccess sur trips
Condition : status passe à "cancelled" ET conducteur assigné
Montant : lu depuis settings.commission_amount (défaut 25)
Action : walletBalance conducteur + COMMISSION + transaction type="refund"

## Hook 3 — Note moyenne conducteur (BUG CORRIGÉ)
Déclencheur : onRecordAfterCreateSuccess sur notations
Bug précédent : calcul excluait la nouvelle notation puis la rajoutait manuellement
Correction : inclure TOUTES les notations dans le filtre (y compris la nouvelle)
et calculer la moyenne directement

```javascript
// CORRECT
const notations = $app.findRecordsByFilter(
  "notations",
  `target = "${notation.target}"`
)
const total = notations.reduce((sum, n) => sum + n.get("score"), 0)
const average = total / notations.length
conducteur.set("rating", Math.round(average * 10) / 10)
conducteur.set("totalRating", notations.length)
```

## Hook 4 — Crédit bienvenue (ANTI-DOUBLON OBLIGATOIRE)
Déclencheur : onRecordAfterUpdateSuccess sur users
Condition : conducteur_verifie passe à true ET role = "conducteur"
Montant : lu depuis settings.welcome_bonus (défaut 250)

Anti-doublon OBLIGATOIRE avant tout crédit :
```javascript
try {
  const existing = $app.findFirstRecordByFilter(
    "transactions",
    `user = "${user.id}" && note = "bienvenue"`
  )
  if (existing) return // déjà crédité — on arrête
} catch(e) {
  // enregistrement non trouvé = normal, on continue
}
```

Action : walletBalance + WELCOME_BONUS + transaction type="recharge" note="bienvenue"

## Hook 5 — Expiration courses
Déclencheur : cronAdd toutes les 2 minutes
Action : trips status="pending" créés > 2 minutes → status="expired"
Utilise $app (correct dans cron — pas de contexte e)

## Hook 6 — Notification solde faible (NOUVEAU)
Déclencheur : onRecordAfterUpdateSuccess sur users
Condition : walletBalance change ET role = "conducteur"
Action : créer une notification in-app selon seuil :
- walletBalance ≤ 75 : type="warning" message="~X courses restantes"
- walletBalance ≤ 25 : type="danger" message="Solde minimum atteint"
- walletBalance = 0 : type="blocked" message="Compte bloqué"
Note : nécessite collection `notifications` (à créer)

## Déploiement
Commande : `flyctl deploy --no-cache` (depuis backend/)
Vérification : `flyctl logs -a zem-connect2-pb`
JAMAIS : `flyctl launch`

## Changelog
- [2026-03-14] v1.0 — création initiale
- [2026-03-14] v2.0 — lecture dynamique depuis settings, correction bug
  totalRating hook 3, anti-doublon hook 4, ajout hook 6 notifications solde
