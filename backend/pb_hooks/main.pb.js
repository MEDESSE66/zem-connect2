// HOOK 1 — Déduction commission à l'acceptation de l'offre
onRecordAfterUpdateSuccess((e) => {
  e.next()

  if (e.collection.name !== "trips") return

  const newStatus = e.record.get("status")
  const oldStatus = e.oldRecord.get("status")

  // Déclencher UNIQUEMENT sur la transition → "accepte"
  if (newStatus !== "accepte" || oldStatus === "accepte") return

  try {
    // Récupérer le settings
    const settings = e.app.findFirstRecordByFilter("settings", "id != ''")
    const commission = settings.get("commission_amount") || 25

    // Récupérer le conducteur via l'offre acceptée
    const tripId = e.record.id
    const offre = e.app.findFirstRecordByFilter(
      "offres",
      `trip = "${tripId}" && status = "accepted"`
    )
    if (!offre) return

    const conducteurId = offre.get("conducteur")
    const conducteur = e.app.findRecordById("users", conducteurId)
    if (!conducteur) return

    const currentBalance = conducteur.get("walletBalance") || 0

    // Créer la transaction AVANT de modifier le wallet (anti-boucle)
    const transactionsCollection = e.app.findCollectionByNameOrId("transactions")
    const transaction = new Record(transactionsCollection)
    transaction.set("user", conducteurId)
    transaction.set("amount", -commission)
    transaction.set("type", "debit")
    transaction.set("reference", "commission")
    transaction.set("trip", tripId)
    e.app.save(transaction)

    // Déduire du wallet
    conducteur.set("walletBalance", currentBalance - commission)
    e.app.save(conducteur)

  } catch (err) {
    e.app.logger().error("Hook commission accepte", "error", err)
  }
})

// HOOK 2 — Remboursement commission si course annulée après acceptation
onRecordAfterUpdateSuccess((e) => {
  e.next()
  if (e.collection.name !== "trips") return

  const newStatus = e.record.get("status")
  const oldStatus = e.oldRecord.get("status")

  // Déclencher UNIQUEMENT sur la transition → "cancelled"
  if (newStatus !== "cancelled" || oldStatus === "cancelled") return

  try {
    let commission = 25
    const settings = e.app.findFirstRecordByFilter("settings", "id != ''")
    if (settings) commission = settings.get("commission_amount") || 25

    const tripId = e.record.id
    const offre = e.app.findFirstRecordByFilter(
      "offres",
      `trip = "${tripId}" && status = "accepted"`
    )
    if (!offre) return

    const conducteurId = offre.get("conducteur")
    const conducteur = e.app.findRecordById("users", conducteurId)
    if (!conducteur) return

    const currentBalance = conducteur.get("walletBalance") || 0

    const transactionsCollection = e.app.findCollectionByNameOrId("transactions")
    const transaction = new Record(transactionsCollection)
    transaction.set("user", conducteurId)
    transaction.set("type", "refund")
    transaction.set("amount", commission)
    transaction.set("reference", "remboursement")
    transaction.set("trip", tripId)
    e.app.save(transaction)

    conducteur.set("walletBalance", currentBalance + commission)
    e.app.save(conducteur)

  } catch (err) {
    e.app.logger().error("Hook remboursement cancelled", "error", err)
  }
})

// HOOK 3 — Calcul note moyenne
onRecordAfterCreateSuccess((e) => {
  e.next()
  if (e.collection.name !== "notations") return

  const targetId = e.record.get("target")
  if (!targetId) return

  try {
    const allNotations = e.app.findRecordsByFilter(
      "notations",
      "target = {:targetId}",
      "-created",
      1000,
      0,
      { targetId: targetId }
    )

    const total = allNotations.length
    if (total === 0) return

    let sum = 0
    for (const n of allNotations) {
      sum += parseFloat(n.get("score")) || 0
    }
    const avgRating = Math.round((sum / total) * 10) / 10

    const target = e.app.findRecordById("users", targetId)
    target.set("rating", avgRating)
    target.set("totalRating", total)
    e.app.save(target)
  } catch (err) {
    e.app.logger().error("Hook notation moyenne", "error", err)
  }
})

// CRON GLOBAL — Expiration des courses pending toutes les minutes
cronAdd("expire_pending_trips", "* * * * *", () => {
  try {
    const trips = $app.findRecordsByFilter(
      "trips",
      "status = 'pending' && expiresAt != '' && expiresAt <= @now",
      "-created",
      100,
      0
    )
    for (const trip of trips) {
      trip.set("status", "expired")
      $app.save(trip)
    }
  } catch (err) {
    console.error("Erreur CRON expiration:", err)
  }
})

// HOOK 4 — Crédit bienvenue à la validation admin (anti-doublon strict)
onRecordAfterUpdateSuccess((e) => {
  e.next()
  if (e.collection.name !== "users") return
  if (e.record.get("role") !== "conducteur") return
  if (!e.record.get("conducteur_verifie")) return

  // Vérification stricte anti-doublon
  let alreadyCredited = false
  try {
    const existing = e.app.findFirstRecordByFilter(
      "transactions",
      `user = "${e.record.id}" && reference = "bienvenue"`
    )
    if (existing) alreadyCredited = true
  } catch (err) {
    alreadyCredited = false
  }
  if (alreadyCredited) return

  try {
    let bonus = 250
    const settings = e.app.findFirstRecordByFilter("settings", "id != ''")
    if (settings) bonus = settings.get("welcome_bonus") || 250

    const transactionsCollection = e.app.findCollectionByNameOrId("transactions")
    const transaction = new Record(transactionsCollection)
    transaction.set("user", e.record.id)
    transaction.set("type", "recharge")
    transaction.set("amount", bonus)
    transaction.set("reference", "bienvenue")
    transaction.set("status", "completed")
    e.app.save(transaction)

    const freshUser = e.app.findRecordById("users", e.record.id)
    const currentBalance = parseFloat(freshUser.get("walletBalance")) || 0
    freshUser.set("walletBalance", currentBalance + bonus)
    e.app.save(freshUser)
  } catch (err) {
    e.app.logger().error("Hook credit bienvenue", "error", err)
  }
})