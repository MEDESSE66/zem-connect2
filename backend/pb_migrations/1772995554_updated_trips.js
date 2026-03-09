/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1630916145")

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "select2063623452",
    "maxSelect": 1,
    "name": "status",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "pending",
      "active",
      "in_progress",
      "completed",
      "cancelled",
      "expired"
    ]
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1505115522",
    "max": 0,
    "min": 0,
    "name": "depatureAddress",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1630916145")

  // remove field
  collection.fields.removeById("select2063623452")

  // remove field
  collection.fields.removeById("text1505115522")

  return app.save(collection)
})
