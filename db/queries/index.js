const { getLandlords, getLandlordById, createLandlord, updateLandlord, deleteLandlord } = require('./landlord.queries')
const { getProperties, getPropertyById, createProperty, updateProperty, deleteProperty } = require('./property.queries')
const { getReviews, createReview, updateReview } = require('./reviews.queries')

module.exports = {
  getLandlords,
  getLandlordById,
  createLandlord,
  updateLandlord,
  deleteLandlord,
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getReviews,
  createReview,
  updateReview
}