const JSONAPISerializer = require('jsonapi-serializer').Serializer

module.exports = new JSONAPISerializer("property", {
  attributes: ["id", "address", "rating", "image_url", "landlord_id", "created_at", "reviews"],
  keyForAttribute: "underscore_case",
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