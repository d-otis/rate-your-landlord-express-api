const mongoose = require('mongoose')
const { landlordSchema, propertySchema, reviewSchema } = require('./schemas')

const Landlord = mongoose.model("Landlord", landlordSchema)
const Property = mongoose.model("Property", propertySchema)
const Review = mongoose.model("Review", reviewSchema)

module.exports = {
  Landlord,
  Property,
  Review
}