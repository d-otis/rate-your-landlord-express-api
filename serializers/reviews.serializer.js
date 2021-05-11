const JSONAPISerializer = require('jsonapi-serializer').Serializer

module.exports = new JSONAPISerializer("review", {
  attributes: ["id", "content", "rating", "property_id", "created_at", "updated_at"],
  keyForAttribute: "underscore_case",
  pluralizeType: false
})