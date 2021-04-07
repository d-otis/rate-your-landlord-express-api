const { getLandlords, getLandlordById } = require('./landlord.queries')
const { getProperties } = require('./property.queries')
const { getReviews } = require('./reviews.queries')

module.exports = {
  getLandlords,
  getLandlordById,
  getProperties,
  getReviews
}