/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update field
  collection.fields.addAt(16, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1488435581",
    "max": 0,
    "min": 0,
    "name": "plaque",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update field
  collection.fields.addAt(16, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1488435581",
    "max": 0,
    "min": 0,
    "name": "Plaque",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
})
