/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1630916145")

  // add field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "number1247995397",
    "max": null,
    "min": null,
    "name": "destinationLat",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "number12292411082",
    "max": null,
    "min": null,
    "name": "destinationLng",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(10, new Field({
    "hidden": false,
    "id": "number2276507300",
    "max": null,
    "min": null,
    "name": "clientPrice",
    "onlyInt": false,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(11, new Field({
    "hidden": false,
    "id": "number2500782983",
    "max": null,
    "min": null,
    "name": "finalPrice",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(12, new Field({
    "hidden": false,
    "id": "number479369857",
    "max": null,
    "min": null,
    "name": "distance",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

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

  // add field
  collection.fields.addAt(14, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1179130906",
    "max": 0,
    "min": 0,
    "name": "cancelReason",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // update field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "number1229241108",
    "max": null,
    "min": null,
    "name": "departureLng",
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
  collection.fields.removeById("number1247995397")

  // remove field
  collection.fields.removeById("number12292411082")

  // remove field
  collection.fields.removeById("number2276507300")

  // remove field
  collection.fields.removeById("number2500782983")

  // remove field
  collection.fields.removeById("number479369857")

  // remove field
  collection.fields.removeById("number730627375")

  // remove field
  collection.fields.removeById("text1179130906")

  // update field
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
})
