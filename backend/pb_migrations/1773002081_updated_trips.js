/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1630916145")

  // remove field
  collection.fields.removeById("number730627375")

  // add field
  collection.fields.addAt(14, new Field({
    "hidden": false,
    "id": "date730627375",
    "max": "",
    "min": "",
    "name": "expiresAt",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1630916145")

  // add field
  collection.fields.addAt(13, new Field({
    "hidden": false,
    "id": "number730627375",
    "max": null,
    "min": null,
    "name": "expiresAt",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // remove field
  collection.fields.removeById("date730627375")

  return app.save(collection)
})
