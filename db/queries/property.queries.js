const pool = require('../pool')
const PropertySerializer = require('../../serializers/properties.serializer')

const getProperties = (request, response) => {
  pool.query("SELECT * FROM properties ORDER BY created_at DESC", (error, results) => {
    if (error) {
      throw error
    }
    const jsonapi = PropertySerializer.serialize(results.rows)
    response.status(200).send(jsonapi)
  })
}

module.exports = {
  getProperties
}