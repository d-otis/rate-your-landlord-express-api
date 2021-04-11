const pool = require('../pool')
const PropertySerializer = require('../../serializers/properties.serializer')
const { serverError } = require('../util')

const getProperties = async (request, response) => {
  const propertiesQueryText = "SELECT * FROM properties ORDER BY created_at DESC"
  const reviewsQueryText = "SELECT * FROM reviews ORDER BY created_at DESC"

  try {
    // 1. Query Properties:
    const propertiesResponse = await pool.query(propertiesQueryText)
    let rawProperties = propertiesResponse.rows
    console.log(`getProperties() started: returning ${propertiesResponse.rowCount} rows`)

    rawProperties = [...rawProperties.map(property => ({ ...property, reviews: [] })) ]

    // 1. Query Reviews:
    const reviewsResponse = await pool.query(reviewsQueryText)
    let rawReviews = reviewsResponse.rows
    console.log(`reviews returned ${reviewsResponse.rowCount} records`)

    rawReviews.forEach(review => {
      const idx = rawProperties.findIndex(property => property.id === review.property_id)
      rawProperties[idx].reviews.push(review)
    })

    response.status(200).send(PropertySerializer.serialize(rawProperties))
    
  } catch (error) {
    console.log(error)
    response.status(500).send(serverError)
  }
}

module.exports = {
  getProperties
}