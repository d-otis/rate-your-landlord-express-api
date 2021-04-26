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

const createProperty = async (request, response) => {
  const { address, image_url, landlord_id } = request.body
  const createdAt = new Date(), updatedAt = createdAt

  const createPropertyQueryText = `INSERT INTO properties(address, image_url, landlord_id, created_at, updated_at)
                                  VALUES($1, $2, $3, $4, $5)
                                  RETURNING id, address, image_url, created_at, updated_at, rating, landlord_id`

    try {
      const propertyResponse = await pool.query(createPropertyQueryText, [address, image_url, landlord_id, createdAt, updatedAt])
      const createdProperty = propertyResponse.rows[0]

      response.status(200).send(PropertySerializer.serialize(createdProperty))
    } catch (error) {
      response.status(200).send(error)
    }
}

const updateProperty = async (request, response) => {
  const { id } = request.params
  const { address, imageUrl } = request.body
  const updatedAt = new Date()

  const updatePropertyQueryText = `UPDATE properties
                                  SET address = $1, image_url = $2, updated_at = $3
                                  WHERE id = $4
                                  RETURNING id, address, image_url, rating, created_at, updated_at, landlord_id`
  // 
  const getOwnedReviewsQueryText = `SELECT * FROM reviews WHERE reviews.property_id = $1`
  try {
    const updatedPropertyResponse = await pool.query(updatePropertyQueryText, [address, imageUrl, updatedAt, id])
    const updatedProperty = updatedPropertyResponse.rows[0]

    const ownedReviewsResponse = await pool.query(getOwnedReviewsQueryText, [id])
    const ownedReviews = ownedReviewsResponse.rows

    updatedProperty.reviews = ownedReviews

    response.status(200).send(PropertySerializer.serialize(updatedProperty))
  } catch (error) {
    response.status(500).send(serverError)
  }    
}

module.exports = {
  getProperties,
  createProperty,
  updateProperty
}