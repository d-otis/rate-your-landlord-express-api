const JSONAPISerializer = require('jsonapi-serializer').Serializer

module.exports = new JSONAPISerializer("review", {
  attributes: ["id", "content", "rating", "property_id"],
  keyForAttribute: "underscore_case",
  pluralizeType: false
})