const JSONAPISerializer = require('jsonapi-serializer').Serializer

module.exports = new JSONAPISerializer("property", {
  attributes: ["id", "address", "rating", "image_url", "landlord_id", "created_at"],
  keyForAttribute: "underscore_case"
})