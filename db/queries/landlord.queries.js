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
        return {...landlord, properties: []}
      })

      properties.forEach(property => {
        const idx = landlordsResult.findIndex(ll => ll.id === property.landlord_id)
        landlordsResult[idx].properties.push(property)
      })
      response.status(200).send(LandlordSerializer.serialize(landlordsResult))
    })
  })
}

const getLandlordById = (request, response) => {
  const id = request.params.id
  pool.query("SELECT * FROM landlords WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error
    }
    const jsonapi = LandlordSerializer.serialize(results.rows)
    response.status(200).send(jsonapi)
  })
}

module.exports = {
  getLandlords,
  getLandlordById
}