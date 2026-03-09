/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3174063690")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.record.role = \"admin\"",
    "deleteRule": "@request.auth.record.role = \"admin\"",
    "listRule": "@request.auth.record.role = \"admin\" || @request.auth.id = user",
    "updateRule": "@request.auth.record.role = \"admin\"",
    "viewRule": "@request.auth.record.role = \"admin\" || @request.auth.id = user"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3174063690")

  // update collection data
  unmarshal({
    "createRule": null,
    "deleteRule": null,
    "listRule": null,
    "updateRule": null,
    "viewRule": null
  }, collection)

  return app.save(collection)
})
