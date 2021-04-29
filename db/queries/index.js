const { getLandlords, getLandlordById, createLandlord, updateLandlord, deleteLandlord } = require('./landlord.queries')
const { getProperties, createProperty, updateProperty, deleteProperty } = require('./property.queries')
const { getReviews, createReview } = require('./reviews.queries')

module.exports = {
  getLandlords,
  getLandlordById,
  createLandlord,
  updateLandlord,
  deleteLandlord,
  getProperties,
  createProperty,
  updateProperty,
  deleteProperty,
  getReviews,
  createReview
}