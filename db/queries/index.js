const { getLandlords, getLandlordById } = require('./landlord.queries')
const { getProperties } = require('./property.queries')

module.exports = {
  getLandlords,
  getLandlordById,
  getProperties
}