const pool = require('../pool')
const LandlordSerializer = require("../../serializers/landlords.serializer")
const { serverError } = require('../util')

const getLandlords = (request, response) => {
  pool.query("SELECT * FROM landlords ORDER BY created_at DESC", (error, results) => {
    if (error) {
      throw error
    }

    const landlords = results.rows
    console.log(`getLandlords() returning ${results.rowCount} records`)

    pool.query("SELECT * FROM properties ORDER BY created_at DESC", (error, results) => {
      if (error) {
        throw error
      }
      const properties = results.rows
      console.log(`getProperties() returning ${results.rowCount} records`)
      let landlordsResult = landlords.map(landlord => {
        return {...landlord, properties: [], reviews: []}
      })

      properties.forEach(property => {
        const idx = landlordsResult.findIndex(ll => ll.id === property.landlord_id)
        landlordsResult[idx].properties.push(property)
      })

      pool.query("SELECT * FROM reviews ORDER BY created_at DESC", (error, results) => {
        if (error) {
          throw error
        }
        const allReviews = results.rows
        allReviews.forEach(review => {
          landlordsResult.forEach(landlord => {
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
        response.status(200).send(LandlordSerializer.serialize(landlordsResult))
      })
    })
  })
}

const getLandlordById = async (request, response) => {
  const getLandlordQueryText = "SELECT * FROM landlords WHERE id = $1"
  const getOwnedPropertiesQueryText = "SELECT * FROM properties WHERE properties.landlord_id = $1"
  
  const id = request.params.id

  try {
    const start = Date.now()
    const landlordResponse = await pool.query(getLandlordQueryText, [id])
    const duration = Date.now() - start
    console.log('executed query', { getLandlordQueryText, duration, rows: landlordResponse.rowCount })
    const rawLandlord = landlordResponse.rows[0]

    const ownedPropertiesResponse = await pool.query(getOwnedPropertiesQueryText, [id])
    const rawProperties = ownedPropertiesResponse.rows

    rawLandlord.properties = rawProperties

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
    response.status(500).send(LandlordSerializer.serialize(serverError))
  }
}

module.exports = {
  getLandlords,
  getLandlordById,
  createLandlord,
  deleteLandlord
}

// From Rails' ActiveRecord ORM on POST
// INSERT INTO "landlords" ("name", "created_at", "updated_at", "image_url") VALUES ($1, $2, $3, $4) RETURNING "id"  [["name", "Howdy Doody"], ["created_at", "2021-04-09 01:10:50.580297"], ["updated_at", "2021-04-09 01:10:50.580297"], ["image_url", "https://images.unsplash.com/photo-1617120279904-e0216ef0e0b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxODE1Mjh8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MTc5MzA2NTA&ixlib=rb-1.2.1&q=80&w=1080&utm_source=rate_your_landlord&utm_medium=referral&utm_campaign=api-credit"]]