/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // add field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "select1466534506",
    "maxSelect": 1,
    "name": "role",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "client",
      "conducteur",
      "admin"
    ]
  }))

  // add field
  collection.fields.addAt(10, new Field({
    "hidden": false,
    "id": "bool1599779888",
    "name": "isOnline",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // add field
  collection.fields.addAt(11, new Field({
    "hidden": false,
    "id": "bool3003982760",
    "name": "isSuspended",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // add field
  collection.fields.addAt(12, new Field({
    "hidden": false,
    "id": "number718954149",
    "max": null,
    "min": null,
    "name": "walletBalance",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(13, new Field({
    "hidden": false,
    "id": "number3632866850",
    "max": null,
    "min": null,
    "name": "rating",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(14, new Field({
    "hidden": false,
    "id": "number2523879866",
    "max": null,
    "min": null,
    "name": "totalRating",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(15, new Field({
    "hidden": false,
    "id": "select2242645766",
    "maxSelect": 1,
    "name": "subscriptionType",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "none",
      "premium"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // remove field
  collection.fields.removeById("select1466534506")

  // remove field
  collection.fields.removeById("bool1599779888")

  // remove field
  collection.fields.removeById("bool3003982760")

  // remove field
  collection.fields.removeById("number718954149")

  // remove field
  collection.fields.removeById("number3632866850")

  // remove field
  collection.fields.removeById("number2523879866")

  // remove field
  collection.fields.removeById("select2242645766")

  return app.save(collection)
})
