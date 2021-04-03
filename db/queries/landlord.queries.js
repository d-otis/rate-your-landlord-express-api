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

module.exports = {
  getLandlords,
  getLandlordById
}