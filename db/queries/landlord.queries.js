const pool = require('../pool')
const LandlordSerializer = require("../../serializers/landlords.serializer")

const getLandlords = (request, response) => {
  pool.query("SELECT * FROM landlords ORDER BY created_at DESC", (error, results) => {
    if (error) {
      throw error
    }
    const jsonapi = LandlordSerializer.serialize(results.rows)
    response.status(200).send(jsonapi)
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