const { getLandlords, getLandlordById, createLandlord, updateLandlord, deleteLandlord } = require('./landlord.queries')
const { getProperties, createProperty } = require('./property.queries')
const { getReviews } = require('./reviews.queries')

module.exports = {
  getLandlords,
  getLandlordById,
  createLandlord,
  updateLandlord,
  deleteLandlord,
  getProperties,
  createProperty,
  getReviews
}