/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4055844874")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.record.role = \"conducteur\"",
    "deleteRule": "@request.auth.record.role = \"admin\"",
    "listRule": "@request.auth.id != \"\"",
    "updateRule": "@request.auth.id = conducteur || @request.auth.record.role = \"admin\"",
    "viewRule": "@request.auth.id != \"\""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4055844874")

  // update collection data
  unmarshal({
    "createRule": "",
    "deleteRule": null,
    "listRule": "",
    "updateRule": "",
    "viewRule": ""
  }, collection)

  return app.save(collection)
})
