// HOOK 1 — Déduction commission au démarrage de course
onRecordAfterUpdateSuccess((e) => {
    e.next()
    const record = e.record
    if (record.collection().name !== "trips") return
    if (record.get("status") !== "in_progress") return

    let commission = 25
    try {
        const settings = $app.findRecordsByFilter("settings", "1=1", "", 1, 0)
        if (settings.length > 0) commission = settings[0].get("commission_amount") || 25
    } catch {}

    const conducteurId = record.get("conducteur")
    if (!conducteurId) return

    const conducteur = $app.findRecordById("users", conducteurId)
    const currentBalance = conducteur.get("walletBalance")
    if (currentBalance < commission) return

    conducteur.set("walletBalance", currentBalance - commission)
    $app.save(conducteur)

    const transactionsCollection = $app.findCollectionByNameOrId("transactions")
    const transaction = new Record(transactionsCollection)
    transaction.set("user", conducteurId)
    transaction.set("type", "commission")
    transaction.set("amount", commission)
    transaction.set("trip", record.id)
    transaction.set("status", "completed")
    $app.save(transaction)
})

// HOOK 2 — Remboursement commission si course annulée après acceptation
onRecordAfterUpdateSuccess((e) => {
    e.next()
    const record = e.record
    if (record.collection().name !== "trips") return
    if (record.get("status") !== "cancelled") return

    let commission = 25
    try {
        const settings = $app.findRecordsByFilter("settings", "1=1", "", 1, 0)
        if (settings.length > 0) commission = settings[0].get("commission_amount") || 25
    } catch {}

    const conducteurId = record.get("conducteur")
    if (!conducteurId) return

    const conducteur = $app.findRecordById("users", conducteurId)
    const currentBalance = conducteur.get("walletBalance")

    conducteur.set("walletBalance", currentBalance + commission)
    $app.save(conducteur)

    const transactionsCollection = $app.findCollectionByNameOrId("transactions")
    const transaction = new Record(transactionsCollection)
    transaction.set("user", conducteurId)
    transaction.set("type", "refund")
    transaction.set("amount", commission)
    transaction.set("trip", record.id)
    transaction.set("status", "completed")
    $app.save(transaction)
})

// HOOK 3 — Calcul note moyenne conducteur
onRecordAfterCreateSuccess((e) => {
    e.next()
    const record = e.record
    if (record.collection().name !== "notations") return

    const targetId = record.get("target")
    if (!targetId) return

    const allNotations = $app.findRecordsByFilter(
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

    const target = $app.findRecordById("users", targetId)
    target.set("rating", avgRating)
    target.set("totalRating", total)
    $app.save(target)
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
    } catch(e) {
        console.error("Erreur CRON expiration:", e)
    }
})

// HOOK 4 — Crédit bienvenue à la validation admin (anti-doublon strict)
onRecordAfterUpdateSuccess((e) => {
    e.next()
    const record = e.record
    if (record.collection().name !== "users") return
    if (record.get("role") !== "conducteur") return
    if (!record.get("conducteur_verifie")) return

    // Vérification stricte anti-doublon
    let alreadyCredited = false
    try {
        const existing = $app.findFirstRecordByFilter(
            "transactions",
            `user = "${record.id}" && reference = "bienvenue"`
        )
        if (existing) alreadyCredited = true
    } catch(e) {
        // Non trouvé = normal, on continue
        alreadyCredited = false
    }
    if (alreadyCredited) return

    // Créer la transaction IMMÉDIATEMENT avant de modifier le wallet
    // pour bloquer tout re-déclenchement
    let bonus = 250
    try {
        const settings = $app.findRecordsByFilter("settings", "1=1", "", 1, 0)
        if (settings.length > 0) bonus = settings[0].get("welcome_bonus") || 250
    } catch {}

    const transactionsCollection = $app.findCollectionByNameOrId("transactions")
    const transaction = new Record(transactionsCollection)
    transaction.set("user", record.id)
    transaction.set("type", "recharge")
    transaction.set("amount", bonus)
    transaction.set("reference", "bienvenue")
    transaction.set("status", "completed")
    $app.save(transaction)

    // Modifier le wallet APRÈS avoir créé la transaction
    const freshUser = $app.findRecordById("users", record.id)
    const currentBalance = parseFloat(freshUser.get("walletBalance")) || 0
    freshUser.set("walletBalance", currentBalance + bonus)
    $app.save(freshUser)
})