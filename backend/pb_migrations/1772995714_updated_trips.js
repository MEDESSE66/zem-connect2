/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1630916145")

  // add field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "number3154799171",
    "max": null,
    "min": null,
    "name": "departureLat",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "number1229241108",
    "max": null,
    "min": null,
    "name": "destinationLng",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1630916145")

  // remove field
  collection.fields.removeById("number3154799171")

  // remove field
  collection.fields.removeById("number1229241108")

  return app.save(collection)
})
