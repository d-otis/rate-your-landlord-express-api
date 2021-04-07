const JSONAPISerializer = require('jsonapi-serializer').Serializer

module.exports = new JSONAPISerializer("landlord", {
  attributes: ["id", "name", "rating", "image_url", "created_at", "properties", "reviews"],
  keyForAttribute: "underscore_case",
  properties: {
    ref: "id",
    attributes: ["address", "created_at", "image_url", "rating", "landlord_id", "reviews"],
  },
  reviews: {
    ref: "id",
    attributes: ["content", "rating", "property_id"]
  },
  pluralizeType: false,
  typeForAttribute: (attribute) => {
    switch (attribute) {
      case "properties":
        return "property"
      case "reviews":
        return "review"
      default:
        return undefined
    }
  }
})