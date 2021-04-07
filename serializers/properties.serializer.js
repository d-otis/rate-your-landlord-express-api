const JSONAPISerializer = require('jsonapi-serializer').Serializer
const { pluralFix } = require('../db/util')

module.exports = new JSONAPISerializer("property", {
  attributes: ["id", "address", "rating", "image_url", "landlord_id", "created_at", "reviews"],
  keyForAttribute: "underscore_case",
  reviews: {
    ref: "id",
    attributes: ["content", "rating", "property_id"]
  },
  pluralizeType: false,
  typeForAttribute: pluralFix
})