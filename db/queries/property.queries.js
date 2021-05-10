const pool = require('../pool')
const PropertySerializer = require('../../serializers/properties.serializer')
const { serverError } = require('../util')
const { queryAllReviews, findReviewsBy } = require('./reviews.queries')

const queryAllProperties = async () => {
  const propertiesQueryObj = {
    text: "SELECT * FROM properties ORDER BY created_at DESC"
  }

  const { rows: propertyRows } = await pool.query(propertiesQueryObj)

  return propertyRows
}

const findPropertiesBy = async (config) => {
  const { id } = config

  switch (config.type) {
    case "landlord": {
      const getOwnedPropertiesQueryText = "SELECT * FROM properties WHERE properties.landlord_id = $1"
      const { rows } = await pool.query(getOwnedPropertiesQueryText, [id])
      return rows
    }
    default:
      break;
  }
}

const getProperties = async (request, response) => {
  try {
    const propertyRows = await queryAllProperties()    

    propertyRows.forEach(property => property.reviews = [])

    const reviewRows = await queryAllReviews()

    reviewRows.forEach(review => {
      const idx = propertyRows.findIndex(property => property.id === review.property_id)
      propertyRows[idx].reviews.push(review)
    })

    response.status(200).send(PropertySerializer.serialize(propertyRows))
    
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
  try {
    const updatedPropertyResponse = await pool.query(updatePropertyQueryText, [address, imageUrl, updatedAt, id])
    const updatedProperty = updatedPropertyResponse.rows[0]

    const ownedReviews = await findReviewsBy({ type: "property", id })

    updatedProperty.reviews = ownedReviews

    response.status(200).send(PropertySerializer.serialize(updatedProperty))
  } catch (error) {
    console.log(error)
    response.status(500).send(serverError)
  }    
}

const deleteProperty = async (request, response) => {
  const { id } = request.params

  const deletePropertyQueryText = `DELETE FROM properties WHERE id = $1 RETURNING *`
  const deleteReviewsQueryText = `DELETE FROM reviews WHERE property_id = $1 RETURNING *`

  try {
    const propertyResponse = await pool.query(deletePropertyQueryText, [id])
    const deletedProperty = propertyResponse.rows[0] 

    const reviewsResponse = await pool.query(deleteReviewsQueryText, [id])
    deletedProperty.reviews = reviewsResponse.rows

    response.status(200).send(PropertySerializer.serialize(deletedProperty))
  } catch (error) {
    response.status(500).send(error)
  }
}

module.exports = {
  queryAllProperties,
  findPropertiesBy,
  getProperties,
  createProperty,
  updateProperty,
  deleteProperty
}