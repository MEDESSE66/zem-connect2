// HOOK 1 — Déduction commission 25 FCFA
onRecordAfterUpdateSuccess((e) => {
    e.next()
    const record = e.record
    if (record.collection().name !== "trips") return
    if (record.get("status") !== "in_progress") return

    const conducteurId = record.get("conducteur")
    if (!conducteurId) return

    const conducteur = $app.findRecordById("users", conducteurId)
    const currentBalance = conducteur.get("walletBalance")

    if (currentBalance < 25) return

    conducteur.set("walletBalance", currentBalance - 25)
    $app.save(conducteur)

    const transactionsCollection = $app.findCollectionByNameOrId("transactions")
    const transaction = new Record(transactionsCollection)
    transaction.set("user", conducteurId)
    transaction.set("type", "commission")
    transaction.set("amount", 25)
    transaction.set("trip", record.id)
    transaction.set("status", "completed")
    $app.save(transaction)
})

// HOOK 2 — Remboursement 25 FCFA annulation client
onRecordAfterUpdateSuccess((e) => {
    e.next()
    const record = e.record
    if (record.collection().name !== "trips") return
    if (record.get("status") !== "cancelled") return

    const conducteurId = record.get("conducteur")
    if (!conducteurId) return

    const conducteur = $app.findRecordById("users", conducteurId)
    const currentBalance = conducteur.get("walletBalance")

    conducteur.set("walletBalance", currentBalance + 25)
    $app.save(conducteur)

    const transactionsCollection = $app.findCollectionByNameOrId("transactions")
    const transaction = new Record(transactionsCollection)
    transaction.set("user", conducteurId)
    transaction.set("type", "refund")
    transaction.set("amount", 25)
    transaction.set("trip", record.id)
    transaction.set("status", "completed")
    $app.save(transaction)
})

// HOOK 3 — Expiration automatique des courses
onRecordAfterCreateSuccess((e) => {
    e.next()
    const record = e.record
    if (record.collection().name !== "trips") return

    const tripId = record.id
    const expiresAt = record.get("expiresAt")
    if (!expiresAt) return

    cronAdd(`expire_trip_${tripId}`, "* * * * *", () => {
        try {
            const trip = $app.findRecordById("trips", tripId)
            if (trip.get("status") !== "pending") {
                cronRemove(`expire_trip_${tripId}`)
                return
            }

            const now = new Date()
            const expiry = new Date(expiresAt)

            if (now >= expiry) {
                trip.set("status", "expired")
                $app.save(trip)
                cronRemove(`expire_trip_${tripId}`)
            }
        } catch {
            cronRemove(`expire_trip_${tripId}`)
        }
    })
})
// HOOK 4 — Calcul note moyenne conducteur
onRecordAfterCreateSuccess((e) => {
    e.next()
    const record = e.record
    if (record.collection().name !== "notations") return

    const targetId = record.get("target")
    if (!targetId) return

    const target = $app.findRecordById("users", targetId)

    const currentRating = parseFloat(target.get("rating")) || 0
    const currentTotal = parseInt(target.get("totalRating")) || 0
    const newScore = parseFloat(record.get("score"))

    console.log("currentRating:", currentRating)
    console.log("currentTotal:", currentTotal)
    console.log("newScore:", newScore)

    const newTotal = currentTotal + 1
    const newRating = ((currentRating * currentTotal) + newScore) / newTotal

    console.log("newTotal:", newTotal)
    console.log("newRating:", newRating)

    target.set("rating", Math.round(newRating * 10) / 10)
    target.set("totalRating", newTotal)
    $app.save(target)
})
// CRON GLOBAL — Expiration des courses toutes les minutes
cronAdd("expire_pending_trips", "* * * * *", () => {
    const now = new Date().toISOString()
    const trips = $app.findRecordsByFilter(
        "trips",
        "status = 'pending' && expiresAt != '' && expiresAt <= {:now}",
        "-created",
        100,
        0,
        { now: now }
    )
    for (const trip of trips) {
        trip.set("status", "expired")
        $app.save(trip)
    }
})
// HOOK 5 — Wallet bienvenue 200 FCFA après validation admin
onRecordAfterUpdateSuccess((e) => {
    e.next()
    const record = e.record
    if (record.collection().name !== "users") return
    if (record.get("role") !== "conducteur") return

    const wasVerified = e.oldRecord && !e.oldRecord.get("conducteur_verifie")
    const isNowVerified = record.get("conducteur_verifie") === true
    if (!wasVerified || !isNowVerified) return

    const currentBalance = record.get("walletBalance") || 0
    record.set("walletBalance", currentBalance + 200)
    $app.save(record)

    const transactionsCollection = $app.findCollectionByNameOrId("transactions")
    const transaction = new Record(transactionsCollection)
    transaction.set("user", record.id)
    transaction.set("type", "recharge")
    transaction.set("amount", 200)
    transaction.set("status", "completed")
    $app.save(transaction)
})
