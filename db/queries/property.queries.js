const pool = require('../pool')
const PropertySerializer = require('../../serializers/properties.serializer')
const { serverError } = require('../util')

const getProperties = (request, response) => {
  pool.query("SELECT * FROM properties ORDER BY created_at DESC", (error, results) => {
    if (error) {
      throw error
    }
    const properties = results.rows

    console.log(`getProperties() returning ${results.rowCount} records`)

    pool.query("SELECT * FROM reviews ORDER BY created_at DESC", (error, results) => {
      const reviews = results.rows
      console.log(`reviews returned ${results.rowCount} records`)
      const propertiesResult = properties.map(property => {
        return {...property, reviews: []}
      })
      
      reviews.forEach(review => {
        const idx = propertiesResult.findIndex(property => property.id === review.property_id)

        propertiesResult[idx].reviews.push(review)
      })
      console.log(PropertySerializer)
      response.status(200).send(PropertySerializer.serialize(propertiesResult))
    })
  })
}

module.exports = {
  getProperties
}