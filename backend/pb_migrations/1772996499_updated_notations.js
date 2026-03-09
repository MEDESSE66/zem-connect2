/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4282525412")

  // add field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1630916145",
    "hidden": false,
    "id": "relation1985410363",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "trip",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "_pb_users_auth_",
    "hidden": false,
    "id": "relation3182418120",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "author",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "cascadeDelete": false,
    "collectionId": "_pb_users_auth_",
    "hidden": false,
    "id": "relation1181691900",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "target",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "number848901969",
    "max": null,
    "min": null,
    "name": "score",
    "onlyInt": false,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2490651244",
    "max": 0,
    "min": 0,
    "name": "comment",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4282525412")

  // remove field
  collection.fields.removeById("relation1985410363")

  // remove field
  collection.fields.removeById("relation3182418120")

  // remove field
  collection.fields.removeById("relation1181691900")

  // remove field
  collection.fields.removeById("number848901969")

  // remove field
  collection.fields.removeById("text2490651244")

  return app.save(collection)
})
