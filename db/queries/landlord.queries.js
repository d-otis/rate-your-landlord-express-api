const pool = require('../pool')
const LandlordSerializer = require("../../serializers/landlords.serializer")

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

const getLandlordById = (request, response) => {
  const id = request.params.id
  pool.query("SELECT * FROM landlords WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error
    }
    const landlord = results.rows[0]

    pool.query("SELECT * FROM properties WHERE properties.landlord_id = $1", [id], (err, res) => {
      if (err) {
        throw err
      }
      landlord.properties = res.rows
      response.status(200).send(LandlordSerializer.serialize(landlord))
    })
  })
}

const createLandlord = (request, response) => {
  const { name, image_url } = request.body
  const createdAt = new Date()
  const updatedAt = createdAt

  pool.query("INSERT INTO landlords(name, image_url, created_at, updated_at) VALUES($1, $2, $3, $4) RETURNING *", [name, image_url, createdAt, updatedAt], (error, result) => {
    if (error) {
      response.send(error)
    }
    response.send(result.rows[0])
  })
  
}

module.exports = {
  getLandlords,
  getLandlordById,
  createLandlord
}

// From Rails' ActiveRecord ORM on POST
// INSERT INTO "landlords" ("name", "created_at", "updated_at", "image_url") VALUES ($1, $2, $3, $4) RETURNING "id"  [["name", "Howdy Doody"], ["created_at", "2021-04-09 01:10:50.580297"], ["updated_at", "2021-04-09 01:10:50.580297"], ["image_url", "https://images.unsplash.com/photo-1617120279904-e0216ef0e0b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxODE1Mjh8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MTc5MzA2NTA&ixlib=rb-1.2.1&q=80&w=1080&utm_source=rate_your_landlord&utm_medium=referral&utm_campaign=api-credit"]]