const JSONAPISerializer = require('jsonapi-serializer').Serializer

module.exports = new JSONAPISerializer("landlord", {
  attributes: ["id", "name", "rating", "image_url", "created_at"],
})