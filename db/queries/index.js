const { getLandlords, getLandlordById, createLandlord } = require('./landlord.queries')
const { getProperties } = require('./property.queries')
const { getReviews } = require('./reviews.queries')

module.exports = {
  getLandlords,
  getLandlordById,
  createLandlord,
  getProperties,
  getReviews
}