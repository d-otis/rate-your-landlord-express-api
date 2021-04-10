const { getLandlords, getLandlordById, createLandlord, deleteLandlord } = require('./landlord.queries')
const { getProperties } = require('./property.queries')
const { getReviews } = require('./reviews.queries')

module.exports = {
  getLandlords,
  getLandlordById,
  createLandlord,
  deleteLandlord,
  getProperties,
  getReviews
}