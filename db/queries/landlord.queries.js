const pool = require('../pool')
const LandlordSerializer = require("../../serializers/landlords.serializer")
const { serverError } = require('../util')
const { queryAllReviews, findReviewsBy } = require('./reviews.queries')
const { queryAllProperties, findPropertiesBy } = require('./property.queries')

const getLandlords = async (request, response) => {
  const landlordsQueryText = "SELECT * FROM landlords ORDER BY created_at DESC"

  try {
    // GET LANDLORDS
    const landlordsResponse = await pool.query(landlordsQueryText)
    const landlords = landlordsResponse.rows.map(landlord => ({ ...landlord, properties: [], reviews: [] }))

    // GET PROPERTIES
    const properties = await queryAllProperties()

    // ATTACH OWNED PROPERTIES TO RESPECTIVE LANDLORDS
    properties.forEach(property => {
      const idx = landlords.findIndex(ll => ll.id === property.landlord_id)
      landlords[idx].properties.push(property)
    })

    // GET REVIEWS
    const reviews = await queryAllReviews()

    // PUSH THE OWNED REVIEWS ONTO RESPECTIVE PROPERTIES
    reviews.forEach(review => {
      landlords.forEach(landlord => {
        for (const prop in landlord) {
          if (prop === "properties") {
            for (let property of landlord[prop]) {
              if (property.id === review.property_id) {
                landlord.reviews.push(review)
              }
            }
          }
        }
      })
    })

    response.status(200).send(LandlordSerializer.serialize(landlords))
  } catch (error) {
    console.log(error)
    response.status(500).send(serverError)
  }
}

const getLandlordById = async (request, response) => {
  const getLandlordQueryText = "SELECT * FROM landlords WHERE id = $1"
  
  const id = request.params.id

  try {
    const start = Date.now()
    const landlordResponse = await pool.query(getLandlordQueryText, [id])
    const duration = Date.now() - start
    console.log('executed query', { getLandlordQueryText, duration, rows: landlordResponse.rowCount })
    const rawLandlord = landlordResponse.rows[0]

    const properties = await findPropertiesBy({landlordId: id})
    const reviews = await findReviewsBy({ type: "landlord", id })

    rawLandlord.properties = properties
    rawLandlord.reviews = reviews

    response.status(200).send(LandlordSerializer.serialize(rawLandlord))

  } catch (error) {
    console.log(error)
    response.status(500).send(serverError)
  }
}

const createLandlord = async (request, response) => {
  const { name, image_url } = request.body
  const createdAt = new Date()
  const updatedAt = createdAt

  const createLandlordQueryText = `INSERT INTO landlords(name, image_url, created_at, updated_at) 
                                  VALUES($1, $2, $3, $4) 
                                  RETURNING id, name, image_url, created_at, updated_at, rating`

  try {
    const landlordResponse = await pool.query(createLandlordQueryText, [name, image_url, createdAt, updatedAt])
    const rawLandlord = landlordResponse.rows[0]
    response.status(200).send(LandlordSerializer.serialize(rawLandlord))
  } catch (error) {
    console.log(error)
    response.status(500).send(serverError)
  }
}

const updateLandlord = async (request, response) => {
  const { id } = request.params
  const { name, image_url } = request.body
  const updatedAt = new Date()

  console.log({id, name, image_url, updatedAt})

  const updateLandlordQueryText = `UPDATE landlords
                                  SET name = $1, image_url = $2, updated_at = $3
                                  WHERE id = $4
                                  RETURNING id, name, image_url, created_at, updated_at, rating`

  const getOwnedPropertiesQueryText = "SELECT * FROM properties WHERE properties.landlord_id = $1"

  try {
    const updatedLandlordResponse = await pool.query(updateLandlordQueryText, [name, image_url, updatedAt, id])
    const updatedLandlord = updatedLandlordResponse.rows[0]

    const ownedPropertiesResponse = await pool.query(getOwnedPropertiesQueryText, [id])
    const rawProperties = ownedPropertiesResponse.rows

    updatedLandlord.properties = rawProperties

    response.status(200).send(LandlordSerializer.serialize(updatedLandlord))
  } catch (error) {
    response.status(500).send(serverError)
  }
}

const deleteLandlord = async (request, response) => {
  const { id } = request.params

  const deleteLandlordQueryText = "DELETE FROM landlords WHERE id = $1 RETURNING *"
  const deletePropertiesQueryText = "DELETE FROM properties WHERE landlord_id = $1 RETURNING *"
  const deleteReviewsQueryText = "DELETE FROM reviews WHERE property_id = ANY($1::uuid[]) RETURNING *"

  try {
    // DELETE LANDLORDS
    const landlordsResponse = await pool.query(deleteLandlordQueryText, [id])
    const deletedLandlord = landlordsResponse.rows[0]

    // ADD NECESSARY reviews/properties array
    deletedLandlord.reviews = []
    deletedLandlord.properties = []

    // DELETE PROPERTIES
    const propertiesResponse = await pool.query(deletePropertiesQueryText, [id])
    const deletedProperties = propertiesResponse.rows
    deletedLandlord.properties.push(...deletedProperties)
    const propertiesUuids = deletedProperties.map(p => p.id)

    // DELETE REVIEWS
    const reviewsResponse = await pool.query(deleteReviewsQueryText, [propertiesUuids])
    const deletedReviews = reviewsResponse.rows
    deletedLandlord.reviews.push(...deletedReviews)

    response.status(500).send(LandlordSerializer.serialize(deletedLandlord))

  } catch (error) {
    console.log(error)
    response.status(500).send(serverError)
  }
}

module.exports = {
  getLandlords,
  getLandlordById,
  createLandlord,
  updateLandlord,
  deleteLandlord
}

// From Rails' ActiveRecord ORM on POST
// INSERT INTO "landlords" ("name", "created_at", "updated_at", "image_url") VALUES ($1, $2, $3, $4) RETURNING "id"  [["name", "Howdy Doody"], ["created_at", "2021-04-09 01:10:50.580297"], ["updated_at", "2021-04-09 01:10:50.580297"], ["image_url", "https://images.unsplash.com/photo-1617120279904-e0216ef0e0b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxODE1Mjh8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MTc5MzA2NTA&ixlib=rb-1.2.1&q=80&w=1080&utm_source=rate_your_landlord&utm_medium=referral&utm_campaign=api-credit"]]