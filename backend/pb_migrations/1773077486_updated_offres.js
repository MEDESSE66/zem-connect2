/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4055844874")

  // update collection data
  unmarshal({
    "updateRule": "@request.auth.id != \"\""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4055844874")

  // update collection data
  unmarshal({
    "updateRule": "@request.auth.id = conducteur || @request.auth.record.role = \"admin\""
  }, collection)

  return app.save(collection)
})
